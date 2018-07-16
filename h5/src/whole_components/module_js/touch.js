import Vue from 'vue'

function Touch(el, binding, type) {
	var me = this;
	me.obj = el;
	me.binding = binding;
	me.timeOutEvent = true;
	me.callBack = typeof (binding.value) == "object" ? binding.value.fn : binding.value;

	me.obj.addEventListener("touchstart", function (e) {
		me.timeOutEvent = setTimeout(function () {
			me.callBack(el, binding.value);
		}, 500);
		return false;
	}, false);

	me.obj.addEventListener("touchmove", function (e) {
		clearTimeout(me.timeOutEvent);
		me.timeOutEvent = 0;
	}, false);

	me.obj.addEventListener("touchend", function (e) {
		clearTimeout(me.timeOutEvent);
		if (me.timeOutEvent != 0) {}
		return false;
	}, false);


};


Vue.directive("longtap", {
	bind: function (el, binding) {
		new Touch(el, binding, "longtap");
	}
});
