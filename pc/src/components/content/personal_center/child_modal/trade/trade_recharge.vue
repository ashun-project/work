<template>
    <div class="trecharge">
        <div class="search">
            <div class="selectWay">
                <Select v-model="data.rechargeType">
                    <Option v-for="item in menuList" :value="item.itemValue" :key="item.itemValue">{{ item.itemKey }}</Option>
                </Select>
            </div>
            <div class="datetext">起始日期：</div>
            <div class="selectDate">
                <Row>
                    <Col span="12">
                    <DatePicker v-model="data.rechargeTime" type="daterange" placement="bottom-end" placeholder="请选择查询时间" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </div>
            <div class="button">
                <Button type="primary" class="wxbutton" @click="search">搜索</Button>
            </div>
        </div>
        <div class="table">
            <Table :columns="columns" :data="rechargeList" stripe></Table>
            <page :total="pageParams.total" :current="pageParams.currentPage" :pageSize="10" @get-Page-Data="queryRechargeList"></page>
        </div>
    </div>
</template>
<script>
import dateUtil from '@/components/common/module_js/format_date.js'
import page from '@/components/common/module_vue/page.vue'
export default {
    components: { page },
    data () {
        return {
            menuList: [],
            rechargeList: [],
            data: {
                rechargeType: '', // 充值方式
                rechargeTime: ''
            },
            pageParams: {
                total: 0,
                currentPage: 1
            },
            columns: [
                {
                    title: '交易时间',
                    key: 'tradeTime',
                    width: 150
                },
                {
                    title: '交易类型',
                    key: 'tradeTypeDesc',
                    width: 103
                },
                {
                    title: '交易描述',
                    key: 'tradeDesc',
                    width: 260
                },
                {
                    title: '收支情况',
                    key: 'amount',
                    width: 110,
                    render: (h, params) => {
                        return h('span', Number(params.row.amount).toFixed(3))
                    }
                },
                {
                    title: '余额',
                    key: 'userBalance',
                    width: 136,
                    render: (h, params) => {
                        return h('span', params.row.userBalance.toFixed(2))
                    }
                }
            ]
        }
    },
    methods: {
        search () {
            this.queryRechargeList(1);
        },
        formatDate (value) {
            return dateUtil.getFormatDate(value)
        },
        queryRechargeList (page) {
            var startTime = '', endTime = '';
            if (this.data.rechargeTime.length > 0) {
                if (this.data.rechargeTime[0] !== null) {
                    startTime = dateUtil.getFormatDate(this.data.rechargeTime[0]);
                }
                if (this.data.rechargeTime[1] !== null) {
                    endTime = dateUtil.getFormatDate(this.data.rechargeTime[1]);
                }
            }
            //账户明细
            this.$http.post('/api/v2/user/queryBalanceDetailList', { current: page, startTime: startTime, endTime: endTime, tradeTypeArray: this.data.rechargeType == '' ? [] : [this.data.rechargeType] }, { userId: true, unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.pageParams.currentPage = page;
                this.rechargeList = response.data.data.balanceDetailList;
                this.pageParams.total = response.data.data.total;
            })
        }
    },
    created () {
        this.queryRechargeList(1);
        // TRADE_TYPE
        // RECHARGE_TYPE
        this.$http.post('/api/v2/sysDict/queryItemList', { 'dictName': 'TRADE_TYPE' }).then(response => {
            if (response.data.code !== 0) return;
            let list = response.data.data.itemList;
            list.unshift({ itemKey: '交易类型', itemValue: '' });
            this.menuList = list;
        })
    }
}
</script>

<style scoped>
.trecharge .search {
    height: 30px;
    line-height: 30px;
}
.trecharge .selectWay {
    width: 100px;
    float: left;
}
.trecharge .datetext {
    float: left;
    line-height: 30px;
    margin-left: 5%;
}
.trecharge .selectDate {
    float: left;
    margin-left: 2px;
}
.trecharge .button {
    float: right;
}
.trecharge .wxbutton {
    width: 66px;
}
.trecharge .table {
    margin-top: 14px;
}
.trecharge .page-wrapper {
    margin-top: 25px;
}
</style>
