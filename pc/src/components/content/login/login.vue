<template>
    <div class="login-page">
        <div class="container">
            <div class="cont">
                <div class="cont-title">
                    <h4>账号登录</h4>
                </div>
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
                        <Input type="text" v-model="formCustom.checkCode" placeholder="验证码" @on-enter="handleSubmit('formCustom')" @on-focus='refreshCheckCode()'>
                        <Icon type="social-snapchat" slot="prepend"></Icon>
                        </Input>
                        <img class="valida-code" :src='imageCode' @click='getImageCode'>
                    </FormItem>
                    <div class="other-operation">
                        <a class="foget-password" @click="forgetPass()">忘记密码?</a>
                        <router-link to="/register" class="go-register">立即注册</router-link>
                    </div>

                    <FormItem>
                        <Button type="primary" class="commit-register" long @click="handleSubmit('formCustom')">登录</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="login-img">
                <img src="/configstatic/pc/images/login-coupon.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
export default {
    data () {
        return {
            timeInter: new Date().getTime(),
            formCustom: {
                userCode: '',
                password: '',
                checkCode: ''
            },
            imageCode: '/api/v2/user/captcha.jpg',  //图形验证码
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
        refreshCheckCode () {
            //获取焦点刷新验证码
            if (this.hasRefreshChode) {
                return
            }
            this.getImageCode()
            this.hasRefreshChode = true
        },
        getImageCode () {
            this.imageCode = `/api/v2/user/captcha.jpg?d=${new Date().getTime()}`;
        },
        goLogin (name) {
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
                        let path = sessionStorage.getItem('path');
                        if (path) { //调转到之前要跳到的页面
                            let strArr = path.split('&');
                            vm.$router.push({
                                name: strArr[0],
                                params: {
                                    id: strArr[1],
                                    order: strArr[2] ? JSON.parse(strArr[2]) : undefined
                                }
                            });
                            return
                        }
                        vm.$router.push('/');
                    });
                }
            })
        },
        handleSubmit (name) {
            let vm = this;
            if (this.$store.state.user.userCode) {
                this.$Modal.confirm({
                    title: '温馨提示',
                    content: '当前已登录，是否切换账号？',
                    onOk: () => {
                        vm.$http.post('/api/v2/user/loginOut', '', { userId: true }).then(response => {
                            if (response.data.code !== 0) return;
                            localStorage.setItem('user', '')
                            vm.$store.commit('getUser', '')
                            vm.goLogin(name)
                        })
                    }
                });
            } else {
                this.goLogin(name);
            }
        }
    }
}
</script>

<style lang="less">
.login-page {
    margin: 50px 0;
}
.login-page .container {
    width: 1000px;
    height: 458px;
    margin: 0 auto;
    background: @login-container-border;
    border-radius: 6px;
    padding: 10px;
}
.login-page .login-img {
    float: right;
}
.login-page .container .cont {
    height: 100%;
    width: 495px;
    padding: 25px 60px;
    background: #fff;
    float: left;
}
.login-page .cont-title {
    border-bottom: 2px solid #f1f1f1;
    line-height: 30px;
    height: 45px;
    margin-bottom: 20px;
}
.login-page .cont-title h4 {
    float: left;
    font-size: 16px;
    color: @login-color;
}
.login-page .cont .ivu-form-item .ivu-input {
    height: 45px;
}
.login-page .cont .ivu-input-group-prepend {
    padding: 4px 10px;
    font-size: 18px;
}
.login-page .cont .valida .valida-code {
    position: absolute;
    top: 2px;
    right: 2px;
    height: 43px;
    width: auto;
    cursor: pointer;
    z-index: 2;
}
.login-page .cont .commit-register {
    height: 44px;
    font-size: 18px;
}
.other-operation {
    padding: 10px;
    font-size: 14px;
}
.login-page .foget-password {
    color: @login-color;
}
.login-page .go-register {
    color: #8b8c8d;
    float: right;
}
</style>

