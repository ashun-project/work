<template>
    <div class="result-page">
        <div class="lf result-list">
            <Table :columns="columns" :loading="loading" :data="reslutList" no-data-text="暂无单注" height="200" stripe></Table>
            <div class="totale-num">
                <div class="lf txt-title" v-if="reslutList.length">
                    <div class="red-font">
                        <span>我要追号&nbsp;&nbsp;</span>
                        <i-switch v-model="openStatus" @on-change="setSwitchStatus"></i-switch>
                    </div>
                    <!-- <a v-if="openStatus" @click="showChaseDatail()">追号详情</a> -->
                    <div class="detail" @click="showChaseDatail()" v-if="openStatus">
                        <span>
                            <Icon type="plus-round" size="12"></Icon>
                        </span>
                        追号详情
                    </div>
                </div>
                <span v-show="total.num">总注数：
                    <strong class="red-font" v-if="chaseResult.length">{{chaseResult.length * total.num}}</strong>
                    <strong class="red-font" v-else>{{total.num}}</strong>
                </span>
                <span v-show="total.num">总金额：
                    <!-- <strong class="red-font">{{((total.money * 100) + (chaseMoney * 100)) / 100}}</strong> -->
                    <strong class="red-font" v-if="chaseResult.length">{{Number(chaseMoney).toFixed(2)}}</strong>
                    <strong class="red-font" v-else>{{Number(total.money).toFixed(2)}}</strong>
                </span>
            </div>
        </div>
        <div class="rf result-operation">
            <div @click="randomBetting(1)">
                <span>
                    <i>1</i>&nbsp;&nbsp;随机一注</span>
            </div>
            <div @click="randomBetting(5)">
                <span>
                    <i>5</i>&nbsp;&nbsp;随机五注</span>
            </div>
            <div @click="remove()" class="remove">
                <span>
                    <Icon type="trash-a"></Icon>&nbsp;&nbsp;全部删除</span>
            </div>
            <div class="order" @click="order()">
                <span>
                    <Icon type="android-done"></Icon>&nbsp;&nbsp;确认投注</span>
            </div>
            <!-- <Button type = "primary" class = "betting" icon = "android-done" shape = "circle" @click="order()">确认投注</Button> -->
        </div>
        <div class="clr"></div>
        <!-- 追号页 -->
        <chase-num :money="total.money" @get-chase-result="getChaseResult" :status="chaseDetail" v-if="openStatus"></chase-num>
        <!-- 追号期数改变弹框 -->
        <modal :modalShow="showChaseModal" :width="452" :hasFooter="true" :hasNoBtn="false" claName="period-modal" @btn-cancel="showChaseModal = false" @btn-ok="showChaseModal = false;openStatus = true;chaseDetail = true;">
            <div slot="content">
                <p class="title">期数提示</p>
                <div class="content">
                    <Icon type="information-circled"></Icon>
                    <span>期数已发生改变，请重新选择追号!</span>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import chaseNum from './chase_num.vue';
import modal from '@/components/common/module_vue/modal.vue';
export default {
    props: {
        currentLottery: {
            type: Object
        },
        list: {
            type: Array
        },
        status: {
            type: Object
        },
        refresh: {
            type: String
        },
        closeLoading: {
            type: String
        }
        // bettingTime: { //开始投注时间
        //     type: Object,
        //     default: {}
        // }
    },
    components: {
        chaseNum,
        modal
    },
    computed: {
        // beginBettingTime(){
        //     console.log(this.bettingTime);
        //     return this.bettingTime ;
        // },
        periodNo () { //获取当前期号
            //  console.log(2);
            // console.log(this.$store.state.preiodInfo);
            return this.$store.state.preiodInfo.periodNo;
        },
        preiodInfo () {
            return this.$store.state.preiodInfo;
        },
        currentLotterys () {
            return JSON.parse(JSON.stringify(this.currentLottery));
        },
        user () {
            return this.$store.state.user;
        }
    },
    data () {
        return {
            showChaseModal: false,          // 追号提示弹框
            hasClick: false,                //判断多次空投不再提示
            timer: 0,                      //计时器对象
            countDown: 0,                //倒计时
            loading: false,
            autoStop: '0',                // 中奖后是否停止追号  
            openStatus: false,            // 追期开关
            chaseResult: [],              // 追号结果
            chaseMoney: 0,                // 追号总金额
            chaseDetail: false,           // 显示追号详情                       
            data: '',                     // 数据              
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
            },
            columns: [                    // table数据
                {
                    title: '号码',
                    width: 100,
                    key: 'lotteryNumber'
                },
                {
                    title: '注数',
                    width: 100,
                    key: 'bettingNum'
                },
                {
                    title: '单注金额',
                    width: 100,
                    key: 'singleMoney',
                    render: (h, params) => {
                        return h('span', Number(params.row.singleMoney).toFixed(2))
                    }
                },
                {
                    title: '单位',
                    width: 100,
                    key: 'company',
                    render: (h, params) => {
                        let txt;
                        if (params.row.company === 1) {
                            txt = '元'
                        } else if (params.row.company === 10) {
                            txt = '角'
                        } else {
                            txt = '分'
                        }
                        return h('span', txt);
                    }
                },
                {
                    title: '返利',
                    width: 100,
                    key: 'rebate',
                    render: (h, params) => {
                        return h('span', params.row.rebate + '%');
                    }
                },
                {
                    title: '追号',
                    width: 100,
                    key: 'chase'
                },
                {
                    title: '金额',
                    key: 'bettingMoney',
                    width: 100,
                    render: (h, params) => {
                        // console.log(this.chaseResult);
                        let chaseNum = this.chaseResult.length || 1;
                        return h('span', (Number(params.row.bettingMoney) * chaseNum).toFixed(2))
                    }
                },
                {
                    title: '删除',
                    width: 100,
                    key: 'action',
                    render: (h, params) => {
                        return h('div', {
                            on: {
                                click: () => {
                                    this.remove(params.index);
                                }
                            },
                            style: {
                                cursor: 'pointer'
                            }
                        }, [
                                h('Icon', {
                                    props: {
                                        type: 'trash-a',
                                        size: '18',
                                        color: '#be1204'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index);
                                        }
                                    }
                                })
                            ])
                    }

                }
            ]
        }
    },
    watch: {
        periodNo () {
            if (this.openStatus) {
                this.showChaseModal = true;
            }
        },
        // 监听选号类型改变 如果改变重新初始化
        currentLottery: {
            handler (newValue, oldValue) {
                this.data = newValue;
                this.hasClick = false;
                this.reslutList = [];
                this.total.num = 0;
                this.total.money = 0;
                this.chaseResult = [];
                this.init();
            },
            deep: true
        },
        // 监听添加单柱的数据    
        list: {
            handler (newValue, oldValue) {
                if (!this.reslutList.length && this.openStatus) { // 6.17
                    this.openStatus = false;
                }
                // console.log(newValue);
                this.addNote(newValue)
            },
            deep: true
        },
        // 监听金额，赔率，返利发生变化
        status: {
            handler (newValue, oldValue) {
                this.$set(this.params, 'singleMoney', newValue.singleMoney ? newValue.singleMoney : 2);
                this.$set(this.params, 'company', newValue.company);
                this.$set(this.params, 'odds', newValue.odds);
                this.$set(this.params, 'rebate', newValue.rebate);
                this.$set(this.params, 'bettingMoney', this.params.singleMoney / newValue.company);
            },
            deep: true
        },
        refresh (n, o) {
            this.reslutList = [];
            this.openStatus = false;
            this.loading = false;
            this.getTotal();
        },
        closeLoading (n, o) {
            this.loading = false;
        }
    },
    methods: {
        // 随机添加注数
        randomBetting (num) {
            if (!this.reslutList.length) this.openStatus = false; //6.17
            if (this.user && !this.user.userId) {
                this.$store.commit('getShouldLogin', true);
                return;
            }
            if (this.diffTime < 0) {
                this.$Modal.warning({
                    title: '投注提示',
                    content: '当前期数未开始'
                });
                return;
            }
            let balls = [];
            let ball;
            let vm = this;
            // let layout = JSON.parse(vm.data.layout); //4.25
            let layout = vm.data.layout;
            getBalls(num);

            function getBalls (len) {
                for (let i = 0; i < len; i++) {
                    // 调用随机注数的共用方法
                    // console.log(vm.data);
                    let result = vm.random[vm.data.lotteryPlayId](layout.optballs);
                    // console.log(typeof result);//0,2 时时彩后三组选 - 
                    let obj = Object.assign({}, vm.params);
                    // console.log(obj);
                    // 特殊情况处理 因随机的一个号码有可能够成多注所有会返回一个对象
                    if (typeof result === 'object') {
                        ball = result.ball;
                        obj.bettingNum = result.len;
                        obj.bettingMoney = result.len * obj.singleMoney / obj.company;
                        // result.isBettingMoney === false ? obj.bettingMoney = result.len*vm.data.layout.costAmount : ''
                    } else {
                        ball = result;
                    }
                    // 处理多赔率情况 目前只有快三--和值会出现
                    // if (layout.playType === '2') { // 5.5
                    //     let value = layout.rates.filter(value => value.ball === ball);
                    //     obj.odds = value[0].maxOdds;
                    // }
                    if (layout.rates.length > 1) { // 处理多赔率5.5 
                        let value = layout.rates.filter(value => value.ball === ball);
                        obj.odds = value[0].maxOdds;
                    }
                    obj.lotteryNumber = ball;
                    // TODO 如果要去重复的 注意所有号码为一注的情况
                    balls.push(obj);
                }
            }
            // console.log(balls);
            this.addNote(balls, true);
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
            let order = this.$route.params.order;
            data.forEach(item => {
                item.lotteryId = this.$route.params.id;
                item.lotteryPlayId = this.data.lotteryPlayId || order.lotteryPlayId;
                item.lotteryBettingId = this.data.lotteryBettingId || order.lotteryBettingId;
                item.chase = this.chaseResult.length ? this.chaseResult.length : '无';
                item.autoStop = this.autoStop;
                this.reslutList.push(item);
            })
            // console.log(this.reslutList);
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
            this.$set(this.total, 'money', Number((money / 100).toFixed(2)));
            this.$set(this.total, 'num', num);

            // 处理追号
            let chaseMoney = 0;
            if (!this.reslutList.length) this.chaseResult = [];
            if (this.chaseResult.length) {
                this.chaseResult.forEach(item => {
                    chaseMoney += item.odds * this.total.money;
                });
                // num *= this.chaseResult.lenght;

            }
            this.chaseMoney = chaseMoney.toFixed(2);
        },
        // 显示追号列表详情
        showChaseDatail () {
            this.chaseDetail = !this.chaseDetail;
        },
        order () {
            if (!this.user.userId) {
                this.$store.commit('getShouldLogin', true);
                return
            }
            if (parseInt(this.preiodInfo.sysDate) + this.countDown * 1000 < parseInt(this.preiodInfo.beginTime)) {
                this.$Modal.warning({
                    title: '当前期数未开始',
                    content: '当前期数未开始'
                })
                return
            }
            if (!this.reslutList.length) {
                if (!this.hasClick) {
                    this.$Message.error('请添加单注');
                    this.hasClick = true;
                }
                return;
            }
            // 防止重复点击
            if (this.loading) {
                return;
            }
            this.loading = true;
            //  if (this.user && !this.user.userId) {
            //     this.$store.commit('getShouldLogin',true);
            //     return;
            // }
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
                return data;
            })
            let totalMoney = this.chaseResult.length ? this.chaseMoney : this.total.money;
            this.$emit('get-result', { totalMoney: totalMoney, list: list, chase: this.chaseResult });
            //初始化 5.25
            let layout = this.data.layout;
            this.$set(this.params, 'bettingMoney', layout.costAmount);
            this.$set(this.params, 'singleMoney', layout.costAmount);
            this.$set(this.params, 'odds', layout.rates[0].maxOdds);
            this.$set(this.params, 'company', layout.rates[0].company);
            this.$set(this.params, 'rebate', 0);
        },
        // 追号开关
        setSwitchStatus (status) {
            this.chaseDetail = status;
            this.chaseResult = [];
            if (!status) {
                this.reslutList.forEach(item => {
                    item.chase = '无';
                })
            }
        },
        // 获取追号结果
        getChaseResult (obj) {
            // this.openStatus = false;
            // 处理取消按钮
            this.chaseDetail = false;
            if (!obj) {
                if (!this.chaseResult.length) this.openStatus = false;
                return
            };
            let vm = this;
            this.chaseMoney = obj.chaseMoney.toFixed(2);
            this.autoStop = obj.autoStop ? '1' : '0';
            this.chaseResult = obj.list;
            // 列表添加追号字段
            this.reslutList.forEach(item => {
                item.chase = vm.chaseResult.length;
                item.autoStop = vm.autoStop;
            });
            this.num *= vm.chaseResult.length;
        },
        init () {
            this.data = this.currentLotterys;
            this.data.layout = JSON.parse(this.data.layout);
            let layout = this.data.layout;
            this.$set(this.params, 'bettingMoney', layout.costAmount);
            this.$set(this.params, 'singleMoney', layout.costAmount);
            this.$set(this.params, 'odds', layout.rates[0].maxOdds);
        }
    },
    created () {
        this.init();
        this.timer = setInterval(() => {
            this.countDown++;
        }, 1000)
        // let lotteryCode = this.$store.state.lotteryCode;
        let lotteryCode = this.$attrs.code;
        this.random = require(`@/components/common/module_random/${lotteryCode}.js`);
        if (this.$route.params.order) {
            let obj = Object.assign({}, this.params);
            let order = this.$route.params.order;
            obj.bettingMoney = order.chaseNum * 2;
            obj.singleMoney = order.chaseNum * 2;
            obj.lotteryNumber = order.balls;
            this.addNote([obj]);
        }
    },
    beforeDestroy () {
        this.timer ? clearInterval(this.timer) : null;
    }
}
</script>

<style lang="less" scoped>
.result-page .red-font {
    color: @result-page-color;
}
.result-page {
    border-top: 1px solid @result-page-border-top;
    margin: 0 15px;
    padding: 20px 0;
    margin-top: 20px;
    font-size: 16px;
}
.result-page .txt-title .red-font {
    display: inline-block;
    height: 33px;
    line-height: 33px;
}
.result-page .result-list {
    width: 800px;
}
.result-page .result-operation {
    width: 150px;
    margin-right: 60px;
}
.result-page .result-operation div {
    margin-top: 15px;
    background: @result-page-btn-bg;
    border: 1px solid @result-page-btn-border-color;
    color: @result-page-result-operation;
    background: linear-gradient(
        to top,
        @result-page-btn-gradient-bg-one,
        @result-page-btn-gradient-bg-two
    );
    text-align: center;
    height: 40px;
    line-height: 38px;
    border-radius: 20px;
    cursor: pointer;
}
/* 确认投注按钮 */
.result-page .result-operation .order {
    border-color: @result-page-order-border;
    background: linear-gradient(
        to top,
        @result-page-order-gradient-bg-one,
        @result-page-order-gradient-bg-two
    );
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    box-shadow: -2px 1px 1px @result-page-order-shadow inset;
}
.result-page .result-operation .order span i {
    border: 0;
    color: #fff;
    font-size: 22px;
}
.result-page .result-operation div span {
    display: inline-block;
}
.result-page .result-operation div span i {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    color: @result-page-i-color;
    border: 1px solid @result-page-i-border;
    border-radius: 50%;
    font-size: 14px;
    float: left;
    margin-top: 10px;
}
.result-page .result-operation div.remove i {
    border: 0;
    font-size: 20px;
}
.result-page .totale-num {
    padding: 10px;
    text-align: right;
}
.result-page .totale-num .txt-title {
    font-size: 14px;
}
.result-page .totale-num .txt-title .detail {
    display: inline-block;
    height: 33px;
    line-height: 33px;
    margin-left: 10px;
    background: @result-page-chase-num-bg;
    color: #fff;
    padding: 0px 10px;
    border-radius: 3px;
    box-shadow: -1px 1px 1px @result-page-detail-shadow-color inset;
    cursor: pointer;
}
.result-page .totale-num .txt-title .detail span {
    display: inline-block;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 18px;
    height: 17px;
    line-height: 12px;
    float: left;
    margin-top: 8px;
    margin-right: 4px;
    text-align: center;
}
</style>
<style scoped>
.result-page >>> .ivu-table th {
    color: #fff;
    font-size: 14px;
    font-weight: normal;
}
.result-page >>> .ivu-table-body {
    margin-right: 0 !important;
}
.result-page >>> .ivu-table:before {
    height: 1px !important;
}
.result-page >>> .ivu-table th,
.result-page >>> .ivu-table td {
    border-bottom: none;
}
/* 期数提示弹框 */
.v-transfer-dom >>> .period-modal .ivu-modal-header {
    height: 0;
    padding: 0;
}
.v-transfer-dom >>> .period-modal .ivu-modal-content {
    border: none;
    height: 150px;
}
.v-transfer-dom >>> .period-modal .title {
    font-weight: bold;
}
.v-transfer-dom >>> .period-modal .content {
    position: relative;
    padding: 18px 0 0 48px;
    margin-top: 6px;
    font-size: 16px;
}
.v-transfer-dom >>> .period-modal .content i {
    position: absolute;
    left: 0;
    top: 10px;
    color: #2d8cf0;
    font-size: 36px;
}
.v-transfer-dom >>> .period-modal .content .period-no {
    color: #be1204;
    font-size: 20px;
}
</style>


