<template>
    <div id="loginPageDiv">
        <my-header title="注册" bkUrl="/home"> </my-header>
        <div class="login">
            <div class="tg-loag">
                <img src="/configstatic/h5/images/logo.png" alt="">
                <div class="clr"></div>
            </div>
            <ul>
                <li><input v-model="regInfo.userCode" placeholder="请输入用户名" type="text" /> </li>
                <li><input ref="pwd" v-model="password" placeholder="请输入密码" type="password" />
                    <i class="eye" @click="showPwd('pwd','isOpen')" :class='{"open-eye" : isOpen}'></i>
                </li>
                <li><input ref="pwd2" v-model="password2" placeholder="请输入确认密码" type="password" />
                    <i class="eye" @click="showPwd('pwd2','isOpen2')" :class='{"open-eye" : isOpen2}'></i>
                </li>

                <!-- 新增 -->
                <li v-if="otherData.realName.show"><input v-model="regInfo.realName" :placeholder="otherData.realName.need? '请输入真实姓名（必填）' : '请输入真实姓名（选填）'" type="text" /> </li>
                <li v-if="otherData.idCard.show"><input v-model="regInfo.idCard" :placeholder="otherData.idCard.need? '请输入身份证号码（必填）' : '请输入身份证号码（选填）'" type="text" /> </li>
                <li v-if="otherData.phone.show"><input v-model="regInfo.phone" :placeholder="otherData.phone.need? '请输入手机号码（必填）' : '请输入手机号码（选填）'" type="text" /> </li>
                <li v-if="otherData.wechat.show"><input v-model="regInfo.wechat" :placeholder="otherData.wechat.need? '请输入微信号码（必填）' : '请输入微信号码（选填）'" type="text" /> </li>
                <li v-if="otherData.email.show"><input v-model="regInfo.email" :placeholder="otherData.email.need? '请输入邮箱（必填）' : '请输入邮箱（选填）'" type="text" /> </li>
                <li v-if="otherData.qq.show"><input v-model="regInfo.qq" :placeholder="otherData.qq.need? '请输入QQ号码（必填）' : '请输入QQ号码（选填）'" type="text" /> </li>
                <!-- 新增结束 -->

                <li><input style="display: inherit;" :readonly="urlExp" :class="{readonly: urlExp}" :placeholder="placeHo" @keyup="oldCode" @input="watchCode" type="text" v-model="regInfo.expandCode" /> </li>
                <li class="relative">
                    <input style="display: inherit;" placeholder="请输入验证码" type="text" v-model="regInfo.checkCode" />
                    <div class="absolute" style="top:7px;right: 10px;">
                        <a href="#" class="radius-8 absolute yzm " @click.stop.prevent="timeInter = new Date().getTime()">
                            <img :src="'/api/v2/user/captcha.jpg?d='+ timeInter" height="28" />
                        </a>
                    </div>
                </li>
                <li class="xy">
                    <mt-checklist v-model="protocol" :options="[{value:'1',label:' '}]"> </mt-checklist>
                    <div class="txt"> 我已经满合法博彩年龄，且同意开户各
                        <router-link to="/agreement"> “开户协议”</router-link>项条约</div>
                </li>
            </ul>
            <div>
                <a v-on:click="doReg" class="login-btn" :class="{'box-shadow-red': regInfo.userCode && password && regInfo.checkCode}">注 册</a>
            </div>
        </div>
    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
export default {
    data () {
        return {
            timeInter: new Date().getTime(),
            isOpen: false,
            isOpen2: false,
            regInfo: {
                userType: "00",
                userCode: "",
                password: "",
                expandCode: "",
                checkCode: "",
                realName: '',
                idCard: '',
                phone: '',
                email: '',
                qq: '',
                wechat: '',
            },
            password2: '',
            password: "",
            placeHo: '',
            urlExp: false,
            expandCodeMust: false,
            protocol: ['1'],
            otherData: {
                realName: '',
                idCard: '',
                phone: '',
                email: '',
                qq: '',
                wechat: '',
            }
        }
    },
    methods: {
        doReg () {
            let userCode = this.regInfo.userCode;
            if (userCode == null || userCode.length <= 0) {
                this.$Message("用户名不能为空");
                return;
            }
            if (userCode.length < 6 || userCode.length > 12 || !/^[a-zA-Z0-9]+$/.test(userCode)) {
                this.$Message("用户名只能是数字和字母6-12位！");
                return;
            }
            if (this.password == null || this.password.length <= 0) {
                this.$Message("密码不能为空");
                return;
            }
            if (this.password.length < 6 || this.password.length > 12) {
                this.$Message("密码应该是6-14位字符或数字！");
                return;
            }
            if (this.password != this.password2) {
                this.$Message("两个新密码输入不一致，请重新输入");
                return;
            }

            if (this.expandCodeMust && (this.regInfo.expandCode == null || this.regInfo.expandCode.length <= 0)) {
                this.$Message("邀请码不能为空");
                return;
            }
            if (this.regInfo.checkCode == null || this.regInfo.checkCode.length <= 0) {
                this.$Message("验证码不能为空");
                return;
            }
            if (this.protocol.length < 1) {
                this.$Message("请阅读开户协议，并确认。");
                return;
            }
            // 新增验证规则
            if (!this.otherRules()) return;

            this.regInfo.password = encryption.encrypt.md5(this.password);
            this.$http.post('/api/v2/user/register', this.regInfo, { loading: 1, tx: window.nativeDevice }).then(response => {

                if (response.data.code !== 0) {
                    this.timeInter = new Date().getTime();
                    return;
                }
                localStorage.setItem('user', JSON.stringify(response.data.data));
                localStorage.setItem('exp', '');
                this.$store.commit('getUser', response.data.data);
                this.$router.push('/');

            })
        },
        otherRules () {
            let vm = this;
            let obj = Object.assign({}, this.otherData);
            let result = true;
            let tipTxt = {
                realName: '请填写真实姓名',
                idCard: '请填写身份证号码',
                phone: '请填写手机号码',
                email: '请填写邮箱',
                qq: '请填写QQ号码',
                wechat: '请填写微信号码',
            }
            for (let key in obj) {
                if (!vm.regInfo[key]) {

                    if (obj[key]['show'] && obj[key]['need']) {
                        vm.$Message(tipTxt[key]);
                        result = false;
                    }
                } else {
                    let value = vm.regInfo[key];
                    switch (key) {
                        case 'realName':
                            let str = /^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/;///^[^\u0000-\u00FF]*$/;
                            if (!str.test(value) || value.length < 2 || value.length > 12) {
                                vm.$Message('姓名只能为2-12位的中文字符');
                                result = false;
                            }
                            break;
                        case 'idCard':
                            let regIdNo = /^((\d){14}|(\d){17})(\d|x|X)$/;
                            if (!regIdNo.test(value)) {
                                vm.$Message('身份证号填写有误');
                                result = false;
                            }
                            break;

                        case 'phone':
                            let regNum = /^1(\d){10}$/;
                            if (!regNum.test(value)) {
                                vm.$Message('手机号码填写有误');
                                result = false;
                            }
                            break;
                        case 'email':
                            let emailRule = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
                            if (!emailRule.test(value)) {
                                vm.$Message('邮箱号码填写有误');
                                result = false;
                            }
                            break;
                        case 'wechat':
                            let wechatNum = /^[-_a-zA-Z0-9]{5,20}$/;
                            if (!wechatNum.test(value)) {
                                vm.$Message('微信号码填写有误');
                                result = false;
                            }
                            break;
                        case 'qq':
                            let qqRule = /^(\d){5,16}$/;
                            if (!qqRule.test(value)) {
                                vm.$Message('QQ号码填写有误');
                                result = false;
                            }
                            break;
                    }
                }
                if (!result) break;

            }
            return result;
        },
        showPwd (dom, open) {
            this[open] = this[open] === true ? false : true;
            let type = this.$refs[dom].type;
            this.$refs[dom].type = type === "text" ? "password" : "text";
        },
        oldCode () {
            this.oldExpandCode = this.regInfo.expandCode;
        },
        watchCode () {
            var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
            if (reg.test(this.regInfo.expandCode)) {
                this.$Message('邀请码不能是中文！');
                this.regInfo.expandCode = this.oldExpandCode;
                return
            }
        },
        getSpreadCode () {
            let url = window.location.href;
            if (url.indexOf('?') !== -1) {
                let ql = url.split('?')[1].split('=');
                if (ql[0] === 'exp' && ql[1]) {
                    this.urlExp = true;
                    this.regInfo.expandCode = ql[1];
                    localStorage.setItem('exp', JSON.stringify({ value: ql[1], time: new Date().getTime() }))
                }
            }
            // 检测上一个判断不成立, 取缓存里面的值
            let exp = localStorage.getItem('exp')
            if (!this.urlExp && exp) {
                let obj = JSON.parse(exp);
                let time = new Date().getTime() - parseInt(obj.time);
                if (time > (2 * 24 * 60 * 60 * 1000)) {  // 如果缓存时间大于2天， 清除掉
                    localStorage.setItem('exp', '')
                } else {
                    this.urlExp = true;
                    this.regInfo.expandCode = obj.value;
                }
            }
        }
    },
    mounted () {
        this.getSpreadCode();
        this.$systemConfig().then((systemConfig) => {
            let code = systemConfig[window.nativeDevice ? 'REGISTER_NEED_EXPEND_CODE_TX' : 'REGISTER_NEED_EXPEND_CODE'];
            let obj = JSON.parse(systemConfig['REGISTER_COLUMN']);
            if (code === '1') {
                this.expandCodeMust = true
                this.placeHo = '请输入邀请码（必填）';
            } else {
                this.expandCodeMust = false
                this.placeHo = '请输入邀请码（选填）';
            }
            for (let k in obj) {
                this.$set(this.otherData, k, obj[k])
            }
        })
    }
}
</script>
<style scoped>
.login {
    width: 85%;
    margin: 0 auto 30px;
    font-size: 0.8rem;
    line-height: 1.5;
    font-style: normal;
}
.login .checkBox {
    height: auto;
}
.login .xy {
    font-size: 0.6rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #666;
    margin: 14px;
}
.login .xy >>> .mint-cell-wrapper {
    padding: 0;
}
.login .xy >>> .mint-checklist-label {
    padding: 0;
}
.login .xy >>> .mint-cell {
    min-height: 20px;
    height: 20px;
}
.login .xy >>> .mint-checklist-title {
    display: none;
}
.login .txt {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.login .tg-loag {
    width: 50%;
    margin: 0 auto 1rem;
    padding-top: 30px;
}
.login ul li {
    position: relative;
}
.login ul li input {
    border-radius: 20px;
    background-color: #fff;
    border: 1px solid #eee;
    width: 100%;
    margin-top: 14px;
    height: 2.1rem;
    /* background-image: url(../../../resource/images/login-icon1.png); */
    background-size: 14px;
    background-repeat: no-repeat;
    padding: 12px 15px;
    background-position: 15px 12px;
    /* text-indent: 2em; */
    caret-color: red; /* 光标颜色 */
}
.login ul li .readonly {
    background-color: #f2f2f2;
    color: #999;
}
/* .login .login-icon2 {
    background-image: url(../../../resource/images/login-icon2.png);
}
.login .login-icon3 {
    background-image: url(../../../resource/images/login-icon3.png);
}
.login .login-icon4 {
    background-image: url(../../../resource/images/tuijianren.png);
    background-size: 16px; 
}*/
.login .eye {
    position: absolute;
    right: 20px;
    top: 1.4rem;
    width: 1.1rem;
    height: 0.65rem;
    background: url(../../../resource/images/umgr-input.png) no-repeat;
    background-size: 1.25rem 6.25rem;
    background-position: 0 -1.7rem;
}
.login .open-eye {
    top: 1.4rem;
    width: 1.1rem;
    height: 0.8rem;
    background: url(../../../resource/images/open-eye.png) no-repeat;
    background-size: 1.1rem 0.8rem;
}
.login .login-btn {
    height: 2.1rem;
    line-height: 2.15rem;
    color: #fff;
    border-radius: 20px;
    text-align: center;
    display: block;
    font-size: 0.9rem !important;
    background: #c6c6c6;
    box-shadow: 0 0 1px #9b9a9a;
}
.login .box-shadow-red {
    box-shadow: 0 0 2px rgba(211, 67, 55, 0.8);
    background: #ec0022;
}
.login .login-btn:active {
    box-shadow: 0 0 6px #9b9a9a;
}
.login .login-btn.box-shadow-red:active {
    box-shadow: 0 0 6px rgba(211, 67, 55, 0.8);
}
.login .aui-btn {
    position: relative;
    font-weight: 400;
    font-family: inherit;
    text-decoration: none;
    margin: 0;
    background: #dddddd;
    padding: 0 0.6rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
    box-sizing: border-box;
    user-select: none;
}
.login .aui-pull-left {
    float: left !important;
}
.login .aui-pull-right {
    float: right !important;
}
input {
    outline: none;
}
.login .other-opear {
    margin-top: 8px;
    font-size: 0.7rem;
    padding: 0 0.3rem;
}
.login .relative {
    position: relative;
}
.login .relative img {
    width: 73px;
}
.login .absolute {
    position: absolute;
}

.login .yzm {
    top: 7px;
    right: 10px;
    position: relative;
}

.login .radius-8 {
    border-radius: 8px;
}
</style>
