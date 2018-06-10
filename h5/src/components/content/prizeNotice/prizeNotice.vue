<template>
    <div class="prize-notice">
        <my-header title="开奖公告" noHistory></my-header>
        <div v-refresh="refresh">
            <ul>
                <li v-for="(item, index) in lotteryList" :key="index" @click="getHistory(item.lotteryId)">
                    <div class="list-logo">
                        <img class="prize-notice-lottery-img" crossOrigin='Anonymous' :src="item.lotteryIcon" />
                    </div>
                    <div class="list-detail">
                        <div class="title">
                            <span>{{item.lotteryName}}</span>
                            <span class="rf">{{item.lastPrizeTime |formateDate}}</span>
                        </div>
                        <div class="period">
                            {{item.periodNo}}
                        </div>
                        <div class="list-balls">
                            <span v-for="(b,index1) in item.dispNumber" :key="index1" :class="{liuhe: item.info}">
                                <span v-if="!parseInt(b) && parseInt(b) !== 0" class="symbol">
                                    <strong>{{b}}</strong>
                                </span>
                                <span v-else class="ball" :style="{background: item.info ? item.info[index1].clr : ''}">
                                    <strong>{{b}}</strong>
                                </span>
                                <i v-if="item.info">{{item.info[index1].zodiac}}</i>
                                <!-- <span v-if="!item.normal&&index1<item.dispNumber.length-2">+</span>
                                <span v-if="!item.normal&&index1===item.dispNumber.length-2">=&nbsp;</span> -->
                            </span>
                            <div class="clr"></div>
                        </div>
                    </div>
                    <div class="right-icon">
                        <i class="iconfont icon-arrowRight"></i>
                        <!-- <Icon type="ios-arrow-right" :color="'#ccc'" :size="16"></Icon> -->
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
let liuhe = {
    red: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'],
    blue: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'],
    green: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49']
}
let pcdd = {
    green: ['1', '4', '7', '10', '16', '19', '22', '25'],
    blue: ['2', '5', '8', '11', '17', '20', '23', '26'],
    red: ['3', '6', '9', '12', '15', '18', '21', '24'],
    gray: ['0', '13', '14', '27']
}
import getZodiac from '@/components/common/module_js/zodica.js'
import formatDate from '@/components/common/module_js/format_date.js'
import base64 from '@/components/common/mixin/base64'
export default {
    name: 'prizeNotice',
    mixins: [base64],
    data () {
        return {
            lotteryList: []
        }
    },
    computed: {
        noticeModify () {
            return this.$store.state.noticeModify;
        },
    },
    watch: {
        noticeModify (data) {
            let vm = this;
            if (data.path !== vm.$route.path) return;
            vm.$http.post('/api/v2/lottery/queryLotteryNumberByPeriod', { lotteryId: data.lotteryId, periodNo: [data.periodNo] }).then(response => {
                let result = response.data.data;
                if (result && result[0].lotteryNumber) {
                    let resultData = result[0];
                    for (let item of vm.lotteryList) {
                        if (item.lotteryId === resultData.lotteryId) {
                            item.lotteryNumber = resultData.lotteryNumber;
                            item.periodNo = resultData.periodNo;
                            item.lastPrizeTime = resultData.prizeTime
                            vm.handleLottery(item);
                            return
                        }
                    }

                }
            })
        },
        lotteryList: {
            handler (newVal) {
                let vm = this
                this.$nextTick(() => {
                    let domList = Array.prototype.slice.call($('.prize-notice-lottery-img'))
                    this.base64Image(domList, newVal)
                })
            },
            deep: true
        }
    },
    filters: {
        formateDate (value) {
            if (!value) return ''
            let date = formatDate.getFormatDate(value, 'yymmddhhmmss');
            // let idx = date.indexOf('-');
            // date = date.substr(idx+1);
            return date;
        }
    },
    methods: {
        getHistory (lotteryId) {
            this.$router.push('/historyList/' + lotteryId);
        },
        liuhe (data, time) {
            let arr = []
            let zodiac = getZodiac(time);
            data.forEach(item => {
                let zTxt, clr;
                zodiac.forEach(value => {
                    if (value.data.some(vvv => vvv === item)) {
                        zTxt = value.label;
                    };
                })
                // 计算红波绿波蓝波
                for (var key in liuhe) {
                    if (liuhe[key].some(value => item === value)) {
                        clr = key;
                    }
                }
                arr.push({ zodiac: zTxt, clr: clr });
            })
            return arr;
        },
        pcddColor (data) {
            let arr = [], clr = '';
            for (let i = 0; i < data.length; i++) {
                clr = ''
                if (i === data.length - 1) {
                    for (let key in pcdd) {
                        if (pcdd[key].indexOf(String(data[i])) > -1) {
                            clr = key === 'red' ? '#d11606' : key;
                        }
                    }
                }
                arr.push({ clr: clr });
            }
            return arr;
        },
        handleLottery (element) {
            let vm = this;
            element.clr = [];
            if (element.code === '6hc') {
                let num = element.lotteryNumber.split(",");
                let lastNumbers = num[num.length - 1].split("+");
                num[num.length - 1] = lastNumbers[0];
                num.push('+');
                num.push(lastNumbers[1]);
                element.info = vm.liuhe(num, element.lastPrizeTime);
                element.dispNumber = num;
            } else if (element.code === 'pcdd') {
                let num = element.lotteryNumber.replace(/,/g, '+');
                let lastNumber = 0;
                element.dispNumber = [];
                for (let i = 0; i < num.length; i++) {
                    let current = num.slice(i, i + 1);
                    if (parseInt(current)) lastNumber += parseInt(current);
                    element.dispNumber.push(current)
                }
                element.dispNumber.push('=')
                element.dispNumber.push(lastNumber);
                element.info = vm.pcddColor(element.dispNumber);
            } else {
                element.dispNumber = element.lotteryNumber.split(",");
            }
        },
        queryPrizeList (item) {
            let vm = this;
            vm.$http.post('/api/v2/lottery/queryPrizeList', '', { loading: true }).then(response => {
                if (response.data.code !== 0) return;
                vm.lotteryList = [];
                response.data.data.lotteryList.forEach(element => {
                    vm.handleLottery(element);
                    vm.lotteryList.push(element);
                });
            })
        },
        refresh () {
            return new Promise((resolve, reject) => {
                this.queryPrizeList();
                if (this.downTimer) clearTimeout(this.downTimer);
                this.downTimer = setTimeout(() => {
                    resolve();
                }, 1000);
            })

        }
    },
    activated () {

    },
    deactivated () {
        // 退出时
    },
    created () {
        this.queryPrizeList();
    }
}
</script>

<style scoped>
.prize-notice {
    height: 100%;
    overflow-y: auto;
}
.prize-notice li {
    min-height: 98px;
    padding: 6px 0.3rem 6px 55px;
    border-bottom: 10px solid #eee;
    position: relative;
}
.prize-notice li .list-logo {
    position: absolute;
    left: 0.3rem;
    top: 25px;
}
.prize-notice li .list-logo img {
    width: 40px;
}
.prize-notice .list-detail {
    margin-left: 0.3rem;
}
.prize-notice .list-detail .title .rf {
    font-size: 0.66rem;
    color: rgb(134, 132, 132);
}
.prize-notice .period {
    font-size: 0.66rem;
    color: rgb(134, 132, 132);
    margin-bottom: 0.2rem;
}
.prize-notice .list-balls > span {
    float: left;
    display: block;
    text-align: center;
    margin-right: 0.1rem;
}
.prize-notice .list-balls > span.liuhe {
    width: 1rem;
    margin-right: 0.2rem;
    line-height: 18px;
}
.prize-notice .list-balls > span i {
    font-size: 0.6rem;
}
.prize-notice .list-balls > span.liuhe .ball {
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
}
.prize-notice .list-balls .ball {
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    line-height: 1.24rem;
    background: #d11606;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    font-size: 0.7rem;
}
.prize-notice .list-balls .symbol {
    display: inline-block;
    line-height: 1.24rem;
}
.prize-notice .right-icon {
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
}
</style>
