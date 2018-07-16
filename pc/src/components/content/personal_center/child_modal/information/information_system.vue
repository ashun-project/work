<template>
    <div class="information-system">
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
            <span class="mtitle">标题</span>
            <span class="mdate">日期</span>
        </div>
        <div class="list-wrap">
            <ul>
                <li v-for="item in datas" :key="item.essayId" :class="{active: item.essayId == dataId}" @click="dataId === item.essayId ? dataId = '' : dataId = item.essayId" class="all">
                    <div class="newslist lee-newsList">
                        <!-- <span class="sender">系统消息</span> -->
                        <span class="mtitle">{{item.title}}</span>
                        <span class='mdate'>{{fDate(item.createDate)}}</span>
                    </div>
                    <transition name='newscontent'>
                        <div class="news-content" v-if="item.essayId == dataId">
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
import formatDate from "@/components/common/module_js/format_date.js";
import page from "@/components/common/module_vue/page.vue";
export default {
    components: { page },
    data () {
        return {
            // essayId:'',
            dataId: '',
            datas: [],
            informateTime: [],
            paramData: {
                current: 1,
                size: 5,
                total: 0,
                type: "01",
                startTime: "",
                endTime: ""
            }
        };
    },
    watch: {
        '$route' () {
            this.getData();
            this.dataId = this.$route.query.essayId;
        }
    },
    methods: {
        clickDiv (value, idx) {
            let vm = this;
            var v = value;
            v.isShow = !v.isShow;
            vm.datas.splice(idx, 1, v);
        },
        escapeHtml (str) {
            var arrEntities = {
                lt: "<",
                gt: ">",
                nbsp: " ",
                amp: "&",
                quot: '"'
            };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
                return arrEntities[t];
            });
        },
        // fDate(value){
        //     return formatDate.getFormatDate(value,'yymmddhhmmss');
        // },
        search () {
            // this.startTime = this.informateTime[0] || '';
            // this.endTime = this.informateTime[1] || '';
            this.getData(1);
        },
        fDate (value) {
            return formatDate.getFormatDate(value, "yymmddhhmmss");
        },
        getData (page = 1) {
            let vm = this;
            let params = Object.assign({}, this.paramData);
            if (this.informateTime.length) {
                if (this.informateTime[0] !== null) {
                    params.startTime = formatDate.getFormatDate(
                        this.informateTime[0]
                    );
                } else {
                    params.startTime = "";
                }
                if (this.informateTime[1] !== null) {
                    params.endTime = formatDate.getFormatDate(
                        this.informateTime[1]
                    );
                } else {
                    params.endTime = "";
                }
            }
            params.current = page;
            this.$http
                .post("/api/v2/cms/queryAnnounceEssayList", params, { unenc: true }).then(response => {
                    if (response.data.code !== 0) return;
                    let data = response.data.data;
                    vm.datas = data.list;
                    vm.datas.forEach(element => {
                        element.isShow = false;
                    });
                    vm.$set(vm.paramData, "total", data.total);
                });
        }
    },
    created () {
        let essayId = this.$route.query.essayId;
        if (essayId) {
            this.dataId = essayId;
        }
        this.getData();
    }
};
</script>
<style lang = "less">
@fr: right;
.height(@he;@lh) {
    height: @he;
    line-height: @lh;
}
.information-system {
    width: 742px;
    font-size: 14px;
    .search {
        height: 30px;
        text-align: @fr;
        .button {
            float: @fr;
            margin-left: 20px;
            .wxbutton {
                width: 66px;
            }
        }
        .datetext {
            float: @fr;
            margin-top: 4px;
            margin-left: 5%;
        }
        .selectDate {
            float: @fr;
            margin-left: 2px;
        }
    }
    .newstitle {
        .height(36px;36px);
        font-size: 12px;
        padding-left: 18px;
        margin-top: 13px;
        color: #f1f1f1;
        background-color: @common-bg;
        .mtitle {
            width: 74%;
        }
        .mdate {
            width: 24%;
        }
    }
    .list-wrap {
        width: 100%;
        font-size: 12px;
        li {
            img {
                width: auto;
                float: none;
            }
            &.no-data {
                text-align: center;
                line-height: 35px;
            }
            .newslist {
                .height(36px;36px);
                text-align: left;
                padding-left: 18px;
                display: flex;
            }
        }
    }
}
.lee-newsList span:first-child {
    width: 68%;
}
.information-system .newslist {
    height: 36px;
    text-align: left;
    line-height: 36px;
    padding-left: 18px;
}
.information-system .newstitle span,
.information-system .newslist span {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.information-system .all {
    cursor: pointer;
}
.information-system .no-data.all {
    text-align: center;
    line-height: 36px;
    height: 36px;
    font-size: 12px;
}

.information-system .all:hover {
    background: #ebf7ff;
}
.information-system .active {
    color: @common-active-color;
}
.information-system .all.active .newslist {
    background: #fff;
}
.information-system .active .news-content {
    background: #fff;
}
.information-system .all:nth-child(odd).active .newslist {
    border-bottom: 1px dashed @common-color;
}
.information-system .all:nth-child(even) {
    background: #ebebeb;
}
.information-system .active .news-content {
    background-color: #fff;
}
.information-system .news-content {
    padding-left: 18px;
    /* height:70px; */
    padding: 10px 18px;
    color: #313131;
    font-size: 12px;
}
.information-system .news-content p {
    line-height: 18px;
    text-indent: 22px;
    word-wrap: break-word;
}
.information-system .newscontent-enter-active,
.information-system .newscontent-leave-active {
    transition: all 0.05s ease;
    -webkit-transition: all 0.05s ease;
    -o-transition: all 0.05s ease;
    -moz-transition: all 0.05s ease;
    -ms-transition: all 0.05s ease;
}
.information-system .newscontent-enter,
.information-system .newscontent-leave-to {
    height: 0;
}
</style>
