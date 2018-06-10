<template>
    <div class="teima">
        <div class="tab">
            <ul>
                <li @click="changeType('A')" :class="{active: tabType === 'A'}">
                    <span>特码A</span>
                </li>
                <li @click="changeType('B')" :class="{active: tabType === 'B'}">
                    <span>特码B</span>
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
                        <span class="label">号码</span>
                        <span class="odds" v-if="user.userId">赔率</span>
                        <span class="price" :class="{'big-width' : !user.userId}">金额</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="detail-body">
            <ul>
                <li v-for="(item, idx) in numBalls" :key="idx">
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
        <div class="detail-body">
            <ul>
                <li v-for="(item, idx2) in other" :key="idx2">
                    <div class="container">
                        <span class="label">{{item.ball}}</span>
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
// import popupModal from './common_modal/popup.vue'
import inputValue from './common_modal/input_modal.vue'
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
        playTip,
        playExample
    },
    data () {
        return {
            tabType: 'B',
            totalMoney: 0,
            teimaA: [],
            teimaB: [],
            other: [],
            numBalls: [],
            orderList: [],
            mixNum: [],
            hasClick: false, //是否多次空投·
            playTipInfo: {}
        }
    },
    computed: {
        maxOdd () {
            let mixBalls = [...this.numBalls, ...this.other];
            return Math.max(...mixBalls.map(item => item.maxOdds));
        },
        user () {
            return this.$store.state.user;
        }
    },
    watch: {
        data (newVal, oldVal) {
            this.init(newVal);
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
            this.mixNum = [...this.numBalls, ...this.other];
            this.mixNum.forEach(item => item.bettingMoney = null);
            if (!tab) {
                this.orderList = [];
            }
        },
        changeType (type) {
            this.hasClick = false;
            this.tabType = type;
            this.numBalls = this["teima" + type];
            this.clearMoney('tab');
            this.$emit('has-change-menu', Math.random()); //切换二级菜单提示空投
        },
        getSelected (clear) {
            let arr = [];
            let vm = this;
            this.totalMoney = 0;
            ['numBalls', 'other'].forEach(value => {
                vm[value].forEach((item, idx) => {
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
                                rebate: (item.rebate * 100) || 0
                            });
                            vm.totalMoney += parseInt(item.bettingMoney)
                        } else {
                            item.bettingMoney = ''
                        }
                    };
                })
            })
        },
        init (data) {
            data.forEach(item => {
                if (item.id === '70102') {
                    this.teimaA = item.children[0].layout.rates;
                } else if (item.id === '70101') {
                    this.teimaB = item.children[0].layout.rates;
                }
                else if (item.id === '70103') {
                    this.other = item.children[0].layout.rates;
                }
            })
            this.playTipInfo = data[0].children[0];
            this.numBalls = this.teimaB;
        }
    },
    created () {
        this.init(this.data);
    }

}
</script>

<style lang="less" scoped>
/* 开奖提示 */
.liuhe .tab {
    position: relative;
}
.liuhe .tab ul {
    float: left;
    height: 32px;
    line-height: 32px;
}
.teima .tab .prize_example {
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.teima .tab .tip-wrap {
    width: 90%;
    clear: both;
    padding: 5px 0;
    word-wrap: break-word;
}
/* 开奖提示结束 */
.teima .detail-thead li,
.teima .detail-body li {
    width: 20%;
}
.teima li .label,
.teima li .odds {
    width: 25%;
}
.teima .detail-body li .label,
.teima .detail-body li .odds {
    font-weight: bold;
}
.teima .detail-body li .label .ball {
    font-weight: normal;
}
.teima .detail-body li .odds {
    color: @liuhe-color;
}
.teima li .price {
    width: 50%;
}
.teima li .price.big-width {
    width: 68%;
}
.teima .detail-body li span.price.big-width {
    width: 68%;
}
.teima .add-note {
    text-align: center;
    margin-left: 935px;
    margin-top: 20px;
    margin-bottom: 20px;
    background: @add-note-add-bg;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid @add-note-add-border;
    box-shadow: -1px 1px 1px @add-note-add-shadow-insert inset;
    cursor: pointer;
}
.teima .add-note span {
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
.teima .add-note b {
    font-weight: normal;
    display: inline-block;
    margin-top: 1px;
}
</style>

