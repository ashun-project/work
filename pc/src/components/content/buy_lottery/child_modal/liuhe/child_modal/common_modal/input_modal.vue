<template>
    <span class="price" @mouseleave="hidePirce()" @keydown="tabDown($event)">
        <input type="number" v-model="value" @input="fn2" @focus="showPrice = true" :class="{'active':showPrice}">
        <transition name="down-fade">
            <div class="bomb-box" v-show="showPrice">
                <p @click="selectPrice(100)">100元</p>
                <p @click="selectPrice(500)">500元</p>
                <p @click="selectPrice(1000)">1000元</p>
                <p @click="selectPrice(5000)">5000元</p>
            </div>
        </transition>
    </span>
</template>

<script>
export default {
    model: {    // 使用model， 这儿2个属性，prop属性说，我要将msg作为该组件被使用时（此处为aa组件被父组件调用）v-model能取到的值，event说，我emit ‘cc’ 的时候，参数的值就是父组件v-model收到的值。
        prop: 'msg',
        event: 'cc'
    },
    props: {
        msg: ''
    },
    data () {
        return {
            value: this.msg,
            showPrice: false,
        }
    },
    watch: {
        msg (n) {
            this.value = n;
        }
    },
    methods: {
        fn2 () {
            this.value = parseInt(this.value);
            if (this.value <= 0) this.value = 1;//379 北京28玩金额输入框可鼠标滑动出负数，投注成功。 at 2018/02/02 by Daniel 
            if (this.value > 100000) this.value = 100000;
            this.$emit('cc', this.value)
        },
        hidePirce () {
            this.showPrice = false;
        },
        selectPrice (price) {
            this.value = price;
            this.$emit('cc', this.value)
        },
        tabDown (e) {
            if (e.keyCode === 9) { //tab
                this.showPrice = false;
            }
        }
    }
}
</script> 

<style lang="less" scoped>
.price input[type='number'] {
    border: 1px solid #dddee1;
    outline: none;
    transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}
.price input[type='number'].active {
    border-color: @border-color;
    box-shadow: 0 0 2px @box-shadow;
    -webkit-box-shadow: 0 0 2px @box-shadow;
    -moz-box-shadow: 0 0 2px @box-shadow;
    -ms-box-shadow: 0 0 2px @box-shadow;
    -o-box-shadow: 0 0 2px @box-shadow;
}
</style>
