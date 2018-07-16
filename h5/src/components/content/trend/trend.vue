<template>
    <div class="trend" @click="parentMenuShow = false">
        <my-header>
            <div slot="h-left">
                {{lotteryName}}
            </div>
            <div slot="h-center" class="h-title">
                <div>
                    <span @click.stop="setParentMenuShow('parentMenu')">{{title}}</span>
                </div>
                <ul :class="{'show-menu': parentMenuShow}" @click.stop="parentMenuShow = true">
                    <li v-for="(item, idx) in popupList" @click.stop="changeParent(item, idx)" :class="{active: parentCurrent === idx}" :key="idx">
                        {{item.displayName || item.lotteryName}}
                    </li>
                </ul>
            </div>
            <div class="h-right" slot="h-right" v-if="allLottery.length" @click.stop="setParentMenuShow('allLottery')">
                选择彩种
                <i class="iconfont icon-arrowDown"></i>
            </div>
        </my-header>
        <div class="swiper-container child-menu-swiper" v-if="loading">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, idx) in childMenu" :class="{active: childCurrent === idx}" @click="gotoSwiper(idx)" :key="idx">
                    <span>{{item.displayName}}</span>
                </div>
            </div>
        </div>
        <div class="swiper-container swiper-car" v-if="loading">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, idx) in childMenu" v-if="idx < requestNum" :key="idx">
                    <my-content :url="url" :params="params" ref="content" @on-request-over="nextRequest"></my-content>
                </div>
            </div>
        </div>
    </div>
</template>   

<script>
var mySwiper;
var myTopSwiper;
import myContent from './list'
export default {
    name: 'trend',
    data () {
        return {
            url: '/api/v2/trend/queryTrend',
            params: {
                lotteryId: '', // 12
                displayId: '' // 500101
            },
            title: '',
            requestNum: 1,
            parentMenu: [],
            parentCurrent: 0,
            parentMenuShow: false,
            childMenu: [],
            childCurrent: 0,
            allLottery: [],
            popupList: [],
            loading: false,
            lotteryName: ''
        }
    },
    components: {
        myContent
    },
    mounted: function () {

    },
    methods: {
        setParentMenuShow (item) {
            this.parentMenuShow = !this.parentMenuShow;
            this.popupList = this[item];
        },
        nextRequest: function () {
            this.$Indicator.close();
            if (this.requestNum >= this.childMenu.length) return;
            var obj = this.childMenu[this.requestNum];
            this.$set(this.params, 'displayId', obj.displayId);
            this.requestNum++
        },
        gotoSwiper: function (idx) {
            this.childCurrent = idx;
            mySwiper.slideTo(idx)
        },
        changeParent: function (item, idx) {
            if (item.code) {
                if (item.lotteryId === this.$route.params.id) {
                    return;
                }
                this.$router.push({ params: { id: item.lotteryId } })
                this.params.lotteryId = item.lotteryId;
                this.parentMenuShow = false;
                this.parentCurrent = idx;
                this.getParentMenu(true);
                return;
            }
            if (this.parentCurrent != idx) {
                var vv = this;
                this.parentCurrent = idx;
                this.params.lotteryId = item.lotteryId;
                this.parentMenuShow = false;

                // 清空之前的数据
                mySwiper.removeAllSlides();   // 清空之前的 swiper
                this.childMenu = this.childMenu.filter(item => false); // 清空顶部菜单

                // 重新定义参数值
                this.childCurrent = 0;
                this.requestNum = 1;
                this.params.displayId = item.children[0].displayId;
                this.title = item.displayName;

                // 这块加载会有延迟 所以使用了nextTick DOM更新完之后加载
                this.$nextTick().then(function () {
                    // DOM 更新了
                    item.children.forEach(element => {
                        vv.childMenu.push(element)
                    });
                })
            }
        },
        getParentMenu: function (old) {
            var vv = this;
            this.loading = false;
            this.$Indicator.open('加载中...');
            this.$http.post('/api/v2/trend/queryDisplays', { 'lotteryId': this.params.lotteryId }, { noEncrypt: true }).then(response => {
                if (response.data.code !== 0) return;
                vv.title = response.data.data[0].displayName;
                vv.parentMenu = response.data.data;
                vv.childMenu = response.data.data[0].children;
                vv.params.displayId = response.data.data[0].children[0].displayId;
                vv.loading = true;
                vv.requestNum = 1;
                vv.$nextTick().then(function () {
                    vv.renderSwiper();
                })
                vv.lotteryName = response.data.data[0].lotteryName;
            })
        },
        renderSwiper: function () {
            var vm = this;
            var startScroll, touchStart, touchCurrent;

            mySwiper = new Swiper('.swiper-car', {
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
                on: {
                    slideChangeTransitionStart: function () {
                        vm.childCurrent = this.activeIndex;  // 切换时更新菜单栏状态
                        // swiper.update();
                        myTopSwiper.slideTo(this.activeIndex)
                    }
                }
            });

            // 头部菜单
            myTopSwiper = new Swiper('.child-menu-swiper', {
                // slidesPerView: 1,
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
                slidesPerView: 4
            })
        }
    },
    activated () {
        let vm = this;
        vm.params.lotteryId = vm.$route.params.id; // 购彩跳这个页面
        // 检测上一次页面进入时的走势图是否画完整
        if (this.childMenu.length) {
            let result = vm.$refs.content.some(item => !item.cancvasResult);
            if (result) {
                vm.getParentMenu();
            }
        }
    },
    created: function () {
        this.params.lotteryId = this.$route.params.id;
        this.getParentMenu();
        this.$http.post('/api/v2/lottery/queryLotteryList', { lotteryType: null }, { noEncrypt: true }).then(response => {
            this.allLottery = response.data.data.lotteryTypeList.filter(item => item.lotteryType === '-2')[0].lotteryList;
        })
    }
}
</script>
<style>
.trend .swiper-car {
    width: 100%;
    position: absolute;
    top: 4.2rem;
    left: 0;
    bottom: 2.4rem;
}
.trend .swiper-slide {
    text-align: center;
    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    overflow: auto;
}

/* 主样式 */
.trend {
    box-sizing: border-box;
    /* height: 100%; */
    font-size: 1rem;
    overflow: auto;
}
.h-title ul {
    position: absolute;
    top: 2rem;
    left: 0;
    width: 100%;
    background: #fff;
    margin: 0;
    margin-top: -1px;
    padding: 0 2%;
    border-bottom: 1px solid #f2f2f2;
    box-shadow: 0px 2px 4px rgba(51, 51, 51, 0.31);
    transition: all 0.5s;
    opacity: 0;
    z-index: -1;
    visibility: hidden;
}
.h-title ul.show-menu {
    opacity: 1;
    z-index: 99;
    top: 2.2rem;
    visibility: visible;
}
.h-title ul li {
    float: left;
    color: #adadb9;
    width: 30%;
    border: 1px solid #ececec;
    margin: 1.6%;
    line-height: 1.3rem;
    border-radius: 0.1rem;
    font-size: 0.7rem;
    text-align: center;
}
.h-title ul li.active {
    color: #fff;
    background: #ff536f;
    border-color: #ff536f;
}
.trend .child-menu-swiper {
    height: 2rem;
    overflow-y: hidden;
    background: #f2f2f2;
    font-size: 0.7rem;
}
.trend .child-menu-swiper span {
    display: block;
    width: 90%;
    height: 1.5rem;
    border-radius: 3px;
    line-height: 1.5rem;
}
.trend .child-menu-swiper .active span {
    background: #fe8688;
    color: #fff;
}
.trend table {
    width: 100%;
    color: #adadb9;
}
.trend table thead tr {
    background: #e5e5e5;
}
.trend tr {
    background: #f8f8f8;
}
.trend tr:nth-child(even) {
    background: #ffffff;
}
.trend th {
    border-right: 1px solid #ececec;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #ececec;
    height: 1.6rem;
    font-size: 0.7rem;
}
.trend td {
    border-right: 1px solid #ececec;
    text-align: center;
    -webkit-transition: background-color 0.2s ease-in-out;
    transition: background-color 0.2s ease-in-out;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #ececec;
    height: 1.5rem;
    font-size: 0.6rem;
}
.trend th:last-child,
td:last-child {
    border-right: none;
}
/* 中奖号的颜色 */
.trend .win-num {
    color: #fff;
    display: inline-block;
    width: 1.1rem;
    height: 1.1rem;
    line-height: 1.1rem;
    text-align: center;
    position: relative;
    z-index: 102;
}
.trend .win-num.ball {
    border-radius: 50%;
}
.trend .table-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.trend canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}
.trend .table-tbody {
    position: relative;
}
</style>
