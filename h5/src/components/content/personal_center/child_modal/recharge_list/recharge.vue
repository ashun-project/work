<template>
    <div class="recharge-body">
        <div class="recharge" v-show="showPage">
            <my-header title="充值类型" bkUrl="/personalCenter">
                <router-link slot="h-right" to="/rechargeList" tag="span">充值记录</router-link>
            </my-header>
            <div class="recharge-head">
                <img class="hd" src="@/resource/images/photo1.jpg" alt="">
                <div class="cont">
                    <p class="name">{{user.userCode}}</p>
                    <p class="money">余额：
                        <span class="balance">{{balance | keepDecimalOf2}}元</span>
                    </p>
                </div>
            </div>

            <div class="recharge-tip">
                <i class="iconfont icon-warn"></i>
                <!--    <Icon type="ios-information-outline"></Icon> -->
                <span class="txt">
                    充值时，部分支付渠道充值金额随机1位小数，请您在付款时确认。
                </span>
            </div>

            <p class="recharge-typeTit">请选择充值方式</p>
            <ul class="recharge-types">
                <li class="item" v-for="(item,index) in payTypeList" :key="index" @click="goPage('/recharge/' + index, item)">
                    <img :src="item.payTopTypeIcon" class="logo" alt="">
                    <span class="txt">{{item.payTopTypeName}}
                        <span class="noTip" v-if="item.onAndOffList.length <=0">(暂无可用通道)</span>
                    </span>
                    <i class="iconfont icon-arrowRight"></i>
                </li>
            </ul>
        </div>
        <router-view class="recharge-view">
        </router-view>
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js';
export default {
    data () {
        return {
            balance: 0,
            showPage: true,
            payTypeList: [],   // 支付方式类型
        }
    },
    watch: {
        '$route' (n, o) {
            if (n.path === '/recharge') {
                this.showPage = true
            } else {
                this.showPage = false
            }
        }
    },
    filters: {
        keepDecimalOf2 (val) {
            return val ? val.toFixed(2) : "0.00";
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        },

    },
    methods: {
        goPage (path, item) {
            if (!item.onAndOffList || item.onAndOffList.length <= 0) {
                return
            }
            this.$router.push(path);
            sessionStorage.setItem('rechargeType', JSON.stringify(item));
        },
    },
    created () {
        //重新查询余额
        this.$http.post('/api/v2/user/queryBalance', '', { userId: true }).then(response => {
            if (response.data.code !== 0) return;
            this.balance = response.data.data.balance;
        });
        this.$http.post('/api/v2/user/getUsablePayType', '', { userId: true, loading: 2 }).then(response => {
            if (response.data.code !== 0) return;
            this.payTypeList = response.data.data;
        });
        this.showPage = true

    }
}
</script>
<style scoped lang="less">
@rem: 40rem;
@bg: #ec0022;
.recharge-body {
    background-color: #f2f2f2;
    height: 100%;
}
.recharge-view {
    position: absolute;
    left: 0;
    top: 2.2rem;
    right: 0;
    bottom: 0;
    background-color: #f2f2f2;
}
.recharge-head {
    display: flex;
    background-color: #fff;
    align-items: center;
    padding: 20 / @rem 50 / @rem;
    margin-bottom: 20 / @rem;
    .hd {
        margin-right: 20 / @rem;
        width: 130 / @rem;
        height: 130 / @rem;
        border-radius: 100%;
    }
    .cont {
        color: #999;
        .name {
        }
        .money {
            font-size: 30 / @rem;
        }
        .balance {
            color: @bg;
        }
    }
}
.recharge-tip {
    padding: 20 / @rem;
    background-color: #fff;
    color: @bg;
    display: flex;
    align-items: center;
    margin-bottom: 20 / @rem;
    .icon-warn {
        color: #e9a63d;
        font-size: 60 / @rem;
        margin-right: 20 / @rem;
    }
    .txt {
        font-size: 28 / @rem;
        font-weight: bold;
        line-height: 29 / @rem;
    }
}
.recharge-types {
    background-color: #fff;
    .item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
        padding: 16 / @rem 34 / @rem;
    }
    .logo {
        width: 70 / @rem;
        height: 70 / @rem;
        border-radius: 100%;
        margin-right: 20 / @rem;
    }
    .noTip {
        color: #999;
        font-size: 26 / @rem;
    }
    .txt {
        flex: 1;
        font-size: 30 / @rem;
        color: #666;
    }
    .icon-arrowRight {
        font-size: 50 / @rem;
        color: #aaa;
    }
}
.recharge-typeTit {
    padding: 0 34 / @rem;
    margin-bottom: 16 / @rem;
}
</style>
