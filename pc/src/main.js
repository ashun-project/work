// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// require("babel-polyfill");
require('!style-loader!css-loader!less-loader!./common.less'); //5.28增加
// vuex 数据管理
import store from './vuex';

// iview UI库
// import iView from 'iview';
import component from './iviewComponent/component'

// import 'iview/dist/styles/iview.css';    // 使用 CSS
// import './iviewTheme/theme.less';  // 5.28注掉
// Vue.use(iView);
// import './resource'
// http请求模块
import './axios';

// 倒计时模块
// import countDown from "@/components/common/module_vue/count_down"
// Vue.component('countDown', countDown);
Vue.prototype.$bus = new Vue()
// 自定义console
Vue.prototype.myConsole = function (params) {
  // console.log(params)
}
Vue.prototype.$configText = window.configText;
Vue.config.productionTip = false
/* eslint-disable no-new */

//filter
import './components/common/filter/numberReset'

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
// router.beforeEach((to,from,next) =>{ //进入/buyLottery/*需登录
//   if (to.name !== 'buyLottery') {
//     next();
//   } else {
//       let user = localStorage.getItem('user');
//       if (!user) {
//         store.commit('getShowLoginDialog',true);
//         return 
//       }
//       next();
//   }
// })