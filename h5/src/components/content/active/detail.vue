<template>
    <div class="active-detail">
        <my-header title="优惠活动详情" bkUrl="/active"></my-header>
        <div class="active-detail-content">
            <!-- <div class="img">
                <img :src="data.netUrl">
                <div class="clr"></div>
            </div> -->
            <div class="title">{{data.name}}</div>
            <div class="txt" v-html="txt"></div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            txt: '',
            data: '',
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    watch: {
        $route (n, o) {
            if (n.path !== o.path) {
                this.getDetail();
            }
        }
    },
    methods: {
        escapeHtml (str) {
            var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
        },
        getDetail (receive) {
            let vm = this;
            this.$http.post('/api/v2/cms/queryDiscountActivityById', { resourceId: this.$route.params.id }, { loading: true }).then(response => {
                if (response.data.code !== 0) return;
                vm.txt = vm.escapeHtml(response.data.data.content);
                vm.data = response.data.data;
                if (receive) vm.$Message('领取成功');
            });
        }
    },
    mounted () {
        let vm = this;
        window.confirmActivityPrize = function (params) {
            vm.$http.post('/api/v2/cms/confirmActivityPrize', { availableId: params }, { userId: true }).then(response => {
                vm.user.balance = response.data.data.balance;
                localStorage.setItem('user', JSON.stringify(vm.user))
                vm.$store.commit('getUser', vm.user);
                vm.getDetail(true);
            })
        }
    },
    created () {
        this.getDetail()
    }
}
</script>

<style>
.active-detail {
    height: 100%;
    overflow-x: auto;
}
.active-detail .txt {
    margin: 0.8rem 0;
    font-size: 0.7rem;
    padding: 0 0.3rem;
}
.active-detail .title {
    height: 2rem;
    line-height: 2rem;
    border-bottom: 1px solid #eee;
    text-align: center;
}
.active-detail img {
    width: auto;
}
</style>
