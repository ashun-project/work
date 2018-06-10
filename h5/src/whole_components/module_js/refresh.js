import Vue from 'vue'
import Util from '@/components/common/module_js/util.js';
const topHeight = 40;
const top = '-2.7rem';
let RefreshUtil = {
	handleTouchStart(event) {
		this.startY = event.touches[0].clientY;
		this.translateY = 0;
		Util.removeClass(this.option.scrollHtml, 'refreshing');
	},
	handleTouchMove(event) {
		let me = this;
		let scrollTop = me.option.scrollDom.scrollTop || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if (scrollTop > 0) return;
		me.currentY = event.touches[0].clientY;
		me.translateY = parseFloat(me.currentY - me.startY);
		if (me.translateY > 0) {
			document.body.addEventListener('touchmove', RefreshUtil.preventDefault, {
				passive: false
			}); //passive 参数不能省略，用来兼容ios和android
		}
		if (me.translateY >= topHeight) {
			me.translateY = topHeight;
		}
		if (me.translateY < 0) {
			me.translateY = top;
		}
		RefreshUtil.setTransform(me.option.scrollHtml, me.translateY + 'px');
	},
	handleTouchEnd(event) {
		document.body.removeEventListener('touchmove', RefreshUtil.preventDefault, {
			passive: false
		})
		let me = this;
		let scrollTop = me.option.scrollDom.scrollTop || document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if (scrollTop > 0) return;
		if (me.translateY >= topHeight) {
			me.option.expression().then(() => {
				RefreshUtil.setTransform(me.option.scrollHtml, top);
				setTimeout(() => {
					Util.removeClass(me.option.scrollHtml, 'refreshing');
				}, 500);

			})
			Util.addClass(me.option.scrollHtml, 'refreshing');
		} else {
			RefreshUtil.setTransform(me.option.scrollHtml, top);
		}

	},
	handleTouchCancle() {
		document.body.removeEventListener('touchmove', RefreshUtil.preventDefault, {
			passive: false
		})
		RefreshUtil.setTransform(me.option.scrollHtml, top);
	},
	preventDefault(e) {
		e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
	},
	setTransform(dom, a) {
		dom.style.transform = `translate3d(0,${a},0)`;
		dom.style.wekitTransform = `translate3d(0,${a},0)`;
	}

}
Vue.directive('refresh', {
	bind: function (el, binding, context) { // 当被绑定的元素插入到 DOM 中时……
		el.option = {
			el,
			expression: binding.value
		}
	},
	inserted: function (el, binding, context) {
		let pos = window.getComputedStyle(el, null).position,
			html = null,
			scrollDom;

		if (!el.option.expression || typeof el.option.expression !== 'function') {
			return
		}

		scrollDom = context.data.attrs ? context.data.attrs['scrollDom'] : null;
		if (!scrollDom) {
			scrollDom = document.documentElement
		} else {
			scrollDom = document.querySelector(scrollDom);
		}
		el.option.scrollDom = scrollDom;

		html = document.createElement("div");
		html.className = 'refresh-top';
		el.insertBefore(html, el.children[0]);
		el.option.scrollHtml = html;

		el.style.position = pos !== 'static' ? pos : 'relative';
		Util.addClass(el, 'refresh-animate');

		el.addEventListener('touchstart', RefreshUtil.handleTouchStart);
		el.addEventListener('touchmove', RefreshUtil.handleTouchMove);
		el.addEventListener('touchend', RefreshUtil.handleTouchEnd);
		el.addEventListener('touchcancle', RefreshUtil.handleTouchCancle);
	},
	update: function () {

	},
	componentUpdated: function () {

	},
	unbind: function (el) {
		el.removeEventListener('touchstart', RefreshUtil.handleTouchStart);
		el.removeEventListener('touchmove', RefreshUtil.handleTouchMove);
		el.removeEventListener('touchend', RefreshUtil.handleTouchEnd);
		el.removeEventListener('touchend', RefreshUtil.handleTouchCancle);
		document.body.removeEventListener('touchmove', RefreshUtil.preventDefault, {
			passive: false
		});
	}
})
