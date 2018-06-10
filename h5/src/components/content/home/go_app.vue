<template>
    <div class="tip-go-app" v-if="showTip">
        <p>下载APP，体验更多乐趣</p>
        <a :href="downloadURl" @click="down($event)">下载APP</a>
        <!-- <a :href="openUrl">打开APP</a> -->
        <img src="@/resource/images/quxiao.png" alt="" @click="setShowTip()">
    </div>
</template>

<script>
export default {
    data () {
        return {
            downloadURl: '',
            openUrl: ''
        }
    },
    computed: {
        showTip () {
            return this.$store.state.appTip
        }
    },
    methods: {
        testApp (url) {
            var timeout, t = 1000, hasApp = true;
            setTimeout(function () {
                if (hasApp) {
                    alert('安装了app');
                } else {
                    window.location.href = 'wwww.baidu.com'
                }
                document.body.removeChild(ifr);
            }, 2000)

            var t1 = Date.now();
            var ifr = document.createElement("iframe");
            ifr.setAttribute('src', url);
            ifr.setAttribute('style', 'display:none');
            document.body.appendChild(ifr);
            timeout = setTimeout(function () {
                var t2 = Date.now();
                if (!t1 || t2 - t1 < t + 100) {
                    hasApp = false;
                }
            }, t);
        },
        isAndroid_ios () {
            var u = navigator.userAgent, app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器  
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端  
            return isAndroid
        },
        setShowTip (e) {
            // this.showTip = false;
            // this.$store.commit('getUser', response.data.data);
            this.$store.commit('getAppTip', false)
        },
        down (event) {
            if (!this.downloadURl) {
                this.$Message('APP即将上线');
                event.preventDefault();
            }
        }
    },
    mounted () {
        // this.testApp('ufunlottery://ufunlottery')
    },
    created () {
        // this.openUrl = 'ufunlottery://ufunlottery' // 安卓
        // this.openUrl = 'cp99lottery://'  // ios
        let type = 'ios';
        if (this.isAndroid_ios()) type = 'android';
        this.$http.post('/api/v2/app/getUrlForDownload', { type: type }).then(response => {
            if (response.data.code !== 0) return;
            this.downloadURl = response.data.data.url;
        })
    }
}
</script>

<style scoped>
.tip-go-app {
    position: fixed;
    bottom: 2.4rem;
    left: 0;
    width: 100%;
    height: 2.4rem;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 1.5rem;
    z-index: 200;
}
.tip-go-app * {
    color: #fff;
}
.tip-go-app a {
    display: block;
    height: 1.5rem;
    line-height: 1.5rem;
    border-radius: 3px;
    padding: 0 0.5rem;
    background: #fb3d17;
    margin-left: 2rem;
}
.tip-go-app img {
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
    max-width: 1.2rem;
}
</style>

