<template>
    <div class="picked-result">
        <div class="current-info">
            <!-- <span>单注金额</span>  -->
            <div class="price lf">
                <span class="minus icon-m-p lf" @click="minusPlus(-1)">
                    <Icon type="minus"></Icon>
                </span>
                <!-- <input type="number" 
                    v-if="currentLottery"
                    v-model="data.singleMoney" 
                    @input="getSingleMoney()"> -->
                <span class="price-input lf">
                    <InputNumber :precision=0 :max="parseInt(currentLottery.singleLimit)" :min="1" v-model="data.singleMoney" @on-change="getSingleMoney" v-if="currentLottery"></InputNumber>
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
            <div class="odd-compute lf" v-if="user.userId">
                <span class="odds">
                    <!-- <span v-show="playType !== '2'">{{data.odds}}</span> -->
                    <!-- 5.5 -->
                    <span v-show="rates.length === 1">{{data.odds}}</span>
                    <br/>
                    <span>赔率</span>
                </span>
                <span class="slider">
                    <Slider v-model="sliderNum" @on-input="getRates"></Slider>
                </span>
                <span class="rebate">
                    <span>{{data.rebate}}%</span>
                    <br/>
                    <span>返利</span>
                </span>
            </div>
            <div class="lf total" style="margin-left:10px">
                <prize-tip :count="data.bettingNum" :money="data.bettingMoney" :singlePrizeMoney="singlePrizeMoney" :hasLogin="!!user.userId"></prize-tip>
            </div>
            <div class="add-note lf" @click="addNote()">
                <span>
                    <Icon type="plus-round" size="12"></Icon>
                </span>
                <i>添加注单</i>
            </div>
            <!-- <Button type = "primary" class = "add-note lf" icon = "plus-round" @click="addNote()">添加注单</Button> -->
        </div>

    </div>
</template>

<script>
import prizeTip from '../../common_vue/prize_tip.vue'
export default {
    props: {
        currentLottery: {
            type: Object
        },
        balls: {
            type: Object
        },
        refresh: {
            type: String
        },
        bettingDiffTime: {
            type: Number
        }
    },
    components: { prizeTip },
    data () {
        return {
            sliderNum: 0,                  // 拖拉条的值 
            companyList: [                 // 金额单位
                { value: 1, label: '元' },
                { value: 10, label: '角' },
                { value: 100, label: '分' }
            ],
            companyValue: 1,               // 当前选中的company
            data: {},                      // 单注数据
            // playType: '',                  // 判断多赔率    5.5 
            rates: [],                     // 判断多赔率 5.5
            odds: [],                     // 多赔率数据 
            hasClick: false,               //判断是否多次点击添加注单
            maxOdds: null,                 //多赔率的最大赔率
            minOdds: null                  //多赔率的最小赔率
        }
    },
    computed: {
        diffTime () {
            return this.bettingDiffTime;
        },
        currentLotterys () {
            return JSON.parse(JSON.stringify(this.currentLottery));
        },
        singlePrizeMoney () { //单注最大中奖金额
            // return Number(this.data.odds) * (this.data.singleMoney / this.companyValue);
            // let maxOdds = this.rates.length > 1 ? this.maxOdds : this.data.odds;
            return Number(this.rates.length > 1 ? this.maxOdds : this.data.odds) * (this.data.singleMoney / this.companyValue);
        },
        user () {
            return this.$store.state.user;
        }
    },
    watch: {
        // 监听选号类型改变 如果改变重新初始化
        currentLottery: {
            handler (newValue, oldValue) {
                this.init();
                this.hasClick = false;
            },
            deep: true
        },
        balls: {
            handler (newValue, oldValue) {
                this.getBalls(newValue)
            },
            deep: true
        },
        refresh () {
            this.init();
        }
    },
    methods: {
        // 输入单注金额
        getSingleMoney () {
            this.$set(this.data, 'bettingMoney', this.data.bettingNum * this.data.singleMoney / this.data.company);
            // 传递当前的状态
            this.$emit('get-status', this.data);
        },
        minusPlus (num) {
            num = this.data.singleMoney + num;
            if (num < 1 || num > parseInt(this.currentLottery.singleLimit)) {
                return;
            }
            this.$set(this.data, 'singleMoney', num);
            this.getSingleMoney();
        },
        // 计算返利
        getRates (num) {
            let layout = JSON.parse(this.currentLotterys.layout);
            let rates = layout.rates;
            if (rates.length > 1) { //待完
                this.$emit('rates-to-balls', num);
            }
            let odds = (layout.rates[0].maxOdds - layout.rates[0].minOdds) / 100;
            let rebate = 100 / layout.rates[0].rebate;
            this.$set(this.data, 'odds', (layout.rates[0].maxOdds - (num * odds)).toFixed(2));
            if (rates.length > 1) { //多赔率的最大赔率 6.5
                let maxOdds = Math.max(...rates.map(item => item.maxOdds));
                this.maxOdds = (maxOdds - (maxOdds - this.minOdds) * num / 100).toFixed(2);
            }
            this.$set(this.data, 'rebate', (num / rebate * 100).toFixed(1));

            // 处理多赔率
            if (this.odds.length) {
                let moreOdds = JSON.parse(JSON.stringify(this.odds));
                let value = 0;
                moreOdds.forEach(item => {
                    let o = (item.maxOdds - item.minOdds) / 100;
                    let currOdd = (item.maxOdds - (num * o)).toFixed(2);
                    if (value < Number(currOdd)) {
                        value = Number(currOdd);
                    }
                })
                this.$set(this.data, 'odds', value);
            }
            // 传递当前的状态
            this.$emit('get-status', this.data);
        },
        // 元角分发生变化时
        getCompanyValue (num) {
            this.$set(this.data, 'company', num);
            this.$set(this.data, 'bettingMoney', this.data.bettingNum * this.data.singleMoney / num);
            this.companyValue = num;
            // 传递当前的状态
            this.$emit('get-status', this.data);
        },
        // 获取号码球与注数
        getBalls (result) {
            this.$set(this.data, 'bettingNum', result.len);
            this.$set(this.data, 'bettingMoney', this.data.singleMoney * result.len / this.data.company);  // this.data.company 为元角分
            this.$set(this.data, 'lotteryNumber', result.balls);
            // this.playType处理多赔率情况  目前只有快三--和值会出现
            // if (this.playType === '2') this.moreOdds(result.odds);
            if (this.rates.length > 1) this.moreOdds(result.odds); // 5.5
        },
        moreOdds (odds) {
            let layout = JSON.parse(this.currentLotterys.layout);
            let arr = [];
            let vm = this;
            let va = 0;
            odds.forEach(item => {
                layout.rates.forEach(value => {
                    if (item.join('') === value.ball) {
                        arr.push(value);
                        if (va < Number(value.maxOdds)) va = Number(value.maxOdds);
                    }
                })
            })
            this.$set(this.data, 'odds', va);
            this.odds = JSON.parse(JSON.stringify(arr));
        },
        // 添加单注
        addNote () {
            if (this.user && !this.user.userId) {
                this.$store.commit('getShouldLogin', true);
                return;
            }
            if (this.diffTime < 0) {
                this.$Modal.warning({
                    title: '投注提示',
                    content: '当前期数未开始'
                });
                return;
            }
            if (!this.data.bettingNum) {
                if (!this.hasClick) {
                    this.$Message.error('注数不够');
                    this.hasClick = true;
                }
                return;
            };
            if (this.data.singleMoney <= 0) {
                this.$Message.error('单注金额不能小于1');
                return;
            }
            let data = [];
            // 处理多赔率
            if (this.odds.length) {
                this.odds.forEach(item => {
                    let value = (item.maxOdds - item.minOdds) / 100;
                    let obj = Object.assign({}, this.data);
                    obj.odds = (item.maxOdds - (this.sliderNum * value)).toFixed(2);
                    obj.bettingMoney = obj.singleMoney / obj.company;
                    obj.lotteryNumber = item.ball;
                    obj.bettingNum = 1;
                    data.push(obj);
                })
            } else {
                data.push(this.data);
            }
            this.$emit('add-note', data);
            // 清空当前数据  
            this.init();

            // 传递当前的状态
            this.$emit('get-status', this.data);
        },
        init () {
            let layout = JSON.parse(this.currentLotterys.layout);
            this.$set(this.data, 'bettingMoney', 0);
            this.$set(this.data, 'singleMoney', layout.costAmount);
            this.$set(this.data, 'bettingNum', 0);
            this.rates = layout.rates;
            this.$set(this.data, 'odds', (layout.rates[0].maxOdds).toFixed(2)); //单赔率的赔率
            this.$set(this.data, 'rebate', 0);
            this.$set(this.data, 'lotteryNumber', '');
            this.$set(this.data, 'company', 1);
            // this.playType = layout.playType; //安徽快三： 5.5
            this.sliderNum = 0;
            this.companyValue = 1;
            this.odds = [];
            if (this.rates.length > 1) { //多赔率的最大赔率 6.5
                this.maxOdds = Math.max(...this.rates.map(item => item.maxOdds));
                this.rates.forEach(item => {
                    if (item.maxOdds === this.maxOdds) {
                        this.minOdds = item.minOdds;
                    }
                })
            }
        }
    },
    created () {
        this.init();
    }
}
</script>

<style lang="less" scoped>
.picked-result {
    margin-top: 45px;
}
.picked-result .red-font {
    color: @add-note-price-color;
}
.picked-result .current-info {
    position: relative;
    height: 50px;
}
.picked-result .current-info .price {
    border: 1px solid @add-note-price-color;
    height: 35px;
    overflow: hidden;
}
.picked-result .current-info .price .icon-m-p {
    display: inline-block;
    height: 100%;
    width: 35px;
    text-align: center;
    line-height: 35px;
    color: @add-note-price-color;
    cursor: pointer;
}
.picked-result .current-info .price .minus {
    border-right: 1px solid @add-note-price-color;
}
.picked-result .current-info .price .plus {
    border-left: 1px solid @add-note-price-color;
}
.picked-result .current-info .company {
    height: 35px;
    margin-left: 10px;
    border-left: 1px solid @add-note-border;
}
.picked-result .current-info .company span {
    display: inline-block;
    height: 100%;
    width: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid @add-note-border;
    border-left: 0;
    cursor: pointer;
    color: @add-note-common-color;
}
.picked-result .current-info .company span.active {
    border: 1px solid @add-note-price-color;
    color: @add-note-price-color;
    z-index: 2;
    margin-left: -1px;
}
.picked-result .current-info .odd-compute {
    font-size: 12px;
    height: 35px;
    margin-left: 10px;
}
.picked-result .current-info .odd-compute > span {
    display: inline-block;
    float: left;
}
.picked-result .current-info .odd-compute span.odds,
.picked-result .current-info .odd-compute span.rebate {
    line-height: 18px;
    min-width: 60px;
    max-width: 80px;
    text-align: center;
    color: @add-note-price-color;
}
.picked-result .current-info .odd-compute span.slider {
    width: 160px;
    margin: 0 8px;
}
.picked-result .current-info .odd-compute span.slider .ivu-slider {
    line-height: 15px;
}
.picked-result .current-info .add-note {
    position: absolute;
    left: 935px;
    background: @add-note-add-bg;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid @add-note-add-border;
    box-shadow: -1px 1px 1px @add-note-add-shadow-insert inset;
    cursor: pointer;
}
.picked-result .current-info .add-note span {
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
.picked-result .current-info .add-note i {
    display: inline-block;
    margin-top: 1px;
}
.picked-result .current-info .total {
    height: 40px;
    margin-top: -2px;
    font-size: 14px;
    line-height: 20px;
}

/* 覆盖ivu-input-number样式 */
.picked-result .price-input {
    width: 80px;
    height: 100%;
    display: inline-block;
}
.picked-result .price-input .ivu-input-number-handler-wrap {
    display: none;
}
.picked-result .price-input .ivu-input-number {
    border: 0;
    width: 100%;
    height: 100%;
    box-shadow: none;
}
.picked-result .price-input .ivu-input-number-input-wrap {
    height: 100%;
}
.picked-result .ivu-input-number-input {
    border: 0;
    outline: none;
    color: @balls-page-label-color;
    text-align: center;
    height: 34px;
    line-height: 34px;
    font-size: 16px;
}
</style>
