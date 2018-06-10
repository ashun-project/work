<template>
    <div class="trend">
        <div class="broad-list">
            <div class='lottery-list-wrapper'>
                <ul>
                    <li v-for="item in broadList" :key="item.lotteryType" @click="changeBroad(item)" :style="{width: 100 / broadList.length + '%'}">
                        <div class='lottery-title' :class="{active: lotteryType === item.lotteryType}">
                            <i v-if='item.lotteryType'><img :src="item.lotteryTypeIcon" alt=""></i>
                            <span>{{item.lotteryTypeName}}</span>
                        </div>

                    </li>
                </ul>
                <div class='lottery-list'>
                    <ul>
                        <li v-for='lotteryItem in subList' :key='lotteryItem.lotteryName' :class="{'active-item' : lotteryId === lotteryItem.lotteryId}" @click='lotteryResult(lotteryItem.lotteryId)'>{{lotteryItem.lotteryName}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="detail-title">
            当前走势：
            <strong>{{detailTitle}}</strong>
        </div>
        <table-list :displayId="displayId" v-if="displayId" :lotteryId='lotteryId' style='margin-bottom:44px;'></table-list>
    </div>
</template>

<script>
import tableList from './table_list.vue'
export default {
    components: {
        tableList
    },
    data () {
        return {
            displayId: '',
            broadList: [],
            subList: [],
            lotteryType: '',
            lotteryId: '',
            detailTitle: ''
        }
    },
    methods: {
        lotteryResult (id) {
            let vm = this;
            this.$router.push({ params: { id: id } });
            this.$http.post('/api/v2/trend/queryDisplays', { lotteryId: id }).then(response => {
                // 返回列表页
                if (!response.data.data[0] || response.data.code !== 0) {
                    vm.$router.push('/trend')
                    return;
                };
                vm.lotteryId = id;
                vm.displayId = response.data.data[0].displayId;
                vm.detailTitle = response.data.data[0].lotteryName;
            })
        },
        changeBroad (item) {
            let vm = this;
            this.lotteryType = item.lotteryType;
            if (item.lotteryType) {
                let arr = [];
                item.lotteryList.forEach(value => {
                    arr.push(
                        vm.resultList.filter(data => data.lotteryId === value.lotteryId)[0]
                    );
                });

                let arrListLee = []
                this.subList.forEach(itm => {
                    if (itm) {
                        arrListLee.push(itm)
                    }
                })
                this.subList = item.lotteryList
                // this.subList = arrListLee

            } else {
                let arr = this.resultList;
                this.subList = this.resultList;
            }
        }
    },
    created: function () {
        let vm = this;
        this.lotteryResult(this.$route.params.id)
        this.$http.post("/api/v2/lottery/queryLotteryListGroupByType").then(response => {
            if (response.data.code !== 0) return;
            let data = response.data.data;
            vm.broadList = data.lotteryTypeList;
            vm.lotteryType = vm.broadList[0].lotteryType;
        });
        this.$http.post("/api/v2/lottery/queryLotteryPrizeListByType", { lotteryType: "" }).then(response => {
            if (response.data.code !== 0) return;
            vm.resultList = response.data.data.lotteryPrizeList;
            vm.subList = vm.resultList;
        });
    }
}
</script>

<style lang="less" scoped>
.trend {
    box-sizing: border-box;
    height: 100%;
    width: 1000px;
    margin: 0 auto;
    font-size: 1rem;
    overflow: auto;
    min-height: 200px;
}
.trend .broad-list {
    padding-top: 42px;
    font-size: 14px;
    margin-bottom: 30px;
    overflow: hidden;
}
.trend .broad-list .top {
    width: 100%;
    height: 62px;
    margin-left: 2px;
    background: url('/static/images/notice_broad.png') no-repeat;
}
.trend .lottery-list-wrapper {
    position: relative;
}
.trend .lottery-list-wrapper > ul {
    height: 46px;
}
.trend .lottery-list-wrapper > ul > li {
    line-height: 46px;
    color: #fff;
}
.trend .broad-list li {
    float: left;
    text-align: center;
    cursor: pointer;
}
.trend .lottery-list li:hover {
    color: @common-active-color;
}
.notice .lottery-title.active {
    background: @common-active-bg;
    color: #fff;
}
.trend .broad-list li i {
    display: inline-block;
    vertical-align: top;
    width: 22px;
    height: 22px;
    margin: 12px 10px 0 0;
}
.trend .broad-list li i img {
    filter: brightness(2);
    -webkit-filter: brightness(2);
    -ms-filter: brightness(2);
    -moz-filter: brightness(2);
    -o-filter: brightness(2);
}
.trend .lottery-title {
    font-size: 0;
    background: @common-bg;
}
.trend .lottery-list-wrapper li span {
    display: inline-block;
    vertical-align: top;
    line-height: 46px;
    font-size: 14px;
}
.trend .lottery-title:hover {
    background: @common-active-bg;
}
.trend .lottery-list ul {
    background: #ffe3cf;
}
.trend .lottery-list ul:after {
    display: block;
    content: '';
    clear: both;
    visibility: hidden;
}
.trend .lottery-list {
    width: 1000px;
    padding: 9px 0;
    background: #ffe3cf;
    color: #313131;
    border: 1px solid @common-active-border-color;
    border-top: none;
}

.trend .lottery-list li {
    position: relative;
    float: left;
    line-height: 27px;
    padding: 0 15px;
    text-align: center;
}
.trend .lottery-list li.active-item {
    color: @common-active-color;
}
.trend .lottery-list li:after {
    position: absolute;
    display: block;
    content: '';
    width: 1px;
    height: 14px;
    right: 0;
    top: 7px;
    background: #989899;
}
.trend .lottery-title.active {
    background: @common-active-bg;
    color: #fff;
}
.trend .detail-title {
    height: 25px;
}
</style>