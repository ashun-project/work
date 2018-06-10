<template>
    <!-- <Modal v-model="value" class="pwd-modal" :mask-closable="false" title="温馨提示" class-name="model">
      <a class="ivu-modal-close close" @click="cancle"><i class=" ivu-icon ivu-icon-ios-close-empty"></i></a>
      <div>您尚未完善以下信息，请先完善。<br>
        <div class="my-mt-field">
            <label for="">资金密码</label>
            <input type="password" ref="payPwd" maxlength="4" v-model="payPwd" @click="lastRange('payPwd')" @input="setPayPwd('payPwd')"/>
            <div class="analog-input">
                <span><i v-show="payPwd.length >= 1"></i></span>
                <span><i v-show="payPwd.length >= 2"></i></span>
                <span><i v-show="payPwd.length >= 3"></i></span>
                <span><i v-show="payPwd.length >= 4"></i></span>
            </div>
        </div>
        <div class="my-mt-field">
            <label for="">确认密码</label>
            <input type="password" ref="confirmPwd" maxlength="4" v-model="confirmPwd" @click="lastRange('confirmPwd')" @input="setPayPwd('confirmPwd')"/>
            <div class="analog-input">
                <span><i v-show="confirmPwd.length >= 1"></i></span>
                <span><i v-show="confirmPwd.length >= 2"></i></span>
                <span><i v-show="confirmPwd.length >= 3"></i></span>
                <span><i v-show="confirmPwd.length >= 4"></i></span>
            </div>
        </div>
        <span class="tip" v-if="textError">{{textError}}</span>
   </div>   
       <div slot="footer"> 
            <Button type="primary" style="background:#a9a9a9;border:none;"  @click = "cancle">取消</Button>
            <Button type="primary" @click = "handleAddSubmit">设置</Button>
        </div>     
   </Modal> -->
    <modal :modalShow='value' title="温馨提示" okText="设置" claName="pwd-modal" @btn-cancel='cancle' @btn-ok="handleAddSubmit">
        <div slot="content">
            <div>您尚未完善以下信息，请先完善。<br>
                <div class="my-mt-field">
                    <label for="">资金密码</label>
                    <input type="password" ref="payPwd" maxlength="4" v-model="payPwd" @click="lastRange('payPwd')" @input="setPayPwd('payPwd')" />
                    <div class="analog-input">
                        <span>
                            <i v-show="payPwd.length >= 1"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 2"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 3"></i>
                        </span>
                        <span>
                            <i v-show="payPwd.length >= 4"></i>
                        </span>
                    </div>
                </div>
                <div class="my-mt-field">
                    <label for="">确认密码</label>
                    <input type="password" ref="confirmPwd" maxlength="4" v-model="confirmPwd" @click="lastRange('confirmPwd')" @input="setPayPwd('confirmPwd')" />
                    <div class="analog-input">
                        <span>
                            <i v-show="confirmPwd.length >= 1"></i>
                        </span>
                        <span>
                            <i v-show="confirmPwd.length >= 2"></i>
                        </span>
                        <span>
                            <i v-show="confirmPwd.length >= 3"></i>
                        </span>
                        <span>
                            <i v-show="confirmPwd.length >= 4"></i>
                        </span>
                    </div>
                </div>
                <span class="tip" v-if="textError">{{textError}}</span>
            </div>
        </div>
    </modal>
</template>
<script>
import encryption from '@/components/common/module_js/md5';
import modal from '@/components/common/module_vue/modal.vue';
export default {
    props: {
        value: false
    },
    components: { modal },
    data () {
        return {
            payPwd: '',
            confirmPwd: '',
            textError: ''
        }
    },
    methods: {
        setPayPwd (box) {
            let len = this[box].length;
            if (len >= 4) {
                let rf = this.$refs[box];
                // this[box] = this[box].substr(0, 4);
                rf.blur()
            }
        },
        lastRange (box) {
            let rf = this.$refs[box];
            let vLen = this[box].length;
            if (rf.setSelectionRange) {                    //非ie
                rf.setSelectionRange(vLen, vLen);
            } else {                                         //ie
                let a = rf.createTextRange();            //ie支持creatTextRange
                a.moveStart('character', vLen);
                a.collapse(true);
                a.select();                                //选中操作
            }
        },
        cancle () {
            this.$emit('input', false);
        },
        handleAddSubmit () {
            if (!this.payPwd) {                0
                this.textError = '资金密码不能为空';
                return;
            }
            if (!this.confirmPwd) {
                this.textError = '确认资金密码不能为空';
                return;
            }
            let payStr = /^\d{4}$/;
            if (!payStr.test(this.payPwd)) {
                this.textError = '密码只能是数字';
                return;
            }
            if (this.confirmPwd !== this.payPwd) {
                this.textError = '两次输入密码不一致';
                return;
            }
            let params = {
                payPwdType: '1',
                payPwd: encryption.encrypt.md5(this.payPwd)
            }
            this.$http.post('/api/v2/user/setPayPwd', params, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.$Message.success('设置资金密码成功');
                this.$emit('on-end');
                // this.$emit('input', false);
            })
        }
    }
}
</script>
<style lang="less">
.pwd-modal .ivu-modal-close {
    display: none;
}
.pwd-modal .close {
    display: block;
}
.my-mt-field {
    position: relative;
    height: 48px;
    line-height: 48px;
    padding: 0 10px;
}
.my-mt-field label {
    color: #999;
    font-size: 16px;
    width: 105px;
}
.my-mt-field input {
    height: 100%;
    position: absolute;
    left: 115px;
    right: 10px;
    z-index: 30;
    background: none;
    letter-spacing: 28px;
    padding-left: 18px;
    /* opacity: 0; */
    color: #ec0022;
    width: 144px;
    padding-right: 18px;
    text-shadow: #fff;
    -webkit-text-fill-color: transparent;
    border: 0;
    outline: none;
}
.my-mt-field .analog-input {
    height: 36px;
    border-left: 1px solid #eee;
    position: absolute;
    top: 6px;
    left: 115px;
}
.my-mt-field .analog-input span {
    display: inline-block;
    width: 36px;
    height: 36px;
    border: 1px solid #eee;
    text-align: center;
    line-height: 33px;
    float: left;
    border-left: 0;
}
.my-mt-field .analog-input span i {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #000;
    border-radius: 100%;
}
.pwd-modal .tip {
    display: block;
    margin-left: 115px;
    color: #ec0022;
    font-size: 12px;
}
</style>

