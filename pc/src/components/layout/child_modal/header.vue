<template>
    <div>
        <div class="notice">
            <div class="content">
                <div class="txt">
                    <span class="txt-icon">
                        <i class="i-icon i-notice"></i>
                    </span>&nbsp;
                    <div v-if="notice">
                        <marquee scrolldelay=100 scrollAmount=6>
                            <span class="notice-cont" v-html="notice" @click="$router.push({path:'/newsList/announce'})"></span>
                        </marquee>
                    </div>

                </div>
                <ul>
                    <li v-if="userInfo.userCode">
                        <router-link to="/personalCenter/account">会员中心</router-link>
                    </li>
                    <li>
                        <a @click.stop="freePlay">免费试玩</a>
                    </li>
                    <li>
                        <a @click="addCollection">加入收藏</a>
                    </li>
                    <li>
                        <router-link to="/helpCenter/register">帮助中心 </router-link>
                    </li>
                    <li>
                        <router-link to="/role/3">游戏玩法 </router-link>
                    </li>
                    <li v-if="serverUrl">
                        <a :href="serverUrl.url" target="_blank">在线客服</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="head-info">
            <div class="content">
                <div class="logo">
                    <router-link to="/"><img src="/configstatic/pc/images/logo.gif"></router-link>
                </div>
                <div class="logo-side"></div>
                <div class="account-info" v-if="(!userInfo.userCode)&&($route.name!='login')" id="loginInfo">
                    <div class="input-wrapper user-name input-line">
                        <!-- <Icon type="ios-person-outline" size="24"></Icon>
                        <input type="text" v-model="userCode" placeholder="用户名" @focus='isActive=1' @blur='isActive=null' :class="[isActive === 1 ? 'active' : '']"> -->
                        <Input type="text" v-model="userCode" size="large" icon="ios-person-outline" placeholder="用户名"></Input>
                    </div>
                    <div class="input-wrapper pass-word input-line">
                        <!-- <Icon type="ios-locked-outline" size="20"></Icon> -->
                        <!-- <input type="password" v-model="password" placeholder="密码" @focus='isActive=2' @blur='isActive=null' :class="[isActive === 2 ? 'active' : '']"> -->
                        <Input type="password" v-model="password" size="large" icon="ios-locked-outline" placeholder="密码"></Input>
                    </div>
                    <div class="input-wrapper input-line validate">
                        <Input type="text" v-model="checkCode" size="large" placeholder="验证码" @on-enter="doLogin()" @on-focus='refreshCheckCode()'></Input>
                        <img :src="captcha" @click="changeCaptcha()" style='cursor:pointer'>
                        <!-- <input type="text" v-model="checkCode" placeholder="验证码" @keyup.enter="doLogin()" @focus='refreshCheckCode' @blur='isActive=null' :class="[isActive === 3 ? 'active' : '']"> -->
                    </div>
                    <div class="input-wrapper input-line userlogo">
                        <!-- <a class="btn login" @click="doLogin()">用户登录</a> -->
                        <Button type="primary" size="large" @click="doLogin()">用户登录</Button>
                    </div>
                    <div class="input-wrapper input-line userregister">
                        <!-- <router-link to="/register" class="btn register">免费注册</router-link> -->
                        <Button type="warning" size="large" @click="goRegister()">免费注册</Button>
                    </div>
                </div>
                <div class="logined" v-if="!!userInfo.userCode">
                    <ul>
                        <li class="account">
                            <div class="account-logo" @mouseenter="showPopup = true" @mouseleave="showPopup = false">
                                <template v-if="userInfo&&userInfo.imgUrl">
                                    <img :src='userInfo&&userInfo.imgUrl' class="img" style="height:100%;" @click="$router.push('/personalCenter/account')">
                                </template>
                                <template v-else-if="userInfo&&!userInfo.imgUrl">
                                    <img src="/static/images/account.png" style="height:100%;" @click="$router.push('/personalCenter/account')">
                                </template>
                                <div class="account-popup" v-show="showPopup">
                                    <p>
                                        <router-link :to="'/personalCenter/account'">会员中心</router-link>
                                    </p>
                                    <p>
                                        <router-link :to="'/personalCenter/trade'">交易明细</router-link>
                                    </p>
                                    <p>
                                        <router-link :to="'/personalCenter/record'">投注记录</router-link>
                                    </p>
                                </div>
                            </div>
                            <div class="account-detail">
                                <p>
                                    <span class="lab">账号&nbsp;:</span>
                                    <span class="font-red user-name">{{userInfo.userCode}}&nbsp;&nbsp;</span><img :src="userInfo.userLevelIcon">
                                </p>
                                <p class='balance'>
                                    <span class="lab">余额&nbsp;:&nbsp;</span>
                                    <span class="font-red">{{Number(userInfo.balance).toFixed(2)}}</span>
                                    <span class='refresh' @mouseenter="showPopup = false" @mouseleave="showPopup = false" @click='refreshBalance()' :class="{'turn-round':turnRound}"></span>
                                </p>
                            </div>
                        </li>
                        <li class="ordinary deposit" v-if="userInfo.userType !== '09' && userInfo.userType !=='08'">
                            <!-- <button type='primary' class='ivu-btn ivu-btn-primary' @click="$router.push({path:'/personalCenter/recharge'})">
                                <i></i>
                                <span>存款</span>
                            </button> -->
                            <Button type="default" @click="$router.push({path:'/personalCenter/recharge'})">
                                <i></i>存款</Button>
                        </li>
                        <li class="ordinary withdrawal" v-if="userInfo.userType !== '09' && userInfo.userType !=='08'">
                            <!-- <button type='primary' class='ivu-btn ivu-btn-primary' @click="$router.push({path:'/personalCenter/withdraw'})">
                                <i></i>
                                <span>提现</span>
                            </button> -->
                            <Button type="default" @click="$router.push({path:'/personalCenter/withdraw'})">
                                <i></i>提现</Button>
                        </li>
                        <li class="login-out" @click="signOut()">
                            <Button type='primary' icon='power' style='width:97px;height:38px;line-height:38px;padding:0'>退出登录</Button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="head-menu">
            <div class="content">
                <!-- @mouseover="showAsideMenu = true" @mouseleave="showAsideMenu = false " -->
                <div class="lottery-title" @mouseover="showAsideMenu" @mouseleave="hideAsideMenu">
                    <span>
                        <i class="i-icon i-three"></i>&nbsp;</span>
                    <span>热门彩种</span>
                    <!-- :data="lotteryHotList" -->
                    <lottery v-show="currentMenu === '/home' || hasAsideMenu"></lottery>
                </div>
                <ul>
                    <li v-for="(item, idx) in menu" :key="idx" :style="{width: 100 / menu.length + '%'}" :class="{active: currentMenu === item.url}">
                        <router-link :to="item.url" :target='idx===1? "_blank" : "" '>{{item.label}}</router-link>
                    </li>
                </ul>
            </div>

        </div>
        <!-- 试玩弹窗 -->
        <modal :hasOpen="play" @closeTryModal="play = false"></modal>
        <!-- 试玩弹框结束 -->
        <confirm-free :modalShow='confirmDialog' title="温馨提示" @btn-ok="handConfirm" :maskClosable="true" @btn-cancel="handForClear">
            <div slot="content">
                <p class="confirm-free-modal-p">当前使用的是正式账号，确定要切换到试玩模式吗</p>
            </div>
        </confirm-free>
    </div>
</template>

<script>
import lottery from './left_lottery'
import encryption from '@/components/common/module_js/md5'
import iView from 'iview'
import modal from './try_play.vue'
import ConfirmFree from '@/components/common/module_vue/modal'
// import ConfirmFree from './components/ConfirmFree'
export default {
    components: {
        lottery,
        modal,
        ConfirmFree
    },
    data () {
        return {
            currentMenu: this.$route.path,
            menu: [
                { label: '首页', url: '/home' },
                { label: '购彩大厅', url: '/lottery' },
                { label: '手机购彩', url: '/phoneBuy' },
                { label: '优惠活动', url: '/active' },
                { label: '开奖公告', url: '/notice' },
                { label: '走势图表', url: '/trend' }
            ],
            notice: '',
            userCode: '',
            password: '',
            checkCode: '',
            captcha: '/api/v2/user/captcha.jpg?d=' + new Date().getTime(),
            showPopup: false,
            play: false,
            turnRound: false,
            hasAsideMenu: false,
            hasRefreshChode: false,
            confirmDialog: false
        }
    },
    watch: {
        $route (n, o) {
            this.currentMenu = n.path
            // 防止从别的页面操作登入或退出功能，更改登录状态
            // this.getUser();
        }
    },
    computed: {
        serverUrl () {
            return this.$store.state.servicer
        },
        userInfo () {
            return this.$store.state.user
        }
    },
    methods: {
        goRegister () {
            this.$router.push({
                name: 'register'
            })
        },
        handForClear () {
            this.confirmDialog = false
        },
        handConfirm () {
            this.confirmDialog = false
            this.signOut()
            this.play = true
        },
        refreshCheckCode () {
            //获取焦点刷新验证码
            // this.isActive = 3
            if (this.hasRefreshChode) {
                return
            }
            this.changeCaptcha()
            this.hasRefreshChode = true
        },
        showAsideMenu () {
            //显示快速导航
            if (this.$route.name === 'lottery') {
                return
            }
            this.hasAsideMenu = true
        },
        hideAsideMenu () {
            //隐藏快速导航
            if (this.$route.name === 'lottery') {
                return
            }
            this.hasAsideMenu = false
        },
        refreshBalance () {
            //刷新资金
            this.turnRound = true
            this.$http.post('/api/v2/user/queryBalance', {}, { userId: true }).then(response => {
                if (response.data.code !== 0) return
                this.userInfo.balance = response.data.data.balance
                localStorage.setItem('user', JSON.stringify(this.userInfo))
                this.turnRound = false
            })
        },
        freePlay () {
            //打开免费试玩窗口
            let userInfo = localStorage.getItem('user')
            if (!!userInfo) {
                userInfo = JSON.parse(userInfo)
                if (userInfo.userType == '09') {
                    this.$Message.info('正在使用试玩账号')
                } else {
                    this.confirmDialog = true
                }
            } else {
                this.play = true
            }
        },
        //切换验证码
        changeCaptcha: function () {
            this.captcha = '/api/v2/user/captcha.jpg?d=' + new Date().getTime()
        },
        doLogin: function () {
            let vm = this
            if (!this.userCode) {
                iView.Modal.error({
                    title: '请求失败',
                    content: '<p>用户名不能为空</p>'
                })
                return
            }
            if (!this.password) {
                iView.Modal.error({
                    title: '请求失败',
                    content: '<p>密码不能为空</p>'
                })
                return
            }
            if (!this.checkCode) {
                iView.Modal.error({
                    title: '请求失败',
                    content: '<p>验证码不能为空</p>'
                })
                this.changeCaptcha()
                return
            }
            let params = {
                userCode: this.userCode,
                password: encryption.encrypt.md5(this.password),
                checkCode: this.checkCode
            }
            this.$http.post('/api/v2/user/login', params).then(response => {
                vm.changeCaptcha()
                if (response.data.code !== 0) return
                    ;['userCode', 'password', 'checkCode'].forEach(
                        item => (vm[item] = '')
                    )
                localStorage.setItem('user', JSON.stringify(response.data.data))
                vm.$store.commit('getUser', response.data.data)
                if (
                    vm.$route.name === 'login' ||
                    vm.$route.name === 'register'
                ) {
                    vm.$router.push('/')
                }
            })
        },
        signOut () {
            let vm = this
            this.$http
                .post('/api/v2/user/loginOut', '', { userId: true })
                .then(response => {
                    if (response.data.code !== 0) return
                    vm.$store.commit('getUser', '')
                    localStorage.setItem('user', '')
                    if (this.$route.name === 'personalCenter')
                        this.$router.push('/')
                })
        },
        addCollection () {
            this.$Modal.info({
                title: '加入收藏',
                content: '请按Ctrl+D加入收藏',
                onOk: () => { }
            })
        },
        escapeHtml (str) {
            if (!str) return ''
            var arrEntities = {
                lt: '<',
                gt: '>',
                nbsp: ' ',
                amp: '&',
                quot: '"'
            }
            return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
                return arrEntities[t]
            })
        },
        getNotice () {
            let vm = this
            this.$http
                .post('/api/v2/cms/queryAnnounceEssayList', {
                    current: 1,
                    size: 100,
                    type: '02'
                })
                .then(response => {
                    if (response.data.code !== 0) return
                    let n = response.data.data.list
                    let txt = ''
                    n.forEach(item => {
                        txt +=
                            vm.escapeHtml(item.content) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                    })
                    this.notice = txt
                })
        }
        // getUser (balance) {
        //     let user = localStorage.getItem('user');
        //     if (user) {
        //         this.userInfo = JSON.parse(user);
        //     } else {
        //         this.userInfo = '';
        //     }
        // }
    },
    created () {
        // this.getUser(true);
        this.getNotice()
    }
}
</script>
<style>
.confirm-free-modal-p {
    padding: 5%;
    text-align: center;
    font-size: 14px;
}
</style>

<style lang="less" scoped>
.notice {
    height: 35px;
    line-height: 35px;
    background: @head-notice-bg;
    font-size: 12px;
}
.notice .content {
    margin: 0 auto;
}
.notice div.txt {
    float: left;
    color: @common-color;
    width: 560px;
}
.notice div.txt span {
    float: left;
    height: 40px;
    margin-top: 5px;
}
.notice div.txt > div {
    float: left;
    width: 510px;
}
.notice div.txt > div span {
    margin: 0;
}
.notice marquee {
    overflow: hidden;
}

.notice ul {
    float: right;
}
.notice ul li {
    float: left;
    padding: 0 10px;
    border-right: 1px solid #7f7f7f;
    height: 14px;
    line-height: 14px;
    margin-top: 11px;
}
.notice ul li:last-child {
    border: 0;
}
.notice ul li a {
    color: #7f7f7f;
}
.notice ul li a:hover {
    color: @common-active-color;
}
.head-info {
    height: 90px;
    position: relative;
    padding: 26px 0;
}
.head-info .content {
    position: relative;
    height: 100%;
    margin: 0 auto;
}
.head-info .logo {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    width: 180px;
    margin-top: 3px;
}
.head-info .logo-side {
    width: 200px;
    height: 55px;
    position: absolute;
    bottom: -27px;
    left: 190px;
    background: url(/configstatic/pc/images/icon.png) no-repeat;
    background-position: -9px -445px;
}
.account-info {
    float: right;
}
.account-info .input-wrapper {
    position: relative;
}
.account-info .input-wrapper.input-line {
    width: 132px;
    height: 38px;
    vertical-align: top;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -ms-border-radius: 4px;
    -moz-border-radius: 4px;
    margin-right: 7px;
}

.input-wrapper.input-line.userlogo,
.input-wrapper.input-line.userregister {
    width: 84px;
    height: 38px;
}
.input-wrapper.input-line.userregister {
    margin-right: 0;
}
.input-wrapper.input-line.userregister a {
    display: inline-block;
    height: 40px;
}
.input-wrapper.input-line.userlogo {
    margin: 0 2px 0 12px;
}
.input-wrapper button {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0;
}
.account-info .input-wrapper img {
    position: absolute;
    left: 8px;
    top: 6px;
}
.account-info .validate img {
    width: 67px;
    left: auto;
    right: 1px;
    top: 3px;
    height: 90%;
}
// .account-info .input-wrapper .btn {
//     float: left;
//     color: #be1204;
//     height: 39px;
//     font-size: 14px;
// }
.head-menu {
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 14px;
    background: @common-bg;
}
.head-menu .content {
    margin: 0 auto;
}
.head-menu .lottery-title {
    float: left;
    width: 220px;
    position: relative;
    border-right: none;
}
.head-menu .lottery-title span {
    float: left;
    display: block;
    height: 44px;
    overflow: hidden;
}
.head-menu .lottery-title span i {
    margin-top: 13px;
}
.head-menu ul {
    width: 780px;
    float: right;
}
.head-menu ul li {
    float: left;
    text-align: center;
}
.head-menu ul li a {
    display: block;
    color: #fff;
    width: 100%;
    transition: background 0.2s ease-in;
}
.head-menu ul li a:hover {
    background: @common-active-bg;
}
.head-menu ul li.active a {
    background: @common-active-bg;
}
.logined {
    float: right;
}
.logined li {
    position: relative;
    float: left;
    color: @common-color;
    font-size: 14px;
    margin-left: 15px;
}
.logined .ordinary,
.logined .deposit {
    font-size: 0;
}
.logined .ordinary button,
.logined .ordinary .deposit button {
    display: inline-block;
    width: 97px;
    height: 38px;
    padding: 0;
    line-height: 38px;
    text-align: center;
    color: @common-color;
    // background: #fff;
    border-color: @common-color;
}
.logined .withdrawal {
    margin-left: 20px;
}
.logined .withdrawal:hover button,
.logined .deposit:hover button {
    background: @common-bg;
    color: #fff;
}
.logined .withdrawal i,
.logined .deposit i {
    display: inline-block;
    vertical-align: -7px;
    margin-right: 7px;
    width: 22px;
    height: 23px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -241px -548px;
}
.logined .withdrawal i {
    margin-right: 8px;
}
.logined .deposit i {
    background: url('/configstatic/pc/images/icon.png') no-repeat -209px -548px;
}
.logined .deposit:hover i {
    background: url('/configstatic/pc/images/icon.png') no-repeat -206px -512px;
}
.logined .withdrawal:hover i {
    background: url('/configstatic/pc/images/icon.png') no-repeat -240px -512px;
}
.logined .login-out {
    color: #fff;
    margin-left: 20px;
    font-size: 14px;
}
.logined .login-out .ivu-icon.ivu-icon-power {
    font-size: 20px;
}
.logined .account {
    margin-top: -12px;
}
.logined .account > div {
    height: 60px;
    float: left;
}
.logined .account .account-logo {
    width: 60px;
    height: 60px;
}
.logined .account .account-logo .img {
    height: 100%;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    cursor: pointer;
}
.logined .account .account-detail {
    padding-top: 8px;
    margin-left: 10px;
    position: relative;
}
.logined .account .account-detail .lab {
    display: inline-block;
    vertical-align: top;
    color: #7f7f7f;
}
.logined .account .account-detail .label,
.logined .account .account-detail .font-red,
.logined .account .account-detail .label {
    display: inline-block;
    vertical-align: top;
}
.logined .account .account-detail .user-name {
    max-width: 178px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.logined .account .account-detail img {
    display: inline-block;
    width: 70px;
    float: inherit;
    vertical-align: middle;
}
@keyframes fade-in {
    0% {
        opacity: 0;
    } /*初始状态 透明度为0*/
    40% {
        opacity: 0;
    } /*过渡状态 透明度为0*/
    100% {
        opacity: 1;
    } /*结束状态 透明度为1*/
}
@-webkit-keyframes fade-in {
    /*针对webkit内核*/
    0% {
        opacity: 0;
    }
    40% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
.logined .account .account-popup {
    animation: fade-in; /*动画名称*/
    animation-duration: 0.6s; /*动画持续时间*/
    -webkit-animation: fade-in 0.6s; /*针对webkit内核*/
}
.logined .account .account-popup {
    position: absolute;
    top: 70px;
    left: 30px;
    background: #fff;
    border: 1px solid #ebebeb;
    transform: translate(-50%, 0);
    z-index: 1000;
    padding: 0 15px;
    font-size: 12px;
    color: #7f7f7f;
    z-index: 100000;
}
.logined .account .account-popup a {
    color: #7f7f7f;
}
.logined .account .account-popup a:hover {
    color: @common-active-color;
}
.logined .account .account-popup::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 12px solid #ebebeb;
    position: absolute;
    left: 50%;
    top: -11px;
    transform: translate(-50%, 0);
}
.logined .account .account-popup::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 12px solid #fff;
    position: absolute;
    left: 50%;
    top: -10px;
    transform: translate(-50%, 0);
}
.logined .account .account-popup p {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ebebeb;
    padding: 0 5px;
}
.logined .account .account-popup p:hover {
    color: @common-active-color;
}
.logined .account .account-popup p:last-child {
    border-bottom: 0;
}
.logined .account div p {
    white-space: nowrap;
    height: 20px;
    line-height: 20px;
    margin-top: 2px;
}
.logined .account div .balance {
    font-size: 0;
}
.logined .account div p:first-child {
    margin-bottom: 5px;
}
.logined .account div p span {
    font-size: 14px;
}
.logined .account div p .refresh {
    display: inline-block;
    vertical-align: -6px;
    width: 12px;
    height: 13px;
    margin-left: 6px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -278px -518px;
    cursor: pointer;
}
@keyframes rotating {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@-webkit-keyframes rotating {
    0% {
        -webkit-tranform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}
@-ms-keyframes rotating {
    0% {
        -ms-tranform: rotate(0deg);
    }
    100% {
        -ms-transform: rotate(360deg);
    }
}
@-moz-keyframes rotating {
    0% {
        -moz-tranform: rotate(0deg);
    }
    100% {
        -moz-transform: rotate(360deg);
    }
}
@-o-keyframes rotating {
    0% {
        -o-tranform: rotate(0deg);
    }
    100% {
        -o-transform: rotate(360deg);
    }
}
.logined .account div p .turn-round {
    animation: rotating 5s infinite linear;
    -webkit-animation: rotating 5s infinite linear;
    -ms-animation: rotating 5s infinite linear;
    -moz-animation: rotating 5s infinite linear;
    -o-animation: rotating 5s infinite linear;
}
.logined .ordinary {
    position: relative;
}
</style>
<style scoped>
.notice marquee:hover >>> span {
    color: #be1204 !important;
    cursor: pointer;
}
.notice >>> .notice-cont * {
    display: inline;
}
.account-info .input-wrapper .ivu-input-wrapper >>> .ivu-input {
    height: 40px;
    padding-left: 30px;
}
.account-info .input-wrapper.validate .ivu-input-wrapper >>> .ivu-input {
    padding-left: 5px;
}
.account-info .ivu-input-wrapper >>> .ivu-input-icon {
    left: 0;
    font-size: 20px;
}
.account-info .user-name .ivu-input-wrapper >>> .ivu-input-icon {
    font-size: 24px;
}
</style>
