<template>
    <div class="resetLoginPwd">
        <my-header title="设置资金密码" :bkUrl="goBk">
        </my-header>
        <section>
            <div class="form-box">
                <div class="box-bd">
                    <p class="block-tip">为了您账户安全，请设置资金密码</p>
                    <!-- <mt-field label="真实姓名" type="text" placeholder="请输入真实姓名"  v-model="realName"></mt-field> -->
                    <!-- <mt-field label="资金密码" type="password" placeholder="请输入资金密码"  autocomplete="new-password"  v-model="payPwd"></mt-field> -->

                    <div class="my-mt-field">
                        <label for="">资金密码</label>
                        <input type="password" ref="payPwd" :class="{allfill: payPwd.length>= 4}" maxlength="4" v-model="payPwd" @click="lastRange('payPwd')" @input="setPayPwd('payPwd')" />
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
                        <input type="password" ref="confirmPwd" :class="{allfill: confirmPwd.length>= 4}" maxlength="4" v-model="confirmPwd" @click="lastRange('confirmPwd')" @input="setPayPwd('confirmPwd')" />
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
                </div>
            </div>
            <div class="ui-btn-wrap">
                <a @click="savePayPwd" class="red-btn">确 认</a>
            </div>
        </section>

    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
export default {
    data () {
        return {
            // realName:"",
            payPwd: "",
            confirmPwd: "",
            goBk: '/personalInfo'
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
        savePayPwd () {
            if (this.payPwd == null || this.payPwd == '') {
                this.$Message("请输入资金密码");
                return;
            }
            // if(this.realName==null || this.realName==''){
            //     this.$Message("请输入真实姓名");
            //     return;
            // }
            if (this.confirmPwd !== this.payPwd) {
                this.$Message('两次密码不一致')
                return;
            }
            // let str = /^[^\u0000-\u00FF]*$/;
            // if (!str.test(this.realName)) {
            //     this.$Message('姓名只能输入中文');
            //     return;
            // }
            let payStr = /^\d{4}$/;
            if (!payStr.test(this.payPwd)) {
                this.$Message('密码只能是四位数字')
                return;
            }
            var pwdMd5 = encryption.encrypt.md5(this.payPwd);
            this.$http.post('/api/v2/user/setPayPwd', { payPwdType: '1', payPwd: pwdMd5 }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.$Message("资金密码设置成功");
                // 判断从提现页面进来
                if (this.$route.params.per) {
                    this.$router.push('/takefee');
                } else {
                    this.$router.push('/personalInfo');
                }
            })
        }
    },
    created () {
        // 判断从提现页面进来
        if (this.$route.params.per) {
            this.goBk = '/personalCenter'
        }
    }
}
</script>

<style scoped>
.resetLoginPwd input {
    font-size: 0.7rem;
}
.resetLoginPwd .red-btn {
    height: 2.2rem;
    line-height: 2.2rem;
    background-image: -webkit-linear-gradient(-45deg, #ec0022, #ec0022);
    background-image: linear-gradient(-45deg, #ec0022, #ec0022);
    color: #fff;
    border-radius: 6px;
    display: block;
    text-align: center;
}
.resetLoginPwd .block {
    display: block;
}
.resetLoginPwd .box-shadow-red {
    box-shadow: 0 1px 7px rgba(211, 67, 55, 0.8);
}
.resetLoginPwd .margin-center {
    margin-left: auto;
    margin-right: auto;
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
    transition: all 0.1s;
}
.my-mt-field .allfill {
    left: 100px;
    padding-right: 0;
    width: 160px;
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
</style>