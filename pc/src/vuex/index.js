import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let user = localStorage.getItem('user');

export default new Vuex.Store({
    state: {
        configList: [],
        user: user ? JSON.parse(user) : {},
        preiodInfo: {},
        servicer: '',
        qrcodes: [],
        showLoginDialog: false,
        mbHeadData: {
            leftData: '登录'
        },
        netStatus: false,
        resourceId: undefined,
        updateNotice: '',
        updateRecord: '',
        anotherObj: null,  //another页面内容
        isLogin: false,    //是否登录
        isSuccessModal: false, //投注成功弹框
        freePlayValue: 0,
        isClosePie: false  //判断是否封盘
    },
    mutations: {
        getConfigList (state, list) {
            state.configList = list
        },
        //改变anotherObj
        freePlay (state, val) {
            state.freePlayValue = val
        },
        getAnotherObj (state, obj) {
            state.anotherObj = obj
        },
        getResourceId (state, id) {
            state.resourceId = id
        },

        // 期数信息
        getPreiodInfo (state, data) {
            state.preiodInfo = data;
        },
        // 二维码
        getQrcodes (state, data) {
            state.qrcodes = data;
        },
        // 手机端
        getHeadData (state, data) {
            state.mbHeadData = data;
        },
        // 在线客服信息
        getServicer (state, data) {
            state.servicer = data;
        },
        getUser (state, data) {
            state.user = data || {};
        },
        getShowLoginDialog (state, data) {
            state.showLoginDialog = data;
        },
        //网关状态
        getNetStatus (state, data) {
            state.netStatus = data;
        },
        // 开奖公告和开奖历史更新
        getNoticeList (state, data) {
            state.updateNotice = data;
        },
        //是否登录
        getShouldLogin (state, data) {
            state.isLogin = data;
        },
        getSuccessModal (state, data) { //投注成功弹框
            state.isSuccessModal = data;
        },
        getClosePie (state, data) { //是否封盘
            state.isClosePie = data;
        }
    }
})