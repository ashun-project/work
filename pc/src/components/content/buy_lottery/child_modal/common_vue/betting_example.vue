<template>
    <div class="example-wrap">
        <div class="example">
            <Icon type="clipboard"></Icon>&nbsp;&nbsp;范例
            <div class="info">
                <Icon type="arrow-down-b"></Icon>
                <span>{{bettingExample}}</span>
            </div>
        </div>
        <div class="example">
            <Icon type="ribbon-a"></Icon>&nbsp;&nbsp;中奖说明
            <div class="info">
                <Icon type="arrow-down-b"></Icon>
                <span>{{prizeDesc}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        bettingExample: {
            type: String,
            default: ''
        },
        prizeDesc: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="less" scoped>
.example-wrap .example {
    position: relative;
    float: left;
    padding: 3px 13px;
    border: 1px solid @tab-menu-example-border;
    color: @tab-menu-example-color;
    border-radius: 3px;
}
.example-wrap .example:last-child {
    margin-left: 10px;
}
.example-wrap .example:hover .info {
    display: block;
}
.example-wrap .example > i {
    font-size: 16px;
}
.example-wrap .example .info {
    position: absolute;
    bottom: 45px;
    right: 0px;
    background: @tab-menu-example-bg;
    min-width: 400px;
    color: #fff;
    padding: 10px;
    border-radius: 3px;
    display: none;
}
.example-wrap .example .info i {
    position: absolute;
    bottom: -16px;
    right: 15px;
    color: @tab-menu-example-bg;
    font-size: 26px;
}
</style>


