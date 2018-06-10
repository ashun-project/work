<template>
    <div class="pc-layout">
        <!-- 全局qrcode -->
        <div id="ios" style="display:none"></div>
        <div id="android" style="display:none"></div>
        <!-- 悬浮窗 -->
        <div class="suspend-right suspend-container" v-if="qrcodes.length && rightUrl.length && showSuspend">
            <suspend :txt="iosTxt" :qrcode="qrcodes[0]" :url="rightUrl" :icon="iosIcon"></suspend>
        </div>
        <div class="suspend-left suspend-container" v-if="qrcodes.length && leftUrl.length && showSuspend">
            <suspend :txt="androidTxt" :qrcode="qrcodes[1]" :url="leftUrl" :icon="androidIcon"></suspend>
        </div>
        <!-- 悬浮窗结束 -->

        <div class="header" v-if="!isShowHead">
            <head-content></head-content>
        </div>

        <!-- clr作为清楚浮动使用 -->
        <div class="clr"></div>
        <!-- 结束 -->

        <div class="bodyer">
            <router-view/>
        </div>

        <!-- clr作为清楚浮动使用 -->
        <div class="clr"></div>
        <!-- 结束 -->

        <div class="footer" v-if="!isShowFoot">
            <foot-content></foot-content>
        </div>
        <!-- 红包 -->
        <div @click="goRedPacket()" :data="activityUrl" class="red-packet" v-if="showRedPacket">
            <img :src="activityImg" alt="">
        </div>
        <!-- 即时通信 -->
        <socket></socket>
        <modal :modalShow="isClosePie" :width="416" :hasFooter="true" :hasNoBtn="false" claName="pie-modal" @btn-ok="$store.commit('getClosePie',false)">
            <div slot="content">
                <p class="title">撤单提示</p>
                <div class="content">
                    <Icon type="close-circled"></Icon>
                    <span>该记录已封盘不能撤销</span>
                </div>
            </div>
        </modal>
        <!-- <Modal v-model="showLoginDialog" :mask-closable="false" class="loging-dlg" title="登录" width="380">
             <loginDlg></loginDlg>
        </Modal>
        -->
        <!-- 登录才能进入buyLottery -->
        <!-- <modal :modalShow = "showLoginDialog" :title = "'投注提示'" :width = "440" @btn-cancel = "cancelBetting" @btn-ok = "okBetting">
            <div slot = "content">
                该操作需要登录，是否登录？
            </div>
        </modal> -->
        <!--彩种是否维护中-->
        <!-- <modal :modalShow = "isUsedLottery" :title = "'投注提示'" :width = "440" @btn-cancel = "isBetting" :noText = "'返回'" :hasOkBtn = "false">
            <div slot = "content">
                该彩种正在维护...
            </div>
        </modal> -->
    </div>
</template>

<script>
import headContent from './child_modal/header.vue'
import footContent from './child_modal/footer.vue'
import suspend from './child_modal/suspend'
import socket from './child_modal/socket.vue'
import QRCode from 'qrcodejs2'
import modal from '@/components/common/module_vue/modal'
export default {
    components: {
        headContent,
        footContent,
        suspend,
        socket,
        modal
    },
    data () {
        return {
            androidIcon: {
                icon1: 'i-android-white',
                icon2: 'i-demo',
                icon3: 'i-qq-service'
            },
            androidTxt: {
                txt1: '安卓APP客户端',
                txt2: '免费试玩',
                txt3: 'QQ客服',
            },
            iosTxt: {
                txt1: '苹果APP客户端',
                txt2: '在线客服',
                txt3: '帮助中心'
            },
            iosIcon: {
                icon1: 'i-ios-white',
                icon2: 'i-line-service',
                icon3: 'i-help-service'
            },
            leftUrl: [],
            rightUrl: [],
            isShowHead: false,
            isShowFoot: false,
            showSuspend: true,
            showRedPacket: false,
            packetKey: '',
            activityImg: '',  // 活动图片
            activityUrl: '',   // 活动地址
            showLogin: false //弹框
        }
    },
    computed: {
        user () {
            return this.$store.state.user
        },
        qrcodes () {
            return this.$store.state.qrcodes;
        },
        isClosePie () { //删除投注详情订单提示
            return this.$store.state.isClosePie;
        }
        // showLoginDialog () {
        //     return this.$store.state.showLoginDialog;
        // }
        // isUsedLottery () {
        //     return this.$store.state.isUsedLottery;
        // }
    },
    watch: {
        '$route' (n) {
            this.routeStatus(n.name)
        }
    },
    methods: {
        // isBetting() {
        //     this.$store.commit('getLotteryStatus',false);
        // },
        cancelBetting () { //取消进入投注页
            this.$store.commit('getShowLoginDialog', false);
        },
        okBetting () {
            this.$store.commit('getShowLoginDialog', false);
            this.$router.push('/login');
        },
        calcuService (servicer) {
            let vm = this;
            //免费试玩
            vm.leftUrl.push("#/freeTrial");
            //qq客服
            vm.leftUrl.push("tencent://message/?exe=qq&menu=yes&Uin=" + servicer.qq);
            //在线客服
            vm.rightUrl.push(servicer.url);
            //帮助中心
            vm.rightUrl.push("#/helpCenter/register");
        },
        routeStatus (name) {
            if (name === 'buyLottery' || name === 'redPacket') {
                this.isShowHead = true;
                this.isShowFoot = true;
                this.showSuspend = false;
            } else if (name === 'lottery') {
                this.isShowHead = false;
                this.isShowFoot = true;
                this.showSuspend = false;
            } else {
                this.isShowHead = false;
                this.isShowFoot = false;
                this.showSuspend = true;
            }
            this.judgeShowPacket(name);
        },
        judgeShowPacket (name) {
            if (['home', 'phone_buy', 'active', 'notice', 'trend', 'notice_detail'].indexOf(name) > -1 && this.packetKey === '1') {
                this.showRedPacket = true;
            } else {
                this.showRedPacket = false;
            }
        },
        goRedPacket (event) {
            if (!this.user.userId) {
                // this.$router.push('/login')
                let vm = this;
                this.$Modal.confirm({
                    title: '抢红包',
                    content: '<p>您还未登入！去登录？</p>',
                    onOk: () => {
                        vm.$router.push('/login')
                    }
                });
            } else if (this.user.userType === '09') {
                this.$Message.info('请切换正式账号')
            } else {
                window.open(this.activityUrl)
            }
        },
        getQrCode (data) {
            // 注册全局的二维码
            let img = '';
            let value = ''
            let vm = this;
            let arr = [];
            ['ios', 'android'].forEach((item, idx) => {
                let code = new QRCode(item, data[idx].targetUrl);
                let timer = setInterval(function () {
                    img = document.getElementById(item).querySelector('img')
                    if (img) {
                        value = img.getAttribute('src');
                        if (value) {
                            clearInterval(timer);
                            arr.push({ img: value, icon: item })
                            if (item === 'android') {
                                vm.$store.commit('getQrcodes', arr);
                            }
                        }
                    }
                }, 100)
            })
        }
    },
    created () {
        this.routeStatus(this.$route.name)
        this.$http.post('/api/v2/cms/queryQrcodesAndServicer').then(response => {
            if (response.data.code !== 0) return;
            let data = response.data.data;
            this.calcuService(data.servicer);
            this.$store.commit('getServicer', data.servicer);
            this.getQrCode(data.qrcodes);
            document.title = data.servicer.name;
        })
        this.$http.post("/api/v2/sysDict/querySystemConfig").then(response => {
            if (response.data.code !== 0) return;
            let data = response.data.data;
            this.$store.commit('getConfigList', data);
            data.forEach(itm => {
                if (itm.key == "TEST_PLAY_MONEY") {
                    this.$store.commit('freePlay', itm.value)
                }
            })
            data.forEach(item => {
                if (item.key === 'pcRelativeUrl') {
                    this.activityUrl = '/#' + item.value;
                }
                if (item.key === 'activityPcImg') {
                    this.activityImg = item.value;
                }
                if (item.key === 'RED_PACKET_SWITCH') {
                    this.packetKey = item.value;
                    this.judgeShowPacket(this.$route.name)
                }
            });
        });
    }
}
</script>

<style>
/* .loging-dlg .ivu-modal-footer{
        display: none;
    } 
    .loging-dlg .ivu-modal-close{
        display: none;
    }
    .loging-dlg .seft-close{
        display: block;
    } */
.suspend-container {
    position: fixed;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 100000;
}
.suspend-right {
    right: 15px;
}
.suspend-left {
    left: 15px;
}
.content {
    width: 1000px;
    margin: 0 auto;
}
/* 底部 */
.pc-layout .footer {
    background: #f2f2f2;
    padding: 15px 0;
}
.red-packet {
    /*    width: 182px;
        height: 226px;
        background: url(/static/images/packet/home-redPacket-bg.png); */
    position: fixed;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
}
.red-packet img {
    max-height: 150px;
    width: auto;
}

.red-packet .close {
    position: absolute;
    left: 0;
    top: 0;
    color: #be1204;
    font-size: 14px;
    cursor: pointer;
}
/* 弹框 */
.v-transfer-dom .pie-modal .ivu-modal-header {
    height: 0 !important;
    padding: 0;
}
.v-transfer-dom .pie-modal .ivu-modal-header span {
    display: none;
}
.v-transfer-dom .pie-modal .ivu-modal-content {
    border: none;
    border-radius: 6px;
}
.v-transfer-dom .pie-modal .title {
    font-weight: bold;
}
.v-transfer-dom .pie-modal .content {
    position: relative;
    padding: 22px 0 0 48px;
    margin-top: 6px;
    font-size: 12px;
}
.v-transfer-dom .pie-modal .content i {
    position: absolute;
    left: 0;
    top: 10px;
    color: #ed3f14;
    font-size: 36px;
}
.v-transfer-dom .pie-modal .content .period-no {
    color: #be1204;
    font-size: 20px;
}
.v-transfer-dom .pie-modal .ivu-modal-footer {
    text-align: right;
}
.v-transfer-dom .pie-modal .ivu-modal-footer button {
    width: 60px !important;
    height: 36px !important;
}
</style>
