import Vue from 'vue'

// 倒计时模块
import countDown from "./module_vue/count_down"
// 公用头部模块
import header from "./module_vue/header"
// 全局登录模块
import loginNav from './module_vue/loginNav'
// 滚动注册
import Scroll from './module_vue/scroll'
// 弹框注册
import Dialog from './module_vue/dialog'
// slider滑动注册
import Slider from './module_vue/slider'
// historySelect滑动注册
import historySelect from './module_vue/history_select'
// import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './module_js/refresh'
import './module_js/touch'
import {
	Swipe,
	SwipeItem,
	Radio,
	MessageBox,
	Toast,
	CellSwipe,
	Field,
	Picker,
	DatetimePicker,
	InfiniteScroll,
	Spinner,
	Popup,
	Range,
	Indicator,
	Button,
	Switch,
	Checklist,
	Loadmore
} from 'mint-ui';
import {
	resolve
} from 'path';

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Field.name, Field);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Picker.name, Picker);
Vue.component(Spinner.name, Spinner);
Vue.component(Toast.name, Toast);
Vue.component(Popup.name, Popup);
Vue.component(Range.name, Range);
Vue.component(Radio.name, Radio);
Vue.component(Button.name, Button);
Vue.component(Switch.name, Switch);
Vue.component(Checklist.name, Checklist);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.use(InfiniteScroll);



// Vue.use(MessageBox);
Vue.prototype.$Indicator = Indicator;
Vue.prototype.$Modal = MessageBox;
// Vue.prototype.$Message = Toast;
Vue.prototype.$Message = function (params) {
	let string = Object.prototype.toString.call(params)
	if (string == "[object String]") {
		Toast({
			message: params,
			duration: 1000
		})
	} else if (string == "[object Object]") {
		Toast(params)
	}

};


Vue.component('my-countDown', countDown);
Vue.component('my-header', header);
Vue.component('login-nav', loginNav);
Vue.component('my-scroll', Scroll);
Vue.component('my-dialog', Dialog);
Vue.component('my-slider', Slider);
Vue.component('historySelect', historySelect);


// 添加配置信息
Vue.prototype.$configText = window.configText;
// 自定义HTML转义解析
Vue.prototype.escapeHtml = function (str) {
	if (!str) return '';
	var arrEntities = {
		'lt': '<',
		'gt': '>',
		'nbsp': ' ',
		'amp': '&',
		'quot': '"'
	};
	return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
		return arrEntities[t];
	});
}

Vue.filter('keepDecimalOf2', function (val) {
	return val ? Number(val).toFixed(2) : "0.00";
})

// 自定义console
Vue.prototype.myConsole = function (params) {
	//   console.log(params)
}
// 自定义返回
Vue.prototype.$goBack = function (vm) {
	let path = sessionStorage.getItem('path');
	if (path) {
		vm.$router.push(path)
	} else {
		vm.$router.push('/')
	}
}
// 原生js添加class
Vue.prototype.$addClass = function (obj, cls) {
	let obj_class = obj.className; //获取 class 内容.
	let blank = (obj_class != '') ? ' ' : ''; //判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
	let added = obj_class + blank + cls; //组合原来的 class 和需要添加的 class.
	obj.className = added; //替换原来的 class.
}
// 原生js去除class
Vue.prototype.$removeClass = function (obj, cls) {
	let obj_class = ' ' + obj.className + ' '; //获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
	obj_class = obj_class.replace(/(\s+)/gi, ' '); //将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
	let removed = obj_class.replace(' ' + cls + ' ', ' '); //在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
	removed = removed.replace(/(^\s+)|(\s+$)/g, ''); //去掉首尾空格. ex) 'bcd ' -> 'bcd'
	obj.className = removed; //替换原来的 class.
}

Vue.prototype.$systemConfig = function () {
	let vm = this
	return new Promise(function (resolve, reject) {
		if (!window.systemConfigData) {
			let systemConfigData = {};

			vm.$http.post("/api/v2/sysDict/querySystemConfig").then(response => {
				if (response.data.code !== 0) return;
				response.data.data.forEach(item => {
					systemConfigData[item.key] = item.value;
				})

				resolve(systemConfigData)
				window.systemConfigData = systemConfigData;
			});
		} else {
			resolve(window.systemConfigData)
		}

	})

}
