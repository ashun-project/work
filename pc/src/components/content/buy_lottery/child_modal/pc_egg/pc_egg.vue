<template>
    <div class="pc-egg">
        <div v-for="(item, idx) in lotteryData" :key="idx" class="list">
            <h3 class="egg-title">{{item.playName}}</h3>
            <!-- 玩法提示 -->
            <div class='play-tip'>
                <div class="lf">
                    <span class="font-color">
                        <span class="icon">
                            <Icon type="alert" color="#fff" :size="10"></Icon>
                        </span>
                        玩法提示 :
                    </span>
                    <span>{{item.playDesc}}</span>
                    <span>{{item.layout.tips&&item.layout.tips}}</span>
                </div>
                <div class='rt'>
                    <span class="">
                        <Icon type="clipboard"></Icon>&nbsp;&nbsp;范例
                        <div class="info">
                            <Icon type="arrow-down-b"></Icon>
                            {{item.bettingExample}}
                        </div>
                    </span>
                    <span class="">
                        <Icon type="ribbon-a"></Icon>&nbsp;&nbsp;中奖说明
                        <div class="info">
                            <Icon type="arrow-down-b"></Icon>
                            {{item.prizeDesc}}
                        </div>
                    </span>
                </div>
            </div>
            <!-- 玩法提示结束 -->
            <div class="t-header" v-if="item.lotteryPlayId !== '604'">
                <ul>
                    <li class="egg-li" v-for="(value, idx2) in item.layout.rates.length > 4 ? 4: item.layout.rates" :key="idx2">
                        <div class="container">
                            <span class="project">选项</span>
                            <span class="odds" v-if="user.userId">赔率</span>
                            <span class="price" :class="{'big-width' : !user.userId}">金额</span>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
            <div class="t-body temasanbao" v-if="item.lotteryPlayId === '604'">
                <ul>
                    <li class="egg-li">
                        <div class="container">
                            <span class="project">{{item.playName}}</span>
                            <span class="odds" v-show="false">{{item.layout.rates[0].maxOdds}}</span>
                            <span class="tema-selset">
                                <Select v-model="temaSelsected.select1" size="small" style="width:100px">
                                    <Option v-for="value in item.layout.layout[0].balls.split('|')" :value="value" :key="value" :disabled="(value === temaSelsected.select2) || (value === temaSelsected.select3)">
                                        {{ value }}
                                    </Option>
                                </Select>
                                <Select v-model="temaSelsected.select2" size="small" style="width:100px">
                                    <Option v-for="value in item.layout.layout[0].balls.split('|')" :value="value" :key="value" :disabled="(value === temaSelsected.select1) || (value === temaSelsected.select3)">
                                        {{ value }}
                                    </Option>
                                </Select>
                                <Select v-model="temaSelsected.select3" size="small" style="width:100px">
                                    <Option v-for="value in item.layout.layout[0].balls.split('|')" :value="value" :key="value" :disabled="(value === temaSelsected.select1) || (value === temaSelsected.select2)">
                                        {{ value }}
                                    </Option>
                                </Select>
                            </span>
                            <span class="price">
                                下注金额：
                                <span style="display: inline-block;font-size:14px;" :class="{'big-width': !user.userId}">
                                    <input type="number" :min="0" oninput="if(/[^\d]/g.test(value) || value==0) {value=0} else if(/^0/.test(value)) {value=value.slice(1)} else if(value>1000000) {value=1000000}" v-model="item.layout.rates[0].price" @blur="getSingleMoney()">
                                    <!-- <InputNumber :precision='0' :max="item.singleLimit" type="number" :min="0" v-model="item.layout.rates[0].price" @on-blur="getSingleMoney(value)"></InputNumber> -->
                                </span>
                            </span>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
            <div class="t-body" v-else>
                <ul>
                    <li class="egg-li" v-for="(value, idx2) in item.layout.rates" :key="idx2">
                        <div class="container">
                            <span class="project" :class="value.clr">
                                <span>{{value.ball}}</span>
                            </span>
                            <span class="odds" v-if="user.userId">{{value.maxOdds}}</span>
                            <span class="price" :class="{'big-width' : !user.userId}">
                                <!-- <InputNumber :max="item.singleLimit" type="number" :min="0" v-model="value.price" @on-blur="getSingleMoney(value)"></InputNumber> -->
                                <input type="number" :min="0" oninput="if(/[^\d]/g.test(value) || value==0) {value=0} else if(/^0/.test(value)) {value=value.slice(1)} else if(value>1000000) {value=1000000}" v-model="value.price" @blur="getSingleMoney(value)">
                            </span>
                        </div>
                    </li>
                </ul>
                <div class="clr"></div>
            </div>
        </div>

        <!-- 计算结果 -->
        <div class="result-page">
            <div class="lf result-list">
                <Table :columns="columns" :loading="loading" :data="reslutList" no-data-text="暂无单注" height="300"></Table>
                <div class="totale-num" v-if="total.num">
                    <prize-tip :count="total.num" :money="total.money" :singlePrizeMoney="singlePrizeMoney" :verticalLayout="false"></prize-tip>
                </div>
            </div>
            <div class="rf result-operation">
                <div @click="addNote()">
                    <span>
                        <Icon type="plus"></Icon>&nbsp;&nbsp;添加单注</span>
                </div>
                <div @click="remove()" class="remove">
                    <span>
                        <Icon type="trash-a"></Icon>&nbsp;&nbsp;全部删除</span>
                </div>
                <div class="order" @click="order()">
                    <span>
                        <Icon type="android-done"></Icon>&nbsp;&nbsp;确认投注</span>
                </div>
            </div>
            <div class="clr"></div>
        </div>
        <div v-show='showSpin' style='width:1150px;position:absolute;left:0;top:0;' :style="{'height': menuHeight-20 +'px'}">
            <Spin size="large" fix :style="{'height':menuHeight-20+'px'}" v-show='showSpin'></Spin>
        </div>
    </div>
</template>

<script>
import prizeTip from '../common_vue/prize_tip.vue'
let listClr = {
    green: [1, 4, 7, 10, 16, 19, 22, 25],
    blue: [2, 5, 8, 11, 17, 20, 23, 26],
    red: [3, 6, 9, 12, 15, 18, 21, 24],
    other: [0, 13, 14, 27]
}
export default {
    components: { prizeTip },
    data () {
        return {
            menuHeight: this.$attrs.menuHeight,
            timer: null,
            countDown: 0,                 //进入页面开始计时
            showSpin: true,              // 是否显示loading...
            loading: false,
            lotteryData: '',              // 彩种list
            temaSelsected: {
                select1: null,
                select2: null,            //改于3.14
                select3: null
            },
            // 计算结果
            reslutList: [],               // 结果列表
            total: {                      // 总金额与总注数  
                money: 0,
                num: 0
            },
            hasClick: false,              //判断确认投注空投
            isAddNote: false,             //判断添加注单的空投
            singlePrizeMoney: 0,         //单注最大金额
            columns: [                   // table数据
                {
                    title: '号码',
                    width: 110,
                    key: 'lotteryNumber'
                },
                {
                    title: '注数',
                    width: 110,
                    key: 'bettingNum'
                },
                {
                    title: '单注金额',
                    width: 110,
                    key: 'bettingMoney',
                    render: (h, params) => {
                        return h('span', Number(params.row.bettingMoney).toFixed(2));
                    }
                },
                {
                    title: '单位',
                    width: 110,
                    key: 'company',
                    render: (h, params) => {
                        return h('span', '元');
                    }
                },
                {
                    title: '赔率',
                    width: 110,
                    key: 'odds',
                    render: (h, params) => {
                        return h('span', params.row.odds);
                    }
                },
                {
                    title: '金额',
                    key: 'bettingMoney',
                    width: 140,
                    render: (h, params) => {
                        return h('span', Number(params.row.bettingMoney).toFixed(2));
                    }
                },
                {
                    title: '删除',
                    width: 110,
                    key: 'action',
                    render: (h, params) => {
                        // return  h('Button', {
                        //     props: {
                        //         type: 'error',
                        //         size: 'small'
                        //     },
                        //     on: {
                        //         click: () => {
                        //             this.remove(params.index)
                        //         }
                        //     }
                        // }, '删除')
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
            ],
        }
    },
    watch: {
        '$route' (newVal, oldVal) {
            this.showSpin = true;
            this.lotteryData = [];
            this.reslutList = [];
            // for (let key of Object.keys(this.total)) {
            //     this.total[key] = 0;
            // }
            // for (let key of Object.keys(this.temaSelsected)) {
            //     this.temaSelsected[key] = ''; //4.30
            // }
            this.clearData();
            this.init();
        }
    },
    computed: {
        preiodInfo () {
            return this.$store.state.preiodInfo;
        },
        user () {
            return this.$store.state.user;
        },
    },
    methods: {
        reInit () { //登录之后重新初始化
            this.countDown = 0;
            this.timer = setInterval(() => {
                this.countDown++;
            }, 1000)
            this.init();
        },
        // 添加单注
        addNote () {
            if (this.user && !this.user.userId) {
                this.$store.commit('getShouldLogin', true);
                return
            }
            let vm = this;
            let obj = {
                lotteryNumber: '',
                lotteryId: this.$route.params.id,
                bettingMoney: '',
                bettingNum: 1,
                odds: '',
                rebate: 0,
                lotteryPlayId: '',
                lotteryBettingId: ''
            }
            this.lotteryData.forEach(item => {
                item.layout.rates.forEach(value => {
                    if (parseInt(value.price)) {
                        let obj2 = Object.assign({}, obj);
                        obj2.lotteryNumber = value.ball;
                        obj2.bettingMoney = value.price;
                        obj2.odds = value.maxOdds;
                        obj2.lotteryPlayId = value.lotteryPlayId;
                        obj2.lotteryBettingId = item.lotteryBettingId;
                        if (item.lotteryPlayId === '604') {
                            let bull = true;
                            let num = [];
                            for (var key in vm.temaSelsected) {
                                num.push(vm.temaSelsected[key]);
                                if (!vm.temaSelsected[key]) bull = false;
                            }
                            if (bull) {
                                obj2.lotteryNumber = num.join(',');
                                vm.reslutList.push(obj2)
                            };
                        } else {
                            vm.reslutList.push(obj2);
                        }
                        value.price = 0;
                    }
                })
            })
            if (vm.reslutList.length === 0) {
                if (!this.isAddNote) {
                    this.$Message.error('请添加单注');
                    this.isAddNote = true;
                }
                return;
            };
            // for (let key of Object.keys(vm.temaSelsected)) {
            //     vm.temaSelsected[key] = ''; //4.30
            // }
            this.clearData();
            this.getTotal();
        },
        // 计算下单时的总金额与总注数
        getTotal () {
            let money = 0;
            let num = 0;
            let singleMoneys = [];
            //下面乘除100是为了防止 js浮点数计算的Bug
            this.reslutList.forEach(item => {
                money += item.bettingMoney * 100;
                num += item.bettingNum;
                let singleMoney = (item.bettingMoney * 100) / 100 * item.odds;
                singleMoneys.push(singleMoney);
            })
            this.$set(this.total, 'money', (money / 100).toFixed(2));
            this.$set(this.total, 'num', num);
            this.singlePrizeMoney = Math.max.apply(null, singleMoneys); //单注最大金额
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
            this.getTotal();
        },
        // 输入单注金额
        getSingleMoney (item) {
            this.myConsole('暂时保留，等日后处理删除不掉的bug');
        },
        // 下单
        order () {
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
            let vm = this;
            // 防止重复点击
            if (this.loading) return;
            this.loading = true;
            // let arr = [];
            // this.reslutList.forEach(item=>{
            //     arr.push(item.lotteryNumber);
            // })
            var params = {
                bettingInfoList: this.reslutList,
                totalMoney: this.total.money,
                bettingRecordList: [
                    {
                        lotteryRecordId: this.preiodInfo.lotteryRecordId,
                        periodNo: this.preiodInfo.periodNo,
                        num: 1
                    }
                ]
            }

            this.$http.post('/api/v2/lottery/betting', params, { userId: true }).then(response => {
                vm.loading = false;
                if (response.data.code !== 0) return;
                this.$store.commit('getSuccessModal', true);
                setTimeout(() => { this.$store.commit('getSuccessModal', false) }, 1500)
                // for (let key of Object.keys(this.total)) {
                //     this.total[key] = 0;
                // }
                // setTimeout(this.$Modal.remove,1500);
                this.clearData();
                vm.reslutList = [];
                vm.lotteryData.forEach(item => {
                    item.layout.rates.forEach(value => value.price = 0)
                });
            })
        },
        clearData () {
            if (this.total.num) {
                for (let key of Object.keys(this.total)) {
                    this.total[key] = 0;
                }
            }
            if (this.temaSelsected.select1) {
                for (let key of Object.keys(this.temaSelsected)) {
                    this.temaSelsected[key] = ''; //4.30
                }
            }
        },
        // 初始化方法
        init () {
            let vm = this;
            this.$http.post('/api/v2/lottery/getLotteryDetail', { lotteryId: this.$route.params.id }, { unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                response.data.data.list.forEach(item => {
                    item.layout = JSON.parse(item.layout);
                    item.layout.rates.forEach(value => {
                        for (let key in listClr) {
                            let clr = listClr[key].some(vvv => vvv === parseInt(value.ball));
                            if (clr) value.clr = key;
                        }
                        value.price = 0;
                    })
                })
                vm.lotteryData = JSON.parse(JSON.stringify(response.data.data.list));
                vm.showSpin = false;
            });
        }
    },
    created () {
        this.timer = setInterval(() => {
            this.countDown++;
        }, 1000)
        this.init();
    },
    beforeDestroy () {
        this.timer ? clearInterval(this.timer) : null;
    }
}
</script>

<style lang="less" scoped>
.pc-egg {
    position: relative;
    font-size: 14px;
}
.pc-egg .list {
    margin-bottom: 10px;
}
.pc-egg .list h3 {
    background: @pc_egg-title-bg;
    padding: 10px;
    color: #fff;
}
.pc-egg .list .play-tip {
    height: 40px;
    border-bottom: 1px solid #dddee1;
    border-left: 0;
    padding: 5px 0;
    position: relative;
}
.pc-egg .list .play-tip:after {
    display: block;
    content: '';
    visibility: hidden;
    clear: both;
}
.pc-egg .list .play-tip .lf {
    float: left;
    height: 30px;
    padding-left: 15px;
    line-height: 30px;
    color: #5f5d5d;
}
.pc-egg .list .lf .font-color {
    color: @pc-egg-color;
}
.pc-egg .list .lf .font-color .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: @pc_egg-title-bg;
    text-align: center;
    line-height: 20px;
    border-radius: 50%;
}
.pc-egg .list .rt {
    float: right;
    position: absolute;
    right: 15px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.pc-egg .list .rt > span {
    display: inline-block;
    padding: 3px 13px;
    border: 1px solid @buy-lottery-example-border-color;
    position: relative;
    color: @buy-lottery-example-color;
    margin-left: 10px;
    border-radius: 3px;
}
.pc-egg .list .rt > span > i {
    font-size: 16px;
}
.pc-egg .list .rt > span .info {
    position: absolute;
    bottom: 45px;
    right: 0px;
    background: @buy-lottery-example-detail-bg;
    min-width: 400px;
    color: #fff;
    padding: 10px;
    border-radius: 3px;
    display: none;
}
.pc-egg .list .rt > span:hover .info {
    display: block;
}
.pc-egg .list .rt > span .info i {
    position: absolute;
    bottom: -16px;
    right: 15px;
    color: @buy-lottery-example-detail-angle-color;
    font-size: 26px;
}
.pc-egg .container {
    width: 100%;
    height: 100%;
    text-align: center;
}
.pc-egg .container > span {
    display: block;
    float: left;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    height: 100%;
}
.pc-egg .container > span.project {
    width: 20%;
}
.pc-egg .container > span.odds {
    width: 20%;
}
.pc-egg .container > span.price {
    width: 60%;
}
.pc-egg .container > span.price.big-width {
    width: 80%;
}
.pc-egg .container .project.red span,
.pc-egg .container .project.blue span,
.pc-egg .container .project.green span,
.pc-egg .container .project.other span {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    color: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.27);
    -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, 0.27);
    -ms-box-shadow: 0 0 8px rgba(0, 0, 0, 0.27);
    -moz-box-shadow: 0 0 8px rgba(0, 0, 0, 0.27);
    -o-box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}
.pc-egg .container .project.red span {
    background: #ca1e1e;
}
.pc-egg .container .project.blue span {
    background: #057ce4;
}
.pc-egg .container .project.green span {
    background: #0b7607;
}
.pc-egg .container .project.other span {
    background: #aaa;
}
.pc-egg .container > span.price input {
    display: inline-block;
    width: 80px !important;
    height: 22px;
    border: 1px solid #dddee1;
    border-radius: 3px;
    padding-left: 5px;
    line-height: 22px;
    width: 100%;
}
.pc-egg .container > span.price input[type='number'] {
    border: 1px solid #dddee1;
    outline: none;
    transition: all 0.2s ease-in-out;
}
.pc-egg .container > span.price input[type='number']:focus {
    border-color: @pc-egg-input-focus-border;
    box-shadow: 0 0 2px @pc-egg-input-box-shadow;
}
.pc-egg .container > span.price.big-width input {
    width: 60% !important;
}
.pc-egg .t-body.temasanbao .container > .price .big-width input {
    width: 125px !important;
}
.pc-egg .list .t-header,
.pc-egg .list .t-body {
    border-left: 1px solid #eee;
}
.pc-egg .list .t-body .odds,
.pc-egg .list .t-body .project {
    font-weight: bold;
}
.pc-egg .list .t-body .project.other,
.pc-egg .list .t-body .project.green,
.pc-egg .list .t-body .project.red {
    font-weight: normal;
}
.pc-egg .list .t-body span.odds {
    color: @pc-egg-color;
    font-weight: bold;
}
.pc-egg .list .egg-li {
    height: 40px;
    line-height: 40px;
    float: left;
    width: 25%;
}
.pc-egg .list .t-body.temasanbao .egg-li {
    width: 75%;
}
.pc-egg .t-body.temasanbao .container > span.project {
    width: 10%;
}
.pc-egg .t-body.temasanbao .container > span.odds {
    width: 10%;
}
.pc-egg .t-body.temasanbao .container > span.tema-selset {
    width: 40%;
}
.pc-egg .t-body.temasanbao .container > span.price {
    width: 35%;
}
.pc-egg .t-body.temasanbao .container > span.price span {
    display: inline-block;
}
.pc-egg .list .t-body span.price {
    padding: 0 10px;
}

/* 计算结果的样式 */
.pc-egg .result-page .red-font {
    color: @pc-egg-color;
}
.pc-egg .result-page {
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    padding: 20px;
    margin-top: 20px;
    font-size: 16px;
}
.pc-egg .result-page .result-list {
    width: 800px;
}
.pc-egg .result-operation {
    width: 150px;
    margin-right: 60px;
}
.pc-egg .result-operation div {
    margin-top: 15px;
    background: @result-page-btn-bg;
    border: 1px solid @result-page-btn-border-color;
    color: @result-page-result-operation;
    background: linear-gradient(to top, @result-page-btn-gradient-bg-one, #fff);
    text-align: center;
    height: 40px;
    line-height: 38px;
    border-radius: 20px;
    cursor: pointer;
}
.pc-egg .result-operation .order {
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
.pc-egg .result-operation .order span i {
    border: 0;
    color: #fff;
    font-size: 22px;
}
.pc-egg .result-operation div span {
    display: inline-block;
}
.pc-egg .result-operation div span i {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    color: @result-page-i-color;
    border-radius: 50%;
    font-size: 20px;
    float: left;
    margin-top: 10px;
}
.pc-egg .totale-num {
    padding: 10px;
    text-align: right;
}
.pc-egg .ivu-spin-large {
    position: absolute;
    width: 1150px;
    /* height:622px; */
    left: 50%;
    top: 50%;
    /* margin-top:65px; */
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform-origin: 50% 50%;
}
</style>
<style scoped>
.pc-egg >>> .ivu-table th {
    color: #fff;
    font-size: 14px;
    font-weight: normal;
}
.pc-egg >>> .ivu-table-body {
    margin-right: 0 !important;
}
.pc-egg >>> .ivu-table:before {
    height: 1px !important;
}
.pc-egg >>> .ivu-table th,
.pc-egg >>> .ivu-table td {
    border-bottom: none;
}
</style>

