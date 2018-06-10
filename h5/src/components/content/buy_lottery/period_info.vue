<template>
    <!-- 期数信息 -->
    <div class="lottery-info" :class="{'open-mask': isShowLotteryResult}">
        <div class="period-down-time" :class="{'result-page': switchType === 2}">
            <span class="txt">距{{period}}&nbsp;期截止</span>
            <span class="red-font">
                <my-countDown :id="$route.params.id" :routeName="$route.name" historyList @get-period="getPeriod"></my-countDown>
            </span>
        </div>
        <div class="info-h" v-if="switchType !== 2">
            <div class='lf' @click.stop="showLotteryResult" :class='{active:isShowLotteryResult}'>
                <div class="lf-inner">
                    <div class='top'>
                        <span><img class="lotteryIcon" :src="lotteryIcon" alt="">
                            <span>近期开奖</span>
                            <i class="iconfont icon-biaotou-daoxu"></i>
                        </span>
                    </div>
                    <div class='balls' :class="{'balls-small':code ==='ssc'}" v-if="currentLotteryNum && currentLotteryNum.length > 0 ">
                        <ul :class="{'small-width':code ==='ksan'}">
                            <template v-if="code === 'pk10'">
                                <li v-if="currentLotteryNum.length">
                                    <span class='ball' v-for='(ball,index) in currentLotteryNum[0]' :key="index">{{ball}}</span>
                                </li>
                                <li v-if="currentLotteryNum.length">
                                    <span class='ball' v-for='(ball,index) in currentLotteryNum[1]' :key="index">{{ball}}</span>
                                </li>
                            </template>
                            <template v-else-if="code ==='pcdd'">
                                <li>
                                    <span class='ball' v-for='(ball,index) in currentLotteryNum' :key='index' :style="{background:ball.clr?ball.clr:''}" :class="[ball.clz]">
                                        <template>
                                            {{ball.value}}
                                        </template>

                                    </span>
                                </li>
                            </template>
                            <template v-else-if="code === '6hc'">
                                <li class='six-hc'>
                                    <span class='ball' v-for='(ball,index) in currentLotteryNum' :key='index' :class="{'no-bg':index===6}">
                                        <b v-if='index!==6'>
                                            <em class='ball-wrap' :style="{background:ball.clr}">{{ball.num}}</em>
                                            <em>{{ball.label}}</em>
                                        </b>
                                        <b v-if='index==6'>{{ball}}</b>
                                    </span>
                                </li>
                            </template>
                            <template v-else>
                                <li class='ball' v-for="(ball,index) in currentLotteryNum" :key="index">
                                    {{ball}}
                                </li>
                            </template>
                        </ul>
                        <div class='rt' v-if='code === "ksan"'>
                            <span>{{smallBig}}</span>
                            <span>{{singleDouble}}</span>
                        </div>
                        <div class='sumTxt' v-else-if='code === "ssc"'>
                            <span>( {{lotterySum}} {{smallBig}} {{singleDouble}} )</span>
                        </div>
                    </div>
                    <div v-else class="wating-result">正在开奖...</div>
                </div>

            </div>
            <div class="clear"></div>
            <!-- <div class='rt'>
                <span class="txt">距{{period}}&nbsp;期截止</span>
                <span class="red-font">
                    <my-countDown :id="$route.params.id" :routeName="$route.name" @get-period="getPeriod"></my-countDown>
                </span>
            </div> -->
        </div>
        <!-- 遮罩层 -->
        <div class="mask" @click="showLotteryResult"></div>
        <div class='lotteryNumber-list'>
            <!-- 和值 -->
            <div v-if="code ==='ksan'" class='sum-val-wrap'>
                <dl>
                    <dt class='sum-value'>
                        <span>期数</span>
                        <span style='padding:0;'>开奖号</span>
                        <span>和值</span>
                        <span>大小</span>
                        <span>单双</span>
                    </dt>
                    <dd class='value' v-for='ball in preHistoryList' :key='ball.periodNo'>
                        <span class="period-no">{{ball.periodNo}}</span>
                        <template v-if="ball.lotteryNumber && ball.lotteryNumber.length>0">
                            <span>
                                <i v-for='(bal,index) in ball.lotteryNumber' :key='index'>{{bal}}</i>
                            </span>
                            <span>{{ball.sum}}</span>
                            <span>{{ball.sumVal}}</span>
                            <span>{{ball.singleDouble}}</span>
                        </template>
                        <template v-else>
                            <span class="wating-result">正在开奖...</span>
                        </template>
                    </dd>
                </dl>
            </div>

            <!-- 非和值 -->
            <div v-else class='no-sum-value'>
                <dl>
                    <dt>
                        <span>期数</span>
                        <span>开奖号</span>
                    </dt>
                    <dd :class="{'big-height':code==='6hc'}" v-for='ball in preHistoryList' :key="ball.periodNo">
                        <span class="period-no">{{ball.periodNo}}</span>
                        <template v-if="ball.lotteryNumber && ball.lotteryNumber.length >0">
                            <span v-if="code ==='pcdd'" class='ddd'>
                                <i v-for='(bal,index) in ball.lotteryNumber' :key='index' :style="{background:bal.clr?bal.clr:''}" :class="[bal.clz]">
                                    <template>
                                        {{bal.value}}
                                    </template>
                                </i>
                            </span>
                            <span v-else-if="code === '6hc'" class='six-hc'>
                                <span class='ball' v-for='(bal,index) in ball.lotteryNumber' :key='index' :class="{'no-bg':index===6}">
                                    <b v-if='index!==6'>
                                        <em class='ball-wrap' :style="{background:bal.clr}">{{bal.num}}</em>
                                        <em>{{bal.label}}</em>
                                    </b>
                                    <b v-if='index==6'>{{bal}}</b>
                                </span>
                            </span>
                            <span v-else-if="code ==='ssc'">
                                <i v-for='(bal,index) in ball.lotteryNumber' :key='index'>{{bal}}</i>
                                <span class="sumTxt">({{ball.sum}} {{ball.sumVal}} {{ball.singleDouble}})</span>
                            </span>
                            <span v-else>
                                <i v-for='(bal,index) in ball.lotteryNumber' :key='index'>{{bal}}</i>
                            </span>
                        </template>
                        <template v-else>
                            <span class="wating-result">正在开奖...</span>
                        </template>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>

<script>

const SIX_PK = [
    // const 六合彩
    {
        color: "red", data: ["01", "02", "07", "08", "12", "13", "18", "19", "23", "24", "29", "30", "34", "35", "40", "45", "46"]
    },
    {
        color: "blue", data: ["03", "04", "09", "10", "14", "15", "20", "25", "26", "31", "36", "37", "41", "42", "47", "48"]
    },
    {
        color: "green", data: ["05", "06", "11", "16", "17", "21", "22", "27", "28", "32", "33", "38", "39", "43", "44", "49"]
    }
];

const PCDD_CLR = [    /* pc蛋蛋的彩种，显示中奖号码时，特码球要显示不同显示*/
    {
        color: "red", data: ["3", "6", "9", "12", "15", "18", "21", "24"],
    },
    {
        color: "green", data: ["1", "4", "7", "10", "16", "19", "22", "25"],
    },
    {
        color: "blue", data: ["2", "5", "8", "11", "17", "20", "23", "26"],
    },
    {
        color: "gray", data: ["0", "13", "14", "27"]
    }
]
import getZodiac from '@/components/common/module_js/zodica.js'
export default {
    props: {
        code: {
            type: String
        },
        switchType: {
            type: Number
        },
        lotteryIcon: {
            type: String
        }
    },
    data () {
        return {
            isShowLotteryResult: false,     //是否显示往期结果,
            smallBig: '小',
            singleDouble: '单',       //单双,
            lotterySum: 0, // 当前和值
            period: '',
            currentLotteryNum: [],
            preHistoryList: [],
            timer: '',
            timer2: '',
            looptimer: null
        }
    },
    computed: {
        noticeModify () {
            return this.$store.state.noticeModify;
        },
        userCode () {
            return this.$store.state.user.userCode
        }
    },
    watch: {
        noticeModify (data) {
            let vm = this;
            if (vm.$route.path.indexOf(data.path2) < 0 || vm.$route.params.id !== data.lotteryId) return;
            vm.$http.post('/api/v2/lottery/queryLotteryNumberByPeriod', { lotteryId: data.lotteryId, periodNo: [data.periodNo] }).then(response => {
                let result = response.data.data;
                if (result && result[0].lotteryNumber && this.history) {
                    let resultData = result[0], newLorrery = true;

                    vm.history.forEach((item) => {
                        if (resultData.periodNo === item.periodNo) {
                            item.lotteryNumber = resultData.lotteryNumber;
                            newLorrery = false;
                        }
                    })

                    if (newLorrery) {
                        vm.history.splice(0, 0, resultData);
                    }
                    vm.handleHistoryList(vm.history);
                }
            })
        },
        userCode (newVal) {
            if (!newVal) {
                clearTimeout(this.timer2)
                clearTimeout(this.timer)
            }
        }
    },
    methods: {
        showLotteryResult () { //显示往期开奖号码
            this.isShowLotteryResult = !this.isShowLotteryResult;
            if (this.isShowLotteryResult) {
                document.documentElement.style.overflow = 'hidden';
            } else {
                document.documentElement.style.overflow = 'auto';
            }
        },
        // 轮询请求开奖结果
        pollPeriod (data) {
            // 防止退出时没有清除
            if (this.$route.name !== 'buyLottery') return;
            if (data[0].lotteryNumber) return;
            let vm = this;
            this.$http.post('/api/v2/lottery/queryLotteryNumberByPeriod', { lotteryId: this.$route.params.id, periodNo: [data[0].periodNo] }).then(response => {
                let result = response.data.data;
                if (!result || !result[0].lotteryNumber) {
                    vm.timer2 = setTimeout(function () {
                        vm.pollPeriod(data)
                    }, 20000)
                } else {
                    data[0].lotteryNumber = result[0].lotteryNumber;
                    vm.handleHistoryList(data);
                }
            })
        },
        // 获取期号
        getPeriod (data) {
            let vm = this;
            if (this.timer) clearTimeout(this.timer);
            if (this.timer2) clearTimeout(this.timer2);
            if (this.period) this.$Message("期数已发生改变(当前期数" + data.current.periodNo + ")");
            if (!this.userCode) {
                this.timer = setTimeout(() => {
                    this.pollPeriod(data.history);
                }, 20000);

            }
            this.history = data.history;
            this.handleHistoryList(data.history);
            this.period = data.current.periodNo;
            this.$emit('get-period', data.current);

        },
        calPreHistoryListSum (relNum) {
            let sum = 0, smallBig = null, singleDouble = null, lotterySum = 0, vm = this;
            vm.currentLotteryNum.forEach(item => {
                lotterySum += Number(item);//和值号码的和
            })

            vm.preHistoryList.forEach(item => {
                if (!item.lotteryNumber.length) return
                item.lotteryNumber.forEach(ball => {
                    sum += Number(ball);
                })
                item.sum = sum;
                item.sumVal = sum > relNum ? '大' : '小';
                item.singleDouble = sum % 2 === 0 ? '双' : '单';
                sum = 0;
            })
            this.lotterySum = lotterySum;
            this.smallBig = lotterySum > relNum ? '大' : '小';
            this.singleDouble = lotterySum % 2 === 0 ? '双' : '单';
        },
        handleHistoryList (data) {
            let vm = this;
            vm.preHistoryList = JSON.parse(JSON.stringify(data))
            vm.preHistoryList.forEach((item, index) => {
                if (item.lotteryNumber) {
                    item.lotteryNumber = item.lotteryNumber.replace('+', ',').split(',');
                } else {
                    item.lotteryNumber = []
                }
            })
            vm.currentLotteryNum = this.preHistoryList[0].lotteryNumber.slice(0);
            if (vm.code === '6hc') { //六合彩
                vm.preHistoryList.forEach(item => {
                    let zodias = getZodiac(item.prizeTime);
                    let numInfo = {};
                    if (!item.lotteryNumber.length) return
                    item.lotteryNumber.forEach((num, index) => {
                        SIX_PK.forEach(ballInfo => { //查找颜色
                            ballInfo.data.forEach(dt => {
                                if (dt === num) {
                                    numInfo.clr = ballInfo.color;
                                }
                            })
                        })
                        zodias.forEach(zodia => {
                            zodia.data.forEach(dt => {
                                if (dt === num) {
                                    numInfo.label = zodia.label;
                                    numInfo.num = num;
                                }
                            })
                        })
                        item.lotteryNumber[index] = numInfo;
                        numInfo = {};
                    })

                    item.lotteryNumber.splice(6, 0, '+');
                })
                if (vm.currentLotteryNum.length > 0) {
                    vm.currentLotteryNum = vm.preHistoryList[0].lotteryNumber;
                }

            }
            if (vm.code === 'pk10') { //pk10两排显示
                let firstArr = [];
                let lastArr = [];
                if (vm.currentLotteryNum.length <= 0) return;
                vm.currentLotteryNum.forEach((item, index) => {
                    if (index < 5) {
                        firstArr.push(vm.currentLotteryNum[index]);
                    } else {
                        lastArr.push(vm.currentLotteryNum[index]);
                    }
                })
                vm.currentLotteryNum[0] = firstArr;
                vm.currentLotteryNum[1] = lastArr;
            }
            if (vm.code === 'pcdd') { //pcdd的格式需要转换
                vm.preHistoryList.forEach((item, index) => {
                    let sum = 0, sumData = {}, smBig, sinDb, currentLotteryNum;
                    if (!item.lotteryNumber.length) return
                    item.lotteryNumber.forEach(ball => {
                        sum += Number(ball);
                    })
                    sumData.value = sum;
                    PCDD_CLR.forEach(clrItem => { //查找颜色
                        clrItem.data.forEach(dt => {
                            if (Number(dt) === sum) {
                                sumData.clr = clrItem.color;
                            }
                        })
                    });
                    smBig = sum > 13 ? '大' : '小';
                    sinDb = sum % 2 === 0 ? '双' : '单';

                    item.lotteryNumber = item.lotteryNumber.map((it) => {
                        return { value: it }
                    })

                    if (index === 0) {
                        currentLotteryNum = item.lotteryNumber.slice(0);
                        currentLotteryNum.push({ clz: 'sumTxt', value: `( ${sum} ${smBig} ${sinDb})` });
                        vm.currentLotteryNum = currentLotteryNum;
                    }

                    item.lotteryNumber.splice(1, 0, { clz: 'no-bg', value: '+' });
                    item.lotteryNumber.splice(3, 0, { clz: 'no-bg', value: '+' });
                    item.lotteryNumber.splice(5, 0, { clz: 'no-bg', value: '=' });
                    item.lotteryNumber.push(sumData);
                    item.lotteryNumber.push({ clz: 'sumTxt', value: `( ${smBig} ${sinDb})` });

                })
            }
            if (vm.code === 'ssc') {
                this.calPreHistoryListSum(22);
            }
            if (vm.code === 'ksan') {
                this.calPreHistoryListSum(10);
            }
        }
    },
    created () {
        // this.handleHistoryList();
    },
    beforeDestroy () {
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
    },
    destroyed () {
        if (this.timer) clearTimeout(this.timer);
        if (this.timer2) clearTimeout(this.timer2);
    }
}
</script>


<style scoped>
.lottery-info {
    width: 100%;
    position: fixed;
    top: 2.2rem;
    left: 0;
    z-index: 300;
    text-align: center;
    border-bottom: 1px solid #eee;
}
.lottery-info .period-down-time {
    position: absolute;
    top: 6px;
    right: 0;
    height: 3.5rem;
    width: 50%;
    font-size: 0.7rem;
    text-align: center;
}
.lottery-info .period-down-time.result-page {
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 0.8rem;
    width: 100%;
    top: 0;
    display: flex;
    align-content: center;
    justify-content: center;
    border-bottom: 1px solid #eee;
    background: #fff;
}
.lottery-info .period-down-time.result-page .txt {
    margin-right: 10px;
}
.lottery-info .period-down-time span.red-font {
    font-size: 0.9rem;
    color: #f11717;
}

.lottery-info .info-h {
    width: 100%;
    background: #f3f3f3;
}
.lottery-info .info-h .lf {
    float: left;
    width: 50%;
    height: 3.5rem;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
}
.lf-inner {
    flex: 1;
}
.lottery-info .lf {
    position: relative;
}
.lottery-info .lf::after {
    content: '';
    height: 3.5rem;
    width: 1px;
    background: #eee;
    position: absolute;
    right: 0;
    top: 0;
}
.lottery-info .lf .top {
    font-size: 0.7rem;
    margin-bottom: 0.15rem;
    width: 100%;
}
.lottery-info .lf i {
    transition: all 0.5s;
    color: #313131;
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    display: inline-block;
}
.lottery-info .lf.active i {
    transform: rotate(-180deg);
    -webkit-transform: rotate(-180deg);
    -ms-transform: rotate(-180deg);
    -moz-transform: rotate(-180deg);
    -o-transform: rotate(-180deg);
}
.lottery-info .lf .balls {
    width: 100%;
    display: flex;
    align-items: center;
}

.lottery-info .lf .balls li {
    white-space: nowrap;
    font-size: 0;
}
.lottery-info .lf .balls .ball {
    display: inline-block;
    /* float: left; */
    border-radius: 50%;
    font-size: 0.88rem;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    margin: 0 0.1rem 0;
    font-size: 0.4rem;
    color: #fff;
    background: #f11717;
}

.lottery-info .lf .balls .sumTxt {
    font-size: 0.7rem;
    width: auto;
    background: transparent;
    color: #333;
    vertical-align: bottom;
}
.lottery-info .lf .balls .six-hc .ball {
    /* vertical-align:top; */
    height: 2rem;
    border-radius: 0;
    margin: 0 0.1rem;
    /* color:#fff; */
    width: 0.9rem;
    font-size: 12px;
    background: none;
    border: none;
}
.lottery-info .lf .balls .six-hc .ball:last-child {
    margin-left: 0.2rem;
}
.lottery-info .lf .balls .six-hc .ball.no-bg {
    width: 0.2rem;
    margin: 0;
}
.lottery-info .lf .balls .six-hc .ball b {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    text-align: center;
    color: #313131;
}
.lottery-info .lf .balls .rt {
    text-align: center;
    width: 49%;
    font-size: 0;
}
.lottery-info .lf .balls .rt span {
    width: 50%;
    display: inline-block;
    font-size: 0.8rem;
}
.lottery-info .lf .balls .six-hc .ball .ball-wrap {
    display: block;
    width: 100%;
    height: 0.9rem;
    line-height: 0.9rem;
    background: #f11717;
    border-radius: 50%;
    color: #fff;
}
.lottery-info .lf .balls .text {
    flex: 1;
}
.lottery-info .lf .balls ul {
    width: 100%;
}
.lottery-info .lf .balls .small-width {
    position: relative;
    width: 50%;
}
.lottery-info .lf .balls .small-width:after {
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    width: 1px;
    height: 60%;
    background: #e5e5e5;
    -webkit-transform: rotateY(1);
    transform: rotateX(0.5);
    -webkit-transform-origin: left, top;
    transform-origin: left, top;
}

.lottery-info .lotteryNumber-list {
    position: absolute;
    top: 3.5rem;
    left: 0;
    width: 100%;
    height: 13.2rem;
    overflow: auto;
    z-index: 3;
    display: none;
}
.lottery-info em,
.lottery-info b {
    font-weight: normal;
}
.lottery-info .lotteryNumber-list dt,
.lottery-info .lotteryNumber-list dd {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: #e5e5e5;
}
.lottery-info .lotteryNumber-list dt {
    height: 1.2rem;
    white-space: nowrap;
}
.lottery-info .lotteryNumber-list dd {
    height: 1.5rem;
    background: #fff;
}
.lottery-info .lotteryNumber-list dd .period-no {
    font-size: 0.7rem;
}
.lottery-info .lotteryNumber-list dd.big-height {
    height: 2rem;
}
.lottery-info .lotteryNumber-list dd.big-height > span:first-child {
    line-height: 2rem;
}
.lottery-info .lotteryNumber-list dd.big-height .wating-result {
    line-height: 2rem;
}
.lottery-info .lotteryNumber-list dd:nth-child(odd) {
    background: #e5e5e5;
}
.lottery-info .lotteryNumber-list .sum-value span,
.lottery-info .lotteryNumber-list .value span {
    flex: 3;
    padding: 5px;
}
.lottery-info .lotteryNumber-list .value span:first-child {
    padding: 0;
    height: 100%;
    line-height: 1.5rem;
    border-right: 2px solid #cfd3eb;
}
.lottery-info .lotteryNumber-list .sum-value span:nth-child(2),
.lottery-info .lotteryNumber-list .value span:nth-child(2) {
    flex: 3;
}
.lottery-info .lotteryNumber-list .sum-value span:nth-child(3),
.lottery-info .lotteryNumber-list .value span:nth-child(3) {
    flex: 1;
}
.lottery-info .lotteryNumber-list .sum-value span:nth-child(4),
.lottery-info .lotteryNumber-list .value span:nth-child(4) {
    flex: 1;
}
.lottery-info .lotteryNumber-list .sum-value span:nth-child(5),
.lottery-info .lotteryNumber-list .value span:nth-child(5) {
    flex: 1;
}
.lottery-info .lotteryNumber-list dd span:nth-child(2) i {
    display: inline-block;
    /* float: left; */
    border-radius: 50%;
    font-size: 0.88rem;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    margin: 0 0.05rem 0;
    font-size: 0.4rem;
    color: #fff;
    background: #f11717;
}
.lottery-info .lotteryNumber-list .no-sum-value dt,
.lottery-info .lotteryNumber-list .no-sum-value dd {
    display: flex;
    align-items: center;
}
.lottery-info .lotteryNumber-list .no-sum-value .sumTxt {
    font-size: 0.7rem;
    width: auto;
    background: transparent;
    color: #666;
    vertical-align: middle;
}
.lottery-info .lotteryNumber-list .no-sum-value dt span,
.lottery-info .lotteryNumber-list .no-sum-value dd span {
    flex: 1.5;
    height: 100%;
    line-height: 1.5rem;
}
.lottery-info .lotteryNumber-list .no-sum-value dt span {
    height: 100%;
    line-height: 1.2rem;
    color: #999;
}
.lottery-info .lotteryNumber-list .no-sum-value dt span:last-child,
.lottery-info .lotteryNumber-list .no-sum-value dd span:last-child {
    flex: 3;
}
.lottery-info .lotteryNumber-list .no-sum-value dd span:first-child {
    border-right: 2px solid #cfd3eb;
}
.lottery-info .lf .balls .no-bg,
.lottery-info .lotteryNumber-list dd span:nth-child(2) i.no-bg {
    background: none;
    border: none;
    color: #313131;
    width: 0.6rem;
}
.lottery-info .lotteryNumber-list .no-sum-value dd span.six-hc .ball {
    display: inline-block;
    width: 1rem;
    height: 2rem;
    border-radius: 0;
    margin: 0 0.1rem;
    /* color: #fff; */
    font-size: 12px;
    background: none;
    border: none;
}
.lottery-info .lotteryNumber-list .no-sum-value dd span.six-hc .ball b {
    display: inline-block;
    /* width: 100%; */
    /* width:1rem;
        height:2rem; */
    height: 2rem;
    line-height: 1rem;
    padding-top: 0.1rem;
    vertical-align: top;
    text-align: center;
    color: #313131;
}
.lottery-info
    .lotteryNumber-list
    .no-sum-value
    dd
    span.six-hc
    .ball:nth-child(7) {
    width: 0.2rem;
    margin: 0;
}
.lotteryNumber-list .no-sum-value dd span.six-hc .ball:last-child {
    margin-left: 0.2rem;
}
.lottery-info
    .lotteryNumber-list
    .no-sum-value
    dd
    span.six-hc
    .ball
    b
    em:first-child {
    display: block;
    width: 1rem;
    line-height: 1rem;
    background: #f11717;
    border-radius: 50%;
    color: #fff;
}
.lottery-info
    .lotteryNumber-list
    .no-sum-value
    dd
    span.six-hc
    .ball
    b
    em:last-child {
    display: block;
    height: 1rem;
}
.lottery-info .mask {
    background: rgba(3, 3, 3, 0.31);
    position: fixed;
    top: 3.5rem;
    bottom: 0;
    width: 100%;
    display: none;
    z-index: -1;
}
.lottery-info.open-mask {
    bottom: 0;
}
.lottery-info.open-mask .mask,
.lottery-info.open-mask .lotteryNumber-list {
    display: block;
}
.lottery-info .wating-result {
    text-align: center;
    color: #666;
    font-size: 0.7rem;
    flex: 1;
}
.lottery-info .lotteryNumber-list .sum-val-wrap .value .wating-result {
    flex: 6;
    padding: 20px;
}
.lottery-info .lf .balls-small .ball {
    margin-right: 0.02rem;
}
.lottery-info .lf .balls-small {
    justify-content: center;
}
.lottery-info .lf .balls-small ul {
    white-space: nowrap;
    width: auto;
}
.lottery-info .lf .balls-small .sumTxt {
    font-size: 0.7rem;
    white-space: nowrap;
    letter-spacing: -1px;
    margin-top: 4px;
}
.lottery-info .lotteryIcon {
    width: 1.2rem;
    float: none;
    display: inline-block;
    vertical-align: bottom;
    margin-right: 0.4rem;
}
@media screen and (max-width: 320px) {
    .lottery-info .lf .balls-small .ball {
        width: 0.95rem;
        height: 0.95rem;
    }
    .lottery-info .lf .balls-small .sumTxt {
        font-size: 0.6rem;
    }
}
</style>
