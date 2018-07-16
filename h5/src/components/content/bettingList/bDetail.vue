<template>
    <div>
        <div class="bDtail">
            <my-header title="注单详情" bkUrl="/bettingList">
                <span slot="h-left">
                    <i @click="$router.go(-1)" class="iconfont icon-arrowLeft"></i>
                </span>
            </my-header>
            <div class="container" v-if="bettingInfo">

                <div class="bDtail-hd">
                    <img class="img" :src="bettingInfo.lotteryIcon" alt="">
                    <div class="cont">
                        <p class="key">{{bettingInfo.lotteryName}}</p>
                        <p class="val">第{{bettingInfo.periodNo}}期</p>
                    </div>
                </div>

                <div class="bDtail-result">
                    <div class="item item-money">
                        <p class="key">
                            <i class="iconfont icon-qian3"></i>投注金额
                        </p>
                        <p class="val">{{bettingInfo.buyMoney}}元</p>
                    </div>
                    <div class="item" v-if="bettingInfo.status === '00'" :class="['item'+bettingInfo.status]">
                        <p class="key">
                            <i class="iconfont icon-dkj"></i>待开奖
                        </p>
                        <p class="val">请稍后</p>
                    </div>
                    <div class="item" v-else-if="bettingInfo.status === '02'" :class="['item'+bettingInfo.status]">
                        <p class="key">
                            <i class="iconfont icon-jiangbei3"></i>中奖金额
                        </p>
                        <p class="val">{{bettingInfo.prize}}元</p>
                    </div>
                    <div class="item" v-else-if="bettingInfo.status === '01'" :class="['item'+bettingInfo.status]">
                        <p class="key">
                            <i class="iconfont icon-fav"></i>没有中奖
                        </p>
                        <p class="val">再接再厉</p>
                    </div>
                    <div class="item" :class="['item'+bettingInfo.status]" v-else-if="bettingInfo.status === '05'">
                        <p class="key">
                            <i class="iconfont icon-chedan"></i>已撤单
                        </p>
                        <p class="val">撤单成功</p>
                    </div>
                </div>
                <div class="bDtail-tt">投注内容</div>
                <ul>
                    <li v-for="item in list" :key="item.label" :class="{space: item.space}">
                        <span class="label">
                            {{item.label}}
                        </span>
                        <span class="cont-value" v-if="item.value === 'rebate'">
                            {{((bettingInfo[item.value] ? bettingInfo[item.value] : 0)*100).toFixed(1)}}%
                        </span>
                        <span class="cont-value" v-else-if="item.value === 'lotteryNumber'">
                            <div class="ui-list-balls">
                                <template v-if="bettingInfo.dispNumber">
                                    <span v-for="(b,index1) in bettingInfo.dispNumber" :key="index1" :class="{liuhe: bettingInfo.info}">
                                        <span v-if="!parseInt(b) && parseInt(b) !== 0" class="symbol">
                                            <strong>{{b}}</strong>
                                        </span>
                                        <span v-else class="ball" :style="{background: bettingInfo.info ? bettingInfo.info[index1].clr : ''}">
                                            <strong>{{b}}</strong>
                                        </span>
                                        <i v-if="bettingInfo.info">{{bettingInfo.info[index1].zodiac}}</i>
                                        <!-- <span v-if="!item.normal&&index1<item.dispNumber.length-2">+</span>
                                <span v-if="!item.normal&&index1===item.dispNumber.length-2">=&nbsp;</span> -->
                                    </span>
                                    <div class="clr"></div>
                                </template>
                                <template v-else>
                                    正在开奖
                                </template>

                            </div>
                        </span>
                        <span class="cont-value" v-else :style="{color: item.clr ? 'red' : '#333'}">
                            {{bettingInfo[item.value]}}
                        </span>
                    </li>
                </ul>
                <div class="bDtail-state-img" :class="{'success':bettingInfo.status === '02','fail':bettingInfo.status === '01'}"></div>
                <div class="revoke" v-if="bettingInfo.status === '00'">
                    <!-- <Button long>撤销注单</Button> -->
                    <span @click="revokeLottery" :class="{'disabled':!isSubmit}">撤</span>
                </div>
                <div @click="goBetting(bettingInfo)" :class="{'disabled':bettingInfo.lotteryStatus === '0'}" class="go-buy-lottery">再来一注</div>
            </div>

        </div>

    </div>
</template>
<script>
import Business from '@/components/common/module_js/business.js'
export default {
    data () {
        return {
            bettingInfo: {},
            isSubmit: true,
            list: [
                { label: '开奖号码：', value: 'lotteryNumber' },
                { label: '订单号码：', value: 'userBettingInfoId' },
                { label: '投注号码：', value: 'buyLotteryNumber' },
                { label: '投注时间：', value: 'createTime' },
                { label: '玩法名称：', value: 'playName' },
                { label: '投注数量：', value: 'buyNum' },
                { label: '投注返点：', value: 'rebate' },
                { label: '投注赔率：', value: 'odds' }
            ]
        }
    },
    computed: {
        /*  noticeModify() {
              return this.$store.state.noticeModify;
            }, */
    },
    watch: {
        $route (n, o) {
            if (n.path !== o.path) {
                this.queryBettingInfo()
            }
        }
    },
    methods: {
        revokeLottery () {
            if (!this.isSubmit) {
                return
            }
            this.isSubmit = false
            this.$http
                .post(
                    '/api/v2/betting/cancleBettingRecord',
                    { userBettingRecordId: this.$route.params.id },
                    { userId: true }
                )
                .then(response => {
                    this.isSubmit = true;
                    if (response.data.code !== 0) return
                    this.$Message('取消注单成功')
                    this.$set(this.bettingInfo, 'statusDesc', '已撤单')
                    this.$set(this.bettingInfo, 'status', '')
                })
        },
        queryBettingInfo () {
            let vm = this
            let id = this.$route.params.id
            vm.$http
                .post(
                    '/api/v2/betting/queryBettingInfoById',
                    { userBettingRecordId: id },
                    { userId: true, noEncrypt: true, loading: true }
                )
                .then(response => {
                    if (response.data.code !== 0) return
                    vm.bettingInfo = response.data.data.bettingInfo
                    Business.setBallStyle(vm.bettingInfo);
                })
        },
        goBetting (lottery) {
            if (!lottery.lotteryId) return;
            sessionStorage.setItem("buyLottery" + lottery.lotteryId, lottery.lotteryStatus);
            this.$router.push('/buyLottery/' + lottery.lotteryId);
        },
    },
    created () {
        this.queryBettingInfo()
    }
}
</script>

<style scoped lang="less">
@rem: 40rem;
.bDtail {
    position: absolute;
    top: 2.2rem;
    left: 0;
    right: 0;
    background: #ebebeb;
    min-height: 100%;
}
.bDtail .container {
    position: relative;
    background: #fff;
    margin-bottom: 2.5rem;
}
.bDtail-hd {
    text-align: center;
    padding: 20 / @rem;
    border-bottom: 1px solid #eaeaea;
    .img {
        width: 80 / @rem;
        height: 80 / @rem;
        margin-right: 15 / @rem;
        display: inline-block;
        float: none;
        vertical-align: middle;
    }
    .cont {
        display: inline-block;
        text-align: left;
        vertical-align: middle;
        .key {
            color: #333;
            font-size: 30 / @rem;
        }
        .val {
            color: #999;
            font-size: 25 / @rem;
        }
    }
}
.bDtail-result {
    display: flex;
    padding: 20 / @rem 0;
    .item {
        flex: 1;
        text-align: center;
        min-height: 74 / @rem;
        font-size: 25 / @rem;
        &:first-child {
            border-right: 1px solid #f0ebc5;
        }
        .key {
            .iconfont {
                margin-right: 10 / @rem;
                font-size: 0.7rem;
            }
        }
        .val {
            font-weight: bold;
        }
    }
    .item-money {
        p {
            color: #93876a;
        }
    }
    .item00 {
        p {
            color: #d82e2f;
        }
    }
    .item01 {
        p {
            color: #93876a;
        }
    }
    .item02 {
        p {
            color: #eb7645;
        }
    }
    .item05 {
        p {
            color: #6a8a93;
        }
    }
}
.bDtail-tt {
    border-bottom: 1px solid #e7e7e8;
    border-top: 1px solid #e7e7e8;
    background-color: #f7f6f6;
    height: 56 / @rem;
    line-height: 56 / @rem;
    padding: 0 35 / @rem;
    color: #999;
    font-size: 30 / @rem;
}
.bDtail ul {
    border-bottom: 1px solid #e7e7e8;
    background-color: #fff;
    padding: 30 / @rem 0;
    position: relative;
}
.bDtail ul li {
    min-height: 1.2rem;
    line-height: 1rem;
    padding: 0 0.5rem;
    position: relative;
}
.bDtail ul li.space {
    border-bottom: 1px solid #ebebeb;
    margin-bottom: 25 / @rem;
}
.bDtail ul li > span {
    display: inline-block;
    font-size: 0.6rem;
    color: #333;
}
.bDtail ul li span.label {
    color: #999;
    position: absolute;
    left: 0.5rem;
    top: 0;
}
.bDtail ul li .cont-value {
    /* float: left; */
    padding-left: 3rem;
    word-break: break-all;
}
.bDtail .revoke {
    text-align: right;
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;
    position: absolute;
    right: 30 / @rem;
    bottom: 20 / @rem;
}
.bDtail .revoke span {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    background: #ec0022;
    color: #fff;
    font-size: 0.7rem;
    text-align: center;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.38);
}
.bDtail .bDtail-state-img {
    position: absolute;
    width: 245 / @rem;
    height: 175 / @rem;
    background-size: 245 / @rem 175 / @rem;
    right: 100 / @rem;
    bottom: 20 / @rem;
    display: none;
    &.success {
        display: block;
        background-image: url(../../../resource/images/betting-gxzj.png);
    }
    &.fail {
        display: block;
        background-image: url(../../../resource/images/betting-zlyz.png);
    }
}
.bDtail .revoke span.disabled {
    color: #fff;
    background-color: #999;
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
</style>
