<template>
    <div class="mysetting">
        <my-header title="设置" bkUrl="/personalCenter">
        </my-header>
        <section class="aui-content">
            <div>
                <dl class="tabStyle">
                    <dt class="">
                        <span>通用</span>
                    </dt>
                </dl>
                <dl class="dl2">
                    <dt class="">
                        <span class="p-l-15">高级投注模式</span>
                    </dt>
                    <dd>
                        <mt-switch @change="setBettingModal" v-model="highBettingModal"></mt-switch>
                    </dd>
                </dl>
                <dl class="dl2" v-if="showRedpacket">
                    <dt class="">
                        <span class="p-l-15">红包</span>
                    </dt>
                    <dd>
                        <mt-switch @change="toggleRedPacket" v-model="isOpenRedPaket"></mt-switch>
                    </dd>
                </dl>
                <dl class="" @click="gopage('/feedback', true)">
                    <dt class="">
                        <span class="p-l-15">意见反馈</span>
                    </dt>
                </dl>
                <dl class="" @click="gopage('/aboutme')">
                    <dt class="">
                        <span class="p-l-15">关于我们</span>
                    </dt>
                </dl>
            </div>
            <div class="exit">
                <button @click="logout" :class="{disabled: isUnLogin}">退出</button>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data () {
        return {
            highBettingModal: false,
            isOpenRedPaket: true,
            showRedpacket: false
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        },
        isUnLogin () {
            return !this.user.userCode
        }
    },
    methods: {
        logout () {
            if (this.isUnLogin) {
                return
            }
            this.$http.post('/api/v2/user/loginOut', '', { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                localStorage.setItem('user', '');
                this.$store.commit('getUser', {});
                this.$router.push('/');
            })
        },
        gopage (url, needLogin) {
            if (needLogin && !this.user.userCode) {
                this.$Modal.alert("请先登入");
                return
            }
            this.$router.push(url);
        },
        setBettingModal () {
            let highBettingModal = localStorage.setItem('highBettingModal', this.highBettingModal ? '1' : '0');
        },
        toggleRedPacket () {
            localStorage.setItem('isOpenRedPaket', this.isOpenRedPaket ? '1' : '0');
        }

    },
    mounted () {
        let highBettingModal = localStorage.getItem('highBettingModal');
        this.highBettingModal = highBettingModal ? !!parseInt(highBettingModal) : false;
        // 设置红包

        let isOpenRedPaket = localStorage.getItem('isOpenRedPaket');
        this.isOpenRedPaket = isOpenRedPaket ? !!parseInt(isOpenRedPaket) : true;
    },
    created () {
        this.$systemConfig().then((systemConfig) => {
            this.showRedpacket = systemConfig['RED_PACKET_SWITCH'] === '0' ? false : true
        })
    }
}
</script>

<style scoped>
.mysetting dl {
    padding: 0.6rem 0.6rem;
    border-bottom: 1px solid #eee;
    position: relative;
    color: #000;
}
.mysetting dl::before {
    content: '';
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    top: 50%;
    right: 0.75rem;
    margin-top: -0.2rem;
    background: transparent;
    border: 1px solid #dddddd;
    border-top: none;
    border-right: none;
    z-index: 2;
    -webkit-border-radius: 0;
    border-radius: 0;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
}
.mysetting dl .link {
    display: block;
    color: #000;
}

.mysetting .tabStyle {
    background-color: #e9e9e9;
    padding: 0.35rem 0.6rem;
    color: #666;
    font-size: 0.7rem;
}
.mysetting dt {
    font-size: 0.7rem;
}
.mysetting dl.tabStyle::before {
    content: none;
}
.mysetting .exit {
    margin: 10px auto;
    width: 90%;
}
.mysetting .dl2::before {
    display: none;
}
.mysetting .dl2 dd {
    position: absolute;
    top: 0.7rem;
    right: 0.75rem;
    margin-top: -0.2rem;
}
.mysetting .exit button {
    border: none;
    background: #ec0022;
    color: #fff;
    width: 100%;
    height: 1.9rem;
    font-size: 0.9rem;
    box-shadow: 0 2px 1px rgba(0, 0, 0, 0.34);
}
.mysetting .exit .disabled {
    background: #aaa;
}
</style>