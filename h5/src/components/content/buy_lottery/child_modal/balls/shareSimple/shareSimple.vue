<template>
    <div class="lottery-list simple-contanier">
        <div v-if="layout.positionbar" class="btns-position">
            <span class="title-p">位置</span>
            <span class="checkbox-list">
                <mt-checklist v-model="btnsPosition" :options="options">
                </mt-checklist>
            </span>
        </div>
        <ul class="list">
            <li v-for="(item, itemIdx) in ballList" :key="itemIdx" :class="{'name-place': item.name, 'tool-bar': layout.toolbar}">
                <label v-if="item.name">{{item.name}}</label>
                <div class="num-btns">
                    <div v-if="layout.toolbar" class="ball-bts">
                        <!-- {type: value.methodName, item: item.balls} -->
                        <div>
                            <span v-for="(vv, idx) in layout.toolbar.btns" :key="idx" :style="{width: 100 / layout.toolbar.btns.length + '%'}" @click="chooseBall(vv, itemIdx)">
                                {{vv.operator}}
                            </span>
                        </div>
                    </div>
                    <div class="all-balls" v-if="layout.rates.length <=1">
                        <i class="num" v-for="(vv, vvIdx) in item.balls" :key="vv.ball" :class="{selected: vv.selected}" @click="chooseBall(vv, vvIdx, item, itemIdx)">{{vv.ball}}</i>
                    </div>
                    <div class="all-balls all-balls-odd" v-else>
                        <div class="num-wrap" v-for="(vv, vvIdx) in item.balls" :key="vv.ball" @click="chooseBall(vv, vvIdx, item, itemIdx)" :class="{selected: vv.selected}" :style="!userExist ?'line-height:48px;':''">
                            <p class="num"> {{vv.ball}} </p>
                            <p class="odds" v-if="userExist">赔率:{{moreRates[vv.ball]}}</p>
                        </div>

                    </div>
                </div>
                <div class="clr"></div>
            </li>
        </ul>

        <!-- 底部模块 -->
        <simpleBottom ref="simpleBottom" :currentLottery="currentLottery" :code="code" :lotteryId="lotteryId" :period="period" :recordId="recordId" :layout="layout" :result="result" :lotteryPlayId="data.lotteryPlayId" :lotteryBettingId="data.lotteryBettingId" :singleLimit="data.singleLimit" :playName="data.playName" :singleOdds="singleOdds" :moreRates="moreRates">
        </simpleBottom>

    </div>

</template>

<script>
import Util from "@/components/common/module_js/util";
import simpleBottom from "../../bottomSImple/bottom.vue";
export default {
    props: {
        currentLottery: {
            type: Object
        },
        code: {
            type: String
        },
        lotteryId: "",
        period: "",
        recordId: ""
    },
    data () {
        return {
            data: {}, // 数据
            layout: {}, // layout布局
            random: "", // 机选
            showModal: false, // 显示弹框
            ballList: [], // 选号列表
            selectedBalls: [], // 选中的球号
            result: { num: 0 }, // 选中号码计算的结果
            computeNote: "", // 计算注数
            btnsPosition: [], // 计算位置  目前只有时时彩任选 单选时有,
            options: [], // 复选框数据 目前只有时时彩任选 单选时有,
            singleOdds: "",
            moreRates: {}
        };
    },
    components: {
        simpleBottom
    },
    computed: {
        user () {
            return this.$store.state.user;
        },
        userExist () {
            return this.$store.state.user.userCode;
        }
    },
    watch: {
        // 监听选号类型改变 如果改变重新初始化
        currentLottery: {
            handler (newValue, oldValue) {
                this.init();
            },
            deep: true
        },
        btnsPosition: {
            handler (newValue, oldValue) {
                this.chooseBall();
            },
            deep: true
        }
    },
    methods: {
        // 显示弹框
        resultDetail () {
            if (this.result.num < 1) {
                this.$Message("请添加单柱");
                return;
            }
            this.showModal = true;
        },
        // 点击确定
        ballsResult (data) {
            this.showModal = false;
            if (data) {
                this.clearSelected();
                this.$emit("get-balls-result", data);
            }
        },
        // 机选一注
        randomBetting () {
            this.clearSelected();
            let ball;
            let list = [];
            // 调用随机注数的共用方法
            let result = this.random[this.data.lotteryPlayId](
                this.layout.optballs
            );
            // 特殊情况处理 因随机的一个号码有可能够成多注会返回一个对象
            if (typeof result === "object") {
                ball = result.ball;
            } else {
                ball = result;
            }
            ball.split("|").forEach(item => {
                list.push(item.split(","));
            });
            // 判断需要勾选位置的玩法  只有时时彩任选时要处理
            if (this.layout.positionbar) {
                this.btnsPosition = list[0];
                list = [list[1]];
            }
            this.ballList.forEach((item, idx) => {
                item.balls.forEach(value => {
                    if (list[idx].some(vvv => vvv === value.ball)) {
                        value.selected = true;
                    }
                });
            });
            this.computeLottery(ball);
        },
        // 清除选中
        clearSelected () {
            this.ballList.forEach(item => {
                item.balls.forEach(value => {
                    value.selected = false;
                });
            });
            this.btnsPosition = [];
            this.result = { num: 0 };
        },
        // 计算注数
        computeLottery (balls) {
            let result = this.computeNote[this.data.lotteryPlayId](balls);
            let odds;
            let len = result.length;

            if (result.len || result.len === 0) len = result.len;
            if (this.layout.rates.length > 1) odds = result; // 处理多赔率

            this.$set(this.result, "num", len);
            this.$set(this.result, "balls", balls);
            this.$set(this.result, "odds", odds);
        },
        resetBallList (list, delBall) {
            // 重置列表。在bottom里面调用
            if (list.length <= 0) {
                this.ballList.forEach(item => {
                    item.balls.forEach(ball => {
                        ball.selected = false;
                    });
                });
                this.result.num = 0;
                this.result.balls = "";
                this.result.odds = null;
            } else {
                let lotteryNumber = "",
                    odds = [];
                this.ballList.forEach(item => {
                    item.balls.forEach(ball => {
                        if (delBall === ball.ball) {
                            ball.selected = false;
                        }
                    });
                });
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    lotteryNumber += item.lotteryNumber;
                    odds.push(item.lotteryNumber);
                    if (i < list.length - 1) {
                        lotteryNumber += ",";
                    }
                }
                this.result.num = list.length;
                this.result.balls = lotteryNumber;
                this.result.odds = odds;
            }
        },
        // 选择球号
        chooseBall (vv, vvIdx, item, itemIdx) {
            let vm = this;
            this.selectedBalls = [];
            // 区分快速选择号码与手动点击选择号码

            if (vv && !vv.methodName) {
                vv.selected = !vv.selected;
            }

            this.ballList.forEach((data, dataIdx) => {
                let arr = [];
                data.balls.forEach((value, valueIdx) => {
                    // 判断从点击位置处进来  只有时时彩任选时要处理
                    if (vv) {
                        if (vv.methodName) {
                            if (vvIdx === dataIdx)
                                vm.quickSelect(
                                    vv.methodName,
                                    value,
                                    valueIdx,
                                    data
                                );
                        } else {
                            /*! 去掉当前选项其他选中的球.
                                * !data.muti字段 当前选项不能重复
                                * value.ball !== vv.ball 字段 只处理不是当前选中的球
                                * itemIdx === dataIdx 字段 只处理当前的选项
                                */
                            if (
                                !data.muti &&
                                value.ball !== vv.ball &&
                                itemIdx === dataIdx
                            ) {
                                value.selected = false;
                            }
                            /*! 去掉其他选项的球。
                                * !item.repeatable字段 所有选项中不可出现于其他选项重复的球
                                * alueIdx === vvIdx 字段 当前选中的位置
                                * itemIdx !== dataIdx 字段 只处理别的选项
                                */

                            if (
                                "repeatable" in item &&
                                valueIdx === vvIdx &&
                                itemIdx !== dataIdx
                            ) {
                                value.selected = false;
                            }
                            /*! 判断是否全选
                                *  选中一个全选中，取消一个全取消 
                                */
                            if (data.chooseAll) {
                                if (vv.selected) {
                                    value.selected = true;
                                } else {
                                    value.selected = false;
                                }
                            }
                        }
                    }
                    // 获取选中的球
                    if (value.selected) {
                        arr.push(value.ball);
                    }
                });
                if (vm.layout.positionbar)
                    vm.selectedBalls.unshift(vm.btnsPosition.join(","));
                vm.selectedBalls.push(arr.join(","));
            });
            let balls = vm.selectedBalls.join("|");
            this.computeLottery(balls);
        },
        // 快捷操作
        quickSelect (type, item, idx, data) {
            // ['all', 'big', 'small', 'odd', 'even', 'clear'];
            let arr = [];
            let num = parseInt(item.ball);
            let center = 5;
            // if (data.balls.length === 11) {
            //     center = 6;
            // }
            switch (type) {
                case "all":
                    item.selected = true;
                    break;
                case "big":
                    if (
                        (idx >= center && /^[0-9]/.test(item.ball)) ||
                        item.ball === "大"
                    ) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    break;
                case "small":
                    if (
                        (idx < center && /^[0-9]/.test(item.ball)) ||
                        item.ball === "小"
                    ) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    break;
                case "odd":
                    if (num % 2 === 1 || item.ball === "单") {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    break;
                case "even":
                    if (num % 2 === 0 || item.ball === "双") {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    break;
                case "clear":
                    item.selected = false;
                    break;
            }
        },
        // 初始化
        init () {
            let maxOdds = 0;
            this.data = JSON.parse(JSON.stringify(this.currentLottery));
            this.selectedBalls = [];
            this.btnsPosition = [];
            this.moreRates = {};
            this.result = { num: 0 };
            this.layout = JSON.parse(this.data.layout);
            this.ballList = this.layout.layout;

            this.ballList.forEach(item => {
                let list = [];
                item.balls.split("|").forEach(value => {
                    list.push({ ball: value, selected: false });
                });
                item.balls = list;
            });
            if (this.layout.positionbar) {
                let arr = [];
                this.layout.positionbar.btns.forEach(item => {
                    let obj = Object.assign({}, item);
                    obj.label = obj.operator;
                    obj.value = obj.operator;
                    arr.push(obj);
                });
                this.options = arr;
            }

            if (this.layout.rates.length <= 1) {
                maxOdds = this.singleOdds = this.layout.rates[0].maxOdds;
            } else {
                let max = this.layout.rates[0].maxOdds;
                this.singleOdds = 0;
                this.layout.rates.forEach(item => {
                    this.moreRates[item.ball] = item.maxOdds;
                    if (item.maxOdds > max) {
                        max = item.maxOdds;
                    }
                });
                maxOdds = max;
            }
            this.$emit("get-maxOdd", maxOdds);
            this.$refs.simpleBottom.resetWinH();
            this.$refs.simpleBottom.resetAllData(
                false,
                this.layout.costAmount,
                this.singleOdds
            );
        }
    },

    mounted () {
        this.init();
        this.computeNote = require(`@/components/common/betting_amount/${
            this.code
            }.js`);
        this.random = require(`@/components/common/module_random/${
            this.code
            }.js`);
    }
};
</script>

<style scored lang="less">
.lottery-list {
}
.lottery-list .list li {
    /*   min-height: 5rem; */
    padding: 0.6rem 0.3rem;
    position: relative;
}
.lottery-list .list li.name-place {
    padding-left: 3.4rem;
}
.lottery-list .list li label {
    background: #eee;
    padding-left: 0.3rem;
    padding-right: 0.8rem;
    font-size: 0.7rem;
    height: 1.2rem;
    line-height: 1.2rem;
    color: #999;
    position: absolute;
    left: 0.3rem;
    top: 0.9rem;
}
.lottery-list .list li.tool-bar label {
    top: 2.6rem;
}
.lottery-list .list li label::after {
    content: '';
    height: 0px;
    width: 0px;
    border-top: 0.6rem solid #f8f8f9;
    border-left: 0.4rem solid #eee;
    border-bottom: 0.6rem solid #f8f8f9;
    position: absolute;
    top: 0;
    right: 0;
}
.lottery-list .list li .all-balls {
    float: left;
    display: flex;
    flex-wrap: wrap;
    /* justify-content:center; */
    padding-left: 0.3rem;
}
.lottery-list .list li .all-balls .odds {
    text-align: center;
    color: #999;
    font-size: 0.6rem;
}
.lottery-list .list li .all-balls-odd .num {
    font-size: 0.8rem;
}
.lottery-list .list li .all-balls-odd {
    margin-left: -3%;
    flex-wrap: wrap;
    width: 100%;
}
.lottery-list .list li .all-balls-odd .num-wrap {
    width: 30%;
    margin-left: 3%;
    margin-bottom: 3%;
    background: #fff;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.11);
    text-align: center;
    padding: 0.5rem 0;
    border-radius: 3px;
}

.lottery-list .list li .all-balls-odd .num-wrap .odds {
    color: #ec0022;
}

.lottery-list .list li .all-balls-odd .selected {
    background: #ec0022;
    border-color: #e06136;
    color: #fff;
}
.lottery-list .list li .all-balls-odd .num-wrap.selected p {
    color: #fff;
}

.lottery-list .list li .all-balls i {
    display: block;
    float: left;
    border-radius: 50%;
    border: 1px solid #e2e2e2;
    font-size: 0.88rem;
    width: 1.8rem;
    height: 1.8rem;
    line-height: 1.7rem;
    text-align: center;
    margin: 0 0.1rem 0.3rem;
    font-size: 0.76rem;
    /*    color: #ec0022; */
}
.lottery-list .list li .all-balls i.selected {
    background: #ec0022;
    border-color: #e06136;
    color: #fff;
}
.lottery-list .list li .ball-bts {
    float: left;
    width: 100%;
    padding-left: 0.3rem;
    margin-bottom: 0.5rem;
}
.lottery-list li .ball-bts > div {
    font-size: 0.7rem;
    padding: 0.03rem 0;
    border: 1px solid #eee;
    border-radius: 0.5rem;
    background: #f1f1f1;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) inset;
}
.lottery-list .list li .ball-bts span {
    display: inline-block;
    text-align: center;
}
.lottery-list .list li .ball-bts span:hover {
    color: #fff;
    background: #dd4413;
}
.lottery-list .manual .notes {
    background: #eee;
    padding: 0.2rem 0.5rem;
}
.lottery-list .manual .notes span {
    color: #dd4413;
}
.lottery-list .result-page .result-content {
    background: #2a2d32;
    width: 100%;
    line-height: 2.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 200;
    color: #fff;
    font-size: 0.66rem;
}
.lottery-list .result-page .result-content .text-center {
    float: left;
    text-align: center;
    width: 25%;
}
.lottery-list .result-page .result-content .clo-xs {
    width: 50%;
}
.lottery-list .result-page .result-content .back-color-gray {
    background: #444;
}
.lottery-list .result-page .result-content .back-color-danger {
    background-color: rgb(241, 23, 23);
}
.lottery-list .result-page .result-content .text-warning {
    color: #ffc107;
}

.lottery-list .btns-position {
    background: #f1f1f1;
    margin: 0.6rem 0.3rem 0;
    padding: 0.3rem 0;
    height: 1.6rem;
}
.lottery-list .btns-position .title-p {
    font-size: 0.7rem;
    width: 3rem;
    text-align: center;
    float: left;
}
/* .lottery-list .btns-position .checkbox-list{
        float: left;
    } */
/* 组件样式 */
.lottery-list .btns-position .mint-checklist .mint-checklist-title {
    margin: 0;
    width: 0.45rem;
    height: 1rem;
    float: left;
}
.lottery-list .btns-position .mint-checklist .mint-cell {
    float: left;
    padding: 0;
    width: 2.6rem;
    min-height: 1rem;
    background: none;
}
.lottery-list .btns-position .mint-checklist .mint-cell .mint-cell-wrapper {
    padding: 0;
}
.lottery-list
    .btns-position
    .mint-checklist
    .mint-cell
    .mint-cell-wrapper
    .mint-checklist-label {
    padding: 0;
    font-size: 0.6rem;
}
.lottery-list
    .btns-position
    .mint-checklist
    .mint-cell
    .mint-cell-wrapper
    .mint-checkbox-core {
    width: 14px;
    height: 14px;
    border-radius: 0;
}
.lottery-list
    .btns-position
    .mint-checklist
    .mint-cell
    .mint-cell-wrapper
    .mint-checkbox-core::after {
    width: 3px;
    height: 7px;
    top: 0;
    left: 4px;
}
.lottery-list
    .btns-position
    .mint-checklist
    .mint-cell
    .mint-checkbox-input:checked
    + .mint-checkbox-core {
    background-color: #ffc107;
    border-color: #ffc107;
}
.lottery-list .btns-position .mint-checklist .mint-cell .mint-checkbox-label {
    margin: 0;
}
.lottery-list .listDlg {
    padding: 0;
}
</style>

