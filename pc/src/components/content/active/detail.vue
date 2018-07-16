<template>
    <div class="active-detail content">
        <h5 class="title">活动详情页</h5>
        <div class="img">
            <img :src="data.netUrl">
            <div class="clr"></div>
        </div>
        <div class="txt" v-html="txt"></div>
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
    methods: {
        escapeHtml (str) {
            var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
        }
    },
    created () {
        let vm = this;
        this.$http.post('/api/v2/cms/queryDiscountActivityById', { resourceId: this.$route.params.id }, { unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            vm.txt = vm.escapeHtml(response.data.data.content);
            vm.data = response.data.data;
        });
    }
}
</script>

<style scoped>
.txt {
    margin: 15px 0;
    font-size: 14px;
}
</style>
