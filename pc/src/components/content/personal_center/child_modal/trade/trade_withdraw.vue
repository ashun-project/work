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
                    <DatePicker v-model="data.takeFeeTime" type="daterange" placement="bottom-end" placeholder="请选择查询时间" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </div>
            <div class="button">
                <Button type="primary" class="wxbutton" @click="search">搜索</Button>
            </div>
        </div>

        <div class="table">
            <Table :columns="columns" :data="takeFeeList" stripe></Table>
            <page :total="pageParams.total" :current="pageParams.currentPage" :pageSize="10" @get-Page-Data="queryTakeFeeList"></page>
        </div>
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js';
import page from '@/components/common/module_vue/page.vue'
export default {
    components: { page },
    data () {
        return {
            takeFeeList: [],
            data: {
                takeFeeTime: '',
                rechargeType: ''
            },
            pageParams: {
                total: 0,
                currentPage: 1
            },
            menuList: [],
            columns: [
                {
                    title: '订单号',
                    key: 'userTakeFeeId',
                    width: 192
                },
                {
                    title: '提现银行',
                    key: 'bankName',
                    width: 132
                },
                {
                    title: '提现金额',
                    key: 'takeFee',
                    width: 136,
                    render: (h, params) => {
                        return h('span', Number(params.row.takeFee).toFixed(2))
                    }
                },
                {
                    title: '提现日期',
                    key: 'takeFeeTime',
                    width: 187
                },
                {
                    title: '状态',
                    key: 'statusDesc',
                    width: 95,
                    render: (h, params) => {
                        return h('span', {
                            style: {
                                color: '#be1204'
                            }
                        }, params.row.statusDesc)
                    }
                }
            ]
        }
    },
    methods: {
        search () {
            this.queryTakeFeeList(1);
        },
        formatDate (value) {
            return dateUtil.getFormatDate(value);
        },
        queryTakeFeeList (page) {
            var startTime = '', endTime = '';
            if (this.data.takeFeeTime.length > 0) {
                if (this.data.takeFeeTime[0] !== null) {
                    startTime = dateUtil.getFormatDate(this.data.takeFeeTime[0]);
                }
                if (this.data.takeFeeTime[1] !== null) {
                    endTime = dateUtil.getFormatDate(this.data.takeFeeTime[1]);
                }
            }
            this.$http.post('/api/v2/user/queryTakeFeeList', { current: page, startTime: startTime, endTime: endTime, statusArray: this.data.rechargeType === '' ? [] : [this.data.rechargeType] }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.pageParams.currentPage = page;
                this.takeFeeList = response.data.data.takeFeeList;
                this.pageParams.total = response.data.data.total;
            })
        }
    },
    created () {
        this.queryTakeFeeList(1);
        this.$http.post('/api/v2/sysDict/queryItemList', { 'dictName': 'TAKE_FEE' }).then(response => {
            if (response.data.code !== 0) return;
            let list = response.data.data.itemList;
            list.unshift({ itemKey: '提现状态', itemValue: '' });
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
    font-size: 14px;
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
    margin-top: 13px;
}
</style>
