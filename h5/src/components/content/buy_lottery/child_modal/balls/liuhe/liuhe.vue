<template>
    <div class="liuhe-num">
        <div class="num-list" v-for="(list, listIdx) in ballList" :key="listIdx">
            <h6 class="title">
                <span class="name">{{list.name}}</span>
                <span class="tips" v-if="layout.tips">
                    <span class="iconfont icon-prompt_fill"></span>{{layout.tips}}</span>
            </h6>
            <ul class="all-balls">
                <li v-for="(item, idx) in list.list" :key="idx" @click="chooseBall(item, idx, list, listIdx)">

                    <div :class="{selected: item.selected}" v-if="userExist">
                        <span class="num">{{item.ball}}</span><br/>
                        <span class="red-font">赔率：{{item.maxOdds}}</span>
                        <!-- <span class="red-font" v-else style="opacity:0">登录</span> -->
                        <span v-if="item.slfeBalls"><br/>
                            <i v-for="(value, key) in item.slfeBalls" :key="key">{{value}}</i>
                        </span>
                    </div>
                    <div :class="{selected: item.selected}" style="line-height:48px;" v-else>
                        <span class="num">{{item.ball}}</span><br/>

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
        <div class="result-page" v-show="!isSimplePage">
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
import formatData from './format_data.js'
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
        isSimplePage: false
    },
    data () {
        return {
            data: {},                     // 数据
            random: '',                   // 机选
            computeNote: '',              // 计算注数,
            layout: '',                   // layout      
            singleMongey: 0,              // 单注金额  
            ballList: [],                 // 选号列表
            result: { num: 0 },             // 选中号码计算的结果
            selsectedList: [],            // 选中的列表,
            lotteryType: '',              // 玩法类型， 主要区分是一个号码一注还是多个号码一注
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
        // 返利
        getRates (ball) {
            let item = [];
            if (this.layout.rates.length === 1) {
                item = this.layout.rates[0];
            } else {
                item = this.layout.rates.filter(vvv => ball === vvv.ball)[0];
            }
            if (item.rebate) {
                return item.rebate * 100;
            } else {
                return 0;
            }
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
            let vm = this;
            let costAmount = parseInt(this.singleMongey);
            let data = [];
            let odds = 1;
            let max, min = 0; // 获取最大的值 // 获取最小的值
            this.selsectedList.forEach(item => {
                item.forEach(value => {
                    data.push({
                        bettingMoney: costAmount,
                        bettingNum: 1,
                        odds: value.maxOdds,
                        rebate: vm.getRates(value.ball),
                        lotteryNumber: value.ball
                    });
                    if (!max) {
                        max = value.maxOdds;
                        min = value.maxOdds;
                    }
                    if (value.maxOdds < min) {
                        min = value.maxOdds;
                    }
                    if (value.maxOdds > max) {
                        max = value.maxOdds;
                    }
                    odds = odds * value.maxOdds;
                })
            })
            if (this.lotteryType === 1) {
                data[0].lotteryNumber = this.result.balls;
                data[0].bettingNum = this.result.num;
                data[0].bettingMoney = costAmount * this.result.num;
                if (this.currentData.lotteryPlayId === '706') {
                    data[0].odds = odds.toFixed(2);
                }
                if (this.currentData.lotteryPlayId === '708' || this.currentData.lotteryPlayId === '709') {
                    data[0].odds = max + ',' + min;
                }
                if (this.data.lotteryPlayId === '7070301' || this.data.lotteryPlayId === '7070501') {
                    data[0].odds = this.selsectedList[0][0].maxOdds + ',' + this.selsectedList[0][0].minOdds;
                }
                data = [data[0]];
            }
            if (!this.isSimplePage) {
                this.$emit('get-balls-result', JSON.parse(JSON.stringify(data)));
                this.clearSelected();
            }
            // 其他页面需要用到这个结果
            return data

        },
        // 机选一注
        randomBetting () {
            this.clearSelected()
            let result = this.random[this.data.lotteryPlayId](this.layout.optballs, this.data.lotteryPlayId);
            let len = this.ballList.length;
            let list = [];
            let balls = [];
            result.split('|').forEach(item => {
                list.push(item.split(','))
            });
            for (var i = 0; i < len; i++) {
                let arr = [];
                let copylist = JSON.parse(JSON.stringify(this.ballList[i].list));
                for (var j = 0; j < this.ballList[i].list.length; j++) {
                    if (list[i].some(vvv => vvv === this.ballList[i].list[j].ball)) {
                        arr.push(this.ballList[i].list[j]);
                        copylist[j].selected = true;
                    } else {
                        copylist[j].selected = false;
                    }
                    this.$set(this.ballList[i], 'list', copylist);
                }
                this.selsectedList.push(arr)
            }
            this.selsectedList.forEach(value => {
                let arr = value.map(vvv => vvv.ball);
                balls.push(arr.join(','));
            });
            let num = this.computeNote[this.data.lotteryPlayId](balls.join('|'), this.data.lotteryPlayId);
            this.$set(this.result, 'num', num);
            this.$set(this.result, 'balls', balls.join('|'));
            this.$emit('on-change-result', this.result)
        },
        // 清除选中
        clearSelected () {
            let len = this.ballList.length;
            for (let i = 0; i < len; i++) {
                let copylist = JSON.parse(JSON.stringify(this.ballList[i].list));
                for (let j = 0; j < copylist.length; j++) {
                    copylist[j].selected = false;
                    this.$set(this.ballList[i], 'list', copylist);
                }
            }
            this.selsectedList = [];
            this.result = { num: 0 };
            this.singleMongey = this.layout.costAmount;
            this.$emit('on-change-result', this.result)
        },
        // 选择球号
        chooseBall (item, idx, list, listIdx) {
            let vm = this;
            this.selsectedList = [];
            this.ballList.forEach((value, valueIdx) => {
                let arr = []
                value.list.forEach(vvv => {
                    /*! 当前行只能选择一个球， 去掉当前选项其他选中的球.
                    * !data.muti字段 当前选项不能重复
                    * value.ball !== vv.ball 字段 只处理不是当前选中的球
                    * itemIdx === dataIdx 字段 只处理当前的选项
                    */
                    if (!value.muti && vvv.ball !== item.ball && listIdx === valueIdx) {
                        vvv.selected = false;
                    }
                    if (vvv.selected) {
                        arr.push(vvv)
                    };
                });
                vm.selsectedList.push(arr);
            })
            if (!item.selected) {
                this.selsectedList[listIdx].push(item)
            } else {
                this.selsectedList[listIdx] = this.selsectedList[listIdx].filter(value => value.ball !== item.ball);
            }
            let balls = [];
            this.selsectedList.forEach(value => {
                let arr = value.map(vvv => vvv.ball);
                balls.push(arr.join(','));
            });
            let num = this.computeNote[this.data.lotteryPlayId](balls.join('|'), this.data.lotteryPlayId);
            if (num < 0) {
                this.$Message('最多只能选' + Math.abs(num) + '个');
                this.selsectedList[listIdx].splice(Math.abs(num), 1); // 去除之前添加的
                return;
            }
            let copylist = JSON.parse(JSON.stringify(this.ballList[listIdx].list));
            copylist[idx].selected = !item.selected;
            this.$set(this.ballList[listIdx], 'list', copylist);
            this.$set(this.result, 'num', num);
            this.$set(this.result, 'balls', balls.join('|'));

            this.$emit('on-change-result', this.result)
        },
        resetBallList (list, delBall, index) { // 重置列表。在bottom里面调用
            if (list.length <= 0) {
                this.ballList.forEach(item => {
                    item.list.forEach(ball => {
                        ball.selected = false
                    })
                })

                this.result.num = 0;
                this.result.balls = '';
                this.result.odds = null;
                this.selsectedList = [];
            } else {
                let lotteryNumber = '', odds = [], selectList = this.selsectedList[0];
                this.ballList.forEach(item => {
                    item.list.forEach(ball => {
                        if (delBall === ball.ball) {
                            ball.selected = false
                        }
                    })
                })
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    lotteryNumber += item.lotteryNumber;
                    odds.push(item.lotteryNumber);
                    if (i < list.length - 1) {
                        lotteryNumber += ','
                    }
                }

                for (let i = 0; i < selectList.length; i++) {
                    let item = selectList[i];
                    if (item.ball === delBall) {
                        selectList.splice(i, 1);
                    }
                }
                this.result.num = list.length;
                this.result.balls = lotteryNumber;
                this.result.odds = odds;
            }
        },
        // 初始化
        init () {
            let vm = this;
            let id = vm.currentData.lotteryPlayId;
            this.lotteryType = '';
            this.selsectedList = [];
            this.result = { num: 0 };
            this.data = JSON.parse(JSON.stringify(this.currentLottery));
            this.layout = JSON.parse(this.data.layout);
            this.singleMongey = this.layout.costAmount;
            this.layout.layout.forEach(item => {
                let arr = [];
                item.balls.split('|').forEach(value => {
                    // 添加对应的号码
                    let slfeBalls;
                    let obj;
                    if (id === '709') {
                        slfeBalls = formatData.mant(value);
                    } else if (id === '7011' || id === '7012' || id === '708') {
                        slfeBalls = formatData.zodica(value, id);
                    }
                    if (vm.layout.rates.length === 1) {
                        obj = Object.assign({}, vm.layout.rates[0]);
                    } else {
                        obj = Object.assign({}, vm.layout.rates.filter(vvv => value === vvv.ball)[0])
                    }
                    if (slfeBalls) {
                        obj.slfeBalls = slfeBalls.data;
                    }
                    obj.ball = value;
                    arr.push(obj);
                });
                item.list = arr;
            });
            this.ballList = JSON.parse(JSON.stringify(this.layout.layout));
            let idArr = ['706', '707', '708', '709', '7010', '7012', '7016'];
            if (idArr.some(value => value === this.currentData.lotteryPlayId)) {
                this.lotteryType = 1;
            };

            if (this.isSimplePage) {
                this.$emit('on-change-layout', this.layout)
            }
        }
    },
    mounted () {
        this.init();
        this.computeNote = require(`@/components/common/betting_amount/${this.code}.js`);
        this.random = require(`@/components/common/module_random/${this.code}.js`);
    }
}
</script>

<style scoped>
.liuhe-num {
    /* background: #f8f8f9; */
}
.liuhe-num .num-list li {
    float: left;
    width: 33.33%;
    padding: 0.3rem;
}
.liuhe-num .record {
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
.num-list .title {
    padding: 0.2rem 0.3rem 0;
    line-height: 1.5rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.num-list .title .name {
    flex: 1;
}

.num-list .title .iconfont {
    font-size: 1rem;
    vertical-align: middle;
}
.num-list .title .tips {
    color: #ec0022;
}
.liuhe-num .num-list li > div {
    background: #fff;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.11);
    text-align: center;
    padding: 0.5rem 0;
    border-radius: 3px;
}
.liuhe-num .num-list li > div.selected {
    background-color: rgb(241, 23, 23);
    color: #fff;
}
.liuhe-num .num-list li > div .red-font {
    font-size: 0.7rem;
    color: rgb(241, 23, 23);
}
.liuhe-num .num-list li > div.selected .red-font {
    color: #fff;
}
.liuhe-num .num-list li > div span i {
    display: inline-block;
    padding: 0 0.05rem;
}
.liuhe-num .result-page {
    width: 100%;
    height: 2.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 200;
}
.liuhe-num .result-page .result-content {
    background: #2a2d32;
    width: 100%;
    height: 100%;
    line-height: 2.5rem;
    color: #fff;
    font-size: 0.66rem;
}
.liuhe-num .result-page .result-content .back-color-gray {
    background-color: #444;
}
.liuhe-num .result-page .result-content .text-center {
    text-align: center;
    float: left;
    width: 25%;
}
.liuhe-num .result-page .result-content .back-danger {
    background-color: rgb(241, 23, 23);
}
.liuhe-num .result-page .result-content .text-center.along-bance {
    display: flex;
    align-content: center;
    justify-content: space-around;
    width: 50%;
}
.liuhe-num .along-bance input {
    width: 45%;
    background: #fff;
    border-radius: 3px;
    height: 1.4rem;
    display: inline-block;
    text-align: center;
    caret-color: #ec0022; /* 光标颜色 */
    color: #ec0022;
}
.liuhe-num .record-no-use {
    height: 1.3rem;
}
</style>

