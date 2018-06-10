<template>
    <div>
        <div class="lottery-bottom" ref="lotteryBottom">
            <div class="shadom" ref="shadom"></div>
            <div class="row current-code" v-show="result.num>0">
                <label class="lb">当前选号</label>
                <div class="val" ref="startFly">
                    <template v-if="result.num">
                        <i class="iconfont icon-leftDouble" @click="scrollCode(0)"></i>
                        <div class="scroll">
                            <div class="nums" ref="scollBox">
                                {{result.balls}}
                            </div>
                        </div>
                        <i class="iconfont icon-rightDouble" @click="scrollCode(1)"></i>
                    </template>
                </div>
            </div>
            <div class="row eachMoney" v-show="result.num>0" v-if="userExist">
                每注金额 <input v-model="singleMoney" @blur="setSingleMoney($event)" @input="checkInputNum($event,'singleMoney', singleLimit)" type="number" class="in fixInput">元
                <!-- 请输入要投注的金额 -->
                若中奖,单注最高中
                <span class="t-red">{{singleHighMoney}}</span>元

            </div>

            <div class="row chase" v-show="showChase">
                <div class="item">
                    投<input type="number" ref="chaseNum" v-model="chaseNum" @blur="blurInput($event,'chaseNum')" @keyup="checkInputNum($event,'chaseNum',100000)" class="in fixInput">倍
                </div>
                <div class="item">
                    追<input type="number" v-model="chasePeriodNo" @blur="blurInput($event,'chasePeriodNo')" @keyup="changeChaseList($event,'chasePeriodNo')" class="in fixInput">期
                </div>
                <div class="item autoStop">
                    <mt-checklist v-model="lotteryStop" :options="[{label:'中奖即停', value: '1'}]">
                    </mt-checklist>
                </div>
            </div>
            <div class="tool">
                <div class="item jx" @click="randomBetting" v-if="result.num <= 0">
                    <i class="iconfont icon-randomPlay"></i>机选
                </div>
                <div class="item jx" @click="clearSelected" v-else>
                    清除
                </div>
                <div class="total">
                    <p>
                        共{{totalChasePeriodNo}}注
                        <span class="t-red">{{totalMoney}}</span>元
                    </p>
                    <p v-if="user.userCode">
                        可用余额
                        <span class="t-red">{{user.balance.toFixed(2)}}</span>元</p>

                </div>
                <div class="item tz" :class="{'disabled': !recordId}" @click="saveBetting">投注</div>
            </div>

        </div>
        <my-dialog v-model="isShowBettingInfo" class="listDlg" title="注单">
            <i class="iconfont icon-close" @click="closeDlg"></i>
            <div slot="d-food" style="display:none"></div>
            <div ref="bettingList" class="scroll-wrap">
                <ul class="betting-list" v-if="bettingInfoList.length">
                    <li v-for="(item,index) in bettingInfoList" :key="index">
                        <p class="num">{{item.lotteryNumber}}</p>
                        <div class="info">
                            {{item.playName}} {{item.bettingNum}}注x{{item.singleMoney}}元= {{item.bettingMoney}}元
                        </div>
                        <i class="iconfont icon-delete" @click.stop="delBettingList(item,index)"></i>
                    </li>
                </ul>
                <div v-else class="empty-data">暂无选号</div>
            </div>
            <div class="bet-info">
                共
                <span class="t-red">{{totalChasePeriodNo}}</span>注
                <span class="t-red">{{totalMoney}}</span>元
                <template v-if="parseInt(chasePeriodNo)>1">
                    投
                    <span class="t-red">{{chaseNum}}</span>倍 追
                    <span class="t-red">{{chasePeriodNo}}</span>期
                </template>
            </div>
            <div class="btn-group">
                <div class="btn clearCode" @click="clearDlgList">
                    <i class="iconfont icon-del"></i> 清空注单
                </div>
                <div class="btn tz" @click="submitBetting">确定投注</div>
            </div>

        </my-dialog>
        <div class="guide-page" ref="guidePage" @touchmove.prevent>
            <i class="ksan-1" ref="step1"></i>
            <i class="ksan-2"></i>
        </div>
    </div>
</template>
<script>
import Util from "@/components/common/module_js/util";
export default {
    props: {
        lotteryPlayId: "",
        lotteryBettingId: "",
        recordId: "",
        playName: "",
        code: {
            type: String
        },
        period: "",
        layout: {},
        result: {}, //选择结果
        singleLimit: "", // 限制金额
        moreRates: {}
    },
    data () {
        return {
            lotteryStop: ["1"],
            showChase: false,
            bettingInfoList: [],
            chaseNum: 1, // 追期投注倍数
            chasePeriodNo: 1, // 追期期数
            bettingInfo: {},
            isShowBettingInfo: false,
            periodList: [],
            singleOdds: 0,
            singleMoney: 0,
            loading: false
        };
    },
    computed: {
        userExist () {
            return this.$store.state.user.userCode
        },
        totalMoney () {
            // 获取总金额
            let money = 0,
                singleMoney = parseInt(this.singleMoney),
                chasePeriodNo = parseInt(this.chasePeriodNo),
                chaseNum = parseInt(this.chaseNum);
            money = (singleMoney ? singleMoney : 0) * this.result.num;
            if (chasePeriodNo) {
                money = money * chasePeriodNo;
            }
            if (chaseNum) {
                money = money * chaseNum;
            }

            return money.toFixed(2);
        },
        totalChasePeriodNo () {
            // 获取总投注
            let num = this.result.num,
                chasePeriodNo = parseInt(this.chasePeriodNo);
            if (chasePeriodNo) {
                num = num * chasePeriodNo;
            }
            return num;
        },
        singleHighMoney () {
            // 获取单注最高金额
            let currentRates = [];
            if (!this.result.num || !this.singleMoney) return 0;
            if (this.lotteryPlayId === "7060101") {
                // 六合彩正码过关最高赔率
                let balls = this.result.balls.split("|"),
                    moreMoney = this.singleMoney;
                for (let ball of balls) {
                    if (ball) {
                        moreMoney = moreMoney * this.moreRates[ball];
                    }
                }
                return moreMoney.toFixed(2);
            } else if (this.layout.rates.length <= 1) {
                return (this.singleMoney * this.singleOdds).toFixed(2);
            } else {
                if (this.result.odds && this.moreRates) {
                    this.result.odds.forEach(item => {
                        currentRates.push(this.moreRates[item]);
                    });
                } else if (this.result.balls) {
                    let balls = this.result.balls.split(/\||\,/);
                    balls.forEach(item => {
                        currentRates.push(this.moreRates[item]);
                    });
                }

                if (currentRates.length) {
                    return (
                        currentRates.sort((x, y) => y - x)[0] * this.singleMoney
                    ).toFixed(2);
                } else {
                    return this.singleMoney.toFixed(2);
                }
            }
        },
        user () {
            return this.$store.state.user;
        }
    },
    watch: {
        period () {
            // 期数变化
            if (this.chasePeriodNo > 1) {
                this.chasePeriodNo--;
                this.queryChaseNum();
            }
        },
        result: {
            handler (n) {
                if (n.num > 0) {
                    this.guidePage(n.num);
                }
            },
            deep: true
        }
    },
    methods: {
        createdBettingInfo (rebate) {
            return {
                lotteryId: this.$route.params.id,
                lotteryPlayId: this.lotteryPlayId,
                lotteryBettingId: this.lotteryBettingId,
                autoStop: false,
                rebate: rebate || 0
            };
        },
        showBettingInfo () {
            if (this.bettingInfoList.length) {
                this.isShowBettingInfo = true;
            } else {
                this.$Message("请添加选号");
            }
        },
        clearSelected () {
            // 清除选号
            this.$parent.clearSelected();
        },
        randomBetting () {
            // 随机
            this.$parent.randomBetting();
        },
        changeChaseList ($event, dataName) {
            this.checkInputNum($event, dataName, 10);
            this.queryChaseNum();
        },
        queryChaseNum () {
            // 获取追号列表
            let vm = this;
            let num = parseInt(this.chasePeriodNo);
            if (!num) num = 1;
            this.$http
                .post("/api/v2/lottery/queryLotteryRecordList", {
                    lotteryId: this.$route.params.id,
                    num: num
                })
                .then(response => {
                    if (response.data.code !== 0) return;
                    vm.periodList = response.data.data.recordList;
                    if (vm.periodList.length < num) {
                        this.chasePeriodNo = num;
                    }
                });
        },
        toggleShowChase () {
            // 显示追期
            this.showChase = !this.showChase;
            if (this.showChase) {
                this.chasePeriodNo = 10;
                this.queryChaseNum();
            } else {
                this.chasePeriodNo = 1;
                this.chaseNum = 1;
            }
        },

        scrollCode (type) {
            // 左右移动
            let scollBox = this.$refs.scollBox,
                scrollLeft = scollBox.scrollLeft,
                maxScrollLeft = scollBox.scrollWidth - scollBox.clientWidth;
            if (type === 0) {
                scrollLeft -= 10;
                if (scrollLeft <= 0) {
                    scrollLeft = 0;
                }
            } else {
                scrollLeft += 10;
                if (scrollLeft >= maxScrollLeft) {
                    scrollLeft = maxScrollLeft;
                }
            }
            scollBox.scrollLeft = scrollLeft;
        },
        setSingleMoney ($event) {
            // 每注金额变化时
            this.blurInput($event, "singleMoney");
            if (!$event.target.value || !parseInt($event.target.value)) {
                this.singleMoney = this.layout.costAmount;
            }
        },
        checkInputNum ($event, data, max) {
            let target = $event.target,
                v = parseInt(target.value.replace(/[^0-9]/g, ""));
            if (max && v) {
                v = v > max ? max : v;
            }
            target.value = this[data] = v;
        },
        blurInput ($event, data) {
            let target = $event.target;
            if (!target.value) {
                this[data] = 1;
            } else {
                this.checkInputNum($event, data);
            }
        },
        resetAllData (clearBettingInfoList, singleMoney, singleOdds) {
            // 清除所有数据
            this.isShowBettingInfo = false;
            this.bettingInfo = this.createdBettingInfo();
            this.clearSelected(); // 清除选号
            this.chaseNum = 1;
            this.chasePeriodNo = 1;
            if (singleMoney) {
                this.singleMoney = singleMoney;
            } else {
                this.singleMoney = this.layout.costAmount;
            }

            if (singleOdds) {
                this.singleOdds = singleOdds;
            }

            if (clearBettingInfoList) {
                setTimeout(() => {
                    this.bettingInfoList = [];
                }, 500);
            }
            this.showChase = false;
        },
        closeDlg () {
            // 关闭投注弹框
            this.isShowBettingInfo = false;
        },
        clearDlgList () {
            // 清空投注单
            this.resetAllData(true);
        },
        delBettingList (item, index) {
            // 删除号码
            this.bettingInfoList.splice(index, 1);
            if (!this.bettingInfoList.length) {
                this.resetAllData();
                /* this.isShowBettingInfo = false;
                  this.chasePeriodNo = 1;
                  this.chaseNum = 1; */
            }
            this.$parent.resetBallList(
                this.bettingInfoList,
                item.lotteryNumber,
                index
            );
        },
        handelBettingInfoList () {
            // 添加注单
            this.bettingInfoList = [];
            if (this.result.num > 0) {
                let bettingInfo = this.createdBettingInfo(),
                    singleMoney = parseInt(this.singleMoney);
                singleMoney = singleMoney
                    ? singleMoney
                    : this.layout.costAmount;
                bettingInfo.playName = this.playName;
                bettingInfo.singleMoney = singleMoney;
                if (this.code == "6hc") {
                    let data = this.$parent.resultDetail();
                    data.forEach(item => {
                        item.singleMoney = this.singleMoney;
                        item.bettingMoney = this.singleMoney * item.bettingNum;
                        item = Object.assign(item, this.createdBettingInfo(item.rebate));
                        this.bettingInfoList.push(item);
                    });
                } else if (this.layout.rates.length === 1) {
                    // 单赔率
                    bettingInfo.bettingMoney = singleMoney * this.result.num;
                    bettingInfo.lotteryNumber = this.result.balls;
                    bettingInfo.odds = this.layout.rates[0].maxOdds;
                    bettingInfo.bettingNum = this.result.num;
                    this.bettingInfoList.push(bettingInfo);
                } else if (this.layout.rates.length > 1) {
                    // 多赔率
                    this.result.odds.forEach(odd => {
                        let bettingInfoItem = Object.assign(
                            {
                                bettingMoney: singleMoney,
                                singleMoney: singleMoney,
                                bettingNum: 1
                            },
                            this.createdBettingInfo()
                        );
                        this.layout.rates.forEach(item => {
                            if (item.ball == odd) {
                                bettingInfoItem.lotteryNumber = item.ball;
                                bettingInfoItem.odds = item.maxOdds;
                            }
                        });
                        this.bettingInfoList.push(bettingInfoItem);
                    });
                }
            }
        },
        guidePage (num) {
            // 添加引导页
            if (num >= 1) {
                let guideLottery = localStorage.getItem("guide_lottery");
                let allBalls = document.getElementsByClassName("all-balls");
                let num = allBalls[0].getElementsByClassName("num")[0];
                if (!guideLottery) {
                    localStorage.setItem("guide_lottery", 1);
                    this.$nextTick(() => {
                        let guidePage = this.$refs.guidePage,
                            step1 = this.$refs.step1;
                        guidePage.style.display = "block";
                        if (num) {
                            const client = num.getBoundingClientRect();
                            step1.style.left = client.left + 10 + "px";
                            step1.style.top = client.top + 20 + "px";
                        }
                        guidePage.addEventListener("click", () => {
                            guidePage.style.display = "none";
                        });
                    });
                }
            }
        },
        saveBetting () {
            // 添加注单
            if (!this.recordId) {
                return
            }
            if (!this.userExist) {
                this.$router.push('/login')
                return
            }
            if (this.result.num > 0) {
                this.handelBettingInfoList();
                this.isShowBettingInfo = true;
            } else {
                this.$Message("请添加选号");
            }
        },
        submitBetting () {
            // 提交注单
            let param = {};
            if (this.totalMoney > 9999999.99) {
                this.$Message("投注金额不能大于9999999.99");
            }
            let vm = this;
            if (!this.bettingInfoList.length) {
                this.$Message("请添加单注");
                return;
            }
            if (!this.user.userCode) {
                vm.$router.push("/login");
                return;
            }
            // 处理特殊字段 -- 目前只有快三需要处理
            let deal = ["2020101", "2020201", "2040101", "2040202"]; // 需要处理的玩法
            let list = JSON.parse(JSON.stringify(this.bettingInfoList)).map(
                data => {
                    if (deal.some(value => value === data.lotteryPlayId)) {
                        let num = data.lotteryNumber.split("|");
                        let type = "|";
                        if (num.length < 2) {
                            num = data.lotteryNumber.split(",");
                            type = ",";
                        }
                        num = num.map(item => {
                            if (item.length > 1) {
                                item = item.substr(0, 1);
                            }
                            return item;
                        });
                        data.lotteryNumber = num.join(type);
                    }
                    // 处理追号，中奖后停止追号
                    data.autoStop = this.lotteryStop.length > 0 ? 1 : 0;
                    return data;
                }
            );

            param = {
                bettingInfoList: list,
                bettingRecordList: [
                    {
                        lotteryRecordId: this.recordId,
                        periodNo: this.period,
                        num: this.chaseNum
                    }
                ],
                totalMoney: parseFloat(this.totalMoney)
            };

            if (parseInt(this.chasePeriodNo) > 1) {
                let bettingRecordList = [];
                this.periodList.forEach(item => {
                    bettingRecordList.push({
                        lotteryRecordId: item.lotteryRecordId,
                        periodNo: item.periodNo,
                        num: this.chaseNum
                    });
                });
                param.bettingRecordList = bettingRecordList;
            }
            // 防止重复点击提交
            if (this.loading) return;
            this.loading = true;
            this.$http.post("/api/v2/lottery/betting", param, {
                userId: true,
                loading: 1
            }).then(response => {
                this.loading = false;
                if (response.data.code !== 0) return;
                this.resetAllData(true);
                this.$Message("下注成功");
                this.user.balance = response.data.data;
                localStorage.setItem("user", JSON.stringify(this.user));
                this.$store.commit("getUser", this.user);
            });
        },
        resetWinH () {
            // 修复ios fixed input 重新设置body
            let bottom = document.querySelector(".lottery-bottom");
            if (this.$refs.shadom) {
                this.$refs.shadom.style.display = "none";
            }
            if (bottom) {
                bottom.style.position = "fixed";
            }
            document.body.style.overflow = "auto";
            document.body.style.height = "";
            document.documentElement.style.overflow = "auto";
            document.documentElement.style.height = "";
        },
        fixInput () {
            // 修复ios fixed input
            let UA = window.navigator.userAgent,
                isIos = /iPad/i.test(UA) || /iPod|iPhone/i.test(UA);
            if (!isIos) return;
            let bottom = document.querySelector(".lottery-bottom");
            let doms = document.querySelectorAll(".fixInput");
            for (let dom of doms) {
                dom.addEventListener("touchstart", () => {
                    this.$refs.shadom.style.display = "block";
                    bottom.style.position = "absolute";
                    document.body.style.overflow = "hidden";
                    document.body.style.height = "100%";
                    document.documentElement.style.overflow = "hidden";
                    document.documentElement.style.height = "100%";
                });
            }
            this.$refs.shadom.addEventListener("touchstart", event => {
                this.resetWinH();
            });
        }
    },
    destroyed () {
        this.resetWinH();
    },
    mounted () {
        this.$nextTick(() => {
            this.fixInput();
            this.$refs.bettingList.style.maxHeight =
                document.documentElement.clientHeight * 0.7 + "px";
        });
    }
};
</script>
<style lang="less">
@import './bottom.less';
</style>