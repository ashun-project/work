<template>
    <div class="record">
        <div class="search">
            <div class="datetext">起始日期：</div>
            <div class="selectDate">
                <Row>
                    <Col span="12">
                    <DatePicker type="daterange" placement="bottom-end" v-model="paramData.selectTime" placeholder="请选择查询时间" style="width: 135px"></DatePicker>
                    </Col>
                </Row>
            </div>
            <div class='lottery-cate'>彩种：</div>
            <div class='all-lottery'>
                <Select v-model="lotteryCategory" style="width:85px" @on-change='changeLotteryCategory'>
                    <Option v-for="item in lotteryCategoryList" :value="item.lotteryId ? item.lotteryId : ''" :key="item.lotteryId">{{ item.lotteryName }}</Option>
                </Select>
            </div>
            <div class='status'>状态：</div>
            <div class='all-status'>
                <Select v-model="lotteryStatus" style="width:85px" @on-change='changeLotteryStatus'>
                    <Option v-for="(item ,index) in lotteryStatusList" :value="item.status? item.status : ''" :key="index">{{ item.name }}</Option>
                </Select>
            </div>
            <div class="button">
                <Button type="primary" class="wxbutton" @click="changePage(1)" icon="search">搜索</Button>
            </div>
            <div class="button">
                <Button type="primary" class="wxbutton" @click="resetData('')" icon="ios-loop">重置</Button>
            </div>
        </div>
        <modal :modalShow='detailFlag' :title="detail.lotteryName+'第'+detail.periodNo+'期'" :width="963" :hasFooter="false" :maskClosable="true" @btn-cancel="detailFlag = false" :hasOkBtn="false">
            <div slot="content">
                <div class="modal1">
                    <div class="modal1img">
                        <img :src="detail.lotteryIcon">
                    </div>
                    <div class="modal1info">
                        <span class="infotitle">{{detail.lotteryName}}</span>
                        <span class="infodate" style="">
                            <span>第</span>
                            <span>{{detail.periodNo}}</span>
                            <span>期开奖号</span>
                        </span>
                    </div>
                    <div v-if='detail.status =="00"' class="modal1Status">
                        <span>待开奖</span>
                    </div>
                    <div v-else-if="detail.status!=='00'" class="modal2Status">
                        <span class='prize-ball' v-for='(ball,index) in detail.lotteryNumber' :key='index' height="108"> {{ball}}</span>
                    </div>
                </div>
                <div class="modal1detail">
                    <span class="detailcss">
                        金额：
                        <Input :value="(detail.buyMoney || '')+'元'" disabled></Input>
                    </span>
                    <span class="detailcss">
                        期号：
                        <Input :value="detail.periodNo" disabled></Input>
                    </span>
                    <span class="detailcss">
                        状态：
                        <Input :value="detail.statusDesc" disabled></Input>
                    </span>
                    <span class="detailcss">
                        时间：
                        <Input :value="detail.createTime" disabled></Input>
                    </span>
                </div>
                <div class="modal1detail">
                </div>
                <div class='price-detail'>
                    <Table :columns="detailColumns" :data="detailData" stripe></Table>
                </div>
            </div>
        </modal>
        <div class="table">
            <Table stripe :data="bettingInfoListData" :columns="bettingInfoListColumns"></Table>
            <page :total="paramData.total" :currentPage="paramData.current" :pageSize="paramData.size" @get-Page-Data="getPageData"></page>
        </div>
    </div>
</template>
<script>
import formatDate from '@/components/common/module_js/format_date.js'
import page from '@/components/common/module_vue/page.vue'
import modal from '@/components/common/module_vue/modal.vue'
export default {
    components: { page, modal },
    data () {
        return {
            lotteryStatusList: [
                { name: '全部', status: '' },
                { name: '未开奖', status: '00' },
                { name: '未中奖', status: '01' },
                { name: '中奖', status: '02' },
                { name: '追号退还', status: '03' },
                { name: '和值注单', status: '04' },
                { name: '已撤单', status: '05' }
            ],    //彩种状态列表
            lotteryStatus: '',        //彩票状态
            lotteryCategoryList: '', //彩种列表
            bettingInfoListDataOrigin: '', //彩种列表
            lotteryCategory: '', //彩种
            cancelOrder: false,
            paramData: {
                status: '',
                current: 1,
                // size:5,
                size: 10,
                total: 0,
                selectTime: '',
                gtBuyTime: '',
                ltBuyTime: ''
            },
            detailFlag: false,
            model1: '',
            dateList: [
                { name: '一周' },
                { name: '一月' }
            ],
            detail: {},
            detailColumns: [
                {
                    title: '游戏玩法',
                    width: 200,
                    key: 'playName'
                },
                {
                    title: '下注号码',
                    width: 167,
                    key: 'buyLotteryNumber'
                },
                {
                    title: '赔率',
                    width: 111,
                    key: 'odds',
                    render: (h, params) => {
                        return h('div', (params.row.odds * 1).toFixed(2) || '');
                    }
                },
                {
                    title: '投注金额',
                    width: 147,
                    key: 'buyMoney'
                },
                {
                    title: '注数',
                    width: 76,
                    key: 'buyNum'
                },
                {
                    title: '返利',
                    width: 89,
                    key: 'rebate',
                    render: (h, params) => {
                        return h('span', (params.row.rebate * 100).toFixed(2) + '%');
                    }
                },
                {
                    title: '中奖金额',
                    width: 140,
                    key: 'prize',
                    render: (h, params) => {
                        var text = null;
                        if (params.row.prize) {
                            text = Number(params.row.prize).toFixed(2);
                        }
                        return h('span', text);
                    }
                }
            ],
            detailData: [],
            bettingInfoListData: [],
            bettingInfoListColumns: [
                { title: '时间', key: 'buyTime', width: 81 },
                { title: '彩种', key: 'lotteryName', width: 82 },
                { title: '期号', key: 'periodNo', width: 98 },
                { title: '玩法', key: 'playName', width: 100 },
                {
                    title: '下注号码',
                    key: 'lotteryNumber',
                    width: 99,
                    render: (h, params) => {
                        return h('span', {
                            style: {
                                color: '#be1204'
                            }
                        }, params.row.lotteryNumber)
                    }
                },
                { title: '金额', key: 'buyMoney', width: 73 },
                {
                    title: '状态',
                    width: 63,
                    key: 'ballstatus',
                    render: (h, params) => {
                        return h('span', {
                            style: {
                                color: params.row.status === '02' ? '#be1204' : params.row.status === '05' ? '#ff7614' : '#7f7f7f'
                            }
                        }, params.row.statusDesc)
                    }
                },
                {
                    title: '详情',
                    width: 60,
                    key: 'balldetails',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                // props: {
                                //     type: 'primary',
                                //     size: 'small'
                                // },
                                style: {
                                    color: '#be1204',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.show(params.row)
                                    }
                                }
                            }, '详情')
                        ]);
                    }
                },
                {
                    title: '取消订单',
                    width: 88,
                    key: 'ballcancle', width: 85,
                    render: (h, params) => {
                        if (params.row.status == '00') {
                            return h('div', [
                                h('span', {
                                    style: {
                                        color: '#eb1204'
                                    },
                                    on: {
                                        click: () => {
                                            this.cancel(params.row)
                                        }
                                    }
                                })
                            ]);
                        } else {
                            return '不可操作';
                        }
                    }
                }
            ]
        }
    },
    computed: {
        updateRecord () {
            return this.$store.state.updateRecord;
        }
    },
    watch: {
        updateRecord (n) {
            let obj = JSON.parse(n)
            this.resetData(obj.userBettingRecordId)
        }
    },
    methods: {
        resetData (detail) { //重置
            !!this.lotteryStatus ? this.lotteryStatus = '' : '';
            !!this.lotteryCategory ? this.lotteryCategory = '' : '';
            !!this.paramData.selectTime ? this.paramData.selectTime = '' : '';
            this.getPageData(1, detail);
        },
        changePage (page) {
            this.getPageData(page);
        },
        changeLotteryCategory () { //选择彩种类型
            // console.log(this.lotteryCategory);
            if (!this.lotteryCategory) {
                this.bettingInfoListData = JSON.parse(JSON.stringify(this.bettingInfoListDataOrigin));
            } else {
                this.bettingInfoListData = this.bettingInfoListDataOrigin.filter(item => item.lotteryId === this.lotteryCategory);
            }
            if (!this.lotteryStatus) {
                return
            }
            this.bettingInfoListData = this.bettingInfoListData.filter(item => item.status === this.lotteryStatus);
        },
        changeLotteryStatus () { //选择彩种状态
            if (!this.lotteryStatus) {
                this.bettingInfoListData = JSON.parse(JSON.stringify(this.bettingInfoListDataOrigin));
            } else {
                this.bettingInfoListData = this.bettingInfoListDataOrigin.filter(item => item.status === this.lotteryStatus);
            }
            if (!this.lotteryCategory) {
                return
            }
            this.bettingInfoListData = this.bettingInfoListData.filter(item => item.lotteryId === this.lotteryCategory);
        },
        getPageData (page, detail) {
            let vm = this;
            // this.lotteryStatus = '';
            // this.lotteryCategory ='';
            let times = vm.paramData.selectTime;
            if (times && times[0] && times[1]) {
                vm.$set(vm.paramData, 'gtBuyTime', formatDate.getFormatDate(times[0]));
                vm.$set(vm.paramData, 'ltBuyTime', formatDate.getFormatDate(times[1]));
            } else {
                vm.$set(vm.paramData, 'gtBuyTime', '');
                vm.$set(vm.paramData, 'ltBuyTime', '');
            }
            // this.lotteryStatus === '' ? '' : ;
            vm.$set(vm.paramData, 'status', this.lotteryStatus);
            vm.$set(vm.paramData, 'lotteryId', this.lotteryCategory)
            // this.lotteryCategory === '' ? '' : ;
            this.paramData.current = page;
            this.$http.post('/api/v2/betting/queryBettingInfoList', vm.paramData, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                let data = response.data.data;
                vm.bettingInfoListData = data.bettingInfoList;
                vm.bettingInfoListDataOrigin = data.bettingInfoList;
                // console.log(vm.bettingInfoListData);
                vm.bettingInfoListData.forEach((item, index) => {
                    vm.$set(item, 'buyMoney', item.buyMoney.toFixed(2));
                })
                vm.$set(vm.paramData, 'total', data.total);
                // console.log(vm.bettingInfoListData, '===========')
                // 推送消息进来
                if (detail) {
                    // console.log( detail, '----------------------')
                    this.$route.params.detail = '';   // 清空detail
                    let currentData = vm.bettingInfoListData.filter(item => item.userBettingRecordId === detail);
                    this.show(currentData[0])
                }
            })
        },
        show (row) {
            // console.log(row);
            let vm = this;
            this.detailFlag = true;
            this.$http.post('/api/v2/betting/queryBettingInfoById', { userBettingRecordId: row.userBettingRecordId }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                let data = response.data.data;
                if (data.bettingInfo) {
                    vm.detail = data.bettingInfo;
                } else {
                    vm.detail = {}
                }
                // console.log(vm.detail);
                // vm.detail.statusTxt=status[vm.detail.status];
                vm.detail.lotteryIcon = row.lotteryIcon;
                // vm.detail.status = row.status;
                // vm.detail.lotteryNumber = data.lotteryNumber;
                // if (vm.detail.lotteryNumber.includes(',')) {
                //     vm.detail.lotteryNumber = vm.detail.lotteryNumber.split(',');
                // }else if (vm.detail.lotteryNumber.includes('|')) {
                //     vm.detail.lotteryNumber = vm.detail.lotteryNumber.split('|');
                // }
                if (vm.detail.lotteryNumber) {
                    if (typeof vm.detail.lotteryNumber === 'string') {
                        let num = null;
                        if (/\d/.test(vm.detail.lotteryNumber)) {
                            if (vm.detail.lotteryNumber.includes(',')) {
                                num = vm.detail.lotteryNumber.replace('+', ',').split(',');
                            } else if (vm.detail.lotteryNumber.includes('|')) {
                                num = vm.detail.lotteryNumber.split('|');
                            }
                            vm.detail.lotteryNumber = num;
                        }
                    }
                }
                vm.detailData = [];
                vm.detailData.push(vm.detail);
            })
            return;
        },
        cancel (row) {
            let vm = this;
            this.$Modal.confirm({
                title: '取消订单',
                content: '<p>确定要取消订单吗？</p>',
                onOk: () => {
                    this.$http.post('/api/v2/betting/cancleBettingRecord', { userBettingRecordId: row.userBettingRecordId }, { userId: true }).then(response => {
                        if (response.data.code !== 0) return
                        this.$Message.info("操作成功");
                        this.getPageData(1);
                    })
                },
                onCancel: () => {
                }
            });
            return;
        }
    },
    created () {
        let vm = this;
        // vm.paramData.current=1;
        vm.getPageData(1, this.$route.params.detail);
        this.$http.post('/api/v2/lottery/queryLottery', {}).then(response => {
            if (response.data.code !== 0) return
            this.lotteryCategoryList = response.data.data;
            this.lotteryCategoryList.unshift({ lotteryName: '全部' });
        })
    }
}
</script>

<style scoped>
.record {
    margin-top: 14px;
}
.center-modal .ivu-modal-content {
    padding: 20px;
}
.record .search {
    height: 30px;
    line-height: 30px;
    text-align: right;
}
.record .selectWay {
    width: 100px;
    float: left;
}
.record .datetext,
.record .lottery-cate,
.record .all-lottery,
.record .status,
.record .all-status {
    display: inline-block;
    height: 30px;
    vertical-align: top;
    color: #313131;
}
.record .selectDate {
    display: inline-block;
    vertical-align: top;
}
.record .lottery-cate,
.record .status {
    margin-left: 10px;
}
.record .button {
    display: inline-block;
    height: 30px;
    vertical-align: top;
}
.record .search .ivu-select,
.record .search .ivu-date-picker {
    vertical-align: top;
}
.record .button button {
    display: block;
    height: 100%;
    line-height: 16px;
    margin-left: 10px;
}
.record .infotitle {
    display: block;
    font-size: 28px;
    font-weight: bold;
    color: #313131;
    font-style: italic;
}
.record >>> .ivu-select {
    text-align: center;
}
.record >>> .ivu-input,
.record >>> .ivu-select-selection {
    height: 30px;
}
.record .table {
    margin-top: 13px;
}
.v-transfer-dom >>> .modal1 {
    height: 90px;
    width: 100%;
    margin-bottom: 16px;
    border-bottom: 1px solid #d2d0d0;
}
.v-transfer-dom >>> .modal1 .modal1img img {
    display: block;
    width: 74px;
    height: 74px;
}
.v-transfer-dom >>> .modal1info {
    float: left;
    padding-top: 6px;
    margin-left: 14px;
}
.v-transfer-dom >>> .modal1info .infotitle {
    display: block;
    font-size: 28px;
    font-weight: bold;
    color: #313131;
    font-style: italic;
}
.v-transfer-dom >>> .infodate {
    color: grey;
}
.v-transfer-dom >>> .modal1Status,
.v-transfer-dom >>> .modal2Status {
    float: left;
    margin-top: 15px;
    margin-left: 22px;
    line-height: 23px;
    text-align: center;
}
.v-transfer-dom >>> .modal1Status {
    padding: 0 15px;
    height: 23px;
    color: #fff;
    background-color: #a9a9a9;
    border-radius: 23px;
    -moz-border-radius: 23px;
    -ms-border-radius: 23px;
    -o-border-radius: 23px;
    -webkit-border-radius: 23px;
}
.v-transfer-dom >>> .modal2Status {
    color: #505c66;
    line-height: 23px;
}
.v-transfer-dom >>> .infodate:first-child,
.v-transfer-dom >>> .infodate:last-child {
    color: #a9a9a9;
}
.record .infodate span:nth-child(2) {
    color: #be1204;
    margin: 0 5px;
}
.record .table .ivu-table-wrapper >>> .ivu-table tbody td .ivu-table-cell {
    font-size: 12px;
}
.v-transfer-dom >>> .modal1detail {
    line-height: 38px;
    margin-left: -40px;
    font-size: 0;
}
.v-transfer-dom >>> .modal1detail:last-child {
    margin: 14px 0;
}
.record .modal1status span {
    color: white;
}
.v-transfer-dom >>> .modal1detail .detailcss {
    display: inline-block;
    margin-left: 40px;
    color: #a9a9a9;
    height: 30px;
    line-height: 30px;
}
.v-transfer-dom >>> .modal1detail .detailcss input {
    font-size: 14px;
}
.v-transfer-dom >>> .modal1detail .detailcss .ivu-input-wrapper {
    width: 160px;
    height: 30px;
    vertical-align: inherit;
}
.v-transfer-dom >>> .price-detail .ivu-table-body {
    overflow-x: hidden;
}
.v-transfer-dom >>> .price-detail .ivu-table td {
    height: 36px;
}
.ivu-table-wrapper >>> .ivu-table tbody td:nth-child(9) .ivu-table-cell span {
    padding-left: 20px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -531px -119px;
    cursor: pointer;
}
.ivu-table-wrapper >>> .ivu-table tbody td:nth-child(9) .ivu-table-cell span {
    color: #e2e2e2;
}
.modal1detail >>> .ivu-input {
    border: none;
    background: #f2f2f2;
    color: #313131;
}
.v-transfer-dom >>> .prize-ball {
    display: inline-block;
    width: 42px;
    height: 42px;
    line-height: 42px;
    border-radius: 50%;
    color: #505c66;
    font-size: 18px;
    margin-right: 4px;
    background: -webkit-radial-gradient(#fcfcfc 21%, #c0bfbf);
    box-shadow: 0 3px 5px #787878;
    -webkit-box-shadow: 0 3px 5px #787878;
    -moz-box-shadow: 0 3px 5px #787878;
    -ms-box-shadow: 0 3px 5px #787878;
    -o-box-shadow: 0 3px 5px #787878;
}
.v-transfer-dom >>> .ivu-modal-footer {
    padding-top: 0;
}
</style>
