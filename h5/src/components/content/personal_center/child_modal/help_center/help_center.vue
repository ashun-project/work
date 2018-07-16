<template>
    <div class="help-center">
        <my-header title="帮助中心" bkUrl="/personalCenter"></my-header>
        <div class="list guide">
            <h5>功能引导</h5>
            <ul>
                <li v-for="(item, idx) in list" :key="idx" :class="{'no-right-bor': (idx + 1) % 4 === 0, 'no-bottom-bor': (list.length - idx) < 4}" @click="goQuestion(item.name)">
                    <div><img :src="item.netUrl" alt=""></div>
                    <p>{{item.name}}</p>
                </li>
            </ul>
            <div class="clr"></div>
        </div>
        <div class="list question">
            <h5>常见问题
                <span @click="goQuestion('00')">更多</span>
            </h5>
            <ul>
                <li v-for="(item, idx) in questionList" :key="idx" @click="goDetail(item)">{{item.title}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            list: [],
            questionList: []
        }
    },
    methods: {
        goQuestion (id) {
            this.$router.push({ name: 'helpList', params: { id: id } })
        },
        goDetail (item) {
            this.$router.push({ name: 'helpDetail', params: { id: item.essayId } })
        }
    },
    created () {
        // 获取指导列表
        this.$http.post('/api/v2/cms/queryHelpCenterByIdGuideList', { id: '3' }, { noEncrypt: true }).then(response => {
            if (response.data.code !== 0) return;
            this.list = response.data.data;
        });
        // 获取指导列表
        this.$http.post('/api/v2/cms/queryAdvisoryEssayList', { type: '05', size: 5 }, { loading: true, noEncrypt: true }).then(response => {
            if (response.data.code !== 0) return;
            this.questionList = response.data.data.list;
        });
    }
}
</script>
<style scoped>
.help-center {
    height: 100%;
    overflow-y: auto;
    background: #f2f2f2;
}
.help-center .list {
    border-left: 0.3rem solid #ec0022;
    margin-top: 0.5rem;
    padding-bottom: 0.5rem;
    background: #fff;
}
.help-center .list h5 {
    height: 2rem;
    line-height: 2rem;
    padding-left: 0.3rem;
    border-bottom: 1px dashed #c3c3c3;
    color: #282828;
    font-size: 0.8rem;
}
.help-center .list ul {
    padding: 0.5rem;
}
.help-center .guide li {
    width: 25%;
    float: left;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
    padding: 0.5rem 0;
    position: relative;
}
.help-center .guide li::after {
    content: '';
    position: absolute;
    right: -0.3rem;
    bottom: -0.3rem;
    width: 0.6rem;
    height: 0.6rem;
    background: #fff;
    z-index: 10;
}
.help-center .guide li.no-right-bor {
    border-right: 0;
}
.help-center .guide li.no-bottom-bor {
    border-bottom: 0;
}
.help-center .guide li > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
}
.help-center .guide li img {
    width: 30%;
}
.help-center .guide li p {
    color: #989899;
    margin-top: 0.3rem;
}
.help-center .list.question {
    border-color: #37bd00;
}
.help-center .list.question h5 span {
    float: right;
    margin-right: 0.5rem;
    color: #999;
    font-size: 0.66rem;
}
.help-center .list.question li {
    height: 2rem;
    line-height: 2rem;
    padding-left: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
}
.help-center .list.question li::before {
    content: '';
    width: 10px;
    height: 10px;
    float: left;
    border: 1px solid #ccc;
    border-radius: 50%;
    position: absolute;
    top: 0.72rem;
    left: 0;
}
</style>

