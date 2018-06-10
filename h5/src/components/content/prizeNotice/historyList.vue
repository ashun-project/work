<template>
    <div>
        <div class="history" v-refresh="downRefresh">
            <my-header title="开奖详情" bkUrl="/prizeNotice">
                <router-link :to="{path:'/trend/'+$route.params.id}" tag="div" slot="h-right">号码走势</router-link>
            </my-header>
            <div class="head-detail">
                <div>
                    <img :src="lottery.lotteryIcon" />
                </div>
                <div>
                    <span class="title-name">{{lottery.lotteryName}}
                        <a target="_blank" class="authority" :href="lottery.officialUrl" v-if="lottery.selfFlag === '0'">官方开奖</a>
                    </span><br/>
                    <span class="period">{{lottery.periodNo}}</span>
                </div>
                <div class="soon-lottery">
                    即将开奖
                </div>
                <p class="clr"></p>
            </div>
            <ul class="list">
                <li v-for="(item, index) in prizeHistoryList" :key="index">
                    <div class="hd">
                        <span>{{item.periodNo}}</span>
                        <span class="date rf">{{formateDate(item.prizeTime) }}</span>
                    </div>
                    <div v-if="item.prizeAlready" class="bd">
                        <span v-for="(b,index1) in item.dispNumber" :key="index1">
                            <span v-if="!parseInt(b) && parseInt(b) !== 0" class="symbol">
                                <strong>{{b}}</strong>
                            </span>
                            <span v-else class="ball" :style="{background: item.info ? item.info[index1].clr : ''}">
                                <strong>{{b}}</strong>
                            </span>
                            <i v-if="item.info">{{item.info[index1].zodiac}}</i>
                            <!-- <span class="ball"><strong>{{b}}</strong></span>
                        <span v-if="!item.normal&&index1<item.dispNumber.length-2">+</span>
                        <span v-if="!item.normal&&index1===item.dispNumber.length-2">=&nbsp;</span> -->
                        </span>
                        <div class="clr"></div>
                    </div>
                    <div v-else>
                        正在开奖
                    </div>

                </li>
            </ul>
            <div @click="goBetting(lottery)" :class="{'disabled':lottery.status === '0'}" class="go-buy-lottery">
                去购彩
            </div>
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
export default {
    data () {
        return {
            lottery: {},
            prizeHistoryList: []
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
            if (this.$route.path.indexOf(data.path3) < 0 || vm.$route.params.id !== data.lotteryId) return;
            let id = this.$route.params.id;
            this.queryPrizeList(id);
        }
    },
    methods: {
        downRefresh () {
            return new Promise((resolve, rej) => {
                let id = this.$route.params.id;
                this.queryPrizeList(id, resolve);
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        },
        goBetting (lottery) {
            if (!lottery.lotteryId) return;
            sessionStorage.setItem("buyLottery" + lottery.lotteryId, lottery.status);
            this.$router.push('/buyLottery/' + lottery.lotteryId);
        },
        formateDate (value) {
            if (!value) return ''
            let v = formatDate.getFormatDate(Number(value), 'yymmddhhmmss');
            return v;
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
        handlePrizeList (list) {
            let vm = this, dataList = list.slice(0);
            vm.prizeHistoryList = [];
            dataList.forEach(element => {
                if (!element.prizeTime || !element.periodNo) {
                    element.prizeAlready = false;
                } else {
                    element.prizeAlready = true;
                    if (element.lotteryNumber) {
                        if (vm.lottery.code === '6hc') {
                            let num = element.lotteryNumber.split(",");
                            let lastNumbers = num[num.length - 1].split("+");
                            num[num.length - 1] = lastNumbers[0];
                            num.push('+');
                            num.push(lastNumbers[1]);
                            element.info = vm.liuhe(num, element.lastPrizeTime);
                            element.dispNumber = num;
                        } else if (vm.lottery.code === 'pcdd') {
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
                    }

                }
                vm.prizeHistoryList.push(element);
            });
        },
        queryPrizeList (id, resolve) {
            let param = {
                lotteryId: id
            };
            let vm = this;
            vm.$http.post('/api/v2/lottery/queryPrizeHistoryList', param, { loading: true }).then(response => {
                if (resolve) {
                    resolve()
                }
                if (response.data.code !== 0) return;
                vm.lottery = response.data.data.lottery;
                vm.history = response.data.data.prizeHistoryList;
                vm.handlePrizeList(vm.history);
            })
        }
    },
    created () {
        let vm = this;
        let id = this.$route.params.id;
        this.queryPrizeList(id);
    }
}
</script>

<style scoped>
.history {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 2.5rem;
}
.history .authority {
    margin-left: 10px;
    border: 1px solid #2d8cf0;
    border-radius: 3px;
    font-size: 0.7rem;
    padding: 0.1rem 0.2rem;
    background: #e6eff8;
}
.history .head-detail img {
    width: 40px;
    margin-top: 5px;
    margin-right: 0.3rem;
}
.history .head-detail {
    padding: 8px 0.6rem;
    background: #f3f3f3;
    border-bottom: 1px solid #eee;
}
.history .head-detail > div {
    float: left;
}
.title-name {
    color: #ec0022;
    font-size: 0.8rem;
}
.history .head-detail .soon-lottery {
    float: right;
    color: #ec0022;
    font-size: 0.76rem;
    height: 100%;
    line-height: 50px;
}
.history .head-detail .period {
    font-size: 0.66rem;
    color: rgb(134, 132, 132);
}
.history .list .hd {
    height: 0.8rem;
    line-height: 0.8rem;
    overflow: hidden;
    margin-bottom: 0.7rem;
}
.history .list .bd {
    margin-top: -0.2rem;
}
.history .list .bd > span {
    float: left;
    display: block;
    text-align: center;
    max-width: 1.6rem;
    margin-right: 0.16rem;
}
.history .list .bd > span .symbol {
    line-height: 1.34rem;
}
.history .list li {
    /*  height: 70px; */
    margin: 0 0.6rem;
    padding: 0.6rem 0;
    border-bottom: 1px solid #eee;
}
.history .list li .date {
    font-size: 0.66rem;
    color: rgb(134, 132, 132);
}
.history .list .ball {
    display: inline-block;
    width: 1.3rem;
    height: 1.3rem;
    line-height: 1.34rem;
    background: #ec0022;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    font-size: 0.7rem;
}
.go-buy-lottery {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    background: #ee1b3b;
    color: #fff;
    text-align: center;
    font-size: 1rem;
}
.go-buy-lottery.disabled {
    background: #bbb;
}
</style>

