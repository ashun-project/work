<template>
    <div class="bankingBank">
        <my-header title="绑定银行卡" :bkUrl="goBk"></my-header>
        <section>
            <div class="form-box">
                <div class="box-hd">请输入您的身份信息</div>
                <div class="box-bd">
                    <div class="form-box my-mt-field">
                        <label for="">
                            真实姓名
                        </label>
                        <input type="text" placeholder="请输入真实姓名" v-model="bandingInfo.accountName">
                    </div>
                    <!-- <mt-field label="真实姓名" placeholder="请输入真实姓名" v-model="bandingInfo.accountName"></mt-field> -->
                </div>
            </div>
            <div class="form-box">
                <div class="box-hd">请输入您的银行卡信息</div>
                <div class="box-bd">
                    <div class="form-box my-mt-field">
                        <label for="">
                            银行卡号
                        </label>
                        <input type="text" placeholder="请输入银行卡号" maxlength="19" v-model="bandingInfo.bankNo" @input="setRole('num', 'bankNo')" @blur="queryBankFrom">
                    </div>
                    <div class="form-box my-mt-field">
                        <label for="">
                            银行名称
                        </label>
                        <input type="text" placeholder="请输入银行名称" v-model="bandingInfo.bankName">
                    </div>
                    <div class="form-box my-mt-field">
                        <label for="">
                            开户行
                        </label>
                        <input type="text" placeholder="请输入开户行" v-model="bandingInfo.openBankName">
                    </div>
                    <!-- <mt-field label="开户行" placeholder="请输入开户行" v-model="bandingInfo.openBankName" disableClear></mt-field> -->
                    <dl class="m-t-20">
                        <dt class=" aui-content-padded aui-font-size-14 t-grey-666">
                            <label><input type="checkbox" value="1" v-model="agressBtn" style="height:auto"> 我已同意《服务协议》</label>
                        </dt>
                    </dl>
                    <p class="tip">尊敬的用户，为了保障您的资金安全，请您绑定您的真实姓名和设置取款密码。如果姓名与开户名不一致，将无法取款</p>
                </div>
            </div>
        </section>
        <div class="ui-btn-wrap">
            <a @click="doBanding" class="red-btn">确定绑卡</a>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            goBk: '/bankList',
            agressBtn: 1,
            bandingInfo: {
                accountName: "",
                bankNo: "",
                openBankName: "",
                bankName: ""
            }
        };
    },
    computed: {
        // accountName () {
        //     return this.$store.state.user.realName;
        // }
    },
    methods: {
        setRole (type, value) {
            let role = /[^0-9]/ig;
            // if (type == 'word') role = /[^\u4e00-\u9fa5]/ig;
            this.$set(this.bandingInfo, value, this.bandingInfo[value].replace(role, ''))
        },
        resetUser () {
            let user = localStorage.getItem('user');
            user = JSON.parse(user)
            user.realName = this.bandingInfo.accountName;
            localStorage.setItem('user', JSON.stringify(user));
            this.$store.commit('getUser', user);
        },
        queryBankFrom () {
            if (this.bandingInfo.bankNo == "") return;
            if (this.bandingInfo.bankNo.length < 16) {
                this.$Message('请输入正确的银行卡号');
                return;
            }
            this.$http.post("/api/v2/user/queryBankFrom", { bankNo: this.bandingInfo.bankNo }, { userId: true, notTip: true }).then(response => {
                if (response.data.code !== 0) return;
                this.bandingInfo.bankName = response.data.data.bankName;
            });
        },
        doBanding () {
            let str = /^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/;///^[^\u0000-\u00FF]*$/;
            let word = /^[\u4e00-\u9fa5]+$/;
            if (!str.test(this.bandingInfo.accountName) || this.bandingInfo.accountName < 2 || this.bandingInfo.accountName.length > 12) {
                this.$Message('姓名只能为2-12位的中文字符');
                return;
            }
            if (this.bandingInfo.accountName == "") {
                this.$Message("请输入真实姓名");
                return;
            }
            if (this.bandingInfo.bankNo == "") {
                this.$Message("请输入银行卡号");
                return;
            }
            if (this.bandingInfo.bankName == "" || this.bandingInfo.bankName.length <= 0) {
                this.$Message("请输入银行名称");
                return;
            }
            if (!word.test(this.bandingInfo.bankName)) {
                this.$Message("银行名称只能输入中文");
                return;
            }
            if (this.bandingInfo.openBankName == "" || this.bandingInfo.openBankName.length <= 0) {
                this.$Message("请输入开户行");
                return;
            }
            if (!word.test(this.bandingInfo.openBankName)) {
                this.$Message("开户行只能输入中文");
                return;
            }
            if (this.agressBtn != "1") {
                this.$Message("请先同意服务协议");
                return;
            }
            if (this.bandingInfo.bankNo.length < 16) {
                this.$Message("银行卡号最少16位");
                return;
            }
            this.$http.post("/api/v2/user/bandingBankInfo", this.bandingInfo, { userId: true }).then(response => {
                if (response.data.code !== 0) return;

                this.resetUser();
                // 判断从提现页面进来
                if (this.$route.params.tf) {
                    this.$router.push("/takefee");
                } else {
                    this.$router.push("/bankList");
                }
            });
        }
    },
    created () {
        if (this.$route.params.tf) {
            this.goBk = '/takefee';
        }
    }
};
</script>

<style lang="less">
.bankingBank .my-mt-field {
    box-sizing: border-box;
    color: inherit;
    min-height: 48px;
    font-size: 16px;
    line-height: 48px;
    padding: 0 10px;
    width: 100%;
    position: relative;
}
.bankingBank .my-mt-field label {
    width: 105px;
    display: inline-block;
    float: left;
    color: #999;
}
.bankingBank .my-mt-field input {
    float: left;
    font-size: 0.8rem;
    user-select: text;
    outline: 0;
    height: 25px;
    line-height: 25px;
    position: absolute;
    left: 115px;
    top: 10px;
    right: 10px;
}
// .bankingBank .ui-btn-wrap{
//     width: 95%;
// }
.bankingBank .red-btn {
    height: 2.2rem;
    line-height: 2.2rem;
    background-image: -webkit-linear-gradient(-45deg, #ec0022, #ec0022);
    background-image: linear-gradient(-45deg, #ec0022, #ec0022);
    color: #fff;
    border-radius: 6px;
    display: block;
    text-align: center;
}
.bankingBank .block {
    display: block;
}
.bankingBank .box-shadow-red {
    box-shadow: 0 1px 7px rgba(211, 67, 55, 0.8);
}
.bankingBank .background-none {
    background-image: none;
}
.bankingBank .margin-center {
    margin-left: auto;
    margin-right: auto;
}
.bankingBank .m-t-20 {
    margin-left: 0.5rem;
}
.bankingBank .tip {
    font-size: 0.6rem;
    padding: 0.2rem 0.5rem 0.25rem;
    color: #ec0022;
}
</style>