import Vue from 'vue'
import Router from 'vue-router'
import notFound from '@/components/content/404/404'
import {
	Spin
} from 'iview'
const layout = resolve => require(['@/components/layout/layout'], resolve)
const home = resolve => {
	Spin.show();
	require.ensure(['@/components/content/home/home'], () => {
		resolve(require('@/components/content/home/home'));
		Spin.hide()
	})
}
const buyLottery = resolve => {
	Spin.show();
	require.ensure(['@/components/content/buy_lottery/buy_lottery'], () => {
		resolve(require('@/components/content/buy_lottery/buy_lottery'));
		Spin.hide()
	})
}
const lottery = resolve => {
	// Spin.show();
	require.ensure(['@/components/content/lottery/lottery'], () => {
		resolve(require('@/components/content/lottery/lottery'));
		Spin.hide()
	})
}
const active = resolve => {
	Spin.show();
	require.ensure(['@/components/content/active/active'], () => {
		resolve(require('@/components/content/active/active'));
		Spin.hide()
	})
}
// const activeDetail = resolve => {
//   Spin.show();
//   require.ensure(['@/components/content/active/detail'], () => {resolve(require('@/components/content/active/detail'));Spin.hide()})
// }
const phoneBuy = resolve => {
	Spin.show();
	require.ensure(['@/components/content/phone_buy/phone_buy'], () => {
		resolve(require('@/components/content/phone_buy/phone_buy'));
		Spin.hide()
	})
}
const notice = resolve => {
	Spin.show();
	require.ensure(['@/components/content/notice/notice'], () => {
		resolve(require('@/components/content/notice/notice'));
		Spin.hide()
	})
}
const noticeDetail = resolve => {
	Spin.show();
	require.ensure(['@/components/content/notice/notice_detail'], () => {
		resolve(require('@/components/content/notice/notice_detail'));
		Spin.hide()
	})
}
const trend = resolve => {
	Spin.show();
	require.ensure(['@/components/content/trend/trend'], () => {
		resolve(require('@/components/content/trend/trend'));
		Spin.hide()
	})
}
const trendDetail = resolve => {
	Spin.show();
	require.ensure(['@/components/content/trend/trend_detail'], () => {
		resolve(require('@/components/content/trend/trend_detail'));
		Spin.hide()
	})
}
const register = resolve => {
	Spin.show();
	require.ensure(['@/components/content/register/register'], () => {
		resolve(require('@/components/content/register/register'));
		Spin.hide()
	})
}
const login = resolve => {
	Spin.show();
	require.ensure(['@/components/content/login/login'], () => {
		resolve(require('@/components/content/login/login'));
		Spin.hide()
	})
}
const personalCenter = resolve => {
	Spin.show();
	require.ensure(['@/components/content/personal_center/personal_center'], () => {
		resolve(require('@/components/content/personal_center/personal_center'));
		Spin.hide()
	})
}
const freeTrial = resolve => {
	Spin.show();
	require.ensure(['@/components/content/free_trial/free_trial'], () => {
		resolve(require('@/components/content/free_trial/free_trial'));
		Spin.hide()
	})
}
const helpCenter = resolve => {
	Spin.show();
	require.ensure(['@/components/content/helpcenter/helpcenter'], () => {
		resolve(require('@/components/content/helpcenter/helpcenter'));
		Spin.hide()
	})
}
const role = resolve => {
	Spin.show();
	require.ensure(['@/components/content/role/role'], () => {
		resolve(require('@/components/content/role/role'));
		Spin.hide()
	})
}
const newsDetail = resolve => {
	Spin.show();
	require.ensure(['@/components/content/news_detail/news_detail'], () => {
		resolve(require('@/components/content/news_detail/news_detail'));
		Spin.hide()
	})
}
const newsList = resolve => {
	Spin.show();
	require.ensure(['@/components/content/news_list/news_list'], () => {
		resolve(require('@/components/content/news_list/news_list'));
		Spin.hide()
	})
}

const redPacket = resolve => {
	Spin.show();
	require.ensure(['@/components/content/red_packet/red_packet'], () => {
		resolve(require('@/components/content/red_packet/red_packet'));
		Spin.hide()
	})
}

const another = resolve => {
	Spin.show();
	require.ensure(['@/components/content/personal_center/child_modal/recharge/Another'], () => {
		resolve(require('@/components/content/personal_center/child_modal/recharge/Another'));
		Spin.hide()
	})
}


Vue.use(Router)

export default new Router({
	// mode: 'history',
	routes: [{
		path: '/',
		name: 'layout',
		component: layout,
		redirect: '/home',
		children: [{
			path: '/home',
			name: 'home',
			component: home
		},
		{
			path: '/buyLottery/:id',
			name: 'buyLottery',
			component: buyLottery
		},
		{
			path: '/lottery',
			name: 'lottery',
			component: lottery
		},
		{
			path: '/active',
			name: 'active',
			component: active
		},
		// {
		//   path: '/active_detail/:id',
		//   name: 'active_detail',
		//   component: activeDetail
		// },
		{
			path: '/phoneBuy',
			name: 'phone_buy',
			component: phoneBuy
		},
		{
			path: '/notice',
			name: 'notice',
			component: notice
		},
		{
			path: '/noticeDetail/:id',
			name: 'notice_detail',
			component: noticeDetail
		},
		{
			path: '/trend',
			name: 'trend',
			component: trend
		},
		{
			path: '/trendDetail/:id',
			name: 'trend_detail',
			component: trendDetail
		},
		{
			path: '/register',
			name: 'register',
			component: register
		},
		{
			path: '/login',
			name: 'login',
			component: login
		},
		{
			path: '/personalCenter/:id',
			name: 'personalCenter',
			component: personalCenter
		},
		{
			path: '/freeTrial',
			name: 'free_trial',
			component: freeTrial
		},
		{
			path: '/helpcenter/:id',
			name: 'helpcenter',
			component: helpCenter
		},
		{
			path: '/role/:id',
			name: 'role',
			component: role
		},
		{
			path: '/newsDetail/:id',
			name: 'newsDetail',
			component: newsDetail
		},
		{
			path: '/newsList/:id',
			name: 'newsList',
			component: newsList
		},
		{
			path: '/redPacket',
			name: 'redPacket',
			component: redPacket
		},

		]
	},
	{
		path: '/another',
		name: 'another',
		component: another
	},
	{
		path: '*',
		name: '404',
		component: notFound
	}
	]
})