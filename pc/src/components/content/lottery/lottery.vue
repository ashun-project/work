<template>
    <div class="lottery-list" :style="{minHeight: (lotteryTypeList.length + 2 + childList) * 50 + 'px'}">
        <div class="list">
            <div class="">
                <h5>
                    <i class="i-icon i-lottery"></i>购彩大厅</h5>
                <ul>
                    <li v-for="(item, idx) in lotteryTypeList" :key="idx" :class="{active: lotteryType === item.lotteryType}">
                        <div class="counst" @click="setlotteryType(item)">
                            <i class=""><img :src="item.icon || '/static/images/hot.png'"></i>
                            <span>{{item.lotteryTypeName}}</span>
                            <Icon type="ios-arrow-down" v-show="lotteryType === item.lotteryType"></Icon>
                            <Icon type="ios-arrow-right" v-show="lotteryType !== item.lotteryType"></Icon>
                        </div>
                        <div class="child">
                            <p v-for="value in item.lotteryList" :key="value.lotteryId">
                                <Button type="primary" :class="[value.status === '0' ? 'disabled' :'']" @click="goBetting(value)" :disabled="value.status === '0'">
                                    <i><img :src="value.lotteryIcon" alt="" :class="[value.status === '0' ? 'disabled' :'']"></i>{{value.lotteryName}}
                                </Button>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="streamer">
            <div class="lf">
                <Icon type="android-volume-up" color="#c9392e" :size="20"></Icon>
                <span>hi,欢迎来到彩票大厅</span>
            </div>
            <div class="rt">
                <Button type="primary" @click="goRecord">
                    <b class="i-icon i-lottery-record"></b>
                    <span class="record">投注记录</span>
                </Button>
            </div>
        </div>
        <div class="child-content">
            <ul class="lottery-lobby">
                <li v-for="(item, idx) in allList" :key="idx">
                    <item-page :data="item" :routeName="$route.name"></item-page>
                </li>
                <li class="lobby-item-placeholder"></li>
                <li class="lobby-item-placeholder"></li>
                <li class="lobby-item-placeholder"></li>
                <li class="lobby-item-placeholder"></li>
                <li class="lobby-item-placeholder"></li>
            </ul>
        </div>
        <div class="clr"></div>
        <Spin size="large" v-if='showSpin' fix></Spin>
    </div>
</template>

<script>
const hotLotteryType = null; //热门的类型为-1
import itemPage from './item.vue'
export default {
    components: {
        itemPage
    },
    data () {
        return {
            lotteryTypeList: [],
            childList: 0,
            allList: [],
            lotteryType: hotLotteryType,
            showSpin: true
        }
    },
    methods: {
        goBetting (value) { //投注
            // let user = localStorage.getItem('user');
            // if(!user) {
            //     sessionStorage.setItem('path',`buyLottery&${value.lotteryId}`);
            // }
            this.$router.push({ name: 'buyLottery', params: { id: `${value.lotteryId}` } });
        },
        goRecord () { //投注记录
            let user = localStorage.getItem('user');
            if (!user) {
                sessionStorage.setItem('path', 'personalCenter&record');
                this.$router.push('/login');
                return
            }
            this.$router.push('/personalCenter/record');
        },
        setlotteryType (item) {
            if (this.lotteryType !== item.lotteryType) {
                this.lotteryType = item.lotteryType
                this.childList = item.lotteryList.length;
            } else {
                this.lotteryType = 0;
                this.childList = 0;
            }
        }
    },
    created () {
        var vm = this;
        // lotteryType: null
        this.$http.post('/api/v2/lottery/queryLotteryList', {}, { unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            vm.lotteryTypeList = response.data.data.lotteryTypeList;
            vm.lotteryTypeList.forEach(item => {
                if (item.lotteryType === '-2') {
                    vm.allList = vm.allList.concat(item.lotteryList);
                    vm.showSpin = false;
                }
            })
        })
    }
}
</script>   
<style scoped>
.ivu-spin-fix >>> .ivu-spin-main {
    top: 42%;
}
</style>

<style lang="less" scoped>
.lottery-list {
    position: relative;
}
.lottery-list .ivu-spin-large {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-top: 169px;
    z-index: 9999999;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform-origin: 50% 50%;
}
.lottery-list .list {
    width: 210px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
}
.lottery-list .list h5 {
    height: 50px;
    line-height: 50px;
    color: #fff;
    font-size: 16px;
    background: @lottery-list-title-color;
    position: relative;
    padding-left: 35px;
    box-shadow: 1px 0 8px rgba(0, 0, 0, 0.36);
}
.lottery-list .list h5 i {
    position: absolute;
    top: 14px;
    left: 5px;
}
.lottery-list .list ul {
    border: 1px solid #d2d0d0;
    border-left: 0;
    border-bottom: 0;
    box-shadow: 0px -8px 8px rgba(0, 0, 0, 0.2);
}
.lottery-list .list li {
    line-height: 50px;
    font-size: 14px;
    max-height: 50px;
    transition: max-height ease-in 0.4s;
    color: #373434;
    overflow: hidden;
    cursor: pointer;
    border-bottom: 1px solid @lottery-list-li-border;
    background: @lottery-list-li-bg;
}
.lottery-list .list li.active {
    max-height: none;
}
.lottery-list .list li.active .counst {
    color: @common-active-color;
}
.lottery-list .list li .counst {
    position: relative;
    padding-left: 56px;
}
.lottery-list .list li .counst i {
    width: 36px;
    display: block;
    position: absolute;
    top: 14px;
    left: 18px;
}
.lottery-list .list li .counst i img {
    width: 22px;
    height: 22px;
}
.lottery-list .list li.active .counst i img {
    -webkit-filter: grayscale(0%);
    -moz-filter: grayscale(0%);
    -ms-filter: grayscale(0%);
    -o-filter: grayscale(0%);
    filter: grayscale(0%);
    filter: @common-color;
}
.lottery-list .list li .counst i.ivu-icon {
    right: 10px;
    top: 0;
    left: initial;
    height: 100%;
    width: auto;
    font-size: 20px;
    line-height: 50px;
    transition: all 1s;
}
.lottery-list .list li .child {
    line-height: 40px;
    font-size: 14px;
    background: #fff;
}
.lottery-list .list li .child p {
    position: relative;
    height: 38px;
    line-height: 38px;
}
.lottery-list .list li .child img.disabled {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
}
.lottery-list .list li .child .ivu-btn {
    color: #333;
    display: block;
    height: 100%;
    width: 100%;
    padding-right: 10px;
    border: 1px solid #fff;
    padding-left: 15px;
    background: none;
    border-radius: 0;
    text-align: left;
    -webkit-border-radius: 0;
    -ms-border-radius: 0;
    -moz-border-radius: 0;
    -o-border-radius: 0;
}
.lottery-list .list li .child .ivu-btn:hover,
.lottery-list .list li .child .ivu-btn.active {
    color: @common-active-color;
    border-color: @common-active-border-color;
    outline: none;
    box-shadow: none;
    -webkit-box-shadow: none;
    -ms-box-shadow: none;
    -moz-box-shadow: none;
    -o-box-shadow: none;
}
.lottery-list .list li .child .ivu-btn.disabled,
.lottery-list .list li .child .ivu-btn.disabled:hover {
    color: #bbbec4;
    background-color: @btn-disabled-bg;
    border-color: transparent;
}
.lottery-list .streamer {
    margin-left: 210px;
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    padding-left: 20px;
    background-color: @lottery-streamer-bg;
    border-top: 1px solid @lottery-streamer-border;
    border-bottom: 1px solid @lottery-streamer-border;
}
.lottery-list .streamer .lf {
    float: left;
}
.lottery-list .streamer .lf span {
    color: #000;
}
.lottery-list .streamer .rt {
    float: right;
    padding-right: 20px;
    margin-top: -4px;
}
.lottery-list .streamer .rt .ivu-btn > span {
    width: 100%;
    height: 100%;
    line-height: 30px;
}
.lottery-list .streamer .rt .ivu-btn {
    width: 100px;
    padding: 0;
    background: transparent;
    color: @common-color;
    border-radius: 6px;
    -webkit-border-radius: 6px;
    -ms-border-radius: 6px;
    -moz-border-radius: 6px;
    -o-border-radius: 6px;
}
.lottery-list .streamer .rt .record {
    display: inline-block;
    vertical-align: top;
    margin-top: 2px;
    margin-left: 7px;
}
.lottery-list .streamer .rt .i-icon {
    display: inline-block;
    vertical-align: top;
    /* margin-top: 2px; */
}
.lottery-list .streamer i {
    float: left;
    margin-top: 9px;
    margin-right: 10px;
}
.lottery-list .child-content {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    flex: 1 1 0%;
}
.lottery-list .lottery-lobby {
    height: 100%;
    padding-bottom: 30px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-around;
    padding-left: 220px;
}
.lottery-list .lottery-lobby .lobby-item-placeholder {
    width: 319px;
    height: 1px;
    display: flex;
    flex-shrink: 0;
    margin: 15px 5px 0px 5px;
}
</style>
<style scoped>
.lottery-list .list li .child p >>> .ivu-btn {
    padding-top: 4px;
    padding-bottom: 4px;
    transition: color 0.2s linear, background-color 0.2s linear,
        border 0.2s linear, box-shadow 0.2s linear, padding-left 0.2s linear;
}
.lottery-list .list li .child p >>> .ivu-btn:hover {
    padding-left: 29px;
}
.lottery-list .list li .child p >>> .ivu-btn i img {
    width: 28px;
    height: 28px;
    margin-right: 13px;
}
.lottery-list .list li .child p >>> .ivu-btn span {
    line-height: 29px;
}
</style>
