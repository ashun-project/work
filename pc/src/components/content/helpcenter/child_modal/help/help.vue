<template>
    <div class="help-page">
        <div style="height:40px;color:grey">
            新手指南
        </div>
        <hr style="margin-bottom:20px">
        <Collapse v-model="newIndex" accordion>
            <Panel name="1">
                <span class="title" ref='slot1'>1. 在彩票网站注册要收费吗？</span>
                <div slot="content" class="pcontent">
                    <p>· 注册新用户是免费的，不收取任何费用。</p>
                    <p>· 新会员下载APP实名注册，并绑定提款银行卡，可领取10元现金筹码，盈利到18元即可提款，不充值也可赚钱。</p>
                </div>
            </Panel>
            <Panel name="2">
                <span class="title" ref='slot2'>2. 如何进行账户充值？</span>
                <div slot="content" class="pcontent">· 99彩票提供多种便捷的充值方式供您选择，包括：微信扫码支付、微信转账支付、支付宝扫码支付、支付宝转账支付、QQ钱包扫码支付、网银/手机银行转账、第三方在线支付。</div>
            </Panel>
            <Panel name="3">
                <span class="title" ref='slot3'>3. 在{{$configText.main}}彩票购彩投注合法吗？</span>
                <div slot="content" class="pcontent">
                    <p>· {{$configText.main}}彩票(官网 xwcp.com),系亚洲最大的一站式彩票投注平台， 拥有最强大的资金和技术支持，千万彩民网络购彩诚信首选。{{$configText.main}}彩票彩票和99集团强强联手， 共同打造最好的线上彩票投注品牌，一期资金7000万美金，秉承全力打造彩票界最诚信、最稳定、服务至上的服务理念，竭诚为您打造全球最有公信力 、最受玩家欢迎的在线彩票投注平台。{{$configText.main}}彩票彩票于2013年8月在英属维京群岛合法注册了博彩公司并持有菲律宾政府卡格扬经济特区颁发的线上博彩执照， 网站所提供的所有彩票投注服务由菲律宾政府卡格扬经济特区所授权和监管。公司在不断更新各种彩票种类，让客户获得更多的购彩体验。 同时在网络安全、隐私保护、客户资料以及来往记录安全等方面不遗余力，并获得国际认证，确保网站的公正性，彻底解决网络安全的后顾之忧！
                    </p>
                    <p>
                        作为专业的彩票娱乐运营商，我们承诺：为每一位客户提供最安全、最公平、全方位的购彩娱乐。{{$configText.main}}彩票彩票所有线上彩票品种共同的优点 :提供手机APP下载、结合PC端及WAP端，突破空间与时间的束缚，全天24小时体验购彩的乐趣，超高速专用通道实时同步官方开奖数据，100%保障开奖结果公平、公正、公开！{{$configText.main}}彩票彩票所有线上投注彩票品种，包括但不仅限于：北京赛车PK拾、幸运飞艇、重庆时时彩、香港六合彩、PC蛋蛋、幸运赛马、幸运扑克、安徽快三、北京快乐8、排列三、排列五、福彩3D、广东11选5、山东11选5、江西11选5、黑龙江11选5、新疆时时彩、北京时时彩、天津时时彩！
                    </p>
                    <p>
                        · {{$configText.main}}彩票不断投放大量预算在确保投注系统的安全稳定与技术创新上，我们的投注系统全方位采用128bit高安全标准的数据加密技术，此种SSL技术可确保会员的资料及投注数据在透过网络传输的过程中不被截取，因此会员的隐私都能得到严格保密，所有投注信息准多次加密存储，我们对每一项交易都会采取严格的保密和防盗防诈措施，保证会员账户的真实合法性并同时保证会员在充值及提现过程中的安全性，配合专业技术团队全天候24小时严格监控与对系统的不间断技术更新，以高安全规格的系统提供会员最安心便捷的交易体验！
                    </p>
                    <p>
                        · {{$configText.main}}彩票竭诚为所有会员提供最专业最顶级的彩票投注服务： 1、365天×24小时专业的客服服务，全天候处理会员出入款的相关事宜，严格训练的客服及财务团队，让每位玩家有宾至如归的感觉! 2、多渠道的与客户的互动交流，了解客户的需求，随时关注客户的意见及建议； 3、举办更多的优惠及促销活动，给客户提供更多的彩金回馈及红利惊喜。
                    </p>
                </div>
            </Panel>
            <Panel name="4">
                <span class="title" ref='slot4'>4. 实名注册后绑定银行卡？</span>
                <div slot="content" class="pcontent">· 为了不影响您的充值、投注和提款，注册后须在用户中心绑定银行卡，提交用户真实姓名，设置提款密码。</div>
            </Panel>
            <Panel name="5">
                <span class="title" ref='slot5'>5. 真实姓名填写错误如何修改？</span>
                <div slot="content" class="pcontent">
                    <p>一经绑定，用户本人无法直接修改真实姓名，但可以联系客服人员进行修改。操作流程如下：</p>
                    <p>· 联系客服人员（可通过电话、QQ、邮件等途径），说明修改的原因；</p>
                    <p>· 客服部收到授权后，由专员核实信息提交报告，交领导批准签字； </p>
                    <p>· 主管领导签字后，技术专员在有人监督的情况下，修改用户的错误信息。</p>
                </div>

            </Panel>
            <Panel name="6">
                <span class="title" ref='slot6'>6. 如何修改登录密码？</span>
                <div slot='content' class='pcontent'>
                    <p>修改登录密码操作流程如下:</p>
                    <p>· 登录后进入首页，点击右侧的“用户中心”。</p>
                    <p>· 在“用户中心”页面左侧“账号信息”中选择“修改密码”。</p>
                    <p>· 用户输入旧密码，并设置新密码。
                        <p/>
                        <p>· 提交信息，修改密码成功，系统提示成功信息。</p>
                </div>
            </Panel>
            <Panel name="7">
                <span class="title" ref='slot7'>7. 保证资金安全应注意哪些事项？</span>
                <div slot="content" class="pcontent">
                    <p>彩民用户必须注意自己电脑中是否有键盘记录或远程控制等木马程序，使用病毒实时监控程序和网络防火墙并注意升级更新操作系统厂商所提供的安全补丁；</p>
                    · 尽量不要在公共场所（如网吧）等登录本网站；
                    <br> · 尽量在不同场合使用有所区别的密码；
                    <br> · 牢记密码，如作记录则应妥善保管；
                    <br> · 密码不得告诉他人，包括自己的亲朋好友；
                    <br> · 在登录或网上支付密码输入时，应防止左右可疑的人窥视；
                    <br> · 预留密码时不要选用您的身份证、生日、电话、门牌、街巷、重复或连续等易被他人破译的数字。建议选用既不易被他人猜到，又方便记忆的密码；
                    <br> · 发现泄密的危险时，及时更换密码；不定期更换密码。
                    <br>
                </div>
            </Panel>
            <Panel name="8">
                <span class="title" ref='slot8'>8. 用户注册时需要注意什么？</span>
                <div slot="content" class="pcontent">
                    · 用户名一旦提交，不可更改，请选择容易记忆且安全级别高的用户名，并妥善保管。
                    <br> · 彩票中心规定按实名制销售彩票。为确保用户中奖权益，请务必注册后，在“用户中心”的“充值”页面绑定银行卡、真实姓名和提款密码
                </div>
            </Panel>
        </Collapse>
    </div>
</template>
<script>
export default {
    props: {
        index: {
            type: String
        }
    },
    data () {
        return {
            newIndex: this.index || '1'
        }
    },
    watch: {
        index (n) {
            this.newIndex = n;
        }
    }
}
</script>

<style scoped>
.help-page {
    width: 756px;
}
</style>
