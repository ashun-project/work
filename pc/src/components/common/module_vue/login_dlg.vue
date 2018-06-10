<template>
    <modal :modalShow="isShow" title="登录" claName="login-dlg-wrap" width="380" :hasFooter='false' @btn-cancel="closeDlg">
        <div slot="content">
            <div class="login-dlg">
                <!-- <i class="seft-close ivu-modal-close" @click="closeDlg">
                        <i class="ivu-icon ivu-icon-ios-close-empty"></i>
                </i> -->
                <div class="container">
                    <div class="cont">
                        <Form ref="formCustom" :model="formCustom" :rules="ruleInline">
                            <FormItem prop="userCode">
                                <Input type="text" v-model="formCustom.userCode" placeholder="用户名">
                                <Icon type="person" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="formCustom.password" placeholder="密码">
                                <Icon type="ios-locked" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="checkCode" class="valida">
                                <Input type="text" v-model="formCustom.checkCode" placeholder="验证码" @on-enter="handleSubmit('formCustom')">
                                <Icon type="social-snapchat" slot="prepend"></Icon>
                                </Input>
                                <img class="valida-code" :src="'/api/v2/user/captcha.jpg?d='+ timeInter" @click="timeInter = new Date().getTime()">
                                <div class="refresh-code" @click="refreshCode">
                                    <Icon type="refresh"></Icon>
                                </div>
                            </FormItem>
                            <div class="other-operation">
                                <a class="foget-password" @click="forgetPass()">忘记密码?</a>
                                <a href="#" class="go-register" @click.stop="goRegister">立即注册</a>
                            </div>
                            <FormItem style="margin-bottom:0">
                                <Button type="primary" class="commit-register" long @click="handleSubmit('formCustom')">立即登录</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import encryption from '@/components/common/module_js/md5';
import modal from '@/components/common/module_vue/modal.vue';
export default {
    components: { modal },
    props: {
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            timeInter: new Date().getTime(),
            formCustom: {
                userCode: '',
                password: '',
                checkCode: ''
            },
            ruleInline: {
                userCode: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                checkCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        forgetPass () {
            this.$Modal.confirm({
                title: '忘记密码',
                content: '请联系客服',
                onOk: () => {

                }
            });
        },
        closeDlg () {
            //   this.$store.commit('getShowLoginDialog',false);
            this.$refs.formCustom.resetFields();
            this.$emit('close-login-modal');
        },
        goRegister () {
            this.closeDlg();
            this.$router.push('/register');
            return;
        },
        refreshCode () {
            this.timeInter = new Date().getTime()
        },
        handleSubmit (name) {
            let vm = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let obj = Object.assign({}, vm[name]);
                    obj.password = encryption.encrypt.md5(obj.password);
                    vm.$http.post('/api/v2/user/login', obj).then(response => {
                        if (response.data.code !== 0) {
                            vm.timeInter = new Date().getTime();
                            return;
                        }
                        localStorage.setItem('user', JSON.stringify(response.data.data));
                        this.$store.commit('getUser', response.data.data);
                        this.$emit('close-login-modal', true);
                        // this.$store.commit('getShowLoginDialog', false);
                        // this.closeDlg();
                        // window.location.reload();
                        // this.$emit('reload-page');
                    });
                }
            })
        }
    }
}
</script>

<style>
.login-dlg .ivu-form-item-content .ivu-icon {
    color: #8b8c8d;
}
/* .login-dlg .ivu-form-item-content .ivu-input{
       border-left: 0
   } */
.login-dlg .container {
    margin: 0 auto;
    border-radius: 6px;
    padding: 10px;
}
.login-dlg .login-img {
    float: right;
}
.login-dlg .cont-title {
    border-bottom: 2px solid #f1f1f1;
    line-height: 30px;
    height: 45px;
    margin-bottom: 20px;
}
.login-dlg .cont-title h4 {
    float: left;
    font-size: 16px;
    color: #be1204;
}
.login-dlg .cont .ivu-form-item .ivu-input {
    height: 45px;
}
.login-dlg .cont .ivu-input-group-prepend {
    padding: 4px 10px;
    font-size: 18px;
}
.login-dlg .cont .valida .ivu-input {
    width: 120px;
}
.login-dlg .cont .valida .valida-code {
    position: absolute;
    top: 2px;
    left: 170px;
    height: 43px;
    width: auto;
    cursor: pointer;
    z-index: 1000;
}
.login-dlg .refresh-code {
    position: absolute;
    right: 7px;
    top: 15px;
    cursor: pointer;
}
.login-dlg .ivu-icon-refresh {
    font-size: 25px;
}
.login-dlg .cont .commit-register {
    height: 44px;
    margin-bottom: 10px;
    font-size: 18px;
}
.login-dlg .cont .commit-register:hover {
    background-color: #e43535;
    border-color: #e43535;
}
.other-operation {
    padding: 10px;
    font-size: 14px;
}
.login-dlg .foget-password {
    color: #be1204;
}
.login-dlg .go-register {
    color: #8b8c8d;
    float: right;
}
.v-transfer-dom .ivu-modal-wrap.login-dlg-wrap .ivu-modal-footer {
    padding: 0;
}
</style>

