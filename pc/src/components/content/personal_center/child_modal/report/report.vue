<template>
    <div class="report-wrap">
        <div class="search">
            <div class="datetext">起始日期：</div>
            <div class="selectDate">
                <Row>
                    <Col span="12">
                    <DatePicker v-model="data.reportTime" type="daterange" placement="bottom-end" placeholder="请选择查询时间" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </div>
            <div class="button">
                <Button type="primary" class="wxbutton" @click="search">搜索</Button>
            </div>
        </div>
        <div class="table">
            <Table :columns="columns" :data="reportList" stripe></Table>
            <page :total="pageParams.total" :current="pageParams.currentPage" :pageSize="10" @get-Page-Data="quertReportList"></page>
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
            data: {
                reportTime: ''
            },
            reportList: [],
            pageParams: {
                currentPage: 1,
                total: 0
            },
            columns: [
                {
                    title: '日期',
                    key: 'tradeTime',
                    width: 138
                },
                {
                    title: '返利',
                    key: 'fanliTotal',
                    width: 86
                },
                {
                    title: '盈亏',
                    key: 'profitLossTotal',
                    width: 86,
                    render: (h, params) => {
                        return h('span', params.row.profitLossTotal.toFixed(2));
                    }
                },
                {
                    title: '投注',
                    key: 'buyTotal',
                    width: 87,
                    render: (h, params) => {
                        return h('span', params.row.buyTotal.toFixed(2))
                    }
                },
                {
                    title: '派彩',
                    key: 'prizeTotal',
                    width: 87,
                    render: (h, params) => {
                        return h('span', params.row.prizeTotal.toFixed(2));
                    }
                },
                {
                    title: '佣金',
                    key: 'rebateTotal',
                    width: 86,
                    render: (h, params) => {
                        return h('span', params.row.rebateTotal.toFixed(2));
                    }
                },
                {
                    title: '充值',
                    key: 'rechargeTotal',
                    width: 86,
                    render: (h, params) => {
                        return h('span', params.row.rechargeTotal.toFixed(2));
                    }
                },
                {
                    title: '提款',
                    key: 'takeFeeTotal',
                    width: 86,
                    render: (h, params) => {
                        return h('span', params.row.takeFeeTotal.toFixed(2));
                    }
                }
            ]
        }
    },
    methods: {
        search () {
            this.quertReportList();
        },
        quertReportList (page) {
            var startTime = '', endTime = '';
            if (this.data.reportTime.length > 0) {
                if (this.data.reportTime[0] != null) {
                    startTime = dateUtil.getFormatDate(this.data.reportTime[0]);
                }
                if (this.data.reportTime[1] != null) {
                    endTime = dateUtil.getFormatDate(this.data.reportTime[1]);
                }
            }
            this.$http.post('/api/v2/agent/subuser/pc/oneReport', { current: page, gtBuyTime: startTime, ltBuyTime: endTime }, { userId: true, unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.pageParams.currentPage = page;
                this.reportList = response.data.data.reportList;
                // console.log(this.reportList);
                this.pageParams.total = response.data.data.total;
            })
        }
    },
    created () {
        this.quertReportList(1);
    }
}
</script>
<style lang ="less">
.report-wrap {
    .search {
        text-align: right;
        height: 30px;
        margin-top: 14px;
        .selectDate {
            display: inline-block;
            vertical-align: top;
        }
        .datetext {
            &:extend(.report-wrap .search .selectDate);
            margin-top: 5px;
        }
        .button {
            &:extend(.report-wrap .search .selectDate);
            margin-left: 22px;
            button {
                width: 66px;
            }
        }
    }
    .table {
        margin-top: 13px;
    }
}
</style>
