<template>
    <div class="recharge">
        <div class="paylist" v-if="step === 0">
            <ul>
                <li v-for="item in list" :key="item.payTopTypeName" :class="{active: item.payTopTypeName == name}" @mouseenter="changeCss(item.payTopTypeName)" @click="enterNext(item)">
                    <div class="border">
                        <div class="img">
                            <img :src="item.payTopTypeIcon">
                        </div>
                        <div class="contents">
                            <div class="w1">{{item.payTopTypeName}}</div>
                            <div class="w2" v-html="escapeHtml(item.payTopTypeDescribe)"></div>
                        </div>
                    </div>
                    <div class="pay">
                        <p class="gopay">
                            <span>去支付</span>
                            <i class='i-two-right-arrow' v-show="item.payTopTypeName === name"></i>
                        </p>
                        <div class="right" v-show="item.payTopTypeName === name">
                            <Icon type="ios-checkmark-empty" size="40" color="white" class="iconright"></Icon>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="clr"></div>
        </div>
        <!-- <step-one :data="stepOneData" @get-back-status="getBackStatus" v-if="step === 1"></step-one> -->
        <step-two :data="stepTowData" @get-back-status="getBackStatus" v-if="step === 2"></step-two>
        <step-three :data="stepThreeData" :parentData="stepTowData" @get-back-status="getBackStatus" :flag="flag" v-if="step === 3"></step-three>
    </div>
</template>

<script>
// import stepOne from './step1'
import stepTwo from './step2'
import stepThree from './step3'
export default {
    data () {
        return {
            list: [],
            name: '',
            step: 0,
            stepOneData: {},
            stepTowData: {},
            flag: false   //网银充值
        }
    },
    components: {
        // stepOne,
        stepTwo,
        stepThree
    },
    methods: {
        escapeHtml (str) {
            var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
        },
        changeCss (name) {
            this.name = name;
        },
        enterNext (item) {
            this.stepTowData = item;
            this.step = 2;
        },
        getBackStatus (result, str) {
            if (str === '01') {
                this.flag = true
            } else {
                this.flag = false
            }
            if (typeof result === 'number') {
                this.step = result;
            } else {
                this.step += 1;
                if (this.step === 3) {
                    this.stepThreeData = result;
                }
            }
        }
    },
    created () {
        this.$http.post('/api/v2/user/getUsablePayType', '', { userId: true, unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            this.list = response.data.data;
            // console.log(this.list);
        })
    },
    beforeDestroy () {
        localStorage.removeItem('another')
    }
}
</script>

<style lang="less">
.recharge .paylist {
    padding: 8px 10px;
}
.recharge .paylist li {
    float: left;
    width: 325px;
    height: 174px;
    margin: 0 15px 25px;
    border: 1px solid #d5d5d5;
}
.recharge .paylist li:hover {
    cursor: pointer;
}
.recharge .paylist li.active {
    border: 1px solid @common-active-border-color;
}
.recharge .paylist li .border {
    width: 100%;
    height: 127px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.recharge .paylist li .border .img {
    width: 116px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.recharge .paylist li .border .img img {
    width: 100%;
    max-width: 100%;
}
.recharge .paylist li .contents {
    font-size: 16px;
    margin-left: 25px;
    width: 150px;
}
.recharge .paylist li .contents .w1 {
    font-size: 26px;
    font-weight: bold;
    color: #010101;
}
.recharge .paylist li .contents .w2 {
    margin-top: 5px;
    color: #313131;
}
.recharge .paylist li .contents .w2 img {
    width: auto;
}
.recharge .paylist li .pay {
    position: relative;
    background-color: #f1f1f1;
    text-align: center;
    width: 100%;
    height: 45px;
    border-top: 1px solid #d5d5d5;
}
.recharge .paylist li.active .gopay {
    color: @common-active-color;
    background: #fbfbfb;
}
.recharge .paylist li .gopay {
    width: 323px;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    text-align: center;
    position: absolute;
}
.recharge .paylist li .gopay i {
    display: inline-block;
    vertical-align: top;
    margin-top: 17px;
    margin-left: 12px;
    visibility: visible;
}
.recharge .paylist li .right {
    position: absolute;
    right: 0;
    top: 16px;
    width: 28px;
    height: 0;
    border-bottom: 29px solid @common-color;
    border-left: 29px solid transparent;
}
.recharge .paylist li .right i {
    width: 10px;
    height: 10px;
    position: absolute;
    right: 7px;
    font-size: 40px;
    color: #fff;
}
</style>
