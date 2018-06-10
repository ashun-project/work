<template>
    <div class="pcdd-num">
        <div class="num-list">
            <ul>
                <li v-for="(item, itemIdx) in ballList" :key="itemIdx" @click="chooseBall(item, itemIdx)">
                    <div :class="{selected: item.selected}" v-if="userExist">
                        <span>{{item.ball}}</span><br/>
                        <span class="red-font">赔率：{{item.maxOdds}}</span>
                    </div>
                    <div :class="{selected: item.selected}" v-else style="line-height:48px;">
                        <span>{{item.ball}}</span><br/>
                    </div>
                </li>
            </ul>
            <div class="clr"></div>
        </div>

        <!-- 记录注数 -->
        <div class="record-no-use" v-show="result.num"></div>
        <div class="record" v-show="result.num">
            <span>{{result.num}}</span>注
            <span>&nbsp;{{result.num * singleMongey}}</span>元
        </div>
        <!-- 底部模块 -->
        <div class="result-page">
            <div class="result-content">
                <dl class="aui-row">
                    <dd class="back-color-gray text-center" @click="clearSelected()" v-if="result.num">
                        <span class="block aui-text-white">清除</span>
                    </dd>
                    <dd class="back-color-gray text-center" @click="randomBetting()" v-else>
                        <span class="block aui-text-white">机选</span>
                    </dd>

                    <dd class="text-center along-bance">
                        <div>
                            <span>单注</span>
                            <!-- <span></span> -->
                            <input type="number" v-model="singleMongey" name="" @blur="inputChage(2)" @input="inputChage()">
                            <span>元</span>
                        </div>
                    </dd>
                    <dd class="back-danger t-c text-center" @click="resultDetail()">
                        <span class="block aui-text-white">确定</span>
                    </dd>
                </dl>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    props: {
        currentLottery: {
            type: Object
        },
        code: {
            type: String
        }
    },
    data () {
        return {
            data: {},                     // 数据
            random: '',                   // 机选
            layout: '',                   // layout                   
            ballList: [],                 // 选号列表
            singleMongey: 0,              // 单注金额 
            result: { num: 0 },             // 选中号码计算的结果
            computeNote: '',              // 计算注数,
            selsectedList: [],            // 选中的列表,
            lotteryType: 1                // 玩法类型， 主要区分是一个号码一注还是多个号码一注
        }
    },
    watch: {
        // 监听选号类型改变 如果改变重新初始化
        currentLottery: {
            handler (newValue, oldValue) {
                this.init();
            },
            deep: true
        }
    },
    computed: {
        userExist () {
            return this.$store.state.user.userCode
        }
    },
    methods: {
        // 输入框改变
        inputChage (num) {
            let money = parseInt(this.singleMongey) || '';
            let singleMongey = parseInt(this.data.singleLimit);
            // 输入框失去焦点时
            if (!money && num) {
                money = num;
            }
            if (money > singleMongey) {
                money = singleMongey
            }
            this.singleMongey = money;
        },
        // 点击投注
        resultDetail () {
            if (!this.userExist) {
                this.$router.push('/login')
                return
            }
            if (this.result.num < 1) {
                this.$Message('请添加单柱');
                return;
            }
            let costAmount = parseInt(this.singleMongey);
            let data = [];
            let balls = [];
            this.selsectedList.forEach(item => {
                data.push({
                    bettingMoney: costAmount,
                    bettingNum: 1,
                    odds: item.maxOdds,
                    rebate: 0,
                    lotteryNumber: item.ball
                });
                balls.push(item.ball)
            })
            if (this.lotteryType === 1) {
                data[0].lotteryNumber = balls.join(',');
                data = [data[0]];
            }
            this.$emit('get-balls-result', JSON.parse(JSON.stringify(data)));
            this.clearSelected();
        },
        // 机选一注
        randomBetting () {
            this.clearSelected()
            let list = [];
            let result = this.random[this.data.lotteryPlayId](this.layout.optballs);
            let len = this.ballList.length;
            list = result.split(',');
            for (var i = 0; i < len; i++) {
                if (list.some(vvv => vvv === this.ballList[i].ball)) {
                    this.selsectedList.push(this.ballList[i])
                    this.$set(this.ballList[i], 'selected', true);
                }
            }
            let num = this.computeNote[this.data.lotteryPlayId](result);
            this.$set(this.result, 'num', num);
            // this.computeLottery(result);
        },
        // 清除选中
        clearSelected () {
            let len = this.ballList.length;
            for (let i = 0; i < len; i++) {
                this.$set(this.ballList[i], 'selected', false);
            }
            this.selsectedList = [];
            this.result = { num: 0 };
            this.singleMongey = this.layout.costAmount;
        },
        // 选择球号
        chooseBall (item, idx) {
            let vm = this;
            if (!item.selected) {
                this.selsectedList.push(item)
            } else {
                this.selsectedList = this.selsectedList.filter(value => value.ball !== item.ball);
            }
            let balls = this.selsectedList.map(value => value.ball);
            // let num = this.computeLottery(balls.join(','));
            let num = this.computeNote[this.data.lotteryPlayId](balls.join(','));
            if (num < 0) {
                this.$Message('最多只能选' + Math.abs(num) + '注');
                this.selsectedList.splice(Math.abs(num), 1); // 去除之前添加的
                return;
            }
            this.$set(this.result, 'num', num);
            this.$set(this.ballList[idx], 'selected', !item.selected);
        },
        // 初始化
        init () {
            this.selsectedList = [];
            this.result = { num: 0 };
            this.data = JSON.parse(JSON.stringify(this.currentLottery));
            this.layout = JSON.parse(this.data.layout);
            this.lotteryType = this.layout.rates.length;
            this.singleMongey = this.layout.costAmount;
            let vm = this;
            let spt = this.layout.layout[0].balls.split('|');
            let arr = [];
            spt.forEach(item => {
                if (vm.layout.rates.length === 1) {
                    let obj = Object.assign({}, vm.layout.rates[0]);
                    obj.ball = item;
                    arr.push(obj);
                } else {
                    arr.push(vm.layout.rates.filter(value => item === value.ball)[0]);
                }
            })
            this.ballList = arr;
        }
    },
    created () {
        this.init();
        this.computeNote = require(`@/components/common/betting_amount/${this.code}.js`);
        this.random = require(`@/components/common/module_random/${this.code}.js`);
    }
}
</script>

<style scoped>
.pcdd-num {
    /* background: #f8f8f9; */
}
/* .pcdd-num .num-list{
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        overflow-y: auto;
        padding-top: 6rem;  
    } */
.pcdd-num .record {
    font-size: 0.8rem;
    text-align: center;
    width: 100%;
    height: 1.3rem;
    line-height: 1.3rem;
    background: #f2f2f2;
    position: fixed;
    bottom: 2.5rem;
    left: 0;
}
.pcdd-num .num-list li {
    float: left;
    width: 33.33%;
    padding: 0.3rem;
}
.pcdd-num .num-list li > div {
    background: #fff;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.11);
    text-align: center;
    padding: 0.5rem 0;
    border-radius: 3px;
}
.pcdd-num .num-list li > div.selected {
    background-color: rgb(241, 23, 23);
    color: #fff;
}
.pcdd-num .num-list li > div .red-font {
    font-size: 0.7rem;
    color: #ec0022;
}
.pcdd-num .num-list li > div.selected .red-font {
    color: #fff;
}
.pcdd-num .result-page {
    width: 100%;
    height: 2.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 200;
}
.pcdd-num .result-page .result-content {
    background: #2a2d32;
    width: 100%;
    height: 100%;
    line-height: 2.5rem;
    color: #fff;
    font-size: 0.66rem;
}
.pcdd-num .result-page .result-content .back-color-gray {
    background-color: #444;
}
.pcdd-num .result-page .result-content .text-center {
    text-align: center;
    float: left;
    width: 25%;
}
.pcdd-num .result-page .result-content .back-danger {
    background-color: rgb(241, 23, 23);
}
.pcdd-num .result-page .result-content .text-center.along-bance {
    display: flex;
    align-content: center;
    justify-content: space-around;
    width: 50%;
}
.pcdd-num .along-bance input {
    width: 45%;
    background: #fff;
    border-radius: 3px;
    height: 1.4rem;
    display: inline-block;
    text-align: center;
    caret-color: #ec0022; /* 光标颜色 */
    color: #ec0022;
}
.pcdd-num .record-no-use {
    height: 1.3rem;
}
</style>

