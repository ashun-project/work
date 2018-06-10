<template>
    <div>
        <div class="bDtail">
            <my-header title="注单详情" bkUrl="/bettingList">
                <span slot="h-left">
                    <i @click="$router.go(-1)" class="iconfont icon-arrowLeft"></i>
                </span>
            </my-header>
            <div class="container" v-if="bettingInfo">
                <div class="import-dil">
                    <span class="title">
                        <strong>{{bettingInfo.lotteryName}}</strong>
                    </span>
                    <span>
                        <strong>{{bettingInfo.statusDesc}}</strong>
                    </span>
                </div>
                <ul>
                    <li v-for="item in list" :key="item.label" :class="{space: item.space}">
                        <span class="label">
                            <strong>{{item.label}}</strong>
                        </span>
                        <span class="cont-value" v-if="item.value === 'rebate'">
                            <strong>{{(bettingInfo[item.value]*100).toFixed(1)}}%</strong>
                        </span>
                        <span class="cont-value" v-else :style="{color: item.clr ? 'red' : '#333'}">
                            <strong>{{bettingInfo[item.value]}}</strong>
                        </span>
                    </li>
                </ul>
                <div class="revoke" v-if="bettingInfo.status === '00'">
                    <!-- <Button long>撤销注单</Button> -->
                    <span @click="revokeLottery">撤</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            bettingInfo: {},
            list: [
                { label: '期号', value: 'periodNo' },
                { label: '开奖号码', value: 'lotteryNumber' },
                { label: '订单号码', value: 'userBettingInfoId' },
                { label: '投注号码', value: 'buyLotteryNumber' },
                { label: '投注时间', value: 'createTime' },
                { label: '玩法名称', value: 'playName' },
                { label: '投注数量', value: 'buyNum', space: true },
                { label: '中奖金额', value: 'prize', clr: true },
                { label: '投注金额', value: 'buyMoney' },
                { label: '投注返点', value: 'rebate' },
                { label: '投注赔率', value: 'odds' }
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
            this.$http
                .post(
                    '/api/v2/betting/cancleBettingRecord',
                    { userBettingRecordId: this.$route.params.id },
                    { userId: true }
                )
                .then(response => {
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
                    { userId: true }
                )
                .then(response => {
                    if (response.data.code !== 0) return
                    vm.bettingInfo = response.data.data.bettingInfo
                })
        }
    },
    created () {
        this.queryBettingInfo()
    }
}
</script>

<style scoped>
.bDtail {
    position: absolute;
    top: 2.2rem;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ebebeb;
}
.bDtail .container {
    margin: 0.6rem;
    padding: 0.5rem 0;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 6px;
}
.bDtail .container .import-dil {
    height: 1.6rem;
    font-size: 0.8rem;
    padding: 0 0.5rem;
}
.bDtail .container .import-dil .title {
    float: left;
    color: #000;
}
.bDtail .container .import-dil span {
    float: right;
    color: #666;
}
.bDtail ul li {
    min-height: 1.2rem;
    line-height: 1rem;
    padding: 0 0.5rem;
    position: relative;
}
.bDtail ul li.space {
    border-bottom: 1px solid #ebebeb;
    margin-bottom: 0.26rem;
}
.bDtail ul li span {
    display: inline-block;
    font-size: 0.6rem;
    color: #333;
}
.bDtail ul li span.label {
    color: rgb(151, 150, 150);
    min-width: 3rem;
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
/* .bDtail .revoke button{
		
		color: #fff;
		height: 36px;
		
	} */
</style>
