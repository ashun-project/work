<template>
    <div class="trecharge">
        <div class="search">
            <div class="selectWay">
                <Select v-model="data.rechargeType">
                    <Option v-for="(item,idx) in menuList" :value="item.itemValue" :key="item.itemValue">{{ item.itemKey }}</Option>
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
                    title: '订单号',
                    key: 'userRechargeId',
                    width: 192
                },
                {
                    title: '充值状态',
                    key: 'rechargeTypeDesc',
                    width: 132
                },
                {
                    title: '充值金额',
                    key: 'totalFee',
                    width: 136,
                    render: (h, params) => {
                        return h('span', Number(params.row.totalFee).toFixed(2))
                    }
                },
                {
                    title: '充值日期',
                    key: 'createTime',
                    width: 187,
                    render: (h, params) => {
                        return h('span', params.row.createTime)
                    }
                },
                {
                    title: '状态',
                    key: 'statusDesc',
                    width: 95,
                    render: (h, params) => {
                        return h('span', {
                            style: {
                                color: "#be1204"
                            }
                        }, params.row.statusDesc)
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
            this.$http.post('/api/v2/user/queryRechargeList', { current: page, startTime: startTime, endTime: endTime, rechargeTypeArray: this.data.rechargeType == '' ? [] : [this.data.rechargeType] }, { userId: true }).then(response => {
                // console.log(response);
                if (response.data.code !== 0) return;
                this.pageParams.currentPage = page;
                this.rechargeList = response.data.data.rechargeList;
                this.pageParams.total = response.data.data.total;
            })
        }
    },
    created () {
        this.queryRechargeList(1);
        this.$http.post('/api/v2/sysDict/queryItemList', { 'dictName': 'RECHARGE_TYPE' }).then(response => {
            if (response.data.code !== 0) return;
            let list = response.data.data.itemList;
            list.unshift({ itemKey: '充值状态', itemValue: '' });
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
    margin-top: 13px;
}
</style>
