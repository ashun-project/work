<template>
    <div class="all-lottery">
        <!-- <my-header title="全部彩种"></my-header> -->
        <div class="lottery-box-wrap">
            <div class="lottery-box" v-for="(lotteryType,key) in lotteryTypeList" :key="key">
                <div class="inner" v-if="lotteryType.code !='all' && lotteryType.code !='hot' && lotteryType.code !='dpc' && lotteryType.code !='gpc'">
                    <div class="box-hd">
                        {{lotteryType.lotteryTypeName}}
                    </div>
                    <div class="box-bd">
                        <ul class="lottery-list">
                            <li v-for="(item, idx) in lotteryType.lotteryList" :key="idx" @click="goBetting(item)">
                                <img class="img" alt="" :src="item.lotteryIcon" :class="{'disable-img': item.status==='0'}">
                                <p class="name" v-text="item.lotteryName"> </p>
                            </li>
                            <div class="clr"></div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data'],
    data () {
        return {
            lotteryTypeList: []
        }
    },
    methods: {
        goPage (path) {
            this.$route.push(path)
        },
        goBetting (lottery) {
            sessionStorage.setItem("buyLottery" + lottery.lotteryId, lottery.status);
            this.$router.push('/buyLottery/' + lottery.lotteryId);
        },
    },
    created: function () {
        //初始化方法
        this.lotteryTypeList = this.data;
    }
}
</script>

<style scoped lang="less">
@rem: 40rem;
.all-lottery {
    /* 
    margin-top: -1.8rem; */
}
.all-lottery .lottery-box {
    .box-hd {
        height: 60 / @rem;
        line-height: 60 / @rem;
        background-color: #eee;
        padding: 0 34 / @rem;
        color: #999;
        font-size: 26 / @rem;
    }
}
.all-lottery .lottery-list {
    li {
        float: left;
        width: 33.333%;
        text-align: center;
        border-right: 1px solid #f3f3f3;
        border-bottom: 1px solid #f3f3f3;
        padding: 20 / @rem 0;
        &:nth-child(3n) {
            border-right: 1px solid transparent;
        }
        .img {
            width: 100 / @rem;
            height: 100 / @rem;
            border-radius: 100%;
            display: block;
            margin: 0 auto;
            float: none;
            margin-bottom: 10 / @rem;
        }
    }
}
</style>