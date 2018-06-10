<template>
    <div class="help-detail">
        <my-header title="帮助中心" bkUrl="/helpCenter"></my-header>
        <div class="detail" v-html="detail">

        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            detail: ''
        }
    },
    methods: {
        // escapeHtml (str) {
        //     var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        //     return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
        // }
    },
    created () {
        this.$http.post('/api/v2/cms/queryAdvisoryEssayById', { id: this.$route.params.id }).then(response => {
            if (response.data.code !== 0) return;
            this.detail = this.escapeHtml(response.data.data.content);
        });
    }
}
</script>

<style scoped>
.help-detail .detail {
    padding: 0.3rem;
}
</style>
