<template>
    <div class="my-account">
        <div class="tab">
            <ul>
                <li v-for="item in tabList" :key="item.label" @click="changeLabel(item)" :class="{active: label === item.label}">
                    <span>{{item.name}}</span>
                    <i v-if="item.interval"></i>
                </li>
            </ul>
        </div>
        <div class="account-content">
            <member v-if="label === 'information_member'"></member>
            <system v-if="label === 'information_system'"></system>
        </div>
    </div>
</template>

<script>
import member from './information_member'
import system from './information_system'
export default {
    components: {
        member,
        system
    },
    data () {
        return {
            model1: '',
            // essayId: '',
            label: 'information_member',
            tabList: [
                { name: '会员消息', label: 'information_member', interval: true },
                { name: '系统公告', label: 'information_system' }
            ]
        }
    },
    watch: {
        '$route' () {
            if (this.$route.query.essayId) {
                if (this.label !== 'information_system') {
                    this.label = 'information_system';
                } else {
                    // this.$router.push(`/personalCenter/information?essayId=${this.$route.query.essayId}`);
                }
            }
        }
    },
    methods: {
        changeLabel (item) {
            this.$router.push('/personalCenter/information');
            this.label = item.label;
        }
    },
    created () {
        if (this.$route.query.essayId) {
            this.label = 'information_system';
        }
    }
}
</script>

<style lang = "less">
.my-account {
    width: 742px;
    .tab {
        height: 40px;
        line-height: 38px;
        font-size: 16px;
        border-bottom: 2px solid @common-border-color;
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
    .account-content {
        padding-top: 15px;
    }
}
</style>