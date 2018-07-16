<template>
    <div class="lottery-head">
        <div class="container">
            <div class="acount lf" v-if="user.userCode">
                <span class="lf">账号&nbsp;:&nbsp;
                    <span class="user-name">{{user.userCode}}</span>
                </span>
                <span class="balance lf">
                    余额:&nbsp;
                    <span>{{Number(user.balance).toFixed(2)}}
                        <i class="i-icon i-refresh-white" @click="queryBalance()" :class="{'turn-round':turnRound}"></i>
                    </span>
                </span>
            </div>
            <div class="list rf">
                <ul class="lf">
                    <li v-for="(item, idx) in list" :key="idx" :class="{'auth-hide': item.setAuth && (user.userType === '09' || user.userType === '08')}">
                        <i class="i-icon" :class="item.icon"></i>
                        <router-link :to="item.url" v-if="item.url&&idx !== 1">{{item.label}}</router-link>
                        <a :href="servicer.url" v-else-if='idx === 1' target='_blank'>{{item.label}}</a>
                        <a :href="servicer.url" v-else>{{item.label}}</a>
                    </li>
                </ul>
                <button class="lf btn sign sign-out" @click="signOut()" v-if="user&&user.userId">
                    <Icon type="log-out"></Icon>登出</button>
                <button class="lf btn sign sign-in" @click="sign()" v-else>
                    <Icon type="log-in"></Icon>登入</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            turnRound: false,
            list: [
                { label: '返回首页', icon: 'i-home', url: '/' },
                { label: '在线客服', icon: 'i-custom', url: '' },
                { label: '投注记录', icon: 'i-record i-icon', url: '/personalCenter/record' },
                { label: '会员中心', icon: 'i-user-center', url: '/personalCenter/account' },
                { label: '线上充值', icon: 'i-recharge', url: '/personalCenter/recharge', setAuth: true },
                { label: '线上取款', icon: 'i-draw-money', url: '/personalCenter/withdraw', setAuth: true }
            ]
        }
    },
    computed: {
        servicer () {
            return this.$store.state.servicer;
        },
        user () {
            return this.$store.state.user
        },
    },
    methods: {
        signOut () {
            let vm = this;
            this.$http.post('/api/v2/user/loginOut', '', { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                localStorage.setItem('user', '');
                vm.$store.commit('getUser', '');
                vm.$router.push('/login');
                // window.location.reload();
            })
        },
        queryBalance () {
            let vm = this;
            this.turnRound = true;
            this.$http.post('/api/v2/user/queryBalance', '', { userId: true, unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.turnRound = false;
                vm.$set(vm.user, 'balance', response.data.data.balance);
                localStorage.setItem('user', JSON.stringify(vm.user));
            })
        },
        sign () {
            // this.$router.push('/login');
            this.$store.commit('getShowLoginDialog', true);
        }

    },
    created () {
        this.$http.post('/api/v2/cms/queryQrcodesAndServicer', '', { unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            this.list[1].url = response.data.data.servicer.url;
            this.$store.commit('getServicer', response.data.data.servicer);
        })
    }
}
</script>

<style lang="less" scoped>
.lottery-head {
    height: 50px;
    line-height: 50px;
    background: @lottery-head-bg;
    color: #fff;
    margin-bottom: 15px;
    font-size: 14px;
    min-width: 1360px;
}
.lottery-head .container {
    width: 1360px;
    margin: 0 auto;
}
.lottery-head .acount .user-name,
.lottery-head .acount .balance span {
    color: @buy-lottery-common-color;
}
.lottery-head .acount .balance {
    float: left;
    height: 25px;
    line-height: 25px;
    border-radius: 3px;
    background: @buy-lottery-common-bg;
    padding: 0 40px 0 10px;
    margin-top: 12px;
    margin-left: 10px;
    position: relative;
}
.lottery-head .acount .balance .i-icon {
    position: absolute;
    right: 10px;
    top: 3px;
    cursor: pointer;
}
.lottery-head .list li {
    float: left;
    padding-left: 32px;
    margin-left: 10px;
    cursor: pointer;
    position: relative;
}
.lottery-head .list li.auth-hide {
    display: none;
}
.lottery-head .list li .i-icon {
    position: absolute;
    top: 10px;
    left: 0;
}
.lottery-head .list li i.i-draw-money {
    top: 12px;
}
.lottery-head .list li a {
    color: #fff;
}
.lottery-head .list li a:hover {
    color: @lottery-head-text-hover-color;
}
.lottery-head .list .sign {
    padding: 0 10px 0 35px;
    border-color: #fff;
    color: #fff;
    line-height: 30px;
    margin-top: 10px;
    margin-left: 10px;
    position: relative;
}
.lottery-head .list .sign:hover {
    background: @buy-lottery-common-bg;
    color: #fff;
    border-color: @lottery-head-btn-border-color;
}
.lottery-head .list .sign i {
    position: absolute;
    left: 8px;
    top: 4px;
    font-size: 22px;
}
@keyframes rotating {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@-webkit-keyframes rotating {
    0% {
        -webkit-tranform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}
@-ms-keyframes rotating {
    0% {
        -ms-tranform: rotate(0deg);
    }
    100% {
        -ms-transform: rotate(360deg);
    }
}
@-moz-keyframes rotating {
    0% {
        -moz-tranform: rotate(0deg);
    }
    100% {
        -moz-transform: rotate(360deg);
    }
}
@-o-keyframes rotating {
    0% {
        -o-tranform: rotate(0deg);
    }
    100% {
        -o-transform: rotate(360deg);
    }
}
.lottery-head .turn-round {
    animation: rotating 5s infinite linear;
    -webkit-animation: rotating 5s infinite linear;
    -ms-animation: rotating 5s infinite linear;
    -moz-animation: rotating 5s infinite linear;
    -o-animation: rotating 5s infinite linear;
}
</style>

