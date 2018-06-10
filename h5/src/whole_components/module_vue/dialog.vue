<template>
    <mt-popup v-model="show" class="ui-dialog" :modal="modal" :closeOnClickModal="closeOnClickModal" position="center">
        <slot name="d-head">
            <div class="head" v-if="title" v-html="title"></div>
        </slot>
        <div class="d-body">
            <slot></slot>
        </div>
        <slot name="d-food">
            <div class="btn-group">
                <span class="btn sure" @click="close(1)" v-show="btnSure">{{btnSure}}</span>
                <span class="btn cancle" @click="close" v-show="btnCancle">{{btnCancle}}</span>
            </div>
        </slot>
    </mt-popup>
</template>
<script>
export default {
    props: {
        title: {
            default: '提示'
        },
        value: {
            default: false
        },
        btnSure: {
            default: '确定'
        },
        btnCancle: {
            default: '关闭'
        },
        closeOnClickModal: {
            default: true
        },
        modal: true
    },
    data () {
        return {
            show: this.value
        }
    },
    watch: {
        value (v) {
            this.show = v
        },
        show (v) {
            this.$emit('input', v)
        }
    },

    methods: {
        close (type) {
            this.show = false
            if (type) {
                this.$emit('on-end')
            }
        },
        open () {
            this.show = true
        }
    }
}
</script>
<style lang="less">
@rem: 40rem;
.ui-dialog {
    width: 90%;
    border-radius: 6px;
    padding: 0.5rem;
    .head {
        height: 80 / @rem;
        line-height: 80 / @rem;
        text-align: center;
        border-bottom: 1px solid #f2f2f2;
    }
    .d-body {
        padding: 20 / @rem 0;
        min-height: 250 / @rem;
    }
    .btn-group {
        font-size: 0;
        text-align: center;
        margin-left: -5%;
        padding: 0 20 / @rem;
        .btn {
            display: inline-block;
            width: 45%;
            text-align: center;
            font-size: 30 / @rem;
            height: 70 / @rem;
            line-height: 70 / @rem;
            margin-left: 5%;
            font-weight: normal;
            border: 1px solid #f3f3f3;
            border-radius: 4px;
            &.sure {
                background-color: #ff7614;
                color: #fff;
            }
            &.cancle {
                background-color: #cccccc;
                color: #666;
            }
        }
    }
}
</style>

