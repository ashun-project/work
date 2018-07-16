<template>
    <div class="phone-buy">
        <div class="half-left">

        </div>
        <div class="half-right">
            <div class="advantage">
                我们的手机投注平台面向全网玩家，线上存款，一键操作，全面支持苹果APP安卓APP、手机全部浏览器，移动技术领走在行业尖端，完整规划的跨系统平台，整合同步账号和资料传输，达到随时随地地不间断娱乐的享受概念！
            </div>
            <div class="qr" v-if="qrcodes.length">
                <div class="lf android">
                    <img :src="qrcodes[1].img" alt="">
                    <i><img src="/static/images/android.png" alt=""></i>
                </div>
                <div class="lf ios">
                    <img :src="qrcodes[0].img" alt="">
                    <i><img src="/static/images/ios.png" alt=""></i>
                </div>
            </div>
            <p class="mb-v">
                手机网页版：使用手机浏览器打开
                <a href="">&nbsp;&nbsp;{{url}}</a>
            </p>
            <p class="tip">
                最佳显示建议IOS8.0以上系统使用内建浏览器，Android4.0以上系统使用Chrome<br/> 浏览器。若当您无法顺利使用手机上网投注，请咨询公司7X12小时在线客服，谢谢！
            </p>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        url () {
            return window.location.host
        },
        qrcodes () {
            return this.$store.state.qrcodes;
        }
    }
}
</script>

<style scoped>
.phone-buy {
    height: 735px;
    background: #ebebeb;
    border-bottom: 15px solid #d7d3d2;
}
.phone-buy > div {
    height: 100%;
    width: 50%;
    float: left;
}
.phone-buy .half-left {
    background: url('/static/images/half_left.png') no-repeat right;
}
.phone-buy .half-right {
    background: url('/static/images/half_right.png') no-repeat left;
}
.phone-buy .advantage {
    color: #6e6e6e;
    font-size: 16px;
    margin-top: 230px;
    width: 576px;
    margin-left: 32px;
    line-height: 30px;
}
.phone-buy .qr {
    height: 143px;
    margin-left: 72px;
    margin-top: 84px;
}
.phone-buy .qr > div {
    width: 143px;
    height: 100%;
    background: #fff;
    padding: 5px;
    position: relative;
}
.phone-buy .qr > div i {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35px;
    padding: 2px;
    background: #fff;
    border-radius: 2px;
}
.phone-buy .qr .ios {
    margin-left: 150px;
}
.phone-buy .mb-v {
    height: 40px;
    line-height: 40px;
    border: 1px solid #c3c3c3;
    text-align: center;
    width: 400px;
    margin: 35px 90px 0;
    border-radius: 3px;
}
.phone-buy .tip {
    color: #989899;
    width: 600;
    font-size: 14px;
    line-height: 22px;
    margin-top: 30px;
    margin-left: 32px;
}
</style>

