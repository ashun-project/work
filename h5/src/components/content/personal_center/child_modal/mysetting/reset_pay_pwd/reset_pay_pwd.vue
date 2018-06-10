<template>
    <div class="resetLoginPwd">
        <my-header title="修改资金密码" bkUrl="/personalInfo">
        </my-header>
        <section>
            <div class="form-box">
                <div class="box-bd">
                    <mt-field label="旧密码" type="password" placeholder="请输入旧密码" :attr="{ maxlength: 4}" autocomplete="new-password" v-model="oldPassword"></mt-field>
                    <mt-field label="新密码" type="password" placeholder="请输入新密码" :attr="{ maxlength: 4}" autocomplete="new-password" v-model="newPassword"></mt-field>
                    <mt-field label="确认新密码" type="password" placeholder="请输入确认新密码" :attr="{ maxlength: 4}" autocomplete="new-password" v-model="newPassword2"></mt-field>
                </div>
            </div>
            <ul class="ui-btn-wrap">
                <a @click="updatePwd" class="ui-btn-block">确 认</a>
            </ul>
        </section>
    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
export default {
    data () {
        return {
            oldPassword: "",
            newPassword: "",
            newPassword2: ""
        }
    },
    methods: {
        updatePwd () {
            if (this.oldPassword == null) {
                this.$Message("请输入旧密码");
                return;
            }
            if (this.newPassword == null) {
                this.$Message("请输入新密码");
                return;
            }
            let payStr = /^\d{4}$/;
            if (!payStr.test(this.newPassword)) {
                this.$Message('密码只能是四位数字')
                return;
            }
            if (this.newPassword != this.newPassword2) {
                this.$Message("两次密码不一致");
                return;
            }

            var oldPwdMd5 = encryption.encrypt.md5(this.oldPassword);
            var newPwdMd5 = encryption.encrypt.md5(this.newPassword);
            this.$http.post('/api/v2/user/setPayPwd', { payPwdType: '2', oldPayPwd: oldPwdMd5, newPayPwd: newPwdMd5 }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.$Message("资金密码修改成功");
                this.$router.push('/personalInfo');
            })
        }
    }
}
</script>

<style scoped>
.resetLoginPwd .red-btn {
    height: 2.2rem;
    line-height: 2.2rem;
    background-image: -webkit-linear-gradient(-45deg, #ec0022, #ec0022);
    background-image: linear-gradient(-45deg, #ec0022, #ec0022);
    color: #fff;
    border-radius: 20px;
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
</style>