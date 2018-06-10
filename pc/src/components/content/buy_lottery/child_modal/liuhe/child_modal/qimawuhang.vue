<template>
    <div class="qimawuhang">
        <odds></odds>
        <!--玩法中奖提示 -->
        <div class='tips'>
            <div class='prize_example'>
                <play-example :bettingExample="qimaInfo.bettingExample" :prizeDesc="qimaInfo.prizeDesc"></play-example>
            </div>
            <div class='tip-wrap'>
                <play-tip :playDesc="qimaInfo.playDesc"></play-tip>
            </div>
        </div>
        <div class="qima">
            <div class="detail-thead nav-bg">
                <ul>
                    <li v-for="item in 2" :key="item">
                        <div class="container">
                            <span class="label">七码</span>
                            <span class="odds">赔率</span>
                            <span class="price">金额</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="detail-body">
                <ul>
                    <li v-for="(item, idx) in qimaData" :key="idx">
                        <div class="container">
                            <span class="label">
                                <span>{{item.ball}}</span>
                            </span>
                            <span class="odds">{{item.maxOdds}}</span>
                            <input-value v-model="item.bettingMoney"></input-value>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
        </div>
        <div class="wuxing">
            <!--玩法中奖提示 -->
            <div class='tips'>
                <div class='prize_example'>
                    <play-example :bettingExample="wuhangInfo.bettingExample" :prizeDesc="wuhangInfo.prizeDesc"></play-example>
                </div>
                <div class='tip-wrap'>
                    <play-tip :playDesc="wuhangInfo.playDesc"></play-tip>
                </div>
            </div>
            <!--玩法中奖提示 -->
            <div class="detail-thead nav-bg">
                <ul>
                    <li style="width: 100%">
                        <div class="container">
                            <span class="label">五行</span>
                            <span class="num">号码</span>
                            <span class="odds">赔率</span>
                            <span class="price">金额</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="detail-body">
                <ul>
                    <li v-for="(item, idx) in wuxingData" :key="idx" style="width: 100%">
                        <div class="container">
                            <span class="label">
                                <span>{{item.ball}}</span>
                            </span>
                            <span class="num">
                                <i class="ball" v-for="value in item.num.data" :key="value.ball" :style="{background: value.clr}">
                                    {{value.ball}}
                                </i>
                            </span>
                            <span class="odds">{{item.maxOdds}}</span>
                            <input-value v-model="item.bettingMoney"></input-value>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
        </div>

        <!-- <div class="operation">
            <button class="btn primary" @click="commit()">确定</button>
            <button class="btn cancel" @click="cancel()">取消</button>
        </div>
        <popup-modal :status="showPopup" :orderList="orderList" @get-result="getResult"></popup-modal> -->
        <div class="add-note lf" @click="add">
            <span>
                <Icon type="plus-round" size="12"></Icon>
            </span>
            添加注单
        </div>
    </div>
</template>

<script>
import liuhe from './common_modal/handle_data.js'
import popupModal from './common_modal/popup.vue'
import inputValue from './common_modal/input_modal.vue'
import odds from './common_modal/odds.vue'
import playTip from '../../common_vue/play_tip.vue'
import playExample from '../../common_vue/betting_example.vue'
export default {
    props: {
        data: {
            type: Object
        }
    },
    components: {
        inputValue,
        popupModal,
        odds,
        playTip,
        playExample
    },
    data () {
        return {
            totalMoney: 0,
            qimaData: [],
            wuxingData: [],
            showPopup: false,
            orderList: [],
            mixData: [],
            hasClick: false, //阻止多次空投提示
            qimaInfo: {},
            wuhangInfo: {}
        }
    },
    methods: {
        add () { //添加注单
            this.getSelected();
            if (!this.orderList.length) {
                if (!this.hasClick) {
                    this.$Message.error('请先投注');
                    this.hasClick = true;
                }
            }
            this.$emit('add-note', this.orderList);
            this.clearMoney();
        },
        clearMoney () { //清空金额
            this.mixData = [...this.wuxingData, ...this.qimaData];
            this.mixData.forEach(item => {
                item.bettingMoney = null;
            })
            // if(!tab) {
            this.orderList = [];
            // }
            // this.other = [];
        },
        getSelected (clear) {
            let arr = [];
            let vm = this;
            this.totalMoney = 0;
            ['qimaData', 'wuxingData'].forEach(value => {
                vm[value].forEach((item, idx) => {
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
                                // bettingMoney: item.bettingMoney,
                                bettingNum: 1,
                                rebate: 0
                            });
                            vm.totalMoney += parseInt(item.bettingMoney);
                        } else {
                            item.bettingMoney = ''
                        }
                    };
                })
            })
            // return arr
        },
        // getResult (clear) {
        //     this.showPopup = false;
        //     if (clear) this.cancel('clear');
        // },
        // commit () {
        //     let vm = this;
        //     this.orderList = vm.getSelected();
        //     this.showPopup = true;
        // },
        // cancel () {
        //     this.getSelected('clear');
        // }
    },
    created () {
        let vm = this;
        let data = liuhe.editData(this.data.children);
        data.forEach(item => {
            if (item.id === "701501") {
                vm.qimaData = JSON.parse(JSON.stringify(item.children[0].layout.rates));
            } else {
                item.children[0].layout.rates.forEach(value => {
                    value.num = liuhe.wuhang.filter(vvv => vvv.label === value.ball)[0];
                })
                vm.wuxingData = JSON.parse(JSON.stringify(item.children[0].layout.rates));
            }
        })
        this.qimaInfo = data[0].children[0];
        this.wuhangInfo = data[1].children[0];
    }
}
</script>

<style scoped>
.qimawuhang .tips {
    position: relative;
    padding: 5px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #dddee1;
}
.qimawuhang .prize_example {
    display: inline-block;
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.qimawuhang .tip-wrap {
    display: inline-block;
    width: 90%;
    clear: both;
    padding: 5px 0;
    word-wrap: break-word;
}
.qima li {
    width: 50%;
}
.qima span.label,
.qima span.odds {
    width: 36%;
}
.qima span.price {
    width: 24%;
}
.wuxing {
    /* margin-top: 10px; */
}
.wuxing li {
    width: 100%;
}
.wuxing span.label,
.wuxing span.odds {
    width: 20%;
}
.wuxing span.price {
    width: 12%;
}
.wuxing .detail-thead span.num {
    padding-left: 5px;
}
.wuxing span.num {
    width: 46.2%;
    text-align: left;
}
.wuxing span.num i {
    text-align: center;
    margin: 0 5px;
}
.qimawuhang .detail-body .container .odds {
    color: #be1204;
    font-weight: bold;
}
.qimawuhang .detail-body .container .label {
    font-weight: bold;
}
.qimawuhang .add-note {
    text-align: center;
    margin-left: 935px;
    margin-top: 20px;
    margin-bottom: 20px;
    background: #f11313;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid #d85b5b;
    box-shadow: -1px 1px 1px #fb8383 inset;
    cursor: pointer;
}
.qimawuhang .add-note span {
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
