<template>
    <div class="web-socket">

    </div>
</template>

<script>
var num = 1;
export default {
    data () {
        return {
            token: '',
            isOtherLogin: false
        }
    },
    computed: {
        configList () {
            return this.$store.state.configList;
        },
        user () {
            return this.$store.state.user
        }
    },
    watch: {
        user: {
            handler (newValue, oldValue) {
                if (newValue.userId) {
                    this.getToken()
                }
            },
            deep: true
        }
    },
    mounted () {
        // console.log(this.configList);
    },
    methods: {
        getToken () {
            this.$http.post('/api/v2/rongyun/getToken', '', { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.token = response.data.data.token;
                // console.log(response.data.data);
                this.socket();
            })
        },
        socket () {
            let vm = this;
            let callback = {
                onSuccess: function (userId) {
                    // console.log("Login successfully." + userId);
                    // vm.$http.post('/api/v2/sysDict/querySystemConfig', {}).then((res) => {
                    let chatRoomId = vm.configList.filter(item => item.key === 'chatRoomId')[0].value;
                    RongIMClient.getInstance().joinChatRoom(chatRoomId, 1, {
                        onSuccess: function () {
                            console.log("join 1");
                        },
                        onError: function (error) {
                            console.log("join 0");
                        }
                    });
                    // })
                },
                onTokenIncorrect: function () {
                    if (num < 10) {
                        num += 1;
                        vm.getToken();
                    }
                },
                onError: function (errorCode) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                            info = '不可接受的协议版本';
                            break;
                        case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                            info = 'appkey不正确';
                            break;
                        case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                            info = '服务器不可用';
                            break;
                    }
                }
            };
            var config = {
                // 默认 false, true 启用自动重连，启用则为必选参数
                auto: true,
                // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
                url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
                // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
                rate: [100, 1000, 3000, 6000, 10000]
            };
            // 初始化
            RongIMClient.init(vm.$configText.imKey);
            // 链接
            RongIMClient.connect(this.token, callback);
            // 链接状态
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
                            console.log('connect 2');
                            if (vm.isOtherLogin) return
                            RongIMClient.reconnect(callback, config);
                            break;
                        //其他设备登陆
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            console.log('connect 3');
                            RongIMClient.getInstance().disconnect();
                            vm.isOtherLogin = true;
                            break;
                        //网络不可用
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            console.log('connect 4');
                            RongIMClient.reconnect(callback, config);
                            break;
                    }
                }
            });
            // 接收消息
            RongIMClient.setOnReceiveMessageListener({
                onReceived: function (message) {
                    let obj = null;
                    obj = message.content;
                    if (message.content.message) {
                        obj = message.content.message.content;
                    }
                    let cont = JSON.parse(obj.extra);
                    let type = cont.type;
                    // type判断消息类型  01历史开奖，02系统公告，03优惠活动，04中奖注单，06token失效
                    switch (type) {
                        case '01':
                            if (vm.$route.name === 'notice' || vm.$route.name === 'notice_detail' || vm.$route.name === 'buyLottery') {
                                vm.$store.commit('getNoticeList', obj.extra);
                            }
                            break;
                        case '02':
                            vm.$Notice.open({
                                title: '系统公告',
                                duration: 10,
                                render: (h, params) => {
                                    return h('span', {
                                        style: { cursor: "pointer" },
                                        on: {
                                            click: () => {
                                                // vm.$router.push({ name: 'personalCenter', params: { id: 'information', essayId: `${cont.essayId}` } })
                                                vm.$router.push(`/personalCenter/information?essayId=${cont.essayId}`);
                                            }
                                        }
                                    }, cont.title)
                                }
                            })
                            break;
                        case '03':
                            vm.$Notice.open({
                                title: '优惠活动',
                                duration: 10,
                                render: (h, params) => {
                                    return h('span', {
                                        style: { cursor: 'pointer' },
                                        on: {
                                            click: () => {
                                                vm.$router.push(`/active?resourceId=${cont.resourceId}`);
                                            }
                                        }
                                    }, cont.title)
                                }
                            })
                            break;
                        case '04':
                            // console.log('04====',obj);
                            vm.$Notice.open({
                                title: '注单',
                                duration: 10,
                                render: (h, params) => {
                                    return h('span', {
                                        style: { cursor: "pointer" },
                                        on: {
                                            click: () => {
                                                if (vm.$route.name === 'personalCenter' && vm.$route.params.id === 'record') {
                                                    vm.$store.commit('getRecord', obj.extra);
                                                } else {
                                                    vm.$router.push({ name: 'personalCenter', params: { id: 'record', detail: cont.userBettingRecordId } })
                                                }
                                            }
                                        }
                                    }, cont.message)
                                }
                            })
                            break;
                        case '05':
                            let user = vm.$store.state.user;
                            let balance = cont.balance.toFixed(2);
                            user.balance = balance;
                            vm.$store.commit('getUser', user);
                            localStorage.setItem('user', JSON.stringify(user));
                            break;
                        case '06':
                            // console.log('06====', cont);
                            break;
                        default:
                        // 自定义消息
                        // do something...
                        // console.log(cont);
                    }
                }
            });
        }
    },
    created () {
        if (this.user.userId) {
            this.getToken();
        }
    }
}
</script>
