<template>
    <div class="shared">
        <!-- tab菜单 getCurrentLottery返回选中的玩法 -->
        <tab-menu-page :lotteryData="lotteryData" v-if="lotteryData" @get-currentLottery="getCurrentLottery" v-bind="$attrs"></tab-menu-page>

        <div class="pick-num-result">
            <!-- 选择号码 getBalls返回选中的号码-->
            <balls-page :currentLottery="currentLottery" :refresh="ballsRefresh" v-if="currentLottery" @get-balls="getBalls" :oddDiff="oddDiff" v-bind="$attrs"></balls-page>
            <!-- 返利赔率等结果 addNote返回一条订单 -->
            <add-note-page :currentLottery="currentLottery" :balls="selectedNum" :refresh="pickedRefresh" v-if="currentLottery" @get-status="getStatus" @add-note="addNote" @rates-to-balls="toBallsPage"></add-note-page>
        </div>

        <!-- 结果列表 order返回所有的订单-->
        <result-page :currentLottery="currentLottery" :refresh="resultListRefresh" :list="noteData" :status="resultStatus" :closeLoading="closeLoading" v-if="currentLottery" @get-result="order" v-bind="$attrs"></result-page>
        <div v-if='showSpin' style='width:1150px;position:absolute;left:0;top:0;' :style="{'height': menuHeight +'px'}">
            <Spin size="large" fix :style="{'height':menuHeight +'px'}"></Spin>
        </div>
    </div>
</template>

<script>
// 次页面只作为桥梁给子组件之间传递数据
import ballsPage from './children_modal/balls_page'
import tabMenuPage from './children_modal/tab_menu.vue'
import addNotePage from './children_modal/add_note.vue'
import resultPage from './children_modal/result_page.vue'
// import modal from '@/components/common/module_vue/modal.vue';
export default {
    components: {
        ballsPage,
        tabMenuPage,
        addNotePage,
        resultPage
    },
    watch: {
        '$route' (newVal, oldVal) {  //4.17
            [this.lotteryData, this.currentLottery] = ['', ''];
            this.showSpin = true;
            this.init();
        }
    },
    data () {
        return {
            // showSuccessModal: false,      //投注成功的弹框
            // menuHeight: this.$attrs.menuHeight,
            // defaultId: '',                //默认玩法id
            showSpin: true,              // 是否显示loading...
            lotteryData: '',              // 彩种list
            currentLottery: '',           // 当前选中的玩法
            selectedNum: {},              // 选中的号码
            noteData: [],                 // 添加的单注数据
            resultStatus: {},             // 当前单注金额，赔率，返点的状态 
            ballsRefresh: new Date().getTime() + '',  // 刷新选择号码的模块
            pickedRefresh: new Date().getTime() + '',    // 刷新赔率，金额，返利的模块
            resultListRefresh: new Date().getTime() + '', // 刷新结果列表模块
            closeLoading: new Date().getTime() + '', // 刷新loading状态   
            oddDiff: 0  //滑轮变化的值  
        }
    },
    computed: {
        periodInfo () {
            return this.$store.state.preiodInfo;
        },
        user () {
            return this.$store.state.user
        },
        menuHeight () {
            return this.$attrs.menuHeight;
        }
    },
    methods: {
        reInit () {
            [this.lotteryData, this.currentLottery] = ['', ''];
            this.showSpin = true;
            this.init();
        },
        toBallsPage (num) { //滑轮变化，返回给球的num
            this.oddDiff = num;
        },
        // 下单
        order (result) {
            // if (!this.user.userId) {
            //     this.$store.commit('getShouldDialog', true);
            //     return;
            // }
            var params = {
                bettingInfoList: result.list,
                totalMoney: result.totalMoney,
                bettingRecordList: [
                    {
                        lotteryRecordId: this.periodInfo.lotteryRecordId, // 4.28
                        periodNo: this.periodInfo.periodNo,
                        num: 1
                    }
                ]
            }
            if (result.chase.length) {
                params.bettingRecordList = [];
                result.chase.forEach(value => {
                    params.bettingRecordList.push({
                        lotteryRecordId: value.lotteryRecordId,
                        periodNo: value.periodNo,
                        num: value.odds
                    })
                })
            }
            this.$http.post('/api/v2/lottery/betting', params, { userId: true }).then(response => {
                if (response.data.code !== 0) {
                    this.closeLoading = new Date().getTime() + '';
                    return
                };
                this.resultListRefresh = new Date().getTime() + '';
                this.pickedRefresh = new Date().getTime() + '';
                this.ballsRefresh = new Date().getTime() + '';
                this.$store.commit('getSuccessModal', true);
                setTimeout(() => {
                    this.$store.commit('getSuccessModal', false);
                }, 1500)
            })
        },
        // 当前单注金额，赔率，返点发生改变时
        getStatus (obj) {
            this.resultStatus = Object.assign({}, obj);
        },
        // 点击号码球的结果
        getBalls (result) {
            this.selectedNum = result;
        },
        // 点击添加单注结果
        addNote (data) {
            this.ballsRefresh = new Date().getTime() + '';
            this.noteData = JSON.parse(JSON.stringify(data));
        },
        // 点击切换玩法结果
        getCurrentLottery (data) {
            this.currentLottery = Object.assign({}, data);
        },
        // 点击下注结果
        getResult (result) {
            this.order(result);
        },
        // 初始化方法
        init () {
            this.$http.post('/api/v2/lottery/getLotteryDetailV2', { lotteryId: this.$route.params.id }, { unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.lotteryData = response.data.data;
                // this.defaultId = response.data.data.defaulPlay.parentPlayId.slice(0, 3); //默认玩法id
                this.showSpin = false;
            });
        }
    },
    created () {
        this.init();
    }
}
</script>

<style lang="less" scoped>
.shared {
    position: relative;
    font-size: 14px;
}
.shared .ivu-spin-large {
    position: absolute;
    width: 1150px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform-origin: 50% 50%;
}
.shared .red-font {
    color: @share-red-font-color;
}
.shared .pick-num-result {
    padding-left: 15px;
    padding-right: 15px;
}
</style>
