<template>
    <div class='role-content'>
        <div class='play_header'>
            <img :src="roleDetail.imageUrl" alt="图片">
            <span class="lottery_name">{{roleDetail.name}}</span>
        </div>
        <iframe frameborder="no" width="724" scrolling="no" id="iframe"></iframe>
    </div>
</template>
<script>
export default {
    data () {
        return {
            lotteryId: '',
            roleDetail: {}
        }
    },
    watch: {
        '$route' (newRoute, oldRoute) {
            this.lotteryId = newRoute.params.id;
            this.getRoleContent();
            this.$nextTick(() => {
                this.setHeight('setHeight');
            })
        }
    },
    methods: {
        getRoleContent () {
            let vm = this;
            this.$http.post('/api/v2/cms/queryLotteryGamePlay', { lotteryId: this.lotteryId }, { unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.roleDetail = response.data.data;
                let iframe = document.getElementById('iframe');
                iframe.src = this.roleDetail.url;
                this.setHeight();
            })
        },
        setHeight (height = 'getHeight') {
            let iframe = document.getElementById('iframe');
            iframe.onload = function () {
                iframe.contentWindow.postMessage(height, '*');
                window.addEventListener('message', (e) => {
                    if (e.data.scrollHeight) {
                        iframe.height = `${e.data.scrollHeight}`;
                        iframe.setAttribute('height', `${e.data.scrollHeight}`);
                    }
                }, false)
            }
        }
    },
    //     mounted () {
    //  this.setHeight();
    //     },
    created () {
        this.lotteryId = this.$route.params.id;
        this.getRoleContent();
    }
}
</script>

<style scoped>
.role-content {
    width: 100%;
    overflow: hidden;
}
.role-content .play_header {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
    overflow: hidden;
}
.role-content .play_header img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
}
</style>


