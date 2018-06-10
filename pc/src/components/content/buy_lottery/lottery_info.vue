<template>
    <div class="lottery-info">
        <div class="lf lottery-title">
            <div class="container">
                <div class="lottery-logo">
                    <img :src="data.lotteryIcon" />
                </div>
                <h4 class="title">{{data.lotteryName}}</h4>
            </div>
            <div class="interval"></div>
        </div>
        <div class="lf next-time">
            <div class="container">
                <p class="series lf">
                    第
                    <span>&nbsp;{{recordList.periodNo}}&nbsp;</span>期
                    <br/>投注还剩
                </p>
                <div class="timing lf">
                    <i class="i-icon i-down-count">{{timeTxt[0]}}</i>
                    <i class="i-icon i-min-down-count">{{timeTxt[1]}}</i>
                    <i class="i-icon i-sec-down-count">{{timeTxt[2]}}</i>
                </div>
            </div>
            <div class="interval"></div>
        </div>
        <div class="last-result lf">
            <div class="container">
                <p class="last-time lf">
                    <!-- 开奖 -->
                    <i v-if="isTarBall">
                        第
                        <span>&nbsp;{{recordList.prePeriodNo}}&nbsp;</span>期<br/>
                    </i>
                    <!-- 未开奖 -->
                    <i v-if="!isTarBall">
                        第
                        <span>&nbsp;{{recordList.prePeriodNo}}&nbsp;</span>期<br/>开奖中...
                    </i>
                    <i class="history-ball">
                        <div class="txt">
                            <span class="his-prize">历史开奖</span>
                            <span class="prize-icon"></span>
                        </div>
                        <div class="history" :class="{'short-padding' : !isTarBall}">
                            <div class="history-inside-wrapper">
                                <!-- <prize-list :code="$attrs.code" :prePrizeList="prePrizeList"></prize-list> -->
                                <prize-list v-bind="$attrs" :prePrizeList="prePrizeList"></prize-list>
                            </div>
                        </div>
                    </i>
                </p>
                <div class="ball lf" v-if="data.code !== 'pcdd' && data.code !=='6hc'">
                    <span v-for="(item, i) in btnList" :key="i" :class="[btnList.length > 7 ? 'large' : '']">
                        <i>{{item.ball}}</i>
                    </span>
                </div>
                <div class="ball lf pcdd" v-else-if="data.code === 'pcdd'">
                    <span v-for="(item, i) in btnList" :key="i">
                        <i>{{item.ball}}</i>
                        <em v-if='i<2'>+</em>
                        <em v-if='i ===2'>=</em>
                        <i class='sum' v-if='i === 2' :class='pcggSum.clr'>{{pcggSum.sum}}</i>
                    </span>
                </div>
                <div class="ball lf sixhc" v-else>
                    <span v-for="(item, i) in btnList" :key="i" :class="[item.clr,i === 6 ? 'left-margin':'']">
                        <i>
                            <span>{{item.ball}}</span>
                        </i>
                        <em v-if="i === 5">+</em>
                    </span>
                    <div class='zodiac'>
                        <span v-for="(item, i) in btnList" :key="i">{{item.zodiac}}</span>
                    </div>
                </div>
            </div>
        </div>
        <modal :modalShow="isShowModal" :width="452" :hasFooter="false" claName="period-modal" @btn-cancel="isShowModal = false">
            <div slot="content">
                <p class="title">期数提示</p>
                <div class="content">
                    <Icon type="information-circled"></Icon>
                    <p>
                        <span>期数已发生改变，当前期数为</span> :
                        <span class="period-no">{{recordList.periodNo}}</span>
                    </p>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
let pcdd = {
    green: ['1', '4', '7', '10', '16', '19', '22', '25'],
    blue: ['2', '5', '8', '11', '17', '20', '23', '26'],
    red: ['3', '6', '9', '12', '15', '18', '21', '24'],
    gray: ['0', '13', '14', '27']
}
import getZodiac from '@/components/common/module_js/zodica.js'
import prizeList from './child_modal/common_vue/prize_list.vue'
import modal from '@/components/common/module_vue/modal.vue'
export default {
    props: {
        data: {
            type: Object
        }
    },
    components: { prizeList, modal },
    data () {
        return {
            prePrizeList: [],
            isShowModal: false,
            btnList: [],
            recordList: [],
            timer: null,
            surplusTime: 0,
            timeTxt: ['00', '00', '00'],
            downNum: 0,
            lotteryId: 0,
            pcggSum: { sum: 0, clr: 'red' }, //pcgg的特码
            isTarBall: false //开奖号码
            // remindTimer: null,//期数提示定时器
        }
    },
    computed: {
        updatePrizeHistory () {
            if (this.$store.state.updateNotice) {
                return this.$store.state.updateNotice
            }
        }
    },
    watch: {
        data: {
            handler (newValue, oldValue) {
                this.btnList = []
                if (this.timer) clearInterval(this.timer)
                this.getData()
            },
            deep: true
        },
        updatePrizeHistory (newResult) {
            let prePrizeInfo = JSON.parse(newResult)
            if (
                prePrizeInfo.periodNo === this.recordList.prePeriodNo &&
                this.$route.params.id === prePrizeInfo.lotteryId
            ) {
                this.getBalls(prePrizeInfo.lotteryNumber.replace(/\|/, ','))
                this.isTarBall = true
                this.prePrizeList[0].periodNo = prePrizeInfo.periodNo
                this.prePrizeList[0].lotteryNumber = prePrizeInfo.lotteryNumber
            }
        }
    },
    methods: {
        getData () {
            let vm = this
            if (this.$route.params.id !== this.data.lotteryId) {
                if (this.timer) {
                    clearInterval(this.timer)
                    return
                }
            }
            vm.$http
                .post('/api/v2/lottery/queryLotteryRecordListV2', {
                    lotteryId: this.data.lotteryId,
                    num: 1
                })
                .then(response => {
                    if (response.data.code !== 0) {
                        setTimeout(vm.getData(), 3000)
                        return
                    }
                    this.$emit('has-get-result'); //通知父组件切换菜单有效了
                    if (this.timer) clearInterval(this.timer)
                    this.isTarBall = false //初始化
                    let data = response.data.data
                    vm.prePrizeList = data.prizeHistoryList
                    vm.recordList = data.recordList[0]
                    vm.recordList.prePeriodNo = data.prizeHistoryList[0].periodNo
                    vm.recordList.preLotteryTime = data.prizeHistoryList[0].prizeTime
                    vm.recordList.preLotteryNumber = data.prizeHistoryList[0].lotteryNumber
                    vm.recordList.lotteryName = this.data.lotteryName// 5.25
                    vm.$store.commit('getPreiodInfo', vm.recordList);
                    if (vm.lotteryId === vm.data.lotteryId) { //切换彩票不提示
                        vm.isShowModal = true
                        setTimeout(() => {
                            vm.isShowModal = false
                        }, 2000)
                    }
                    vm.lotteryId = vm.data.lotteryId //彩种改变
                    vm.downNum = 0
                    let preLotteryNumber = vm.recordList.preLotteryNumber
                    if (preLotteryNumber) {
                        //上期开奖
                        vm.getBalls(preLotteryNumber.replace(/\|/g, ','))
                        this.isTarBall = true
                    } else {
                        //上期没开奖
                        this.btnList = []
                        this.isTarBall = false
                    }
                    if (vm.recordList) {
                        if (vm.timer) clearInterval(vm.timer)
                        vm.setFirstTime()
                    }
                })
                .catch(() => {
                    setTimeout(() => {
                        vm.getData()
                    }, 3000)
                })
        },
        setFirstTime () {
            let vm = this
            let startTime = vm.recordList.sysDate
            vm.surplusTime = vm.recordList.endTime - startTime
            // 得到计算结果
            this.countDown()
            this.timer = setInterval(function () {
                vm.surplusTime = vm.surplusTime - 1000
                vm.downNum++
                // (vm.data.lotteryId === 17 && vm.downNum >= 10) 判断如果是六合彩就一个小时发一次请求
                if (
                    vm.surplusTime <= -1 ||
                    (parseInt(vm.data.lotteryId) === 17 && vm.downNum >= 3600)
                ) {
                    clearInterval(vm.timer)
                    // 停留1秒为开奖时间
                    this.timeTxt = ['00', '00', '00']
                    setTimeout(vm.getData, 1000)
                } else {
                    vm.countDown()
                }
            }, 1000)
        },
        //  倒计时结束
        countDown () {
            let vm = this
            let obj = {}
            let days = Math.floor(vm.surplusTime / (24 * 3600 * 1000))
            //计算出小时数
            let leave1 = vm.surplusTime % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
            obj.hours = Math.floor(leave1 / (3600 * 1000)) + days * 24
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
            obj.minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
            obj.seconds = Math.round(leave3 / 1000)
                ;['hours', 'minutes', 'seconds'].forEach(item => {
                    if (obj[item] < 10) obj[item] = '0' + obj[item]
                })
            this.timeTxt = [obj.hours, obj.minutes, obj.seconds]
        },
        getBalls: function (ball) {
            if (!ball) return
            let btns = ball.split(',')
            let btnList = []
            let label = ''
            let zTxt = ''
            let clr = ''
            let zodiac

            if (this.data.lotteryId === '17' || this.data.lotteryId === '20') {
                let pop = btns.pop()
                let arr = pop.split('+')
                btns = btns.concat(arr)
                label = 'liuhe'
                zodiac = getZodiac(this.recordList.preLotteryTime)
            } else if (
                this.data.lotteryId === '19' ||
                this.data.lotteryId === '2'
            ) {
                label = 'pcdd'
            }

            let sum = 0 //pcgg特码
            btns.forEach(item => {
                if (label === 'liuhe') {
                    // 计算生肖
                    let index = null
                    zodiac.forEach(value => {
                        if (
                            value.data.some((vvv, idx) => {
                                index = idx
                                return vvv === item
                            })
                        ) {
                            zTxt = value.label
                            clr = value.clrs[index]
                        }
                    })
                } else if (label === 'pcdd') {
                    sum += parseInt(item)
                    for (var key in pcdd) {
                        if (pcdd[key].some(value => item === value)) {
                            clr = key
                        }
                    }
                }
                btnList.push({ clr: clr, ball: item, zodiac: zTxt })
            })
            this.pcggSum.sum = sum //pcgg的特码
            for (var key in pcdd) {
                if (
                    pcdd[key].some(
                        value => this.pcggSum.sum === parseInt(value)
                    )
                ) {
                    this.pcggSum.clr = key
                }
            }
            this.btnList = btnList
        }
    },
    created () {
        this.getData()
    },
    destroyed () {
        if (this.timer) clearInterval(this.timer);
    }
}
</script>


<style lang="less" scoped>
.lottery-info {
    font-size: 16px;
    height: 90px;
}
/* 左边部分 */
.lottery-info .lottery-title {
    width: 350px;
}
.lottery-info .container {
    position: relative;
    width: 100%;
    height: 100%;
}
.lottery-info .container > * {
    display: inline-block;
}
.lottery-info .interval {
    position: absolute;
    right: 0;
    top: 10px;
    height: 70px;
    width: 2px;
    background: @lottery-info-interval-bg;
    border-right: 1px solid @lottery-info-interval-border;
}
.lottery-title .lottery-logo {
    vertical-align: top;
    width: 70px;
    height: 70px;
    margin-top: 10px;
}
.lottery-title .title {
    vertical-align: top;
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
    font-weight: bold;
    font-size: 24px;
    font-style: italic;
    color: #fff;
    letter-spacing: 2px;
}
/* 左边部分结束 */
/* 中间部分 */
.lottery-info .next-time {
    width: 420px;
    color: #fff;
}
.lottery-info .next-time .container,
.lottery-info .last-result .container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.lottery-info .next-time .series {
    font-size: 14px;
    text-align: center;
    line-height: 18px;
    margin-right: 15px;
}
.lottery-info .next-time .series span {
    color: @buy-lottery-common-color;
}
.lottery-info .next-time .timing i {
    height: 54px;
    width: 52px;
    line-height: 60px;
    border-radius: 3px;
    text-align: center;
    font-size: 18px;
    color: @lottery-info-i-color;
    font-weight: bold;
}
/* 中间部分结束 */
/* 右边部分 */
.lottery-info .last-result {
    width: 590px;
    color: #fff;
}
.lottery-info .last-result .container {
    position: relative;
}
.lottery-info .last-result .container .ball,
.lottery-info .last-result .container .lee-set-container-inside {
    width: auto;
}
.lottery-info .last-result .container .history-prize {
    overflow: hidden;
}
.lottery-info .last-result .history {
    position: absolute;
    width: 452px;
    left: 0;
    padding-top: 18px;
    visibility: hidden;
    z-index: 2;
}
.lottery-info .last-result .short-padding {
    padding-top: 9px;
}
.lottery-info .last-result .history-inside-wrapper {
    height: 0;
    overflow: hidden;
    transition: all 0.3s;
    box-shadow: 0px 0px 6px -5px rgba(0, 0, 0, 0.2),
        0px 0px 0px rgba(0, 0, 0, 0.2), 0px 6px 5px rgba(0, 0, 0, 0.2);
}
.lottery-info .last-result .history-ball:hover .history {
    visibility: visible;
}
.lottery-info
    .last-result
    .history-ball:hover
    .history
    .history-inside-wrapper {
    height: 390px;
}
.last-result .last-time {
    display: inline-block;
    width: 132px;
    font-size: 14px;
    text-align: center;
    line-height: 18px;
    margin: 5px 10px 0 10px;
}
.lottery-info .last-result .last-time i {
    display: block;
    width: 100%;
}
.last-result .last-time i.history-ball {
    width: 126px;
    margin: auto;
    cursor: default;
}
.lottery-info .last-result .no-result {
    padding-top: 15px;
}
.last-result .last-time .history-ball .txt {
    height: 25px;
    border: 1px solid @lottery-info-history-text-border;
    width: 106px;
    margin: 5px auto 0;
    line-height: 23px;
    text-align: center;
}
.last-result .last-time .history-ball .his-prize {
    margin-left: 3px;
}
.last-result .last-time i:last-child span {
    color: #fffcfe;
}
.last-result .last-time i .prize-icon {
    display: inline-block;
    vertical-align: middle;
    margin-left: 3px;
    width: 20px;
    height: 14px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -574px -350px;
}
.last-result .last-time span {
    color: @buy-lottery-common-color;
}
/* 开奖历史结束 */

/* 上期开奖号码 */
.last-result .ball {
    width: 448px;
}
.last-result .ball span {
    position: relative;
    display: inline-block;
    font-size: 16px;
    width: 35px;
    margin-right: 8px;
    text-align: center;
    border-radius: 50%;
}
.last-result .ball.pcdd span {
    margin-right: 15px;
}
.last-result .ball .left-margin {
    margin-left: 5px;
}
.last-result .ball span i {
    display: block;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    text-align: center;
    background: #fff;
    background: radial-gradient(
        @lottery-info-ball-gradient-bg-one 21%,
        @lottery-info-ball-gradient-bg-two
    );
    color: @lottery-info-ball-color;
    font-weight: 700;
}
.last-result .ball .sum {
    position: absolute;
    right: -51px;
    top: 0;
}
.last-result .ball em {
    position: absolute;
    top: 5px;
    right: -1px;
    width: 12px;
    height: 24px;
    font-style: normal;
}
.last-result .ball.pcdd em {
    right: -13px;
}
/* pcdd */
.last-result .ball .large {
    width: 35px;
}
.last-result .ball .large i {
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    margin-right: 6px;
}
.last-result .ball span:nth-child(6).green,
.last-result .ball span:nth-child(6).red,
.last-result .ball span:nth-child(6).blue {
    width: 50px !important;
    margin-right: 0;
    border-radius: 0;
    background: none;
}
/* pcdd 结束*/
/* 6hc */
.last-result .ball .zodiac span:last-child {
    margin: 0 10px;
}
.last-result .ball > span.sixhc-red {
    background: #e50000;
}
.last-result .ball span i.sixhc {
    background: #c0bfbf;
    background: radial-gradient(#fcfcfc 21%, #c0bfbf);
}
/* 6hc结束 */
/* pcdd和六合彩号码颜色*/
.last-result .ball .blue,
.last-result .ball .blue i,
.last-result .pcdd .sum.blue {
    background: #0035ae;
    background: radial-gradient(#007ef9 27%, #0035ae);
    color: #fff;
}
.last-result .ball .green,
.last-result .ball .green i,
.last-result .pcdd .sum.green {
    background: #017019;
    background: radial-gradient(#1acb01 3%, #017019);
    color: #fff;
}
.last-result .ball .red,
.last-result .ball .red i,
.last-result .pcdd .sum.red,
.last-result .ball.pcdd i {
    background: #e50000;
    background: radial-gradient(#ff6050 7%, #e50000);
    color: #fff;
}
.last-result .ball .gray {
    background: #aaa;
}
.last-result .ball .sum.gray {
    background: #aaa;
}
/* pcdd和六合彩号码颜色结束 */
.lottery-title,
.next-time,
.last-result {
    position: relative;
    height: 100%;
    text-align: center;
}
</style>
<style scoped>
/* 期数提示弹框 */
.v-transfer-dom >>> .period-modal .ivu-modal-header {
    height: 0;
    padding: 0;
}
.v-transfer-dom >>> .period-modal .ivu-modal-header span {
    display: none;
}
.v-transfer-dom >>> .period-modal .ivu-modal-content {
    border: none;
    height: 150px;
    border-radius: 6px;
}
.v-transfer-dom >>> .period-modal .title {
    font-weight: bold;
}
.v-transfer-dom >>> .period-modal .content {
    position: relative;
    padding: 18px 0 0 48px;
    margin-top: 6px;
    font-size: 16px;
}
.v-transfer-dom >>> .period-modal .content i {
    position: absolute;
    left: 0;
    top: 10px;
    color: #2d8cf0;
    font-size: 36px;
}
.v-transfer-dom >>> .period-modal .content .period-no {
    color: #be1204;
    font-size: 20px;
}
</style>

