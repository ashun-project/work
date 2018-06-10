<template>
    <my-dialog class="notice-dlg" v-model="noticeVisible" :modal="false" btnSure="" btnCancle="" title="通知">
        <i class="iconfont icon-close" @click.stop="noticeVisible = false"></i>
        <div @click.stop="jumpNotice">
            {{noticeContent}}
        </div>
    </my-dialog>
</template>

<script>
export default {
    data () {
        return {
            noticeVisible: false,
            noticePath: '',
            noticeContent: '',
            connectIndex: 0
        };
    },
    computed: {
        user () {
            return this.$store.state.user;
        },
    },
    watch: {
        user (n, o) {
            if (n.userCode && n.userCode != o.userCode) {
                this.connectRongIM();
            }
            if (n || !n.userCode) {
                if (RongIMClient && RongIMClient.disconnect) {
                    RongIMClient.disconnect();
                }
            }
        },
    },
    methods: {
        jumpNotice () {
            if (this.noticePath) {
                let routeParam = {
                    path: this.noticePath,
                }
                this.$router.push(routeParam);
                this.noticeVisible = false
            }
        },
        closeNotice () {
            if (this.closeTimer) {
                clearTimeout(this.closeTimer);
                this.closeTimer = null;
            }
            this.closeTimer = window.setTimeout(() => {
                this.noticeVisible = false
            }, 5000)
        },
        clearLoginInfo () {
            if (!this.user.userCode) {
                return;
            }
            this.$http.post("/api/v2/user/loginOut", "", { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                localStorage.setItem("user", "");
                this.$store.commit("getUser", {});
                this.$router.push("/");
            });
        },

        initRongIM (token) {
            let vm = this,
                reconnetConfig = {
                    auto: true, // 默认 false, true 启用自动重连，启用则为必选参数   
                    url: "cdn.ronghub.com/RongIMLib-2.2.6.min.js",// 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
                    rate: [100, 1000, 3000, 6000, 10000] // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
                },
                callback = {
                    onSuccess: function (userId) {
                        let chatRoomId;
                        vm.connectIndex = 0;
                        vm.$systemConfig().then((systemConfig) => {
                            chatRoomId = systemConfig['chatRoomId'];
                            if (chatRoomId) {
                                var count = 10;// 拉取最近聊天最多 10 条
                                RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
                                    onSuccess: function () { // 加入聊天室成功。
                                        console.log("join 0");
                                    },
                                    onError: function (error) { // 加入聊天室失败
                                        console.log("join 1");
                                    }
                                });
                            }
                        })

                    },
                    onTokenIncorrect: function () {
                        //   console.log("token无效");
                        vm.connectIndex++;
                        if (vm.connectIndex < 10) {   // 防止死循环
                            vm.connectRongIM();
                        }
                    },
                    onError: function (errorCode) {
                        let info = "";
                        switch (errorCode) {
                            case RongIMLib.ErrorCode.TIMEOUT:
                                info = "超时";
                                break;
                            case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                                info = "未知错误";
                                break;
                            case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                                info = "不可接受的协议版本";
                                break;
                            case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                                info = "appkey不正确";
                                break;
                            case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                                info = "服务器不可用";
                                break;
                        }
                        //    console.log(errorCode);
                    }
                };
            RongIMClient.init(vm.$configText.imKey); //这是初始化，需要填参数就是你的APPKEY
            RongIMClient.connect(token, callback);

            // 连接状态监听器
            RongIMClient.setConnectionStatusListener({
                onChanged: function (status) {
                    switch (status) {
                        //链接成功
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            console.log("connect 0");
                            break;
                        //正在链接
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            console.log("connect 1");
                            break;
                        //重新链接
                        case RongIMLib.ConnectionStatus.DISCONNECTED:
                            console.log("connect 2");
                            RongIMClient.reconnect(callback, reconnetConfig);
                            break;
                        //其他设备登陆
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            console.log('connect 3');

                            break;
                        //网络不可用
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            console.log("connect 4");
                            RongIMClient.reconnect(callback, reconnetConfig);
                            break;
                    }
                }
            });
            // 消息监听器
            RongIMClient.setOnReceiveMessageListener({
                // 接收到的消息
                onReceived: function (message) {

                    let content = message.content.extra ? message.content : message.content.message.content,
                        noticePath = "",
                        data = JSON.parse(content.extra),
                        type = data.type;
                    switch (type) {
                        case "01":  // 开奖公告
                            vm.$store.commit("getNoticeModify", {
                                path: "/prizeNotice",
                                path2: "/buyLottery",
                                path3: "/historyList",
                                lotteryId: data.lotteryId,
                                periodNo: data.periodNo
                            });

                            break;
                        case "02":   // 最新公告
                            noticePath = "/information/sys?type=02";
                            vm.noticePath = noticePath;
                            vm.noticeContent = data.title;
                            vm.noticeVisible = true;
                            vm.closeNotice();
                            vm.$store.commit("getNoticeModify", {
                                path: noticePath
                            });
                            break;
                        case "03":    // 优惠活动
                            noticePath = "/active_detail/" + data.resourceId;
                            vm.noticePath = noticePath;
                            vm.noticeContent = data.title;
                            vm.noticeVisible = true;
                            vm.closeNotice();
                            vm.$store.commit("getNoticeModify", {
                                path: "/active"
                            });
                            break;
                        case "04":    //  中奖通知
                            noticePath = "/bettingDetail/" + data.userBettingRecordId;
                            vm.noticePath = noticePath;
                            vm.noticeContent = data.message;
                            vm.noticeVisible = true;
                            vm.closeNotice();
                            vm.$store.commit("getNoticeModify", {
                                path: noticePath,
                                path1: '/bettingList'
                            });
                            break;
                        case "05":    //  金额变动
                            let user = vm.$store.state.user;
                            user.balance = Number(data.balance);
                            localStorage.setItem("user", JSON.stringify(user));
                            vm.$store.commit('getUser', user);
                            break;
                        case "06":    //  token过期
                            vm.clearLoginInfo();
                            vm.$Modal.confirm("token已过期，请重新登录吗？", "温馨提示").then(() => {
                                vm.$router.push("/login");
                            }, () => { });
                            break;
                    }

                }
            });
        },
        connectRongIM () {
            if (!this.user.userCode) return;
            this.$http.post("/api/v2/rongyun/getToken", {}, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                let data = response.data.data;
                let token = data.token;
                this.initRongIM(token);
            });
        },
    },
    created () {
        this.connectRongIM();
    },
    destroyed () {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    }
};
</script>

<style lang="less">
@rem: 40rem;
.notice-dlg.ui-dialog {
    top: 20% !important;
    box-shadow: 0 0 20px 2px rgba(236, 0, 34, 0.5);
    padding: 0;
    .head {
        border-bottom: 0;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        background-color: #ffeeee;
        font-size: 30 / @rem;
        display: flex;
        align-items: center;
        padding: 0 25 / @rem;
        color: #ec0022;
        &::before {
            content: '';
            width: 42 / @rem;
            height: 42 / @rem;
            background: url(../../resource/images/notice.png) no-repeat;
            background-size: 42 / @rem 42 / @rem;
            margin-right: 16 / @rem;
        }
    }
    .d-body {
        padding: 20 / @rem 25 / @rem;
        color: #282828;
        font-size: 27 / @rem;
        min-height: 120 / @rem;
        max-height: 200 / @rem;
        word-break: break-all;
        overflow: hidden;
    }
    .icon-close {
        position: absolute;
        color: #ec0022;
        right: 25 / @rem;
        top: 2 / @rem;
        font-size: 50 / @rem;
    }
}
</style>

