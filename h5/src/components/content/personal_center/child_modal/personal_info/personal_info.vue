<template>
    <div class="mysetting move-transition" id="personalInfo">
        <my-header title="个人信息" bkUrl="/personalCenter">
        </my-header>
        <section class="aui-content">
            <div v-if="user.userType!='09'">
                <dl class="" @click="gopage('/bankList')">
                    <dt class="">
                        <i class="icon-bank"></i>
                        <span class="txt">我的银行卡</span>
                    </dt>
                </dl>
                <dl class="" @click="gopage('/resetLoginPwd')">
                    <dt class="">
                        <i class="icon-pwd"></i>
                        <span class="txt">登录密码</span>
                    </dt>
                </dl>
                <dl class="" @click="goPayPwdPage">
                    <dt class="">
                        <i class="icon-pwd1"></i>
                        <span class="txt">资金密码</span>
                        <span class="rf t-grey-999" v-text="payPwdFlag=='1' ? '已设置' : '未设置'">
                        </span>
                    </dt>
                </dl>
                <dl @click="gopage('/setRealName')" v-if="user.realName">
                    <dt>
                        <i class="icon-pwd2"></i>
                        <span class="txt">真实姓名</span>
                        <span class="rf t-grey-999">修改</span>
                    </dt>
                </dl>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data () {
        return {
            payPwdFlag: null
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        gopage (url) {
            this.$router.push(url);
        },
        goPayPwdPage () {
            if (this.payPwdFlag == '1') {
                this.$router.push('/resetPayPwd');
            } else {
                this.$router.push('/setPayPwd');
            }
        }
    },
    created () {
        if (this.user.userType !== '09') {
            //不从缓存中取值
            this.$http.post('/api/v2/user/getUserPayPwd', '', { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.payPwdFlag = response.data.data.payPwdFlag;
            })
        }
    },
    mounted () {
        this.$set($('#personalInfo'))
    }
}
</script>

<style scoped lang="less">
@rem: 50rem;
.mysetting dl {
    padding: 0.6rem 0.6rem;
    border-bottom: 1px solid #eee;
    position: relative;
    color: #000;
}
.mysetting dt {
    font-size: 0.8rem;
}
.mysetting dl::before {
    content: '';
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    top: 50%;
    right: 0.75rem;
    margin-top: -0.2rem;
    background: transparent;
    border: 1px solid #dddddd;
    border-top: none;
    border-right: none;
    z-index: 2;
    -webkit-border-radius: 0;
    border-radius: 0;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
}
.mysetting dl i {
    display: inline-block;
    vertical-align: middle;
    width: 46 / @rem;
    height: 46 / @rem;
    background-size: 46 / @rem 46 / @rem;
    margin-right: 10 / @rem;
}
.mysetting dl .txt {
    display: inline-block;
    vertical-align: text-top;
}
.mysetting dl .icon-bank {
    background-image: url(../../../../../resource/images/per-bank.png);
}
.mysetting dl .icon-pwd {
    background-image: url(../../../../../resource/images/per-pwd.png);
}
.mysetting dl .icon-pwd1 {
    background-image: url(../../../../../resource/images/per-zjpwd.png);
}
.mysetting dl .icon-pwd2 {
    background-image: url(../../../../../resource/images/changename.png);
}
.mysetting dl dt .rf {
    margin-right: 1rem;
    font-size: 0.66rem;
    margin-top: 0.26rem;
}
.t-grey-999 {
    color: #999;
}
</style>