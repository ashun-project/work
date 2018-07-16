<template>
    <div class="packet">
        <my-header title="人品排行" bkUrl="/redPacket">
            <span slot="h-right" @click="goPage('/redPacket/rule')">
                活动规则
            </span>
        </my-header>

        <div ref="scrollObj" class="packet-bg scroll-wrap">
            <div class="order-head"></div>
            <table class="order-list">
                <thead>
                    <tr>
                        <th>排名</th>
                        <th>账号</th>
                        <th>红包类型</th>
                        <th>金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in orderList" :key="idx">
                        <td>
                            <span class="order">{{item.rankNum}}</span>
                        </td>
                        <td>{{item.userName}}</td>
                        <td>{{item.redType}}</td>
                        <td>{{item.money | keepDecimalOf2}}元</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
</template>

    

<script>
export default {
    data () {
        return {
            orderList: [],
        }
    },
    components: {

    },
    mounted: function () {
        this.$nextTick(() => {
            this.$refs.scrollObj.style.height = document.documentElement.clientHeight - this.$refs.scrollObj.getBoundingClientRect().top + "px";
        })
    },
    methods: {
        goPage (url) {
            this.$router.push(url);
        },
    },
    created: function () {
        this.$http.post('/api/v2/user/redpacket/pattern', '', { loading: 2, noEncrypt: true }).then(response => {
            if (response.data.code !== 0) return;
            this.orderList = response.data.data

        })
    }
}
</script>
<style scored lang="less">
@rem: 40rem;
.packet {
    .order-list {
        width: 100%;
        font-size: 24 / @rem;
        border-collapse: collapse;
        th,
        td {
            text-align: center;
            color: #fff;
            height: 82 / @rem;
            border: 1px solid #6a1f13;
            width: 25%;
        }
        thead {
            background-color: #c60001;
            th {
            }
        }
        tbody {
            background-color: #860000;
            tr {
                &:nth-child(1),
                &:nth-child(2),
                &:nth-child(3) {
                    td {
                        .order {
                            background: url(../../../resource/images/redPacket/order.png)
                                no-repeat;
                            background-size: 200 / @rem 200 / @rem;
                            width: 46 / @rem;
                            height: 60 / @rem;
                            font-size: 0;
                        }
                    }
                }
                &:nth-child(1) {
                    td {
                        .order {
                            background-position: 0 0;
                        }
                    }
                }
                &:nth-child(2) {
                    td {
                        .order {
                            background-position: -52 / @rem 0;
                        }
                    }
                }
                &:nth-child(3) {
                    td {
                        .order {
                            background-position: -104 / @rem 0;
                        }
                    }
                }
            }
            td {
                .order {
                    display: inline-block;
                    width: 40 / @rem;
                    height: 40 / @rem;
                    line-height: 40 / @rem;
                    border-radius: 100%;
                    text-align: center;
                    background-color: #efddb7;
                    color: #c60001;
                    font-size: 24 / @rem;
                }
            }
        }
    }
    .order-head {
        width: 430 / @rem;
        height: 180 / @rem;
        background: url(../../../resource/images/redPacket/order-tit.png)
            no-repeat;
        background-size: 430 / @rem 180 / @rem;
        margin: 0 auto 20 / @rem;
    }
}
.packet-bg {
    background: url(../../../resource/images/redPacket/xq-bg.png) #efe4dd repeat;
    background-size: 100% 200 / @rem;
    padding: 60 / @rem 32 / @rem;
    overflow: auto;
}
</style>

