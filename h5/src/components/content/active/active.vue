<template>
    <div class="active-page">
        <my-header title="优惠活动" bkUrl="/"></my-header>
        <div>
            <ul>
                <li v-for="(item, idx) in list" :key="idx">
                    <h6>{{item.name}}</h6>
                    <router-link v-if="item.contentType > -1" :to="{name: 'active_detail', params: {id: item.resourceId}}"><img :src="item.netUrl"></router-link>
                    <a v-else target="_blank" :href="item.targetUrl || '###'"><img :src="item.netUrl"></a>
                    <div class="clr"></div>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
export default {
    name: 'active',
    data () {
        return {
            list: []
        }
    },
    computed: {
        noticeModify () {
            return this.$store.state.noticeModify;
        },
    },
    watch: {
        noticeModify (data) {

            if (data.path !== this.$route.path) return;

            this.queryDiscountActivityList();
        }
    },
    methods: {
        queryDiscountActivityList () {
            this.$http.post('/api/v2/cms/queryDiscountActivityList', { frontType: 'h5' }, { loading: true }).then(response => {
                if (response.data.code !== 0) return;
                this.list = response.data.data.list;
            })
        }
    },
    created () {
        this.queryDiscountActivityList();
    }
}
</script>

<style scoped>
.active-page {
    height: 100%;
    overflow-y: auto;
    background: #f3f3f3;
    padding-bottom: 0.5rem;
}
.active-page ul li {
    margin: 0.5rem 0.5rem 0;
    background: #fff;
    padding: 0.2rem 0.5rem 0.5rem;
}
</style>

