<template>
    <div class="ranking">
        <h3>
            <!-- <Icon type="trophy"></Icon> -->
            <i class="iconfont icon-jiangbei2"></i>
            <span>最新中奖榜</span>
        </h3>
        <div class="cont">
            <!-- <div class="tab">
                <h6>排行</h6>
                <h6>用户名</h6>
                <h6>奖金</h6>
            </div> -->
            <div class="rowup" ref="rowupWrap" @mouseenter="stopScroll()" @mouseleave="startScroll()">
                <ul ref="rowup" :style="{top: rankTop + 'px'}">
                    <li v-for="(item, idx) in ranking" :class="{level: idx < 3}" :key="idx">
                        <span class="userCode">{{item.userCode}}</span>
                        <span class="money">
                            <font color="#be1204">喜中{{item.prizeTotal}}元</font>
                        </span>
                        <span>购买{{item.lotteryName}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            ranking: [],
            rankTimer: null,
            rankTop: 0,
            timerPrize: null,
            listTimer: null
        }
    },
    mounted () {
        this.goScorllRank()
    },
    methods: {
        stopScroll () {
            if (this.rankTimer) clearInterval(this.rankTimer);
        },
        startScroll () {
            this.goScorllRank()
        },
        // 排行榜滚动逻辑
        goScorllRank () {
            let vm = this;
            let data = [];
            let hig = '';
            let rowupWrapHig = vm.$refs.rowupWrap.clientHeight;
            // 数据加载会有延迟
            this.timerPrize = setInterval(function () {
                if (vm.$refs.rowup.clientHeight) {
                    hig = vm.$refs.rowup.clientHeight;
                    // 当高度以及超出了当前的容器高度时滚动
                    if (hig > 360) {
                        data = JSON.parse(JSON.stringify(vm.ranking));
                        actice();
                    }
                    clearInterval(vm.timerPrize);
                }
            }, 30)

            function actice () {
                vm.rankTimer = setInterval(function () {
                    vm.rankTop--
                    if (-vm.rankTop > (hig - rowupWrapHig)) {
                        vm.rankTop = 0;
                    }
                    if (Math.abs(vm.rankTop % hig) === hig - (hig - 1)) {
                        data.forEach(item => {
                            vm.ranking.push(item);
                        })
                    }
                }, 30)
            }
        },
        getList (num) {
            let vm = this;
            if (this.listTimer) clearTimeout(this.listTimer);
            vm.listTimer = setTimeout(() => {
                vm.$http.post('/api/v2/lottery/queryPrizeRankingList', {}, { noEncrypt: true }).then(response => {
                    if (response.data.code !== 0) return;
                    vm.ranking = response.data.data.prizeRankingList;
                });
                vm.getList(5 * 60 * 1000)
            }, num);
        }

    },
    activated () {
        this.rankTop = 0;
    },
    created () {
        // 中奖排行榜
        this.getList(1);
    },
    beforeDestroy () {
        clearInterval(this.timerPrize);
        clearTimeout(this.listTimer);
    }
}
</script>


<style scoped>
/* .ranking{
        border-top: 10px solid #f3f3f3;
    } */
.ranking h3 {
    height: 2rem;
    line-height: 2rem;
    font-size: 0.8rem;
    padding-left: 0.8rem;
    border-bottom: 1px solid #eee;
    color: #747474;
}
.ranking h3 i {
    font-size: 1.2rem;
    color: #ec0022;
    float: left;
    display: block;
    height: 100%;
    line-height: 2rem;
}
.ranking h3 span {
    float: left;
    margin-left: 0.2rem;
}
.ranking .cont {
    height: 200px;
    overflow-y: auto;
}

.ranking .money {
    width: 35%;
}
.ranking .userCode {
    text-align: left;
    padding-left: 20px;
    width: 25%;
}
/* .ranking .tab{
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-bottom: 1px solid #f1f1f1;
    }
    .ranking .tab h6{
        width: 30%;
        float: left;
        font-size: 0.7rem;
        font-weight: normal;
    }
    .ranking .tab h6:last-child{
        width: 40%;
    } */
.ranking .rowup {
    position: relative;
    height: 200px;
    overflow: hidden;
}
.ranking ul {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.ranking ul li {
    height: 30px;
    line-height: 30px;
    width: 100%;
    overflow: hidden;
}
.ranking ul li:nth-child(odd) {
    background: #f8f8f8;
}
.ranking ul li span {
    display: inline-block;
    width: 30%;
    text-align: center;
    float: left;
    font-size: 0.6rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.ranking ul li span:last-child {
    text-align: right;
    padding-right: 8px;
    width: 40%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
/* .ranking ul li span i{
        width: 20px;
        height: 20px;
        line-height: 20px;
        display: inline-block;
        background: #e8e8e8;
    } */
.ranking ul li.level span i {
    background: #be1204;
    color: #fff;
}
</style>
