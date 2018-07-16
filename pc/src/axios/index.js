import Vue from 'vue'
import store from '@/vuex'
import axios from 'axios'
import iView from 'iview';
import encryption from '@/components/common/module_js/md5.js'
Vue.prototype.$http = axios;


let url = [
    // '/api/v2/user/modifyPassword',
    // '/api/v2/lottery/betting',
    // '/api/v2/user/loginOut',
    // '/api/v2/user/queryLotUserBankInfo',
    // '/api/v2/user/findUserLoginLog',
    '/api/v2/user/update',
    // '/api/v2/user/setPayPwd',
    // '/api/v2/user/queryRechargeList',
    // '/api/v2/user/queryTakeFeeList',
    // '/api/v2/user/recharge',
    // '/api/v2/user/queryRechargeList',
    '/api/v2/user/getUsablePayTypeOld',
    // '/api/v2/user/takeFee',
    // '/api/v2/user/queryBalance',
    // '/api/v2/user/userList',
    // '/api/v2/user/queryCommpanyAccountList',
    // //before
    // '/api/v2/agent/subuser/rebate',
    // '/api/v2/betting/queryBettingInfoList',
    // '/api/v2/betting/queryBettingInfoById',
    // '/api/v2/betting/cancleBettingRecord',
    // '/api/v2/agent/subuser/list',
    // '/api/v2/user/queryUserExpandList',
    // '/api/v2/user/deleteExpand',
    // '/api/v2/user/modifyExpand',
    // '/api/v2/user/addExpand',
    // '/api/v2/user/randomExpand',
    // '/api/v2/user/expandInfo',
    // '/api/v2/agent/addSubuser',
    // '/api/v2/user/bandingBankInfo',
    // '/api/v2/agent/subuser/pc/oneReport',
    // '/api/v2/agent/subuser/pc/teamReport',
    // '/api/v2/agent/subuser/rebate/info',
    // '/api/v2/user/takeFee',
    // '/api/v2/user/updatePhone',
    // '/api/v2/user/updateEmail',
    // '/api/v2/user/queryBankFrom',
    // '/api/v2/user/queryUserMessage',
    // '/api/v2/user/getUsablePayType',
    // '/api/v2/user/recharge',
    // '/api/v2/user/signDay',
    // '/api/v2/user/sign',
    // '/api/v2/user/balanceAdnSign',
    // '/api/v2/user/get/redpacket',
    // '/api/v2/user/redpacket/me',
    // '/api/v2/user/redpacket/take',
    // '/api/v2/user/updateName',
    // '/api/v2/user/getUserPayPwd',
    // '/api/v2/cms/headImg',
    // '/api/v2/user/updateUserImg',
    // '/api/v2/agent/updateSubuser',
    // '/api/v2/rongyun/getToken'
]

axios.interceptors.request.use(function (config) {
    //在发送请求之前做某事
    let time = new Date().getTime();
    let user = localStorage.getItem('user');
    let userId = '';
    let sign = encryption.encrypt.md5(time + '##Lottery2017$$');

    // 登入后更改userID
    if (user) {
        user = JSON.parse(user)
        userId = user.userId;
    };
    // 判断需要登入后才能操作的接口并更改sign
    if (config.userId) {
        if (user) {
            sign = encryption.encrypt.md5(time + '##Lottery2017$$' + user.token)
        } else {
            config.url = '/';
            iView.Modal.error({
                title: '温馨提示',
                content: '<p>你目前还没有登入哦</p>',
                onOk: function () { // 5.3
                    localStorage.setItem('user', '');
                    store.commit('getUser', {});
                    window.location.href = '/#/login';
                }
            })
            return config;
        }

    }
    // if (url.some(item => item === config.url)) {
    //     if (user) {
    //         sign = encryption.encrypt.md5(time + '##Lottery2017$$' + user.token)
    //     } else {
    //         config.url = '/';
    //         iView.Modal.error({
    //             title: '温馨提示',
    //             content: '<p>你目前还没有登入哦</p>',
    //             onOk: function () { // 5.3
    //                 localStorage.setItem('user', '');
    //                 store.commit('getUser', {});
    //                 window.location.href = '/#/login';
    //             }
    //         })
    //         return config;                             
    //     }
    // }

    // 参数加密
    if (!config.unenc) {
        function RndNum (n) {
            let rnd = "";
            let x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
            for (let i = 0; i < n; i++) {
                let num = Math.round(Math.random() * 36);
                if (num === 36) num--;
                rnd += x.substring(num, num + 1);
            }
            return rnd;
        }
        let key = RndNum(16);

        config.headers.key = RSA(key);
        config.key = key;
        config.data = {
            body: AESEnc(key, JSON.stringify(config.data))
        };
    }

    config.headers.sign = sign;
    config.headers.timestamp = time + '';
    config.headers.userId = userId || '';
    config.headers.deviceId = 'aaaaaaaaaaaaaa';

    return config;

}, function (error) {
    //请求错误时做些事
    return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use(function (response) {
    //对响应数据做些事
    if (!response.data.code) {
        // 解密
        if (!response.config.unenc) {

            response.data = JSON.parse(AESDec(response.config.key, response.data.body));

        }
    }
    let code = response.data.code;
    if (code !== 0) {
        let errText = response.data.msg || '服务异常'
        if (code === 301 || code === 110 || code === 302 || code === 111 || code === 503 || code === 170) {
            iView.Modal.error({
                title: '温馨提示',
                content: '<p>' + errText + '</p>',
                onOk: function () {
                    window.location.href = '/#/login';
                }
            })
            store.commit('getUser', {});
            localStorage.setItem('user', '');
        } else if (code === 165) { //封盘不能投注提示框
            store.commit('getClosePie', true);
        } else if (code === 502) {
            store.commit('getNetStatus', true);
            // }else if('/api/v2/user/get/redpacket' !== response.config.url && '/api/v2/user/queryBankFrom' !== response.config.url){
        } else if (code === 303) { //ip限制
            store.commit('getIpForbid', response.data.data.url);
        } else if (!response.config.stopDialog) {
            iView.Modal.error({
                title: '请求异常',
                content: '<p>' + errText + '</p>'
            })
        }
    }
    return response;
}, function (error) {
    //请求错误时做些事
    return Promise.reject(error);
});