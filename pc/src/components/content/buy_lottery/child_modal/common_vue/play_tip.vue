<template>
    <div class="play_tip">
        <span class="icon">
            <Icon type="alert" color="#fff" :size="10"></Icon>
        </span>
        <span class="tip">玩法提示 :</span>
        <span v-html="playDesc"></span>
        <span class='maxOdd' v-if="isLiuHe && hasLogin">【最大赔率：{{maxOdd}}】</span>
    </div>
</template>
<script>
export default {
    props: {
        playDesc: {
            type: String,
            default: ''
        },
        maxOdd: {
            type: Number,
            default: null
        },
        isLiuHe: {
            type: Boolean,
            default: false
        },
        hasLogin: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="less" scoped>
.play_tip {
    width: 80%;
    font-size: 14px;
    word-wrap: break-word;
    word-break: normal;
}
.play_tip .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: @play-tip-icon-bg;
    text-align: center;
    line-height: 20px;
    border-radius: 50%;
}
.play_tip .tip {
    margin: 0 5px;
    color: @play-tip-color;
}
.play_tip .maxOdd {
    color: @play-tip-odds-color;
}
</style>


