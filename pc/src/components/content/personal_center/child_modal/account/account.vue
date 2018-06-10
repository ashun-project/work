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
            <material v-if="label === 'material'"></material>
            <modify-password v-else-if="label === 'modifyPassword'"></modify-password>
            <card v-else></card>
        </div>
    </div>
</template>

<script>
import material from './material'
import modifyPassword from './modify_password'
import card from './card'
export default {
    components: {
        material,
        modifyPassword,
        card
    },
    data () {
        return {
            label: this.$route.params.label || 'material',
            tabList: [
                { name: '基本资料', label: 'material', interval: true },
                { name: '修改密码', label: 'modifyPassword', interval: true },
                { name: '银行账号', label: 'card' }
            ],

        }
    },
    created () {
        // let param = this.$route.params.label;
        // if (param.label) {

        // }
    }
}
</script>

<style lang="less" scoped>
.tab {
    height: 40px;
    line-height: 38px;
    font-size: 16px;
    border-bottom: 2px solid @common-border-color;
}
.tab li {
    float: left;
    padding: 0 28px;
    cursor: pointer;
    height: 40px;
    position: relative;
}
.tab li.active {
    border-bottom: 2px solid @common-active-border-color;
    color: @common-active-color;
}
.tab li i {
    position: absolute;
    right: 0;
    top: 14px;
    height: 12px;
    width: 1px;
    background: #c0c0c0;
}
.account-content {
    padding-top: 38px;
}
</style>

