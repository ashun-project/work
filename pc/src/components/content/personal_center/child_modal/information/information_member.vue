<template>
    <div class="information-member">
        <div class="search">
            <div class="button">
                <Button type="primary" class="wxbutton" @click="search">搜索</Button>
            </div>
            <div class="selectDate">
                <Row>
                    <Col span="12">
                    <DatePicker v-model="informateTime" type="daterange" placement="bottom-end" placeholder="请选择查询时间" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </div>
            <div class="datetext">起始日期：</div>
        </div>

        <div class="newstitle">
            <span class="sender">发件人</span>
            <span class="mtitle">标题</span>
            <span class="mdate">日期</span>
        </div>
        <div style='width:100%;'>
            <ul>
                <li v-for="(item, idx) in datas" :key="idx" :class="{active: item.notifyId == dataId}" @click="dataId === item.notifyId ? dataId = '' : dataId = item.notifyId" class="all">
                    <div class="newslist">
                        <span class="sender">系统消息</span>
                        <span class="mtitle">{{item.title}}</span>
                        <span class='mdate'>{{fDate(item.createTime)}}</span>
                    </div>
                    <transition name='newscontent'>
                        <div class="news-content" v-if="item.notifyId == dataId">
                            <p v-html="escapeHtml(item.content)"></p>
                        </div>
                    </transition>
                </li>
                <li class="no-data all" v-if="!datas.length" style='text-align:center;font-size:12px;line-height:36px;'>
                    暂无数据
                </li>
            </ul>
        </div>
        <page :total="paramData.total" :current="paramData.current" :pageSize="10" @get-Page-Data="getData"></page>
    </div>
</template>
<script>
import formatDate from '@/components/common/module_js/format_date.js'
import page from '@/components/common/module_vue/page.vue'
export default {
    components: { page },
    data () {
        return {
            // essayId:'',
            dataId: '',
            datas: [],
            // startTime: '',
            // endTime: '',
            informateTime: [],
            paramData: {
                current: 1,
                size: 5,
                total: 0
            }
        }
    },
    methods: {
        escapeHtml (str) {
            var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
        },
        fDate (value) {
            return formatDate.getFormatDate(value, 'yymmddhhmmss');
        },
        search () {
            this.getData(1);
        },
        getData (page = 1) {
            let vm = this;
            let params = Object.assign({}, this.paramData);
            if (this.informateTime.length) {
                if (this.informateTime[0] !== null) {
                    params.startTime = formatDate.getFormatDate(this.informateTime[0]);
                } else {
                    params.startTime = '';
                }
                if (this.informateTime[1] !== null) {
                    params.endTime = formatDate.getFormatDate(this.informateTime[1]);
                } else {
                    params.endTime = '';
                }
            }
            params.current = page;
            this.$http.post('/api/v2/user/queryUserMessage', params, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                let data = response.data.data;
                vm.datas = data.messageList;
                vm.$set(vm.paramData, 'total', data.total);
            })
        }
    },
    created () {
        this.getData();
    }
}
</script>
<style lang="less">
.information-member {
    width: 742px;
}
.information-member .search {
    height: 30px;
    text-align: right;
}
.information-member .selectWay {
    width: 100px;
    float: left;
}
.information-member .datetext {
    float: right;
    /* font-size: 14px; */
    margin-top: 4px;
    margin-left: 5%;
}
.information-member .selectDate {
    float: right;
    margin-left: 2px;
}
.information-member .button {
    float: right;
    margin-left: 20px;
}
.information-member .wxbutton {
    width: 66px;
}
.information-member .all {
    cursor: pointer;
}
.information-member li img {
    width: auto;
    float: none;
}
.information-member li.no-data {
    text-align: center;
    line-height: 40px;
    font-size: 12px;
}
.information-member .newslist {
    height: 36px;
    text-align: left;
    line-height: 36px;
    padding-left: 18px;
}
.information-member .newstitle {
    height: 36px;
    background-color: @common-bg;
    color: #fff;
    padding-left: 18px;
    margin-top: 13px;
    /* font-size:14px; */
    line-height: 36px;
}
.information-member .newstitle span,
.information-member .newslist span {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
}
.information-member .sender {
    width: 13%;
}
.information-member .mtitle {
    width: 61%;
}
.information-member .mdate {
    width: 22%;
}
.information-member .active {
    color: @common-active-color;
}
.information-member .all:nth-child(even) {
    background: #ebebeb;
}
.information-member .all:hover {
    background: #ebf7ff;
}
.information-member .active .newslist {
    border-bottom: 1px dashed @common-active-border-color;
    background: #fff;
}
.information-member .news-content {
    padding-left: 18px;
    padding: 10px 18px;
    color: #313131;
    font-size: 12px;
}
.information-member .news-content p {
    line-height: 18px;
    text-indent: 22px;
    word-wrap: break-word;
}
.information-member .all:hover .news-content {
    background: #fff;
}
.information-member .newscontent-enter-active,
.information-member .newscontent-leave-active {
    transition: all 0.05s ease;
    -webkit-transition: all 0.05s ease;
    -o-transition: all 0.05s ease;
    -moz-transition: all 0.05s ease;
    -ms-transition: all 0.05s ease;
}
.information-member .newscontent-enter,
.information-member .newscontent-leave-to {
    height: 0;
}
</style>
