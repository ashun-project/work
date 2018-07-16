import Vue from 'vue'
import axios from 'axios'
import store from '@/vuex'
import {
	MessageBox,
	Toast,
	Indicator
} from 'mint-ui';
import encryption from '@/components/common/module_js/md5.js'
Vue.prototype.$http = axios;


axios.interceptors.request.use(function (config) {
	// 开启loading状态
	if (config.loading) {
		Indicator.open('加载中...')
	}
	//在发送请求之前做某事
	let time = new Date().getTime();
	let user = localStorage.getItem('user');
	let userId = '',
		sign;

	// 登入后更改userID
	if (user) {
		user = JSON.parse(user)
		userId = user.userId;
	};
	sign = encryption.encrypt.md5(time + '##Lottery2017$$');
	// 判断需要登入后才能操作的接口并更改sign
	if (config.userId) {
		if (user) {
			sign = encryption.encrypt.md5(time + '##Lottery2017$$' + user.token)
		} else {
			// window.location.href = '/#/login';
			config.url = '/';
			MessageBox.confirm('你还没有登录,立即登录?', '温馨提示').then(() => {
				window.location.href = '/#/login';
			}, () => {})
			return config;
		}
	}

	// 参数加密
	if (!config.noEncrypt) {
		function RndNum(n) {
			let rnd = "";
			let x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
			for (let i = 0; i < n; i++) {
				let num = Math.round(Math.random() * 36);
				if (num === 36) num--;
				rnd += x.substring(num, num + 1);
			}
			return rnd;
		}

		let key = RndNum(16);
		config.headers.key = RSA(key);
		config.key = key;
		config.data = {
			body: AESEnc(key, JSON.stringify(config.data))
		};
	}

	config.headers.sign = sign;
	config.headers.timestamp = time + '';
	config.headers.userId = userId || '';
	config.headers.deviceId = 'aaaaaaaaaaaaaa';
	if (config.tx) {
		config.headers.tx = true;
	}
	return config;


}, function (error) {
	//请求错误时做些事
	return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use(function (response) {
	// 关闭loading状态
	if (response.config.loading) {
		Indicator.close()
	}

	//对响应数据做些事
	if (!response.data.code) {
		if (!response.config.noEncrypt) {
			response.data = JSON.parse(AESDec(response.config.key, response.data.body)); // 解密
		} else {
			response.data = response.data
		}

	}
	let code = response.data.code;
	let clientType = localStorage.getItem('loginClientType'); //设备类型
	clientType = clientType ? clientType : 'wap';
	//code =303
	if (code !== 0) {
		let errText = response.data.msg || '服务异常'
		if (code === 301 || code === 110 || code === 302 || code === 111 || code === 503 || code === 170) {
			if (clientType === 'android') { // 如果是原生android访问，直接调用原生的方法
				if (window.AndroidLoginUtil) {
					window.AndroidLoginUtil.jumpLogin(errText);
				}
				return;
			}
			if (clientType === 'ios') { // 原生ios
				window.location.href = 'objc://action=login';
				return;
			}
			// 清空登录缓存
			store.commit('getUser', {});
			localStorage.setItem('user', '');
			MessageBox.confirm(errText, '温馨提示').then(() => {
				window.location.href = '/#/login';
			}, () => {})

		} else if (code === 303) { // 访问限制
			window.location.href = '/#/ipLimit';
			sessionStorage.setItem('ipLimitData', JSON.stringify(response));
		} else {
			if (!response.config.notTip) Toast(errText);
		}
	}
	return response;
}, function (error) {
	//请求错误时做些事
	Indicator.close()
	return Promise.reject(error);
});
