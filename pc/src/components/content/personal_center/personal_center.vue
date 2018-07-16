<template>
    <div class="personal-center content">
        <div class="nav lf">
            <div class='vip-info'>
                会员中心
            </div>
            <ul>
                <li v-for="item in personCenter" v-if='item.label' :key="item.label" :class="{active: item.label == view}" @click="changeTab(item.label)">
                    <i :class="item.label==view ? item.bgClass + '-active' : item.bgClass"></i>
                    <span>{{item.name}}</span>
                </li>
            </ul>
            <div class='vip-info' v-if="user&&user.userType !== '08'">代理中心</div>
            <ul v-if="user&&user.userType !== '08'">
                <li v-for="item in agencyCenter" v-if='item.label' :key="item.label" :class="{active: item.label == view}" @click="changeTab(item.label)">
                    <i :class="item.label==view ? item.bgClass + '-active' : item.bgClass"></i>
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <div class="personal-content rf">
            <component :is="view"></component>
        </div>
        <div class="clr"></div>
    </div>
</template>

<script>
import personalContent from './child_modal/index'
export default {
    components: personalContent,
    data () {
        // 资金密码的规则方法
        const addCapitalRealName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入真实姓名'));
            } else {
                callback();
            }
        }
        const addCapitalPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.addObj.payPwdCheck !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.addCustom.validateField('payPwdCheck');
                }
                callback();
            }
        };
        const addCapitalPassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.addObj.payPwd) {
                callback(new Error('两次输入密码不匹配'));
            } else {
                callback();
            }
        };
        return {
            view: 'account',
            user: '',
            personCenter: [
                { name: '我的账号', label: 'account', 'bgClass': 'i-account' },
                { name: '投注记录', label: 'record', 'bgClass': 'i-bett-record' },
                { name: '交易明细', label: 'trade', 'bgClass': 'i-transaction-details' },
                { name: '个人报表', label: 'report', 'bgClass': 'i-personal-report' },
                { name: '最新信息', label: 'information', 'bgClass': 'i-new-info' }
            ],
            agencyCenter: []
        }
    },
    watch: {
        '$route' (n) {
            // this.getAuth(n.params.id);
            this.view = n.params.id;
        }
    },
    methods: {
        changeTab (label) {
            if (label) {
                this.$router.push({ 'params': { 'id': label, label: '' } });
            }
        }
        // getAuth (id) {
        //     // 权限控制
        //     if (this.user && this.user.userType !== '10') {
        //         let label = ['userManage', 'override', 'expand', 'teamReport'];
        //         if (this.user.userType === '09') {
        //             label = label.concat(['recharge', 'withdraw']);
        //         }
        //         if (label.some(value => value === id)) {
        //             id = 'account';
        //             this.$router.push({'params' : {'id' : id}});
        //         }
        //     }
        //     this.view = id;
        // }
    },
    created () {
        this.view = this.$route.params.id;
        let user = localStorage.getItem('user');
        // console.log(user);
        if (!user) {
            return
        }
        this.user = JSON.parse(user);
        if (this.user !== null) {
            if (this.user.userType === '10' || this.user.userType === '00') {
                this.personCenter.splice(1, 0, { name: '在线充值', label: 'recharge', 'bgClass': 'i-funds' });
                this.personCenter.splice(2, 0, { name: '在线提现', label: 'withdraw', 'bgClass': 'i-online-withdrawal' });
            }
            if (this.user.userType === '10' || this.user.userType === '08') {//会员与代理
                this.agencyCenter.push(
                    { name: '代理说明', label: 'description', 'bgClass': 'i-report-description' },
                    { name: '会员管理', label: 'userManage', 'bgClass': 'i-user-manager' },
                    { name: '推广管理', label: 'expand', 'bgClass': 'i-promote-management' },
                    { name: '代理佣金', label: 'override', 'bgClass': 'i-acting-commission' },
                    { name: '代理报表', label: 'agentReport', 'bgClass': 'i-personal-report' },
                    { name: '代理投注明细', label: 'agentBetting', 'bgClass': 'i-agent-betting' },
                    { name: '代理交易明细', label: 'agentTrade', 'bgClass': 'i-agent-trade' }
                );
            }
        }
    }
}

</script>

<style lang="less" scoped>
.personal-center {
    padding: 30px 0;
    margin: 0 auto;
}
.personal-center .nav {
    width: 200px;
    height: 745px;
    border: 1px solid @common-border-color;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    text-align: center;
    min-height: 100%;
    padding: 10px 12px;
}
.personal-center .nav .vip-info {
    line-height: 30px;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    color: #313131;
    border-bottom: 1px dashed @common-border-color;
}
.personal-center .nav ul {
    padding-top: 10px;
    color: #313131;
}
.personal-center .nav li {
    position: relative;
    line-height: 35px;
    margin: 10px 0;
}
.personal-center .nav li i {
    display: inline-block;
    position: absolute;
    left: 32px;
    top: 9px;
}
.personal-center .nav li span {
    display: block;
    width: 100%;
    font-size: 14px;
    cursor: pointer;
    border-radius: 3px;
    padding-left: 60px;
    text-align: left;
}
.personal-center .nav li.active span,
.personal-center .nav li.active span:hover {
    background: @common-bg;
    color: #fff;
}
.personal-center .nav li span:hover {
    background: #f6f6f6;
}
.personal-center .personal-content {
    width: 780px;
    min-height: 745px;
    border: 1px solid @common-border-color;
    padding: 10px 19px 10px;
    position: relative;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -ms-border-radius: 4px;
    -moz-border-radius: 4px;
    -o-border-radius: 4px;
}
</style>

