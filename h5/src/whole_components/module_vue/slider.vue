<template>
    <div class="ui-slider">
        <div class="start">
            <slot name="start">
                <!-- <span>{{min}}</span> -->
            </slot>
        </div>

        <div class="slide-box" ref="sliderBox" :style="{margin: '0 ' + dotWidth/2 + 'px'}">
            <div class="slider" ref="slider" :style="{height: barHeight + 'px'}"></div>
            <div class="progress" ref="progress" :style="{height: barHeight + 'px'}"></div>
            <div class="dot" ref="dot" :style="[dotWrapStyle]">
                <div class="dot-inner" :style="[dotStyle]">
                    <div class="tip" ref="tip" v-show="tipShow">
                        <slot name="tip">
                            {{currentValue}}
                        </slot>
                    </div>
                </div>
            </div>
        </div>

        <div class="end">
            <slot name="end">
                <!-- <span>{{max}}</span> -->
            </slot>
        </div>
        <input :value="currentValue" type="range" style="display:none">
    </div>
</template>
<script>
const bh = 10;
function prefix (attr) {
    let style = document.createElement('div').style;
    if (style.webkitTransition) {
        return '-webkit-' + attr.toUpperCase;
    }
    if (style.MozTransition) {
        return '-moz-' + attr.toUpperCase;
    }
    return attr;
}
export default {
    props: {
        value: {
            type: [String, Number],
            default: 0
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        dotWidth: {
            type: Number,
            default: 16,
            required: false
        },
        barHeight: {
            type: Number,
            default: 5,
            required: false
        },
        stopPropagation: {
            type: Boolean,
            default: false
        },
        fixedNum: {
            type: Number,
            default: 0
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isOdd: {  // 是否值是偶数
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            currentValue: this.value,
            tipShow: false
        }
    },
    computed: {
        dotStyle () {
            return {
                width: this.dotWidth + 'px',
                height: this.dotWidth + 'px',
                left: bh / 2 + 'px'
            }
        },
        dotWrapStyle () {
            return {
                width: this.dotWidth + bh + 'px',
                height: this.dotWidth + bh + 'px',
                marginTop: -(this.dotWidth + bh) / 2 + 'px',
                left: -(this.dotWidth + bh) / 2 + 'px',
            }
        }
    },
    watch: {
        value (val) {
            this.currentValue = val;
            if (!this.draging) {
                this.refresh();
            }
        },
    },
    methods: {
        setValueOnPos (value) {

            if (value >= this.maxW) {
                value = this.maxW
            } else if (value < 0) {
                value = 0;
            }
            let translateValue = `translateX(${value}px)`

            this.$refs.dot.style[prefix('transform')] = translateValue
            this.$refs.progress.style.width = `${value}px`;

            let val = Number(Number(value / this.maxW * (this.max - this.min)) + this.min).toFixed(this.fixedNum);
            if (val % 2 === 1 && this.isOdd) {
                val = Number(val) + 1;
                val = val > this.max ? this.max : val
            }
            this.currentValue = val
        },
        sliderClick (e) {
            let touch;
            if (e.targetTouches && e.targetTouches[0]) touch = e.targetTouches[0];
            let diffX = Number(touch.clientX) - Number(this.slider.getBoundingClientRect().left)

            if (diffX > 0 && diffX <= this.maxW) {
                this.draging = false
                this.$emit('input', Number(Number(diffX / this.maxW * (this.max - this.min)) + this.min).toFixed(this.fixedNum));
            }

            e.stopPropagation();
            e.preventDefault();
        },
        movestart (e) {
            if (this.disabled) return
            if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0];

            this.draging = true
            let style = this.dot.style;
            let match = this.dot.style[prefix('transform')].match(/\-?[0-9]+\.?[0-9]*/g, '');
            this.left = Number(match ? match[0] : 0);

            this.souceX = e.clientX;
            this.tipShow = true
        },
        moving (e) {
            if (this.disabled) return
            if (this.stopPropagation) {
                e.stopPropagation()
            }
            e.preventDefault()
            if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0];
            let diffX = e.clientX - this.souceX;
            if (diffX == 0) return
            //var stepCount = Math.ceil((this.max - this.min) / 1);
            this.setValueOnPos(e.clientX - this.souceX + this.left);

            this.$emit('input', this.currentValue);
        },
        moveEnd () {
            if (this.disabled) return;
            this.tipShow = false;
            this.draging = false;
            this.$emit('on-end', this.currentValue);


        },
        initEvents () {
            this.dot.addEventListener('touchstart', this.movestart, { passive: false });
            this.dot.addEventListener('touchmove', this.moving, { passive: false });
            this.dot.addEventListener('touchend', this.moveEnd, { passive: false });

            ///    this.$refs.sliderBox.addEventListener('touchstart', this.sliderClick)
            window.addEventListener('resize', this.refresh);
        },
        unbindEvents () {
            this.dot.removeEventListener('touchstart', this.movestart);
            this.dot.removeEventListener('touchmove', this.moving);
            this.dot.removeEventListener('touchend', this.moveEnd);
            //    this.$refs.sliderBox.removeEventListener('touchstart', this.sliderClick)
            window.removeEventListener('resize', this.refresh);
        },
        refresh () {
            this.maxW = this.$refs.slider.clientWidth;
            this.setValueOnPos(this.maxW * (this.value - this.min) / (this.max - this.min));

        },
    },
    destroyed () {
        this.unbindEvents();
    },
    mounted () {
        let vm = this;
        vm.$nextTick(() => {
            vm.dot = this.$refs.dot;
            vm.slider = this.$refs.slider;
            vm.progress = this.$refs.progress;
            vm.refresh();
            if (vm.min < vm.max) {
                vm.initEvents();
            }
        })

    }
}
</script>
<style lang="less">
.ui-slider {
    position: relative;
    display: flex;
    user-select: none;
    .start {
    }
    .end {
    }
    .slide-box {
        flex: 1;
        position: relative;
    }
    .slider {
        width: 100%;
        height: 6px;
        background-color: #eee;
        border-radius: 15px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
    }
    .progress {
        position: absolute;
        left: 0;
        top: 50%;
        height: 6px;
        transform: translate(0, -50%);
        background-color: #ff7614;
        border-radius: 15px;
    }
    .dot {
        position: absolute;
        top: 50%;
        background: transparent;
    }
    .dot-inner {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        box-shadow: 0 0 0 3px rgba(255, 188, 92, 0.5);
        border-color: #ff7614;
        border-radius: 100%;
        background: #ff7614;
        .tip {
            position: absolute;
            display: block;
            font-size: 14px;
            white-space: nowrap;
            padding: 5px;
            min-width: 20px;
            text-align: center;
            color: #fff;
            border-radius: 5px;
            border: 1px solid #ff7614;
            background-color: #ff7614;
            top: -9px;
            left: 50%;
            transform: translate(-50%, -100%);
            line-height: normal;
            &:before {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                width: 0;
                height: 0;
                border: 5px solid transparent;
                border-top-color: inherit;
                transform: translate(-50%, 0);
            }
        }
    }
}
</style>

