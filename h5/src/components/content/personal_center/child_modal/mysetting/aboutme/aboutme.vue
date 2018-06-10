<template>
    <div class="aboutme">
        <my-header title="关于我们" bkUrl="/mysetting">
        </my-header>
        <div class="about-body">
            <div class="item">
                <p class="tit">一. 关于{{$configText.main}}彩票网络平台</p>
                <p class="cont">
                    {{$configText.main}}彩票网络平台作为华人首选购彩平台，我们时时刻刻把对每一位客户的承诺放在第一位，自成立以来一直深受全世界玩家信赖，良好的信誉和口碑让我们不断前进。我们为每一位客户提供最安全、最公平、最专业的博彩游戏，以及全方位的服务。我们承诺，所有游戏结果公平、公正、公开！
                </p>

            </div>
            <div class="item">
                <p class="tit">二. 多样化游戏</p>
                <p class="cont">
                    24小时营运多样化彩种，时时彩、11选5、北京赛车、福彩3D、以及香港特区六合彩，多款彩票投注与即时彩票开奖资讯，满足各类玩家需求。
                </p>

            </div>
            <div class="item">
                <p class="tit">三. 帐户与资金</p>
                <p class="cont">
                    玩家出入款帐户资料必须有玩家唯一的登录ID和密码，确保客户的资金安全有保障。同时也采用先进的加密措施来保证玩家的游戏安全，7×24小时的后台检测和监控，确保我们可以提供一个完全公正和安全的网络游戏空间。客户在本平台的所有活动均严格保密，我们绝不会向第三方（包括政府）透露客户资料。
                </p>

            </div>
            <div class="item">
                <p class="tit"> 四. 客户服务</p>
                <p class="cont">
                    在竞争激烈的博彩市场中，{{$configText.main}}彩票网络平台向来是众多玩家一致的明理选择，除了有多样化的彩种和玩法使人流连忘返、更有良好信誉在广大彩票玩家群众之间建立了口碑。
                </p>
                <div class="cont">
                    <p class="t"> 我们为客户提供最专业的娱乐服务：</p>
                    <p>1、365天×24小时专业的客户服务，全天候处理会员出入款的相关事宜，严格训练的客服团队，以专业、亲切的态度，让每位玩家有宾至如归的感觉!</p>
                    <p>2、多渠道的与客户的互动交流，了解客户的需求，随时关注客户的意见及建议； </p>
                    <p>3、举办更多的优惠及促销活动，给客户提供更多的回馈及惊喜。 {{$configText.main}}彩票平台将推出更多、更给力的优惠活动回馈我们的新老会员。 实力品牌信誉，首选{{$configText.main}}彩票网络平台！</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import encryption from "@/components/common/module_js/md5";
export default {
    data () {
        return {};
    },
    methods: {}
};
</script>

<style scoped>
.logo {
    display: block;
    margin: 20px auto 20px;
    width: 20%;
    float: none;
}
.about-body {
    padding: 20px 20px;
}
.about-body .item {
}
.about-body .item .tit {
    margin: 10px 0;
    color: #333;
    font-size: 16px;
    font-weight: bold;
}
.about-body .item .cont {
    text-indent: 24px;
    color: #666;
}
.about-body .item .cont .t {
    margin-bottom: 5px;
    font-weight: bold;
}
.about-body .item .cont p {
    margin: 5px 0;
}
</style>