<template>
    <div class="zhengmaguoguan">
        <odds></odds>
        <!--玩法中奖提示 -->
        <div class='tips'>
            <div class='prize_example'>
                <play-example :bettingExample="playTipInfo.bettingExample" :prizeDesc="playTipInfo.prizeDesc"></play-example>
            </div>
            <div class='tip-wrap'>
                <play-tip :playDesc="playTipInfo.playDesc" :tip="playTipInfo.layout.tips && playTipInfo.layout.tips" :isLiuHe="true" :maxOdd="maxOdd" :hasLogin="!!user.userId"></play-tip>
            </div>
        </div>
        <!--玩法中奖提示 -->
        <div class="positive">
            <div class="detail-thead title-tip" style="margin-top:0;">
                <ul>
                    <li v-for="(item, idx) in thead" :key="idx" :style="{width: item.width + '%'}">
                        <div class="container">{{item.label}}</div>
                    </li>
                </ul>
            </div>
            <div class="detail-thead nav-bg">
                <ul>
                    <li v-for="(item, idx) in thead" :key="idx" :style="{width: item.width + '%'}">
                        <div v-if="!item.label" class="container">号码</div>
                        <div v-else class="container">
                            <span class="odds" v-if="user.userId">赔率</span>
                            <span class="price" :class="{'big-width' : !user.userId}">单选</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="detail-body">
                <ul>
                    <li style="width: 10%">
                        <div class="container" v-for="item in column" :key="item">{{item}}</div>
                    </li>
                    <li class="checkbox-select" v-for="(item, idx) in positiveCode" :key="idx" style="width:15%" v-if="positiveCode.length">
                        <div class="container" v-for="(rate, idx2) in item.children[0].layout.rates" :key="idx2">
                            <span class="odds" v-if="user.userId">{{rate.maxOdds}}</span>
                            <span class="price" @click="checkRadio(idx,idx2,item.children[0].layout.rates.length)" :class="{'big-width' : !user.userId}">
                                <!-- <input class="search-radio" type="radio" :name="'name'+idx" @change="selectChange"> -->
                                <radio-input :radioName="'name'+idx" :checked="direct[idx]['x'] === idx && direct[idx]['y'] === idx2"></radio-input>
                            </span>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
        </div>
        <div class="operation">
            <div class="price lf">
                <span class="minus icon-m-p lf" @click="minusPlus(-1)">
                    <Icon type="minus"></Icon>
                </span>
                <span class="price-input lf">
                    <InputNumber :max="parseInt(singleLimit)" :min="1" v-model="singleMoney"></InputNumber>
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
                <!-- <prize-tip :count = "num" :money = "money" :singlePrizeMoney = "singlePrizeMoney"></prize-tip> -->
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
import odds from './common_modal/odds.vue'
import playTip from '../../common_vue/play_tip.vue'
import playExample from '../../common_vue/betting_example.vue'
import prizeTip from '@/components/content/buy_lottery/child_modal/common_vue/prize_tip.vue'
import radioInput from '@/components/common/module_vue/radio.vue';
export default {
    props: {
        data: {
            type: [Array, Object]
        }
    },
    components: {
        // popupModal,
        odds,
        playTip,
        playExample,
        prizeTip,
        radioInput
    },
    data () {
        return {
            thead: [
                { label: '', width: 10, name: '' },
                { label: '正码一', width: 15, name: 'mayi' },
                { label: '正码二', width: 15, name: 'maer' },
                { label: '正码三', width: 15, name: 'masan' },
                { label: '正码四', width: 15, name: 'masi' },
                { label: '正码五', width: 15, name: 'mawu' },
                { label: '正码六', width: 15, name: 'maliu' }
            ],
            column: [],
            positiveCode: [],
            orderList: [],
            companyList: [                 // 金额单位
                { value: 1, label: '元' },
                { value: 10, label: '角' },
                { value: 100, label: '分' }
            ],
            singleLimit: 0,
            singleMoney: 0,
            companyValue: 1,               // 当前选中的company
            hasClick: false,               //是否多次空投·
            playTipInfo: {},
            num: 0,                        //总注数
            odd: 1,                        //总的赔率
            maxOdd: null,                    //最大赔率
            checked: true,
            direct: [],
            playCount: 0                //玩法数量
        }
    },
    computed: {
        money () { //总金额
            return this.num * this.singleMoney / this.companyValue;
        },
        singlePrizeMoney () { //单注最大金额
            return this.singleMoney / this.companyValue * this.odd;
        },
        newSingleMoney () { //单注金额
            return this.singleMoney / this.companyValue;
        },
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        /**
         * @author Lee
         * @param number  计算点击的radio为第几个  设置对应radio为选中状态
         * 
         * ****/
        checkRadio (idx, idx2, length) {
            let dom = $('.detail-body .search-radio')[idx * length + idx2];
            this.direct[idx]['x'] = idx;
            this.direct[idx]['y'] = idx2;
            // console.log(this.direct);
            // i
            // dom.checked = true;
            // this.checked = true;
            // dom.previousElementSibling.classList.add('focus-label');
            this.selectChange(); // 5.16
        },
        minusPlus (num) { //操作单注金额
            num += this.singleMoney;
            if (num < 1 || num > parseInt(this.singleLimit)) {
                return;
            }
            this.singleMoney = num;
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
            this.getSelected();
            if (!this.orderList.length) {
                if (!this.hasClick) {
                    this.$Message.error("请先投注");
                    this.hasClick = true;
                }
                return
            }
            this.orderList.forEach(item => item.singleMoney = this.newSingleMoney);
            this.$emit('add-note', this.orderList);
            this.companyValue = 1;      //金额和元角分恢复默认 4.26
            this.num = 0;
            this.singleMoney = this.data[0].children[0].layout.costAmount;
            this.clearMoney();
        },
        clearMoney (tab) { //清空金额
            let checkboxList = document.getElementsByClassName('checkbox-select');
            this.positiveCode.forEach((item, idx) => {
                let searchRadio = checkboxList[idx].getElementsByClassName('search-radio');
                for (let i = 0; i < searchRadio.length; i++) {
                    if (searchRadio[i].checked) {
                        searchRadio[i].checked = false;
                    }
                }
            })
            this.orderList = [];
        },
        selectChange () { //点击单选框
            this.num = 1;
            let odds = 1;
            this.direct.forEach(item => {
                if (typeof item.x !== 'string') {
                    odds *= this.positiveCode[item.x].children[0].layout.rates[item.y].maxOdds;
                }
            })
            this.odd = odds;
            // let checkboxList = document.getElementsByClassName('checkbox-select');
            // this.positiveCode.forEach((item,idx) =>{
            //     let searchRadio = checkboxList[idx].getElementsByClassName('search-radio');
            //     item.children[0].layout.rates.forEach((vv,i) =>{
            //         if(searchRadio[i].checked) {
            //             if(!this.num) {
            //                 this.num = 1;
            //             } 
            //             odds = odds*vv.maxOdds;
            //             return 
            //         }
            //     })
            // })
            // this.positiveCode[]
            this.odd = odds;
        },
        getSelected (clear) {
            let vm = this;
            let ball = [];
            let odds = 1;
            // 动态生成的radio v-mode会有bug 暂时操作demo
            // let checkboxList = document.getElementsByClassName('checkbox-select');
            // vm.positiveCode.forEach((item, idx) => {
            //     let interval = ''
            //     let searchRadio = checkboxList[idx].getElementsByClassName('search-radio');
            //     item.children[0].layout.rates.forEach((vvv, i) => {
            //         if (searchRadio[i].checked) {
            //             if (!clear) {
            //                 interval = vvv.ball;
            //                 odds = odds * vvv.maxOdds;
            //                 searchRadio[i].checked = false;
            //             }
            //         }
            //     })
            //     ball.push(interval);
            // })
            let interval = '';
            this.direct.forEach(item => {
                if (typeof item.x !== 'string') {
                    let ballInfo = this.positiveCode[item.x].children[0].layout.rates[item.y];
                    interval = ballInfo.ball;
                    odds *= this.positiveCode[item.x].children[0].layout.rates[item.y].maxOdds;
                    Object.keys(item).forEach(arg => {
                        item[arg] = '';
                    })
                    ball.push(interval);
                }
            })
            if (ball.some(item => item)) {
                let item = vm.positiveCode[0].children[0].layout;
                this.orderList.push({
                    lotteryId: item.rates[0].lotteryId,
                    lotteryPlayId: item.rates[0].lotteryPlayId,
                    lotteryBettingId: item.rates[0].lotteryBettingId,
                    // odds: Math.floor(odds * 100) / 100,   // 保留两位小数 向下取整
                    odds: odds.toFixed(2),
                    // lotteryNumber: ball.join('|'),
                    lotteryNumber: ball.join('|') + '|'.repeat(this.playCount - ball.length),//6.17
                    bettingMoney: vm.singleMoney / vm.companyValue,
                    singleMoney: vm.singleMoney,
                    bettingNum: 1,
                    rebate: 0
                })
            }
        },
    },
    created () {
        let vm = this;
        let odds = [];
        let data = this.data[0];
        this.singleLimit = data.children[0].singleLimit;  //单注最大金额
        this.singleMoney = data.children[0].layout.costAmount; //默认单注金额
        data.children[0].layout.rates.forEach(function (item) {
            item.picked = '';
        })
        // 添加数据
        for (var i = 0; i < 6; i++) {
            vm.positiveCode.push(JSON.parse(JSON.stringify(data)));
            vm.direct.push({ x: '', y: '' });
        }
        this.playCount = vm.positiveCode.length;
        // 获取列头
        vm.positiveCode[0].children[0].layout.rates.forEach(item => {
            vm.column.push(item.ball);
            odds.push(item.maxOdds);
        })
        this.maxOdd = Math.max(...odds);
        this.playTipInfo = data.children[0];
    }
}
</script>

<style lang="less" scoped>
.zhengmaguoguan .tips {
    position: relative;
    padding: 5px 0;
}
.zhengmaguoguan .prize_example {
    display: inline-block;
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.zhengmaguoguan .tip-wrap {
    display: inline-block;
    width: 90%;
    clear: both;
    padding: 5px 0;
    word-wrap: break-word;
}
.positive li .odds {
    width: 30%;
}
.positive li .price {
    width: 70%;
}
/* 无赔率时 */
.zhengmaguoguan .positive li .price.big-width {
    width: 100%;
}
/* 无赔率结束 */
.detail-body li span.price .search-radio {
    width: 16px;
    /* margin-top: 5px; */
}
.positive .detail-body li .odds,
.positive .detail-body li:first-child .container {
    font-weight: bold;
}
.positive .detail-body li .odds {
    color: @liuhe-color;
}
.zhengmaguoguan .positive .detail-body .price {
    line-height: 20px;
}
.zhengmaguoguan .operation {
    position: relative;
    height: 35px;
    margin-top: 40px;
}
.zhengmaguoguan .operation .price {
    border: 1px solid @liuhe-border;
    height: 35px;
    overflow: hidden;
}
.zhengmaguoguan .operation .price .icon-m-p {
    display: inline-block;
    height: 100%;
    width: 35px;
    text-align: center;
    line-height: 35px;
    color: @liuhe-color;
    cursor: pointer;
}
.zhengmaguoguan .operation .price .minus {
    border-right: 1px solid @liuhe-border;
}
.zhengmaguoguan .operation .price .plus {
    border-left: 1px solid @liuhe-border;
}
.zhengmaguoguan .operation .total {
    margin-left: 10px;
    margin-top: -2px;
    font-size: 16px;
}
.zhengmaguoguan .operation .total strong {
    color: @liuhe-color;
}
.zhengmaguoguan .operation .company {
    height: 35px;
    margin-left: 10px;
    border-left: 1px solid #d2d0d0;
}
.zhengmaguoguan .operation .company span {
    display: inline-block;
    height: 100%;
    width: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid #d2d0d0;
    border-left: 0;
    cursor: pointer;
    color: #949494;
}
.zhengmaguoguan .operation .company span.active {
    border: 1px solid @liuhe-border;
    color: @liuhe-color;
    z-index: 2;
    margin-left: -1px;
}
.zhengmaguoguan .operation .odd-compute {
    font-size: 12px;
    height: 35px;
    margin-left: 10px;
}
.zhengmaguoguan .operation .odd-compute > span {
    display: inline-block;
    float: left;
}
.zhengmaguoguan .operation .odd-compute span.odds,
.zhengmaguoguan .operation .odd-compute span.rebate {
    line-height: 18px;
    min-width: 60px;
    max-width: 80px;
    text-align: center;
    color: @liuhe-color;
}
.zhengmaguoguan .operation .odd-compute span.slider {
    width: 160px;
    margin: 0 8px;
}
.zhengmaguoguan .operation .odd-compute span.slider .ivu-slider {
    line-height: 15px;
}
.zhengmaguoguan .operation .add-note span {
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
.zhengmaguoguan .operation .add-note {
    position: absolute;
    left: 935px;
    text-align: center;
    /* margin-left: 60px; */
    margin-bottom: 20px;
    background: @result-page-chase-num-bg;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid @result-page-order-border;
    box-shadow: -1px 1px 1px @result-page-detail-shadow-color inset;
    cursor: pointer;
}
.zhengmaguoguan .operation .add-note span {
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
.zhengmaguoguan .operation .add-note b {
    font-weight: normal;
    display: inline-block;
    margin-top: 1px;
}

/* 覆盖ivu-input-number样式 */
.zhengmaguoguan .price-input {
    width: 80px;
    height: 100%;
    display: inline-block;
}
.zhengmaguoguan .price-input .ivu-input-number-handler-wrap {
    display: none;
}
.zhengmaguoguan .price-input .ivu-input-number {
    border: 0;
    width: 100%;
    height: 100%;
    box-shadow: none;
}
.zhengmaguoguan .price-input .ivu-input-number-input-wrap {
    height: 100%;
}
.zhengmaguoguan .ivu-input-number-input {
    border: 0;
    outline: none;
    color: @liuhe-color;
    text-align: center;
    height: 34px;
    line-height: 34px;
    font-size: 16px;
}
</style>
<style scoped>
.zhengmaguoguan .price-input .ivu-input-number >>> .ivu-input-number-input {
    text-align: center;
    height: 33px;
    line-height: 33px;
}
</style>


