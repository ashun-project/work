<template>
    <div class='share-wrap'>
        <div class="link">
            <div id="share-qq" title="QQ好友分享"></div>
            <div id="share-douban" title="豆瓣分享"></div>
            <div id="share-qzone" title="QQ空间分享"></div>
            <div id="share-sina" title="新浪微博分享"></div>
            <div id="share-qrcode" title="二维码分享"></div>
        </div>
        <div class="tip">分享到 : </div>
    </div>
</template>
<script>
export default {
    // props:{
    //     title:{
    //         type:String,
    //         default:''
    //     },
    //     essayId:{
    //         type:String,
    //         default:''
    //     }
    // },
    created () {
        jsModern.share({
            qrcode: "#share-qrcode",
            douban: "#share-douban",
            qzone: "#share-qzone",
            sina: "#share-sina",
            qq: "#share-qq"
        })
    },
}
</script>

<style lang = 'less'>
.share-wrap {
    &:after {
        display: block;
        content: '';
        height: 0;
        visibility: hidden;
        clear: both;
    }
    .tip {
        float: right;
        height: 30px;
    }
    .link {
        &:extend(.share-wrap .tip);
        div {
            &:extend(.share-wrap .tip);
            width: 30px;
            margin: 0 5px;
            border-radius: 4px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            -ms-border-radius: 4px;
            -o-border-radius: 4px;
            background-size: cover;
            cursor: pointer;
            &#share-qrcode {
                background-image: url('../../../../static/images/wechat.png');
            }
            &#share-douban {
                background-image: url('../../../../static/images/db.png');
            }
            &#share-qzone {
                background-image: url('../../../../static/images/qzone.png');
            }
            &#share-sina {
                background-image: url('../../../../static/images/sina.png');
            }
            &#share-qq {
                background-image: url('../../../../static/images/qq.png');
            }
        }
    }
}
</style>

