<template>
    <div class="help-list">
        <my-header title="帮助中心" bkUrl="/helpCenter"></my-header>
        <ul>
            <li v-for="(item, idx) in list" :key="idx" @click="goDetail(item)">
                {{item.title}}
            </li>
            <li v-if="!list.length" class="not-data">
                暂无数据
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list: []
        }
    },
    methods: {
        goDetail (item) {
            this.$router.push({ name: 'helpDetail', params: { id: item.essayId } })
        }
    },
    created () {
        if (this.$route.params.id === '00') {
            // 获取常见问题列表
            this.$http.post('/api/v2/cms/queryAdvisoryEssayList', { type: '04' }, { noEncrypt: true }).then(response => {
                if (response.data.code !== 0) return;
                this.list = response.data.data.list;
            });
        } else {
            // 获取指导的问题列表
            this.$http.post('/api/v2/cms/queryHelpCenterByNameGuideList', { name: this.$route.params.id }, { noEncrypt: true }).then(response => {
                if (response.data.code !== 0) return;
                this.list = response.data.data;
            });
        }
    }
}
</script>

<style scoped>
.help-list ul {
    border-top: 0.5rem solid #eee;
}
.help-list li {
    height: 2rem;
    line-height: 2rem;
    padding-left: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.help-list li:nth-child(even) {
    background: #eee;
}
.help-list li.not-data {
    text-align: center;
}
</style>
