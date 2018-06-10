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
            ruleFn.isOldPassWord(value, callback);
        }
        const validatePass = (rule, value, callback) => { //登录新密码
            ruleFn.isPassWord(value, this.modifyObj.passwdCheck, this.$refs.formCustom.validateField, 'passwdCheck', callback);
        };
        const validatePass2 = (rule, value, callback) => { //新的资金密码验证规则
            ruleFn.isFundPassWord(value, this.modifyObj.passwdCheck, this.$refs.formCustom.validateField, 'passwdCheck', callback);
        };
        const validatePassCheck = (rule, value, callback) => { //确认资金密码
            ruleFn.checkFundPassWord(value, this.modifyObj.newPassword, callback);
        };
        const realNameCheck = (rule, value, callback) => {
            ruleFn.isRealName(value, callback);
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
                    // { type: 'string', min: 6, message: '密码至少六位', trigger: 'blur' },
                    // { type: 'string', max: 14, message: '密码最多十四位', trigger: 'blur' }
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
            this.$refs.formCustom.resetFields();
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
        this.$http.post('/api/v2/user/getUserPayPwd', '', { userId: true }).then(response => {
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
