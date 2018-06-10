<template>
    <div class="layout" :class="{'not-header': closeHeader, 'not-footer': closeFooter}">
        <div class="content">
            <transition :name="'vux-pop-' + this.direction">
                <keep-alive :include="['home', 'lottery','prizeNotice','personalCenter','active', 'trend','bettingList']">
                    <router-view></router-view>
                </keep-alive>
            </transition>
            <!--           <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view> -->
            <!--  <login-nav v-if="showLoginNav"></login-nav>     -->
        </div>
        <div class="footer" v-if="!closeFooter">
            <div class="" v-for="(item, idx) in list" :key="idx" :class="{active: item.label === pathLabel}">
                <router-link :to="item.link" class="title">
                    <i class="iconfont" :class="item.icon"></i>
                    {{item.title}}
                </router-link>
            </div>
        </div>
        <socket-msg></socket-msg>
    </div>
</template>

<script>
//   const needLoginPath = ['/bettingList']; //需要登录的路由
import socketMsg from '@/whole_components/module_vue/socket'
import nativeAppUtil from '@/components/common/module_js/nativeAppUtil'

export default {
    data () {
        return {
            list: [
                { icon: 'icon-mn_zhuyexuanzhong_fill', title: '首页', link: '/', label: 'home' },
                { icon: 'icon-caigou', title: '购彩', link: '/lottery', label: 'lottery' },
                { icon: 'icon-lv_xunzhang_fill', title: '开奖', link: '/prizeNotice', label: 'prizeNotice' },
                { icon: 'icon-mn_zhexiantu_fill', title: '走势', link: '/trend/1', label: 'trend' },
                { icon: 'icon-yonghu', title: '我的', link: '/personalCenter', label: 'personalCenter' }
            ],
            pathLabel: 'home',
            closeFooter: false,
            closeHeader: false
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        },
        direction () {
            return this.$store.state.direction;
        },
        /*  showLoginNav() { //判断登录已否显示登录界面
             if(!this.user.userCode && needLoginPath.indexOf(this.$route.path)>-1) {
                return true;
             } else{
                return false;
             }
         } */
    },
    watch: {
        '$route' (n) {
            this.getRoute();
        },
    },
    methods: {
        getRoute () {
            // window.loading.closeLoading()
            let route = this.$route;
            this.pathLabel = route.name;
            this.closeHeader = route.meta ? route.meta.notHeader : '';     // 判断去除页头
            this.closeFooter = route.meta ? route.meta.notFooter : '';     // 判断去除页脚
        }
    },
    components: {
        socketMsg
    },
    mounted () {
        let vm = this;
        document.addEventListener('touchmove', () => {
            vm.$store.commit('getTransitionPop', true)
            clearTimeout(vm.popTimer);
            vm.popTimer = setTimeout(() => {
                vm.$store.commit('getTransitionPop', false)
            }, 400)
        })
    },
    created () {
        this.getRoute();
        nativeAppUtil.getDevice(); // 获取webView设备信息
        /* 获取在线客服地址 */
        this.$http.post('/api/v2/cms/queryQrcodesAndServicer', {
            frontType: 'h5'
        }).then((response) => {
            if (response.data.code !== 0) return;
            let data = response.data.data;
            this.$store.commit('getOnLineServicer', data.servicer);
            document.title = data.servicer.name;
        })
    }

}
</script>

<style>
.layout {
    padding-top: 2.2rem;
    padding-bottom: 2.4rem;
}
.layout.not-header {
    padding-top: 0;
}
.layout.not-footer {
    padding-bottom: 0;
}
.layout .footer {
    position: fixed;
    background-color: #eee;
    top: auto;
    bottom: 0;
    table-layout: fixed;
    color: #757575;
    right: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 2.4rem;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    line-height: 0.8rem;
}
.layout .footer > div {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    vertical-align: middle;
}
.layout .footer > div a.title {
    display: block;
    font-size: 0.7rem;
    color: #757575;
}
.layout .footer > div i {
    font-size: 1rem;
    margin-bottom: 0.1rem;
    display: block;
}
.layout .footer .active a.title {
    color: #f00;
}
</style>

