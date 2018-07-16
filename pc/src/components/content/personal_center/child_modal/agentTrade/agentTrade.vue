<template>
    <div class="betting-wrap">
        <!-- 标题 -->
        <div class='title'>
            <ul>
                <li v-for="(item,index) in category" :key="index" @click="changeTab(item)" :class="[item.label===label ? 'active':'']">
                    <span>{{item.name}}</span>
                    <i></i>
                </li>
            </ul>
        </div>
        <!-- 标题结束 -->
        <!-- 搜索 -->
        <div class="search-wrap">
            <div class='lf'>
                <div class='date'>
                    <Select ref='selectPicker' v-model="choiceDate" style="width:70px" @on-change='changeSpecialDate' :disabled="canSpecialPick">
                        <Option v-for="(item,index) in dateText" :value="index === 0 ? '' : index-1" :key="item.key">{{ item}}</Option>
                    </Select>
                </div>
                <div class="selectDate">
                    <Row>
                        <Col span="12">
                        <DatePicker ref="datePicker" @on-change="getSelectDate" :disabled="canDatePick" v-model="searchTime" type="daterange" placement="bottom-end" placeholder="请选择查询时间" style="width: 200px"></DatePicker>
                        </Col>
                    </Row>
                </div>
            </div>
            <div class="rt">
                <div class="name">
                    <Icon type="search"></Icon>
                    <Input :value="params.userCode" @input="params.userCode = arguments[0].replace(/^\s+|\s+$/,'')" size="default" placeholder="输入下级代理用户名" style="width:160px;">
                    </Input>
                </div>
                <div class="search">
                    <Button type="primary" class="wxbutton" @click="search">搜索</Button>
                </div>
            </div>
        </div>
        <!-- 搜索结束 -->
        <!-- 搜索结果 -->
        <div class="search-result">
            <Table :columns="columns" :data="resultList" stripe></Table>
            <page :total="total" :currentPage="params.current" :pageSize="params.size" @get-Page-Data="getPageData"></page>
        </div>
        <!-- 分页 -->
        <!-- 搜索结果结束 -->
    </div>
</template>
<script>
import dateUtil from '@/components/common/module_js/format_date.js';
import dates from '../../common/date.js';
import page from '@/components/common/module_vue/page.vue';
export default {
    components: { page },
    data () {
        return {
            label: '',
            category: [
                { 'name': '所有类型', label: '' },
                { 'name': '提现记录', label: '00' },
                { 'name': '充值记录', label: '04' },
            ],
            dateText: ['日期', '今天', '昨天', '本周', '上周', '本月', '上月'],
            choiceDate: '',   //查询指定时间
            searchTime: [],   //日期选择器时间
            resultList: [],   //搜索结果
            canDatePick: false,  //是否禁用日期选择器
            canSpecialPick: false, //是否禁用指定日期选择
            detailFlag: false, //弹框标记
            detail: {}, //投注详情
            total: 0,
            params: {
                userCode: '',
                startTime: '',
                endTime: '',
                current: 1,
                size: 10,
                tradeTypeArray: []
            },
            columns: [
                {
                    title: '代理用户名',
                    key: 'userCode',
                    width: 203,
                },
                {
                    title: '时间',
                    key: 'tradeTime',
                    width: 258,
                },
                {
                    title: '状态',
                    key: 'tradeTypeDesc',
                    width: 186,
                },
                {
                    title: '金额',
                    key: 'amount',
                    width: 93,
                    render: (h, params) => {
                        let amount = (params.row.amount * 1);
                        return h('span', {
                            style: {
                                color: amount > 0 ? '#be1204' : '#16bb00'
                            }
                        }, amount.toFixed(2));
                    }
                },
            ]
        }
    },
    methods: {
        changeTab (item) { //切换tab
            this.initStatus();
            this.label = item.label;
            this.params.tradeTypeArray = item.label ? [item.label] : [];
            this.params.current = 1;
            this.getTradList();
        },
        getPageData (page) { //切换页数
            this.params.current = page;
            this.getTradList();
        },
        getSelectDate (result) { //日期选择器
            if (result[0]) {
                this.canSpecialPick = true;
                this.params.startTime = result[0];
                this.params.endTime = result[1];
            } else {
                this.canSpecialPick = false;
                this.params.startTime = '';
                this.params.endTime = '';
            }
        },
        search () { //搜索
            this.params.current = 1;
            this.getTradList();
        },
        initStatus () { //初始化搜索状态
            this.params.userCode = '';
            this.params.startTime = '';
            this.params.endTime = '';
            this.choiceDate = '';
            this.searchTime = [];
            this.canDatePick = false;
            this.canSpecialPick = false;
        },
        changeSpecialDate () { //选择指定日期
            if (typeof this.choiceDate === 'string') { //未选择指定日期
                this.canDatePick = false;
                this.params.startTime = '';
                this.params.endTime = '';
            } else {
                this.canDatePick = true;
                let dateArr = Array.from(dates);
                this.params.startTime = dateUtil.getFormatDate(dateArr[this.choiceDate]().startTime)
                this.params.endTime = dateUtil.getFormatDate(dateArr[this.choiceDate]().endTime);
            }
        },
        getTradList () {
            this.$http.post('/api/v2/agent/queryAgentBalanceDetailList', this.params, { userId: true, unenc: true }).then(res => {
                if (res.data.code !== 0) return
                this.resultList = res.data.data.balanceDetailList;
                this.total = res.data.data.total;
            })
        }
    },
    created () {
        this.getTradList();
    }
}
</script>

<style lang='less'>
.betting-wrap {
    padding-top: 2px;
    .title {
        height: 38px;
        border-bottom: 2px solid #e2e2e2;
        &:after {
            display: block;
            clear: both;
            visibility: hidden;
            content: '';
        }
        li {
            position: relative;
            float: left;
            width: 115px;
            height: 38px;
            line-height: 38px;
            font-size: 16px;
            text-align: center;
            cursor: pointer;
            &.active {
                color: #be1204;
                border-bottom: 2px solid #be1204;
            }
            i {
                position: absolute;
                top: 13px;
                right: 0;
                width: 1px;
                height: 12px;
                background-color: #a1a1a1;
            }
        }
    }
    .search-wrap {
        height: 30px;
        margin-top: 14px;
        .lf {
            float: left;
            font-size: 0;
            .date {
                display: inline-block;
                vertical-align: top;
                font-size: 14px;
            }
            .selectDate {
                &:extend(.betting-wrap .search-wrap .lf .date);
                margin-left: 22px;
            }
        }
        .rt {
            &:extend(.betting-wrap .search-wrap .lf);
            float: right;
            .name {
                &:extend(.betting-wrap .search-wrap .lf .date);
                i {
                    position: relative;
                    left: 22px;
                    top: 2px;
                    color: #949494;
                    z-index: 2;
                }
                input {
                    padding-left: 22px;
                }
            }
            .search {
                &:extend(.betting-wrap .search-wrap .lf .date);
                margin-left: 27px;
                .wxbutton {
                    width: 66px;
                }
            }
        }
    }
    .search-result {
        padding-top: 14px;
    }
}
</style>

