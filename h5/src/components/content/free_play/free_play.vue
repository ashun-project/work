<template>
    <div class="freePlay">
        <my-header title="免费试玩" bkUrl="/home"></my-header>
        <div class="form-box">
            <div class="box-hd">请设置你的试玩密码</div>
            <div class="box-bd">
                <input type="hidden" maxlength="12" v-model="userCode">
                <mt-field label="试玩账号" placeholder="请输入测试账号" v-model="userCode"></mt-field>
                <mt-field label="密码" type="password" :attr="{ maxlength: 14,minlength:6 }" placeholder="6-14位字符或数字" v-model="password"></mt-field>
                <mt-field label="验证码" placeholder="请输入验证码" v-model="checkCode">
                    <a href="#" class="radius-8 yzm " @click.stop.prevent="timeInter = new Date().getTime()">
                        <img :src="'/api/v2/user/captcha.jpg?d='+ timeInter" height="28" />
                    </a>
                </mt-field>
                <div class="xy">
                    <mt-checklist v-model="protocol" :options="[{value:'1',label:' '}]"> </mt-checklist>
                    <div class="txt"> 我已经满合法博彩年龄，且同意开户各
                        <router-link to="/agreement"> “开户协议”</router-link>项条约</div>
                </div>
                <a @click="doReg" class="ui-btn-block">开始试玩</a>

                <div class="bz">
                    <h4 class="t-red">备注:</h4>
                    <p class="txt">
                        1.每个试玩账号初始金额为{{freePlayMondy}}RMB，不允许充值。<br /> 2.每个IP每天仅允许有限个数试玩账号。
                        <br /> 3.每个试玩账号从注册开始，有效时间为72小时，超过时间系统自动收回。
                        <br /> 4.试玩账号仅供玩家熟悉游戏，不允许充值提款。
                        <br /> 5.试玩账号不享有参加优惠活动的权利。
                        <br /> 6.试玩账号的赔率仅供参考，可能与正式账号赔率不相符。
                        <br />
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
export default {
    data () {
        return {
            userCode: "",
            password: "",
            //试玩账号
            userType: "09",
            timeInter: new Date().getTime(),
            checkCode: "",
            protocol: ['1'],
            freePlayMondy: 0

        }
    },
    methods: {
        doReg () {
            if (this.userCode == null || this.userCode.length <= 0) {
                this.$Message("用户名不能为空");
                return;
            }
            if (this.password == null || this.password.length <= 0) {
                this.$Message("密码不能为空");
                return;
            }
            if (this.password.length < 6) {
                this.$Message("请输入6-12位字母,数字或者下划线组合");
                return;
            }
            if (this.checkCode == null || this.checkCode.length <= 0) {
                this.$Message("验证码不能为空");
                return;
            }
            if (!this.protocol.length) {
                this.$Message("请阅读开户协议，并确认。");
                return;
            }

            var passwordMd5 = encryption.encrypt.md5(this.password);

            this.$http.post('/api/v2/user/register', { userCode: this.userCode, password: passwordMd5, userType: this.userType, checkCode: this.checkCode }).then(response => {
                if (response.data.code !== 0) return;
                console.log(response.data)
                localStorage.setItem('user', JSON.stringify(response.data.data));
                this.$store.commit('getUser', response.data.data);
                this.$router.push('/personalCenter');
            })
        }
    },
    created () {
        this.$http.post('/api/v2/user/getPlayAccount', {}, { noEncrypt: true }).then(response => {
            if (response.data.code !== 0) return;
            this.userCode = response.data.data.playAccount
        })

        this.$systemConfig().then((systemConfig) => {
            this.freePlayMondy = systemConfig['TEST_PLAY_MONEY']
        })
    }
}
</script>
<style scoped>
.freePlay img {
    width: 73px;
}
.freePlay .radius-8 {
    border-radius: 8px;
}
.freePlay .bz {
    margin-top: 30px;
}
.freePlay .xy {
    font-size: 0.6rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #666;
    margin-bottom: 14px;
}
.freePlay .xy >>> .mint-cell-wrapper {
    padding: 0;
}
.freePlay .xy >>> .mint-checklist-label {
    padding: 0;
}
.freePlay .xy >>> .mint-cell {
    min-height: 20px;
    height: 20px;
}
.freePlay .xy >>> .mint-checklist-title {
    display: none;
}
</style>
