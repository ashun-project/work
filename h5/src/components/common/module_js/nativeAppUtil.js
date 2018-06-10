import store from '@/vuex'
let isNativeIos = window.webkit && window.webkit.messageHandlers;
let openAppSuccess = false;
let saveImgSuccess = false;

/* 判断是否在原生ios里面 */
window.nativeAppUtil = {};

window.nativeAppUtil.getDevice = function (v) {
	window.nativeDevice = v
}



function getDevice() {
	if (isNativeIos && window.webkit.messageHandlers.getDevice) {
		window.webkit.messageHandlers.getDevice.postMessage(null);
	}
}

function openApp(appUrl) {
	if (isNativeIos && window.webkit.messageHandlers.openApp) {
		window.webkit.messageHandlers.openApp.postMessage({
			appUrl: appUrl
		});
	}
}

function saveImg(data) {
	if (isNativeIos && window.webkit.messageHandlers.saveImg) {
		window.webkit.messageHandlers.saveImg.postMessage({
			img: data
		});
	}
}

function openExplorer(data) {
	let config = Object.assign({
		url: '',
		html: null,
		type: 1 //  1：加载url, 2: 渲染html
	}, data)
	if (isNativeIos && window.webkit.messageHandlers.openExplorer) {
		window.webkit.messageHandlers.openExplorer.postMessage(config);
	}
}

export default {
	openApp: openApp,
	saveImg: saveImg,
	getDevice: getDevice,
	openExplorer: openExplorer
}
