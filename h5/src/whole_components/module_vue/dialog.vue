<template>
    <mt-popup v-model="show" class="ui-dialog" :modal="modal" :closeOnClickModal="closeOnClickModal" position="center">
        <i class="iconfont icon-close" @click="close" v-if="showClose"></i>
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
        showClose: {
            default: false
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
            if (v) {
                document.body.style.height = "100%";
                document.body.style.overflow = "hidden";
                document.documentElement.style.overflow = "hidden";
                document.documentElement.style.height = "100%";
            } else {
                document.body.style.overflow = "auto";
                document.body.style.height = "";
                document.documentElement.style.overflow = "auto";
                document.documentElement.style.height = "";
            }

            this.$emit('input', v)
        }
    },

    methods: {
        close (type) {
            this.show = false;

            if (type) {
                this.$emit('on-end')
            }
        },
        open () {
            this.show = true
        }
    },
    beforeDestroy () {
        document.body.style.overflow = "auto"
    }
}
</script>
<style lang="less">
@rem: 40rem;
.ui-dialog {
    width: 90%;
    border-radius: 6px;
    padding: 0.5rem;
    .icon-close {
        position: absolute;
        right: 10px;
        top: 0;
        color: #ec0022;
        font-size: 1.4rem;
        z-index: 1;
    }
    .head {
        height: 80 / @rem;
        line-height: 80 / @rem;
        text-align: center;
        border-bottom: 1px solid #f2f2f2;
        position: relative;
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
.ui-dialog-red {
    width: 90%;
    border-radius: 6px;
    padding: 0;
    .icon-close {
        color: #fff;
    }
    .head {
        color: #fff;
        background-color: #ec0022;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }
}
</style>

