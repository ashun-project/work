<template>
    <div class="simple-contanier">
        <!-- 六合彩 -->
        <baseLiuhe :currentData="currentData" :currentLottery="currentLottery" :code="code" v-if="code" ref="ballsPage" :period="period" :isSimplePage="true" @on-change-result="changeResult" @on-change-layout="changeLayout"></baseLiuhe>
        <!-- 六合彩 -->
        <!-- 底部模块 -->
        <simpleBottom ref="simpleBottom" :code="code" :period="period" :recordId="recordId" :result="result" :layout="layout" :lotteryPlayId="currentLottery.lotteryPlayId" :lotteryBettingId="currentLottery.lotteryBettingId" :singleLimit="100000" :playName="currentLottery.playName" :moreRates="moreRates"></simpleBottom>
    </div>

</template>

<script>
import baseLiuhe from '../liuhe/liuhe.vue'
import simpleBottom from '../../bottomSImple/bottom.vue'
export default {
    props: {
        currentData: {
            type: Object
        },
        currentLottery: {
            type: Object
        },
        code: {
            type: String
        },
        lotteryId: '',
        period: '',
        recordId: ''
    },
    data () {
        return {
            layout: {},                   // layout      
            result: { num: 0 },             // 选中号码计算的结果
            singleOdds: '',
            moreRates: {},
            maxOdds: 0,                      // 最大赔率
            showMoreTip: false
        }
    },
    components: {
        simpleBottom,
        baseLiuhe
    },
    watch: {

    },
    methods: {
        // 点击投注
        resultDetail () {
            return this.$refs.ballsPage.resultDetail()
        },
        changeResult (result) {
            this.result = result
        },
        changeLayout (layout) {
            let vm = this, maxOdds = 0;
            this.moreRates = {};
            if (layout.rates.length <= 1) {
                maxOdds = this.singleOdds = layout.rates[0].maxOdds;
            } else {
                let max = layout.rates[0].maxOdds;
                this.singleOdds = 0;
                layout.rates.forEach(item => {
                    this.moreRates[item.ball] = item.maxOdds
                    if (item.maxOdds > max) {
                        max = item.maxOdds
                    }
                })
                maxOdds = max;
            }
            this.$refs.simpleBottom.resetWinH()
            this.$refs.simpleBottom.resetAllData(false, layout.costAmount, this.singleOdds);


            this.$emit('get-maxOdd', maxOdds);
            setTimeout(() => {
                /*  if(vm.$refs.playTip.clientHeight > 51){
                     vm.showMoreTip = true
                  }else{
                      vm.showMoreTip = false
                  } */
            })

            this.layout = layout
        },
        // 机选一注
        randomBetting () {
            this.$refs.ballsPage.randomBetting();
        },
        // 清除选中
        clearSelected () {
            this.$refs.ballsPage.clearSelected();
        },
        resetBallList (list, delBall) { // 重置列表。在bottom里面调用
            this.$refs.ballsPage.resetBallList(list, delBall);
        }
    },
}
</script>