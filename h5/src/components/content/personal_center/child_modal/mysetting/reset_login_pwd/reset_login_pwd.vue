<template>
    <div class="resetLoginPwd">
        <my-header title="修改登录密码" bkUrl="/personalInfo">
        </my-header>
        <section>
            <div class="form-box">
                <div class="box-bd">
                    <mt-field label="旧密码" type="password" :attr="{ maxlength: 14}" placeholder="请输入旧密码" autocomplete="false" v-model="oldPassword"></mt-field>
                    <mt-field label="新密码" type="password" :attr="{ maxlength: 14}" placeholder="请输入新密码" autocomplete="false" v-model="newPassword"></mt-field>
                    <mt-field label="确认新密码" type="password" :attr="{ maxlength: 14}" placeholder="请输入确认新密码" autocomplete="false" v-model="newPassword2"></mt-field>
                </div>
            </div>
            <ul class="ui-btn-wrap">
                <a @click="savePwd()" class="ui-btn-block">确 认</a>
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
        savePwd () {
            var that = this;
            if (this.oldPassword == null || this.oldPassword.length < 6) {
                this.$Message("请输入旧密码");
                return;
            }
            if (this.newPassword == null) {
                this.$Message("请输入新密码");
                return;
            }
            if (this.newPassword.length < 6) {
                this.$Message("新密码最少6位");
                return;
            }
            if (this.newPassword2 == null || this.newPassword2.length < 6) {
                this.$Message("请输入确认新密码");
                return;
            }
            if (this.newPassword != this.newPassword2) {
                this.$Message("新密码和确认密码不一致");
                return;
            }

            var oldPwdMd5 = encryption.encrypt.md5(this.oldPassword);
            var newPwdMd5 = encryption.encrypt.md5(this.newPassword);
            this.$http.post('/api/v2/user/modifyPassword', { oldPassword: oldPwdMd5, newPassword: newPwdMd5 }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.$Message("登录密码修改成功");
                this.$router.push('/mysetting');
            })
        }
    }
}
</script>
<style>
</style>

