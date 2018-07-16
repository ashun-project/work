<template>
    <div class="home-header">
        <div class="notice-wrap">
            <div class="content">
                <!-- 公告 -->
                <div class="txt">
                    <div class="txt-icon">
                        <i class="i-icon i-notice"></i>
                    </div>&nbsp;
                    <div v-if="notice" class="margquee">
                        <marquee scrolldelay=100 scrollAmount=6>
                            <span class="notice-cont" v-html="notice" @click="$router.push({path:'/newsList/announce'})"></span>
                        </marquee>
                    </div>
                </div>
                <!-- 公告结束 -->
                <!-- 菜单 -->
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
                <!-- 菜单结束 -->
            </div>
        </div>
        <!-- logo登录区-->
        <div class="head-info">
            <div class="content">
                <!-- logo -->
                <div class="logo-wrap">
                    <div class="logo">
                        <h1>
                            <router-link to="/"><img src="/configstatic/pc/images/logo.gif" :title="$configText.main+'彩票'"></router-link>
                        </h1>
                    </div>
                    <div class="logo-side"></div>
                </div>
                <!--logo结束-->
                <!--登录注册-->
                <div class="account-info" v-if="(!userInfo.userCode)&&($route.name!='login')" id="loginInfo">
                    <div class="input-wrapper ">
                        <Input type="text" v-model="userCode" size="large" icon="ios-person-outline" placeholder="用户名" @on-enter="doLogin()"></Input>
                    </div>
                    <div class="input-wrapper same">
                        <Input type="password" v-model="password" size="large" icon="ios-locked-outline" placeholder="密码" @on-enter="doLogin()"></Input>
                    </div>
                    <div class="input-wrapper same validate">
                        <Input type="text" v-model="checkCode" size="large" placeholder="验证码" @on-enter="doLogin()" @on-focus='refreshCheckCode()'></Input>
                        <img :src="captcha" @click="changeCaptcha()" style='cursor:pointer'>
                    </div>
                    <div class="input-wrapper login">
                        <Button type="primary" size="large" @click="doLogin()">用户登录</Button>
                    </div>
                    <div class="input-wrapper register">
                        <Button type="warning" size="large" @click="goRegister()">免费注册</Button>
                    </div>
                </div>
                <!--  登录注册结束-->
                <!-- 用户信息结束-->
                <div class="logined" v-if="!!userInfo.userCode">
                    <ul>
                        <li class="account">
                            <div class="account-logo" @mouseenter="showPopup = true" @mouseleave="showPopup = false">
                                <template v-if="userInfo&&userInfo.imgUrl">
                                    <img :src='userInfo&&userInfo.imgUrl' @click="$router.push('/personalCenter/account')">
                                </template>
                                <template v-else-if="userInfo&&!userInfo.imgUrl">
                                    <img src="/static/images/account.png" @click="$router.push('/personalCenter/account')">
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
                                    <span class="user-name">{{userInfo.userCode}}&nbsp;&nbsp;</span><img :src="userInfo.userLevelIcon">
                                </p>
                                <p class='balance'>
                                    <span class="lab">余额&nbsp;:&nbsp;</span>
                                    <span class="font-red">{{Number(userInfo.balance).toFixed(2)}}</span>
                                    <span class='refresh' @mouseenter="showPopup = false" @mouseleave="showPopup = false" @click='refreshBalance()' :class="{'turn-round':turnRound}"></span>
                                </p>
                            </div>
                        </li>
                        <li class="ordinary deposit" v-if="userInfo.userType !== '09' && userInfo.userType !=='08'">
                            <Button type="default" @click="$router.push({path:'/personalCenter/recharge'})">
                                <i></i>存款</Button>
                        </li>
                        <li class="ordinary withdrawal" v-if="userInfo.userType !== '09' && userInfo.userType !=='08'">
                            <Button type="default" @click="$router.push({path:'/personalCenter/withdraw'})">
                                <i></i>提现</Button>
                        </li>
                        <li class="login-out" @click="signOut()">
                            <Button type='primary' icon='power'>退出登录</Button>
                        </li>
                    </ul>
                </div>
                <!-- 登录注册结束 -->
            </div>
        </div>
        <!-- logo区域结束 -->
        <div class="head-menu">
            <div class="content">
                <div class="lottery-title" @mouseover="showAsideMenu" @mouseleave="hideAsideMenu">
                    <span>
                        <i class="i-icon i-three"></i>&nbsp;</span>
                    <span>热门彩种</span>
                    <lottery v-show="currentMenu === '/home' || hasAsideMenu"></lottery>
                </div>
                <ul class="nav-menu">
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
            this.$http.post('/api/v2/user/queryBalance', {}, { userId: true, unenc: true }).then(response => {
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
            this.$http.post('/api/v2/cms/queryAnnounceEssayList', {
                current: 1,
                size: 100,
                type: '02'
            }, { unenc: true }).then(response => {
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
    },
    created () {
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
<style lang="less">
.home-header {
    .notice-wrap {
        height: 35px;
        background: @head-notice-bg;
        font-size: 12px;
        min-width: 1000px;
        overflow: hidden;
        .content {
            margin: 0 auto;
            .txt {
                float: left;
                color: @common-color;
                width: 560px;
                .txt-icon {
                    float: left;
                    margin-top: 7px;
                }
                .margquee {
                    float: left;
                    width: 510px;
                    line-height: 35px;
                    &:hover {
                        span {
                            cursor: pointer;
                        }
                    }
                    span {
                        margin: 0;
                        span {
                            display: inline;
                            font-size: 12px !important;
                            color: #be1204 !important;
                            background: none !important;
                        }
                    }
                }
            }
            ul {
                float: right;
                li {
                    float: left;
                    padding: 0 10px;
                    border-right: 1px solid #7f7f7f;
                    height: 14px;
                    line-height: 14px;
                    margin-top: 11px;
                    &:last-child {
                        border-right: 0;
                    }
                    a {
                        color: #7f7f7f;
                        &:hover {
                            color: @common-active-color;
                        }
                    }
                }
            }
        }
    }
    .head-info {
        background: url(/configstatic/pc/images/header_bg.png) no-repeat center;
        .content {
            position: relative;
            height: 90px;
            width: 1000px;
            margin: 0 auto;
            .logo-wrap {
                float: left;
                height: 100%;
                overflow: hidden;
                .logo {
                    position: absolute;
                    left: 0;
                    top: 11px;
                    width: 180px;
                    height: 74px;
                }
                .logo-side {
                    position: absolute;
                    top: 35px;
                    left: 180px;
                    width: 200px;
                    height: 55px;
                    background: url(/configstatic/pc/images/icon.png) no-repeat;
                    background-position: -9px -444px;
                }
            }
            .account-info {
                float: right;
                margin-top: 26px;
                font-size: 0;
                .input-wrapper {
                    position: relative;
                    display: inline-block;
                    .ivu-input {
                        height: 38px;
                        padding-left: 30px;
                        padding-right: 10px;
                    }
                    .ivu-btn {
                        width: 84px;
                        height: 38px;
                    }
                    .ivu-input-wrapper {
                        width: 132px;
                        height: 38px;
                        .ivu-input-icon {
                            left: 0;
                            font-size: 20px;
                            &.ivu-icon-ios-person-outline {
                                font-size: 20px;
                            }
                        }
                    }
                    &.login {
                        margin-left: 19px;
                    }
                    &.register {
                        margin-left: 14px;
                    }
                    &.same {
                        margin-left: 7px;
                    }
                    .ivu-btn-warning {
                        background-color: @warning-btn-bg;
                        color: @warning-btn-color;
                        &:hover {
                            background-color: @warning-btn-bg*0.95;
                            border-color: @warning-btn-bg*0.95;
                        }
                    }
                    &.validate {
                        img {
                            position: absolute;
                            width: 67px;
                            left: auto;
                            right: 1px;
                            top: 2px;
                            height: 90%;
                        }
                        .ivu-input {
                            padding-left: 5px;
                        }
                    }
                }
            }
            .logined {
                float: right;
                margin-top: 26px;
                li {
                    position: relative;
                    float: left;
                    color: @common-color;
                    font-size: 14px;
                    margin-left: 15px;
                    &:first-child {
                        margin-left: 0;
                    }
                    &.withdrawal {
                        margin-left: 19px;
                        i {
                            width: 22px;
                            height: 23px;
                            margin-right: 8px;
                        }
                        &:hover {
                            i {
                                background: url('/configstatic/pc/images/icon.png')
                                    no-repeat -240px -512px;
                            }
                            .ivu-btn {
                                background: @common-bg;
                                color: #fff;
                            }
                        }
                    }
                    &.deposit {
                        background: url('/configstatic/pc/images/icon.png')
                            no-repeat -209px -548px;
                        i {
                            background: url('/configstatic/pc/images/icon.png')
                                no-repeat -209px -548px;
                            width: 22px;
                            height: 23px;
                        }
                        &:hover {
                            .ivu-btn {
                                &:extend(.home-header
                                        .head-info
                                        .content
                                        .logined
                                        li.withdrawal:hover
                                        .ivu-btn);
                            }
                            i {
                                background: url('/configstatic/pc/images/icon.png')
                                    no-repeat -206px -512px;
                            }
                        }
                    }
                    &.login-out {
                        color: #fff;
                        margin-left: 19px;
                        font-size: 14px;
                        .ivu-btn-primary {
                            color: #fff;
                            i {
                                vertical-align: 0;
                            }
                        }
                        span {
                            margin-left: -2px;
                        }
                    }
                    i {
                        display: inline-block;
                        vertical-align: middle;
                        margin: 0 4px;
                        background: url('/configstatic/pc/images/icon.png')
                            no-repeat -241px -548px;
                    }
                    .ivu-btn {
                        display: inline-block;
                        vertical-align: middle;
                        width: 97px;
                        height: 38px;
                        padding: 0;
                        line-height: 38px;
                        text-align: center;
                        color: @common-color;
                    }
                    .account-logo {
                        height: 100%;
                        float: left;
                        margin-top: -12px;
                        img {
                            width: 60px;
                            height: 60px;
                            cursor: pointer;
                        }
                        .account-popup {
                            position: absolute;
                            top: 58px;
                            left: 30px;
                            background: #fff;
                            border: 1px solid #ebebeb;
                            transform: translate(-50%, 0);
                            z-index: 1000;
                            padding: 0 15px;
                            font-size: 12px;
                            color: #7f7f7f;
                            z-index: 100000;
                            animation: fade-in;
                            /*动画名称*/
                            animation-duration: 0.6s;
                            /*动画持续时间*/
                            -webkit-animation: fade-in 0.6s;
                            /*针对webkit内核*/
                            &:before {
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
                            &:after {
                                &:extend(.home-header
                                        .head-info
                                        .content
                                        .logined
                                        li
                                        .account-logo
                                        .account-popup:before);
                                border-bottom: 12px solid #fff;
                                top: -10px;
                            }
                            p {
                                height: 30px;
                                line-height: 30px;
                                border-bottom: 1px solid #ebebeb;
                                padding: 0 5px;
                                &:last-child {
                                    border-bottom: 0;
                                }
                                a {
                                    color: #7f7f7f;
                                    &:hover {
                                        color: @common-active-color;
                                    }
                                }
                            }
                        }
                    }
                    .account-detail {
                        &:extend(.home-header
                                .head-info
                                .content
                                .logined
                                li
                                .account-logo);
                        height: 60px;
                        padding-top: 4px;
                        margin-left: 10px;
                        p {
                            white-space: nowrap;
                            line-height: 26px;
                            &.balance {
                                font-size: 0;
                            }
                            span {
                                font-size: 14px;
                                &.user-name {
                                    display: inline-block;
                                    vertical-align: top;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                &.refresh {
                                    display: inline-block;
                                    width: 13px;
                                    height: 13px;
                                    margin-left: 7px;
                                    background: url('/configstatic/pc/images/icon.png')
                                        no-repeat -278px -518px;
                                    cursor: pointer;
                                    &.turn-round {
                                        animation: rotating 5s infinite linear;
                                        -webkit-animation: rotating 5s infinite
                                            linear;
                                        -ms-animation: rotating 5s infinite
                                            linear;
                                        -moz-animation: rotating 5s infinite
                                            linear;
                                        -o-animation: rotating 5s infinite
                                            linear;
                                    }
                                }
                            }
                            img {
                                float: inherit;
                                vertical-align: middle;
                                width: 70px;
                            }
                        }
                        .lab {
                            color: #7f7f7f;
                        }
                    }
                }
            }
        }
    }
    .head-menu {
        min-width: 1000px;
        height: 44px;
        line-height: 44px;
        color: #fff;
        background: @common-bg;
        .content {
            width: 1000px;
            margin: 0 auto;
            .lottery-title {
                float: left;
                width: 220px;
                position: relative;
                border-right: none;
                span {
                    float: left;
                    display: block;
                    height: 44px;
                    overflow: hidden;
                    i {
                        margin-top: 13px;
                    }
                }
            }
            .nav-menu {
                width: 780px;
                float: right;
                li {
                    float: left;
                    text-align: center;
                    &.active {
                        a {
                            background: @common-active-bg;
                        }
                    }
                    a {
                        display: block;
                        color: #fff;
                        width: 100%;
                        transition: background 0.2s ease-in;
                        &:hover {
                            background: @common-active-bg;
                        }
                    }
                }
            }
        }
    }
}
@keyframes fade-in {
    0% {
        opacity: 0;
    }
    /*初始状态 透明度为0*/
    40% {
        opacity: 0;
    }
    /*过渡状态 透明度为0*/
    100% {
        opacity: 1;
    }
    /*结束状态 透明度为1*/
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
</style>

