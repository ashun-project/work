<template>
    <div class="my-account">
        <div class="tab">
            <ul>
                <li v-for="item in tabList" :key="item.label" @click="label = item.label" :class="{active: label === item.label}">
                    <span>{{item.name}}</span>
                    <i v-if="item.interval"></i>
                </li>
            </ul>
        </div>
        <div class="account-content">
            <reportTeam v-if="label === 'report_team'"></reportTeam>
            <reportOne v-if="label === 'report_one'"></reportOne>
        </div>
    </div>
</template>

<script>
import reportTeam from './report_team'
import reportOne from './report_one'
export default {
    components: {
        reportTeam,
        reportOne
    },
    data () {
        return {
            label: 'report_team',
            tabList: [
                { name: '团队报表', label: 'report_team', interval: true },
                { name: '个人报表', label: 'report_one' }
            ]
        }
    },
    created () {

    }
}
</script>

<style lang = "less">
.my-account {
    .tab {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        border-bottom: 2px solid @common-border-color;
        ul {
            li {
                float: left;
                padding: 0 20px;
                cursor: pointer;
                height: 40px;
                position: relative;
                &.active {
                    color: @common-active-color;
                    border-bottom: 2px solid @common-active-border-color;
                }
                i {
                    position: absolute;
                    right: 0;
                    top: 15px;
                    height: 10px;
                    width: 1px;
                    background: #c0c0c0;
                }
            }
        }
    }
    .account-content {
        padding-top: 15px;
    }
}
</style>