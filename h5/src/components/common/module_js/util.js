function removeClass(els, className) {
	let doms = []
	if (!els.length) {
		doms.push(els)
	} else {
		doms = els
	}
	for (let item, i = 0; i < doms.length; i++) {
		item = doms[i];
		if (item.className) {
			let newClass = item.className.split(' ');
			if (hasClass(item, className)) {
				newClass = newClass.filter((clz) => {
					return (clz !== className)
				})
				item.className = newClass.join(' ')
			}
		}
	}
}

function addClass(el, className) {
	if (hasClass(el, className)) {
		return
	}
	let newClass = el.className.split(' ')
	newClass.push(className)
	el.className = newClass.join(' ')
}

function hasClass(el, className) {
	let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
	return reg.test(el.className)
}

function toggleClass(el, className) {
	if (hasClass(el, className)) {
		removeClass(el, className)
	} else {
		addClass(el, className)
	}
}

function getDomHeight(nHd, nFd) {
	let docEl = window.document.documentElement,
		winH = window.screen.height,
		fontSize = parseFloat(window.getComputedStyle(window.document.documentElement)['font-size']);
	if (nHd && nFd) {
		return winH - fontSize * 2.2 - fontSize * 2.4
	} else if (nHd) {
		return winH - fontSize * 2.2
	} else if (nFd) {
		return winH - fontSize * 2.4
	} else {
		return winH
	}
}

function copyText(text) {
	var container = document.body;

	var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

	var copyDom = document.getElementsByClassName('copyDom');
	if (copyDom && copyDom.length > 0) {
		container.removeChild(copyDom[0]);
	}
	var fakeElem = document.createElement('textarea');
	// Prevent zooming on iOS
	fakeElem.style.fontSize = '12pt';
	// Reset box model
	fakeElem.style.border = '0';
	fakeElem.style.padding = '0';
	fakeElem.style.margin = '0';
	// Move element out of screen horizontally
	fakeElem.style.position = 'absolute';
	fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
	// Move element to the same position vertically
	var yPosition = window.pageYOffset || document.documentElement.scrollTop;
	fakeElem.style.top = yPosition + 'px';

	fakeElem.setAttribute('readonly', '');
	fakeElem.className = 'copyDom'
	fakeElem.value = text;
	container.appendChild(fakeElem);
	fakeElem.select();
	fakeElem.setSelectionRange(0, fakeElem.value.length);

	window.selectedText = fakeElem.value;
	var succeeded = void 0;

	try {
		succeeded = document.execCommand('copy');
	} catch (err) {
		succeeded = false;
	}
	return succeeded
}

function debounce(fn, delay) {
	// 维护一个 timer
	let timer = null;

	return function () {
		// 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
		let context = this;
		let args = arguments;

		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	}
}


function drag(dom, disTop = 40, disBottom = 40) {
	let w, h, x, y, souceX, souceY, disX, disY,
		winH = document.documentElement.clientHeight,
		winW = document.documentElement.clientWidth;

	dom.style.left = winW - dom.clientWidth + 'px';

	dom.addEventListener('touchstart', (event) => {

		removeClass(dom, 'drag-animate')
		let touch = event.touches[0]; //获取第一个触点
		souceX = touch.clientX;
		souceY = touch.clientY;
		x = dom.offsetLeft;
		y = dom.offsetTop;


	})
	dom.addEventListener('touchmove', (event) => {
		let touch = event.touches[0],
			top; //获取第一个触点
		w = dom.clientWidth;
		h = dom.clientHeight;
		disX = touch.clientX - souceX;
		disY = touch.clientY - souceY;
		top = y + disY;
		if (top > winH - h - disBottom) {
			top = winH - h - 40
		} else if (top < disTop) {
			top = disTop
		}
		dom.style.top = top + 'px';
		dom.style.left = x + disX + 'px';
		event.preventDefault();
	})
	dom.addEventListener('touchend', (event) => {
		let touch = event.touches[0],
			style = dom.style; //获取第一个触点
		w = dom.clientWidth;
		addClass(dom, 'drag-animate')
		if (!style.left || parseFloat(style.left) >= winW / 2 - w / 2) {
			style.left = winW - w + 'px';
		} else {
			style.left = 0;
		}
	})
}



export default {
	removeClass: removeClass,
	addClass: addClass,
	hasClass: hasClass,
	getDomHeight: getDomHeight,
	toggleClass: toggleClass,
	copyText: copyText,
	debounce: debounce,
	drag: drag
}
