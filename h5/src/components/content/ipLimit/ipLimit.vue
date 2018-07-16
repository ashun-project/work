<template>
    <div class="">
        <div class="logo"></div>
        <div class="no-service">

        </div>
        <p class="inf">
            <span class="inf-span">
                尊敬的客户
                <br/>
            </span>
            <span class="inf-span">
                由于IP所在区域不在我们服务范围内 , 或您的设备已被禁用导致无法访问 , 很抱歉造成您的不便 , 若有任何疑问请与我们的在线客服联系 , 谢谢您 !
                <br/>
            </span>
            <span class="inf-span">
                Dear Customers,
                <br/>
            </span>
            <span class="inf-span">
                Due to the reason that IP location is not in our service area or your device has been disabled resulted in the forbidden access . We are sorry for the inconvenience . If you have any concern , please don’t be hesitate to contact us . Thank you !
                <br/>
            </span>
            <p class="inf-end" style="padding-bottom:5px;">
                如有任何疑问，请联系
                <span>
                    <a :href="(serviceUrl == 0)||(serviceUrl == 'null')?'javascript:;':serviceUrl" class="link">
                        在线客服/QQ客服
                    </a>

                </span>
            </p>
            <p class="inf-end" style="padding-top:0;font-size:3.6vw">IF YOU HAVE ANY CONCERN , PLEASE DON’T BE HESITATE TO CONTACT US .</p>
        </p>

    </div>
</template>

<script>
let timer;
export default {
    data () {
        return {
            serviceUrl: ''
        }
    },
    created () {
        // 客服信息

        let ipLimitData = sessionStorage.getItem('ipLimitData');
        if (!ipLimitData) return
        ipLimitData = JSON.parse(ipLimitData);
        this.serviceUrl = ipLimitData.data.data.url;
    }
}
</script>
<style scoped>
.logo {
    height: 28vw;
    background: url(/configstatic/h5/images/logo.png) center center no-repeat;
    background-size: 40%;
}
.no-service {
    background: url('../../../resource/images/ipLimit-bg.png') center center
        no-repeat;
    padding: 80px 0;
    -webkit-background-size: contain;
    -moz-background-size: contain;
    -o-background-size: contain;
    background-size: contain;
}
.inf {
    box-sizing: border-box;
    color: #666;
    text-align: left;
    padding: 0 12vw;
    font-size: 3.5vw;
    margin-bottom: 4vw;
}
.inf-span {
    line-height: 2;
}
.inf-end {
    font-size: 4vw;
    padding: 3% 0;
    color: #666;
    padding-left: 14vw;
    padding-bottom: 5vw;
    padding-right: 7vw;
}
.inf-end .link {
    color: #d1601a;
    font-weight: bold;
}
</style>

