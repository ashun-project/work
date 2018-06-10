import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let user = localStorage.getItem('user');
export default new Vuex.Store({
    state: {
        lotteryCode: '',
        user: user ? JSON.parse(user) : {},
        onLineServicer: {}, // 客服信息
        appTip: true,
        noticeModify: {},
        direction: 'in',
        transitionPop: false,
        iphoneD: false,
        routerChange: false,

    },
    mutations: {
        routerChange (state, bool) {
            state.routerChange = bool
        },
        iphoneD (state, bool) {
            state.iphoneD = bool
        },
        // 当前彩种
        getLottery (state, data) {
            state.lotteryCode = data.toLowerCase();
        },
        getUser (state, data) {
            state.user = data || {};
        },
        getOnLineServicer (state, data) {
            state.onLineServicer = data || {};
        },
        getAppTip (state, data) {
            state.appTip = data;
        },
        getNoticeModify (state, data) {
            state.noticeModify = data;
        },
        getDirection (state, data) {
            state.direction = data;
        },
        getTransitionPop (state, data) {
            state.transitionPop = data;
        }
    }
})
