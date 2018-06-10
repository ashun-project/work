<template>
    <div class="my-account">
        <div class="tab">
            <ul>
                <li v-for="item in tabList" :key="item.label" @click="label = item.label" :class="{active: label === item.label}">
                    <span>{{item.name}}</span>
                    <i v-if="item.interval"></i>
                </li>
            </ul>
        </div>
        <div class="account-content">
            <recharge v-if="label === 'trade_recharge'"></recharge>
            <withdraw v-if="label === 'trade_withdraw'"></withdraw>
        </div>
    </div>
</template>

<script>
import recharge from './trade_recharge'
import withdraw from './trade_withdraw'
export default {
    components: {
        recharge,
        withdraw
    },
    data () {
        return {
            label: this.$route.params.label || 'trade_recharge',
            tabList: [
                { name: '充值记录', label: 'trade_recharge', interval: true },
                { name: '提现记录', label: 'trade_withdraw' }
            ]
        }
    },
    created () {

    }
}
</script>

<style lang="less" scoped>
.tab {
    height: 40px;
    font-size: 16px;
    border-bottom: 2px solid #e2e2e2;
}
.tab li {
    float: left;
    padding: 0 20px;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    position: relative;
}
.tab li.active {
    color: @common-active-color;
    border-bottom: 2px solid @common-active-color;
}
.tab li.active span {
    color: @common-color;
}
.tab li i {
    position: absolute;
    right: 0;
    top: 15px;
    height: 10px;
    width: 1px;
    background: #c0c0c0;
}
.account-content {
    padding-top: 15px;
}
</style>