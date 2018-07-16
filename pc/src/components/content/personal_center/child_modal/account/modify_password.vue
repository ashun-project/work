<template>
    <div class="modify-password">
        <div class="tab">
            <span @click="changeType('1')" :class="{active: type === '1'}">修改登录密码</span>
            <span @click="changeType('2')" :class="{active: type === '2'}" v-if="payPwdFlag === '1'">修改资金密码</span>
            <span @click="changeType('3')" :class="{active: type === '3'}" v-if="user.realName">修改真实姓名</span>
        </div>
        <div class="user-password all-width" v-if="type === '1'">
            <Form :model="modifyObj" ref="formCustom" :label-width="106" :rules="modifyRule">
                <FormItem label="输入旧密码 : " prop="oldPassword">
                    <Input type="password" :value="modifyObj.oldPassword" @input="modifyObj.oldPassword = arguments[0].replace(/\s+/g,'')" placeholder="旧密码" style='margin-left:-5px;width:182px;'></Input>
                </FormItem>
                <FormItem label="新密码 : " prop="newPassword">
                    <Input type="password" :value="modifyObj.newPassword" @input="modifyObj.newPassword = arguments[0].replace(/\s+/g,'')" placeholder="6-14个字符（数字和字母）" style='margin-left:-5px;width:182px;'></Input>
                </FormItem>
                <FormItem label="确认新密码 : " prop="passwdCheck">
                    <Input type="password" :value="modifyObj.passwdCheck" @input="modifyObj.passwdCheck = arguments[0].replace(/\s+/g,'')" placeholder="确认新密码" style='margin-left:-5px;width:182px;'></Input>
                </FormItem>
                <FormItem :label-width='102'>
                    <Button style='line-height:14px;' type="primary" @click="handleSubmit()">提交</Button>
                </FormItem>
            </Form>
        </div>

        <div class="card-password modify" v-else-if="type === '2'">
            <div class="modify all-width">
                <Form :model="modifyObj" ref="formCustom" :label-width="106" :rules="modifyRule2">
                    <FormItem label="输入旧密码 : " prop="oldPassword">
                        <Input type="password" :value="modifyObj.oldPassword" :maxlength="4" @input="modifyObj.oldPassword = arguments[0].replace(/\s+/g,'')" placeholder="旧密码" style='margin-left:-5px;width:182px;'></Input>
                    </FormItem>
                    <FormItem label="新密码 : " prop="newPassword">
                        <Input type="password" :value="modifyObj.newPassword" :maxlength="4" @input="modifyObj.newPassword = arguments[0].replace(/\s+/g,'')" placeholder="四位数字" style='margin-left:-5px;width:182px;'></Input>
                    </FormItem>
                    <FormItem label="确认新密码 : " prop="passwdCheck">
                        <Input type="password" :value="modifyObj.passwdCheck" :maxlength="4" @input="modifyObj.passwdCheck = arguments[0].replace(/\s+/g,'')" placeholder="确认新密码" style='margin-left:-5px;width:182px;'></Input>
                    </FormItem>
                    <FormItem :label-width='102'>
                        <Button style='line-height:14px;font-size:14px;' type="primary" @click="handleSubmit()">提交</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
        <div class="" v-else-if="type === '3'">
            <Form :model="realName" ref="realNameRef" :label-width="106" :rules="resetRealName">
                <FormItem label="旧姓名 : " prop="oldName">
                    <Input type="text" v-model="realName.oldName" style='margin-left:-5px;width:182px;' readonly></Input>
                </FormItem>
                <FormItem label="新姓名 : " prop="newName">
                    <Input type="text" v-model="realName.newName" placeholder="请输入姓名" style='margin-left:-5px;width:182px;'></Input>
                </FormItem>
                <FormItem :label-width='102'>
                    <Button type="primary" @click="realNameSubmit()" style='font-size:14px;line-height:14px;'>提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
import { ruleFn } from '@/components/common/module_js/rule'
export default {
    data () {
        // 修改密码的规则方法
        const validaOldPassword = (rule, value, callback) => { //登录旧密码(登录密码和资金密码)
            if (!value) {
                callback(new Error('请输入旧密码'));
            } else {
                callback();
            }
        }
        const validatePass = (rule, value, callback) => { //登录新密码
            // ruleFn.isPassWord(value, this.modifyObj.passwdCheck, this.$refs.formCustom.validateField, 'passwdCheck', callback);
            if (!value) {
                callback(new Error('请输入新密码'));
            } else if (/[^A-Za-z0-9]/g.test(value)) {
                callback(new Error('请输入数字和字母'));
            } else if (value.length < 6 || value.length > 14) {
                callback(new Error('密码六至十四位'));
            } else if (this.modifyObj.passwdCheck) {
                this.$refs.formCustom.validateField('passwdCheck');
                callback();
            } else {
                callback();
            }
        };
        const validatePass2 = (rule, value, callback) => { //新的资金密码验证规则
            // ruleFn.isFundPassWord(value, this.modifyObj.passwdCheck, this.$refs.formCustom.validateField, 'passwdCheck', callback);
            if (!value) {
                callback(new Error('请输入新密码'));
            } else if (!/^\d*$/.test(value)) {
                callback(new Error('请输入数字'));
            } else if (this.modifyObj.passwdCheck) {
                this.$refs.formCustom.validateField('passwdCheck');
                callback();
            } else {
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => { //确认密码
            // ruleFn.checkFundPassWord(value, this.modifyObj.newPassword, callback);
            if (!value) {
                callback(new Error('请再次输入密码'));
            } else if (!/^\d*$/.test(value)) {
                callback(new Error('请输入数字'));
            } else if (value !== this.modifyObj.newPassword) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        const realNameCheck = (rule, value, callback) => {
            // ruleFn.isRealName(value, callback);
            if (!value) {
                callback(new Error('请输入姓名'));
            } else if (!/^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/.test(value)) {
                callback(new Error("请输入2-12位的中文字符"));
            } else if (value.length < 2 || value.length > 12) {
                callback(new Error("请输入2-12位的中文字符"));
            } else {
                callback();
            }
        }
        return {
            type: '1',
            payPwdFlag: '',
            user: {},
            modifyObj: {
                oldPassword: '',
                newPassword: '',
                passwdCheck: ''
            },
            realName: {
                oldName: '',
                newName: ''
            },
            //登录密码规则
            modifyRule: {
                oldPassword: [
                    { validator: validaOldPassword, trigger: 'blur' }
                ],
                newPassword: [
                    { validator: validatePass, trigger: 'blur' },
                ],
                passwdCheck: [
                    { validator: validatePassCheck, trigger: 'blur' }
                ]
            },
            //资金密码验证规则
            modifyRule2: {
                oldPassword: [
                    { validator: validaOldPassword, trigger: 'blur' }
                ],
                newPassword: [
                    { validator: validatePass2, trigger: 'blur' },
                    { type: 'string', min: 4, message: '请输入四位数字', trigger: 'blur' },
                    { type: 'string', max: 4, message: '请输入四位数字', trigger: 'blur' }
                ],
                passwdCheck: [
                    { validator: validatePassCheck, trigger: 'blur' }
                ]
            },
            // 真实姓名
            resetRealName: {
                newName: [
                    { validator: realNameCheck, trigger: 'blur' },
                ]
            }
        }
    },
    methods: {
        setOldName () {
            let name = this.user.realName.split('');
            let str = '';
            for (let i = 0; i < name.length; i++) {
                if (i !== name.length - 1) {
                    str += '*'
                } else {
                    str += name[i]
                }
            }
            this.realName.oldName = str;
        },
        changeType (type) {
            this.type = type;
            try {
                this.$refs.formCustom.resetFields();
                this.$refs.realNameRef.resetFields();
            } catch (error) {
            }

        },
        handleSubmit () {
            let vm = this;
            this.$refs.formCustom.validate((valid) => {
                if (valid) {
                    let params = {
                        oldPassword: encryption.encrypt.md5(vm.modifyObj.oldPassword),
                        newPassword: encryption.encrypt.md5(vm.modifyObj.newPassword)
                    }
                    let url = '/api/v2/user/modifyPassword'
                    if (vm.type !== '1') {
                        url = '/api/v2/user/setPayPwd';
                        params = {
                            oldPayPwd: encryption.encrypt.md5(vm.modifyObj.oldPassword),
                            newPayPwd: encryption.encrypt.md5(vm.modifyObj.newPassword),
                            payPwdType: '2'
                        }
                    }

                    vm.$http.post(url, params, { userId: true }).then(response => {
                        if (response.data.code !== 0) return;
                        vm.$refs.formCustom.resetFields();
                        vm.$Message.success('修改成功');
                    })
                }
            })
        },
        realNameSubmit () {
            let vm = this;
            this.$refs.realNameRef.validate((valid) => {
                if (valid) {
                    let params = {
                        newRealname: vm.realName.newName
                    }
                    vm.$http.post('/api/v2/user/updateName', params, { userId: true }).then(response => {
                        if (response.data.code !== 0) return;
                        vm.realName.newName = '';
                        vm.$Message.success('修改成功，已提交到后台审核');
                    })
                }
            })
        }
    },
    created () {
        let user = localStorage.getItem('user');
        if (user) {
            this.user = JSON.parse(user);
            if (this.user.realName) {
                this.setOldName();
            }
        }
        this.$http.post('/api/v2/user/getUserPayPwd', '', { userId: true, unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            this.payPwdFlag = response.data.data.payPwdFlag;
        })
    }
}
</script>

<style lang="less" scoped>
.modify-password .all-width {
    width: 70%;
}
.modify-password .all-width span {
    display: block;
    height: 30px;
    line-height: 30px;
}
.modify-password .tab {
    /* height: 30px;
    line-height: 30px; */
    height: 36px;
    /* line-height: 34px; */
    border: 2px solid @common-color;
    border-radius: 3px;
    display: inline-block;
    margin-bottom: 15px;
    margin-left: 28px;
}
.modify-password .tab span {
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    /* height: 26px;
    line-height: 26px; */
    display: inline-block;
    vertical-align: top;
    padding: 0 10px;
    font-size: 14px;
    color: @common-active-color;
}
.modify-password .tab span.active {
    color: #f1f1f1;
    background: @common-active-color;
}
.modify-password .ivu-form .ivu-form-item-label {
    padding-right: 6px;
}
</style>
