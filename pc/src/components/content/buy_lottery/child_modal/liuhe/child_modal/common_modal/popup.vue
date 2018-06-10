<template>
    <Modal ok-text="确认下注" v-model="showMOdal" :loading="loading" @on-ok="ok" @on-cancel="cancel" class-name="liuhe-popup">
        <div class="modal-header" slot="header">第&nbsp;{{periodInfo.periodNo}}&nbsp;确认注单</div>
        <div class="modal-body">
            <Table :columns="columns" :data="list" :height="300"></Table>
            <p class="record">共&nbsp;
                <span>{{num}}</span>&nbsp;注，合计下注金额&nbsp;
                <span>{{money}}</span>
            </p>
        </div>
    </Modal>
</template>

<script>
export default {
    props: {
        orderList: {
            type: Array
        },
        status: {
            type: Boolean
        }
    },
    data () {
        return {
            loading: true,
            list: [],
            columns: [
                {
                    title: '投注号码',
                    key: 'lotteryNumber'
                },
                {
                    title: '赔率',
                    key: 'odds'
                },
                {
                    title: '金额',
                    key: 'bettingMoney'
                }
            ],
            num: 0,
            money: 0,
            showMOdal: false
        }
    },
    computed: {
        periodInfo () {
            return this.$store.state.preiodInfo;
        },
        user () {
            return this.$store.state.user
        },
    },
    watch: {
        status (n) {
            this.showMOdal = n;
        },
        orderList (n) {
            this.init();
        }
    },
    methods: {
        ok () {
            if (!this.list.length) {
                this.$Message.error('请先投注');
                this.$emit('get-result');
                return;
            }
            if (!this.user.userCode) {
                this.$store.commit('getShowLoginDialog', true);
                return
            }
            let vm = this;
            var params = {
                bettingInfoList: this.list,
                totalMoney: vm.money,
                bettingRecordList: [
                    {
                        lotteryRecordId: vm.periodInfo.lotteryRecordId,
                        periodNo: vm.periodInfo.periodNo,
                        num: 1
                    }
                ]
            }
            vm.$http.post('/api/v2/lottery/betting', params, { userId: true }).then(response => {
                if (response.data.code !== 0) {
                    this.$emit('get-result');
                    return;
                }
                this.$Message.success('下注成功');
                this.$emit('get-result', true);
                this.showMOdal = false;
            })
        },
        cancel () {
            this.$emit('get-result');
        },
        init () {
            let vm = this;
            this.num = this.orderList.length;
            this.list = this.orderList;
            this.money = 0;
            this.list.forEach(item => {
                vm.money += parseInt(item.bettingMoney);
            })
        }
    },
    created () {
        this.init();
    }
}
</script>

<style>
.liuhe-popup .ivu-modal-header {
    padding: 8px 0;
    background: #be1204;
}
.liuhe-popup .ivu-modal-body {
    padding: 0;
}
.liuhe-popup .ivu-table-wrapper {
    border: 0;
}
.liuhe-popup .ivu-modal-close i {
    color: #fff;
}
.liuhe-popup .modal-header {
    height: 30px;
    line-height: 30px;
    color: #fff;
    font-size: 14px;
    padding-left: 10px;
}
.liuhe-popup .record {
    padding-left: 10px;
    line-height: 30px;
}
.liuhe-popup .record span {
    color: #be1204;
}
</style>


