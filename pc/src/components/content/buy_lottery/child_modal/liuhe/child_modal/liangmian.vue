<template>
    <div class="liangmian">
        <odds></odds>
        <!--玩法中奖提示 -->
        <div class='tips'>
            <div class='prize_example'>
                <play-example :bettingExample="playTipInfo.bettingExample" :prizeDesc="playTipInfo.prizeDesc"></play-example>
            </div>
            <div class='tip-wrap'>
                <play-tip :playDesc="playTipInfo.playDesc" :maxOdd="maxOdd" :isLiuHe="true" :hasLogin="!!user.userId"></play-tip>
            </div>
        </div>
        <!--玩法中奖提示结束 -->
        <!-- 特码 -->
        <div class="special">
            <div class="detail-thead nav-bg">
                <ul>
                    <li v-for="item in 4" :key="item" style="width:25%">
                        <div class="container">
                            <span class="label">号码</span>
                            <span class="odds" v-if="user.userId">赔率</span>
                            <span class="price" :class="{'big-width' : !user.userId}">金额</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="detail-body">
                <ul>
                    <li v-for="(item, idx) in specialCode" :key="idx" style="width:25%">
                        <div class="container">
                            <span class="label">
                                {{item.ball}}
                            </span>
                            <span class="odds" v-if="user.userId">{{item.maxOdds}}</span>
                            <input-value v-model="item.bettingMoney" :class="{'big-width' : !user.userId}"></input-value>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
        </div>

        <!-- 正码 -->
        <div class="positive">
            <div class="detail-thead title-tip">
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
                            <span class="price" :class="{'big-width':!user.userId}">金额</span>
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
// import liuhe from "./common_modal/handle_data.js";
// import popupModal from "./common_modal/popup.vue";
import inputValue from "./common_modal/input_modal.vue";
import odds from "./common_modal/odds.vue";
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
    data () {
        return {
            thead: [
                { label: "", width: 10 },
                { label: "正一", width: 15 },
                { label: "正二", width: 15 },
                { label: "正三", width: 15 },
                { label: "正四", width: 15 },
                { label: "正五", width: 15 },
                { label: "正六", width: 15 }
            ],
            column: [],
            totalMoney: 0,
            specialCode: [],
            positiveCode: [],
            showPopup: false,
            orderList: [],
            mixNum: [],
            hasClick: false, //是否多次空投·
            playTipInfo: {},
            maxOdd: null
        };
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        add () {
            if (this.user && !this.user.userId) {
                this.$store.commit('getShouldLogin', true);
                return
            }
            //添加注单
            this.getSelected();
            if (!this.orderList.length) {
                if (!this.hasClick) {
                    this.$Message.error("请先投注");
                    this.hasClick = true;
                }
                return;
            }
            this.$emit("add-note", this.orderList);
            this.clearMoney();
        },
        clearMoney () {
            //清空金额
            this.mixNum = [...this.specialCode, ...this.positiveCode];
            this.specialCode.forEach(item => {
                item.bettingMoney = null;
            });
            this.positiveCode.forEach(item => {
                item.children[0].layout.rates.forEach(item => {
                    item.bettingMoney = null;
                });
            });
            this.orderList = [];
        },
        getSelected (clear) {
            let arr = [];
            let vm = this;
            this.totalMoney = 0;
            ["specialCode", "positiveCode"].forEach(value => {
                vm[value].forEach((item, idx) => {
                    if (value === "specialCode") {
                        getArr(item);
                    } else {
                        item.children[0].layout.rates.forEach(vvv => {
                            getArr(vvv);
                        });
                    }
                });
            });
            function getArr (item) {
                if (item.bettingMoney) {
                    if (!clear) {
                        vm.orderList.push({
                            lotteryId: item.lotteryId,
                            lotteryPlayId: item.lotteryPlayId,
                            lotteryBettingId: item.lotteryBettingId,
                            odds: item.maxOdds,
                            lotteryNumber: item.ball,
                            singleMoney: item.bettingMoney,
                            bettingMoney: item.bettingMoney * 1,
                            bettingNum: 1,
                            rebate: 0
                        });
                        vm.totalMoney += parseInt(item.bettingMoney);
                    } else {
                        item.bettingMoney = "";
                    }
                }
            }
        }
    },
    created () {
        let data = this.data;
        data.forEach(item => {
            if (item.id === "70201") {
                this.specialCode = item.children[0].layout.rates;
            } else {
                this.positiveCode.push(item);
            }
        });
        // 排序防止顺序错乱
        this.positiveCode.sort(function (a, b) {
            return a.id - b.id;
        });
        // 获取列头
        this.positiveCode[0].children[0].layout.rates.forEach(item => {
            this.column.push(item.ball);
        });
        this.playTipInfo = this.positiveCode[0].children[0];
        let rates = [...this.positiveCode[0].children[0].layout.rates, ...this.specialCode];
        this.maxOdd = Math.max(...rates.map(item => item.maxOdds));
    }
};
</script>

<style lang="less" scoped>
.liangmian .tips {
    position: relative;
    padding: 5px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #dddee1;
}
.liangmian .prize_example {
    display: inline-block;
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.liangmian .tip-wrap {
    display: inline-block;
    width: 90%;
    clear: both;
    padding: 5px 0;
    word-wrap: break-word;
}
.special li .label,
.special li .odds {
    width: 25%;
}
.special li .price {
    width: 50%;
}
.positive li .odds {
    width: 30%;
}
.positive li .price {
    width: 70%;
}
/* 无赔率情况 */
.liangmian .special .price.big-width {
    width: 65%;
}
.liangmian .positive .nav-bg .price.big-width {
    width: 100%;
}
.liangmian .positive .price.big-width {
    width: 100%;
}
/*  */
.liangmian .special .detail-body li .label,
.liangmian .special .detail-body li .odds,
.liangmian .positive .detail-body li .label,
.liangmian .positive .detail-body li .odds,
.liangmian .positive .detail-body li .container .odds,
.liangmian .positive .detail-body li:first-child .container {
    font-weight: bold;
}
.liangmian .special .detail-body li .odds,
.liangmian .positive .detail-body li .odds {
    color: @liuhe-color;
}
.liangmian .add-note {
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
.liangmian .add-note span {
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
.liangmian .add-note b {
    font-weight: normal;
    display: inline-block;
    margin-top: 1px;
}
</style>

