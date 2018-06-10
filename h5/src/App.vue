<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import '@/resource/css/icon/iconfont.css';
import '@/resource/css/mint.css'
import '@/resource/css/css.less'
export default {
    name: 'App',
    mounted () {
        let iphoneD = false
        var browser = {
            versions: function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {//移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
            this.$store.commit('iphoneD', true)
            iphoneD = true
        }
        if (iphoneD) return
        let body = $('body')[0]
        let moveLeft = 0
        let routerChange = false
        body.addEventListener('touchstart', (e) => {
            moveLeft = e.changedTouches[0].clientX
        })
        body.addEventListener('touchmove', (e) => {
            moveCalc(e.changedTouches[0])
        })
        body.addEventListener('touchend', (e) => {
            routeArrive()
        })
        let moveCalc = (obj) => {
            if ((obj.clientX - moveLeft) > 230) {
                routerChange = true
            }
        }
        let routeArrive = () => {
            if (routerChange) {
                this.$router.go(-1)
                routerChange = false
            }
        }
    }
    // mounted () {
    //       // 判断是不是苹果手机 阻止双击放
    //       var browser = {
    //           versions: function () {
    //               var u = navigator.userAgent, app = navigator.appVersion;
    //               return {//移动终端浏览器版本信息
    //                   trident: u.indexOf('Trident') > -1, //IE内核
    //                   presto: u.indexOf('Presto') > -1, //opera内核
    //                   webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    //                   gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
    //                   mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
    //                   ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    //                   android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
    //                   iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
    //                   iPad: u.indexOf('iPad') > -1, //是否iPad
    //                   webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    //               };
    //           } (),
    //           language: (navigator.browserLanguage || navigator.language).toLowerCase()
    //       }
    //       if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
    //           // document.addEventListener('touchend', function (event) {
    //           //     event.preventDefault();
    //           //     $(event.target).trigger('click');
    //           // }, false); 

    //           let preLastTouchStartAt = 0; 
    //           let lastTouchStartAt = 0; 
    //           const delay = 500; 
    //           document.addEventListener('touchstart', () => { 
    //               preLastTouchStartAt = lastTouchStartAt;
    //               lastTouchStartAt = +new Date(); 
    //           }); 
    //           document.addEventListener('touchend', (event) => { 
    //               const touchEndAt = +new Date(); 
    //               if (touchEndAt - preLastTouchStartAt < delay) { 
    //                   event.preventDefault(); 
    //                   event.target.click(); 
    //               } 
    //           }); 
    //       }
    //   }
}
</script>
