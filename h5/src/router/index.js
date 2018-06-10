import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex'
const notFound = resolve => require(['@/components/content/404/404'], resolve)
const layout = resolve => require(['@/components/layout/layout'], resolve)
const home = resolve => require(['@/components/content/home/home'], resolve)
const lottery = resolve => require(['@/components/content/lottery/lottery'], resolve)
const prizeNotice = resolve => require(['@/components/content/prizeNotice/prizeNotice'], resolve)
const active = resolve => require(['@/components/content/active/active'], resolve)
const activeDetail = resolve => require(['@/components/content/active/detail'], resolve)
const historyList = resolve => require(['@/components/content/prizeNotice/historyList'], resolve)
const trend = resolve => require(['@/components/content/trend/trend'], resolve)
const bettingList = resolve => require(['@/components/content/bettingList/bettingList'], resolve)
const bettingDetail = resolve => require(['@/components/content/bettingList/bDetail'], resolve)
const buyLottery = resolve => require(['@/components/content/buy_lottery/buy_lottery'], resolve)
const agreement = resolve => require(['@/components/content/agreement/agreement'], resolve)
const login = resolve => require(['@/components/content/login/login'], resolve)
const register = resolve => require(['@/components/content/register/register'], resolve)
const freePlay = resolve => require(['@/components/content/free_play/free_play'], resolve)
const personalCenter = resolve => require(['@/components/content/personal_center/personal_center'], resolve)
const personalInfo = resolve => require(['@/components/content/personal_center/child_modal/personal_info/personal_info'], resolve)
const bankList = resolve => require(['@/components/content/personal_center/child_modal/mysetting/bank/bank_list'], resolve)
const bandingbank = resolve => require(['@/components/content/personal_center/child_modal/mysetting/bank/bandingbank'], resolve)
const mysetting = resolve => require(['@/components/content/personal_center/child_modal/mysetting/mysetting'], resolve)
const resetLoginPwd = resolve => require(['@/components/content/personal_center/child_modal/mysetting/reset_login_pwd/reset_login_pwd'], resolve)
const feedback = resolve => require(['@/components/content/personal_center/child_modal/mysetting/feedback/feedback'], resolve)
const feedbackAdd = resolve => require(['@/components/content/personal_center/child_modal/mysetting/feedback/feedbackAdd'], resolve)
const balanceDetail = resolve => require(['@/components/content/personal_center/child_modal/balance_detail/balance_detail'], resolve)
const setPayPwd = resolve => require(['@/components/content/personal_center/child_modal/mysetting/reset_pay_pwd/set_pay_pwd'], resolve)
const resetPayPwd = resolve => require(['@/components/content/personal_center/child_modal/mysetting/reset_pay_pwd/reset_pay_pwd'], resolve)
const setRealName = resolve => require(['@/components/content/personal_center/child_modal/mysetting/real_name/set_real_name'], resolve)
const rechargeList = resolve => require(['@/components/content/personal_center/child_modal/recharge_list/recharge_list'], resolve)
const takefee = resolve => require(['@/components/content/personal_center/child_modal/takefee_list/takefee'], resolve)
const takefeeList = resolve => require(['@/components/content/personal_center/child_modal/takefee_list/takefee_list'], resolve)
const agencyCenter = resolve => require(['@/components/content/personal_center/child_modal/agency_center/agency_center'], resolve)
const teamReport = resolve => require(['@/components/content/personal_center/child_modal/agency_center/teamReport'], resolve)
const agentReport = resolve => require(['@/components/content/personal_center/child_modal/agency_center/agentReport'], resolve)
const agentDealList = resolve => require(['@/components/content/personal_center/child_modal/agency_center/agentDealList'], resolve)
const tgMgr = resolve => require(['@/components/content/personal_center/child_modal/agency_center/tgMgr'], resolve)
const tgAdd = resolve => require(['@/components/content/personal_center/child_modal/agency_center/tgAdd'], resolve)
const explain = resolve => require(['@/components/content/personal_center/child_modal/agency_center/explain'], resolve)
const commission = resolve => require(['@/components/content/personal_center/child_modal/agency_center/commission'], resolve)
const userMgr = resolve => require(['@/components/content/personal_center/child_modal/agency_center/userMgr'], resolve)
const userAdd = resolve => require(['@/components/content/personal_center/child_modal/agency_center/userAdd'], resolve)
const aboutme = resolve => require(['@/components/content/personal_center/child_modal/mysetting/aboutme/aboutme'], resolve)
const lotteryTypeRule = resolve => require(['@/components/content/personal_center/child_modal/lottery_type_rule/lottery_type_rule'], resolve)
const lotteryPlay = resolve => require(['@/components/content/personal_center/child_modal/lottery_play/lottery_play'], resolve)
const information = resolve => require(['@/components/content/personal_center/child_modal/information/information'], resolve)
const information_sys = resolve => require(['@/components/content/personal_center/child_modal/information/information_system'], resolve)
const information_user = resolve => require(['@/components/content/personal_center/child_modal/information/information_user'], resolve)
const helpCenter = resolve => require(['@/components/content/personal_center/child_modal/help_center/help_center'], resolve)
const helpList = resolve => require(['@/components/content/personal_center/child_modal/help_center/help_list'], resolve)
const helpDetail = resolve => require(['@/components/content/personal_center/child_modal/help_center/help_detail'], resolve)
const recharge = resolve => require(['@/components/content/personal_center/child_modal/recharge_list/recharge'], resolve)
const rechargeType = resolve => require(['@/components/content/personal_center/child_modal/recharge_list/rechargeType'], resolve)
const setSculpture = resolve => require(['@/components/content/personal_center/child_modal/set_sculpture/set_sculpture'], resolve)
/*  个人中心end */
const redPacket = resolve => require(['@/components/content/redPacket/redPacket'], resolve)
const redPacketOrder = resolve => require(['@/components/content/redPacket/order'], resolve)
const myRedPacket = resolve => require(['@/components/content/redPacket/myRedPacket'], resolve)
const redPacketRule = resolve => require(['@/components/content/redPacket/rule'], resolve)

Vue.use(Router)

let setRoute = new Router({
	routes: [{
			path: '/',
			name: 'layout',
			component: layout,
			redirect: '/home',
			children: [{
					path: '/home',
					name: 'home',
					component: home,
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/lottery',
					name: 'lottery',
					component: lottery,
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/buyLottery/:id',
					name: 'buyLottery',
					component: buyLottery,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/active',
					name: 'active',
					component: active,
					meta: {
						keepAlive: true,
						notFooter: true
					}
				},
				{
					path: '/active_detail/:id',
					name: 'active_detail',
					component: activeDetail,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/prizeNotice',
					name: 'prizeNotice',
					component: prizeNotice,
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/historyList/:id',
					name: 'historyList',
					component: historyList,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/trend/:id',
					name: 'trend',
					component: trend,
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/bettingList',
					name: 'bettingList',
					component: bettingList,
					meta: {
						keepAlive: true,
						notFooter: true
					}
				},
				{
					path: '/bettingDetail/:id',
					name: 'bettingDetail',
					component: bettingDetail,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/login',
					name: 'login',
					component: login,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/register',
					name: 'register',
					component: register,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/freePlay',
					name: 'freePlay',
					component: freePlay,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/agreement',
					name: 'agreement',
					component: agreement,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/personalCenter',
					name: 'personalCenter',
					component: personalCenter,
					meta: {
						keepAlive: true,
						//	notHeader: true
					}
				},
				{
					path: '/personalInfo',
					name: 'personalInfo',
					component: personalInfo,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/bankList',
					name: 'bankList',
					component: bankList,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/bandingbank',
					name: 'bandingbank',
					component: bandingbank,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/resetLoginPwd',
					name: 'resetLoginPwd',
					component: resetLoginPwd,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/mysetting',
					name: 'mysetting',
					component: mysetting,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/feedback',
					name: 'feedback',
					component: feedback,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/feedbackAdd',
					name: 'feedbackAdd',
					component: feedbackAdd,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/balanceDetail',
					name: 'balanceDetail',
					component: balanceDetail,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/setSculpture',
					name: 'setSculpture',
					component: setSculpture,
					meta: {
						notFooter: true,
						notHeader: true
					}
				},
				{
					path: '/setPayPwd',
					name: 'setPayPwd',
					component: setPayPwd,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/resetPayPwd',
					name: 'resetPayPwd',
					component: resetPayPwd,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/setRealName',
					name: 'setRealName',
					component: setRealName,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/rechargeList',
					name: 'rechargeList',
					component: rechargeList,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/takefeeList',
					name: 'takefeeList',
					component: takefeeList,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/takefee',
					name: 'takefee',
					component: takefee,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/recharge',
					name: 'recharge',
					component: recharge,
					meta: {
						notFooter: true
					},
					children: [{
						path: '/recharge/:id',
						name: '/recharge/:id',
						component: rechargeType,
						meta: {
							notFooter: true
						},
					}]
				},
				{
					path: '/agencyCenter',
					name: 'agencyCenter',
					component: agencyCenter,
					meta: {
						notFooter: true,
						//	notHeader: true
					},

				},
				{
					path: '/agencyCenter/teamReport',
					name: 'teamReport',
					component: teamReport,
					meta: {
						notFooter: true,
						//	notHeader: true
					},
				},
				{
					path: '/agencyCenter/agentReport',
					name: 'agentReport',
					component: agentReport,
					meta: {
						notFooter: true,
						//	notHeader: true
					},
				},

				{
					path: '/agencyCenter/tgMgr',
					name: 'tgMgr',
					component: tgMgr,
					meta: {
						notFooter: true,
						//	notHeader: true
					},
				},
				{
					path: '/agencyCenter/tgAdd/:id',
					name: 'tgAdd',
					component: tgAdd,
					meta: {
						notFooter: true,
						//	notHeader: true
					},
				},
				{
					path: '/agencyCenter/userMgr',
					name: 'userMgr',
					component: userMgr,
					meta: {
						notFooter: true,
						//	notHeader: true
					},
				},
				{
					path: '/agencyCenter/userAdd',
					name: 'userAdd',
					component: userAdd,
					meta: {
						notFooter: true,
						//	notHeader: true
					},
				},
				{
					path: '/agencyCenter/commission',
					name: 'commission',
					component: commission,
					meta: {
						notFooter: true,
						//	notHeader: true
					},
				},
				{
					path: '/agencyCenter/explain',
					name: 'explain',
					component: explain,
					meta: {
						notFooter: true,
						//notHeader: true
					},
				}, {
					path: '/agentDealList/agentDealList',
					name: 'agentDealList',
					component: agentDealList,
					meta: {
						notFooter: true
					}
				},

				{
					path: '/aboutme',
					name: 'aboutme',
					component: aboutme,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/lotteryTypeRule',
					name: 'lotteryTypeRule',
					component: lotteryTypeRule,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/lotteryPlay',
					name: 'lotteryPlay',
					component: lotteryPlay,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/information',
					name: 'information',
					component: information,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/information/sys',
					name: 'information_sys',
					component: information_sys,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/information/user',
					name: 'information_user',
					component: information_user,
					meta: {
						notFooter: true
					}
				},
				{
					path: '/helpCenter',
					name: 'helpCenter',
					component: helpCenter,
					meta: {
						notFooter: true
					},
				},
				{
					path: '/helpList/:id',
					name: 'helpList',
					component: helpList,
					meta: {
						notFooter: true
					},
				},
				{
					path: '/helpDetail/:id',
					name: 'helpDetail',
					component: helpDetail,
					meta: {
						notFooter: true
					},
				},
				{
					path: '/redPacket',
					name: 'redPacket',
					component: redPacket,
					meta: {
						notFooter: true
					},
					children: [{
							path: 'order',
							name: 'order',
							component: redPacketOrder,
							meta: {
								notFooter: true
							},
						},
						{
							path: 'myRedPacket',
							name: 'myRedPacket',
							component: myRedPacket,
							meta: {
								notFooter: true
							},
						},
						{
							path: 'rule',
							name: 'rule',
							component: redPacketRule,
							meta: {
								notFooter: true
							},
						}
					]
				},
			]
		},
		{
			path: '*',
			name: '404',
			component: notFound
		}
	]
})
//截取进入路由的上一个页面

let history = sessionStorage;
let historyCount = history.getItem('historyCount');
let paths = ['home', 'lottery', 'prizeNotice', 'trend', 'personalCenter'],
	initPaths = {}
for (let itemPath of paths) {
	initPaths["/" + itemPath] = 1;
}
initPaths['/agencyCenter'] = 2
history.setItem("historyPaths", JSON.stringify(initPaths))

setRoute.beforeEach((to, from, next) => {
	let arr = ['/', '/freePlay', '/register'],
		user = store.state.user;
	arr.some(item => item === from.path)
	if (to.path === '/login' && !arr.some(item => item === from.path)) {
		sessionStorage.setItem('path', from.path);
	}
	if (to.path.indexOf('/buyLottery') > -1) {
		const buyLotteryStatus = sessionStorage.getItem("buyLottery" + to.params.id);
		if (buyLotteryStatus) {
			if (buyLotteryStatus === '0') {
				Vue.prototype.$Message('该彩种正在维护...');
				return;
			}
		}
		// if(!user.userCode) {
		//     Vue.prototype.$Modal.confirm('该操作需要登录，是否登录?', '温馨提示').then(()=>{
		//         window.location.href="/#/login";
		//     },()=>{})
		//     return;
		// }

	}
	/* router 缓动滑动begin */
	let toIndex, fromIndex, transitionPop, historyPaths = history.getItem('historyPaths');

	if (historyPaths) {
		historyPaths = JSON.parse(historyPaths);
	} else {
		historyPaths = {}
	}
	toIndex = historyPaths[to.path];
	fromIndex = historyPaths[from.path];
	transitionPop = store.state.transitionPop;

	if (transitionPop || (paths.indexOf(to.name) > -1 && paths.indexOf(from.name) > -1)) {
		store.commit('getDirection', 'static');
	} else {
		if (toIndex) {
			if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
				store.commit('getDirection', 'in')
			} else {
				store.commit('getDirection', 'out')
			}
		} else {
			historyCount = historyCount ? historyCount : 1;
			++historyCount;
			historyPaths[to.path] = historyCount;

			history.setItem('historyCount', historyCount);
			to.path !== '/' && history.setItem("historyPaths", JSON.stringify(historyPaths));
			store.commit('getDirection', 'in')
		}
	}
	/* router 缓动滑动end */
	next()
})
export default setRoute
