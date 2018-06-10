<template>
    <div class="user-manage">
        <div class="lee-share">

        </div>
        <div class="search">
            <div class="addUser">
                <Button type="warning" @click="addUser">
                    <Icon type="plus"></Icon>创建新用户</Button>
            </div>
            <div class="datetext">起始日期：</div>
            <div class="selectDate">
                <Row>
                    <Col span="12">
                    <DatePicker v-model='manageTime' type="daterange" placement="bottom-end" placeholder="请选择查询时间" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </div>

            <div class="select-user">
                <Input v-model.trim="userCode" placeholder="搜索用户名"></Input>
            </div>
            <div class="button">
                <Button type="primary" @click="changePageWithUserCode(1)">搜索</Button>
            </div>
        </div>

        <!-- 未开奖弹窗 -->
        <Spin fix v-if="leeWrapSpinShow">
            <Icon type="load-c" size=24 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <modal :modalShow="detailFlag" :title="title" :width="440" :maskClosable="true" @btn-cancel="cancelAddUser" @btn-ok="saveUser('userInfo')">
            <div slot="content">
                <Form ref="userInfo" :model="userInfo" :rules="ruleInline" style='margin-top:9px;'>
                    <FormItem label="用户名 : " prop="userCode" :label-width="80" style='margin-left:24px;'>
                        <Input type="text" :value="userInfo.userCode" @input="userInfo.userCode = arguments[0].replace(/\s+/g,'')" placeholder="用户名" style='width:258px;'></Input>
                        <p v-if='showUserCodeTip' style='height:24px;line-height:24px;position:absolute;color:#313131;font-size:12px;'>账号: 6-12个字符,字母与数字</p>
                    </FormItem>
                    <FormItem label="密码 : " prop="password" :label-width="80" style='margin-left:24px;'>
                        <Input type="password" :value='userInfo.password' @input="userInfo.password = arguments[0].replace(/\s+/g,'')" placeholder="密码" style='width:258px;'></Input>
                        <p v-if='showPasswordTip' style='height:24px;line-height:24px;position:absolute;color:#313131;'>密码规则: 6-14个字符,字母与数字组合</p>
                    </FormItem>
                    <FormItem label="用户类型 : " prop="userType" :label-width="80" style='margin-left:24px;'>
                        <RadioGroup v-model="userInfo.userType" style='position:relative;top:-2px;'>
                            <Radio label="00" style='margin-left:33px;margin-right:36px;'>会员</Radio>
                            <Radio label="10">代理</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label='代理返点：' prop="bonusGroupName" :label-width="155" style='margin-left:27px;'>
                        <span style='color:#ff7614;text-align:left;'>{{'('+((userInfo.bonusGroupName-userInfo.minBonusGroupName)/20).toFixed(1)+'%) '+Number(userInfo.bonusGroupName).toFixed(0)}}</span>
                    </FormItem>
                    <FormItem :label-width="0">
                        <div class="slider">
                            <!-- left -->
                            <span color="ff7614" style='margin-left:45px;'>{{bonusGroup[0]}} ({{((groupName.min-this.userInfo.minBonusGroupName)/20).toFixed(1)}}%)</span>

                            <Slider :value="groupName.max" :min="groupName.min" :max="groupName.max" style='margin:0 3px;margin-left:7px;' @on-input="changeGroupName" :step="groupName.step" :tip-format="showProgress"></Slider>
                            <!-- right -->
                            <span color="ff7614" style='margin-left:0px;'>{{bonusGroup[1]}} ({{((groupName.max-this.userInfo.minBonusGroupName)/20).toFixed(1)}}%)</span>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </modal>
        <modal :modalShow='changeUserShow' :title="changeUserTitle" :width="440" @btn-cancel='changeUserHide' @btn-ok="changeUserSubmit('userInfo')" :maskClosable="true">
            <div slot='content'>
                <div class="change-user-content">
                    <div class="change-user-content-first">
                        <div>

                        </div>
                        {{changeUserInfo.row.userCode}}
                    </div>
                    <div class="change-user-content-second">
                        <div class="userType">
                            用户类别 :
                        </div>
                        <p>
                            &nbsp;{{userInfo.userType === '00'? '会员' : '代理'}}
                            <!-- <RadioGroup v-model="userInfo.userType">
                                <Radio label='00'>
                                    <span>会员</span>
                                </Radio>
                                <Radio label='10'>
                                    <span>代理</span>
                                </Radio>
                            </RadioGroup> -->
                        </p>
                    </div>
                    <div class="change-user-content-third">
                        <div>
                            <span>
                                代理返点 :
                            </span>
                            <span>
                                <span class="span-main">{{'('+((userInfo.bonusGroupName-userInfo.minBonusGroupName)/20).toFixed(1)+'%) '+Number(userInfo.bonusGroupName).toFixed(0)}}</span>
                            </span>
                        </div>
                        <div>

                            <div class="slider">
                                <div class="slider">
                                    <!-- left -->
                                    <span color="ff7614">{{bonusGroup[0]}} ({{((groupName.min-this.userInfo.minBonusGroupName)/20).toFixed(1)}}%)</span>

                                    <Slider :value="groupName.bonusGroupName" :min="groupName.min" :max="groupName.max" @on-input="changeGroupName" :step="groupName.step" :tip-format="showProgress"></Slider>
                                    <!-- right -->
                                    <span color="ff7614" style='margin-left:0px;'>
                                        {{bonusGroup[1]}} ( {{ ((groupName.max-this.userInfo.minBonusGroupName)/20).toFixed(1) }} )%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
        <modal :modalShow='teamReportShow' title="团队报表" :width="440" @btn-cancel='teamReportHide' :maskClosable="true" :hasFooter="false" claName="delete-foot">
            <div slot="content">
                <div class="lee-team-inwrap">
                    <p class="lee-team-fir-p">
                        <span class="fir-span"></span>
                        {{teamUserCode}}
                    </p>
                    <div class="lee-row">
                        <DatePicker type="date" placeholder="请选择查询时间" v-model="teamReportTime.startTime" style="width: 180px" @on-change="reportTimeChange"></DatePicker>
                        <span class="lee-dialog-centerText">至</span>
                        <DatePicker type="date" v-model="teamReportTime.endTime" placeholder="请选择查询时间" style="width: 180px" @on-change="reportTimeChange"></DatePicker>
                    </div>
                    <div class="lee-row lee-row2">
                        <Button :class="{'lee-active-button' : leeActiveButton==1}" @click="changeActiveButton(1)">昨日</Button>
                        <Button :class="{'lee-active-button' : leeActiveButton==2}" @click="changeActiveButton(2)">本周</Button>
                        <Button :class="{'lee-active-button' : leeActiveButton==3}" @click="changeActiveButton(3)">上周</Button>
                        <Button :class="{'lee-active-button' : leeActiveButton==4}" @click="changeActiveButton(4)">本月</Button>
                        <Button :class="{'lee-active-button' : leeActiveButton==5}" @click="changeActiveButton(5)">上月</Button>
                    </div>
                    <ul>
                        <li class="lee-row lee-row-li">
                            <span>团队盈亏</span>
                            <span class="lee-team-money">{{teamReportCount.profitLossTotal | doubleShow}} 元</span>
                        </li>
                        <li class="lee-row lee-row-li">
                            <span>投注总额</span>
                            <span class="lee-team-money">{{teamReportCount.buyTotal | doubleShow}} 元</span>
                        </li>
                        <li class="lee-row lee-row-li">
                            <span>派彩总额</span>
                            <span class="lee-team-money">{{teamReportCount.prizeTotal | doubleShow}} 元</span>
                        </li>
                        <li class="lee-row lee-row-li">
                            <span>佣金总额</span>
                            <span class="lee-team-money">{{teamReportCount.rebateTotal | doubleShow}} 元</span>
                        </li>
                        <li class="lee-row lee-row-li">
                            <span>充值总额</span>
                            <span class="lee-team-money">{{teamReportCount.rechargeTotal | doubleShow}} 元</span>
                        </li>
                        <li class="lee-row lee-row-li">
                            <span>提款总额</span>
                            <span class="lee-team-money">{{teamReportCount.takeFeeTotal | doubleShow}} 元</span>
                        </li>
                    </ul>
                    <Spin fix v-if="spinShow">
                        <Icon type="load-c" size=24 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                    </Spin>
                    <!-- <Spin size="large" fix ></Spin> -->
                </div>
            </div>
        </modal>
        <div class="lee-breadcrumb">
            <div class="pointer" @click="breadcrumbClick(0)">
                {{$store.state.user.userCode}}
            </div>
            <div class="pointer" v-for="(itm,idx) in breadcrumblist" :key='idx' @click="breadcrumbClick(idx+2)">
                {{itm}}
                <i v-if="idx == (breadcrumblist.length-1)" class="lee-breadcrumb-last-child-after" @click.stop="breadcrumbClick(idx+1)"></i>
            </div>
        </div>
        <div class="table">
            <Table :columns="columns" stripe v-for="(itm , idx) in listData" :key="idx" :data="itm" v-show="idx==(listData.length -1)"></Table>
        </div>
        <!-- <div class="lee-table">
            <ul class="lee-table-title">
                <li v-for="itm in titleList" :key ="itm">
                    {{itm}}
                </li>
            </ul>
            <ul class="lee-table-body" v-for="(itm,idx) in listData" :key="idx">
                {{itm}}
            </ul>
        </div> -->
        <page :total="paramData.total" :currentPage="paramData.current" :pageSize="paramData.size" @get-Page-Data="changePage"></page>
    </div>
</template>
<script>
import encryption from "@/components/common/module_js/md5";
import formatDate from "@/components/common/module_js/format_date.js";
import modal from "@/components/common/module_vue/modal.vue";
import page from "@/components/common/module_vue/page.vue";
import { ruleFn } from "@/components/common/module_js/rule";
// import Dialog from '@/components/common/module_vie/modal'
//新分支
export default {
    computed: {
        configList () {
            return this.$store.state.configList;
        },
        changeUserTitle () {
            try {
                return "用户名 : " + this.changeUserInfo.row.userCode;
            } catch (error) {
                return "";
            }
        },
        showProgressLee (val) {
            return `${val.toFixed(0)} (${(
                (val - this.sliderObj.minBonusGroupName) /
                val *
                100
            ).toFixed(0)}%)`;
        }
    },
    components: { modal, page },
    filters: {
        doubleShow: function (Number) {
            return (Number / 100).toFixed(2);
        }
    },
    data () {
        const validatePass = (rule, value, callback) => {
            //验证密码
            let result = ruleFn.isPassWord(
                value,
                undefined,
                undefined,
                "",
                callback
            );
            this.showPasswordTip = result;
        };
        const validaName = (rule, value, callback) => {
            //验证用户名
            let result = ruleFn.isUserName(value, callback);
            this.showUserCodeTip = result;
        };
        return {
            breadcrumblist: [],
            userCode: '',
            uploadUserCode: '',
            leeWrapSpinShow: false,
            teamUserCode: '',
            spinShow: false,
            teamReportCount: {
                profitLossTotal: 0,
                buyTotal: 0,
                prizeTotal: 0,
                rebateTotal: 0,
                rechargeTotal: 0,
                takeFeeTotal: 0
            },
            leeActiveButton: 0,
            teamUserId: "",
            teamReportTime: {
                startTime: "",
                endTime: ""
            },
            showLevels: false,
            titleList: [
                "用户名",
                "最后登录日期",
                "离线提醒",
                "类型",
                "返点",
                "人数",
                "团队余额",
                "个人余额",
                "个人投注",
                "个人充值",
                "个人提款",
                "操作"
            ],
            changeUserInfo: {
                row: {
                    userCode: "",
                    userType: "00"
                }
            },
            changeUserShow: false,
            showUserCodeTip: true,
            showPasswordTip: true,
            paramData: {
                userCode: "",
                current: 1,
                size: 10,
                total: 0
            },
            detailFlag: false,
            model1: "",
            dateList: [{ name: "一周" }, { name: "一月" }],
            ruleInline: {
                userCode: [{ validator: validaName, trigger: "blur" }],
                password: [{ validator: validatePass, trigger: "blur" }]
            },
            groupName: { step: 2, min: 0, max: 0 },
            bonusGroup: [], //添加的
            // dispGroupName:"",
            userInfo: { userType: "10", userCode: "", password: "" },
            title: "创建新用户",
            listData: [],
            columns: [
                {
                    title: "用户名",
                    key: "userCode",
                    width: 60,
                    render: (h, params) => {
                        let className = "";
                        let popOverCLass = "";
                        let popOverText = "";
                        if (params.row.onlineStatus == "00") {
                            className =
                                "lee-userName-behind1 lee-userName-behind";
                            popOverText = "离线";
                            popOverCLass = "lee-popover1";
                        } else {
                            className =
                                "lee-userName-behind2 lee-userName-behind";
                            popOverText = "在线";
                            popOverCLass = "lee-popover2";
                        }
                        return h(
                            "div",
                            [
                                h(
                                    "div",
                                    {
                                        class: "pointer lee-red back-after",
                                        on: {

                                            click: () => {
                                                this.chooseNextLevelUser(
                                                    params
                                                );
                                            }
                                        }
                                    },
                                    params.row.userCode
                                ),
                                h(
                                    "div",
                                    {
                                        class: className,
                                        on: {
                                            click: () => { }
                                        }
                                    },
                                    [
                                        h(
                                            "div",
                                            {
                                                class:
                                                    "lee-popover " +
                                                    popOverCLass
                                            },
                                            popOverText
                                        )
                                    ]
                                )
                            ]
                            // params.row.userCode
                        );
                    }
                },
                {
                    title: "最后登录日期",
                    key: "loginTime",
                    width: 90,
                    render: (h, params) => {
                        var text = "暂无记录";
                        if (params.row.loginTime) {
                            text = formatDate.getFormatDate(
                                params.row.loginTime,
                                "yymmddhhmmss"
                            );
                        }
                        return h("span", { class: "lee-text-ind" }, text);
                    }
                },
                {
                    title: "离线天数",
                    key: "offLineDay",
                    width: 62,
                    render: (h, params) => {
                        var text = 0;
                        if (params.row.offLineDay) {
                            text = params.row.offLineDay;
                        }
                        return h("span", text);
                    }
                },
                {
                    title: "类型",
                    key: "userTypeText",
                    width: 50,
                    render: (h, params) => {
                        return h("span", params.row.userTypeText);
                    }
                },
                {
                    title: "返点",
                    key: "bonusGroupName",
                    width: 62,
                    render: (h, params) => {
                        return h(
                            "div", [
                                h("p", Number(params.row.bonusGroupName)),
                                h("p", '(' + ((params.row.bonusGroupName - this.userInfo.minBonusGroupName) / 20).toFixed(1) + '%' + ')')
                            ]
                            // ''+ Number(params.row.bonusGroupName) +'(' + ((params.row.bonusGroupName - this.userInfo.minBonusGroupName)/20).toFixed(1)+'%'+')' 
                            // ''+ Number(params.row.bonusGroupName).toFixed(2) +'%' 
                        );
                    }
                },
                {
                    title: "人数",
                    key: "subuserCount",
                    width: 44
                },
                {
                    title: "团队余额",
                    key: "totalAmount",
                    width: 65,
                    render: (h, params) => {
                        return h(
                            "span",
                            Number(params.row.totalAmount).toFixed(2)
                        );
                    }
                },
                {
                    title: "个人余额",
                    key: "balance",
                    width: 71,
                    render: (h, params) => {
                        return h("span", Number(params.row.balance).toFixed(2));
                    }
                },
                {
                    title: "个人投注",
                    key: "bettingAmount",
                    width: 62,
                    render: (h, params) => {
                        return h(
                            "span",
                            Number(params.row.bettingAmount).toFixed(2)
                        );
                    }
                },
                {
                    title: "个人充值",
                    key: "totalFee",
                    width: 62,
                    render: (h, params) => {
                        return h(
                            "span",
                            Number(params.row.totalFee).toFixed(2)
                        );
                    }
                },
                {
                    title: "个人提款",
                    key: "takeFee",
                    width: 62,
                    render: (h, params) => {
                        return h("span", Number(params.row.takeFee).toFixed(2));
                    }
                },
                {
                    title: "操作",
                    key: "operate",
                    width: 50,
                    render: (h, params) => {
                        let nexttLevelClass = "";
                        if (!this.showLevels) {
                            nexttLevelClass = "pointer-not";
                        }
                        let exchangClassName = "lee-opera-div-inside-p "
                        if (this.listData.length > 1) {
                            exchangClassName += " pointer-not un-click-color"
                        }
                        // if(this.)
                        return h(
                            "div",
                            {
                                class: "lee-opera-div"
                            },
                            [
                                h(
                                    "div",
                                    {
                                        class: "lee-opera-div-inside"
                                    },
                                    [
                                        h(
                                            "p",
                                            {
                                                class: exchangClassName
                                                ,
                                                on: {
                                                    click: () => {
                                                        this.changeUser(params);
                                                    }
                                                }
                                            },
                                            "修改"
                                        ),
                                        h(
                                            "p",
                                            {
                                                class:
                                                    "lee-opera-div-inside-p"
                                            },
                                            "转账"
                                        ),
                                        h(
                                            "p",
                                            {
                                                class:
                                                    "lee-opera-div-inside-p",
                                                on: {
                                                    click: () => {
                                                        this.teamUserCode = params.row.userCode
                                                        this.teamReportCount = {
                                                            profitLossTotal: 0,
                                                            buyTotal: 0,
                                                            prizeTotal: 0,
                                                            rebateTotal: 0,
                                                            rechargeTotal: 0,
                                                            takeFeeTotal: 0
                                                        };
                                                        this.leeActiveButton = 0
                                                        this.teamReportTime = {
                                                            startTime: "",
                                                            endTime: ""
                                                        }
                                                        this.teamReportShow = true;
                                                        this.teamUserId = params.row.userId;
                                                        this.getTeamReport();
                                                    }
                                                }
                                            },
                                            "报表"
                                        ),
                                        h(
                                            "p",
                                            {
                                                class: nexttLevelClass,
                                                on: {
                                                    click: () => {
                                                        this.chooseNextLevelUser(
                                                            params
                                                        );
                                                    }
                                                }
                                            },
                                            "下级代理"
                                        )
                                    ]
                                )
                            ]
                        );
                    }
                }
            ],
            manageTime: [],
            sliderObj: {
                min: 0,
                max: 0,
                minBonusGroupName: 0
            },
            // 请求下级代理
            requestContinues: false,
            teamReportShow: false,
            currentUserId: [],
            userInfoList: []
        };
    },
    methods: {
        /**
         * @author Lee
         * @param Object
         * 修改用户详情
         *
         * ****/
        changeUser (params) {
            if (this.listData.length > 1) return
            this.changeUserShow = true;
            this.changeUserInfo = params;
            var user = JSON.parse(localStorage.getItem("user"));
            this.$set(this.groupName, "min", Number(user.minBonusGroupName));
            this.$set(this.groupName, "max", Number(user.bonusGroupName));
            this.$set(
                this.groupName,
                "bonusGroupName",
                Number(params.row.bonusGroupName)
            );
            this.$set(
                this.userInfo,
                "bonusGroupName",
                Number(params.row.bonusGroupName)
            );
            this.$set(
                this.userInfo,
                "minBonusGroupName",
                Number(user.minBonusGroupName)
            );
            this.bonusGroup.splice(0, 0, Number(user.minBonusGroupName));
            this.bonusGroup.splice(1, 0, Number(user.bonusGroupName));
            this.userInfo.userType = params.row.userType;
            this.userInfo.userCode = params.row.userCode;
        },
        changeUserHide () {
            this.changeUserShow = false;
        },
        teamReportHide () {
            this.teamReportShow = false;
        },
        /**
         * @author Lee
         * @param {object}
         * 判断是否请求下级代理列表
         *
         * ****/
        chooseNextLevelUser ({ row }, bool) {
            if (!this.showLevels) {
                return;
            }
            if (row.userType === "00") {
                this.$Message.info("该用户已没有下级代理");
                return;
            }
            // let obj = Object.assign({}, this.paramData);
            let obj = {
                current: 1,
                size: 10,
                userType: '',
                userCode: ''
            }
            obj.userId = row.userId;

            if (this.requestContinues) return;
            this.requestContinues = true;
            this.leeWrapSpinShow = true
            this.currentUserId[this.currentUserId.length] = row.userId
            this.userInfoList.push(row)
            this.$http.post("/api/v2/agent/subuser/list", obj, { userId: true }).then(({ data }) => {
                this.leeWrapSpinShow = false
                if (data.data.list.length == 0) {
                    this.requestContinues = false;
                    this.$Message.info("该用户已没有下级代理");
                    return;
                }
                // this.listData  = [data.data.list]
                if (!bool) {
                    this.breadcrumblist.push(row.userCode)
                }
                this.paramData.current = 1
                this.paramData.total = data.data.total
                this.listData = []
                this.listData.push(data.data.list);
                this.requestContinues = false;
            });
        },

        /**
         * @author Lee
         * @param {Object}
         * 面包屑导航
         * **/
        breadcrumbClick (idx) {
            // let arr = Object.assign([], this.listData);
            let arrForBread = Object.assign([], this.breadcrumblist)
            let userIdList = [...this.currentUserId]
            let userInfoList = [...this.userInfoList]
            if (!idx) {
                // arr.length = 1;
                arrForBread.length = 0
                userIdList.length = 0
                userInfoList.length = 0
            } else {
                // arr.length = idx;
                arrForBread.length = idx - 1
                userIdList.length = idx - 1
                userInfoList.length = idx - 1
            }
            // this.listData = arr;
            this.breadcrumblist = arrForBread
            this.currentUserId = userIdList
            this.userInfoList = userInfoList
            let flagLength = userInfoList.length
            if (flagLength) {
                this.chooseNextLevelUser({ row: this.userInfoList[flagLength - 1] }, true)
            } else {
                this.$set(this.paramData, "userCode", "");
                this.getDataList();
                this.getUserInfoFromLocal();
                this.configList.forEach(item => {
                    if (itm.key === "AGENT_LEVEL_SWITCH") {
                        this.showLevels = itm.value === "0" ? false : true;
                        return;
                    }
                });
                // this.$http.post("/api/v2/sysDict/querySystemConfig").then(({ data }) => {
                //     data.data.forEach(itm => {
                //         if (itm.key === "AGENT_LEVEL_SWITCH") {
                //             this.showLevels = itm.value === "0" ? false : true;
                //             return;
                //         }
                //     });
                // });
            }

        },
        /**
         * @author Lee
         *
         * 获取团队报表
         * ***/
        getTeamReport () {
            let userId = this.teamUserId;

            let obj = {};
            if (this.leeActiveButton == 0) {
                setTimeout(() => {
                    let startTime = this.teamReportTime.startTime;
                    let endTime = this.teamReportTime.endTime;
                    if (!startTime || !endTime) return;

                    obj = {
                        current: 1,
                        gtBuyTime: startTime,
                        ltBuyTime: endTime
                    };
                    this.requestTeamReport(obj);
                }, 0);
                return;
            } else if (this.leeActiveButton == 1) {
                //昨日
                let time = new Date();
                let time2 = new Date();
                time2.setDate(time.getDate() - 1);
                time2.setHours(0);
                time2.setMinutes(0);
                time2.setSeconds(0);
                time.setHours(0);
                time.setMinutes(0);
                time.setSeconds(0);
                obj = {
                    current: 1,
                    gtBuyTime: time2,
                    ltBuyTime: time
                };
            } else if (this.leeActiveButton == 2) {
                //本周
                let time = new Date();
                let time2 = new Date();
                time2.setDate(time.getDate() - time.getDay() + 1);
                time2.setHours(0);
                time2.setMinutes(0);
                time2.setSeconds(0);

                obj = {
                    current: 1,
                    gtBuyTime: time2,
                    ltBuyTime: time
                };
            } else if (this.leeActiveButton == 3) {
                //上周
                let time = new Date();
                let time2 = new Date();
                time2.setDate(time.getDate() - time.getDay() + 1 - 7);
                time2.setHours(0);
                time2.setMinutes(0);
                time2.setSeconds(0);
                time.setDate(time.getDate() - time.getDay() + 1);
                time.setHours(0);
                time.setMinutes(0);
                time.setSeconds(0);
                obj = {
                    current: 1,
                    gtBuyTime: time2,
                    ltBuyTime: time
                };
            } else if (this.leeActiveButton == 4) {
                //本月
                let time = new Date();
                let time2 = new Date();
                time2.setDate(1);
                time2.setHours(0);
                time2.setMinutes(0);
                time2.setSeconds(0);

                obj = {
                    current: 1,
                    gtBuyTime: time2,
                    ltBuyTime: time
                };
            } else if (this.leeActiveButton == 5) {
                //上月
                let time = new Date();
                let time2 = new Date();
                time2.setDate(0);
                time2.setDate(1);
                time2.setHours(0);
                time2.setMinutes(0);
                time2.setSeconds(0);
                time.setDate(1);
                time.setHours(0);
                time.setMinutes(0);
                time.setSeconds(0);
                obj = {
                    current: 1,
                    gtBuyTime: time2,
                    ltBuyTime: time
                };
            }
            this.requestTeamReport(obj);
        },
        /**
         * @author Lee
         * @param {Object}
         * 请求团队报表
         */
        requestTeamReport (obj) {
            obj.size = 32;
            this.spinShow = true;
            this.$http
                .post("/api/v2/agent/subuser/pc/teamReport", obj, { userId: true })
                .then(({ data }) => {
                    this.spinShow = false;

                    if (data.code !== 0) return;
                    let obj = {
                        profitLossTotal: 0,
                        buyTotal: 0,
                        prizeTotal: 0,
                        rebateTotal: 0,
                        rechargeTotal: 0,
                        takeFeeTotal: 0
                    };
                    data.data.reportList.forEach(itm => {
                        obj.profitLossTotal += itm.profitLossTotal * 100;
                        obj.buyTotal += itm.buyTotal * 100;
                        obj.prizeTotal += itm.prizeTotal * 100;
                        obj.rebateTotal += itm.rebateTotal * 100;
                        obj.rechargeTotal += itm.rechargeTotal * 100;
                        obj.takeFeeTotal += itm.takeFeeTotal * 100;
                    });
                    this.teamReportCount = obj;
                });
        },
        reportTimeChange () {
            this.leeActiveButton = 0;
            this.getTeamReport();
        },
        changeActiveButton (num) {
            this.leeActiveButton = num;
            this.getTeamReport();
        },
        addUser () {
            this.detailFlag = true;
            if (this.$refs.userInfo) {
                this.$refs.userInfo.resetFields()
            }
            this.$set(this, "title", "创建新用户");
            this.getUserInfoFromLocal()
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
        },
        cancelAddUser () {
            //取消创建用户
            this.$refs.userInfo.resetFields();
            this.detailFlag = false;
            this.showUserCodeTip = true;
            this.showPasswordTip = true;
        },
        showProgress (val) {
            //显示赔率
            return `${val.toFixed(0)} (${(
                (val - this.userInfo.minBonusGroupName) /
                20
            ).toFixed(1)}%)`;
        },
        changePageWithUserCode () {
            this.uploadUserCode = this.userCode
            this.changePage(1)
        },
        changePage (page, uploadUserCode) {
            let vm = this;
            // vm.$set(vm.paramData, "current", page);
            this.paramData.current = page
            this.getDataList();
        },
        formatDate (value) {
            if (!value) {
                return "无";
            }
            return formatDate.getFormatDate(value);
        },
        changeGroupName (val) {
            this.$set(this.userInfo, "bonusGroupName", val);
        },
        getDataList () {
            let vm = this;
            let ltTime = "";
            let gtTime = "";
            if (this.manageTime.length > 0) {
                ltTime = formatDate.getFormatDate(this.manageTime[0]);
                gtTime = formatDate.getFormatDate(this.manageTime[1]);
            }
            this.$set(vm.paramData, "ltTime", ltTime);
            this.$set(vm.paramData, "gtTime", gtTime);
            this.leeWrapSpinShow = true
            if (this.uploadUserCode) {
                this.paramData.userCode = this.uploadUserCode
            }
            this.paramData.userId = this.currentUserId[this.currentUserId.length - 1]
            this.$http.post("/api/v2/agent/subuser/list", vm.paramData, { userId: true }).then(response => {
                // this.breadcrumbClick(0)
                this.paramData.userCode = ''
                this.uploadUserCode = ''
                this.leeWrapSpinShow = false
                if (response.data.code !== 0) return;
                // let data = response.data.data;
                // vm.listData[0] = data.list;
                let list = Object.assign([], response.data.data.list);
                this.listData = [list];
                // vm.$set(vm.paramData, "total", data.total);
                this.paramData.total = response.data.data.total;
            });
        },
        saveUser (name) {
            // this.listData.push(this.userInfo);
            let vm = this;
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.detailFlag = false;
                    vm[name].password = encryption.encrypt.md5(
                        vm[name].password
                    );
                    vm.$http
                        .post("/api/v2/agent/addSubuser", vm[name], { userId: true })
                        .then(response => {
                            if (response.data.code !== 0) return;
                            vm.userInfo.userCode = '';
                            vm.userInfo.password = '';
                            this.$Message.success("操作成功");
                            vm.changePage(1);
                        });
                } else {
                    thsi.detailFlag = true;
                }
            });
        },
        changeUserSubmit (name) {
            this.$http
                .post("/api/v2/agent/updateSubuser", this[name], { userId: true })
                .then(res => {
                    if (res.data.code !== 0) return;
                    this.$Message.success("操作成功");
                    this.changeUserShow = false;
                    this.changePage(this.paramData.current);
                });
        }
    },
    created () {
        let vm = this;
        vm.$set(vm.paramData, "userCode", "");
        vm.getDataList();
        this.getUserInfoFromLocal();
        this.configList.forEach(itm => {
            if (itm.key === "AGENT_LEVEL_SWITCH") {
                this.showLevels = itm.value === "0" ? false : true;
                return;
            }
        });
        // this.$http.post("/api/v2/sysDict/querySystemConfig").then(({ data }) => {
        //     data.data.forEach(itm => {
        //         if (itm.key === "AGENT_LEVEL_SWITCH") {
        //             this.showLevels = itm.value === "0" ? false : true;
        //             return;
        //         }
        //     });
        // });
    }
};
</script>
<style lang='less'>
.user-manage .lee-opera-div-inside .un-click-color {
    color: #999;
}
.back-after {
    margin-left: -5px;
}
.lee-team-inwrap {
    padding: 0px 6px;
}
.delete-foot {
    .ivu-modal-footer {
        display: none;
    }
}
.lee-team-fir-p {
    line-height: 24px;
    margin-bottom: 14px;
    padding-left: 45px;
    position: relative;
    .fir-span {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url('/configstatic/pc/images/icon.png') -238px -9px
            no-repeat;
        position: absolute;
        left: 10px;
        top: 0px;
    }
}
.lee-team-money {
    color: #ff7614;
}
.lee-row {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
}
.lee-row2 {
    margin-top: 15px;
    button {
        background-color: white;
    }
    span {
        color: #cbcdd3;
    }
    .lee-active-button {
        background-color: #ff8234;
        color: white;
        box-shadow: none;
        span {
            color: inherit;
        }
    }
}
.lee-row-li {
    padding-top: 14px;
    line-height: 30px;
    border-bottom: 1px solid #e2e2e2;
}
.lee-row-li:last-child {
    border-bottom: none;
}
.ivu-table-cell {
    position: relative;
}
.lee-text-ind {
    display: inline-block;
    padding-left: 5px;
}
.lee-userName-behind {
    display: block;
    height: 12px;
    width: 12px;
    top: 0px;
    bottom: 0;
    margin: auto;
    right: -13px;
    position: absolute;
    z-index: 3;
    cursor: pointer;
    border-radius: 50%;
    .lee-popover {
        width: 42px;
        line-height: 18px;
        text-align: center;
        position: absolute;
        border-radius: 4px;
        color: white;
        top: -20px;
        left: -12px;
        opacity: 0.9;
        z-index: 20000;
    }
    .lee-popover1 {
        background-color: #989898;
    }
    .lee-popover2 {
        background-color: #26aa00;
    }
}
.lee-userName-behind1 {
    background-color: #989899;
}
.lee-userName-behind2 {
    background-color: #16bb00;
}
.lee-popover {
    display: none;
}

.lee-userName-behind1:hover .lee-popover {
    display: block;
}
.lee-userName-behind2:hover .lee-popover {
    display: block;
}

.lee-table-title {
    display: flex;
    background: #be1204;
    justify-content: space-between;
    li {
        line-height: 36px;
        color: white;
        font-size: 12px;
        min-width: 8%;
        text-align: center;
    }
}

.table .ivu-table-header span {
    font-size: 12px;
}
.change-user-content {
    padding: 10px 32px 5px;

    .ivu-radio-group {
        padding-left: 20px;
    }
    .userType {
        line-height: 46px;
    }
    .slider {
        display: flex;
        align-items: center;
        .ivu-slider {
            margin: 10px 0;
        }
    }
    .ivu-tooltip {
        margin-top: -2px;
    }
}
.change-user-content-third {
    & > div:nth-child(2) {
        padding-top: 30px;
    }
    .span-main {
        color: #ff7614;
        padding-left: 20px;
    }
}
.change-user-content-second {
    display: flex;
    line-height: 46px;
}
.change-user-content-first {
    display: flex;
    line-height: 30px;
    margin-bottom: 20px;
    & > div {
        height: 30px;
        width: 40px;
        background: url(/configstatic/pc/images/icon.png) -235px -5px no-repeat;
    }
}
.user-manage {
    .lee-opera-div {
        background: url(/configstatic/pc/images/icon.png) -578px -572px
            no-repeat;
        height: 42px;
        cursor: pointer;
        // position: relative;
    }
    .lee-opera-div:hover .lee-opera-div-inside {
        display: block;
    }
    .lee-opera-div-inside {
        position: absolute;
        z-index: 1000;
        display: none;
        background-color: white;
        padding: 0 5px;
        border: 1px solid #555;
        border-radius: 4px;
        & > p {
            width: 52px;
            padding: 4px 0;
            text-align: center;
            border-bottom: 1px solid #999;
            color: #555;
        }
        & > p:nth-child(2) {
            color: #999;
            cursor: not-allowed;
        }
        & > p:last-child {
            border-bottom: none;
        }
    }
    .table {
        overflow: visible;
        position: relative;
    }
    .ivu-table {
        font-size: 12px !important;
        overflow: visible !important;
    }
    .ivu-table-body {
        overflow: visible !important;
    }
    .ivu-table-cell {
        overflow: visible !important;
    }
}
</style>

<style scoped>
.user-manage {
    padding-top: 12px;
}
.user-manage .search {
    text-align: right;
    height: 30px;
}
.user-manage .addUser {
    float: left;
    width: 104px;
}
.user-manage .addUser button {
    width: 104px;
}
.user-manage .addUser button i {
    margin-right: 6px;
    margin-left: -7px;
    font-size: 14px;
}
.user-manage .table {
    width: 100%;
    margin: 0;
    margin-top: 13px;
    overflow: hidden;
}
.user-manage .datetext {
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    margin-top: 4px;
    margin-left: 5%;
}
.user-manage .button {
    display: inline-block;
    vertical-align: top;
    margin-left: 22px;
}
.user-manage .selectDate,
.user-manage .select-user {
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
}
.user-manage .selectDate {
    margin-left: 0;
}
.user-manage .wxbutton {
    margin-left: 33%;
}
.user-manage .modal1 {
    height: 100px;
    width: 500px;
    margin-left: 5%;
}
.user-manage .modal1img {
    float: left;
}
.user-manage .modal1info {
    float: left;
}
.user-manage .infotitle {
    font-size: 20px;
    font-weight: bold;
    margin-left: 15px;
}
.user-manage .infodate {
    font-size: 15px;
    margin-left: 15px;
    color: grey;
}
.user-manage .modal1status {
    float: left;
    width: 100px;
    height: 30px;
    margin-top: 15px;
    margin-left: 15%;
    background-color: grey;
    text-align: center;
    padding-top: 7px;
    border-radius: 13px 13px 13px 13px;
}
.user-manage .modal1detail {
    margin-bottom: 10px;
}
.user-manage .modal1status span {
    color: white;
}
.user-manage .detailnum {
    margin-left: 8%;
}
.user-manage .detailcss {
    margin-left: 20px;
}
/* .user-manage .circle {
    float:left;
    display: block;
    background: rgb(197, 189, 189);
    border-radius: 50%;
    height: 40px;
    width: 40px;
    margin: 0;
    background: -webkit-radial-gradient(5px 5px, circle, white, grey);
    background: -moz-radial-gradient(5px 5px, circle, white, grey);
    background: radial-gradient(5px 5px, circle, white, grey);
} */
.user-manage .left {
    margin-right: 1px;
}
.user-manage .first {
    margin-left: 5px;
}
.user-manage .text {
    margin-left: 40%;
    line-height: 40px;
    font-weight: bold;
}
.user-manage .button {
    height: 32px;
    text-align: right;
}
.user-manage .ivu-input {
    height: 30px;
}
.user-manage .ivu-btn-primary {
    width: 66px;
}
.user-manage >>> .ivu-table th:nth-child(6) .ivu-table-cell {
    padding-left: 9px !important;
}
.user-manage >>> .ivu-table td {
    background: transparent;
}
.user-manage >>> .ivu-table-row:nth-child(even) {
    background: #e2e2e2;
}
.user-manage >>> .ivu-table-cell .color-red {
    color: #be1204;
}
.ivu-form >>> .ivu-form-item-label {
    padding-right: 6px;
}
.ivu-form-item-content {
    margin-left: 0 !important;
    font-size: 14px;
    color: #313131;
}
.ivu-form .ivu-form-item-label {
    padding-right: 8px;
}
.ivu-form-item-error-tip {
    font-size: 12px;
}
.ivu-form-item {
    margin-bottom: 20px;
}
/* slider */
.v-transfer-dom >>> .ivu-slider {
    display: inline-block;
    width: 180px;
    margin: 0 7px;
    position: relative;
    top: -1px;
}
.slider >>> span {
    display: inline-block;
    vertical-align: top;
    /* margin-left:-3px; */
    color: #ff7614;
    font-size: 12px;
}

.user-manage .table {
    overflow: visible;
}
</style>
