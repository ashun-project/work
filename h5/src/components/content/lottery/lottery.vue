<template>
    <div class="lottery" id="lottery">
        <my-header :title="headerTitle">
            <div slot="h-left" v-if="showAllType" @click="setAllType(false)">
                <i class="iconfont icon-arrowLeft" style="color: #fff; font-size:26px"></i>
            </div>
            <div slot="h-left" v-else></div>
            <div slot="h-right" v-if="!showAllType" @click="setAllType(true)">全部彩种</div>
        </my-header>
        <!--tab begin-->
        <div class="current-page" v-show="!showAllType" v-refresh="downRefresh">
            <div class="swiper-container swiper-car">
                <div class="fixed-lottery">
                    <a @click="selectType(fixedLottery)" :class="fixedLottery.lotteryType === curLotteryType ? 'current': ''">
                        <span v-text="fixedLottery.lotteryTypeName"></span>
                    </a>
                </div>
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,idx) in lotteryTypeList" :key="idx">
                        <a @click="selectType(item, idx)" :class="item.lotteryType === curLotteryType ? 'current': ''">
                            <Icon type="fireball" v-if="item.lotteryType=='-1'"></Icon>
                            <span v-text="item.lotteryTypeName"></span>
                        </a>
                    </div>
                </div>
            </div>
            <!--tab end-->
            <div class="list">
                <ul>
                    <li v-for="lottery in curLotteryList" :key="lottery.lotteryId">
                        <dl class="box-shadow-grey" @click="goBetting(lottery)">
                            <dt>
                                <img class="lottery-lottery-img" :class="{'disable-img': lottery.status==='0'}" crossOrigin='Anonymous' :src="lottery.lotteryIcon" />
                            </dt>
                            <dd>
                                <h5 class="t-grey-333" v-text="lottery.lotteryName"></h5>
                                <span v-text="lottery.prizeIntervalDesc"></span>
                                <my-countDown class="t-red" :data="lottery" :exitTime="exitTime" :routeName="$route.name" :id="lottery.lotteryId"></my-countDown>
                            </dd>

                        </dl>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
        </div>
        <div v-show="showAllType">
            <all-type :data="lotteryTypeList" v-if="lotteryTypeList.length"></all-type>
        </div>

    </div>
</template>

<script>
var mySwiper = '';
import loading from '@/components/common/loading/loading'
import allType from './all_type'
import base64 from '@/components/common/mixin/base64'
export default {
    name: 'lottery',
    watch: {
        curLotteryList: {
            handler (newVal) {
                let vm = this
                this.$nextTick(() => {
                    let domList = Array.prototype.slice.call($('.lottery-lottery-img'))
                    this.base64Image(domList, newVal)
                })
            },
            deep: true
        }
    },
    mounted () {
        this.refreshFunction($('#lottery')[0])

    },
    mixins: [loading, base64],
    data () {
        return {
            curLotteryType: '-2',
            currentIdx: 0,
            curLotteryList: [],
            lotteryTypeList: [],
            fixedLottery: {},
            showAllType: false,
            refresh: true,
            exitTime: 0,
            timer: false
        }
    },
    components: {
        allType
    },
    computed: {
        headerTitle () {
            if (!this.showAllType) {
                return '购彩大厅'
            } else {
                return '全部彩种'
            }
        }
    },
    methods: {
        downRefresh () {
            return new Promise((resolve, reject) => {
                this.init(true);
                // mySwiper.slideTo(0)
                // this.curLotteryType = '-2'
                if (this.downTimer) clearTimeout(this.downTimer);
                this.downTimer = setTimeout(() => {
                    resolve();
                }, 1000);
            })
        },
        getSwiper (num) {
            this.$nextTick(function () {
                mySwiper = new Swiper('.swiper-container', {
                    slidesPerView: 3
                })
                mySwiper.slideTo(num)
            })
        },
        goBetting (lottery) {
            sessionStorage.setItem("buyLottery" + lottery.lotteryId, lottery.status);
            this.$router.push('/buyLottery/' + lottery.lotteryId);
        },
        gotoSwiper: function (idx) {
            this.childCurrent = idx;
            mySwiper.slideTo(idx)
        },
        selectType: function (item, idx) {
            this.curLotteryType = item.lotteryType;
            this.curLotteryList = item.lotteryList;
            if (idx) {
                if (idx > this.currentIdx) {
                    mySwiper.slideNext()
                } else {
                    mySwiper.slidePrev()
                }
            }
            this.currentIdx = idx || 0;
        },
        setAllType (value) {
            this.showAllType = value;
        },
        init (isRefresh) {
            //初始化方法
            var vm = this;
            let id = this.$route.params.id;
            this.$http.post('/api/v2/lottery/queryLotteryList', { lotteryType: null }, { loading: true, noEncrypt: true }).then(response => {
                if (response.data.code !== 0) return;
                // vm.lotteryTypeList = response.data.data.lotteryTypeList;
                let data = response.data.data.lotteryTypeList;
                sessionStorage.setItem('lotteryTypeList', JSON.stringify(data))
                vm.fixedLottery = data.filter(item => item.lotteryType === '-2')[0];
                vm.lotteryTypeList = data.filter(item => item.lotteryType !== '-2');
                if (!isRefresh) {
                    vm.getSwiper(0);
                    vm.curLotteryList = vm.fixedLottery.lotteryList;
                } else {
                    if (vm.curLotteryType === '-2') {
                        vm.curLotteryList = vm.fixedLottery.lotteryList;
                    } else {
                        vm.curLotteryList = vm.lotteryTypeList[vm.currentIdx].lotteryList;
                    }

                }
            })
        },
    },
    activated () {
        this.exitTime = 0;
        clearInterval(this.timer);
        if (!this.refresh) {
            this.getSwiper()
        }
    },
    deactivated () {
        let vm = this;
        // 检测mySwiper是否加载完
        if (!mySwiper) {
            this.refresh = false;
        }
        vm.timer = setInterval(() => {
            vm.exitTime += 1;
            if (vm.exitTime >= 300) {
                clearInterval(vm.timer);
            }
        }, 1000)
    },
    destroyed () {
        sessionStorage.removeItem('lotteryTypeList')
    },

    created: function () {
        this.init();
    }
}
</script>

<style scoped>
.current-page {
    padding-top: 1.8rem;
}
.lottery .fixed-lottery {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 25%;
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.16);
    background-color: #ec0022;
}
.lottery .swiper-car {
    background-color: #ec0022;
    border-top: 1px solid #fa1c3e;
    position: fixed;
    top: 2.2rem;
    left: 0;
    padding-left: 25%;
    width: 100%;
    height: 1.8rem;
    line-height: 1.8rem;
    text-align: center;
    z-index: 800;
}
.lottery .swiper-car a {
    color: #fff;
    padding: 3px 5px 4px 2px;
    font-size: 13px;
}
.lottery .swiper-car a.current {
    background-color: #a50018;
    border-radius: 10px;
}
.lottery .list li {
    float: left;
    width: 50%;
    padding: 0.3rem 0.5rem;
}
.lottery .list li dl {
    width: 100%;
    min-height: 80px;
    padding: 10px 0.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 9px 1px #ccc;
    display: flex;
    align-items: center;
}
.lottery .list li dl dt {
    width: 14vw;
    min-height: 14vw;
    max-width: 3rem;
    max-height: 3rem;
    margin-right: 2vw;
}
.lottery .list li dl dt img {
    height: 100%;
    width: 100%;
}
.lottery .list li dl dd {
    color: #999;
    font-size: 0.7rem;
    white-space: nowrap;
    overflow: hidden;
    width: 60%;
    flex: 1;
}
.lottery .list li dl dd > h5 {
    overflow: hidden;
    width: 100%;
    display: block;
    color: #333;
    font-size: 0.7rem;
    margin-top: 0.2rem;
}
.lottery .list li dl dd > span {
    font-size: 0.6rem;
    overflow: hidden;
    width: 100%;
    display: block;
}
.router-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 1000;
}
</style>