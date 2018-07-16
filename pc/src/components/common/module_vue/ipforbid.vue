<template>
    <div class='wrap'>
        <div class="logo"></div>
        <div class="no-service"></div>
        <div class='text'>
            <p class="inf">
                <span class="inf-span">
                    尊敬的客户
                    <br/>
                </span>
                <span class="inf-span">
                    由于IP所在区域不在我们服务范围内 , 或您的设备已被禁用导致无法访
                    <br/>
                </span>
                <span>
                    问 , 很抱歉造成您的不便 , 若有任何疑问请与我们的在线客服联系 , 谢谢您 !
                </span>
                <br/>
                <span class="inf-span">
                    Dear Customers,
                    <br/>
                </span>
                <span class="inf-span">
                    Due to the reason that IP location is not in our service area or your device has been disabled resulted in the forbidden access We are sorry for the inconvenience . If you have any concern , please don’t be hesitate to contact us . Thank you !
                </span>
                <p class="inf-end">
                    <span>
                        <i>如有任何疑问，请联系</i>
                        <a :href="online" target="_blank">在线客服/QQ客服</a>
                    </span>
                </p>
                <p class="inf-end inf-end-txt">
                    <span>IF YOU HAVE ANY CONCERN , PLEASE DON’T BE HESITATE TO CONTACT US </span>
                </p>
            </p>
        </div>

    </div>
</template>
<script>
export default {
    computed: {
        online () {
            return this.$store.state.isIpForbid;
        }
    }
}
</script>
<style scoped>
.wrap {
    width: 100%;
    height: 100%;
    text-align: center;
}
.wrap .logo {
    height: 210px;
}
.wrap .text {
    text-align: center;
    margin: 0 auto;
}
.wrap .text p {
    width: 630px;
    margin: 0 auto;
    color: #666;
}
.wrap .inf-span {
    line-height: 30px;
}
.wrap p.inf-end a {
    color: #d1601a;
}
.wrap p.inf-end a:hover {
    color: #be1204;
}
@media screen and (min-width: 720px) {
    .wrap .logo {
        background: url('/configstatic/pc/images/logo.gif') center center
            no-repeat;
        background-size: 225px 80px;
        -moz-background-size: 200;
        -o-background-size: 200px;
        -webkit-background-size: 200px;
        background-size: 200px;
    }
    .wrap .no-service {
        background: url('/static/images/forbid_pclogo.png') center center
            no-repeat;
        background-size: 1145px 405px;
        -webkit-background-size: contain;
        -moz-background-size: contain;
        -o-background-size: contain;
        background-size: contain;
    }
    .wrap .no-service {
        height: 300px;
    }
    .wrap .no-access {
        color: #cab8ac;
        margin-bottom: 48px;
        font-size: 48px;
        margin-top: 20px;
    }
    .wrap .inf {
        box-sizing: border-box;
        color: #666;
        box-sizing: border-box;
        text-align: left;
        font-size: 14px;
        font-size: 16px;
    }
    .wrap .inf-span {
        line-height: 30px;
    }
    .wrap p.inf-end {
        text-align: center;
        padding-top: 40px;
        color: #666;
        font-size: 0px;
    }
    .wrap p.inf-end i,
    .wrap p.inf-end a {
        display: inline-block;
        font-size: 24px;
    }
    .wrap p.inf-end-txt {
        padding-top: 10px;
        font-size: 24px;
    }
}

@media screen and (max-width: 720px) {
    .wrap .logo {
        height: 160px;
        background: url('/configstatic/pc/images/logo.gif') center center
            no-repeat;
        background-size: 40%;
    }
    .wrap .no-service {
        background: url('/static/images/forbid_pclogo.png') center center
            no-repeat;
        padding: 80px 0;
        -webkit-background-size: contain;
        -moz-background-size: contain;
        -o-background-size: contain;
        background-size: contain;
    }
    .wrap .no-access {
        color: #cab8ac;
        margin-bottom: 48px;
        font-size: 5vw;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .wrap .inf {
        box-sizing: border-box;
        color: #666;
        max-width: 80%;
        padding-top: 40px;
        text-align: left;
        padding-left: 9vw;
        font-size: 22px;
    }
    .wrap .inf-end {
        font-size: 22px;
        padding-top: 40px;
        color: #666;
    }
    .wrap .inf-end-txt {
        padding-top: 10px;
    }
}
</style>
