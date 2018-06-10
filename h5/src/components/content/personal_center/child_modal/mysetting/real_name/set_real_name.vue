<template>
    <div class="set-name">
        <my-header title="修改真实姓名" bkUrl="/personalInfo"></my-header>
        <p class="tip">为了您账户安全，真实姓名需要与绑定银行卡姓名一致</p>
        <mt-field label="旧姓名" placeholder="请输入用户名" v-model="oldName" readonly disableClear></mt-field>
        <mt-field label="新姓名" placeholder="请输入用户名" v-model="realName"></mt-field>
        <div class="confirm">
            <mt-button type="primary" @click="confirmReset()">确 认</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            realName: '',
            oldName: ''
        }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    methods: {
        confirmReset () {
            let str = /^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/;///^[^\u0000-\u00FF]*$/;
            if (!str.test(this.realName) || this.realName.length < 2 || this.realName.length > 12) {
                this.$Message('姓名只能为2-12位的中文字符');
                return;
            }

            this.$http.post('/api/v2/user/updateName', { newRealname: this.realName }, { userId: true }).then(response => {
                if (response.data.code !== 0) return;
                this.$Message('修改成功，待审核，请关注最新信息。');
                this.$router.push('/personalInfo')
            })
        }
    },
    created () {
        if (!this.user.realName) {
            this.$Modal.alert('您的操作有误！', '提示').then(() => {
                this.$router.push('/personalInfo');
            })
            return;
        }
        let name = this.user.realName.split('');
        let str = '';
        for (let i = 0; i < name.length; i++) {
            if (i !== name.length - 1) {
                str += '*'
            } else {
                str += name[i]
            }
        }
        this.oldName = str;
    }
}
</script>

<style>
.set-name input {
    font-size: 0.7rem;
}
.set-name .tip {
    font-size: 0.6rem;
    background: #f6f7f9;
    padding: 0.5rem 0;
    color: #ec0022;
    border-bottom: 1px solid #dddddd;
    text-align: center;
}
.set-name .mint-field {
    margin: 0 1rem;
    border-bottom: 1px solid #ddd;
}
.set-name .mint-cell-text {
    color: #999;
}
.set-name .mint-cell-title {
    width: 4rem;
}
.set-name .confirm {
    width: 90%;
    margin: 30px auto;
}
.set-name .confirm button {
    width: 100%;
    height: 2.2rem;
    line-height: 2.2rem;
    background-image: linear-gradient(-45deg, #ec0022, #ec0022);
    color: #fff;
    border-radius: 20px;
    display: block;
    text-align: center;
    box-shadow: 0 1px 7px rgba(211, 67, 55, 0.8);
}
</style>
