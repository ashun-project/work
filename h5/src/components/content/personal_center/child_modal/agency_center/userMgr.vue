<template>
	<div class="user-mgr" ref="viewBox">
		<div>
			<my-header title="会员管理" bkUrl="/agencyCenter">
				<div slot="h-right" class="new" @click="goPage('/agencyCenter/userAdd')">
					+ 新增会员
				</div>
			</my-header>
			<p class="spit"></p>
			<div class="search-box">
				<div class="ui-select-type">
					<span class="lb" @click="showType">
						<span ref="lb">{{userType}}</span>
						<i class="iconfont icon-arrowDown"></i>
					</span>
					<ul class="list" :class="{show: typeListShow}">
						<li @click="selectType('代理', '10')">
							<i class="dl"></i>
							<span>代理</span>
						</li>
						<li @click="selectType('会员', '00')">
							<i class="hy"></i>
							<span>会员</span>
						</li>
					</ul>
					<div class="shawdow" @click="showType" v-show="typeListShow"></div>
				</div>
				<div class="input-wrap">
					<input class="in" v-model="paramData.userCode" type="text" placeholder="输入会员名">
					<span @click="searchUser">
						<i class="iconfont icon-search"></i>
					</span>
				</div>
			</div>
			<div class="user-level-box" v-if="showLevels">
				<p class="tit">当前会员层级</p>
				<div class="user-levels">
					<i class="item icon-home" @click="currentAgent(user, -1)"></i>
					<div class="levels">
						<span class="item" @click.stop="currentAgent(item, index)" v-for="(item,index) in userLevels" :key="index">{{item.userCode}}</span>
					</div>
				</div>
			</div>
			<div class="list-hd">
				<span class="item name">会员名</span>
				<span class="item">类型</span>
				<span class="item rabate">返点</span>
				<span class="item balance">余额</span>
				<!-- <span class="item">团队人数</span> -->
				<span class="item">操作</span>
			</div>
			<div scrollDom="#usermgr-scroll" v-refresh="downRefresh">
				<my-scroll ref="myScroll" :fetchData="getDataList" :status="status" id="usermgr-scroll">
					<div class="list-bd">
						<div class="item" @click="showMore" v-for='(list,index) in listData' :key='index'>
							<div class="cont">
								<span class="item name">{{list.userCode}}</span>
								<span class="item">{{list.userTypeText}}</span>
								<span class="item rabate">{{setBonusGroupName(list.bonusGroupName)}}</span>
								<span class="item balance">{{Number(list.balance).toFixed(2)}}</span>
								<!-- <span class="item">{{list.subuserCount}}</span> -->
								<span class="item red" @click.stop="goDetail(list)">详情</span>
							</div>
							<div class="more">
								<template v-if="showLevels">
									<template v-if="list.userType === '00'">
										<span class="item disabled" @click.stop>
											<i class="xj"></i>
											<label>下级</label>
										</span>
									</template>
									<template v-else>
										<span class="item" @click.stop="getChildAgents(list)">
											<i class="xj"></i>
											<label>下级</label>
										</span>
									</template>
								</template>
								<template v-if="userLevels.length>=1">
									<span class="item disabled">
										<i class="xg"></i>
										<label>修改</label>
									</span>
								</template>
								<template v-else>
									<span class="item" @click.stop='editorInfo(list)'>
										<i class="xg"></i>
										<label>修改</label>
									</span>
								</template>

								<span class="item" @click.stop='transferMoney'>
									<i class="zz"></i>
									<label>转账</label>
								</span>
								<template v-if="list.userType === '00'">
									<span class="item disabled" @click.stop>
										<i class="bb"></i>
										<label>报表</label>
									</span>
								</template>
								<template v-else>
									<span class="item" @click.stop='goMemberReport(list.userCode)'>
										<i class="bb"></i>
										<label>报表</label>
									</span>
								</template>

							</div>
						</div>
					</div>

				</my-scroll>
			</div>
		</div>
		<mt-popup class="agent-popupBotom" v-model="showEditor" position="bottom">
			<i class="iconfont icon-close popup-close" @click.stop="showEditor=false"></i>
			<ul class='userN-form userN-form2'>
				<li>
					<div class="lb">会员名：{{subUser.userCode}}</div>
				</li>
				<li>
					<div class="lb">用户类别：{{subUser.userTypeText}}</div>
				</li>
				<li>
					<div class="lb">代理返点：
						<span>{{+(((userInfo.bonusGroupName - MIN_BONUS)/MAX_BONUS * 100).toFixed(1)) +'%'+'('+ Number(userInfo.bonusGroupName)+')'}}</span>
					</div>
				</li>
				<li>
					<div class="cont">
						<my-slider :isOdd="true" v-model="userInfo.bonusGroupName" @input="changeGroupName" :min="groupName.min" :max="groupName.max" :bar-height="4">
							<div class="txt start" slot="start" style='display:inline-block;color:rgb(40,40,40);font-size:14px;'>
								<span>{{bonusGroup[0]}}</span><br>
								<span>({{((groupName.min - MIN_BONUS)/MAX_BONUS * 100).toFixed(1)}}%)</span>
							</div>
							<div class="txt end" slot="end" style='display:inline-block;color:rgb(40,40,40);font-size:14px;'>
								<span>{{bonusGroup[1]}}</span><br>
								<span>({{((groupName.max - MIN_BONUS)/MAX_BONUS* 100).toFixed(1)}}%)</span>
							</div>
						</my-slider>

					</div>
				</li>
				<li>
					<mt-button type="default" size="large" @click='asyncOK'>确定修改</mt-button>
				</li>
			</ul>
		</mt-popup>
		<mt-popup class="agent-popupBotom" v-model="showUserDetal" position="bottom">
			<i class="iconfont icon-close popup-close" @click.stop="showUserDetal=false"></i>
			<div class="userN-body">
				<div class="hd">
					<i></i>
					<span class="name">{{userDetal.userCode}}</span>
				</div>
				<ul class="user-form">
					<li>
						<label class="lb">
							用户类别：
						</label>
						<div class="cont">
							<span>{{userDetal.userTypeText}}</span>
						</div>
					</li>
					<li>
						<label class="lb">
							代理返点:
						</label>
						<div class="cont">
							<span>{{((Number(userDetal.bonusGroupName) - MIN_BONUS) / 20).toFixed(1)}}%
								<span class="gray">( {{userDetal.bonusGroupName}} )</span>
							</span>
						</div>
					</li>
					<li>
						<label class="lb">
							余额：
						</label>
						<div class="cont">
							<span>{{Number(userDetal.balance).toFixed(2)}}元</span>
						</div>
					</li>
					<li>
						<label class="lb">
							个人充值：
						</label>
						<div class="cont">
							<span>{{Number(userDetal.bettingAmount).toFixed(2)}}元</span>
						</div>
					</li>
					<li>
						<label class="lb">
							个人提款：
						</label>
						<div class="cont">
							<span>{{Number(userDetal.totalFee).toFixed(2)}}元</span>
						</div>
					</li>
					<li>
						<label class="lb">
							团队人数：
						</label>
						<div class="cont">
							<span>{{userDetal.subuserCount}}</span>
						</div>
					</li>
					<li>
						<label class="lb">
							最后登录时间：
						</label>
						<div class="cont">
							<span>{{userDetal.loginTime | formateTime}}</span>
						</div>
					</li>
					<li>
						<label class="lb">
							当前离线状态：
						</label>
						<div class="cont">
							<span class="login-state online" v-if="userDetal.onlineStatus!='00'">
								<i class="iconfont icon-right"></i>在线</span>
							<span class="login-state offline" v-else>
								<i class="iconfont icon-close"></i>离线</span>
						</div>
					</li>
					<li>
						<label class="lb">
							离线天数：
						</label>
						<div class="cont">
							{{userDetal.offLineDay}}天
						</div>
					</li>
				</ul>
			</div>
		</mt-popup>
	</div>
</template>
<script>
import util from '@/components/common/module_js/util'
import dateUtil from '@/components/common/module_js/format_date.js'
export default {
	data () {
		return {
			typeListShow: false,
			paramData: {
				userCode: "",
				current: 1,
				size: 15,
				userType: "",
			},
			listData: [],
			showEditor: false,
			userType: "用户类别",
			userInfo: {},
			groupName: {},
			bonusGroup: [],
			subUser: {}, //修改的下级用户
			status: 0,
			userLevels: [],
			showLevels: false,
			showUserDetal: false,
			userDetal: {}

		};
	},
	computed: {
		user () {
			return this.$store.state.user;
		},
	},
	created () {
		this.MIN_BONUS = 1800;
		this.MAX_BONUS = 2000;
		this.$systemConfig().then((systemConfig) => {
			this.showLevels = systemConfig['AGENT_LEVEL_SWITCH'] === "0" ? false : true;
		})
	},
	mounted () {

	},
	filters: {
		formateTime (val) {
			return val ? dateUtil.getFormatDate(val, 'yymmddhhmmss') : '';
		}
	},
	methods: {
		downRefresh () {
			return new Promise((resolve, rej) => {
				this.getDataList(true, resolve)
				setTimeout(() => {
					resolve()
				}, 1000)
			})
		},
		setBonusGroupName (val) {
			return ((Number(val) - this.MIN_BONUS) / 20).toFixed(1) + '%(' + val + ')'
		},
		showProgress (val) {
			//显示赔率
			return `${Number(this.userInfo.bonusGroupName).toFixed(0)}(${(
				this.userInfo.bonusGroupName / 20
			).toFixed(1)}%)`;
		},
		asyncOK () {
			//修改返点完毕
			this.$http.post("/api/v2/agent/updateSubuser", {
				userCode: this.subUser.userCode,
				bonusGroupName: this.userInfo.bonusGroupName
			}, { userId: true, loading: 2 }).then(response => {
				if (response.data.code !== 0) return;
				this.showEditor = false;
				this.$Message("修改成功");
				this.subUser.bonusGroupName = this.userInfo.bonusGroupName;
			});
		},
		changeGroupName (val) {
			this.$set(this.userInfo, "bonusGroupName", val);
		},

		showEditorDlg () {
			this.showEditor = true;
		},
		querryChild (userId) {
			this.paramData.userId = userId;
			this.paramData.userType = '';
			this.paramData.userCode = '';
			this.userType = "用户类别";
			this.getDataList(true);
		},
		currentAgent (item, index) {
			this.userLevels.splice(index + 1, this.userLevels.length - index);
			if (index === -1) {  // 只查询自己的
				this.querryChild('');
				return;
			}
			this.querryChild(item.userId);
		},
		getChildAgents (item) {
			this.userLevels.push(item);
			this.querryChild(item.userId);
		},
		editorInfo (list) {
			if (this.userLevels.length >= 1) {
				this.$Message('您无权限修改下级以外的会员资料');
				return
			}
			this.subUser = list;
			//   this.showEditor = true;
			this.showEditorDlg();
			//编辑 -->返点
			var user = JSON.parse(localStorage.getItem("user"));

			this.$set(this.groupName, "min", Number(user.minBonusGroupName));
			this.$set(this.groupName, "max", Number(user.bonusGroupName));
			this.$set(this.userInfo, "bonusGroupName", Number(list.bonusGroupName));
			this.bonusGroup.splice(0, 0, Number(user.minBonusGroupName));
			this.bonusGroup.splice(1, 0, Number(user.bonusGroupName));
		},
		goMemberReport (userCode) {
			//去团队报表
			this.$router.push({ path: `/agencyCenter/agentReport?userCode=${userCode}` });
		},
		transferMoney () {
			//转账
			this.$Message("敬请期待");
			return;
		},
		goPage (path) {
			this.$router.push({ path: "userAdd" });
		},
		goDetail (item) {
			this.showUserDetal = true;
			this.userDetal = item;
		},
		showType () {
			this.typeListShow = !this.typeListShow;
		},
		searchUser () {
			this.$set(this.paramData, "userId", '');
			this.userLevels = [];
			this.getDataList(true);
		},
		selectType (txt, type) {
			this.userType = txt;
			this.typeListShow = false;
			this.$set(this.paramData, "userId", '');
			this.$set(this.paramData, "userType", type);
			this.userLevels = [];
			this.getDataList(true);
		},
		showMore () {
			util.toggleClass(event.currentTarget.querySelector('.more'), "show")
		},
		// getData() {
		//   let user = localStorage.getItem("user"), userId = "";
		//   if (!user) {0
		//       return
		//   }
		//     user = JSON.parse(user);
		//     userId = user.userId;
		//      axios
		//     .post("/api/v2/agent/subuser/list", {
		//       userId: userId,
		//       gtBuyTime: this.startTime,
		//       ltBuyTime: this.endTime
		//     })
		//     .then((res) => {

		//     });
		// },
		getDataList (search, resolve) {
			let vm = this;
			this.status = 1;
			// 判断搜索进来
			if (search) {
				this.$set(vm.paramData, "current", 1);

			}
			this.$http
				.post("/api/v2/agent/subuser/list", vm.paramData, { userId: true, noEncrypt: true })
				.then(response => {
					if (resolve) {
						resolve();
						this.listData = [];
					}
					if (search) {
						this.listData = [];
					}
					if (response.data.code !== 0) {
						this.status = 3;
						return;
					}
					let data = response.data.data;
					// vm.listData = data.list;
					if (data.list.length) {
						for (let i = 0; i < data.list.length; i++) {
							vm.listData.push(data.list[i]);
						}
						vm.$set(vm.paramData, "current", vm.paramData.current + 1);
						this.status = 0;
						if (data.list.length < vm.paramData.size) {
							vm.status = 3;
						}
					} else {
						vm.status = 2;
					}
				});
		}
	}
};
</script>
<style lang="less">
@import './agency.less'; // 使用 CSS
</style>

<style scoped lang="less">
@rem: 40rem; //根据页面尺寸算的
.header {
    .new {
        font-size: 32 / @rem;
    }
}
.user-mgr {
    height: 100%;
    overflow-y: auto;
}
.spit {
    background: #f2f2f2;
    height: 20 / @rem;
}
.mt-range-runway {
    left: -20px;
}
.search-box {
    height: 108 / @rem;
    padding: 22 / @rem 34 / @rem;
    display: flex;
    align-items: center;
    font-size: 28 / @rem;
    .input-wrap {
        background-color: #eee;
        border-radius: 16px;
        height: 100%;
        position: relative;
        flex: 1;
        .in {
            height: 100%;
            line-height: 64 / @rem;
            padding: 0 20 / @rem;
            background-color: transparent;
        }
        .iconfont {
            color: #aaa;
            position: absolute;
            right: 15px;
            top: 6 / @rem;
            font-size: 36 / @rem;
        }
    }
}

.list-hd {
    position: relative;
    z-index: 81;
    height: 88 / @rem;
    line-height: 88 / @rem;
    color: #fff;
    text-align: center;
    font-size: 32 / @rem;
    background-color: #ec0022;
    display: flex;
    .item {
        flex: 1;
    }
    .rabate {
        width: 3rem;
        flex: inherit;
    }
    .name {
        width: 4rem;
        flex: inherit;
    }
    .balance {
        width: 3rem;
        flex: inherit;
    }
}
.list-bd {
    & > div {
        border-bottom: 1px solid #f2f2f2;
    }
    .cont {
        display: flex;
        text-align: center;

        .item {
            flex: 1;
            height: 88 / @rem;
            line-height: 88 / @rem;
            color: #989898;
            font-size: 26 / @rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .rabate {
            white-space: inherit;
            width: 3rem;
            flex: inherit;
            line-height: normal;
            padding-top: 0.4rem;
        }
        .name {
            white-space: inherit;
            width: 4rem;
            flex: inherit;
            line-height: normal;
            padding-top: 0.4rem;
            word-wrap: break-word;
        }
        .balance {
            white-space: inherit;
            width: 3rem;
            flex: inherit;
            line-height: normal;
            padding-top: 0.4rem;
            word-wrap: break-word;
        }
        .red {
            color: #ec0022;
        }
    }
    .more {
        border-top: 1px solid transparent;
        display: flex;
        text-align: center;
        height: 0;
        padding: 0;
        transition: all 0.5s;
        overflow: hidden;
        &.show {
            padding: 15 / @rem;
            height: 128 / @rem;
            border-top-color: #f2f2f2;
        }
        .item {
            flex: 1;
            font-size: 28 / @rem;
            i {
                display: block;
                width: 64 / @rem;
                height: 64 / @rem;
                margin: 0 auto;
                background: url(../../../../../resource/images/umgr-opt.png)
                    no-repeat;
                background-size: 80 / @rem 600 / @rem;
            }
            .xj {
                background-position: -6 / @rem -216 / @rem;
            }
            .xg {
                background-position: 0 0;
            }
            .zz {
                background-position: 0 -76 / @rem;
            }
            .bb {
                background-position: 0 -148 / @rem;
            }
            &.disabled {
                color: #999;
                .xj {
                    background-position: -6 / @rem -286 / @rem;
                }
                .xg {
                    background-position: -6 / @rem -366 / @rem;
                }
                .zz {
                    background-position: -6 / @rem -440 / @rem;
                }
                .bb {
                    background-position: -6 / @rem -516 / @rem;
                }
            }
        }
    }
}
.userN-form2 {
    padding: 40 / @rem 20 / @rem;
    .lb {
        margin-bottom: 20 / @rem;
        font-size: 28 / @rem;
    }
}
.mint-popup-bottom {
    width: 100%;
}
.userN-detail {
    position: fixed;
    left: 0;
    top: 2.2rem;
    bottom: 0;
    right: 0;
    z-index: 1000;
    background-color: #fff;
}
.userN-body {
    .hd {
        height: 80 / @rem;
        background-color: #f2f2f2;
        padding: 0 20 / @rem;
        display: flex;
        align-items: center;
        i {
            display: inline-block;
            width: 40 / @rem;
            height: 50 / @rem;
            background: url(../../../../../resource/images/umgr-input.png)
                no-repeat;
            background-size: 50 / @rem 250 / @rem;
            background-position: 0 -112 / @rem;
            margin-right: 18 / @rem;
        }
        .name {
            font-size: 30 / @rem;
            color: #ff7614;
        }
    }
    .user-form {
        padding: 0;
    }
    ul {
        li {
            height: 66 / @rem;
            line-height: 66 / rem;
            border-bottom: 1px solid #f2f2f2;
            padding: 0 30 / @rem;
            .lb {
                font-size: 28 / @rem;
                color: #282828;
            }
            .cont {
                font-size: 28 / @rem;
                color: #ff7614;
            }
            .gray {
                color: #999;
            }
            .login-state {
                color: #fff;
                padding: 4 / @rem 10 / @rem;
                border-radius: 4px;
                font-size: 30 / @rem;
                .iconfont {
                    background-color: #fff;
                    width: 30 / @rem;
                    height: 30 / @rem;
                    line-height: 32 / @rem;
                    text-align: center;
                    border-radius: 100%;
                    display: inline-block;
                    font-weight: bold;
                    margin-right: 10 / @rem;
                    font-size: 24 / @rem;
                }
                &.online {
                    background-color: #16bb00;
                    .iconfont {
                        color: #16bb00;
                    }
                }
                &.offline {
                    background-color: #be1204;
                    .iconfont {
                        color: #be1204;
                    }
                }
            }
        }
    }
}
</style>


