<template>
    <div class="betting-list" ref="viewBox" @click="showPopup = false">
        <div v-show="showPage">
            <my-header title="投注明细" :bkUrl="goBk">
                <!-- <span slot="h-left">
              <i @click="$router.go(-1)" class="iconfont icon-arrowLeft"></i>
           </span> -->
                <div slot="h-right" @click.stop="showPopup = !showPopup">
                    {{lotteryName}}
                    <i class="iconfont icon-arrowDown"></i>
                </div>
            </my-header>
            <div class="popup" z :class="{'show-popup': showPopup}">
                <div class="cont" @click.stop="showPopup = true">
                    <ul>
                        <li v-for="(item, idx) in allLottery" :key="idx" :class="{active: item.lotteryId === lotteryId}" @click.stop="changeParent(item)">
                            <!-- @click.stop=""  -->
                            {{item.lotteryName}}
                        </li>
                    </ul>
                </div>
            </div>

            <div v-refresh="downRefresh" scrollDom="#myScroll">
                <p class="ui-split"></p>
                <div class="agent-search" v-if="agentRouter">
                    <input v-model="agentCode" placeholder="输入下级代理用户名" @input="userCodeChange" type="text" class="ui-input">
                    <span class="search" @click="agentSearch">
                        <i class="iconfont icon-search"></i> 搜索
                    </span>
                </div>
                <div class="ui-search-from-to">
                    <input id="start-time" class="ui-input" v-model="gtTime" type="text" name="" readonly @click="selectDate(0)" placeholder="开始时间">
                    <span>至</span>
                    <input id="end-time" class="ui-input" v-model="ltTime" type="text" name="" readonly @click="selectDate(1)" placeholder="结束时间">
                    <!-- <a @click="refresh">
                    <strong>
                        <i class="iconfont icon-shuaxin"></i>&nbsp;</strong>重选</a> -->
                    <history-select @get-history-select="getHistorySelect" v-if="agentRouter"></history-select>
                    <a @click="refresh" v-else>
                        <strong>
                            <i class="iconfont icon-shuaxin"></i>&nbsp;</strong>重选</a>
                </div>
                <div class="tab">
                    <ul>
                        <li v-for="(item, idx) in tabList" :key="idx" @click="changeTab(item, idx)" :class="{active: idx === current}">
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                </div>
                <my-scroll ref="myScroll" :fetchData="getRecordList" id="myScroll">
                    <div class="list" v-for="(item, idx) in tabList" :key="idx" v-show="idx === current" :class="{flexList: showPopup}">
                        <ul>
                            <li v-for="(item,index) in item.list" :key="index" @click="clickItem(item.userBettingRecordId)">
                                <div class="info">
                                    <span class="title lf" v-if="agentRouter">{{item.userCode}}</span>
                                    <span class="title lf" v-else>{{item.lotteryName}}</span>
                                    <span class="period lf">第{{item.periodNo}}期</span>
                                    <span class="money lf">{{item.buyMoney.toFixed(2)}}元</span>
                                </div>
                                <div class="info-bottom">
                                    <span class="">{{item.playName}}</span>
                                    <span class="rf zj" v-if="item.status==='02'">
                                        <i class="iconfont icon-jiangbei2"></i>{{item.statusDesc}}{{item.prize}}元</span>
                                    <span class="rf" v-else>
                                        {{item.statusDesc}}
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </my-scroll>
            </div>
            <mt-datetime-picker type="date" ref="picker" v-model="pickerCurrentTime" @confirm="handleConfirm" :startDate="new Date('2017/01/01')" :endDate="new Date()" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
            </mt-datetime-picker>
        </div>

        <router-view></router-view>
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js'
export default {
    name: 'bettingList',
    data () {
        return {
            status: 0,
            current: 0,
            allLottery: [],
            showPopup: false,
            ltTime: '',
            gtTime: '',
            dateStatus: 0,
            pickerCurrentTime: '',
            lotteryId: '',
            agentRouter: false, // 下级投注记录
            agentCode: '',
            showPage: true,
            tabList: [
                { name: '全部', status: '', current: 1, size: 10, list: [] },
                { name: '已中奖', status: '02', current: 1, size: 10, list: [] },
                { name: '未开奖', status: '00', current: 1, size: 10, list: [] },
                { name: '已撤单', status: '05', current: 1, size: 10, list: [] }
            ],
            lotteryName: '全部彩种',
            goBk: "/personalCenter"

        }
    },
    computed: {
        /*  noticeModify () {
             return this.$store.state.noticeModify;
         }, */
        user () {
            return this.$store.state.user
        }
    },
    watch: {
        '$route' (n, o) {
            this.showPageFn();
        }

    },
    methods: {
        showPageFn () {
            if (this.$route.path.indexOf('/bettingList') > -1) {
                this.showPage = true
            } else {
                this.showPage = false
            }
        },
        changeTab (item, idx) {
            let vm = this;
            this.current = idx;
            vm.$refs.myScroll.resetBottom();
            if (!this.tabList[idx].list.length) this.getRecordList();

        },
        clickItem (id) {
            this.$router.push('/bettingDetail/' + id);
        },
        clearkList () {
            for (let i = 0; i < 4; i++) {
                this.$set(this.tabList[i], 'list', [])
                this.$set(this.tabList[i], 'current', 1);
            }
        },
        agentSearch () {
            this.clearkList();
            this.getRecordList(true)
        },
        changeParent (item) {
            this.lotteryId = item.lotteryId;
            this.showPopup = false;
            this.lotteryName = item.lotteryName;
            this.clearkList();
            this.getRecordList()
        },
        refresh () {
            this.ltTime = '';
            this.gtTime = '';
            this.lotteryId = '';
            this.agentCode = '';
            this.lotteryName = "全部彩种";
            this.clearkList();
            this.getRecordList();
        },
        selectDate (value) {
            if (value === 0) {
                this.pickerCurrentTime = this.gtTime;
            } else {
                this.pickerCurrentTime = this.ltTime;
            }
            this.dateStatus = value;

            this.pickerCurrentTime = this.pickerCurrentTime ? this.pickerCurrentTime : dateUtil.getFormatDate(new Date())
            this.$refs.picker.open();
        },
        handleConfirm (value) {
            if (this.dateStatus === 0) {
                this.gtTime = dateUtil.getFormatDate(value);
            } else {
                this.ltTime = dateUtil.getFormatDate(value);
            }
            if (this.ltTime && this.gtTime) {
                let startT = new Date(this.gtTime).getTime();
                let endT = new Date(this.ltTime).getTime();
                if (startT > endT) {
                    this.$Message('格式错误\n开始时间过大')
                    return;
                }
                this.clearkList();
                this.getRecordList(true);
            }
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
        userCodeChange () {
            if (!this.agentCode) {
                this.getRecordList(true);
            }
        },
        getHistorySelect (obj) {
            this.ltTime = obj.endTime;
            this.gtTime = obj.startTime;
            this.clearkList();
            this.getRecordList(true);
        },
        getRecordList (isRefresh) {
            let vm = this, url = '/api/v2/betting/queryBettingInfoList', currentTab = vm.tabList[vm.current];
            if (isRefresh) {
                vm.$set(currentTab, 'current', 1);
            }
            let param = {
                status: currentTab.status,
                current: currentTab.current,
                size: currentTab.size,
                ltBuyTime: vm.ltTime,
                gtBuyTime: vm.gtTime,
                lotteryId: vm.lotteryId
            }
            if (this.agentRouter) {
                param.userCode = this.agentCode
            }
            vm.$refs.myScroll.onBottomLoding();

            vm.$http.post(this.queryUrl, param, { userId: true, noEncrypt: true }).then(response => {
                if (response.data.code !== 0) {
                    this.$refs.myScroll.onBottomLoaded(0);
                    return
                };
                if (isRefresh) {
                    vm.clearkList();
                }
                let resData = response.data.data.bettingInfoList;
                if (resData.length) {
                    vm.$set(currentTab, 'list', currentTab.list.concat(resData))
                    vm.$set(currentTab, 'current', currentTab.current + 1);
                }

                vm.$refs.myScroll.onBottomLoaded(1, currentTab.list.length, resData, param.size);
            })
        }
    },
    activated () {
        // let agentRouter2 = this.$route.query.type === 'agent' ? true : false;
        // this.queryUrl = agentRouter2 ? '/api/v2/agent/queryAgentBettingList' : '/api/v2/betting/queryBettingInfoList';

        // if (this.agentRouter != agentRouter2) {
        //     this.$refs.myScroll.resetScrollHeight()
        //     if (agentRouter2) {
        //         this.ltTime = dateUtil.getFormatDate(new Date());
        //         this.gtTime = dateUtil.getFormatDate(new Date());
        //     } else {
        //         this.ltTime = "";
        //         this.gtTime = "";
        //     }
        //     this.lotteryId = '';
        //     this.agentCode = '';
        //     this.lotteryName = "全部彩种";
        //     this.clearkList();
        //     this.getRecordList();
        // }

        // this.agentRouter = agentRouter2;
        // this.goBk = this.agentRouter ? "/agencyCenter" : "/personalCenter";
    },
    mounted () {
        // this.getRecordList();
    },
    created () {
        this.agentRouter = this.$route.query.type === 'agent' ? true : false;
        this.queryUrl = this.agentRouter ? '/api/v2/agent/queryAgentBettingList' : '/api/v2/betting/queryBettingInfoList';
        this.goBk = this.agentRouter ? "/agencyCenter" : "/personalCenter";
        this.$http.post('/api/v2/lottery/queryLotteryList', { lotteryType: null }, { noEncrypt: true }).then(response => {
            this.allLottery = response.data.data.lotteryTypeList.filter(item => item.lotteryType === '-2')[0].lotteryList;
        });
        this.showPageFn();
    }
}   
</script>


<style scoped>
.betting-list {
    background: #f3f3f3;
    /*     padding-top: 4.4rem; */
}
.betting-list .popup {
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
.betting-list .popup.show-popup {
    opacity: 1;
    top: 2.2rem;
    visibility: visible;
}
/* 选择彩种弹窗是禁止滚动 */
.betting-list .list.flexList {
    position: fixed;
    width: 100%;
}
.betting-list .popup .cont {
    height: 60%;
    padding: 0 2%;
    background: #fff;
    overflow-y: scroll;
    box-shadow: 0px 2px 4px rgba(79, 71, 71, 0.83);
}
.betting-list .popup ul li {
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
.betting-list .popup ul li.active {
    color: #fff;
    background: #ff536f;
    border-color: #ff536f;
}
.betting-list .tab {
    height: 2rem;
    width: 100%;
    line-height: 2rem;
    font-size: 0.8rem;
    overflow: hidden;
    /*  position: absolute;
    top: -2rem; */
    z-index: 90;
}
.betting-list .tab li {
    float: left;
    text-align: center;
    cursor: pointer;
    height: 1.9rem;
    width: 25%;
    position: relative;
    background: #fff;
    border-bottom: 2px solid #e2e2e2;
}
.betting-list .tab li.active {
    border-bottom: 2px solid #be1204;
    color: #be1204;
}
.betting-list .list li {
    padding: 0.6rem 4%;
    margin-bottom: 10px;
    background: #fff;
    height: 4rem;
    font-size: 0.7rem;
    border-bottom: 1px solid rgb(238, 236, 236);
}
.betting-list .list li:last-child {
    margin: 0;
}
.betting-list .list li > div {
    height: 50%;
}
.betting-list .list li span {
    display: inline-block;
    font-size: 0.66rem;
    float: left;
}
.betting-list .list li .info {
    height: 1.8rem;
    line-height: 1.3rem;
}

.betting-list .list li .info .period {
    font-size: 0.66rem;
    color: rgb(134, 132, 132);
    width: 40%;
    line-height: 1.3rem;
}
.betting-list .list li .info .money {
    color: #ec0022;
    text-align: right;
    width: 25%;
}
.betting-list .list li span.title {
    font-size: 0.8rem;
    color: #333;
    width: 35%;
    white-space: nowrap;
}
.betting-list .list li span.rf {
    float: right;
}
.betting-list .list .info-bottom .rf {
    color: #999;
}
.betting-list .list .icon-jiangbei2 {
    font-size: 1rem;
    vertical-align: middle;
}
.betting-list .list .info-bottom .zj {
    color: #ec0022;
}
</style>