<template>
    <div class="ui-select-type yj-select">
        <span class="lb" @click="typeListShow = !typeListShow">
            <span>{{currentTxt}}</span>
            <i data-v-53537f9e="" class="iconfont icon-arrowDown"></i>
        </span>
        <ul class="list" :class="{show: typeListShow}">
            <li @click="selectType('今天')">
                <span>今天</span>
            </li>
            <li @click="selectType('昨天')">
                <span>昨天</span>
            </li>
            <li @click="selectType('本周')">
                <span>本周</span>
            </li>
            <li @click="selectType('本月')">
                <span>本月</span>
            </li>
            <li @click="selectType('上月')">
                <span>上月</span>
            </li>
        </ul>
        <div class="shawdow" @click="typeListShow = false" v-show="typeListShow"></div>
    </div>
</template>

<script>
import dateUtil from "@/components/common/module_js/format_date.js";
export default {
    data () {
        return {
            typeListShow: false,
            currentTxt: '今天'
        }
    },
    methods: {
        selectType (type) {
            this.typeListShow = false;
            this.currentTxt = type;
            let obj = {};
            let days = 0;
            let currentDate = new Date();
            obj.endTime = dateUtil.getFormatDate(currentDate);
            switch (type) {
                case '今天':
                    days = 0;
                    break;
                case '昨天':
                    days = 1;
                    obj.endTime = dateUtil.getFormatDate(new Date(currentDate.getTime() - days * 24 * 3600 * 1000));
                    break;
                case '本周':
                    days = currentDate.getDay() - 1;
                    break;
                case '本月':
                    days = currentDate.getDate() - 1;
                    break;
                case '上月':
                    let lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                    let lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    obj.endTime = dateUtil.getFormatDate(lastMonthEnd);
                    days = (currentDate.getTime() - lastMonthStart.getTime()) / 24 / 60 / 60 / 1000;
                    break;
                default:
                    days = 0;
                    break;
            }
            obj.startTime = dateUtil.getFormatDate(
                new Date(currentDate.getTime() - days * 24 * 3600 * 1000)
            );
            this.$emit('get-history-select', obj)
        }
    }
}
</script>

<style lang="less" scoped>
@rem: 40rem; //根据页面尺寸算的
.yj-select {
    .list {
        border: 1px solid #999;
        left: 50%;
        width: 150 / @rem;
        text-align: center;
        margin-left: -75 / @rem;
        li {
            border-bottom: 1px solid #c3c3c3;
            line-height: 60 / @rem;
            &:last-child {
                border-bottom: 0;
            }
            span {
                color: #333;
            }
        }
    }
}
</style>
