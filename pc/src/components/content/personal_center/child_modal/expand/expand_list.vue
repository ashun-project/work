<template>
    <div class="expand-list">
        <div class="search">
            <div class="addUser">
                <Button type="warning" class="wxbutton2" @click="createExpand">
                    <Icon type="plus-round" color="#fff;"></Icon> 创建新邀请码</Button>
            </div>
            <div class="datetext">起始日期 :</div>
            <div class="selectDate">
                <Row>
                    <Col span="12">
                    <DatePicker v-model="data.updateTime" type="daterange" placement="bottom-end" placeholder="请选择查询时间" style='width:200px;'></DatePicker>
                    </Col>
                </Row>
            </div>
            <div class="button">
                <Button type="primary" class="wxbutton" @click="search">搜索</Button>
            </div>
        </div>
        <div class="table">
            <Table :columns="columns" :data="expandList" stripe></Table>
        </div>
        <page :total="pageParams.total" :current="pageParams.currentPage" :pageSize="10" @get-Page-Data="queryExpandList"></page>
        <!-- 新增邀请码 -->
        <modal :modalShow="detailFlag" :title="title" :width="440" :maskClosable="true" @btn-cancel="detailFlag = false" @btn-ok="saveOrUpdate(expandInfo)">
            <div slot="content" class="expand-modal-content">
                <Form ref="expandInfo" :model="expandInfo">
                    <FormItem prop="status">
                        <span class="status">邀请码状态：</span>
                        <div>
                            <i-switch size='small' v-model="iswitchStatus"></i-switch>
                        </div>
                        &nbsp;&nbsp;
                        <span class="open-code" v-if='iswitchStatus'>启用邀请码</span>
                        <span class="close-code" v-else-if='!iswitchStatus'>禁用邀请码</span>
                    </FormItem>
                    <FormItem prop="expandCode">
                        <Input v-show="expandInfo.expandId == null" type="text" :disabled="expandInfo.expandId != null" v-model="expandInfo.expandCode" placeholder="邀请码" :maxlength="20" @input="changeLength" />
                        <Input v-show="expandInfo.expandId!== null" type="text" :disabled="expandInfo.expandId != null" v-model="expandInfo.expandCode" placeholder="邀请码" :maxlength="20" @input="changeLength" />
                        <span v-show="expandInfo.expandId == null" class="code-size">{{expandCodeSize}}/20</span>
                        <Button v-show="expandInfo.expandId == null" type="warning" @click="createExpandCode">
                            <font class="color-yellow">生成邀请码</font>
                        </Button>
                    </FormItem>
                    <FormItem label="用户类别 : ">
                        <RadioGroup v-model="expandInfo.type">
                            <Radio label="00">会员</Radio>
                            <Radio label="10">代理</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem prop="bonusGroupName">
                        <span class="rebate">代理返点：</span>
                        <span>
                            <font color="ff7614">{{'('+((expandInfo.bonusGroupName-expandInfo.minBonusGroupName)/20).toFixed(1)+'%) '+Number(expandInfo.bonusGroupName).toFixed(0)}}</font>
                        </span>
                        <div class="slider" v-if="bonusGroup[0]!=bonusGroup[1]">
                            <span color="ff7614">{{bonusGroup[0]}} ({{((groupName.min-expandInfo.minBonusGroupName)/20).toFixed(1)}}%)</span>
                            <Slider :value="groupName.max" :min="groupName.min" :max="groupName.max" :step="groupName.step" @on-input="changeGroupName" :tip-format="showProgress"></Slider>
                            <span>{{bonusGroup[1]}} ({{((groupName.max-expandInfo.minBonusGroupName)/20).toFixed(1)}}%)</span>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </modal>
        <modal :modalShow="showExpUrl" :title="'推广链接'" @btn-cancel="showExpUrl = false" @btn-ok="copyUrl()" :okText="'复制链接'" :maskClosable="true">
            <div slot="content">
                <span>{{expUrl}}</span>
            </div>
        </modal>
        <!-- 显示详情 -->
    </div>
</template>

<script>
import dateUtil from '@/components/common/module_js/format_date.js'
import page from '@/components/common/module_vue/page.vue'
import modal from '@/components/common/module_vue/modal.vue'
export default {
    components: { page, modal },
    data () {
        return {
            userInfo: {},
            groupName: {},
            detailFlag: false,
            title: '',
            expandList: [],
            groupName: { step: 2, min: 0, max: 0 },
            expUrl: '',
            showExpUrl: false,
            // dispGroupName:0,
            bonusGroup: [],//添加的
            data: {
                updateTime: ''
            },
            pageParams: {
                total: 0,
                currentPage: 1
            },
            expandInfo: {
                expandId: null,
                expandCode: '',
                status: true,
                type: '10'
            },
            expandCodeSize: 0,
            iswitchStatus: false,
            columns: [
                {
                    title: '最后更新',
                    key: 'updateTime',
                    width: 145,
                    render: (h, params) => {
                        return h('span', dateUtil.getFormatDate(params.row.updateTime))
                    }
                },
                {
                    title: '邀请码',
                    key: 'expandCode',
                    width: 156,
                    render: (h, params) => {
                        return h('span', {
                            style: {
                                color: '#be1204'
                            }
                        }, params.row.expandCode)
                    }
                },
                {
                    title: '用户类别',
                    key: 'type',
                    width: 86,
                    render: (h, params) => {
                        let type = params.row.type === '00' ? '会员' : '代理'
                        return h('span', type)
                    }
                },
                {
                    title: '注册用户数',
                    key: 'registerCount',
                    width: 94
                },
                {
                    title: '返点',
                    key: 'bonusGroupName',
                    width: 76,
                    render: (h, params) => {
                        // let text = parseInt(params.row.bonusGroupName).toFixed(2) 
                        return h("div", [
                            h('p', parseInt(params.row.bonusGroupName)),
                            h('p', '(' + ((params.row.bonusGroupName - this.userInfo.minBonusGroupName) / 20).toFixed(1) + '%' + ')')
                        ])

                    }
                },
                {
                    title: '状态',
                    key: 'statusDesc',
                    width: 61,
                    render: (h, params) => {
                        return h('div', {
                            'class': 'expand-content'
                        }, [
                                h('i-switch', {
                                    props: {
                                        size: 'small',
                                        value: params.row.statusDesc === '启用',
                                        disabled: true
                                    }
                                })
                            ])
                    }
                },
                {
                    title: '操作',
                    key: '',
                    width: 124,
                    render: (h, params) => {
                        return h('div', {
                            'class': 'expand-content'
                        }, [
                                h('span', {
                                    on: {
                                        click: () => {
                                            this.showUrlDeatil(params.row);
                                        }
                                    }
                                }, '链接'),
                                h('span', {
                                    on: {
                                        click: () => {
                                            this.updateExpand(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('span', {
                                    'class': 'delete',
                                    on: {
                                        click: () => {
                                            this.delExpand(params.row.expandId, params.index);
                                        }
                                    }
                                }, [
                                        h('i', {
                                            'class': 'i-red-delete',
                                            style: {
                                                display: 'inline-block',
                                                verticalAlign: '-2px'
                                            }
                                        }, '')
                                    ])
                            ])
                    }
                }

            ]
        }
    },
    methods: {
        showProgress (val) {//显示赔率
            // return `${Number(this.expandInfo.bonusGroupName).toFixed(0)}(${(this.expandInfo.bonusGroupName/20).toFixed(1)}%)`;
            return `${val} (${((val - this.expandInfo.minBonusGroupName) / 20).toFixed(1)}%)`;
        },
        rowClassName (row, index) {
            if (index === 1) {
                return 'demo-table-info-row';
            } else if (index === 3) {
                return 'demo-table-error-row';
            }
            return '';
        },
        search () {
            // this.pageChange(1);
            this.queryExpandList(1);
        },
        formatDate (value) {
            return dateUtil.getFormatDate(value);
        },
        pageChange (page) {//切换页码
            if (this.pageParams.currentPage == page) {
                return
            }
            this.queryExpandList(page);
        },
        updateExpand (expandInfo) {
            this.detailFlag = true;
            this.title = "修改邀请码";

            // var user = JSON.parse(localStorage.getItem('user'));
            var user = this.$store.state.user
            this.$set(this.groupName, 'min', Number(user.minBonusGroupName));
            this.$set(this.groupName, 'max', Number(user.bonusGroupName));

            this.expandInfo = Object.assign({}, expandInfo);
            this.iswitchStatus = this.expandInfo.status == 1 ? true : false;
            this.$set(this.expandInfo, 'bonusGroupName', Number(expandInfo.bonusGroupName));
            this.$set(this.expandInfo, 'minBonusGroupName', Number(user.minBonusGroupName));
        },
        createExpand () {
            this.title = "创建新邀请码";
            this.$set(this.expandInfo, 'expandId', null);

            // var user = JSON.parse(localStorage.getItem('user'));
            var user = this.$store.state.user
            this.$set(this.groupName, 'min', Number(user.minBonusGroupName));
            this.$set(this.groupName, 'max', Number(user.bonusGroupName));

            this.$set(this.expandInfo, 'expandCode', '');
            this.iswitchStatus = true;
            // this.$set(this.expandInfo,'type','10');?
            this.$set(this.expandInfo, 'bonusGroupName', Number(user.bonusGroupName));
            this.$set(this.expandInfo, 'minBonusGroupName', Number(user.minBonusGroupName));
            this.createExpandCode();

            this.bonusGroup.splice(0, 0, Number(user.minBonusGroupName));//添加的
            this.bonusGroup.splice(1, 0, Number(user.bonusGroupName));//添加的
            // this.$set(this,'dispGroupName',Number(user.bonusGroupName)+'('+(Number(user.bonusGroupName)/20).toFixed(1)+')'+'%');
            this.detailFlag = true;
        },
        saveOrUpdate (expandInfo) {
            this.$set(expandInfo, 'status', this.iswitchStatus ? '1' : '0');
            var url = expandInfo.expandId == null ? '/api/v2/user/addExpand' : '/api/v2/user/modifyExpand';
            this.$http.post(url, expandInfo, { userId: true }).then(response => {
                if (response.data.code == 0) {
                    this.detailFlag = false;
                    if (expandInfo.expandId == null) {
                        this.showExpUrl = true;
                        this.expUrl = response.data.data.expandQrCode;
                    } else {
                        this.$Message.info("操作成功");
                    }
                    this.queryExpandList(1);
                }
            })
        },
        showUrlDeatil (item) {
            this.expUrl = item.expandQrCode;
            this.showExpUrl = true;
        },
        copyUrl () {
            this.showExpUrl = false;
            let vm = this;
            var save = function (e) {
                e.clipboardData.setData('text/plain', vm.expUrl);
                e.preventDefault();
            }
            document.addEventListener('copy', save);
            document.execCommand("copy");
        },
        delExpand (id, index) { //删除邀请码
            this.$http.post('/api/v2/user/deleteExpand', { 'expandId': id }, { userId: true }).then(response => {
                if (response.data.code == 0) {
                    this.$Message.info("删除成功");
                    this.expandList.splice(index);
                    this.queryExpandList(1);
                }
            })
        },
        queryExpandList (page) {
            var startTime = '', endTime = '';
            if (this.data.updateTime.length > 0) {
                if (this.data.updateTime[0] != null) {
                    startTime = dateUtil.getFormatDate(this.data.updateTime[0]);
                }
                if (this.data.updateTime[1] != null) {
                    endTime = dateUtil.getFormatDate(this.data.updateTime[1]);
                }
            }
            this.$http.post('/api/v2/user/queryUserExpandList', { current: page, startTime: startTime, endTime: endTime }, { userId: true, unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.pageParams.currentPage = page;
                this.expandList = response.data.data.expandList;
                // console.log(this.expandList);
                this.pageParams.total = response.data.data.total;
            })
        },
        changeGroupName (val) {
            this.$set(this.expandInfo, 'bonusGroupName', val);
        },
        createExpandCode () {
            this.$http.post('/api/v2/user/randomExpand', {}, { userId: true, unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.expandInfo.expandCode = response.data.data.expand;
                this.expandCodeSize = this.expandInfo.expandCode.length;
            })
        },
        changeLength () {
            this.expandCodeSize = this.expandInfo.expandCode.length;
        },
        getUserInfoFromLocal () {
            var user = JSON.parse(localStorage.getItem("user"));
            this.$set(this.groupName, "min", Number(user.minBonusGroupName));
            this.$set(this.groupName, "max", Number(user.bonusGroupName));
            this.$set(
                this.userInfo,
                "bonusGroupName",
                Number(user.bonusGroupName)
            );
            this.$set(
                this.userInfo,
                "minBonusGroupName",
                Number(user.minBonusGroupName)
            );
            this.bonusGroup.splice(0, 0, Number(user.minBonusGroupName));
            this.bonusGroup.splice(1, 0, Number(user.bonusGroupName));
        }
    },
    created () {
        this.queryExpandList(1);
        this.getUserInfoFromLocal()
    }
}
</script>
<style>
</style>


<style lang = "less">
.f(@f) {
    float: @f;
}
.back-bg (@bc;@br) {
    background-color: @bc;
    border: 1px solid @br;
}
.mix-one (@clr;@fs;@lh;@ml) {
    color: @clr;
    font-size: @fs;
    line-height: @lh;
    margin-left: @ml;
}
.border-radius (@radius: 4px) {
    border-radius: @radius;
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
}
.expand-list {
    .search {
        height: 30px;
        .addUser {
            .f(left);
            width: 104px;
            .wxbutton2 {
                width: 138px;
                padding-left: 11px;
            }
        }
        .datetext {
            .f(left);
            margin-left: 260px;
            line-height: 30px;
        }
        .selectDate {
            .f(left);
            margin-left: 10px;
        }
        .button {
            .f(right);
            .wxbutton {
                width: 66px;
            }
        }
    }
    .table {
        margin-top: 13px;
        .expand-content {
            display: inline-block;
            vertical-align: top;
            line-height: 36px;
            text-align: center;
            font-size: 14px;
            span {
                display: inline-block;
                color: @common-color;
                cursor: pointer;
                margin: 0 2px;
                &.ivu-switch-checked {
                    .back-bg(#ffaa4e, #ffaa4e);
                }
                .delete {
                    vertical-align: top;
                }
            }
        }
    }
}
.v-transfer-dom {
    .expand-modal-content {
        form {
            margin-left: 39px;
            margin-top: 10px;
            .ivu-form-item {
                position: relative;
                margin-bottom: 25px;
                &:first-child {
                    .status {
                        display: inline-block;
                        margin-right: 20px;
                        font-size: 14px;
                        color: #313131;
                    }
                    div {
                        display: inline-block;
                        vertical-align: top;
                    }
                    .open-code {
                        .mix-one(#ff7614, 14px, 32px, -6px);
                    }
                    .close-code {
                        .mix-one(#a9a9a9, 14px, 32px, -6px);
                    }
                }
                &:nth-child(2) {
                    span {
                        color: #a9a9a9;
                    }
                    .ivu-input-wrapper {
                        width: 235px;
                        &:nth-child(2) {
                            width: 330px;
                            height: 30px;
                        }
                    }
                    .code-size {
                        position: absolute;
                        left: 194px;
                        top: 2px;
                        color: #a9a9a9;
                    }
                    button {
                        position: relative;
                        background: #fff;
                        margin-left: 10px;
                        color: @expand-list-color;
                        border: 1px solid @expang-list-border-color;
                        .border-radius();
                    }
                }
                &:nth-child(3) {
                    margin-bottom: 20px;
                    color: #313131;
                    .ivu-radio-group {
                        position: relative;
                        top: -2px;
                        margin-left: 30px;
                        .ivu-radio-wrapper {
                            &:first-child {
                                margin-right: 40px;
                            }
                        }
                    }
                }
                &:last-child {
                    .rebate {
                        font-size: 14px;
                        color: #313131;
                        span {
                            margin-left: 18px;
                        }
                    }
                    .slider {
                        margin-top: 25px;
                        .ivu-slider {
                            display: inline-block;
                            position: relative;
                            width: 180px;
                            margin: 0 3px 0 6px;
                        }
                        span {
                            display: inline-block;
                            vertical-align: top;
                            color: @expand-list-color;
                            font-size: 12px;
                            margin-left: 0;
                        }
                    }
                }
                .ivu-switch-checked {
                    position: relative;
                    top: -2px;
                    &.ivu-switch-small {
                        .back-bg(#ffaa4e, #ffaa4e);
                    }
                }
                .ivu-switch-small {
                    &:extend(.v-transfer-dom
                            .expand-modal-content
                            form
                            .ivu-form-item
                            .ivu-switch-checked);
                    .back-bg(#aaa,#aaa);
                }
            }
        }
    }
}
</style>
