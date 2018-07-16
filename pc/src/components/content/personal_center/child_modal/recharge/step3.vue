<template>
    <!-- 订单完成界面 -->
    <div class="step-three" id="step-three">
        <div class="go-back" @click="goBack">
            <!-- <img src="/static/images/bk-one.png" alt=""> -->
            <span>返回充值列表</span>
        </div>
        <div v-if="!offBank">
            <div class="head-info">
                <img src="/static/images/commit.png" alt="">
                <!-- 订单已生成 -->
                <span v-if="data.currentData.onOrOff !== '01'">订单已生成</span>
                <span v-else>充值申请成功</span>
            </div>
            <div class="cont-info" v-if="data.data.type === '2' || data.data.type === '3'">
                <!-- <h6>审核订单</h6> -->
                <div class="cont">
                    <div class="img">
                        <img :src="data.currentData.channelIcon" alt="">
                    </div>
                    <div class="txt">
                        <p>
                            <label for="">类型：</label>
                            <span>第三方支付</span>
                        </p>
                        <p>
                            <label for="">订单号：</label>
                            <span>{{data.data.orderId}}</span>
                        </p>
                        <p>
                            <label for="">订单金额：</label>
                            <span class="font-yellow">
                                <strong>￥{{data.money}}</strong>
                            </span>
                        </p>
                    </div>
                    <div class="clr"></div>
                </div>
                <a class="btn" :href="data.data.content" target="_blank" @click="goSubmit(data.data.type)" v-if="!beforSubmit && data.data.type === '2'">确认支付</a>
                <a class="btn" @click="goSubmit(data.data.type)" target="_blank" v-else-if="!beforSubmit && data.data.type === '3' && !flag">确认支付</a>
                <a class="btn ordered" v-if="!(!beforSubmit && data.data.type === '3')">
                    <span v-if="data.currentData.onOrOff !== '01'">订单已提交</span>
                    <span v-else>充值申请成功</span>
                </a>
                <!-- <a class="btn ordered" v-if="(!(!beforSubmit && data.data.type === '3')) && data.currentData.onOrOff !== '01'">订单已提交</a>
                <a class="btn ordered" v-else-if="(!(!beforSubmit && data.data.type === '3')) && data.currentData.onOrOff === '01'">充值申请成功</a> -->
                <a class="btn" @click="queryRechargeList" v-show="beforSubmit">查看充值记录</a>
            </div>
            <div class="cont-info saoma" v-else>
                <div class="cont">
                    <div class="img">
                        <div class="qr-img" v-if="data.data.type === '0'">
                            <div id="qr-code"></div>
                        </div>
                        <div class="qr-img" v-else-if="data.data.type === '1'">
                            <img :src="data.data.content" alt="">
                        </div>
                        <div class="qr-img" v-else-if="data.data.type === '4'">
                            <img :src="'data:image/png;base64,'+data.data.content" alt="">
                        </div>
                    </div>
                    <div class="txt">
                        <h6>扫描二维码进行支付</h6>
                        <p>
                            <label for="">类型：</label>
                            <span>扫码支付</span>
                        </p>
                        <p>
                            <label for="">订单金额：</label>
                            <span class="font-yellow">
                                <strong>￥{{data.money}}</strong>
                            </span>
                        </p>
                        <div class="detailed" v-if="data.currentData.onOrOff !== '01'">
                            <span>1.)&nbsp;请在APP中打开&nbsp;"扫一扫"</span><br/>
                            <span>2.)&nbsp;输入充值金额</span><br/>
                            <!-- <span>3.)&nbsp;点击添加备注</span><br/>
                            <span>4.)&nbsp;填上备注订单号</span><br/> -->
                            <span>3.)&nbsp;付款成功后，点击"支付完成"</span>
                        </div>
                        <div class="detailed" v-else>
                            <span>1.)&nbsp;请在APP中打开&nbsp;"扫一扫"</span><br/>
                            <span>2.)&nbsp;进入APP后至转账页/加好友并转账</span><br/>
                            <span>3.)&nbsp;输入充值金额</span><br/>
                            <span>4.)&nbsp;点击添加备注</span><br/>
                            <span>5.)&nbsp;填上备注订单号
                                <span class="font-blue">{{data.data.orderId}}</span>
                            </span><br/>
                            <span>6.)&nbsp;付款成功后，点击"支付完成"</span>
                        </div>
                    </div>
                    <div class="clr"></div>
                    <div class="check-order">
                        <a class="btn" @click="queryRechargeList">支付完成，查看订单</a>
                    </div>
                </div>

            </div>
        </div>
        <div class="done-order" v-else>
            <div class="top-tip">
                <div class="confirmicon"></div>
                <div class="confirm1">
                    <!-- <span>订单已提交</span> -->
                    <span v-if="data.currentData.onOrOff !== '01'">订单已提交</span>
                    <span v-else>充值申请成功</span>
                    <p>
                        <span>一般到账时间在5分钟左右，最快2分钟内到账。</span>
                    </p>
                </div>
            </div>

            <div class="info">
                <dl class="first-in">
                    <dt>
                        充值信息
                    </dt>
                    <dd>
                        <span class="bk-clr bk-clr-child-wrap">
                            收款人：{{data.currentData.accountName}}
                            <span class="bk-clr-child " @click="copyWords(data.currentData.accountName)">复制</span>
                        </span>
                        <span class="bk-clr-child-wrap">
                            开户行：{{data.currentData.bankName}}
                            <span class="bk-clr-child" @click="copyWords(data.currentData.bankName)">复制</span>
                        </span>
                        <span class="bk-clr bk-clr-child-wrap">
                            银行卡号：{{data.currentData.bankNo}}
                            <span class="bk-clr-child" @click="copyWords(data.currentData.bankNo)">复制</span>
                        </span>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        充值金额
                    </dt>
                    <dd>
                        <span>{{data.money}}</span>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        充值时间
                    </dt>
                    <dd>
                        <span class="bk-clr">{{data.currentData.rechargeTime}}</span>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        充值类型
                    </dt>
                    <dd>
                        <span class="bo-b">{{data.currentData.rechargeUserType}}</span>
                    </dd>
                </dl>
            </div>
            <div style="text-align:center;">
                <Button type="primary" size="large" class="confirmbutton" @click="queryRechargeList">查看充值记录</Button>
            </div>
        </div>
        <!-- 回退提示 -->
        <modal :modalShow="payTip" claName="pay_tip" :width="355" :maskClosable="true" :hasFooter="true" :hasOkBtn="true" @btn-ok="closePayTipDialog" @btn-cancel="holdPayTipDialog">
            <div slot="content" style="text-align:center;font-size:12px;padding-top:10px;">
                <p style="font-weight:bold;font-size:16px">请确认支付已完成后再退出!</p>
                <p style="line-height:26px;">若未实际付款，审核将不通过</p>
            </div>
        </modal>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import modal from "@/components/common/module_vue/modal";
export default {
    components: { modal },
    props: {
        data: {
            type: Object,
        },
        parentData: {
            type: Object
        },
        flag: {
            default: false
        }
    },
    data () {
        return {
            beforSubmit: false,
            offBank: false,
            payTip: false,
            nextFlag: false //返回还是查看充值记录的标识
        }
    },
    methods: {
        /**
         * 阻止键盘后退
         */
        stopBackSpace () {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', (e) => {
                history.pushState(null, null, document.URL);
                this.payTip = true;
            }, false)
            document.addEventListener('keydown', this.handlerKey, false);
            document.addEventListener('keypress', this.handlerKey, false);
        },
        /**
         * 键盘后退事件
         */
        handlerKey (e) {
            let ev = e || window.event;
            if (this.$route.params.id === 'recharge' && ev.keyCode === 8) {
                window.event && (window.event.returnValue = false);
                e && e.preventDefault();
                this.payTip = true;
            }
        },
        holdPayTipDialog () {
            this.payTip = false;
            if (this.nextFlag) this.nextFlag = false;
        },
        closePayTipDialog () { //返回充值列表提示支付
            this.payTip = false;
            document.removeEventListener('keydown', this.handlerKey, false);
            document.removeEventListener('keypress', this.handlerKey, false);
            window.removeEventListener('popstate', (e) => {
                history.pushState(null, null, document.URL);
                this.payTip = true;
            }, false);
            if (this.nextFlag) { //去充值记录
                this.$router.push({ name: "personalCenter", params: { id: "trade" } });
                return
            }
            this.$emit('get-back-status', 0); //返回
        },
        copyWords (text) {
            //复制文本
            let copyInput = document.createElement('input');
            copyInput.value = text;
            document.body.appendChild(copyInput);
            copyInput.select();//选择对象
            document.execCommand('copy');
            document.body.removeChild(copyInput)
            this.$Message.success('复制成功')
        },
        queryRechargeList () {
            if (this.data.currentData.onOrOff !== '01') {
                this.$router.push({ name: "personalCenter", params: { id: "trade" } });
                return
            }
            this.nextFlag = true;
            this.payTip = true;
        },
        goSubmit (type) {
            if (type === '3') {
                let width = document.documentElement.clientWidth || document.body.clientWidth
                let height = document.documentElement.clientHeight || document.body.clientHeight
                let mywindow = window.open('', '', 'width=600,height=750,left=' + width / 3 + ',top=' + height / 6)
                mywindow.left = "400px"
                mywindow.document.write(this.data.data.content)
                // document.write(this.data.data.content)
            }
            this.beforSubmit = true;
        },
        goBack () {
            if (this.data.currentData.onOrOff !== '01') {
                this.$emit('get-back-status', 0);
                return
            }
            this.payTip = true;
        }
    },
    mounted () {
        let data = this.data.data;
        if (data && data.type === '0') {
            let code = new QRCode('qr-code', this.data.data.content);
        }
    },
    created () {
        this.stopBackSpace();
        if (this.data.currentData.accountType === '0' && this.data.currentData.onOrOff === '01') {
            this.offBank = true;
        }
        // if (this.data.data.type === '2') {
        //     window.open(this.data.data.content)
        // }
    },
    beforeDestroy () {
        document.removeEventListener('keydown', this.handlerKey, false);
        document.removeEventListener('keypress', this.handlerKey, false);
        window.removeEventListener('popstate', (e) => {
            history.pushState(null, null, document.URL);
            this.payTip = true;
        }, false);
    }
}
</script>
<style scoped>
.step-three .done-order dl dd .bk-clr-child {
    position: absolute;
    top: 6px;
    background-color: white;
    text-align: center;
    color: #989899;
    right: 10px;
    width: 40px;
    cursor: pointer;
    border: 1px solid #989899;
    padding: 0px 4px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 18px;
}
.step-three .done-order dl dd .bk-clr-child:hover {
    color: #ff7614;
    border-color: #ff7614;
}
.bk-clr-child-wrap {
    position: relative;
}
</style>

<style lang="less" scoped>
.step-three .go-back {
    width: 140px;
    border: 1px solid #ff7614;
    height: 35px;
    line-height: 35px;
    border-radius: 6px;
    color: #ff7614;
    background: url('/static/images/bk-one.png') no-repeat left center;
    background-position-x: 10px;
    text-align: center;
    padding-left: 30px;
    cursor: pointer;
    margin-bottom: 10px;
}
.step-three .go-back img {
    width: auto;
    height: auto;
}
.step-three .done-order {
    margin-top: 86px;
}
// .step-three .done-order .top-tip{

// }
.step-three .done-order .info {
    border-right: 1px solid #e2e2e2;
    width: 425px;
    margin: 30px auto 0;
}
.step-three .done-order dl.first-in {
    height: 105px;
}
.step-three .done-order dl {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #fff;
}
.step-three .done-order dl dd,
.step-three .done-order dl dt {
    display: inline-block;
    height: 100%;
    float: left;
}
.step-three .done-order dl.first-in dt {
    height: 100%;
    line-height: 105px;
}
.step-three .done-order dl dt {
    color: #fff;
    width: 90px;
    text-align: center;
    background: @common-bg;
}
.step-three .done-order dl dd span {
    display: block;
    padding-left: 12px;
    width: 334px;
}
.step-three .done-order dl dd span.bk-clr {
    background: #e2e2e2;
}
.step-three .done-order dl dd span.bo-b {
    border-bottom: 1px solid #e2e2e2;
    height: 34px;
    line-height: 34px;
}
.step-three .confirmicon {
    // float: left;
    display: inline-block;
    vertical-align: top;
    width: 60px;
    height: 60px;
    margin-left: 170px;
    background: url('/configstatic/pc/images/icon.png') no-repeat -76px -509px;
}
.step-three .confirm1 {
    // float: left;
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
}
.step-three .confirm1 span {
    font-size: 24px;
    color: #313131;
    font-weight: bold;
}
.step-three .confirm1 p > span {
    font-size: 16px;
    font-weight: normal;
}
.step-three .confirmbutton {
    // margin-left: 290px;
    margin-top: 28px;
    width: 162px;
    background-color: @common-bg;
    border: 1px solid @common-active-border-color;
}

/* 线上 */
.step-three .font-yellow {
    color: #ff7614;
    font-size: 20px;
}
.step-three .font-blue {
    color: #106ddc;
}
.step-three .head-info {
    height: 50px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    background: #12b886;
    border-radius: 10px;
    justify-content: center;
}
.step-three .head-info img {
    width: auto;
    max-width: 55px;
    margin-right: 10px;
}
.step-three .cont-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.step-three .cont-info .cont .txt {
    /* width: 300px; */
    float: left;
    font-size: 16px;
}
/* .step-three .cont-info h6{
        font-size: 20px;
    } */
.step-three .cont-info .cont .txt label {
    min-width: 80px;
    display: inline-block;
}
.step-three .cont-info .cont .txt .detailed {
    font-size: 14px;
    color: #7a7a7a;
    padding-left: 50px;
    background: url('/static/images/shaomiao.png') no-repeat left center;
}
.step-three .cont-info .cont .img {
    width: 80px;
    height: 80px;
    margin-right: 20px;
    float: left;
}
/* .step-three .qr-img{
        width: 300px;
        height: 300px;
        padding: 10px;
        border: 1px solid #eee;
    } */
.step-three .cont-info.saoma .cont {
    min-width: 600px;
}
.step-three .cont-info.saoma .cont h6 {
    font-size: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
}
.step-three .cont-info.saoma .cont .img {
    width: 240px;
    height: 240px;
    padding: 10px;
    border: 1px solid #eee;
}
.step-three .cont-info.saoma .cont .img * {
    width: 100%;
    height: 100%;
}
.step-three .cont-info.saoma .check-order {
    border-top: 1px solid #ccc;
    text-align: center;
    margin-top: 20px;
}
.step-three .cont-info.saoma .check-order .btn {
    /* margin: 0 auto; */
    float: none;
    display: inline-block;
}
.step-three .cont-info .btn {
    background: #be1204;
    color: #fff;
    border-color: #be1204;
    max-width: 160px;
    text-align: center;
    margin-top: 20px;
    margin-right: 20px;
    float: left;
}
.step-three .cont-info .ordered {
    background: #ccc;
    color: #666;
    border-color: #eee;
}
.step-three .cont-info .btn.ordered:hover {
    background: #ccc;
}
.step-three .cont-info .btn:hover {
    background: #860e03;
}
</style>
<style scoped>
.v-transfer-dom >>> .ivu-modal-wrap.pay_tip .ivu-modal-footer {
    padding-bottom: 28px;
    padding-top: 8px;
}
</style>

