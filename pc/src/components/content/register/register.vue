<template>
    <div class="register-page">
        <div class="container">
            <div class="cont">
                <div class="cont-title">
                    <h4>账号注册</h4>
                    <div class="">
                        <span>已有账号&nbsp;&nbsp;</span>
                        <router-link to="/login">立即登录</router-link>
                    </div>
                </div>
                <Form ref="formCustom" :model="formCustom" :rules="ruleInline">
                    <FormItem prop="userCode">
                        <Input type="text" :value="formCustom.userCode" @input="formCustom.userCode = arguments[0].replace(/\s+/g,'')" placeholder="用户名">
                        <Icon type="person" slot="prepend"></Icon>
                        </Input>
                        <p v-if='showUserCodeTip' style='height:24px;line-height:24px;position:absolute;color:#313131;'>账号: 6-12个字符,字母与数字</p>
                    </FormItem>
                    <FormItem prop="password" style='position:relative;'>
                        <Input type="password" :value="formCustom.password" @input="formCustom.password = arguments[0].replace(/\s+/g,'')" v-model="formCustom.password" placeholder="密码">
                        <Icon type="ios-locked" slot="prepend"></Icon>
                        </Input>
                        <p v-if='showPasswordTip' style='height:24px;line-height:24px;position:absolute;color:#313131;'>密码规则: 6-14个字符,字母与数字组合</p>
                    </FormItem>
                    <FormItem prop="passwdCheck">
                        <Input type="password" v-model="formCustom.passwdCheck" placeholder="确认密码">
                        <Icon type="ios-locked" slot="prepend"></Icon>
                        </Input>
                    </FormItem>

                    <!-- 新增表单 -->
                    <FormItem prop="realName" v-if="otherData.realName.show">
                        <Input type="text" v-model="formCustom.realName" :placeholder="otherData.realName.need? '请输入真实姓名（必填）' : '请输入真实姓名（选填）'">
                        <Icon type="person-add" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="idCard" v-if="otherData.idCard.show">
                        <Input type="text" v-model="formCustom.idCard" :placeholder="otherData.idCard.need? '请输入身份证号码（必填）' : '请输入身份证号码（选填）'">
                        <Icon type="card" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="phone" v-if="otherData.phone.show">
                        <Input type="text" v-model="formCustom.phone" :placeholder="otherData.phone.need? '请输入手机号码（必填）' : '请输入手机号码（选填）'">
                        <Icon type="android-phone-portrait" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="wechat" v-if="otherData.wechat.show">
                        <Input type="text" :value="formCustom.wechat" @input="formCustom.wechat=arguments[0].replace(/\s+/g,'')" :placeholder="otherData.wechat.need? '请输入微信号（必填）' : '请输入微信号（选填）'">
                        <Icon type="chatbubbles" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="email" v-if="otherData.email.show">
                        <Input type="text" v-model="formCustom.email" :placeholder="otherData.email.need? '请输入邮箱（必填）' : '请输入邮箱（选填）'">
                        <Icon type="ios-email" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="qq" v-if="otherData.qq.show">
                        <Input type="text" v-model="formCustom.qq" :placeholder="otherData.qq.need? '请输入QQ号码（必填）' : '请输入QQ号码（选填）'">
                        <Icon type="social-tux" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <!-- 新增表单结束 -->

                    <FormItem prop="expandCode" :rules="{required: parseInt(expandCodeMust) , message: '请输入邀请码', trigger: 'blur'}">
                        <Input type="text" v-model="formCustom.expandCode" :placeholder="'请输入邀请码'+ (expandCodeMust === '1' ? '（必填）' : '（选填）')" :disabled="urlExp">
                        <Icon type="android-drafts" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="checkCode" class="valida">
                        <Input type="text" v-model="formCustom.checkCode" placeholder="验证码" @on-enter="handleSubmit('formCustom')" @on-focus='refreshCheckCode()'>
                        <Icon type="social-snapchat" slot="prepend"></Icon>
                        </Input>
                        <img class="valida-code" :src='imageCode' @click='getImageCode'>
                    </FormItem>
                    <FormItem class="agree" prop="agree">
                        <Checkbox v-model="formCustom.agree"></Checkbox>
                        <span>
                            <a href="" style="color: #be1204" @click.prevent="modal1 = true">《开户协议》</a>
                        </span>
                        <agree :modal1="modal1" @back="modal1=false;"></agree>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" class="commit-register" long @click="handleSubmit('formCustom')">注册</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5';
import { ruleFn } from '@/components/common/module_js/rule.js';
import agree from '@/components/common/module_vue/agree.vue';
import { getConfigList } from '@/components/common/module_js/getConfig.js';
export default {
    components: { agree },
    data () {
        const validaName = (rule, value, callback) => { //用户名
            // let result = ruleFn.isUserName(value, callback);
            // this.showUserCodeTip = result;
            let flag = false;
            if (!value) {
                callback(new Error('请输入用户名'));
            } else if (/[^A-Za-z0-9]/g.test(value)) {
                callback(new Error('请输入数字和字母'));
            } else if (value.length < 6 || value.length > 12) {
                callback(new Error('用户名在六至十二位之间'));
            } else {
                callback();
                flag = true;
            }
            this.showUserCodeTip = flag;
        }
        const validatePass = (rule, value, callback) => { //密码
            // let result = ruleFn.isPassWord(value, this.formCustom.passwdCheck, this.$refs.formCustom.validateField, 'passwdCheck', callback);
            // this.showPasswordTip = result;
            let flag = false;
            if (!value) {
                callback(new Error('请输入密码'));
            } else if (/[^A-Za-z0-9]/g.test(value)) {
                callback(new Error('请输入数字和字母'));
            } else if (value.length < 6 || value.length > 14) {
                callback(new Error('密码在六至十四位之间'));
            } else {
                if (this.formCustom.passwdCheck) {
                    this.$refs.formCustom.validateField('passwdCheck');
                }
                callback();
                flag = true;
            }
            this.showPasswordTip = flag;
        };
        const validatePassCheck = (rule, value, callback) => { //确认密码
            // let result = ruleFn.checkPassWord(value, this.formCustom.password, callback);
            if (!value) {
                callback(new Error('请输入密码'));
            } else if (value !== this.formCustom.password) {
                callback(new Error('两次输入的密码不一致'));
            } else {
                callback();
            }
        };
        const validateAgree = (rule, value, callback) => { //同意协议
            if (!value) {
                callback(new Error('请勾选我同意'));
            } else {
                callback();
            }
        }
        const fundNumber = (rule, value, callback) => {  // 只能输入数字
            if (this.otherData.phone.need && !value) {
                callback(new Error('请输入您的手机号码'));
            } else if (value && !/^1(\d){10}$/.test(value)) {
                callback(new Error('手机号码输入有误'));
            } else {
                callback();
            }
        }
        const validRealName = (rule, value, callback) => {
            if (this.otherData.realName.need && !value) {
                callback('请输入您的姓名')
            } else if (value && !/^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/.test(value)) {
                callback('姓名输入有误');
            } else if (value && (value.length < 2 || value.length > 12)) {
                callback('姓名输入有误');
            } else {
                callback();
            }
        }
        const validIdcard = (rule, value, callback) => {
            if (this.otherData.idCard.need && !value) {
                callback(new Errrow('请输入您的身份证号码'))
            } else if (value && !/^((\d){14}|(\d){17})(\d|x|X)$/.test(value)) {
                callback(new Error('身份证号码输入有误'))
            } else {
                callback();
            }
        }
        const validEmail = (rule, value, callback) => {
            if (this.otherData.email.need && !value) {
                callback(new Error('请输入您的邮箱'))
            } else if (value && !/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(value)) {
                callback(new Error('邮箱号码输入有误'))
            } else {
                callback();
            }
        }
        const validQQ = (rule, value, callback) => {
            if (this.otherData.qq.need && !value) {
                callback(new Error('请输入您的QQ号码'));
            } else if (value && !/^\d{5,16}$/.test(value)) {
                callback(new Error('QQ号码输入有误'))
            } else {
                callback();
            }
        }
        const validWechat = (rule, value, callback) => {
            if (this.otherData.wechat.need && !value) {
                callback(new Error('请输入您的微信号'));
            } else if (value && !/^[-_a-zA-Z0-9]{5,20}$/.test(value)) {
                callback(new Error('5-20个字符,字母、数字、下划线和-'));
            } else {
                callback();
            }
        }
        return {
            showUserCodeTip: true,
            isCheckPassWord: false,
            showPasswordTip: true,
            otherData: {
                realName: '',
                idCard: '',
                phone: '',
                email: '',
                qq: '',
                wechat: ''
            },
            imageCode: '/api/v2/user/captcha.jpg',  //图形验证码
            urlExp: false,
            // timeInter: new Date().getTime(),
            formCustom: {
                userCode: '',
                password: '',
                passwdCheck: '',  // 不传给后端
                expandCode: '',
                checkCode: '',
                agree: true,
                userType: '00',   // 判断是不是试玩
                realName: '',
                phone: '',
                idCard: '',
                email: '',
                qq: '',
                wechat: ''
            },
            modal1: false,
            expandCodeMust: false,
            ruleInline: {
                userCode: [
                    { validator: validaName, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                passwdCheck: [
                    { validator: validatePassCheck, trigger: 'blur' }
                ],
                checkCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ],
                agree: [
                    { validator: validateAgree, trigger: 'change' }
                ],
                phone: [
                    { validator: fundNumber, trigger: 'blur' },
                    { min: 11, max: 11, message: '请输入11位数的号码', trigger: 'blur' }
                ],
                realName: [
                    { validator: validRealName, trigger: 'blur' }
                ],
                idCard: [
                    { validator: validIdcard, trigger: 'blur' }
                ],
                email: [
                    { validator: validEmail, trigger: 'blur' },
                    { type: 'email', message: '您的邮箱填写有误', trigger: 'blur' }
                ],
                qq: [
                    { validator: validQQ, trigger: 'blur' }
                ],
                wechat: [
                    { validator: validWechat, trigger: 'blur' }
                ]
            }
        }
    },
    // computed: {
    //     configList () {
    //         return this.$store.state.configList;
    //     },
    // },
    methods: {
        refreshCheckCode () {
            //获取焦点刷新验证码
            // this.isActive = 3
            if (this.hasRefreshChode) {
                return
            }
            this.getImageCode()
            this.hasRefreshChode = true
        },
        getImageCode () {
            this.imageCode = `/api/v2/user/captcha.jpg?d=${new Date().getTime()}`;
        },
        handleSubmit (name) {
            let vm = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var obj = Object.assign({}, vm[name]);
                    obj.password = encryption.encrypt.md5(obj.password);
                    obj.passwdCheck = encryption.encrypt.md5(obj.passwdCheck);
                    vm.$http.post('/api/v2/user/register', obj).then(response => {
                        if (response.data.code !== 0) {
                            vm.getImageCode();
                            return;
                        }
                        // console.log(response.data.data);
                        localStorage.setItem('user', JSON.stringify(response.data.data));
                        localStorage.setItem('exp', '');
                        vm.$store.commit('getUser', response.data.data);
                        vm.$router.push('/');
                    })
                } else {
                    vm.getImageCode();
                }
            })
        },
        getSpreadCode () {
            let url = window.location.href;
            if (url.indexOf('?') !== -1) {
                let ql = url.split('?')[1].split('=');
                if (ql[0] === 'exp' && ql[1]) {
                    this.urlExp = true;
                    this.formCustom.expandCode = ql[1];
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
                    this.formCustom.expandCode = obj.value;
                }
            }
        }
    },
    created () {
        this.getSpreadCode();
        let vm = this;
        getConfigList().then(res => { //获取配置
            for (let content of res) {
                if (content.key === 'REGISTER_NEED_EXPEND_CODE') { //非资讯包
                    vm.expandCodeMust = content.value; // "1"--必填 或 "0"--非必填
                } else if (content.key === 'REGISTER_COLUMN') {
                    let obj = JSON.parse(content.value);
                    for (var k in obj) {
                        vm.$set(vm.otherData, k, obj[k])
                    }
                }
            }
        })
        // this.$http.post('/api/v2/sysDict/querySystemConfig').then(response => { //邀请码是否必填
        //     if (response.data.code !== 0) return;
        //     let data = response.data.data;
        //     for (let content of data) {
        //         if (content.key === 'REGISTER_NEED_EXPEND_CODE') { //非资讯包
        //             vm.expandCodeMust = content.value; // "1"--必填 或 "0"--非必填
        //         } else if (content.key === 'REGISTER_COLUMN') {
        //             let obj = JSON.parse(content.value);
        //             for (var k in obj) {
        //                 vm.$set(vm.otherData, k, obj[k])
        //             }
        //         }
        //     }
        // })
    }
}
</script>

<style lang="less">
.register-page {
    background: #fde4bc url(/static/images/register.png) no-repeat center bottom;
    min-height: 800px;
    padding: 120px 0;
}
.register-page .cont-title {
    border-bottom: 2px solid #f1f1f1;
    line-height: 30px;
    height: 40px;
    margin-bottom: 20px;
}
.register-page .cont-title h4 {
    float: left;
    font-size: 16px;
    color: @commit-register-color;
}
.register-page .cont-title > div {
    float: right;
}
.register-page .cont-title > div span {
    color: #8b8c8d;
}
.register-page .cont-title > div a {
    color: @commit-register-color;
}
.register-page .container {
    width: 900px;
    min-height: 560px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    padding: 10px;
    box-shadow: 0 0 13px rgba(190, 18, 4, 0.2);
}
.register-page .container .cont {
    height: 100%;
    width: 100%;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.7);
    padding: 50px 230px;
}
.register-page .cont .ivu-form-item .ivu-input {
    height: 36px;
}
.register-page .cont .ivu-input-group-prepend {
    /* width: 50%; */
    padding: 4px 10px;
    font-size: 18px;
}
.register-page .cont .valida .valida-code {
    position: absolute;
    top: 2px;
    right: 2px;
    height: 34px;
    width: auto;
    cursor: pointer;
    z-index: 2;
}
.register-page .cont .commit-register {
    height: 44px;
    font-size: 18px;
}
.register-page .cont .commit-register:hover {
    background-color: @commit-register-hover-color;
    border-color: @commit-register-hover-border-color;
}
.register-page .cont .agree .ivu-form-item-error-tip {
    padding-top: 0;
}
.register-page .agree .ivu-modal p {
    width: 100%;
}
.register-page .agree p {
    font-weight: 600;
    color: @register-agree-content-color;
    font-size: 14px;
}
.register-page .agree .content {
    color: @register-agree-content-color;
}
</style>

