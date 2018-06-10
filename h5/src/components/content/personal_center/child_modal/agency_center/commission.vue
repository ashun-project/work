<template>
    <div>
        <div>
            <my-header title="代理佣金" bkUrl="/agencyCenter"> </my-header>
            <div class="bg-skeen" ref="viewBox" v-refresh="downRefresh" scrollDom="#myScroll">
                <div class="scroll-inner">
                    <p class="spit"></p>
                    <div class="search-head">
                        <input class="in" id="startTime" @click="openPicker(0)" readonly v-model="startTime" type="text" placeholder="2018-01-27">
                        <span class="to">至</span>
                        <input class="in" id="endTime" @click="openPicker(1)" readonly v-model="endTime" type="text" placeholder="2018-02-27">
                        <history-select @get-history-select="getHistorySelect"></history-select>
                    </div>
                    <div class="yj-count">
                        <p class="tit">{{startTime + "至" + endTime}} 统计：</p>
                        <ul class="counts">
                            <li>
                                <i class="icon-yj"></i>
                                <div class="cont">
                                    <p class="name">佣金</p>
                                    <p class="money">{{this.rebateSumTotal | keepDecimalOf2}}</p>
                                </div>
                            </li>
                            <li>
                                <i class="icon-tzje"></i>
                                <div class="cont">
                                    <p class="name">投注金额</p>
                                    <p class="money">{{this.buyMoneyTotal | keepDecimalOf2}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="commission-scroll">
                        <my-scroll :fetchData="queryList" :status="status" id="myScroll">
                            <table class="agency-tb">
                                <thead>
                                    <tr>
                                        <th class="cz2">彩种</th>
                                        <th>期数</th>
                                        <th>投注金额</th>
                                        <th>佣金</th>
                                        <th>投注人数</th>
                                        <th>状态</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in rebateList" :key=index>
                                        <td>{{item.lotteryName}}</td>
                                        <td>{{item.periodNo}}</td>
                                        <td>{{item.buyMoney | keepDecimalOf2}}</td>
                                        <td>{{item.rebateSum | keepDecimalOf2}}</td>
                                        <td>{{item.bettingUserCount}}</td>
                                        <td>{{item.status}}</td>
                                    </tr>
                                    <!--     <tr v-if="rebateList.length <= 0">
                            <td colspan="6"  v-if="!loging" class="empty-data">
                                查无数据
                            </td>
                        </tr> -->
                                </tbody>
                            </table>

                        </my-scroll>
                    </div>

                </div>
            </div>
            <mt-datetime-picker type="date" ref="picker" v-model="pickerCurrentTime" @confirm="confirm" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>

        </div>
    </div>
</template>
<script>
import dateUtil from "@/components/common/module_js/format_date.js";
import historySelect from "./child_modal/history_select.vue";
export default {
    data () {
        return {
            startTime: dateUtil.getFormatDate(new Date()),
            endTime: dateUtil.getFormatDate(new Date()),
            rebateList: [],
            total: 0,
            current: 0,
            size: 10,
            countType: 0,
            buyMoneyTotal: 0,
            rebateSumTotal: 0,
            countTit: "今天",
            status: 0,
            pickerCurrentTime: '',
        };
    },
    components: {
        historySelect
    },
    filters: {
        keepDecimalOf2 (val) {
            return val ? val.toFixed(2) : "0.00";
        }
    },
    watch: {
        startTime () {
            this.resetSearch();
            this.queryList();
        },
        endTime () {
            this.resetSearch();
            this.queryList();
        }
    },
    methods: {
        downRefresh () {
            return new Promise((resolve, rej) => {
                this.queryList(resolve)
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        },
        openPicker (pickerType) {
            this.pickerType = pickerType;
            if (pickerType === 0) {
                this.pickerCurrentTime = this.startTime;
            } else {
                this.pickerCurrentTime = this.endTime;
            }
            this.$refs.picker.open();
        },
        changCountTit () {
            // let countTit = "",
            //     endTime = dateUtil.getFormatDate(this.endTime),
            //     nowTime = dateUtil.getFormatDate(new Date());

            // if (nowTime === endTime) {
            //     let days = new Date(this.endTime).getTime() - new Date(this.startTime).getTime();
            //     let type = parseInt(days / (1000 * 60 * 60 * 24));
            //     if (type === 0) {
            //         countTit = "今天";
            //     } else if (type === 1) {
            //         countTit = "昨天";
            //     } else if (type > 1 && type < 7) {
            //         countTit = "本周";
            //     } else if (type > 7 && type < 30)
            //     switch (type) {
            //         case 0:
            //             countTit = "今天";
            //             break;
            //         case 1:
            //             countTit = "昨天";
            //             break;
            //         case 7:
            //             countTit = "本周";
            //             break;
            //         case 15:
            //             countTit = "本月";
            //             break;
            //         default:
            //             countTit = this.startTime + "至" + this.endTime;
            //             break;
            //     }
            // } else {
            //     countTit = this.startTime + "至" + this.endTime;
            // }
            // this.countTit = this.startTime + "至" + this.endTime;
        },
        resetSearch () {
            this.noMore = false;
            this.current = 0;
            this.rebateList = [];

        },
        confirm (val) {
            if (this.pickerType === 0) {
                this.startTime = dateUtil.getFormatDate(val);
            } else {
                this.endTime = dateUtil.getFormatDate(val);
            }
            this.$refs.picker.close();
        },
        getHistorySelect (obj) {
            this.endTime = obj.endTime;
            this.startTime = obj.startTime;
        },
        queryList (resolve) {
            if (this.startTime && this.endTime) {
                var start = new Date(this.startTime).getTime();
                var end = new Date(this.endTime).getTime();
                if (start > end) {
                    this.$Message("开始时间不能小于结束时间");
                    return false;
                }
            }
            // this.changCountTit();
            this.status = 1
            this.current++;
            if (resolve) {
                this.current = 1;
            }
            this.$http.post("/api/v2/agent/subuser/rebate", {
                gtBuyTime: this.startTime,
                ltBuyTime: this.endTime,
                current: this.current,
                size: this.size
            }, { userId: true }).then(res => {
                if (resolve) {
                    resolve();
                    this.rebateList = [];
                }
                this.status = 0
                if (res.data.code !== 0) {
                    this.status = 2
                };
                let data = res.data.data;
                if (data.rebateList && data.rebateList.length > 0) {
                    this.rebateList = this.rebateList.concat(data.rebateList);
                }
                if (this.rebateList.length <= 0) {
                    this.status = 3
                }
                if (data.rebateList.length < this.size) {
                    this.status = 2
                }
                this.total = data.total;
                this.buyMoneyTotal = data.buyMoneyTotal;
                this.rebateSumTotal = data.rebateSumTotal;
            });
        }
    }
};
</script>
<style lang="less">
@import './agency.less';
</style>

<style scored lang="less">
@rem: 40rem; //根据页面尺寸算的
.yj-count {
    position: relative;
    z-index: 81;
    padding: 0 34 / @rem;
    margin: 20 / @rem 0;
    background-color: #f5f5f5;

    .tit {
        margin-bottom: 5px;
    }
    .counts {
        display: flex;
    }
    li {
        background-color: #fff;
        margin-right: 10%;
        display: flex;
        flex: 1;
        align-items: center;
        padding: 20 / @rem 34 / @rem;
        border-radius: 5px;
        font-size: 28 / @rem;
        &:last-child {
            margin-right: 0;
        }
        i {
            width: 70 / @rem;
            height: 44 / @rem;
            margin-right: 20 / @rem;
            background: url(../../../../../resource/images/agent-icons.png)
                no-repeat;
            background-size: 400 / @rem 500 / @rem;
        }
        .icon-yj {
            background-position: -78 / @rem 0;
        }
        .icon-tzje {
            background-position: 0 0;
        }
        .cont {
            flex: 1;
        }
        .name {
            color: #999;
        }
        .money {
            color: #ff7614;
        }
    }
}
.yj-select {
    .list {
        border: 1px solid #999;
        left: 50%;
        width: 150 / @rem;
        text-align: center;
        margin-left: -75 / @rem;
        li {
            border-bottom: 1px solid #c3c3c3;
            line-height: 60 / @rem;
            &:last-child {
                border-bottom: 0;
            }
        }
    }
}
.bg-skeen .loging,
.bg-skeen .no-more {
    text-align: center;
    line-height: 1.5rem;
}
</style>


