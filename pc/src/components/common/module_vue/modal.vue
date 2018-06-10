<template>
    <Modal v-model="isShow" :width="width" :mask-closable="maskClosable" :closable="false" :class-name="claName" @on-cancel="$emit('btn-cancel')">
        <!-- 页眉 -->
        <div slot='header'>
            <span>{{title}}</span>
            <span @click="$emit('btn-cancel')">
                <Icon type="close-round"></Icon>
            </span>
        </div>
        <!-- 内容 -->
        <slot name="content"></slot>
        <slot name="lee-footer"></slot>
        <!-- 页脚 -->
        <div slot="footer" v-if="hasFooter">
            <Button type="primary" @click="$emit('btn-ok')" v-if="hasOkBtn">{{okText}}</Button>
            <Button type="text" @click="$emit('btn-cancel')" v-if="hasNoBtn">{{noText}}</Button>
        </div>
        <!-- 默认无页脚 -->
        <div slot="footer"></div>
    </Modal>
</template>
<script>
export default {
    props: {
        title: { //标题
            type: String,
            default: ''
        },
        modalShow: { //显示与隐藏弹框
            type: Boolean,
            default: false
        },
        claName: { //类名
            type: String,
            default: ''
        },
        width: { //宽度
            type: [Number, String],
            default: 520
        },
        maskClosable: { //是否用遮罩层关闭
            type: Boolean,
            default: true
        },
        hasFooter: { //是否显示页脚
            type: Boolean,
            default: true
        },
        hasOkBtn: { //是否显示确定按钮
            type: Boolean,
            default: true
        },
        hasNoBtn: { //是否显示取消按钮
            type: Boolean,
            default: true,
        },
        noText: { //取消按钮文字
            type: String,
            default: '取消'
        },
        okText: { //确定按钮文字
            type: String,
            default: '确定'
        }
    },
    computed: {
        isShow: {
            get: function () {
                return this.modalShow;
            },
            set: function (val) {

            }
        },
        // sureText(){
        //     return this.okText;
        // },
        // cancelText() {
        //     return this.noText;
        // }
    }
}
</script>
<style scoped>
.ivu-modal-mask {
    background-color: rgba(55, 55, 55, 0.6);
}
.v-transfer-dom >>> .ivu-modal {
    top: 220px;
}
.v-transfer-dom >>> .ivu-icon-close-round:hover {
    color: #444;
}
.v-transfer-dom >>> .ivu-modal-header {
    height: 40px;
    color: #fff;
    font-weight: normal;
    border: none;
    background: #be1204;
}
.v-transfer-dom >>> .ivu-modal-header span {
    float: left;
}
.v-transfer-dom >>> .ivu-modal-header span:last-child {
    float: right;
    cursor: pointer;
}
.v-transfer-dom >>> .ivu-modal-content {
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -ms-border-radius: 4px;
    -moz-border-radius: 4px;
    -o-border-radius: 4px;
    border: 1px solid #be1204;
}
.v-transfer-dom >>> .ivu-modal-body {
    font-size: 14px;
}
.v-transfer-dom >>> .ivu-modal-close {
    top: 5px;
}
.v-transfer-dom >>> .ivu-icon-ios-close-empty {
    color: #fff;
}
.v-transfer-dom >>> .ivu-icon-ios-close-empty:hover {
    color: #444;
}
.v-transfer-dom >>> .ivu-modal-header-inner {
    height: 12px;
    line-height: 12px;
    color: #fff;
    font-weight: normal;
}
.v-transfer-dom >>> .ivu-modal-footer button {
    width: 80px;
    height: 32px;
    line-height: 18px;
}
.v-transfer-dom >>> .ivu-modal-footer .ivu-btn-text {
    background: #a9a9a9;
    color: #fff;
}
</style>


