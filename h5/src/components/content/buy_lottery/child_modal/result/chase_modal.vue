<template>

    <div class="chase-num">
        <my-header :z-index="1001">
            <div slot="h-left" @click="backLottery()">
                <span>
                    <i class="iconfont icon-arrowLeft" style="color: #fff; font-size:26px"></i>
                </span>
            </div>
            <div slot="h-center">
                智能追号
            </div>
        </my-header>
        <div class="tabs">
            <span :class="{active: tabType === 1}" @click="tabTypeChange(1)">普通追号</span>
            <span :class="{active: tabType === 2}" @click="tabTypeChange(2)">高级追号</span>
        </div>
        <div class="chase-params">
            <div>
                <span>追号</span>
                <span class="analog-input">
                    <input class="" v-model="basic.periodNum" type="number" @blur="inputBlur('basic', 'periodNum', true)" @input="inputChage('basic', 'periodNum', true)">
                </span>
                <span>期数</span>
            </div>
            <div>
                <span>起始</span>
                <span class="analog-input">
                    <input class="" v-model="basic.odds" type="number" @blur="inputBlur('basic', 'odds')" @input="inputChage('basic', 'odds')">
                </span>
                <span>倍数</span>
            </div>
        </div>
        <div class="chase-params second-chase" v-if="tabType === 2">
            <div>
                <span>每隔</span>
                <span class="analog-input">
                    <input class="" v-model="senior.periodNum" type="number" @blur="inputBlur('senior', 'periodNum')" @input="inputChage('senior', 'periodNum')">
                </span>
                <span>期&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <div>
                <span>倍数</span>
                <span class="analog-input">
                    <input class="" v-model="senior.odds" type="number" @blur="inputBlur('senior', 'odds')" @input="inputChage('senior', 'odds')">
                </span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
        </div>
        <table class="ct-body" cellspacing="0" cellpadding="0">
            <thead class="ct-header">
                <tr>
                    <th class="period">期数</th>
                    <th class="odds">倍数</th>
                    <th class="price">金额</th>
                    <th class="time">预计开奖时间</th>
                </tr>
            </thead>
            <tbody class="ct-content">
                <tr v-for="(item, idx) in periodList" :key="idx">
                    <td class="period">{{item.periodNo}}</td>
                    <td class="odds">
                        <span class="analog-input">
                            <input v-model="item.odds" type="number" @blur="modifyList(item, idx, 1)" @input="modifyList(item, idx)">
                        </span>
                    </td>
                    <td class="price">{{item.bettingMoney}}</td>
                    <td class="time">{{item.lotteryTime}}</td>
                </tr>
            </tbody>
        </table>
        <!-- 底部模块 -->
        <div class="result-page">
            <div class="result-content">
                <dl class="aui-row">
                    <dt>
                        <div class="col-xs-25">
                            <!-- <i-switch v-model="autoStop"></i-switch> -->
                            <mt-switch v-model="autoStop"></mt-switch>
                        </div>
                        <div class="col-xs-75">
                            <span>中奖后停止追号</span>
                            <br/> 共{{total.num}}注
                            <span class="text-warning">{{total.money}}元</span>
                        </div>
                    </dt>
                    <dd class="aui-bg-danger text-center order-btn" @click="order()">
                        <span class="block aui-text-white">投注</span>
                        <span class="loading" v-show="loading">
                            <span>
                                <i class="iconfont icon-loading2"></i>
                            </span>
                        </span>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>

<script>
import formatDate from '@/components/common/module_js/format_date'
export default {
    props: {
        money: {
            type: Number
        },
        lotteryNum: {
            type: Number
        },
        period: {
            type: String
        }
    },
    data () {
        return {
            loading: false,
            tabType: 1,
            autoStop: true,
            periodList: [],
            total: {
                money: 0,
                num: 0
            },
            // 基本参数   
            basic: {
                periodNum: 10,
                odds: 1
            },
            // 高级参数
            senior: {
                periodNum: 2,
                odds: 2
            }
        }
    },
    watch: {
        period (n, o) {
            this.periodChange(o)
        }
    },
    methods: {
        // 修改list列表中的某一个
        modifyList (item, idx, num) {
            let obj = Object.assign({}, item);
            let oldMoney = obj.bettingMoney;
            obj.odds = parseInt(obj.odds) || '';

            if (!obj.odds && num) obj.odds = num;
            if (obj.odds > 100000) obj.odds = 100000;
            if (obj.odds) {
                obj.bettingMoney = obj.odds * (this.money * 100) / 100;
                this.periodList.splice(idx, 1, obj);
                let money = (Number(this.total.money) + obj.bettingMoney - oldMoney).toFixed(2)
                if (money > 9999999.99) {
                    this.$Message('投注金额不能大于9999999.99');
                    return;
                }
                this.$set(this.total, 'money', money);
            }

        },
        // tab切换
        tabTypeChange (num) {
            this.tabType = num;
            this.changeList();
        },
        // 输入框失去焦点
        inputBlur (obj, value, type) {
            let num = parseInt(this[obj][value]) || '';
            if (!num) {
                this.$set(this[obj], value, 1);
            }
            if (type) {
                this.getPeriodInfo()
            } else {
                this.changeList()
            }
        },
        // 输入框改变
        inputChage (obj, value, type) {
            let num = parseInt(this[obj][value]) || '';
            if (num > 100000) {
                this.$set(this[obj], value, 100000);
            }
            if (num) {
                if (type) {
                    this.getPeriodInfo()
                } else {
                    this.changeList()
                }
            }
        },
        // 修改列表
        changeList () {
            let vm = this;
            let money = 0;
            let odds = parseInt(vm.basic.odds);
            this.periodList.forEach((item, idx) => {
                if (vm.tabType === 2) {
                    if (idx % vm.senior.periodNum === 0 && idx > 0) {
                        odds = odds * parseInt(vm.senior.odds);
                    }
                }
                item.lotteryTime = formatDate.getFormatDate(item.prizeTime, 'yymmddhhmmss');
                item.odds = odds;
                item.bettingMoney = odds * (vm.money * 100) / 100;
                money += odds * vm.money;
            });
            if (money > 9999999.99) {
                this.$Message('投注金额不能大于9999999.99')
            }
            this.$set(this.total, 'money', money.toFixed(2));
            this.$set(this.total, 'num', this.periodList.length * this.lotteryNum);
        },
        // 过滤掉上一期的数据
        periodChange (num) {
            let old = this.periodList.filter(item => item.periodNo === num)[0];
            this.periodList = this.periodList.filter(item => item.periodNo !== num);
            if (old) {
                this.$set(this.total, 'money', this.total.money - old.bettingMoney);
                this.$set(this.total, 'num', this.total.num - 1);
            }
        },
        // 获取列表
        getPeriodInfo () {
            let vm = this;
            let num = parseInt(this.basic.periodNum);
            if (!num) num = 1;
            this.$http.post('/api/v2/lottery/queryLotteryRecordList', { lotteryId: this.$route.params.id, num: num }).then(response => {
                if (response.data.code !== 0) return;
                vm.periodList = response.data.data.recordList;
                if (vm.periodList.length < num) {
                    vm.$set(vm.basic, 'periodNum', vm.periodList.length);
                }
                vm.changeList();
            })
        },
        // 返回投注列表页
        backLottery () {
            this.$emit('get-chase-result')
        },
        // 投注
        order () {
            this.loading = true;
            if (this.total.money > 9999999.99) {
                this.$Message('投注金额不能大于9999999.99')
            }
            this.$emit('get-chase-result', { list: this.periodList, totalMoney: this.total.money, autoStop: this.autoStop });
        }
    },
    created () {
        this.getPeriodInfo();
    }
}
</script>

<style scoped>
.chase-num .tabs {
    height: 2rem;
    background: #ffdfd7;
    text-align: center;
}
.chase-num .tabs > span {
    float: left;
    width: 50%;
    height: 100%;
    line-height: 1.9rem;
}
.chase-num .tabs > span.active {
    color: #ec0022;
    border-bottom: 2px solid #e12b2b;
}
.chase-num .chase-params {
    height: 2rem;
    padding: 0.3rem 0;
}
.chase-num .second-chase {
    padding-top: 0;
    height: 1.7rem;
}
.chase-num .chase-params > div {
    width: 50%;
    float: left;
    height: 100%;
    text-align: center;
}
.chase-num .chase-params > div span {
    display: inline-block;
    height: 100%;
    font-size: 0.6rem;
}
.chase-num .chase-params > div span input {
    border: 1px solid #eee;
    border-radius: 3px;
    width: 60px;
    text-align: center;
    max-height: 90%;
    color: #ec0022;
    font-size: 0.6rem;
}
.chase-num .ct-body {
    text-align: center;
    width: 100%;
}
.chase-num .ct-body .ct-header {
    font-size: 0.7rem;
    line-height: 1.6rem;
    background: #eee;
    font-weight: normal;
}
.chase-num .ct-body .ct-header th {
    font-weight: normal;
}
.chase-num .ct-body .ct-header .period {
    width: 30%;
}
.chase-num .ct-body .ct-header .odds {
    width: 20%;
}
.chase-num .ct-body .ct-header .price {
    width: 20%;
}
.chase-num .ct-body .ct-header .time {
    width: 30%;
}
.chase-num .ct-body .ct-content tr {
    font-size: 0.6rem;
    height: 1.8rem;
}
.chase-num .ct-body .ct-content tr td {
    border-bottom: 1px solid #eee;
}
.chase-num .ct-body .ct-content tr input {
    border: 1px solid #eee;
    height: 25px;
    width: 100%;
    text-align: center;
    color: #ec0022;
    font-size: 0.6rem;
}

.chase-num .result-page .result-content {
    background: #2a2d32;
    width: 100%;
    line-height: 2.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    color: #fff;
    font-size: 0.66rem;
}
.chase-num .result-page .result-content dt {
    width: 70%;
    float: left;
}
.chase-num .result-page .result-content dt > div {
    float: left;
}
.chase-num .result-page .result-content dt > div.col-xs-25 {
    width: 25%;
    /* padding-top: 0.5rem; */
    padding: 0.6rem 0.3rem 0;
}
.chase-num .result-page .result-content dt > div.col-xs-75 {
    line-height: 1rem;
    padding-top: 0.3rem;
}
.chase-num .result-page .result-content .text-warning {
    color: #ffc107;
}
.chase-num .result-page .result-content dd {
    width: 30%;
    float: left;
    background-color: rgb(241, 23, 23);
    text-align: center;
}
.chase-num .result-page .result-content .order-btn {
    position: relative;
}
.chase-num .result-page .result-content .order-btn .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background: rgba(243, 245, 248, 0.39);
    overflow: hidden;
}
.chase-num .result-page .result-content .order-btn .loading span {
    display: inline-block;
    -webkit-animation: circle 1s infinite linear;
}
@keyframes circle {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.chase-num .result-page .aui-col-xs-6 {
    line-height: 1rem;
    font-size: 0.6rem;
    padding-top: 0.3rem;
}
.chase-num .result-page .aui-col-xs-3 {
    padding-left: 0.2rem;
}
</style>

