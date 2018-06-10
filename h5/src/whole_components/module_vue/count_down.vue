<template>
    <div>
        <span>{{timeTxt}}</span>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String
        },
        data: {
            type: Object
        },
        routeName: {
            type: String
        },
        historyList: {
            type: Boolean
        }
    },
    data () {
        return {
            totalRecordList: [],
            timer: null,
            surplusTime: 0,
            timeTxt: '00:00:00',
            downNum: 0
        }
    },
    methods: {
        getData () {
            // 防止组件注销掉之后会出现个别timeinterval没有清除掉
            if (this.routeName !== this.$route.name) {
                if (this.timer) clearInterval(this.timer)
                return
            }
            let vm = this
            let url = '/api/v2/lottery/queryLotteryRecordList'
            if (this.historyList)
                url = '/api/v2/lottery/queryLotteryRecordListV2'
            vm.$http
                .post(url, { lotteryId: this.id, num: 1 })
                .then(response => {
                    if (response.data.code !== 0) {
                        vm.getData()
                        return
                    }
                    let info = response.data
                    vm.totalRecordList = info.data.recordList[0]
                    vm.downNum = 0
                    if (vm.historyList) {
                        vm.$emit('get-period', {
                            current: vm.totalRecordList,
                            history: info.data.prizeHistoryList
                        })
                    } else {
                        vm.$emit('get-period', vm.totalRecordList)
                    }
                    if (vm.totalRecordList) {
                        if (vm.timer) clearInterval(vm.timer)
                        vm.setFirstTime()
                    }
                })
        },
        setFirstTime () {
            let vm = this
            let startTime = vm.totalRecordList.sysDate
            vm.surplusTime = vm.totalRecordList.endTime - startTime

            // 得到计算结果
            this.countDown()

            this.timer = setInterval(function () {
                vm.surplusTime = vm.surplusTime - 1000
                vm.downNum++
                // (vm.id === 17 && vm.downNum >= 10) 判断如果是六合彩就一个小时发一次请求
                if (
                    vm.surplusTime <= 0 ||
                    (parseInt(vm.id) === 17 && vm.downNum >= 3600)
                ) {
                    clearInterval(vm.timer)
                    // 停留5秒为开奖时间
                    this.timeTxt = '开奖中...'
                    setTimeout(vm.getData, 1000)
                } else {
                    vm.countDown()
                }
            }, 1000)
        },
        //  倒计时结束
        countDown () {
            let vm = this
            let obj = {}
            let days = Math.floor(vm.surplusTime / (24 * 3600 * 1000))
            //计算出小时数
            let leave1 = vm.surplusTime % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
            obj.hours = Math.floor(leave1 / (3600 * 1000)) + days * 24
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
            obj.minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
            obj.seconds = Math.round(leave3 / 1000)

                ;['hours', 'minutes', 'seconds'].forEach(item => {
                    if (obj[item] < 10) obj[item] = '0' + obj[item]
                })
            this.timeTxt = obj.hours + ':' + obj.minutes + ':' + obj.seconds
        }
    },
    created () {
        let date = new Date().getTime()
        if (this.data && date < this.data.nextPrizeTime) {
            this.totalRecordList = Object.assign({}, this.data)
            this.totalRecordList.endTime = this.data.nextPrizeTime
            this.totalRecordList.sysDate = date
            this.setFirstTime()
        } else {
            this.getData()
        }
    },
    beforeDestroy () {
        let vm = this
        if (vm.timer) clearInterval(vm.timer)
    }
}
</script>
