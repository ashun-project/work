const regChinaChar = /[\u4E00-\u9FA5]/g;
const regNoCharNum = /[^A-Za-z0-9]/g;
const regNum = /^\d*$/;
const phone = /^1(\d){10}$/;
const chinaName = /^[^\u4E00-\u9FA5]*$/;
// const regSpace = /\s+/g;
const regQQ = /^(\d){5,16}$/;

//姓名只能为2-14位的中文字符
const str = /^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/;
// if (!str.test(this.bandingInfo.accountName)){
//     this.$Message("姓名只能为2-14位的中文字符");
//     return;
// }


export const ruleFn = {
	isUserName (value, callback) { //用户名      //注册页
		if (!value) {
			callback(new Error("请输入用户名"));
			return false
		} else if (regNoCharNum.test(value)) {
			callback(new Error('只能输入数字和字母'));
			return false
		} else if (value.length < 6 || value.length > 12) {
			callback(new Error('用户名六至十二位'));
			return false
		} else {
			callback();
			return true
		}
	},
	isPassWord (value, checkVal, checkPassWord, ruleText, callback) { //密码     //注册页写了  
		if (!value) {
			callback(new Error("请输入密码"));
			return false
		} else if (regNoCharNum.test(value)) {
			callback(new Error('只能输入数字和字母'));
			return false
		} else if (value.length < 6 || value.length > 14) {
			callback(new Error('密码六至十四位'));
			return false
		} else {
			if (checkVal !== "" && checkVal !== undefined) { //验证确认密码
				checkPassWord(ruleText);
			}
			// if(checkVal && ruleText) {
			// 	checkPassWord('ruleText');
			// }
			callback();
			return true
		}
	},
	checkPassWord (value, checkVal, callback) { //确认密码   //注册页写了
		if (!value) {
			callback(new Error('请再次输入密码'));
		} else if (value !== checkVal) {
			callback(new Error("两次输入的密码不一致"));
		} else {
			callback();
		}
	},
	isAgree (value, callback) { //同意协议       //注册页写了
		if (!value) {
			callback(new Error('请勾选我同意'));
		} else {
			callback();
		}
	},
	isOldPassWord (value, callback) { //验证旧密码  //个人中心写了
		if (!value) {
			callback(new Error("请输入旧密码"));
		} else {
			callback();
		}
	},
	isFundPassWord (value, checkVal, checkFundPassWord, ruleText, callback) { //验证资金密码
		if (!value) {
			callback(new Error('请输入新密码'));
		} else if (!regNum.test(value)) {
			callback(new Error('请输入数字'));
		} else {
			// if(checkVal !== '') {
			// 	checkFundPassWord(`${ruleText}`);
			// }
			if (checkVal && ruleText) {
				checkFundPassWord(`${ruleText}`);
			}
			callback();
		}
	},
	checkFundPassWord (value, checkVal, callback) { //核对资金密码
		if (!value) {
			callback(new Error("请再次输入密码"));
		} else if (!regNum.test(value)) {
			callback(new Error("请输入数字"));
		} else if (value !== checkVal) {
			callback(new Error("两次输入密码不一致"));
		} else {
			callback();
		}
	},
	isRealName (value, callback) { //验证真实姓名     //注册页改了
		if (!value) {
			callback(new Error("请输入姓名"));
			// this.$Message.info('请输入姓名')
		} else if (!str.test(value)) {
			callback(new Error("姓名只能为2-12位的中文字符"));
			// this.$Message.info('姓名只能为2-14位的中文字符')
		} else if (value.length < 2 || value.length > 12) {
			callback(new Error("姓名只能为2-12位的中文字符"));
		} else {
			callback();
		}
	},
	isPhoneNumber (value, callback) {    //注册页改了
		if (!phone.test(value) && value) {
			callback(new Error("手机号码填写有误"));
		} else {
			callback();
		}
	},
	isFundNumber (value, callback) { // 只能输入数字      
		if (!regNum.test(value) && value) {
			callback(new Error("只能输入数字"));
		} else {
			callback();
		}
	},
	isFundQQ (value, callback) { //注册页写了
		if (!regQQ.test(value) && value) {
			callback(new Error("QQ号码填写有误"));
		} else {
			callback();
		}
	},
	isFundIdcard (value, callback) { //注册页写了
		var regIdNo = /^((\d){14}|(\d){17})(\d|x|X)$/;
		if (!value) {
			callback(new Error("请填写身份证号"));
		} else if (!regIdNo.test(value)) {
			callback(new Error("身份证号填写有误"));
		} else {
			callback();
		}
	}
}