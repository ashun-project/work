<template>
    <div id="loginPageDiv">
        <my-header title="登录">
            <div slot="h-left">
                <span @click="turnLast()">
                    <i class="iconfont icon-arrowLeft" style="color: #fff; font-size:26px"></i>
                </span>
            </div>
        </my-header>
        <div class="login">
            <div class="tg-loag">
                <img src="/configstatic/h5/images/logo.png" alt="">
                <div class="clr"></div>
            </div>
            <ul>
                <li><input v-model="userCode" class="login-icon1" @input="changeInput($event,'userCode')" placeholder="请输入用户名" type="text" /> </li>
                <li><input v-model="password" class="login-icon2" @input="changeInput($event,'password')" ref="pwd" placeholder="请输入密码" type="password" />
                    <i class="eye" @click="showPwd('pwd','isOpen')" :class='{"open-eye" : isOpen}'></i>
                </li>
                <li class="relative">
                    <input style="display: inherit;" class="login-icon3" @input="changeInput($event,'checkCode')" @focus="changeInter()" placeholder="请输入验证码" type="text" v-model="checkCode" />
                    <div class="absolute" style="top:7px;right: 10px;">
                        <a href="#" class="radius-8 absolute yzm " @click.stop.prevent="timeInter = new Date().getTime()">
                            <img :src="'/api/v2/user/captcha.jpg?d='+ timeInter" height="28" />
                        </a>
                    </div>
                </li>
            </ul>
            <div>
                <a v-on:click="doLogin" class="login-btn" :class="{'box-shadow-red':btnDisable }">登 录</a>
            </div>
            <dl class="other-opear">
                <dt class="aui-pull-left">
                    <a class="t-grey-666" @click="fastReg">快速注册</a> |
                    <a @click="freePlay" class="t-grey-666">免费试玩</a>
                </dt>
                <dd class="aui-pull-right">
                    <a :href="onLineServicer.url" target="_blank" class="t-grey-666">忘记密码？(
                        <span class="link">联系客服</span>)</a>
                </dd>
                <div class="clear"></div>
            </dl>
        </div>
    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
export default {
    name: "lotery",
    data () {
        return {
            timeInter: new Date().getTime(),
            computeTime: 0,
            userCode: "",
            password: "",
            checkCode: "",
            isOpen: false,
            btnDisable: false
        }
    },
    computed: {
        onLineServicer () {
            return this.$store.state.onLineServicer;
        },
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        changeInput (e, key) {
            let val = (key === 'userCode' ? this.password && this.checkCode : key === 'password' ? this.userCode && this.checkCode : this.password && this.userCode)
            this.btnDisable = val && e.target.value
        },
        changeInter () {
            if (this.computeTime === 0) {
                this.timeInter = new Date().getTime();
                this.computeTime += 1;
            }
        },
        turnLast () {
            this.$goBack(this);
        },
        showPwd (dom, open) {
            this[open] = this[open] === true ? false : true;
            let type = this.$refs[dom].type;
            this.$refs[dom].type = type === "text" ? "password" : "text";
        },
        doLogin () {
            if (!this.userCode) {
                this.$Modal.alert("帐号不能为空");
                return;
            }
            if (!this.password) {
                this.$Modal.alert("密码不能为空");
                return;
            }
            if (!this.checkCode) {
                this.$Modal.alert("验证码不能为空");
                return;
            }

            if (this.user.userCode) {
                this.$Modal.confirm('当前已登录，是否切换账号', '温馨提示').then(() => {
                    this.$http.post('/api/v2/user/loginOut', '', { userId: true }).then(response => {
                        if (response.data.code !== 0) return;
                        localStorage.setItem('user', '');
                        this.$store.commit('getUser', {});
                        this.loginFetch();
                    })
                }, () => { })
                return
            }
            this.loginFetch();

        },
        loginFetch () {
            var passwordMd5 = encryption.encrypt.md5(this.password);
            this.$http.post('/api/v2/user/login', { userCode: this.userCode, password: passwordMd5, checkCode: this.checkCode }, { loading: 1 }).then(response => {
                this.timeInter = new Date().getTime();
                if (response.data.code !== 0) return;
                localStorage.setItem('user', JSON.stringify(response.data.data));
                this.$store.commit('getUser', response.data.data);
                // this.$router.push('/personalCenter');
                this.$goBack(this)
            })
        },
        fastReg () {
            this.$router.push('/register');
        },
        freePlay () {
            this.$router.push('/freePlay');
        }
    },
    created () {
    }
}
</script>
<style scoped>
.login {
    width: 85%;
    margin: 0 auto;
    font-size: 0.8rem;
    line-height: 1.5;
    font-style: normal;
}
.login li {
    position: relative;
}
.login .link {
    color: #ec0022;
}
.login .tg-loag {
    width: 50%;
    margin: 0 auto 1rem;
    padding-top: 30px;
}
.login ul li input {
    border-radius: 20px;
    padding: 10px 0;
    background-color: #fff;
    border: 1px solid #eee;
    width: 100%;
    margin-bottom: 14px;
    height: 2.1rem;
    background-image: url(../../../resource/images/login-icon1.png);
    background-size: 14px;
    background-repeat: no-repeat;
    padding: 12px 15px;
    background-position: 15px 12px;
    text-indent: 2em;
    caret-color: red; /* 光标颜色 */
}
.login .eye {
    position: absolute;
    right: 20px;
    top: 0.6rem;
    width: 1.1rem;
    height: 0.65rem;
    background: url(../../../resource/images/umgr-input.png) no-repeat;
    background-size: 1.25rem 6.25rem;
    background-position: 0 -1.7rem;
}
.login .open-eye {
    top: 0.6rem;
    width: 1.1rem;
    height: 0.8rem;
    background: url(../../../resource/images/open-eye.png) no-repeat;
    background-size: 1.1rem 0.8rem;
}
.login .login-icon2 {
    background-image: url(../../../resource/images/login-icon2.png);
}
.login .login-icon3 {
    background-image: url(../../../resource/images/login-icon3.png);
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
    font-size: 0.66rem;
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
.t-grey-666 {
    color: #666;
}
</style>
