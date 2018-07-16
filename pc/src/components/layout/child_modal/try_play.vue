<template>
    <modal :modalShow="isPlay" :width="735" :hasFooter="false" claName="try_play" @btn-cancel="closeModal">
        <div slot="content">
            <b @click="closeModal" class='ivu-modal-close'></b>
            <div class='lf lee-free-wrap'>
                <span class="lee-free">
                    {{$store.state.freePlayValue}}
                </span>
            </div>
            <div class='rt'>
                <div class='form'>
                    <form>
                        <div class='name'>
                            <i class='icon-user'></i>
                            <input autocomplete="off" type="text" placeholder='用户名' v-model='userName' readonly>
                        </div>
                        <div class='pwd'>
                            <i class='icon-pwd'></i>
                            <input autocomplete="off" :type="showPassWord ? 'text' : 'password' " placeholder='请输入密码' v-model="pwd" @blur="playPassWord">
                            <i class='eye' @click='showPassWord=!showPassWord' :class='[showPassWord ? "open-eye":" "]'></i>
                            <span v-html='pwdError'></span>
                        </div>
                        <div class='verify'>
                            <i class='icon-verify'></i>
                            <input autocomplete="off" type="text" placeholder='请输入验证码' @blur='playCode' @focus='refreshCheckCode()' v-model.trim='verifyCode' @keyup.enter='tryPlay'>
                            <img class="valida-code" :src='tryPlayCode' @click='changeTryPlayCode'>
                            <span v-html='codeError'></span>
                        </div>
                    </form>
                </div>
                <div class='btn-play'>
                    <Button type="primary" style='width:100%;height:44px;font-size:16px;' @click='tryPlay'>免费试玩</Button>
                </div>
            </div>
        </div>
    </modal>
</template>
<script>
import modal from '@/components/common/module_vue/modal.vue';
import encryption from '@/components/common/module_js/md5'
export default {
    components: { modal },
    props: {
        hasOpen: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            showPassWord: false,//试玩密码是否可见
            userName: '', //试玩用户名
            pwd: '',  //试玩密码
            pwdError: '', //试玩密码错误提示
            verifyCode: '', //试玩验证码
            codeError: '', //试玩验证码错误提示
            tryPlayCode: '', //试玩验证码
            isShow: false   //是否显示弹框
        }
    },
    computed: {
        isPlay: {
            get () {
                if (this.hasOpen && !this.initData) {  // 减少首页多余的请求
                    this.init();
                    this.initData = true;
                }
                return this.hasOpen;
            },
            set (newVal) {

            }
        }
    },
    methods: {
        tryPlay () { //注册试玩
            if (!this.playPassWord() || !this.playCode()) {
                return
            }
            let pwd = encryption.encrypt.md5(this.pwd);
            let obj = { userCode: this.userName, password: pwd, userType: '09', checkCode: this.verifyCode }
            this.$http.post('/api/v2/user/register', obj).then(response => {
                if (response.data.code !== 0) {
                    this.changeTryPlayCode();
                    return;
                }
                localStorage.setItem('user', JSON.stringify(response.data.data));
                this.$store.commit('getUser', response.data.data);
                ['pwd', 'verifyCode'].forEach(item => this[item] = '');
                this.$emit('closeTryModal');
                this.$router.push('/');
            })
        },
        refreshCheckCode () {
            //获取焦点刷新验证码
            if (this.hasRefreshChode) {
                return
            }
            this.changeTryPlayCode()
            this.hasRefreshChode = true
        },
        changeTryPlayCode () {
            this.tryPlayCode = '/api/v2/user/captcha.jpg?d=' + new Date().getTime();
        },
        closeModal () { //关闭Modal
            ['pwd', 'pwdError', 'verifyCode', 'codeError'].forEach(item => this[item] = '');
            this.$emit('closeTryModal');
        },
        playPassWord () { //检查密码
            this.pwd = this.pwd.replace(/\s+/g, '');
            if (!this.pwd) {
                this.pwdError = '请输入密码';
                return false
            }
            if (this.pwd.length < 6 || this.pwd.length > 14) {
                this.pwdError = '密码六至十四位';
                return false
            } else {
                this.pwdError = '';
                return true
            }
        },
        playCode () {  //检查验证码
            if (!this.verifyCode) {
                this.codeError = '请输入验证码';
                this.changeTryPlayCode();
                return false
            }
            this.codeError = '';
            return true
        },
        //切换验证码
        changeCaptcha: function () {
            this.captcha = '/api/v2/user/captcha.jpg?d=' + new Date().getTime();
        },
        init () { //初始化弹窗
            this.changeTryPlayCode();
            this.$http.post('/api/v2/user/getPlayAccount', {}, { unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.userName = response.data.data.playAccount;
            })
        }
    },
    created () {

    }
}
</script>
<style scoped>
.v-transfer-dom .try_play .ivu-modal {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -367px;
    margin-top: -186px;
    border: none;
    background: #fffde7;
}
.v-transfer-dom >>> .try_play .ivu-modal-content {
    border: none;
}
.v-transfer-dom >>> .try_play .ivu-modal-header {
    height: 0;
    padding: 0;
    border-bottom: none;
}
.v-transfer-dom >>> .try_play .ivu-modal-body {
    width: 735px;
    padding: 68px 49px 59px 26px;
    background: #fffde7;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -ms-border-radius: 4px;
    -moz-border-radius: 4px;
    -o-border-radius: 4px;
}
.v-transfer-dom .try_play .ivu-modal-body b {
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    background: url('/configstatic/pc/images/icon.png') no-repeat -522px -337px;
    right: -20px;
    top: -20px !important;
}

.v-transfer-dom >>> .try_play .ivu-modal-body .lf {
    width: 333px;
    height: 265px;
    background: url('/static/images/freeTry.png') no-repeat;
}
.v-transfer-dom >>> .try_play .ivu-modal-body .rt {
    width: 270px;
    float: right;
}
.v-transfer-dom >>> .try_play .form {
    padding: 0 10px;
    margin-bottom: 30px;
}
.v-transfer-dom >>> .try_play .form:after {
    display: block;
    content: '';
    clear: both;
    visibility: hidden;
    height: 0;
}
.v-transfer-dom >>> .try_play .ivu-modal-body > div {
    display: inline-block;
    width: 660px;
}
.v-transfer-dom >>> .try_play .ivu-modal-footer {
    height: 0;
    padding: 0;
    border-top: none;
}
.v-transfer-dom >>> .rt .name,
.v-transfer-dom >>> .rt .pwd,
.v-transfer-dom >>> .rt .verify {
    float: left;
    position: relative;
    width: 250px;
    height: 28px;
    border-bottom: 1px solid #c3c3c3;
}
.v-transfer-dom >>> .rt input,
.v-transfer-dom >>> .rt i {
    float: left;
}
.v-transfer-dom >>> .rt i {
    width: 16px;
    height: 18px;
    margin-left: 4px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -399px -348px;
}
.v-transfer-dom >>> .rt .icon-pwd {
    width: 16px;
    height: 22px;
    background-position: -429px -348px;
}
.v-transfer-dom >>> .rt .icon-verify {
    width: 16px;
    height: 20px;
    margin-top: 5px;
    background-position: -457px -348px;
}
.v-transfer-dom >>> .rt .eye {
    float: right;
    width: 18px;
    height: 14px;
    margin-top: 5px;
    cursor: pointer;
    background: url('/configstatic/pc/images/icon.png') no-repeat -487px -351px;
}
.v-transfer-dom >>> .rt .name {
    margin-bottom: 42px;
}
.v-transfer-dom >>> .rt .pwd {
    height: 30px;
    margin-bottom: 36px;
}
.v-transfer-dom >>> .rt .verify {
    height: 35px;
}
.v-transfer-dom >>> .rt input {
    height: 18px;
    margin-left: 10px;
    color: #282828;
    font-size: 12px;
    background: none;
    border: none;
}
.v-transfer-dom >>> .rt .pwd input {
    height: 22px;
}
.v-transfer-dom >>> .rt .open-eye {
    margin-top: 11px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -148px -519px;
}
.v-transfer-dom >>> .rt .verify input {
    height: 20px;
    margin-top: 5px;
}
.v-transfer-dom >>> .rt input:focus {
    border: none;
    outline: none;
    -webkit-outline: none;
    -ms-outline: none;
    -moz-outline: none;
    -o-outline: none;
}
.v-transfer-dom >>> .rt .verify img {
    position: absolute;
    right: 0;
    top: 0;
    width: 85px;
    height: 28px;
    cursor: pointer;
}
.v-transfer-dom >>> .rt .pwd span,
.v-transfer-dom >>> .rt .verify span {
    position: absolute;
    top: 100%;
    left: 0;
    padding-top: 6px;
    color: #ed3f14;
    font-size: 12px;
}
.v-transfer-dom >>> .rt .btn-play {
    width: 100%;
    height: 44px;
}
.lee-free-wrap {
    position: relative;
}
.lee-free {
    position: absolute;
    top: 88px;
    width: 100%;
    color: #f4f9f4;
    font-size: 24px !important;
    text-align: center;
}
</style>



