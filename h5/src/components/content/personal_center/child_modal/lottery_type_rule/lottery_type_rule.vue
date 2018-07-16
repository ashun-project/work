<template>
    <div class="lotteryTypeRule">
        <my-header title="玩法规则">
            <span slot="h-left">
                <i @click="$router.go(-1)" class="iconfont icon-arrowLeft"></i>
            </span>
        </my-header>
        <div class="swiper-container swiper-car">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(lotteryTypeRule,idx) in lotteryTypeRuleList" :key="idx">
                    <a @click="selectType(lotteryTypeRule.lotteryTypeRuleId, idx)" :class="lotteryTypeRule.lotteryTypeRuleId==curLotteryTypeRuleId?'current':''">
                        <span v-text="lotteryTypeRule.name" style="padding:2px;"></span>
                    </a>
                </div>
            </div>
        </div>
        <!--tab end-->
        <div v-for="(lotteryTypeRule,index) in lotteryTypeRuleList" :key="index">
            <section class="aui-content detailed-settings" v-show="lotteryTypeRule.lotteryTypeRuleId==curLotteryTypeRuleId">
                <div v-html="showHtml(lotteryTypeRule.ruleDesc)" style="padding-left: 12px;padding-right: 12px;padding-top: 5px;">

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
            curLotteryTypeRuleId: '',
            currentIdx: 0,
            lotteryTypeRuleList: []
        }
    },
    methods: {
        selectType (lotteryTypeRuleId, idx) {
            this.curLotteryTypeRuleId = lotteryTypeRuleId;
            if (idx) {
                if (idx > this.currentIdx) {
                    mySwiper.slideNext()
                } else {
                    mySwiper.slidePrev()
                }
            }
            this.currentIdx = idx || 0;
        },
        showHtml (html) {
            return html
                .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "\"")
                .replace(/&#39;/g, "\'");
        },
        getSwiper () {
            this.$nextTick(function () {
                mySwiper = new Swiper('.swiper-container', {
                    slidesPerView: 3
                })
            })
        },
    },
    created () {
        this.$http.post('/api/v2/lottery/queryLotteryTypeRuleList', {}, { loading: true, noEncrypt: true }).then(response => {
            if (response.data.code !== 0) return;
            this.lotteryTypeRuleList = response.data.data.lotteryTypeRuleList;
            this.curLotteryTypeRuleId = this.lotteryTypeRuleList[0].lotteryTypeRuleId;

            this.getSwiper();
        })
    }
}
</script>
<style scoped>
.lotteryTypeRule .swiper-car {
    background-color: #ec0022;
    border-top: 1px solid #fa1c3e;
}
.lotteryTypeRule .swiper-container {
    width: 100%;
    height: 1.8rem;
    line-height: 1.8rem;
}
.lotteryTypeRule .swiper-slide {
    color: #fff;
    text-align: center;
}
.lotteryTypeRule .swiper-slide a {
    color: #fff;
    padding: 3px 5px 4px 2px;
    font-size: 13px;
}
.lotteryTypeRule .swiper-slide a.current {
    background-color: #a50018;
    border-radius: 10px;
}

.lotteryTypeRule .red-tab {
    background-color: #ec0022;
    position: fixed;
    top: 45px;
    z-index: 10;
}
</style>
