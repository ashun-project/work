<template>
    <div>
        <div v-refresh="downRefresh" id="report-id">
            <my-header :title="type === '1' ? '个人报表': '团队报表' " bkUrl="/agencyCenter"> </my-header>
            <div class="bg-skeen">
                <p class="spit"></p>
                <div class="search-head">
                    <input class="in" id="startTime" @click="openPicker(0)" readonly v-model="startTime" type="text" placeholder="2018-01-27">
                    <span class="to">至</span>
                    <input class="in" id="endTime" @click="openPicker(1)" readonly v-model="endTime" type="text" placeholder="2018-02-27">
                    <history-select @get-history-select="getHistorySelect"></history-select>
                </div>
                <p class="spit"></p>
                <ul class="team-list">
                    <li v-if="type !== '1'">
                        <label class="key">团队盈亏</label>
                        <span class="val">
                            <span class="num"> {{teamReport.profitLossTotal | keepDecimalOf2}}</span> 元
                        </span>
                    </li>

                    <li>
                        <label class="key">投注金额</label>
                        <span class="val">
                            <span class="num"> {{teamReport.buyTotal | keepDecimalOf2}}</span> 元
                        </span>
                    </li>
                    <li>
                        <label class="key">彩派总额</label>
                        <span class="val">
                            <span class="num"> {{teamReport.prizeTotal | keepDecimalOf2}}</span> 元
                        </span>
                    </li>
                    <li>
                        <label class="key">佣金总额</label>
                        <span class="val">
                            <span class="num"> {{teamReport.rebateTotal | keepDecimalOf2}}</span> 元
                        </span>
                    </li>
                    <li>
                        <label class="key">充值总额</label>
                        <span class="val">
                            <span class="num"> {{teamReport.rechargeTotal | keepDecimalOf2}}</span> 元
                        </span>
                    </li>
                    <li>
                        <label class="key">提款总额</label>
                        <span class="val">
                            <span class="num"> {{teamReport.takeFeeTotal | keepDecimalOf2}}</span> 元
                        </span>
                    </li>
                    <li>
                        <label class="key">返利总额</label>
                        <span class="val">
                            <span class="num"> {{teamReport.fanliTotal | keepDecimalOf2}}</span> 元
                        </span>
                    </li>
                </ul>

            </div>
        </div>
        <mt-datetime-picker type="date" ref="picker" v-model="pickerCurrentTime" @confirm="confirm" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>
    </div>
</template>
<script>
import dateUtil from "@/components/common/module_js/format_date.js";
export default {
    data () {
        return {
            startTime: dateUtil.getFormatDate(new Date()),
            endTime: dateUtil.getFormatDate(new Date()),
            teamReport: {},
            pickerCurrentTime: '',
            type: this.$route.query.type
        };
    },
    watch: {
        /*   startTime () {
              this.getData();
          },
          endTime () {
              this.getData();
          } */
    },
    methods: {
        downRefresh () {
            return new Promise((resolve, rej) => {
                this.getData(resolve);
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
        confirm (val) {
            if (this.pickerType === 0) {
                this.startTime = dateUtil.getFormatDate(val);
            } else {
                this.endTime = dateUtil.getFormatDate(val);
            }
            this.getData();
            this.$refs.picker.close();
        },
        getHistorySelect (obj) {
            this.endTime = obj.endTime;
            this.startTime = obj.startTime;
            this.getData();
        },
        getData (resolve) {
            var userId = this.$route.query.id;
            if (this.startTime && this.endTime) {
                var start = new Date(this.startTime).getTime();
                var end = new Date(this.endTime).getTime();
                if (start > end) {
                    this.$Message("开始时间不能小于结束时间");
                    return false;
                }
            }
            if (!userId) {
                var user = localStorage.getItem("user"),
                    userId = "";
                if (!user) {
                    return;
                }
                user = JSON.parse(user);
                userId = user.userId;
            }
            this.$http.post(this.type === '1' ? "/api/v2/agent/subuser/oneReport" : "/api/v2/agent/subuser/teamReport", {
                userId: userId,
                gtBuyTime: this.startTime,
                ltBuyTime: this.endTime
            }, { userId: true, loading: true, noEncrypt: true })
                .then(res => {
                    if (resolve) {
                        resolve()
                    }
                    let data = res.data.data;
                    this.teamReport = data;
                });
        }
    },
    mounted () {
        $('#report-id')[0].style.minHeight = document.documentElement.clientHeight + 'px'
        this.getData();
    }
};
</script>
<style lang="less">
@import './agency.less';
</style>
<style scored lang="less">
@rem: 40rem; //根据页面尺寸算的
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
.team-list {
    background: #fff;
    padding: 0 34 / @rem;
    li {
        height: 103 / @rem;
        border-bottom: 1px solid #f2f2f2;
        display: flex;
        align-items: center;
        font-size: 32 / @rem;
        .key {
            flex: 1;
            color: #282828;
        }
        .val {
            width: 8.5rem;
            text-align: right;
            color: #989898;
            .num {
                color: #ff7614;
            }
        }
    }
}
</style>


