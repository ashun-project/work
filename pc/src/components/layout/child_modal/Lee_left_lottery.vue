<template>
    <div class="lee-home-lottery">

    </div>
</template>

<script>
export default {
    data () {
        return {
            showList: false,
            type: "",
            moreListTitle: "",
            hotList: [],
            highList: [],
            lowList: [],
            moreList: []
        };
    },
    methods: {
        enterMoreList (type) {
            if (type === 1) {
                this.moreList = this.highList;
                this.moreListTitle = "高频彩";
            } else if (type === 2) {
                this.moreList = this.lowList;
                this.moreListTitle = "低频彩";
            }
            this.type = type;
            this.showList = true;
        },
        leaveMoreList () {
            this.showList = false;
            this.type = "";
        }
    },
    created () {
        this.$http.post("/api/v2/lottery/queryLotteryBar", '', { unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            let data = response.data.data;
            this.hotList = data.lotteryHotList;
            this.highList = data.lotteryHightList;
            this.lowList = data.lotteryLowList;
        });
    }
}
</script>

<style lang="less">
</style>
