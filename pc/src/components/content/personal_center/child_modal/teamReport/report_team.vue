<template>
    <div class="report">
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
        <div class='table'>
            <Table :columns="columns" :data="reportList" stripe></Table>
        </div>
        <page :total="pageParams.total" :current="pageParams.currentPage" :pageSize="10" @get-Page-Data="quertReportList"></page>
    </div>
</template>
<script>
import dateUtil from '@/components/common/module_js/format_date.js'
import page from '@/components/common/module_vue/page.vue'
const PATE_SIZE = 10;
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
                    width: 161
                },
                {
                    title: '盈亏总额',
                    key: 'profitLossTotal',
                    width: 98
                },
                {
                    title: '投注总额',
                    key: 'buyTotal',
                    width: 98,
                    render: (h, params) => {
                        return h('span', params.row.buyTotal.toFixed(2));
                    }
                },
                {
                    title: '派彩总额',
                    key: 'prizeTotal',
                    width: 98,
                    render: (h, params) => {
                        return h('span', params.row.prizeTotal.toFixed(2))
                    }
                },
                {
                    title: '佣金总额',
                    key: 'rebateTotal',
                    width: 98,
                    render: (h, params) => {
                        return h('span', params.row.rebateTotal.toFixed(2));
                    }
                },
                {
                    title: '充值总额',
                    key: 'rechargeTotal',
                    width: 98,
                    render: (h, params) => {
                        return h('span', params.row.rechargeTotal.toFixed(2))
                    }
                },
                {
                    title: '提款总额',
                    key: 'takeFeeTotal',
                    width: 100,
                    render: (h, params) => {
                        return ('span', params.row.takeFeeTotal.toFixed(2))
                    }
                }
            ],
        }
    },
    methods: {
        search () {
            this.quertReportList(1);
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

            this.$http.post('/api/v2/agent/subuser/pc/teamReport', { current: page, gtBuyTime: startTime, ltBuyTime: endTime }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.pageParams.currentPage = page;
                this.reportList = response.data.data.reportList;
                this.pageParams.total = response.data.data.total;
            })
        }
    },
    created () {
        this.quertReportList(1);
    }
}
</script>
<style lang = "less">
@import './common.less';
</style>

