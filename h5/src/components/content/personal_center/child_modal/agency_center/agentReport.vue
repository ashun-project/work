<template>
    <div>
        <my-header title="代理报表" bkUrl="/agencyCenter">
            <span slot="h-left">
                <i @click="$router.go(-1)" class="iconfont icon-arrowLeft"></i>
            </span>
        </my-header>
        <p class="ui-split"></p>
        <div class="agent-search">
            <input v-model="param.userCode" placeholder="输入下级代理用户名" @input="userCodeChange" type="text" class="ui-input">
            <span class="search" @click="search">
                <i class="iconfont icon-search"></i> 搜索
            </span>
        </div>
        <div class="ui-search-from-to">
            <input id="start-time" v-model="param.gtTime" type="text" name="" readonly @click="selectDate(0)" placeholder="开始时间">
            <span>至</span>
            <input id="end-time" v-model="param.ltTime" type="text" name="" readonly @click="selectDate(1)" placeholder="结束时间">
            <!--  <a @click="refresh()">
                <strong>
                    <i class="iconfont icon-shuaxin"></i>&nbsp;</strong>重选</a> -->
            <history-select @get-history-select="getHistorySelect"></history-select>
        </div>
        <ul class="agent-reports clearfix">
            <li class="item" v-for="(item,index) of reportData" :key="index">
                <p class="val">{{item.value}}</p>
                <p class="key"> {{item.name}} </p>
            </li>
        </ul>
        <mt-datetime-picker type="date" ref="picker" v-model="pickerCurrentTime" @confirm="handleConfirm" :startDate="new Date('2017/01/01')" :endDate="new Date()" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
        </mt-datetime-picker>
    </div>
</template>
<script>
import dateUtil from "@/components/common/module_js/format_date.js";
export default {
    data () {
        return {
            param: {
                userCode: this.$route.query.userCode || '',
                gtTime: dateUtil.getFormatDate(new Date()),
                ltTime: dateUtil.getFormatDate(new Date()),
                flage: '01',// 01 :查询当前用户 ；02:查询下级用户
            },
            reportData: {},
            pickerCurrentTime: '',
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        handleConfirm (value) {
            if (this.dateStatus === 0) {
                this.param.gtTime = dateUtil.getFormatDate(value);
            } else {
                this.param.ltTime = dateUtil.getFormatDate(value);
            }
            if (this.param.gtTime && this.param.ltTime) {
                let startT = new Date(this.param.gtTime).getTime();
                let endT = new Date(this.param.ltTime).getTime();
                if (startT > endT) {
                    this.$Message('格式错误\n开始时间过大')
                    return;
                }
                this.search();
            }
        },
        refresh () {
            this.param.ltTime = '';
            this.param.gtTime = '';
            this.param.userCode = '';
            this.search();
        },
        selectDate (value) {
            if (value === 0) {
                this.pickerCurrentTime = this.param.gtTime;
            } else {
                this.pickerCurrentTime = this.param.ltTime;
            }
            this.dateStatus = value;

            this.pickerCurrentTime = this.pickerCurrentTime ? this.pickerCurrentTime : dateUtil.getFormatDate(new Date())
            this.$refs.picker.open();
        },
        userCodeChange () {
            if (!this.param.userCode) {
                this.search();
            }
        },
        search () {
            this.param.flage = this.param.userCode ? '02' : '01';
            this.$http.post('api/v2/agent/queryTeamReport', this.param, { userId: true, loading: true, noEncrypt: true }).then(res => {
                if (res.data.code !== 0) return
                this.reportData = res.data.data
            })
        },
        getHistorySelect (obj) {
            this.param.ltTime = obj.endTime;
            this.param.gtTime = obj.startTime;
            this.search();
        },
    },
    created () {
        this.search();
    }
};
</script>
<style lang="less">
@import './agency.less';
</style>
<style lang="less">
@rem: 40rem;
.agent-reports {
    padding: 20 / @rem 30 / @rem 0 30 / @rem;
    position: relative;
    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        left: 0;
        bottom: 0;
        background-color: #fff;
    }
    .item {
        width: 33.3333%;
        float: left;
        padding: 60 / @rem 10 / @rem;
        text-align: center;
        border-right: 1px solid #e7e7e7;
        border-bottom: 1px solid #e7e7e7;
        font-weight: bold;
        &:nth-child(3n) {
            border-right: 0;
        }
        &.nbb {
            border-bottom: 0;
        }
        .key {
            font-size: 28 / @rem;
            color: #333;
            height: 40 / @rem;
        }
        .val {
            color: #ff7614;
            font-size: 32 / @rem;
            height: 40 / @rem;
        }
    }
}
</style>
