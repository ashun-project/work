<template>
    <div class="feedback">
        <my-header title="意见反馈" bkUrl="/feedback"></my-header>
        <div class="fb-tit">标题</div>
        <input class="in" type="text" maxlength="25" v-model="title" placeholder="请输入25字以内的反馈标题" />
        <div class="fb-tit">内容</div>
        <textarea class="in area" v-model="content" maxlength="100" placeholder="请输入100字以内的反馈内容"></textarea>
        <div class="my-btn">
            <mt-button type="default" :disabled='btnDisabled' size="large" @click='saveFeedback' style="margin-top:20px">提交</mt-button>
        </div>
        <!--    <div class="btn" :class="btnDisabled" @click="saveFeedback">提交</div> -->
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            content: ''
        };
    },
    computed: {
        btnDisabled () {
            return (this.title && this.content) ? false : true;
        }
    },
    methods: {
        saveFeedback () {
            if (!this.title || !this.content) {
                return
            }
            this.$http.post('/api/v2/user/addCustomerFeedback', { title: this.title, content: this.content }, { userId: true, loading: 1 }).then((response) => {
                if (response.data.code !== 0) return;
                this.$router.push('/feedback');
            })
        }
    },
    mounted () {

    },
    created () { }
};
</script>

<style scoped lang="less">
@rem: 40rem;
.feedback {
    height: 100%;
    background-color: #f8f8f8;
    position: relative;
    .in {
        background-color: #fff;
        padding: 0 30 / @rem;
        font-size: 30 / @rem;
        height: 2.2rem;
        width: 100%;
    }
    .area {
        padding: 30 / @rem;
        min-height: 150 / @rem;
    }
    .btn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        border: 0;
        height: 70 / @rem;
        line-height: 70 / @rem;
        background-color: #ec0022;
        color: #fff;
        font-size: 30 / @rem;
        padding: 0;
        &.disabled {
            background-color: #999;
        }
    }
    .my-btn {
        padding: 0 5%;
    }
}
.fb-tit {
    height: 80 / @rem;
    line-height: 80 / @rem;
    padding: 0 30 / @rem;
    font-size: 24 / @rem;
}
</style>