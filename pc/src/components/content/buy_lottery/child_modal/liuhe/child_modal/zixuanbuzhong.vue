<template>
    <div class="zhongyi">
        <odds></odds>
        <div class="tab">
            <ul>
                <li v-for="item in tabList" :key="item.id" @click="changeList(item)" :class="{active: selectLeast === item.selectLeast}">
                    <span>{{item.name}}</span>
                </li>
            </ul>
            <!--中奖提示 -->
            <div class='prize_example'>
                <play-example :bettingExample="playTipInfo.bettingExample" :prizeDesc="playTipInfo.prizeDesc"></play-example>
            </div>
            <!-- 中奖提示说明 -->
            <!-- 玩法说明 -->
            <div class='tip-wrap'>
                <play-tip :playDesc="playTipInfo.playDesc" :isLiuHe="true" :maxOdd="maxOdd" :hasLogin="!!user.userId"></play-tip>
            </div>
            <!-- 玩法说明结束 -->
        </div>
        <div class="detail-thead nav-bg">
            <ul>
                <li v-for="item in 5" :key="item">
                    <div class="container">
                        <span class="num">号码</span>
                        <span class="price">勾选</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="detail-body">
            <ul>
                <li v-for="(item, idx) in listData" :key="idx">
                    <div class="container">
                        <span class="num">
                            <i class="ball" :style="{background: item.clr}">{{item.ball}}</i>
                        </span>
                        <span class="price">
                            <Checkbox class="check-price" v-model="item.selected" @on-change="checkboxChange()" :disabled="selected.length >= selectMust && !item.selected"></Checkbox>
                            <!-- <input type="checkbox" class="check-price" v-model="item.selected" @change="checkboxChange()" :disabled="selected.length >= selectMust && !item.selected"> -->
                        </span>
                    </div>
                </li>
                <li>
                    <div class="container"></div>
                </li>
            </ul>
            <div class="clr"></div>
        </div>
        <div class="operation">
            <div class="price lf">
                <span class="minus icon-m-p lf" @click="minusPlus(-1)">
                    <Icon type="minus"></Icon>
                </span>
                <span class="price-input lf">
                    <InputNumber :max="parseInt(singleLimit)" :min="1" v-model="price"></InputNumber>
                </span>
                <span class="plus icon-m-p lf" @click="minusPlus(1)">
                    <Icon type="plus"></Icon>
                </span>
                <div class="clr"></div>
            </div>
            <div class="company lf">
                <span v-for="(item, idx) in companyList" :class="{active: item.value === companyValue}" :key="idx" @click="getCompanyValue(item.value)">
                    {{item.label}}
                </span>
            </div>
            <div class="total lf" v-if="num">
                <prize-tip :count="num" :money="money" :singlePrizeMoney="singlePrizeMoney" :hasLogin="!!user.userId"></prize-tip>
            </div>
            <div class="add-note lf" @click="add">
                <span>
                    <Icon type="plus-round" size="12"></Icon>
                </span>
                <b>添加注单</b>
            </div>
        </div>
    </div>
</template>

<script>
import liuhe from './common_modal/handle_data.js'
// import popupModal from './common_modal/popup.vue'
import inputValue from './common_modal/input_modal.vue'
import odds from './common_modal/odds.vue'
import playTip from '../../common_vue/play_tip.vue'
import playExample from '../../common_vue/betting_example.vue'
import prizeTip from '../../common_vue/prize_tip.vue'
export default {
    props: {
        data: {
            type: [Array, Object]
        }
    },
    components: {
        inputValue,
        // popupModal,
        odds,
        playTip,
        playExample,
        prizeTip
    },
    data () {
        return {
            tabList: [],
            selectMust: '',
            selectLeast: '',
            listData: [],
            selected: [],
            price: 0,
            listType: ['701001', '701002', '701003', '701004', '701005', '701006', '701007', '701009'],
            orderList: [],
            companyList: [                 // 金额单位
                { value: 1, label: '元' },
                { value: 10, label: '角' },
                { value: 100, label: '分' }
            ],
            singleLimit: 0,
            companyValue: 1,               // 当前选中的company
            hasClick: false,                //是否多次空投
            playTipInfo: {},
            num: 0,
            // odd:  0                        //最大赔率
        }
    },
    computed: {
        money () { //总金额
            return this.num * this.price / this.companyValue;
        },
        singlePrizeMoney () { //单注最高中奖金额
            return this.price / this.companyValue * this.maxOdd;
        },
        newSingleMoney () { //单注金额
            return this.price / this.companyValue;
        },
        maxOdd () {
            return Math.max(...this.listData.map(item => item.maxOdds));
        },
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        minusPlus (num) { //操作单注金额
            num += this.price;
            if (num < 1 || num > parseInt(this.singleLimit)) {
                return;
            }
            this.price = num;
        },
        // 元角分发生变化时
        getCompanyValue (num) {
            this.companyValue = num;
        },
        add () { //添加注单
            if (this.user && !this.user.userId) {
                this.$store.commit('getShouldLogin', true);
                return
            }
            this.commit();
            this.$emit('add-note', this.orderList);
            // console.log(this.orderList);
            this.cancel();
        },
        bettingAmount (betballs, num) {
            var results = [];
            var balls = betballs.split(",");
            for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
                var cur = [];
                for (var j = 0, len2 = balls.length; j < len2; j++) {
                    if (i >> j & 1) {
                        cur.push(balls[j]);
                    }
                }
                if (cur.length == num) {
                    results.push(cur)
                }
            }
            return results;
        },
        checkboxChange () {
            this.selected = [];
            this.listData.forEach(item => {
                if (item.selected) this.selected.push(item);
            })
            //计算注数和金额
            let balls = this.selected.map(item => item.ball);
            let noteNum = this.bettingAmount(balls.join(','), this.selectLeast);
            this.num = noteNum.length;
        },
        changeList (item) {
            if (this.selectLeast === item.selectLeast) return
            this.hasClick = false;
            this.listData = item.children[0].layout.rates;
            this.playTipInfo = item.children[0];
            this.selectMust = item.selectMust;
            this.selectLeast = item.selectLeast;
            this.price = item.children[0].layout.costAmount;
            this.singleLimit = item.children[0].singleLimit;  //单注最大金额
            this.cancel();
            this.$emit('has-change-menu', Math.random()); //切换二级菜单提示空投
        },
        getSelected (data) {
            let arr = [];
            let { lotteryId, lotteryPlayId, lotteryBettingId, maxOdds } = this.listData[0];
            data.forEach(item => {
                arr.push({
                    lotteryId: lotteryId,
                    lotteryPlayId: lotteryPlayId,
                    lotteryBettingId: lotteryBettingId,
                    odds: maxOdds,
                    lotteryNumber: item.join(','),
                    singleMoney: this.newSingleMoney,
                    bettingMoney: this.newSingleMoney * 1,
                    bettingNum: 1,
                    rebate: 0
                });
            })
            return arr
        },
        commit () {
            let vm = this;
            let balls = [];
            if (!this.selected.length || this.selected.length < this.selectLeast) {
                if (!this.hasClick) {
                    this.$Message.warning('没有投注或注数不够');
                    this.hasClick = true;
                }
                return;
            }
            this.selected.forEach(item => {
                balls.push(item.ball);
            })
            let noteNum = this.bettingAmount(balls.join(','), this.selectLeast);
            this.orderList = this.getSelected(noteNum);
            // this.cancel();
        },
        cancel () {
            this.companyValue = 1;
            this.num = 0;
            this.price = this.tabList[0].children[0].layout.costAmount;
            this.selected.forEach(item => {
                item.selected = false;
            });
            this.selected = [];
        }
    },
    created () {
        let data = this.data;
        data.forEach(item => {// 必须选中的条数
            item.selectLeast = this.listType.indexOf(item.id) + 5;
            if (item.selectLeast >= 8 && item.selectLeast <= 10) {
                item.selectMust = item.selectLeast + 3;
            } else if (item.selectLeast > 10) {
                item.selectMust = item.selectLeast + 2;
            } else {
                item.selectMust = 10;
            }
        })
        this.tabList = data;
        this.selectMust = data[0].selectMust;
        this.selectLeast = data[0].selectLeast;
        this.price = this.tabList[0].children[0].layout.costAmount;
        this.singleLimit = this.tabList[0].children[0].singleLimit;  //单注最大金额
        this.listData = this.tabList[0].children[0].layout.rates;
        this.playTipInfo = this.tabList[0].children[0];
    }
}
</script>

<style scoped>
.zhongyi .tab {
    position: relative;
}
.zhongyi .tab ul {
    float: left;
    height: 32px;
    line-height: 32px;
}
.zhongyi .tab .prize_example {
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.zhongyi .tab .tip-wrap {
    width: 90%;
    clear: both;
    padding: 5px 0;
    word-wrap: break-word;
}
.zhongyi .detail-thead li,
.zhongyi .detail-body li {
    width: 20%;
}
.zhongyi span.num {
    width: 35%;
}
.zhongyi span.price {
    width: 50%;
}
.zhongyi .detail-body li .check-price {
    width: 16px;
    /* margin-top: 5px; */
}
.zhongyi .detail-body li span.price {
    line-height: 20px;
}
.zhongyi .operation {
    position: relative;
    height: 35px;
    margin-top: 40px;
}
.zhongyi .operation .price {
    border: 1px solid #be1204;
    height: 35px;
    overflow: hidden;
}
.zhongyi .operation .price .icon-m-p {
    display: inline-block;
    height: 100%;
    width: 35px;
    text-align: center;
    line-height: 35px;
    color: #be1204;
    cursor: pointer;
}
.zhongyi .operation .price .minus {
    border-right: 1px solid #be1204;
}
.zhongyi .operation .price .plus {
    border-left: 1px solid #be1204;
}
.zhongyi .operation .company {
    height: 35px;
    margin-left: 10px;
    border-left: 1px solid #d2d0d0;
}
.zhongyi .operation .company span {
    display: inline-block;
    height: 100%;
    width: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid #d2d0d0;
    border-left: 0;
    cursor: pointer;
    color: #949494;
    /* margin-left:-1px; */
}
.zhongyi .operation .company span.active {
    border: 1px solid #be1204;
    color: #be1204;
    z-index: 2;
    margin-left: -1px;
}
.zhongyi .operation .odd-compute {
    font-size: 12px;
    height: 35px;
    margin-left: 10px;
}
.zhongyi .operation .odd-compute > span {
    display: inline-block;
    float: left;
}
.zhongyi .operation .odd-compute span.odds,
.zhongyi .operation .odd-compute span.rebate {
    line-height: 18px;
    min-width: 60px;
    max-width: 80px;
    text-align: center;
    color: #be1204;
}
.zhongyi .operation .odd-compute span.slider {
    width: 160px;
    margin: 0 8px;
}
.zhongyi .operation .odd-compute span.slider .ivu-slider {
    line-height: 15px;
}
.zhongyi .operation .add-note span {
    display: inline-block;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 18px;
    height: 17px;
    line-height: 12px;
    text-align: center;
    float: left;
    margin-top: 3px;
    margin-right: 4px;
}
.zhongyi .operation .total {
    font-size: 16px;
    line-height: 35px;
    margin-left: 10px;
    margin-top: -2px;
}
.zhongyi .operation .total strong {
    color: #be1204;
}
.zhongyi .operation .add-note {
    position: absolute;
    left: 935px;
    text-align: center;
    margin-bottom: 20px;
    background: #f11313;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid #d85b5b;
    box-shadow: -1px 1px 1px #fb8383 inset;
    cursor: pointer;
}
.zhongyi .operation .add-note span {
    display: inline-block;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 18px;
    height: 17px;
    line-height: 12px;
    text-align: center;
    float: left;
    margin-top: 3px;
    margin-right: 4px;
}
.zhongyi .operation .add-note b {
    font-weight: normal;
    display: inline-block;
    margin-top: 1px;
}
/* 覆盖ivu-input-number样式 */
.zhongyi .price-input {
    width: 80px;
    height: 100%;
    display: inline-block;
}
.zhongyi .price-input .ivu-input-number-handler-wrap {
    display: none;
}
.zhongyi .price-input .ivu-input-number {
    border: 0;
    width: 100%;
    height: 100%;
    box-shadow: none;
}
.zhongyi .price-input .ivu-input-number-input-wrap {
    height: 100%;
}
.zhongyi .ivu-input-number-input {
    border: 0;
    outline: none;
    color: #be1204;
    text-align: center;
    height: 34px;
    line-height: 34px;
    font-size: 16px;
}
.zhongyi .price-input .ivu-input-number >>> .ivu-input-number-input {
    text-align: center;
    height: 33px;
    line-height: 33px;
}
</style>