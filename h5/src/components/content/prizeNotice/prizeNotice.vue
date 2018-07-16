<template>
    <div class="prize-notice">
        <my-header title="开奖" noHistory></my-header>
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
                        <div class="ui-list-balls">
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


import Business from '@/components/common/module_js/business.js'
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
            for (let item of this.lotteryList) {
                if (item.lotteryId === data.lotteryId) {
                    item.lotteryNumber = data.lotteryNumber;
                    item.periodNo = data.periodNo;
                    item.lastPrizeTime = data.time;
                    Business.setBallStyle(item);
                    return
                }
            }
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


        queryPrizeList (item) {
            let vm = this;
            vm.$http.post('/api/v2/lottery/queryPrizeList', '', { loading: true, noEncrypt: true }).then(response => {
                if (response.data.code !== 0) return;
                vm.lotteryList = [];
                response.data.data.lotteryList.forEach(element => {
                    Business.setBallStyle(element);
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
.right-icon {
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
}
</style>
