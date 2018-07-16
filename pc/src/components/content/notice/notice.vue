<template>
    <div class="notice content">
        <div class="broad-list" v-show="broadList.length">
            <div class='top'></div>
            <div class='lottery-list-wrapper'>
                <ul>
                    <li v-for="item in broadList" :key="item.lotteryType" @click="changeBroad(item)">
                        <div class='lottery-title' :class="{active: code === item.code}">
                            <i v-if='item.lotteryType'><img :src="item.lotteryTypeIcon"></i>
                            <span>{{item.lotteryTypeName}}</span>
                        </div>
                    </li>
                </ul>
                <div class='lottery-list'>
                    <ul>
                        <li v-for='lotteryItem in subList' :key='lotteryItem.lotteryName' @click='lotteryResult(lotteryItem)'>{{lotteryItem.lotteryName}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="lottery-result">
            <h4 class="new-result">
                <i></i>
                <span>最新彩票开奖结果</span>
            </h4>
            <Table :columns="columns" :data="subList"></Table>
        </div>
    </div>
</template>

<script>
import getZodiac from "@/components/common/module_js/zodica.js";
import formatPcdd from "@/components/common/module_js/format_pcdd/format_pcdd.js";
import formatSsc from "@/components/common/module_js/format_ssc.js";
import formatKsan from "@/components/common/module_js/format_ksan.js";
import formatPk10 from "@/components/common/module_js/format_pk10.js";
export default {
    data () {
        return {
            lotteryName: null,
            code: "all",
            broadList: [],
            subList: [],
            resultList: [],
            columns: [
                { title: "彩种", key: "lotteryName", width: 94 },
                { title: "期号", key: "periodNo", width: 117 },
                {
                    title: "开奖时间",
                    key: "prizeTime",
                    width: 98,
                    render: (h, params) => {
                        return h('div', params.row.prizeTime.split(/\s+/).map(item => h('span', item)));
                    }
                },
                {
                    title: "开奖号码",
                    key: "lotteryNumber",
                    width: 322,
                    className: "num",
                    render: (h, params) => {
                        if (!params.row.lotteryNumber) {
                            return (h('span'), '正在开奖...');
                        }
                        let str = params.row.lotteryNumber.replace(/\+/g, ",");
                        let listArray = str.split(",");
                        if (params.row.code === 'pcdd') { //pcdd
                            listArray = formatPcdd(listArray);
                        }
                        let arr = [];
                        listArray.forEach((item, index) => {
                            if (params.row.code === '6hc') { //六合彩
                                getZodiac(params.row.prizeTime.replace(/-/g, "/")).forEach(value => {
                                    value.data.forEach((ball, idx) => {
                                        if (ball === item) {
                                            if (index === listArray.length - 2) {
                                                arr.push(
                                                    h(
                                                        "div",
                                                        {
                                                            class:
                                                                'sixpk-last-second',
                                                            domProps: {
                                                                innerHTML:
                                                                    "<span class=" +
                                                                    value.clrs[
                                                                    idx
                                                                    ] +
                                                                    "-sixpk>" +
                                                                    item +
                                                                    "</span><span>" +
                                                                    value.label +
                                                                    "</span>"
                                                            }
                                                        },
                                                        item
                                                    )
                                                );
                                                arr.push(
                                                    h("div", {
                                                        domProps: {
                                                            innerHTML:
                                                                '<i style="display:block;">+</i>'
                                                        }
                                                    })
                                                );
                                            } else {
                                                arr.push(
                                                    h(
                                                        "div",
                                                        {
                                                            style: {
                                                                display:
                                                                    "inline-block"
                                                            },
                                                            domProps: {
                                                                innerHTML:
                                                                    "<span class=" +
                                                                    value.clrs[
                                                                    idx
                                                                    ] +
                                                                    "-sixpk>" +
                                                                    item +
                                                                    "</span><span>" +
                                                                    value.label +
                                                                    "</span>"
                                                            }
                                                        },
                                                        item
                                                    )
                                                );
                                            }
                                            // }
                                        }
                                    });
                                });
                            } else if (params.row.code === 'pcdd') { //pcdd
                                // 幸运28
                                if (index === 1 || index === 3 || index === 5) {
                                    arr.push(h("i", item.content));
                                } else if (index === listArray.length - 1) {
                                    arr.push(
                                        h(
                                            "span",
                                            {
                                                class: `${item.clr}-pcegg`,
                                                domProps: {
                                                    innerHTML: "<span class = 'ball'>" + item.content + '</span>' + "<span  class = 'desc'>" + item.desc + '</span>'
                                                }
                                            },
                                            item.content
                                        )
                                    );
                                } else {
                                    arr.push(h("span", item.content));
                                }
                            } else if (params.row.code === "pk10") {
                                let clrInfo = formatPk10(item); //号码颜色信息
                                arr.push(
                                    h(
                                        "span",
                                        {
                                            style: {
                                                color: clrInfo.clr,
                                                background: `${clrInfo.bg}`,
                                            },
                                            class: 'pk10'
                                        },
                                        item
                                    )
                                );
                            } else if (params.row.code === "ksan") { // 快三
                                arr.push(
                                    h("span", {
                                        class: `ksan-${item}`
                                    })
                                );
                                if (index === listArray.length - 1) {
                                    let info = formatKsan(listArray);
                                    arr.push(
                                        h("span", '和值=' + info.sum + ' ' + info.size + ' | ' + info.num)
                                    );
                                }
                            } else if (params.row.code === 'ssc') {
                                arr.push(h('span', item));
                                if (index === listArray.length - 1) {
                                    let info = formatSsc(listArray);
                                    arr.push(h('span', info.sum + ' ' + info.size + ' | ' + info.num));
                                }
                            } else {
                                arr.push(h("span", item));
                            }
                        });
                        return h("div",
                            {
                                class: params.row.code === 'pcdd' ? 'pcdd-wrap' : (params.row.code === 'ksan' ? 'ksan-wrap' : params.row.code === 'ssc' ? 'ssc-wrap' : '')
                            },
                            arr);
                    }
                },
                {
                    title: "期数(每天)",
                    key: "prizeCount",
                    width: 86,
                    render: (h, params) => {
                        return h(
                            "span",
                            params.row.prizeCount === "0"
                                ? params.row.prizeIntervalDesc
                                : params.row.prizeCount + "期"
                        );
                    }
                },
                {
                    title: "开奖频率",
                    key: "prizeInterval",
                    width: 78,
                    render: (h, params) => {
                        return h("span", params.row.prizeInterval + "分");
                    }
                },
                {
                    title: "详情",
                    key: "action1",
                    width: 58,
                    render: (h, params) => {
                        return h(
                            "span",
                            {
                                style: { cursor: "pointer" },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "notice_detail",
                                            params: { id: params.row.lotteryId }
                                        });
                                    }
                                },
                                attrs: {
                                    title: '详情'
                                }
                            },
                            ""
                        );
                    }
                },
                {
                    title: "走势",
                    key: "action2",
                    width: 58,
                    render: (h, params) => {
                        return h(
                            "span",
                            {
                                style: { cursor: "pointer" },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "trend_detail",
                                            params: { id: params.row.lotteryId }
                                        });
                                    }
                                },
                                attrs: {
                                    title: '走势'
                                }
                            },
                            ""
                        );
                    }
                },
                {
                    title: "购买彩票",
                    key: "action3",
                    width: 89,
                    render: (h, params) => {
                        return h(
                            "button",
                            {
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "buyLottery",
                                            params: { id: params.row.lotteryId }
                                        });
                                    }
                                },
                                class: {
                                    "ivu-btn": true,
                                    "ivu-btn-warning": true
                                },
                                style: {
                                    width: "66px",
                                    height: "30px"
                                },
                                attrs: {
                                    disabled: params.row.status === '0'
                                }
                            },
                            "投注"
                        );
                    }
                }
            ]
        };
    },
    computed: {
        updateList () {
            return this.$store.state.updateNotice;
        }
    },
    watch: {
        updateList (n) {
            this.updataSubList(JSON.parse(n))
        }
    },
    methods: {
        updataSubList (obj) {
            // console.log(obj, '===========================')
            // let arr = JSON.parse(JSON.stringify(this.subList))
            let arr = JSON.parse(JSON.stringify(this.resultList));
            arr.forEach(item => {
                if (item.lotteryId === obj.lotteryId && obj.periodNo === item.periodNo) {
                    item.lotteryNumber = obj.lotteryNumber;
                }
            })
            // this.subList = arr;
            this.resultList = arr;
        },
        lotteryResult (item) {
            this.$router.push({
                name: "notice_detail",
                params: { id: item.lotteryId }
            });
        },
        changeBroad (item) {
            if (this.code === item.code) {
                return;
            }
            this.code = item.code;
            this.subList = item.lotteryList;
            if (this.code === "all") {
                this.subList = this.resultList;
                return;
            }
            let filterLottery = [];
            item.lotteryList.forEach(item => {
                filterLottery.push(
                    this.resultList.filter(
                        data => data.lotteryId === item.lotteryId
                    )[0]
                );
            });

			/**
			 * filterLottery   - - - -
			 * 
			 * ***/
            let LeeArr = []
            filterLottery.forEach(itm => {
                if (itm) {
                    LeeArr.push(itm)
                }
            })
            this.subList = LeeArr;
            // this.updataSubList();
        }
    },
    created () {
        let vm = this;
        this.$http
            .post("/api/v2/lottery/queryLotteryListGroupByType", '', { unenc: true })
            .then(response => {
                if (response.data.code !== 0) return;
                vm.broadList = response.data.data.lotteryTypeList;
            });
        this.$http
            .post("/api/v2/lottery/queryLotteryPrizeListByType", {
                lotteryType: ""
            }, { unenc: true })
            .then(response => {
                if (response.data.code !== 0) return;
                vm.resultList = response.data.data.lotteryPrizeList;
                vm.subList = vm.resultList;
            });
    }
};
</script>

<style lang="less">
.notice .broad-list {
    padding-top: 42px;
    font-size: 14px;
    margin-bottom: 30px;
    overflow: hidden;
}
.notice .broad-list .top {
    width: 100%;
    height: 62px;
    /* margin-left:2px; */
    background: url('/static/images/notice_broad.png') no-repeat;
}
.notice .lottery-list-wrapper {
    position: relative;
}
.notice .lottery-list-wrapper > ul {
    display: flex;
    width: 1000px;
    height: 46px;
    background: @notice-title-bg;
}
.notice .lottery-list-wrapper > ul > li {
    flex: 1;
    line-height: 46px;
    color: #fff;
}
.notice .broad-list li {
    float: left;
    text-align: center;
    cursor: pointer;
}
.notice .lottery-list li:hover {
    color: @common-active-color;
}
.notice .lottery-title.active {
    background: @notice-title-active-bg;
    color: #fff;
}
.notice .broad-list li i {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
}
.notice .broad-list li i img {
    width: auto;
    max-height: 20px;
}
.notice .lottery-title {
    width: 100%;
    background: @common-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease-in;
}
.notice .lottery-list-wrapper li span {
    display: inline-block;
    vertical-align: top;
    line-height: 46px;
}
.notice .lottery-list-wrapper li img {
    width: 22px;
    height: 22px;
    filter: brightness(2);
    -webkit-filter: brightness(2);
    -moz-filter: brightness(2);
    -ms-filter: brightness(2);
    -o-filter: brightness(2);
}
.notice .lottery-title:hover {
    background: @notice-title-active-bg;
}
.notice .lottery-list ul:after {
    display: block;
    content: '';
    clear: both;
    visibility: hidden;
}
.notice .lottery-list {
    width: 1000px;
    padding: 9px 0;
    background: @notice-sub-menu-bg;
    color: #313131;
    border: 1px solid @notice-sub-menu-border;
    border-top: none;
}

.notice .lottery-list li {
    position: relative;
    float: left;
    line-height: 27px;
    padding: 0 15px;
    text-align: center;
}
.notice .lottery-list li:after {
    position: absolute;
    display: block;
    content: '';
    width: 1px;
    height: 14px;
    right: 0;
    top: 7px;
    background: #989899;
}
.notice .lottery-list li:last-child:after {
    display: none;
}
/*开奖列表 */
.notice .lottery-result {
    margin-top: 30px;
    margin-bottom: 42px;
}
.notice .lottery-result td {
    height: 52px;
}
.notice .lottery-result td.num {
    font-size: 0;
}
.notice .lottery-result th.num span {
    background: none;
}
.notice .lottery-result td.num span {
    display: inline-block;
    width: 25px;
    height: 25px;
    margin: 0 2px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    font-size: 14px;
}
.notice .lottery-result .num span,
.notice .lottery-result .num .red-sixpk {
    background: radial-gradient(#ff6050 7%, #e50000);
    background: -webkit-radial-gradient(#ff6050 7%, #e50000);
    background: -o-radial-gradient(#ff6050 7%, #e50000);
    background: -moz-radial-gradient(#ff6050 7%, #e50000);
}
.notice .lottery-result .num .green-sixpk,
.notice .lottery-result .num .green-pcegg .ball {
    display: block;
    margin: 4px 0;
    background: radial-gradient(#1acb01 3%, #017019);
    background: -webkit-radial-gradient(#1acb01 3%, #017019);
    background: -o-radial-gradient(#1acb01 3%, #017019);
    background: -moz-radial-gradient(#1acb01 3%, #017019);
}
.notice .lottery-result .num .blue-sixpk,
.notice .lottery-result .num .blue-pcegg .ball {
    display: block;
    margin: 4px 0;
    background: radial-gradient(#007ef9 27%, #0035ae);
    background: -webkit-radial-gradient(#007ef9 27%, #0035ae);
    background: -o-radial-gradient(#007ef9 27%, #0035ae);
    background: -moz-radial-gradient(#007ef9 27%, #0035ae);
}
.notice .lottery-result .num .red-sixpk,
.notice .lottery-result .num .blue-sixpk,
.notice .lottery-result .num .green-sixpk {
    display: block;
    margin: 8px 2px 0;
}
.notice .lottery-result .num .red-sixpk + span,
.notice .lottery-result .num .blue-sixpk + span,
.notice .lottery-result .num .green-sixpk + span {
    background: none;
    color: #313131;
    text-align: center;
}
.notice .lottery-result .num .other-pcegg .ball {
    background: #aaa;
}
.notice .lottery-result .num .blue-pcegg,
.notice .lottery-result .num .red-pcegg,
.notice .lottery-result .num .green-pcegg,
.notice .lottery-result .num .other-pcegg {
    display: inline-block;
    width: auto;
    background: none;
}
.notice .lottery-result .num .blue-pcegg .ball,
.notice .lottery-result .num .red-pcegg .ball,
.notice .lottery-result .num .green-pcegg .ball,
.notice .lottery-result .num .other-pcegg .ball {
    display: inherit;
}
.notice .lottery-result td.num .sixpk-last-second {
    display: inline-block;
    height: 60px;
}
.notice .lottery-result .num .sixpk-last-second + div {
    display: inline-block;
    vertical-align: 26px;
    width: 10px;
    font-size: 14px;
}
.notice .lottery-result .num .pcdd-wrap {
    text-align: center;
}
.notice .lottery-result .num .pcdd-wrap i {
    font-size: 14px;
}
.notice .lottery-result .num .ksan-wrap {
    text-align: center;
    font-size: 0;
    display: inline-block;
}
.notice .lottery-result .num .ksan-wrap > span:last-child {
    display: inline-block;
    vertical-align: top;
    width: auto;
    background: none;
    color: rgb(49, 49, 49);
    border-radius: 0px;
    text-align: left;
}
.notice .lottery-result .num .ssc-wrap {
    text-align: center;
}
.notice .lottery-result .num .ssc-wrap > span:last-child {
    width: auto;
    background: none;
    color: rgb(49, 49, 49);
    text-align: left;
}
.notice .lottery-result .num .pk10 {
    border-radius: 2px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    -ms-border-radius: 2px;
    -o-border-radius: 2px;
}
.notice .lottery-result .num span .desc {
    width: auto;
    margin-left: 3px;
    background: none;
    border-radius: 0;
    -webkit-border-radius: 0;
    -o-border-radius: 0;
    -ms-border-radius: 0;
    -moz-border-radius: 0;
    color: #313131;
}
.notice .lottery-result td:nth-child(7) span,
.notice .lottery-result td:nth-child(8) span {
    display: block;
    width: 25px;
    height: 25px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -534px -287px;
}
.notice .lottery-result td:nth-child(7) span {
    background-position: -570px -287px;
}
.notice .lottery-result .num .ksan-1,
.notice .lottery-result .num .ksan-2,
.notice .lottery-result .num .ksan-3,
.notice .lottery-result .num .ksan-4,
.notice .lottery-result .num .ksan-5,
.notice .lottery-result .num .ksan-6 {
    border-radius: 0;
    background-color: none;
    background: url('/configstatic/pc/images/icon.png') no-repeat;
    background-position: -326px -463px;
}
.notice .lottery-result .num .ksan-2 {
    background-position: -355px -463px;
}
.notice .lottery-result .num .ksan-3 {
    background-position: -385px -463px;
}
.notice .lottery-result .num .ksan-4 {
    background-position: -414px -463px;
}
.notice .lottery-result .num .ksan-5 {
    background-position: -444px -463px;
}
.notice .lottery-result .num .ksan-6 {
    background-position: -473px -463px;
}
.notice .new-result {
    font-size: 16px;
    font-size: 0;
    line-height: 20px;
    font-weight: normal;
}
.notice .new-result i {
    display: inline-block;
    width: 27px;
    height: 27px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -547px -59px;
}
.notice .new-result span {
    display: inline-block;
    vertical-align: top;
    margin-left: 7px;
    margin-top: 4px;
    font-size: 16px;
}
.notice .lottery-result .ivu-btn.ivu-btn-warning {
    width: 66px;
    height: 30px;
}
.notice .lottery-result .ivu-table {
    font-size: 14px;
    color: #313131;
}
.notice .lottery-result .ivu-table tr:nth-child(even) td {
    background: @notice-tr-even-bg;
}
.notice .lottery-result .ivu-table th {
    height: 36px;
    color: #fff;
    font-weight: normal;
}
.notice .lottery-result .ivu-table td {
    height: 72px;
}
.notice .lottery-result thead th {
    width: 94px;
}
.notice .lottery-result thead th:nth-child(2) {
    width: 117px;
}
.notice .lottery-result thead th:nth-child(3) {
    width: 98px;
}
.notice .lottery-result thead th:nth-child(4) {
    width: 330px;
}
.notice .lottery-result thead th:nth-child(5) {
    width: 86px;
}
.notice .lottery-result thead th:nth-child(6) {
    width: 78px;
}
.notice .lottery-result thead th:nth-child(7) {
    width: 58px;
}
.notice .lottery-result thead th:nth-child(8) {
    width: 59px;
}
.notice .lottery-result thead th:nth-child(9) {
    width: 89px;
    padding-left: 10px;
}
.notice .lottery-result thead th:nth-child(9) .ivu-table-cell {
    padding-left: 8px !important;
}
.notice .lottery-result .ivu-table th:first-child,
.notice .lottery-result .ivu-table td:first-child {
    padding-left: 10px;
}
.notice .lottery-result .ivu-table th:nth-child(4),
.notice .lottery-result .ivu-table td:nth-child(4) {
    text-align: center;
}
.notice .lottery-result .ivu-table td:last-child .ivu-table-cell {
    margin-left: -2px;
}
.notice .lottery-result .ivu-table tr td:nth-child(3) span {
    display: block;
    line-height: 25px;
    margin: 4px 0;
}
.notice .lottery-result .ivu-table-cell {
    padding-left: 0;
    padding-right: 0;
}
.notice .ivu-table th,
.notice .ivu-table td {
    border: none;
}
.notice .lottery-result .ivu-table-wrapper {
    border: none;
}
.notice .ivu-table {
    border: none;
}
.notice .ivu-table:after,
.notice .ivu-table:before {
    width: 0;
}
.notice .ivu-table-body {
    border: none;
}
.notice .ivu-table-body {
    margin-right: 0 !important;
    border: 1px solid #e2e2e2;
    border-top: none;
}
</style>
