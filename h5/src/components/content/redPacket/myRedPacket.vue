<template>
    <div class="packet packet-mbg" ref="viewBox">
        <my-header title="我的红包" bkUrl="/redPacket">
            <span slot="h-right" @click="goPage('/redPacket/rule')">
                活动规则
            </span>
        </my-header>
        <div class="body2" ref="scrollObj">
            <div class="head">
                <div class="left">
                    <label class="key">红包总额：</label>
                    <span class="val">{{redpacketAmount | keepDecimalOf2}}元</span>
                </div>
                <div class="right">
                    <label class="key">红包个数：</label>
                    <span class="val">{{redpacketCount}}个</span>
                </div>
            </div>
            <my-scroll :fetchData="queryList" :status="status">
                <div class="my-box">
                    <table class="me-tb">
                        <thead>
                            <tr>
                                <th>时间</th>
                                <th>红包类型</th>
                                <th>金额</th>
                                <th>提现</th>
                            </tr>
                        </thead>
                        <tbody v-if="packetList && packetList.length> 0">
                            <tr v-for="(item, index) in packetList" :key="index">
                                <td>{{item.createTime | formateDate}}</td>
                                <td>{{item.redpacketType}}</td>
                                <td>{{item.money |keepDecimalOf2}}元</td>
                                <td>
                                    <span class="btn" v-if="item.status === '01'" @click="takeMoney(item,$event)" :class="{'disabled':!isSubmit}">提现</span>
                                    <!-- 红包状态：00冻结，01未提现，02已提现 -->
                                    <span class="" v-else>{{item.statusDesc}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </my-scroll>
        </div>
        <div class="packet-shadow" v-if="showDialg"></div>
        <div class="packet-dlg2 dialog" v-if="showDialg">
            <i class="close" @click="closeDlg"></i>
            <div class="dlg-name">很抱歉</div>
            <div class="dlg-body">
                <p class="tip">
                    {{warnMsg}}
                </p>
                <span class="rule-btn" @click="closeDlg">关闭</span>
            </div>
        </div>
        <div class="packet-shadow" v-if="showDialg || showDialg1"></div>
        <div class="packet-dlg-tx dialog" v-if="showDialg1">
            <i class="close" @click="closeDlg2"></i>
        </div>
    </div>
</template>

    

<script>
import dateUtil from "@/components/common/module_js/format_date.js";
export default {
    data () {
        return {
            packetList: [],
            redpacketAmount: 0,  //红包总金额
            redpacketCount: 0,  //红包总数量
            current: 1,
            size: 20,
            showDialg: false,
            showDialg1: false,
            warnMsg: '',
            status: 0,
            isSubmit: true,
            //  clientType:'wap'
        }
    },
    mounted: function () {

    },
    filters: {
        formateDate (val) {
            return val ? dateUtil.getFormatDate(val) : ''
        }
    },
    methods: {
        goPage (url) {
            this.$router.push(url);
        },
        closeDlg () {
            this.showDialg = false
        },
        closeDlg2 () {
            this.showDialg1 = false
        },
        queryList () {
            this.status = 1;
            this.$http.post('/api/v2/user/redpacket/me', {
                current: this.current,
                size: this.size
            }, { userId: true, loading: 2, noEncrypt: true }).then(response => {
                this.status = 0;
                if (response.data.code !== 0) {
                    this.status = 2;
                    return
                };
                var data = response.data.data;
                this.current++;
                this.redpacketCount = data.redpacketCount;
                this.redpacketAmount = data.redpacketAmount;
                if (data.userRedPacketList && data.userRedPacketList.length > 0) {
                    this.packetList = this.packetList.concat(data.userRedPacketList);
                } else {
                    this.status = 2;
                }
                if (this.packetList.length <= 0) {
                    this.status = 3;
                }
            })
        },
        takeMoney (info, event) {
            if (!event.target.className) return
            if (!this.isSubmit) {
                return
            }
            this.isSubmit = false;
            this.$http.post('/api/v2/user/redpacket/take', {
                redpacketId: info.redpacketId,
            }, { userId: true, loading: 2, notTip: true }).then(response => {
                this.isSubmit = true;
                if (response.data.code === 139) {
                    this.warnMsg = response.data.msg;
                    this.showDialg = true
                } else if (response.data.code === 0) {
                    /* event.target.className = '';
                    event.target.innerText = '已提现'; */
                    info.status = '02'
                    info.statusDesc = '已提现'
                    this.redpacketAmount = Number(Number(this.redpacketAmount) + (info.money)).toFixed(2)
                    this.showDialg1 = true

                }

            })
        }
    },

}
</script>
<style scored lang="less">
@rem: 40rem;
.packet {
    .head {
        display: flex;
        align-items: center;
        margin-bottom: 20 / @rem;
        height: 60 / @rem;
        .left {
            flex: 1;
        }
        .key {
            color: #fff;
            font-size: 24 / @rem;
        }
        .val {
            color: #f1f3b3;
            font-size: 36 / @rem;
        }
    }
    .me-tb {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        font-size: 24 / @rem;
        th,
        td {
            border: 1px solid #c10002;
            width: 25%;
        }
        th {
            height: 70 / @rem;
            background-color: #750606;
            color: #efddb7;
        }
        td {
            height: 60 / @rem;
            font-size: 20 / @rem;
            background-color: #efddb7;
            color: #bd2415;
            .btn {
                background-color: #ec0022;
                color: #fff;
                border: 0;
                border-radius: 2px;
                padding: 5 / @rem 10 / @rem;
            }
            .disabled {
                color: #fff;
                background-color: #999;
            }
        }
        .empty {
            height: 60 / @rem;
        }
    }
    .box-hd {
        display: flex;
        align-items: center;
        span {
            flex: 1;
            text-align: center;
        }
    }
}

.packet-mbg {
    background: url(../../../resource/images/redPacket/me-bg.png) #960001 repeat;
    background-size: 100% 74 / @rem;
    padding: 30 / @rem;
    height: 100%;
    overflow: auto;
    .body2 {
        position: relative;
    }
}
</style>


