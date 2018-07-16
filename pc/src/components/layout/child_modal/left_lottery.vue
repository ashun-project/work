<template>
    <div class="lottery home-lottery">
        <div class="lottery-list">
            <ul class="lee-change-background">
                <li v-for="item in hotList" :key="item.lotteryId">
                    <router-link :to="item.status === '0' ? `${$route.fullPath}` : {name: 'buyLottery', params: {id: item.lotteryId}}" :target=" item.status === '1' ? '_blank' : ''" :class="{'not-allow':item.status==='0'}">
                        <img :src="item.lotteryIcon" alt="">
                        <span>{{item.lotteryName}}</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="all-lottery" :class="{'low-more': type === 2}" @mouseleave="leaveMoreList()">
            <div class="high-frequency lee-frequency " @mouseenter="enterMoreList(1)" :class="{active: type === 1}">
                <div class="before-document" v-show="type == 1 "></div>
                <div class="label">
                    <p class="frequency-left">高频彩</p>
                </div>
                <ul>
                    <li v-for="item in highList.slice(0, 4)" :key="item.lotteryId" class="lee-change-height">
                        <router-link :to="item.status === '0' ? `${$route.fullPath}` : {name:'buyLottery',params: {id: item.lotteryId}}" class="color-hover" :class="[item.status === '0' ? 'lottery-pointer-not' : '']" :target="item.status === '1' ?  '_blank' : '' ">{{item.lotteryName}}</router-link>
                    </li>
                </ul>
                <span class="more" :class="{'dsn': type === 1}">
                    <i class="i-icon i-arrow-right"></i>
                </span>
            </div>
            <div class="low-frequency lee-frequency" @mouseenter="enterMoreList(2)" :class="{active: type === 2}">
                <div class="before-document" v-show="type==2"></div>
                <div class="label">
                    <p class="frequency-left2 frequency-left">低频彩</p>
                </div>
                <ul>
                    <li v-for="item in lowList.slice(0, 4)" :key="item.lotteryId" class="lee-change-height">
                        <router-link :to="item.status === '0' ? `${$route.fullPath}` : {name:'buyLottery',params: {id: item.lotteryId}}" class="color-hover" :class="[item.status === '0' ? 'lottery-pointer-not' : '']" :target="item.status === '1' ?  '_blank' : '' ">{{item.lotteryName}}</router-link>
                    </li>
                </ul>
                <span class="more" :class="{'dsn': type === 2}">
                    <i class="i-icon i-arrow-right"></i>
                </span>
            </div>
            <!-- -->
            <div class="all-list" v-show="showList">
                <h3>
                    <i class="i-icon i-low fl" v-show="type === 2"></i>
                    <i class="i-icon i-high fl" v-show="type === 1"></i>
                    <span :class="{'i-low-afterspan': type === 2 ,'i-high-afterspan': type === 1 }">{{moreListTitle}}</span>
                </h3>
                <ul>
                    <li v-for="item in moreList" :key="item.lotteryId">
                        <router-link :to="item.status === '0' ? `${$route.fullPath}` : {name:'buyLottery',params: {id: item.lotteryId}}" :target=" item.status === '1' ? '_blank' : ''" class="color-hover" :class="{'lottery-pointer-not' : item.status === '0' ,'pointer-not' : item.status === '0'}">{{item.lotteryName}}</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="open-all">
            <router-link to="/lottery" target="_blank">
                全部彩种&nbsp;&nbsp;&gt;&gt;
            </router-link>
        </div>
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
            this.showFlag = true
            let data = response.data.data;
            this.hotList = data.lotteryHotList;
            this.highList = data.lotteryHightList;
            this.lowList = data.lotteryLowList;
            $('.home-lottery')[0].style.maxHeight = "606px";
            $('.home-lottery')[0].style.height = "606px";
            setTimeout(() => {
                $('.home-lottery')[0].style.overflow = "visible"
            }, 2000)
        });
    }
};
</script>
<style lang="less">
</style>

<style lang="less">
.lottery {
    background-color: @lottery-bg;
    border: 1px solid @common-active-border-color;
    .lee-frequency {
        // border-right: 1px solid #be1204;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        ul {
            height: 100%;
            .lee-change-height {
                height: 50%;
                line-height: 40px;
                font-size: 14px;
                color: #282828;
            }
        }
    }
    .before-document {
        width: 1px;
        z-index: 2000;
        background-color: #fff4ec;
        // background:blue;
        top: 0;
        right: -2px;
        position: absolute;
        height: 80px;
    }
    .frequency-left {
        width: 28px;
        border: 1px solid @common-active-border-color;
        position: relative;
        margin: auto;
        margin-top: 5px;
        border-radius: 6px;
        color: @lottery-high-frequency-color;
    }

    .frequency-left2 {
        border: 1px solid @lottery-low-frequency-border;
    }
    .all-list {
        box-shadow: 3px 1px 2px 0px #b50d0042;
    }
    .all-list li {
        text-indent: 8px;
    }
    .lottery-pointer-not {
        color: #bbbec4 !important;
        cursor: not-allowed;
    }
    .low-frequency a:hover {
        color: @lottery-low-frequency-color;
    }
}
</style>
<style lang="less">
.lottery {
    width: 220px;
    position: absolute;
    top: 44px;
    left: 0;
    z-index: 999;
    color: #333;
    border: 1px solid @lottery-border;
    border-top: none;
    .lottery-list {
        li {
            width: 100%;
            a {
                display: flex;
                align-items: center;
                width: 218px;
                height: 57px;
                line-height: 56px;
                border-bottom: 1px solid @lottery-list-border;
                padding-left: 10px;
                color: #000;
                transition: padding-left 0.2s linear,
                    background-color 0.2s linear, color 0.2s linear;
                -webkit-transition: padding-left 0.2s linear,
                    background-color 0.2s linear, color 0.2s linear;
                -moz-transition: padding-left 0.2s linear,
                    background-color 0.2s linear, color 0.2s linear;
                -ms-transition: padding-left 0.2s linear,
                    background-color 0.2s linear, color 0.2s linear;
                -o-transition: padding-left 0.2s linear,
                    background-color 0.2s linear, color 0.2s linear;
                img {
                    width: 42px;
                    height: 42px;
                    margin-right: 10px;
                }
                &:hover {
                    color: @common-active-color;
                    background-color: @lottery-list-nav-hover-bg;
                    padding-left: 31px;
                }
                &.not-allow {
                    color: @lottery-list-not-allow-color;
                    cursor: not-allowed;
                    img {
                        filter: gray;
                        -webkit-filter: grayscale(100%);
                        -webkit-filter: gray;
                        -o-filter: grayscale(100%);
                        -ms-filter: grayscale(100%);
                        -moz-filter: grayscale(100%);
                    }
                    &:hover {
                        color: @lottery-list-not-allow-color;
                        background: inherit;
                    }
                }
            }
        }
    }
    .all-lottery {
        position: relative;
        // .lee-frequency {
        //     height: 82px;
        //     border-bottom: 1px solid #ffe2cd;
        //     position: relative;
        // }
    }
}
</style>

<style lang="less">
.all-lottery > div {
    height: 82px;
    border-bottom: 1px solid #ffe2cd;
    position: relative;
}
.all-lottery .active {
    border-top: 1px solid @common-active-border-color;
    border-bottom: 1px solid @common-active-border-color;
    border-right: 1px solid @lottery-bg;
}
.all-lottery .label {
    float: left;
    width: 44px;
    line-height: 22px;
    text-align: center;
    height: 100%;
}
.all-lottery .high-frequency .label {
    color: @lottery-high-frequency-color;
}
.all-lottery .low-frequency .label {
    color: @lottery-low-frequency-color;
}
.all-lottery .low-frequency {
    border-bottom: 1px solid @lottery-list-border;
}
.all-lottery .label i {
    margin-top: 14px;
}
.all-lottery .label .i-high,
.all-lottery .label .i-low {
    width: 25px;
    height: 27px;
}
.i-high-afterspan {
    color: @common-color;
}
.i-low-afterspan {
    color: #ff8131;
}
.all-lottery ul {
    float: left;
    width: 170px;
    font-size: 12px;
    padding: 5px 8px;
    overflow: hidden;
}
.all-lottery ul li {
    float: left;
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.all-lottery ul li a {
    color: #222;
}
.all-lottery .high-frequency ul li a:hover {
    color: @common-active-color;
}
.all-lottery .more {
    display: block;
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translate(0, -50%);
    cursor: pointer;
}
.all-lottery .more .i-arrow-right {
    width: 11px;
    height: 18px;
    margin-top: 20px;
    background-position: -176px -114px;
}
.all-lottery .all-list {
    position: absolute;
    top: 0px;
    left: 218px;
    width: 500px;
    height: auto;
    min-height: 111px;
    background-color: @lottery-bg;
    border: 0;
    padding: 10px;
    border: 1px solid @common-active-border-color;
    height: 207px;
}
.all-lottery .all-list h3 {
    font-size: 14px;
    height: 28px;
    line-height: 28px;
    overflow: hidden;
    font-weight: normal;
}
.all-lottery .all-list h3 span {
    float: left;
    padding-left: 10px;
}
.all-lottery .all-list h3 span i {
    margin-top: 3px;
    margin-right: 5px;
}
.all-lottery .all-list ul {
    width: 100%;
    padding: 0;
    margin-top: 8px;
}
.all-lottery .all-list ul li {
    width: 25%;
    height: 20px;
    line-height: 20px;
}
.all-lottery .all-list ul li a:hover {
    color: @common-active-color;
}
.lottery .open-all {
    text-align: center;
    font-size: 14px;
    line-height: 43px;
    cursor: pointer;
    height: 43px;
    border-bottom: 0;
    width: 100%;
    border-top-color: @lottery-list-border;
    border-top: 0;
}
.lottery .open-all a {
    color: #333;
}
.lottery .open-all:hover a {
    color: @common-active-color;
}
.lottery-list li:last-child a {
    border-bottom-color: transparent;
}
.lottery .lee-frequency {
    border-top: 1px solid @lottery-list-border;
    // border-bottom: 1px solid #ffe2cd;
}
.lottery .lee-frequency:last-child {
    border-bottom: 1px solid @lottery-list-border;
}
.lottery .lee-frequency:hover {
    border-top: 1px solid @common-active-border-color;
    border-bottom: 1px solid @common-active-border-color;
}
</style>

