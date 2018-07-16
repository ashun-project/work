<template>
    <div class="agentDealList" ref="viewBox">
        <my-header title="交易明细" bkUrl="/agencyCenter">
        </my-header>

        <div v-refresh="downRefresh" scrollDom="#myScroll">
            <p class="ui-split"></p>
            <div class="agent-search ">
                <input v-model="agentCode " placeholder="输入下级代理用户名" @input="userCodeChange" type="text " class="ui-input ">
                <span class="search " @click="getRecordList(true) ">
                    <i class="iconfont icon-search"></i> 搜索
                </span>
            </div>
            <div class="ui-search-from-to">
                <input id="start-time" v-model="startTime" type="text" name="" readonly @click="selectDate(0)" placeholder="开始时间">
                <span>至</span>
                <input id="end-time" v-model="endTime" type="text" name="" readonly @click="selectDate(1)" placeholder="结束时间">
                <!--   <a @click="resetList">
                    <strong>
                        <i class="iconfont icon-shuaxin"></i>&nbsp;</strong>重选</a> -->
                <history-select @get-history-select="getHistorySelect"></history-select>

            </div>
            <ul class="tab ">
                <li v-for="(item, index) in tabList" :class="{'active':index === swiperIndex}" :key="index" @click="clkTab(index)">{{item.title}}</li>
            </ul>
            <my-scroll ref="myScroll" :fetchData="getRecordList" id="myScroll">
                <div v-for="(currentSwiper, idx) in tabList" v-show="idx === swiperIndex" :key="idx">
                    <ul class="list">
                        <li v-for="(item,index) in currentSwiper.list" :key="index">
                            <div class="info">
                                <span class="title lf">{{item.userCode}}</span>
                                <span class="money rf" :class="{'red':Number(item.amount) < 0}">{{Number(item.amount).toFixed(2)}}元</span>
                            </div>
                            <div class="info-bottom">
                                <span class="">{{item.tradeTime}}</span>
                                <span class="rf">{{item.tradeTypeDesc}}</span>
                            </div>
                        </li>
                    </ul>

                </div>
            </my-scroll>

        </div>
        <mt-datetime-picker type="date" ref="picker" v-model="pickerCurrentTime" @confirm="handleConfirm" :startDate="new Date('2017/01/01')" :endDate="new Date()" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
        </mt-datetime-picker>
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js';

export default {
    data () {
        return {
            agentCode: '',
            endTime: dateUtil.getFormatDate(new Date()),
            startTime: dateUtil.getFormatDate(new Date()),
            swiperIndex: 0,
            tabList: [{ title: '所有类型', list: [], param: { current: 1, size: 10 } }, { title: '提现记录', list: [], param: { current: 1, size: 10 } }, { title: '充值记录', list: [], param: { current: 1, size: 10 } }],
            list: [],
            pickerCurrentTime: '',
            // tradeTypeArray: []
        }
    },
    computed: {
        user () {
            return this.$store.state.user
        }
    },
    methods: {
        getHistorySelect (obj) {
            this.endTime = obj.endTime;
            this.startTime = obj.startTime;
            this.resetData()
            this.getRecordList(true);
        },
        downRefresh () {
            return new Promise((resolve, reject) => {
                this.$refs.myScroll.resetBottom();
                this.getRecordList(true);
                if (this.downTimer) clearTimeout(this.downTimer);
                this.downTimer = setTimeout(() => {
                    resolve();
                }, 1000);
            })
        },
        clkTab (idx) {
            this.swiperIndex = idx;
            this.tradeTypeArray = idx === 0 ? [] : idx === 1 ? ['00'] : ['04']
            this.$refs.myScroll.resetBottom();
            if (!this.tabList[idx].list.length) this.getRecordList();
        },
        selectDate (value) {
            if (value === 0) {
                this.pickerCurrentTime = this.startTime;
            } else {
                this.pickerCurrentTime = this.endTime;
            }
            this.dateStatus = value;

            this.pickerCurrentTime = this.pickerCurrentTime ? this.pickerCurrentTime : dateUtil.getFormatDate(new Date())
            this.$refs.picker.open();
        },
        handleConfirm (value) {
            if (this.dateStatus === 0) {
                this.startTime = dateUtil.getFormatDate(value);
            } else {
                this.endTime = dateUtil.getFormatDate(value);
            }
            if (this.startTime && this.endTime) {
                let startT = new Date(this.startTime).getTime();
                let endT = new Date(this.endTime).getTime();
                if (startT > endT) {
                    this.$Message('格式错误\n开始时间过大')
                    return;
                }
                this.resetData();
                this.getRecordList(true);
            }
        },
        resetData () {
            for (let i = 0; i < this.tabList.length; i++) {
                this.tabList[i].list = []
                this.tabList[i].param.current = 1;
            }
        },
        /*     resetList () {
                this.startTime = '';
                this.endTime = '';
                this.agentCode = '';
                this.resetData()
                this.getRecordList(true);
            }, */
        userCodeChange () {
            if (!this.agentCode) {
                this.getRecordList(true);
            }
        },
        getRecordList (isRefresh) {
            let vm = this, myScroll = vm.$refs['myScroll'], currentTab = vm.tabList[this.swiperIndex];
            myScroll.onBottomLoding();
            if (isRefresh) {
                currentTab.param.current = 1;
            }
            this.param = {
                current: currentTab.param.current,
                userCode: this.agentCode,
                tradeTypeArray: this.tradeTypeArray,
                startTime: vm.startTime,
                endTime: vm.endTime
            }

            vm.$http.post('/api/v2/agent/queryAgentBalanceDetailList', this.param, { userId: true, noEncrypt: true }).then(res => {
                if (res.data.code !== 0) {
                    myScroll.onBottomLoaded(0);
                    return
                };
                if (isRefresh) {
                    vm.resetData();
                    myScroll.$el.scrollTo(0, 0);
                }
                currentTab.param.current = currentTab.param.current + 1
                let data = res.data.data.balanceDetailList;
                currentTab.list = currentTab.list.concat(data);
                myScroll.onBottomLoaded(1, currentTab.list.length, data, currentTab.param.size);
            });

        }
    },
    mounted () {
        this.tradeTypeArray = []
    },
    created () {
    }
}   
</script>

<style scoped lang="less">
.agentDealList {
    background: #f3f3f3;
}
.agentDealList .popup {
    position: absolute;
    top: 2rem;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(51, 51, 51, 0.31);
    border-bottom: 1px solid #f2f2f2;
    /* box-shadow: 0px 2px 4px rgba(51, 51, 51, 0.31); */
    transition: all 0.5s;
    opacity: 0;
    z-index: 1000;
    visibility: hidden;
}
.agentDealList .popup.show-popup {
    opacity: 1;
    top: 2.2rem;
    visibility: visible;
}
/* 选择彩种弹窗是禁止滚动 */
.agentDealList .list.flexList {
    position: fixed;
    width: 100%;
}
.agentDealList .popup .cont {
    height: 60%;
    padding: 0 2%;
    background: #fff;
    overflow-y: scroll;
    box-shadow: 0px 2px 4px rgba(79, 71, 71, 0.83);
}
.agentDealList .popup ul li {
    float: left;
    color: #333;
    width: 30%;
    border: 1px solid #ececec;
    margin: 1.6%;
    line-height: 1.3rem;
    border-radius: 0.1rem;
    font-size: 0.7rem;
    text-align: center;
}
.agentDealList .popup ul li.active {
    color: #fff;
    background: #ff536f;
    border-color: #ff536f;
}
.agentDealList .tab {
    height: 2rem;
    width: 100%;
    line-height: 2rem;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    text-align: center;
    background-color: #fff;
}
.agentDealList .list {
    padding: 0 1rem;
    background: #fff;
}
.agentDealList .tab li {
    cursor: pointer;
    height: 1.9rem;
    flex: 1;
    position: relative;
    border-bottom: 2px solid #e2e2e2;
}
.agentDealList .tab li.active {
    border-bottom: 2px solid #be1204;
    color: #be1204;
}
.agentDealList .list li {
    padding: 0.6rem 0;
    background: #fff;
    height: 4rem;
    font-size: 0.7rem;
    border-bottom: 1px solid rgb(238, 236, 236);
}
.agentDealList .list li:last-child {
    margin: 0;
}
.agentDealList .list li > div {
    height: 50%;
}
.agentDealList .list li span {
    display: inline-block;
    font-size: 0.66rem;
    float: left;
}
.agentDealList .list li .info {
    height: 1.8rem;
    line-height: 1.3rem;
}
.agentDealList .list li .info-bottom {
    color: #999;
}
.agentDealList .list li .info .period {
    font-size: 0.66rem;
    color: rgb(134, 132, 132);
    width: 40%;
    line-height: 1.3rem;
}
.agentDealList .list li .info .money {
    color: #be1204;
    text-align: right;
    width: 25%;
}
.agentDealList .list li .info .money.green {
    color: green;
}
.agentDealList .list li span.title {
    font-size: 0.8rem;
    color: #333;
    width: 35%;
}
.agentDealList .list li span.rf {
    float: right;
}
</style>


<style>
.agentDealList .swiper-slide {
    min-height: 10rem;
}
/* .agentDealList .swiper-slide-active {
    height: 100% !important;
}  */
</style>
