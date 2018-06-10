<template>
    <div class="result-page">

        <div v-show="!showChase">
            <div class="result-operation" v-if="code != 'pcdd' && code != '6hc'">
                <Button @click="randomBetting(1)">随机一注</Button>
                <Button @click="randomBetting(5)">随机五注</Button>
                <Button @click="goChase()">智能追号</Button>
            </div>
            <div class="result-list">
                <ul>
                    <li v-for="(item, idx) in reslutList" :key="idx">
                        <div class="aui-list-item-title lottery-info">
                            <!-- <span>{{playName}}</span> -->
                            {{item.playName}}
                            <span>
                                <strong>{{item.bettingNum}}</strong>注，共
                                <strong>{{item.bettingMoney}}</strong>元</span>
                        </div>
                        <div class="lotery-number">
                            {{item.lotteryNumber}}
                        </div>
                        <span class="remove" @click="remove(idx)">
                            <i class="iconfont icon-cuowuguanbiquxiao-yuankuang" style="color:#ccc"></i>
                        </span>
                    </li>
                </ul>
            </div>
            <!-- 底部模块 -->
            <div class="result-bottom">
                <div class="result-content">
                    <dl class="aui-row">
                        <dd class="back-color-gray text-center" @click="remove()">
                            <span class="block aui-text-white">清除</span>
                        </dd>
                        <dd class="clo-xs text-center" :class="{balance: this.user.balance}">
                            <span>共{{total.num}}注</span>
                            <span class="text-warning">{{total.money}}元</span>
                            <div v-if="this.user.balance">可用余额
                                <span class="text-warning">{{this.user.balance}}</span>元</div>
                        </dd>
                        <dd class="back-color-danger text-center order-btn" @click="order()">
                            <span class="block aui-text-white">投注</span>
                            <span class="loading" v-show="loading">
                                <span>
                                    <i class="iconfont icon-loading2"></i>
                                </span>
                            </span>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>

        <!-- 追号页 -->
        <chase-num :money="total.money" :period="period" :lotteryNum="total.num" @get-chase-result="getChaseResult" v-if="showChase"></chase-num>
    </div>
</template>

<script>
import chaseNum from './chase_modal.vue'
export default {
    props: {
        currentLottery: {
            type: Object
        },
        balls: {
            type: Array
        },
        code: {
            type: String
        },
        period: {
            type: String
        },
        recordId: {
            type: String
        }
    },
    components: {
        chaseNum
    },
    data () {
        return {
            loading: false,
            showChase: false,
            data: '',                     // 数据
            layout: '',                   // layout布局                
            random: {},                   // 随机数
            reslutList: [],               // 结果列表
            total: {                      // 总金额与总注数  
                money: 0,
                num: 0
            },
            params: {                    // 单注的参数
                bettingMoney: '',
                singleMoney: '',
                bettingNum: 1,
                odds: '',
                rebate: 0,
                lotteryNumber: '',
                company: 1
            }
        }
    },
    watch: {
        // 监听选号类型改变 如果改变重新初始化
        currentLottery: {
            handler (newValue, oldValue) {
                this.init();
            },
            deep: true
        },
        // 监听添加单柱的数据    
        balls: {
            handler (newValue, oldValue) {
                this.addNote(newValue)
            },
            deep: true
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        // 随机添加注数
        randomBetting (num) {
            let balls = [];
            let ball;
            let vm = this;
            getBalls(num);

            function getBalls (len) {
                for (let i = 0; i < len; i++) {
                    // 调用随机注数的共用方法
                    let result = vm.random[vm.data.lotteryPlayId](vm.layout.optballs);
                    let obj = Object.assign({}, vm.params);

                    // 特殊情况处理 因随机的一个号码有可能够成多注会返回一个对象
                    if (typeof result === 'object') {
                        ball = result.ball;
                        obj.bettingNum = result.len;
                        obj.bettingMoney = result.len * obj.bettingMoney;
                    } else {
                        ball = result;
                    }
                    // 处理多赔率情况 目前只有快三--和值会出现
                    if (vm.layout.playType === '2') {
                        let value = vm.layout.rates.filter(value => value.ball === ball);
                        obj.odds = value[0].maxOdds;
                    }
                    obj.lotteryNumber = ball;
                    // TODO 如果要去重复的 注意所有号码为一注的情况
                    balls.push(obj);
                }
            }
            this.addNote(balls);
        },
        // 删除注数
        remove (index) {
            if (index || index === 0) {
                // 删除一注
                this.reslutList.splice(index, 1);
            } else {
                // 删除全部
                this.reslutList = [];
            }
            if (!this.reslutList.length) this.openStatus = false;
            this.getTotal();
        },
        // 添加单注
        addNote (data) {
            data = JSON.parse(JSON.stringify(data));
            data.forEach(item => {
                item.lotteryId = this.$route.params.id;
                item.lotteryPlayId = this.data.lotteryPlayId;
                item.lotteryBettingId = this.data.lotteryBettingId;
                item.playName = this.data.playName;
                this.reslutList.push(item);
            })
            this.getTotal();
        },
        // 计算下单时的总金额与总注数
        getTotal () {
            let money = 0;
            let num = 0;

            // 下面乘除100是为了防止 js浮点数计算的Bug
            this.reslutList.forEach(item => {
                money += item.bettingMoney * 100;
                num += item.bettingNum;
            })
            this.$set(this.total, 'money', money / 100);
            this.$set(this.total, 'num', num);
        },
        order (result) {
            let vm = this;
            if (!this.reslutList.length) {
                this.$Message('请添加单注');
                return;
            }
            if (!this.user.userCode) {
                vm.$router.push('/login');
                /*  this.$Modal.confirm('您还没登录，请登录后参与投注哦！', '提示').then(()=>{
                     vm.$router.push('/login'); 
                 },()=>{}) */
                return;
            }
            // 处理特殊字段 -- 目前只有快三需要处理
            let deal = ['2020101', '2020201', '2040101', '2040202']; // 需要处理的玩法
            let list = JSON.parse(JSON.stringify(this.reslutList)).map(data => {
                if (deal.some(value => value === data.lotteryPlayId)) {
                    let num = data.lotteryNumber.split('|');
                    let type = '|';
                    if (num.length < 2) {
                        num = data.lotteryNumber.split(',');
                        type = ',';
                    };
                    num = num.map(item => {
                        if (item.length > 1) {
                            item = item.substr(0, 1)
                        };
                        return item;
                    })
                    data.lotteryNumber = num.join(type);
                }
                // 处理追号，中奖后停止追号
                if (result && result.autoStop) data.autoStop = 1;
                return data;
            })
            // this.$emit('get-result', {totalMoney: this.total.money, list: list});

            var params = {
                bettingInfoList: list,
                totalMoney: result ? result.totalMoney : this.total.money,
                bettingRecordList: [
                    {
                        lotteryRecordId: this.recordId,
                        periodNo: this.period,
                        num: 1
                    }
                ]
            }

            // 智能追号
            if (result) {
                params.bettingRecordList = [];
                result.list.forEach(value => {
                    params.bettingRecordList.push({
                        lotteryRecordId: value.lotteryRecordId,
                        periodNo: value.periodNo,
                        num: value.odds
                    })
                })
            }
            // 防止重复点击
            if (this.loading) return;
            this.loading = true;
            this.$http.post('/api/v2/lottery/betting', params, { userId: true, loading: 1 }).then(response => {
                this.loading = false;
                if (response.data.code !== 0) return;
                this.showChase = false;
                this.reslutList = [];
                this.$set(this.total, 'money', 0);
                this.$set(this.total, 'num', 0);
                this.$emit('get-lottery-result');
                this.$Message('下注成功');
                this.user.balance = response.data.data;
                localStorage.setItem('user', JSON.stringify(this.user));
                this.$store.commit('getUser', this.user);
            })
        },
        // 追号返回结果
        getChaseResult (result) {
            if (result) {
                this.order(result)
            } else {
                this.showChase = false;
            }
        },
        // 前往智能追号
        goChase () {
            if (!this.reslutList.length) {
                this.$Message('请添加单注')
                return;
            }
            this.showChase = true;
        },
        // 初始化
        init () {
            this.data = JSON.parse(JSON.stringify(this.currentLottery));;
            this.layout = JSON.parse(this.data.layout);
            this.$set(this.params, 'bettingMoney', this.layout.costAmount);
            this.$set(this.params, 'singleMoney', this.layout.costAmount);
            this.$set(this.params, 'odds', this.layout.rates[0].maxOdds);
        }
    },
    created () {
        this.init();
        this.random = require('@/components/common/module_random/' + this.code + '.js');
    }
}
</script>

<style scoped>
.result-page .result-operation {
    background: #eee;
    padding: 0.5rem 2% 0.5rem 0;
    height: 2.6rem;
}
.result-page .result-operation button {
    float: left;
    background: #fff;
    border: 0;
    border-radius: 3px;
    text-align: center;
    height: 1.6rem;
    width: 31.33%;
    margin-left: 2%;
}
.result-page .result-list li {
    padding: 0.5rem;
    background: #fff;
    position: relative;
    border-bottom: 1px solid #eee;
}
.result-page .lotery-number {
    word-wrap: break-word;
    padding-right: 0.9rem;
}
.result-page .result-list {
    font-size: 0.7rem;
}
.result-page .result-list .lottery-info span {
    color: #666;
}
.result-page .result-list .lottery-info strong {
    color: #ec0022;
}
/* .result-page .result-list  */
.result-page .result-list li .remove {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translate(0, -50%);
}
.result-page .result-content {
    background: #2a2d32;
    width: 100%;
    line-height: 2.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 200;
    color: #fff;
    font-size: 0.66rem;
}
.result-page .result-content .text-center {
    float: left;
    text-align: center;
    width: 25%;
}
.result-page .result-content .clo-xs {
    width: 50%;
}
.result-page .result-content .balance {
    line-height: 1rem;
    padding-top: 0.2rem;
}
/* .result-page .result-content .balance .font-red{
        color: #ec0022;
    } */
.result-page .result-content .back-color-gray {
    background: #444;
}
.result-page .result-content .back-color-danger {
    background-color: rgb(241, 23, 23);
}
.result-page .result-content .text-warning {
    color: #ffc107;
}
.result-page .result-bottom .order-btn {
    position: relative;
}
.result-page .result-bottom .order-btn .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background: rgba(243, 245, 248, 0.39);
    overflow: hidden;
}
.result-page .result-bottom .order-btn .loading span {
    display: inline-block;
    color: #444;
    -webkit-animation: circle 1s infinite linear;
}
@keyframes circle {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>

