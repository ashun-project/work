<template>
    <div class="trend content" v-loading="loading">
        <div v-for="item in list" :key="item.lotteryType" class="list">
            <h5>{{item.lotteryTypeName}}</h5>
            <ul>
                <li v-for="vv in item.lotteryList" :key="vv.lotteryId">
                    <div class="logo">
                        <img :src="vv.lotteryIcon" alt="">
                    </div>
                    <div>
                        <h6>{{vv.lotteryName}}</h6>
                        <!-- <router-link :to="{name: 'trend_detail', params: {id: vv.lotteryId}}">号码走势</router-link> -->
                        <Button type="primary" style='height:30px;line-height:17px;color:#be1204;background:#f5f5f5;' @click='goTrendDetail(vv)'>号码走势</Button>
                    </div>
                </li>
            </ul>
            <div class="clr"></div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list: [],
            loading: false
        }
    },
    methods: {
        goTrendDetail (item) {
            this.$router.push({ name: "trend_detail", params: { id: item.lotteryId } });
        }
    },
    created () {
        let vm = this;
        this.loading = true
        this.$http.post('/api/v2/lottery/queryLotteryList', { lotteryType: '' }, { unenc: true }).then(response => {
            this.loading = false
            if (response.data.code !== 0) return;
            vm.list = response.data.data.lotteryTypeList;
            // console.log(vm.list);
        })
    }
}
</script>

<style lang="less">
.trend {
    padding-top: 36px;
    padding-bottom: 28px;
    min-height: 650px;
}
.trend .list {
    padding-top: 8px;
}
.trend .list h5 {
    height: 25px;
    line-height: 25px;
    font-size: 18px;
    padding-left: 10px;
    margin-bottom: 12px;
    color: #282828;
    font-weight: bold;
    border-left: 4px solid @trend-border-color;
}
.trend .list ul {
    margin-left: -16px;
}
.trend .list li {
    width: 238px;
    height: 92px;
    float: left;
    padding: 7px 0 7px 19px;
    margin-left: 16px;
    margin-bottom: 14px;
    background: @trend-li-bg;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    border: 1px solid @trend-li-bg;
}
.trend .list li:hover {
    background: #fff;
    color: @common-active-color;
    border: 1px solid @common-active-border-color;
}
.trend .list li:hover h6 {
    color: @common-active-color;
}

.trend .list li img {
    width: 76px;
    height: 76px;
    float: initial;
}
.trend .list li > div {
    float: left;
}
.trend .list li > div.logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    margin-right: 23px;
    border: 2px solid #fff;
}
.trend .list li > div h6 {
    height: 20px;
    color: #282828;
    font-size: 18px;
    line-height: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-top: 9px;
}
</style>
<style scoped>
.trend >>> li:hover .ivu-btn-primary {
    background: #be1204 !important;
    color: #fff !important;
}
</style>

