// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// vuex 数据管理
import store from './vuex'
// ajax请求
import './axios'
// 全局组件
import './whole_components'
import localforage from 'localforage'
Vue.prototype.$forage = localforage
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})
