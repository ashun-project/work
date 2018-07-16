<template>
    <div class="my-account">
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
                    <Input :value="params.userCode" @input="params.userCode = arguments[0].replace(/^\s+|\s+$/,'')" size="default" placeholder="输入下级代理用户名" style="width:160px"></Input>
                </div>
                <div class="search">
                    <Button type="primary" class="wxbutton" @click="search">搜索</Button>
                </div>
            </div>
        </div>
        <!-- 搜索结束 -->
        <!-- 查询列表 -->
        <div class="search-content">
            <ul>
                <li class="item" v-for="(item,index) in resultList" :key="index">
                    <span>{{item.value}}</span>
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <!-- 查询列表结束 -->
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js';
import dates from '../../common/date.js';
export default {
    data () {
        return {
            dateText: ['日期', '今天', '昨天', '本周', '上周', '本月', '上月'],
            choiceDate: '',   //查询指定时间
            searchTime: [],   //日期选择器时间
            resultList: [],   //搜索结果
            canDatePick: false,  //是否禁用日期选择器
            canSpecialPick: false, //是否禁用指定日期选择
            params: {
                userCode: '',
                gtTime: '',
                ltTime: '',
            }
        }
    },
    methods: {
        getSelectDate (result) {
            if (result[0]) {
                this.canSpecialPick = true;
                this.params.gtTime = result[0];
                this.params.ltTime = result[1];
            } else {
                this.canSpecialPick = false;
                this.params.gtTime = '';
                this.params.ltTime = '';
            }
        },
        search () {
            this.getAgentList();
        },
        changeSpecialDate () { //选择指定日期
            if (typeof this.choiceDate === 'string') { //未选择指定日期
                this.canDatePick = false;
                this.params.gtTime = '';
                this.params.ltTime = '';
            } else {
                this.canDatePick = true;
                let dateArr = Array.from(dates);
                this.params.gtTime = dateUtil.getFormatDate(dateArr[this.choiceDate]().startTime)
                this.params.ltTime = dateUtil.getFormatDate(dateArr[this.choiceDate]().endTime);
            }
        },
        getAgentList () {
            this.$http.post('/api/v2/agent/queryTeamReport', this.params, { userId: true, unenc: true }).then((res) => {
                if (res.data.code !== 0) return;
                this.resultList = res.data.data;

            })
        }
    },
    created () {
        this.getAgentList();
    }
}
</script>

<style lang = "less">
.my-account {
    padding-top: 12px;
    .search-wrap {
        height: 30px;
        .lf {
            float: left;
            font-size: 0;
            .date {
                display: inline-block;
                vertical-align: top;
                font-size: 14px;
            }
            .selectDate {
                &:extend(.my-account .search-wrap .lf .date);
                margin-left: 22px;
            }
        }
        .rt {
            &:extend(.my-account .search-wrap .lf);
            float: right;
            .name {
                &:extend(.my-account .search-wrap .lf .date);
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
                &:extend(.my-account .search-wrap .lf .date);
                margin-left: 27px;
                .wxbutton {
                    width: 66px;
                }
            }
        }
    }
    .search-content {
        padding-top: 14px;
        ul {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .item {
                width: 171px;
                height: 84px;
                padding: 14px 0;
                line-height: 26px;
                margin-bottom: 22px;
                text-align: center;
                background-color: @agent-report-item-bg;
                span {
                    display: block;
                    &:first-child {
                        font-size: 14px;
                        color: @agent-report-item-fund-color;
                    }
                    &:last-child {
                        line-height: 30px;
                        font-size: 18px;
                    }
                }
            }
        }
    }
}
</style>