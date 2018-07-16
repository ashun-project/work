<template>
    <div class="card">
        <modal :modalShow="showModal" :width="440" title="添加银行账号" :hasFooter="true" :maskClosable="true" @close="oncancel" @btn-ok="cardSaveSubmit" @btn-cancel="cancel">
            <div slot="content">
                <Form :model="card" ref="addCard" :label-width="100" :rules="addCardRule">
                    <FormItem label="真实姓名 :" prop="accountName">
                        <Input type="text" v-model="card.accountName" placeholder="真实姓名"></Input>
                    </FormItem>
                    <FormItem label="银行账号 :" prop="bankNo">
                        <Input type="text" placeholder="请输入银行卡号" :value="card.bankNo" :maxlength="19" @input="card.bankNo = arguments[0].replace(/\s+/g,'')">
                        </Input>
                    </FormItem>
                    <FormItem label="银行名称 :" prop="bankName">
                        <Input type="text" v-model="card.bankName" placeholder="银行名称"></Input>
                    </FormItem>
                    <FormItem label="开户行 :" prop="openBankName">
                        <Input type="text" v-model="card.openBankName" placeholder="请输入开户行"></Input>
                    </FormItem>
                    <p style="color:#be1204;padding-left: 40px;margin-bottom: 15px;">
                        尊敬的用户，为了保障您的资金安全，请您绑定您的真实姓名和设置取款密码。如果姓名与开户名不一致，将无法取款
                    </p>
                    <!-- <FormItem :label-width='100'>
                        <Button type="primary" @click="cardSaveSubmit()" style='width:80px;height:30px;line-height:18px;'>提交</Button>
                        <Button type="warning" @click="cancel()" style='background:#ff7614;color:#fff;margin-left:16px;width:80px;height:30px;line-height:18px;'>取消</Button>
                    </FormItem> -->
                </Form>
            </div>
        </modal>
        <!-- <FormItem label="身份证号 :" prop="certNo">
                        <Input type="text" v-model="card.certNo" placeholder="请输入身份证号"></Input>
                    </FormItem> -->
        <!-- <Modal v-model="showModal" title="添加银行账号" @on-ok="cardSaveSubmit" width='440'>
               
                <div slot="footer"></div>
        </Modal> -->
        <div v-show="!list.length&&showList" style='padding-top:56px;'>
            <div class="addCard" class-name="add1">
                <div class="addAccount">
                    马上建立专属个人银行账号
                </div>
                <div class="addButton">
                    <Button type="primary" @click="changeStatus()" style='height:40px;line-height:28px;'>十专为您打造的出款通道</Button>
                </div>
            </div>
        </div>
        <div v-show="list.length&&showList">
            <Button type="primary" @click="changeStatus()" style='width:66px;height:30px;line-height:14px;' :disabled="list.length>0&&showList">新增</Button>

            <!-- 户名 银行卡号 开户行 银行卡名称 身份证号码 -->
            <div class="list">
                <ul>
                    <li class="list-thead">
                        <span class="accountName">开户名</span>
                        <span class="bank">开户行</span>
                        <span class="bankNo">卡号</span>
                        <!-- <span class="bankName">银行名称</span> -->
                        <span class="status">状态</span>
                        <!-- <span class="time">绑定时间</span> -->
                        <!-- <span class="operation">操作</span> -->
                    </li>
                    <li class="list-body" v-for="(item, idx) in list" :key="idx">
                        <span class="accountName">{{item.accountName|formatName}}</span>
                        <span class="bank">{{item.bankName}}</span>
                        <span class="bankNo">{{item.bankNo|formatBankNo}}</span>
                        <span class="status">{{item.status==="1"?'正常':'不正常'}}</span>
                        <!-- <span class="">{{item.status}}</span>  -->
                        <!-- <span class="">{{item.time}}</span> -->
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
import encryption from '@/components/common/module_js/md5'
// import bank from '@/components/common/module_js/bank'
import modal from '@/components/common/module_vue/modal'
import { ruleFn } from '@/components/common/module_js/rule'
export default {
    components: { modal },
    data () {
        //姓名验证规则
        const addChineseCheck = (rule, value, callback) => {
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
        //银行名称、开户行验证规则
        const addOPenNameCheck = (rule, value, callback) => {
            if (!/^[^\u0000-\u00FF]*$/.test(value)) {
                callback(new Error('请输入中文'));
            } else {
                callback();
            }
        }
        const bankNum = (rule, value, callback) => {
            let vm = this;
            let role = /^[0-9]*$/;
            if (!role.test(value)) {
                callback(new Error('只能输入数字'));
            } else {
                this.$http.post('/api/v2/user/queryBankFrom', { bankNo: value }, { userId: true, stopDialog: true, unenc: true }).then(response => {
                    if (response.data.code !== 0) {
                        callback();
                        return
                    }
                    let data = response.data.data;
                    vm.card.bankName = data.bankName;
                    callback();
                })
            }

        };
        return {
            isBack: false,
            showList: false,
            showModal: false,
            //user:{},
            card: { accountName: '', bankName: '', bankNo: '', openBankName: '' /*,certNo:''*/ },
            list: [],
            //卡号验证
            addCardRule: {
                accountName: [
                    { required: true, validator: addChineseCheck, trigger: 'blur' },
                ],
                bankNo: [
                    { required: true, message: '银行卡号不能为空', trigger: 'blur' },
                    { type: 'string', min: 16, message: '请输入正确的银行卡号', trigger: 'blur' },
                    { validator: bankNum, trigger: 'blur' }
                ],
                bankName: [
                    { required: true, message: '银行卡名称不能为空', trigger: 'blur' },
                    { validator: addOPenNameCheck, trigger: 'blur' }
                ],
                openBankName: [
                    { required: true, message: '开户行不能为空', trigger: 'blur' },
                    { validator: addOPenNameCheck, trigger: 'blur' }
                ]

            }
        }
    },
    filters: {
        formatBankNo (bankNo) {
            return bankNo.slice(0, 4) + bankNo.slice(4, bankNo.length - 4).replace(/\d/g, '*') + bankNo.slice(bankNo.length - 4);
        },
        formatName (accountName) {
            return accountName.slice(0, -1).replace(/./g, '*') + accountName.slice(accountName.length - 1);
        }
    },
    methods: {
        changeStatus () {
            this.showModal = true
        },
        getBankList () {
            let vm = this;
            vm.$http.post('/api/v2/user/queryLotUserBankInfo', '', { userId: true, unenc: true }).then(response => {
                let data = response.data.data;
                vm.showList = true;
                vm.list = data.lotUserBankList;
            })
        },
        resetFormStatus () { //重置添加银行卡表单的状态
            this.$refs.addCustom.resetFields();
        },
        cardSaveSubmit () {
            let vm = this;
            this.$refs.addCard.validate((valid) => {
                if (valid) {
                    vm.$http.post('/api/v2/user/bandingBankInfo', vm.card, { userId: true }).then(response => {
                        if (response.data.code !== 0) return;
                        vm.$Message.success('添加银行卡成功');
                        vm.showList = true;
                        vm.getBankList();
                        this.user.realName = vm.card.accountName;
                        localStorage.setItem('user', JSON.stringify(this.user));
                        this.$store.commit('getUser', this.user);
                        vm.$refs.addCard.resetFields();
                        vm.showModal = false;
                    })
                }
            })
        },
        cancel () {
            this.$refs.addCard.resetFields();
            this.$refs.addCard.resetFields();
            this.showModal = false;
        },
        //  onCancle () { //取消添加银行卡弹框
        //     this.resetFormStatus();
        // },
        oncancel () {
            this.showModal = false;
        }

    },
    computed: {
        user () {
            return this.$store.state.user;
        },
    },
    created () {
        let vm = this;
        this.getBankList();
    }

}
</script>


<style lang="less" scoped>
.card {
    margin-top: -16px;
}
.card .list {
    margin-top: 16px;
}
.card .list li {
    height: 36px;
    line-height: 36px;
    padding: 0 0 0 25px;
}
.card .list li:nth-child(odd) {
    background: @common-border-color;
}
.card .list li.list-thead {
    background: @common-bg;
    color: #fff;
}
.card .list li span {
    display: inline-block;
    float: left;
    width: 30%;
}
.card .list li span.name {
    width: 10%;
}
.card .list li span.type {
    width: 10%;
}
.card .list li span.num {
    width: 30%;
}
.card .list li span.status {
    width: 10%;
}
.card .list li span.time {
    width: 20%;
}
.card .list li span.operation {
    width: 20%;
}
.card .list li.list-thead span,
.card .list li.list-body span {
    width: 190px;
}
.card .list li.list-body {
    color: #313131;
}
.card .list li.list-thead span.bank,
.card .list li.list-body span.bank {
    width: 190px;
}
.card .list li.list-thead span.bankNo,
.card .list li.list-body span.bankNo {
    width: 205px;
}
.card .list li.list-thead span.status,
.card .list li.list-body span.status {
    width: 100px;
}
.card .list li.list-body:nth-child(odd) {
    background: @common-border-color;
}
.card .list li.list-body:hover {
    background: #ebf7ff;
}
.card .addCard {
    width: 505px;
    height: 236px;
    margin: 0 auto 0;
    background: transparent;
    border-radius: 18px 18px 18px 18px;
    border: 3px dashed #e1e1e1;
}
.card .addAccount {
    text-align: center;
    font-size: 36px;
    padding-top: 12%;
    color: #a9a9a9;
}
.card .addButton {
    height: 40px;
    text-align: center;
    margin-top: 22px;
}
.card .input1 {
    text-align: center;
}
.card .model .ivu-icon {
    color: white;
}
.card .model {
    padding-bottom: 20px !important;
}
.ivu-form .ivu-form-item-label {
    padding-right: 5px;
}
</style>
