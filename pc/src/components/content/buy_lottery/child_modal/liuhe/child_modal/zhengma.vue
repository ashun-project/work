<template>
    <div class="zhengma">
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
        <div class="detail-thead nav-bg">
            <ul>
                <li v-for="item in 5" :key="item" style="width:20%">
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
                <li v-for="(item, idx) in listData" :key="idx" style="width:20%">
                    <div class="container">
                        <span class="label">
                            <i :style="{background: item.clr}" class="ball">{{item.ball}}</i>
                        </span>
                        <span class="odds" v-if="user.userId">{{item.maxOdds}}</span>
                        <input-value v-model="item.bettingMoney" :class="{'big-width' : !user.userId}"></input-value>
                    </div>
                </li>
                <!-- 作为布局使用 -->
                <li>
                    <div class="container"></div>
                </li>
            </ul>
            <div class="clr"></div>
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
    data () {
        return {
            totalMoney: 0,
            listData: [],
            showPopup: false,
            orderList: [],
            hasClick: false, //是否多次空投·
            maxOdd: null
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
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
            this.listData.forEach(item => {
                item.bettingMoney = null;
            })
            this.orderList = [];
        },
        getSelected (clear) {
            this.totalMoney = 0;
            this.listData.forEach((item, idx) => {
                if (item.bettingMoney) {
                    if (!clear) {
                        this.orderList.push({
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
                        this.totalMoney += parseInt(item.bettingMoney)
                    } else {
                        item.bettingMoney = ''
                    }
                };
            })
        }
    },
    created () {
        let data = this.data;
        this.playTipInfo = data[0].children[0];
        this.listData = data[0].children[0].layout.rates;
        this.maxOdd = Math.max(...this.listData.map(item => item.maxOdds)); //最大赔率
    }
}
</script>

<style lang="less" scoped>
.zhengma .tips {
    position: relative;
    padding: 5px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #dddee1;
}
.zhengma .prize_example {
    display: inline-block;
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.zhengma .tip-wrap {
    display: inline-block;
    width: 90%;
    clear: both;
    padding: 5px 0;
    word-wrap: break-word;
}
.zhengma .detail-thead li,
.zhengma .detail-body li {
    width: 20%;
}
.zhengma li .label,
.zhengma li .odds {
    width: 25%;
}
.zhengma li .price {
    width: 50%;
}
.zhengma li .price.big-width {
    width: 66%;
}
.zhengma .detail-body li .odds,
.zhengma .detail-body li .container .odds,
.zhengma .detail-body li:first-child .container .odds {
    font-weight: bold;
}
.zhengma .detail-body li .odds {
    color: @liuhe-color;
}
.zhengma .add-note {
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
.zhengma .add-note span {
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
.zhengma .add-note b {
    font-weight: normal;
    display: inline-block;
    margin-top: 1px;
}
</style>

