<template>
    <div class="lottery-play">
        <my-header title="详细设定" bkUrl="/personalCenter">
        </my-header>
        <div class="swiper-container swiper-car">
            <div class="pagination-car"></div>
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(lotteryType,index) in lotteryTypeList" :key="index">
                    <a @click="selectType(lotteryType.lotteryType, index)" :class="lotteryType.lotteryType==curLotteryType?'current':''">
                        <span v-text="lotteryType.lotteryTypeName"></span>
                    </a>
                </div>
            </div>
        </div>
        <!--tab end-->
        <div v-for="(lotteryTypeTemp,index) in lotteryTypeList" :key="index">
            <section class="warrp" v-show="lotteryTypeTemp.lotteryType==curLotteryType">
                <div class="a-head">
                    <div class="">项目</div>
                    <div class="">单项（号）限额</div>
                    <div class="">单注限额</div>
                </div>
                <div class="a-list" v-for="(lotteryPlay,index) in lotteryTypeTemp.lotteryPlayList" :key="index">
                    <div class="" v-text="lotteryPlay.playName"></div>
                    <div class="" v-text="lotteryPlay.itemLimit"></div>
                    <div class="" v-text="lotteryPlay.singleLimit"></div>
                    <p class="clear"></p>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
var mySwiper;
export default {
    data () {
        return {
            curLotteryType: "",
            currentIdx: "",
            lotteryTypeList: []
        }
    },
    methods: {
        selectType (lotteryType, idx) {
            this.curLotteryType = lotteryType;
            if (idx) {
                if (idx > this.currentIdx) {
                    mySwiper.slideNext()
                } else {
                    mySwiper.slidePrev()
                }
            }
            this.currentIdx = idx || 0;
        },
        getSwiper () {
            this.$nextTick(function () {
                mySwiper = new Swiper('.swiper-container', {
                    slidesPerView: 4
                })
            })
        },
    },
    created () {
        this.$http.post('/api/v2/lottery/queryLotteryPlayList', {}, { loading: true, noEncrypt: true }).then(response => {
            if (response.data.code !== 0) return;
            this.lotteryTypeList = response.data.data.lotteryTypeList;
            this.curLotteryType = this.lotteryTypeList[0].lotteryType;
            this.getSwiper();
        })
    }
}
</script>
<style scoped>
.lottery-play {
    padding-top: 3.8rem;
}
.lottery-play .swiper-car {
    background-color: #ec0022;
    border-top: 1px solid #fa1c3e;
    position: fixed;
    top: 2.2rem;
    width: 100%;
    z-index: 100;
}
.lottery-play .swiper-container {
    width: 100%;
    height: 1.8rem;
    line-height: 1.8rem;
}
.lottery-play .swiper-slide {
    color: #fff;
    text-align: center;
}
.lottery-play .swiper-slide a {
    color: #fff;
    padding: 3px 5px 4px 2px;
    font-size: 13px;
}
.lottery-play .swiper-slide a.current {
    background-color: #a50018;
    border-radius: 10px;
}
.lottery-play .a-head {
    position: fixed;
    top: 4rem;
    width: 100%;
    margin: 0;
    z-index: 100;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.11);
    font-size: 0.6rem;
    background-color: #ffdfd7;
}
.lottery-play .a-head > div,
.lottery-play .a-list > div {
    position: relative;
    float: left;
    padding: 0.5rem 0;
    width: 33.33333333%;
    text-align: center;
    font-size: 0.6rem;
}
</style>
