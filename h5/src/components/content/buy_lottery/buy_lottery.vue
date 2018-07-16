<template>
    <div class="buy-lottery" @click="localControll" :class="{'is-result-page': switchType === 2,'simplePage':isSimplePage}">
        <!-- <tab-menu-page :lotteryData="lotteryData" @get-currentLottery="getCurrentLottery" v-if="lotteryData.length"></tab-menu-page> -->
        <!-- 头部 -->
        <div class="tab-menu">
            <my-header v-if="switchType === 1">
                <div slot="h-left" @click="exitBuy()">
                    <i class="iconfont icon-arrowLeft" style="color: #fff; font-size:26px"></i>

                </div>
                <div slot="h-center" class="tab-title" :class="{active: showTab}" @click.stop="setShowTab()">
                    {{currentLottery.playName || '无'}}
                    <i class="iconfont icon-biaotou-daoxu"></i>
                </div>
                <div slot="h-right" class="tab-right">
                    <span @click.stop="setShowAllLottery()">
                        {{tabName}}
                        <i class="iconfont icon-arrowDown"></i>
                    </span>
                </div>
            </my-header>
            <my-header v-else>
                <div slot="h-left">
                    <span @click="switchType = 1">
                        <i class="iconfont icon-arrowLeft" style="color: #fff; font-size:26px"></i>
                    </span>
                </div>
                <div slot="h-center">
                    投注单
                </div>
            </my-header>
            <!-- 其他彩种的头部 -->
            <div class="tab-list" v-if="code !== 'pcdd'" v-show="showTab" @click.stop>
                <div class="common-tab">
                    <div class="title-menu">
                        <ul>
                            <li v-for="(item, idx) in tabList" :key="idx" @click="setSecondMenu(item, idx)" :class="{active: selectedSatus === item.lotteryPlayId}">
                                <span>{{item.playName}}</span>
                            </li>
                        </ul>
                        <div class="clr"></div>
                    </div>
                    <dl v-for="(item, idx) in secondMenu" :key="idx">
                        <dt>{{item.playName}}</dt>
                        <dd v-for="(value, idx) in item.lotteryPlayList" :key="idx" :class="{'active': secondStatus === value.lotteryPlayId, 'row-first': (idx+1) % 3 === 1 && idx > 2}" @click.stop="changeTab(value)">
                            <span>{{value.playName}}</span>
                        </dd>
                    </dl>
                </div>
            </div>
            <!-- pc蛋蛋彩种的头部 -->
            <div class="tab-list" v-else v-show="showTab" @click.stop>
                <div class="common-tab">
                    <ul class="pcdd-tab">
                        <li v-for="(item, idx) in tabList" :key="idx" :class="{active: selectedSatus === item.lotteryPlayId}" @click.stop="changeTab(item, idx)">
                            <span>{{item.playName}}</span>
                        </li>
                    </ul>
                    <div class="clr"></div>
                </div>
            </div>
            <!-- 切换彩种的list列表 -->
            <div class="tab-list" v-show="showAllLottery" @click.stop>
                <div class="common-tab">
                    <ul class="pcdd-tab">
                        <li v-for="(item, idx) in allLotteryList" :key="idx" :class="{active: $route.params.id === item.lotteryId}" @click.stop="init(item)">
                            <span>{{item.lotteryName}}</span>
                        </li>
                    </ul>
                    <div class="clr"></div>
                </div>
            </div>
            <div class="mask" v-show="showAllLottery || showTab"></div>
        </div>
        <!-- 开奖，期号信息 -->
        <period-info ref="periodRef" :code="code" :lotteryIcon="lotteryIcon" :switchType="switchType" @get-period="getPeriod" v-if="code"></period-info>
        <!-- 玩法提示 -->
        <div class="singleOdds" v-show="isSimplePage && !showMoreTip">
            <div>
                <div ref="playTip">
                    <span class="tip" v-html="escapeHtml(currentLottery.playDesc?currentLottery.playDesc:'')"></span>
                    <span class="num" v-if="userExist">【最大赔率:{{maxOdds}}】</span>
                </div>
            </div>
        </div>
        <div class="lottery-tip" v-show="switchType === 1 && code && !isSimplePage || (isSimplePage && showMoreTip)">
            <div class="tip-title">
                <span class="icon-i">
                    <i class="iconfont icon-prompt_fill"></i>&nbsp;
                </span>
                <span @click="showTip = true">
                    <strong>玩法提示</strong>
                </span>
            </div>
            <my-dialog v-model="showTip" class="tip-modal ui-dialog-red" title="玩法规则" btnSure="" btnCancle="">
                <div v-for="item in tipContent" :key="item.key" class="tip-info">
                    <i class="iconfont" :class="item.icon"></i>
                    <h3>{{item.name}}</h3>
                    <div v-html="escapeHtml(item.cont)"></div>
                </div>
                <div slot="footer"></div>
            </my-dialog>
            <!--   <mt-popup v-model="showTip" popup-transition="popup-fade" class="tip-modal">
               
            </mt-popup> -->
        </div>

        <!-- 号码选择页 -->
        <div ref="ballPageWrap">
            <balls-page :is="modal+code" :currentData="currentData" :currentLottery="currentLottery" :code="code" v-if="code" ref="ballsPage" :period="period" :recordId="lotteryRecordId" v-show="switchType === 1" @get-maxOdd="getMaxOdd" @get-balls-result="getBallsResult">
            </balls-page>
        </div>

        <!-- 结果列表页 -->
        <resultPage :currentLottery="currentLottery" :balls="balls" :code="code" :period="period" :recordId="lotteryRecordId" v-if="code" v-show="switchType === 2" ref="resultPage" @get-lottery-result="getLotteryResult">
        </resultPage>
        <lotteryHelp ref="lotteryHelp" v-show="switchType === 1" :code="code" :isSimplePage="isSimplePage"></lotteryHelp>
    </div>
</template>


<script>
import tabMenuPage from './child_modal/tab_menu/tab_menu'

import ballsPages from './child_modal/balls/index'
import resultPage from './child_modal/result/result'
import periodInfo from './period_info'
import lotteryHelp from './lottery_help'
export default {
    data () {
        return {
            // tab切换字段        
            currentData: '',       // 当前的一级数据
            currentLottery: {},    // 当前选中的彩种数据
            showTab: false,
            tabList: [],
            secondMenu: [],               // 二级菜单    
            selectedSatus: '0',           // 一级菜单选中状态
            secondStatus: '',             // 二级菜单选中状态  
            switchType: 1,                // 选择号码页，结果列表页切换
            allLotteryList: [],           // 切换彩种
            showAllLottery: false,        // 显示彩种列表 
            // lotteryStatus: '',            // 选中的状态
            // showOutLine: false,           // 右上角外部链接

            // 其他字段
            showTip: false,        // 玩法提示框
            tipContent: [],        // 提示框内容 
            code: '',              // 随机注数，随机选号时使用的code
            period: '',            // 期数信息
            lotteryRecordId: '',   // 期数id
            balls: [],             // 选中的号码球,
            lotteryBeginTime: 0,
            lottrySysTime: 0,
            tabName: '切换彩种',
            lotteryIcon: '',
            modal: 'b-',
            maxOdds: 0,           // 最大赔率 
            showMoreTip: false

        }
    },
    computed: {
        isSimplePage () {
            let highBettingModal = localStorage.getItem('highBettingModal'), ret;
            highBettingModal = highBettingModal ? !!parseInt(highBettingModal) : false;
            ret = !highBettingModal && (this.code === 'pk10' || this.code == 'ssc' || this.code === 'ksan' || this.code === '6hc');
            if (ret) {
                this.modal = 's-';
            } else {
                this.modal = 'b-';
            }
            return ret;
        },
        userExist () {
            return this.$store.state.user.userCode
        }
    },
    components: Object.assign({}, ballsPages, { tabMenuPage: tabMenuPage }, { resultPage: resultPage }, { periodInfo: periodInfo }, { lotteryHelp: lotteryHelp }),
    methods: {
        // 退出
        exitBuy () {
            let vm = this;
            if (this.$refs.resultPage && this.$refs.resultPage.total.num || this.isSimplePage && this.$refs.ballsPage.result.num) {
                this.$Modal.confirm('放弃当前的选号吗？', '温馨提示').then(() => {
                    vm.$router.push('/lottery')
                }, () => { })
            } else {
                vm.$router.push('/lottery')
            }
        },
        // 全局点击
        localControll () {
            if (this.$refs.periodRef) this.$refs.periodRef.isShowLotteryResult = false;
            this.showTab = false;
            this.showAllLottery = false;
            this.setDocument(false)
        },
        setShowTab () {
            if (this.$refs.periodRef) this.$refs.periodRef.isShowLotteryResult = false;
            this.showTab = !this.showTab;
            this.showAllLottery = false;
            this.setDocument(this.showTab);
        },
        setShowAllLottery () {
            if (this.$refs.periodRef) this.$refs.periodRef.isShowLotteryResult = false;
            this.showAllLottery = !this.showAllLottery;
            this.showTab = false;
            this.setDocument(this.showAllLottery)
        },
        // 禁止父级的滚动条滚动
        setDocument (value) {
            if (value) {
                document.documentElement.style.overflow = 'hidden';
            } else {
                document.documentElement.style.overflow = 'auto';
            }
        },
        // 获取二级菜单
        setSecondMenu (item, idx) {
            this.secondMenu = item.lotteryPlayList;
            this.selectedSatus = item.lotteryPlayId;
            this.currentData = item;
        },
        // 头部菜单切换
        changeTab (item, idx) {
            if (idx || idx === 0) {
                this.selectedSatus = item.lotteryPlayId;
            } else {
                this.secondStatus = item.lotteryPlayId;
            }
            this.setDocument(false);
            this.getCurrentLottery(item.lotteryPlayId);
            this.showTab = false;
        },
        getCurrentLottery (id) {
            this.$http.post('/api/v2/lottery/queryPlayLayoutByBettingId', { lotteryId: this.$route.params.id, lotteryPlayId: id }, { loading: 1, noEncrypt: true }).then(response => {
                if (response.data.code !== 0) return;
                let data = response.data.data;
                this.currentLottery = data;
                this.getLotteryTip();
            })
        },
        getMaxOdd (max) {  // 获取最大赔率 
            this.maxOdds = max;
            this.showMoreTip = false
            setTimeout(() => {
                if (this.$refs.playTip.clientHeight > 51) {
                    this.showMoreTip = true
                } else {
                    this.showMoreTip = false
                }
            })
        },
        // 获取选择号码结果
        getBallsResult (balls) {
            if (this.lotteryBeginTime > this.lottrySysTime) {
                this.$Message("当前期数未开始");
                return
            }
            this.switchType = 2;
            this.balls = balls;
        },
        // 获取期号
        getPeriod (data) {
            let vm = this;
            this.lotteryBeginTime = data.beginTime;
            this.lottrySysTime = data.sysDate;
            this.period = data.periodNo;
            this.lotteryRecordId = data.lotteryRecordId;

        },
        getResultPage () {
            if (this.$refs.resultPage && !this.$refs.resultPage.total.num) {
                this.$Message('你还没有注单，请先选择注单')
            } else {
                this.switchType = 2;
            }
        },
        // 下单成功
        getLotteryResult () {
            this.switchType = 1;
        },
        getLotteryTip () {
            this.tipContent = [
                { name: '玩法提示', cont: this.currentLottery.playDesc, icon: 'icon-bulb' },
                { name: '中奖说明', cont: this.currentLottery.prizeDesc, icon: 'icon-bj1' },
                { name: '范例', cont: this.currentLottery.bettingExample, icon: 'icon-bj2' }
            ]
        },
        // 初始化方法
        init (item) {
            let vm = this, id = '';
            if (item) {
                if (item.status == '0') {
                    this.$Message('该彩种正在维护...');
                    return
                }
                id = item.lotteryId;
                this.code = '';
                this.$router.push({ params: { id: id } });
                this.tabName = item.lotteryName;
                this.lotteryIcon = item.lotteryIcon;
            }
            this.setDocument(false)
            this.showAllLottery = false;
            this.$http.post('/api/v2/lottery/getLotteryDetailV2', { lotteryId: this.$route.params.id }, { loading: true, noEncrypt: true }).then(response => {
                let data = response.data.data;
                let list = data.lotteryPlayList;
                vm.currentLottery = data.defaulPlay;
                vm.code = data.lottery.code;
                vm.tabList = list;
                vm.selectedSatus = data.defaulPlay.lotteryPlayId;
                if (vm.code !== 'pcdd') {
                    let current = list.filter(item => {
                        return item.lotteryPlayList.some(value => value.lotteryPlayId === vm.currentLottery.parentPlayId);
                    });
                    vm.secondMenu = current[0].lotteryPlayList;
                    vm.selectedSatus = current[0].lotteryPlayId; //计算和值大小单双
                    vm.secondStatus = data.defaulPlay.lotteryPlayId;
                    vm.currentData = current[0];
                }
                vm.setLotteryHelp();
                vm.getLotteryTip();
            })
        },
        setLotteryHelp () {
            this.$nextTick(() => {
                if (this.$refs.lotteryHelp) {
                    this.$refs.lotteryHelp.setScroll(this.$refs.ballPageWrap);
                }
            })
        }
    },
    created () {
        this.init();
        this.$http.post('/api/v2/lottery/queryLotteryList', { lotteryType: null }, { noEncrypt: true }).then(response => {
            let data = response.data.data.lotteryTypeList;
            this.allLotteryList = data.filter(item => item.lotteryType === '-2')[0].lotteryList;
            let currentLottery = this.allLotteryList.find(item => item.lotteryId === this.$route.params.id);
            if (currentLottery) {
                this.lotteryIcon = currentLottery.lotteryIcon
            }
        })
    }
}
</script>

<style scoped lang="less">
.buy-lottery {
    /* background: #f7f7f7; */
    padding-top: 3.5rem;
    padding-bottom: 2.5rem;
}
.simplePage {
    padding-bottom: 8.5rem;
}
.buy-lottery.is-result-page {
    padding-top: 1.5rem;
}
.buy-lottery .tab-menu .tab-title {
    display: inline-block;
    width: auto;
    font-size: 0.78rem;
    line-height: 0.8rem;
    padding: 3px 5px;
    border: 1px solid #fff;
    border-radius: 3px;
}
.buy-lottery .tab-menu .tab-title i {
    transform: rotate(360deg);
    transition: all 0.5s;
}
.buy-lottery .tab-menu .tab-title.active i {
    transform: rotate(180deg);
}
.buy-lottery .tab-menu .tab-list {
    position: fixed;
    width: 100%;
    top: 2.2rem;
    left: 0;
    z-index: 301;
}
.buy-lottery .tab-menu .tab-list .common-tab {
    float: left;
    width: 100%;
    min-height: 170px;
    max-height: 300px;
    overflow: auto;
    padding-bottom: 0.5rem;
    background: #fff;
    box-shadow: 0 1px 16px rgba(0, 0, 0, 0.11);
    font-size: 0.66rem;
}
.buy-lottery .tab-menu .tab-list .common-tab li.active,
.buy-lottery .tab-menu .tab-list .common-tab dd.active {
    color: #be1204;
    border-color: #be1204;
}
/* 其他 */
.buy-lottery .tab-menu .tab-list .title-menu {
    border-bottom: 1px solid #eee;
    padding-bottom: 0.3rem;
}
.buy-lottery .tab-menu .tab-list .common-tab ul {
    margin-right: 2%;
    width: 98%;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
}
.buy-lottery .tab-menu .tab-list .common-tab li {
    width: 31.33%;
    margin-left: 2%;
    min-height: 1.5rem;
    border: 1px solid #eee;
    border-radius: 3px;
    margin-top: 0.3rem;
    text-align: center;
    display: table;
    color: #999;
}
.buy-lottery .tab-menu .tab-list .common-tab li span {
    display: table-cell;
    vertical-align: middle;
}
.buy-lottery .tab-menu .tab-list .title-menu li {
    width: 23%;
    margin-left: 2%;
}

.buy-lottery .tab-menu .tab-list .common-tab dl {
    width: 98%;
    position: relative;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    margin-right: 2%;
}
.buy-lottery .tab-menu .tab-list .common-tab dt {
    width: 23%;
    margin-left: 2%;
    text-align: center;
    line-height: 1.2rem;
    color: #000;
    margin-top: 0.3rem;
}
.buy-lottery .tab-menu .tab-list .common-tab dd {
    width: 23%;
    margin-left: 2%;
    min-height: 1.2rem;
    border: 1px solid #eee;
    border-radius: 3px;
    text-align: center;
    display: table;
    color: #999;
    margin-top: 0.3rem;
}
.buy-lottery .tab-menu .tab-list .common-tab dd.row-first {
    margin-left: 27%;
}
.buy-lottery .tab-menu .tab-list .common-tab dd span {
    display: table-cell;
    vertical-align: middle;
}
.buy-lottery .mask {
    background: rgba(3, 3, 3, 0.31);
    position: fixed;
    top: 3.5rem;
    bottom: 0;
    width: 100%;
    z-index: 300;
}
.buy-lottery .lottery-tip {
    padding: 0.3rem;
    height: 1.6rem;
}
.buy-lottery .lottery-tip .tip-title {
    display: inline-block;
}
.buy-lottery .lottery-tip .tip-title > span {
    float: left;
    font-size: 0.66rem;
    display: inline-block;
}
.buy-lottery .lottery-tip span.icon-i {
    padding-top: 1px;
}
.buy-lottery .lottery-tip span.icon-i i {
    font-size: 0.96rem;
    float: left;
    margin-top: -0.32rem;
    margin-right: -0.2rem;
}

.tip-modal h3 {
    display: inline-block;
    height: 1.4rem;
    line-height: 1.4rem;
    border-radius: 3px;
    margin-bottom: 0.2rem;
    font-size: 0.7rem;
    font-weight: bold;
}
.tip-modal .tip-info {
    margin-bottom: 0.3rem;
    font-size: 0.66rem;
    position: relative;
}
.tip-modal .tip-info .iconfont {
    color: #ec0022;
    font-size: 1rem;
    position: absolute;
    left: -1.4rem;
    top: -0.1rem;
}
.fade-show-enter-active,
.fade-show-leave-active {
    transition: all 0.3s ease;
}
.fade-show-enter,
.fade-show-leave-to {
    opacity: 0;
    height: 0;
    transform: translate3d(0, 0, 0);
}
.buy-lottery .header .tab-right {
    font-size: 0.7rem;
}
.buy-lottery .singleOdds {
    padding: 10px 0.5rem 0 0.5rem;
    font-size: 12px;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    position: relative;
    max-height: 50px;
}
.buy-lottery .singleOdds .num {
    color: #ff6600;
}
</style>

<style lang="less">
.buy-lottery .tip-modal .d-body {
    padding: 1rem;
    padding-left: 2rem;
}
</style>
