<template>
    <div class='page-wrapper'>
        <div class='first-page' @click='goFirstPage'>首页</div>
        <Page Page :total="total" :current="current" @on-change="changePage" :page-size="pageSize"></Page>
        <div class='last-page-wrapper'>
            <span class='last-page' @click='goLastPage'>末页</span>
            <span class='jump-to'>跳至</span>
            <input v-model="num" oninput="value = value.replace(/[^\d]/g,'')" @keyup.enter='jumpTo($event)'>页
            <!-- <Button type="ghost" class="page-sure" @click="clickForSure">确定</Button> -->
            <div class='first-page page-sure' @click='clickForSure'>确定</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        total: { //总个数
            type: Number,
            default: 0
        },
        currentPage: { //当前第几页
            type: Number,
            default: 1
        },
        pageSize: { //每一页显示多少条
            type: Number,
            default: 10
        }
    },
    watch: {
        currentPage (newVal) {
            this.current = newVal
        }
    },
    data () {
        return {
            num: '',
            current: this.currentPage //当前第几页
        }
    },
    computed: {
        totalPage () {
            return Math.ceil(this.total / this.pageSize);
        }
    },
    methods: {
        goFirstPage () { //去首页
            if (!this.totalPage || this.current === 1) {
                return
            }
            this.current = 1;
            this.getData();
        },
        goLastPage () { //去末页
            if (!this.totalPage || this.current === this.totalPage) {
                return
            }
            this.current = this.totalPage;
            this.getData();
        },
        clickForSure () {
            let val = this.num.replace(/\s/g, '')
            let somePage = parseInt(val);
            if (!this.totalPage || !somePage || isNaN(somePage) || this.current === somePage || somePage > this.totalPage) {
                this.$Message.info('没有这一页信息')
                return
            }
            this.num = ''
            this.current = somePage;
            this.getData();
        },
        jumpTo ($event) { //跳至某页
            let val = $event.target.value.replace(/\s/g, '');
            let somePage = parseInt(val);
            if (!this.totalPage || !somePage || isNaN(somePage) || this.current === somePage || somePage > this.totalPage) {
                $event.target.value = '';
                return
            }
            $event.target.value = '';
            this.current = somePage;
            this.getData();
        },
        changePage (page) { //(page组件)改变页数
            this.current = page;
            this.getData();
        },
        getData () { //获取分页数据
            this.$emit('get-Page-Data', this.current);
        }

    }
}
</script>
<style lang="less">
.page-wrapper .page-sure {
    // height: 24px;
    // line-height: 24px !important;
    // padding: 0 10px;
    margin-left: 5px;
    // margin-bottom: 4px;
    // border-color: #ccc;
}
.page-wrapper .page-sure span {
    font-size: 12px;
    display: block;
    height: 100%;
    line-height: inherit;
    margin-top: -2px;
    color: #7f7f7f;
}
.page-wrapper {
    position: relative;
    /* padding: 0 60px; */
    padding: 0;
    margin-top: 23px;
    text-align: center;
    font-size: 0px;
    color: #7f7f7f;
}
.page-wrapper .ivu-page-item-jump-next .ivu-icon.ivu-icon-ios-arrow-right,
.page-wrapper .ivu-page-item-jump-prev .ivu-icon.ivu-icon-ios-arrow-left,
.page-wrapper
    .ivu-page-item-jump-prev
    a:hover
    .ivu-icon.ivu-icon-ios-arrow-right,
.page-wrapper
    .ivu-page-item-jump-next
    a:hover
    .ivu-icon.ivu-icon-ios-arrow-left {
    color: @common-active-color;
}
.page-wrapper .first-page,
.page-wrapper .ivu-page,
.page-wrapper .last-page-wrapper {
    font-size: 12px;
    color: #7f7f7f;
}
.page-wrapper .ivu-page {
    display: inline-block;
    font-size: 0px;
    margin: 0 5px 0 5px;
}
.page-wrapper .ivu-page li {
    font-size: 12px;
    margin: 0 5px;
}
.ivu-page .ivu-page-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.ivu-page .ivu-page-item.ivu-page-item-active:hover a {
    color: #fff;
}
.ivu-page .ivu-page-item a {
    /* margin: 0 3px; */
    margin: 0;
    text-align: center;
}
.ivu-page .ivu-page-item.active a,
.ivu-page .ivu-page-item-active a {
    /* margin: 0 3px; */
    color: #fff;
}
.ivu-page .ivu-page-item,
.ivu-page .ivu-page-prev,
.ivu-page .ivu-page-next,
.ivu-page .ivu-page-item-jump-next,
.ivu-page .ivu-page-item-jump-prev,
.page-wrapper .first-page,
.last-page-wrapper .last-page,
.last-page-wrapper input {
    width: 24px;
    min-width: 24px;
    height: 24px;
    line-height: 23px;
}
.page-wrapper .first-page,
.page-wrapper .last-page-wrapper {
    display: inline-block;
    vertical-align: top;
}
.page-wrapper .first-page:hover,
.last-page-wrapper .last-page:hover {
    color: @common-active-color;
    border-color: @common-active-border-color;
}
.page-wrapper .first-page,
.last-page-wrapper .last-page,
.last-page-wrapper input {
    display: inline-block;
    width: 44px;
    border: 1px solid #ccc;
    border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -webkit-border-radius: 5px;
    -o-border-radius: 5px;
    cursor: pointer;
}
.ivu-page-options-elevator {
    color: #313131;
}
.last-page-wrapper .jump-to {
    margin: 0 13px;
}
.last-page-wrapper input {
    margin-right: 10px;
    text-align: center;
}
.last-page-wrapper input:focus,
.last-page-wrapper input:hover {
    border-color: @common-active-border-color;
}
.last-page-wrapper input:focus {
    outline: none;
}
</style>


