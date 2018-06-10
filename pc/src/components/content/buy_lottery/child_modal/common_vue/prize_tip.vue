<template>
    <div class="wrap" :class="[!hasLogin ? 'no-login' : '']">
        <div class="top">
            <span>注数&nbsp;</span>
            <strong>{{count}}</strong>
            <span>&nbsp;注</span>
            <span>金额&nbsp;</span>
            <strong>{{totalmoney}}</strong>
            <span>&nbsp;元&nbsp;</span>
            <span v-if="!verticalLayout && hasLogin">若中奖,单注最高中&nbsp;
                <strong class="red-font">{{prizeMoney}}</strong>&nbsp;元</span>
        </div>
        <div class="bottom" v-if="verticalLayout">
            <span>若中奖,单注最高中&nbsp;
                <strong class="red-font">{{prizeMoney}}</strong>&nbsp;元</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        count: {
            default: 0,
            type: Number,
        },
        money: {
            default: 0,
            type: [Number, String]
        },
        singlePrizeMoney: {
            default: 0,
            type: [Number, String]
        },
        verticalLayout: {
            default: true,
            type: Boolean,
        },
        hasLogin: {
            default: true,
            type: Boolean
        }
    },
    computed: {
        totalmoney () {
            return (+this.money).toFixed(2);
        },
        prizeMoney () {
            return (+this.singlePrizeMoney).toFixed(2);
        }
    }
}
</script>

<style lang="less"scoped>
.wrap {
    height: 35px;
    font-size: 14px;
    margin-top: 2px;
}
.wrap .top,
.wrap .bottom {
    height: 18px;
    line-height: 18px;
}
.wrap.no-login .top {
    line-height: 35px;
}
.wrap.no-login .bottom {
    display: none;
}
.wrap strong {
    color: @prize-tip-color;
}
</style>



