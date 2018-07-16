<template>
    <div class="zhengma_16">
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
            <div class="detail-thead title-tip" style='margin-top:0;'>
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
                            <span class="price" :class="{'big-width' : !user.userId}">金额</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="detail-body">
                <ul>
                    <li style="width: 10%">
                        <div class="container" v-for="item in column" :key="item">{{item}}</div>
                    </li>
                    <li v-for="(item, idx) in positiveCode" :key="idx" style="width:15%">
                        <div class="container" v-for="value in item.children[0].layout.rates" :key="value.lotteryId">
                            <span class="odds" v-if="user.userId">{{value.maxOdds}}</span>
                            <input-value v-model="value.bettingMoney" :class="{'big-width' : !user.userId}"></input-value>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
        </div>
        <div class="add-note lf" @click="add">
            <span>
                <Icon type="plus-round" size="12"></Icon>
            </span>
            <b>添加注单</b>
        </div>
    </div>
</template>

<script>
// import liuhe from './common_modal/handle_data.js'
// import popupModal from './common_modal/popup.vue'
import inputValue from './common_modal/input_modal.vue'
import odds from './common_modal/odds.vue'
import playTip from '../../common_vue/play_tip.vue'
import playExample from '../../common_vue/betting_example.vue'
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
        playExample
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    data () {
        return {
            playTipInfo: {},
            thead: [
                { label: '', width: 10 },
                { label: '正码一', width: 15 },
                { label: '正码二', width: 15 },
                { label: '正码三', width: 15 },
                { label: '正码四', width: 15 },
                { label: '正码五', width: 15 },
                { label: '正码六', width: 15 }
            ],
            column: ['大', '小', '单', '双', '合单', '合双', '合大', '合小', '尾大', '尾小', '红波', '绿波', '蓝波'],
            totalMoney: 0,
            positiveCode: [],
            // showPopup: false,
            orderList: [],
            hasClick: false //是否多次空投·
        }
    },
    methods: {
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
            this.$emit('add-note', this.orderList);
            this.clearMoney();
        },
        clearMoney (tab) { //清空金额
            this.positiveCode.forEach(item => {
                item.children[0].layout.rates.forEach(item => {
                    item.bettingMoney = null;
                })
            })
            this.orderList = [];
        },
        getSelected (clear) {
            let arr = [];
            let vm = this;
            this.totalMoney = 0;
            vm.positiveCode.forEach((item, idx) => {
                item.children[0].layout.rates.forEach(vvv => {
                    getArr(vvv)
                })
            })
            function getArr (item) {
                if (item.bettingMoney) {
                    if (!clear) {
                        vm.orderList.push({
                            lotteryId: item.lotteryId,
                            lotteryPlayId: item.lotteryPlayId,
                            lotteryBettingId: item.lotteryBettingId,
                            odds: item.maxOdds,
                            lotteryNumber: item.ball,
                            singleMoney: item.bettingMoney,//3.19
                            bettingMoney: item.bettingMoney * 1,
                            bettingNum: 1,
                            rebate: 0
                        });
                        vm.totalMoney += parseInt(item.bettingMoney)
                    } else {
                        item.bettingMoney = ''
                    }
                };
            }
        }
    },
    created () {
        let positiveCode = this.data;
        // 防止顺序错乱
        positiveCode.sort(function (a, b) {
            return a.id - b.id;
        })
        // 对rates排序
        positiveCode.forEach(item => {
            let rates = item.children[0].layout.rates;
            let arr = [];
            this.column.forEach(value => {
                arr.push(rates.filter(vvv => vvv.ball === value)[0])
            })
            item.children[0].layout.rates = arr;
        })
        this.positiveCode = JSON.parse(JSON.stringify(positiveCode));
        this.playTipInfo = positiveCode[0].children[0];
        let odds = this.positiveCode.reduce((val, item) => { //最大赔率
            return val.concat(item.children[0].layout.rates);
        }, []).map(item => item.maxOdds);
        this.maxOdd = Math.max(...odds);
    }
}
</script>

<style lang="less" scoped>
.zhengma_16 .tips {
    position: relative;
    padding: 5px 0;
}
.zhengma_16 .prize_example {
    display: inline-block;
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.zhengma_16 .tip-wrap {
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
.zhengma_16 .positive li .price.big-width {
    width: 100%;
}
/* 无赔率时 */
.positive .detail-body li .odds,
.positive .detail-body li:first-child .container {
    font-weight: bold;
}
.positive .detail-body li .odds {
    color: @liuhe-color;
}
.zhengma_16 .add-note {
    text-align: center;
    margin-left: 935px;
    margin-top: 20px;
    margin-bottom: 20px;
    background: @result-page-chase-num-bg;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid @result-page-order-border;
    box-shadow: -1px 1px 1px @result-page-detail-shadow-color inset;
    cursor: pointer;
}
.zhengma_16 .add-note span {
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
</style>

