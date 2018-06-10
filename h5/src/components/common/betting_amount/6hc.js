function numCommon(betballs) {
	var balls = betballs.split(",");
	if (!balls[0]) return 0;
	return balls.length;
}

function num7060101(betballs) {
	var results = [];
	var ballgroups = betballs.split("|");
	for (var i = 0; i < ballgroups.length; i++) {
		if (ballgroups[i].length > 0) {
			results.push(ballgroups[i]);
		}
	}
	return results.length >= 1 ? 1 : 0;
}

function num7070101(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	if (arr.length > 10) return -10;
	var size = 4;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num7070201(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	if (arr.length > 10) return -10;
	var size = 3;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num7070301(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	if (arr.length > 10) return -10;
	var size = 3;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num7070401(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	if (arr.length > 10) return -10;
	var size = 2;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num7070501(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	if (arr.length > 10) return -10;
	var size = 2;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num7070601(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	if (arr.length > 10) return -10;
	var size = 2;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num7080101(betballs) {
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 2) { //2个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num7080201(betballs) {
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 3) { //3个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num7080301(betballs) {
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 4) { //4个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num7080401(betballs) {
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 5) { //5个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num7090101(betballs) {
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 2) { //2个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num7090201(betballs) {
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 3) { //3个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num7090301(betballs) {
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 4) { //4个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num7090401(betballs) {
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 5) { //5个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num70100101(betballs) {
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	if (balls.length < 5) return 0; //5不中 必须选5个
	if (balls.length > 10) return -10; //5不中最多10个
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 5) { //三个号码
			results.push(cur)
		}
	}
	return results.length;
}

function num70100201(betballs) {
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	if (balls.length < 6) return 0; // 必须选6个
	if (balls.length > 10) return -10; //最多10个
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 6) { //号码个数
			results.push(cur)
		}
	}
	return results.length;
}

function num70100301(betballs) {
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	if (balls.length < 7) return 0; // 必须选7个
	if (balls.length > 10) return -10; //最多10个
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 7) { //号码个数
			results.push(cur)
		}
	}
	return results.length;
}

function num70100401(betballs) {
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	if (balls.length < 8) return 0; // 必须选8个
	if (balls.length > 11) return -11; //最多11个
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 8) { //号码个数
			results.push(cur)
		}
	}
	return results.length;
}

function num70100501(betballs) {
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	if (balls.length < 9) return 0; // 必须选9个
	if (balls.length > 12) return -12; //最多12个
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 9) { //号码个数
			results.push(cur)
		}
	}
	return results.length;
}

function num70100601(betballs) {
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	if (balls.length < 10) return 0; // 必须选10个
	if (balls.length > 13) return -13; //最多13个
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 10) { //号码个数
			results.push(cur)
		}
	}
	return results.length;
}

function num70100701(betballs) {
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	if (balls.length < 11) return 0; // 必须选11个
	if (balls.length > 13) return -13; //最多13个
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 11) { //号码个数
			results.push(cur)
		}
	}
	return results.length;
}

function num70100801(betballs) {
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	if (balls.length < 12) return 0; // 必须选12个
	if (balls.length > 14) return -14; //最多14个
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 12) { //号码个数
			results.push(cur)
		}
	}
	return results.length;
}

function numHexiao(betballs, id) {
	var size = '';
	if (id === '70120301' || id === '70120302') {
		size = 1;
	} else if (id === '70120401' || id === '70120402') {
		size = 2;
	} else if (id === '70120501' || id === '70120502') {
		size = 3;
	} else if (id === '70120601' || id === '70120602') {
		size = 4;
	} else if (id === '70120701' || id === '70120702') {
		size = 5;
	} else if (id === '70120801' || id === '70120802') {
		size = 6;
	} else if (id === '70120901' || id === '70120902') {
		size = 7;
	} else if (id === '70121001' || id === '70121002') {
		size = 8;
	} else if (id === '70121101' || id === '70121102') {
		size = 9;
	} else if (id === '70121201' || id === '70121202') {
		size = 10;
	} else if (id === '70121301' || id === '70121302') {
		size = 11;
	}
	//构建所有可能性号码组合
	var balls = betballs.split(",");
	if (!balls[0] || balls.length < size) return 0;
	if (balls.length > size) return size - size - size;
	return 1;
}

function num70160101(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	var size = 5;
	if (arr.length > 10) return -10;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num70160201(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	var size = 6;
	if (arr.length > 10) return -10;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num70160301(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	var size = 7;
	if (arr.length > 10) return -10;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num70160401(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	var size = 8;
	if (arr.length > 11) return -11;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num70160501(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	var size = 9;
	if (arr.length > 12) return -12;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

function num70160601(betballs) {
	var allResult = [];
	var arr = betballs.split(",");
	var size = 10;
	if (arr.length > 13) return -13;
	(function (arr, size, result) {
		var arrLen = arr.length;
		if (size > arrLen) {
			return;
		}
		if (size == arrLen) {
			allResult.push([].concat(result, arr))
		} else {
			for (var i = 0; i < arrLen; i++) {
				var newResult = [].concat(result);
				newResult.push(arr[i]);
				if (size == 1) {
					allResult.push(newResult);
				} else {
					var newArr = [].concat(arr);
					newArr.splice(0, i + 1);
					arguments.callee(newArr, size - 1, newResult);
				}
			}
		}
	})(arr, size, []);
	return allResult.length;
}

module.exports = {
	'7010101': numCommon,
	'7010201': numCommon,
	'7010301': numCommon,
	'7020101': numCommon,
	'7020201': numCommon,
	'7020301': numCommon,
	'7020401': numCommon,
	'7020501': numCommon,
	'7020601': numCommon,
	'7020701': numCommon,
	'7030101': numCommon,
	'7040101': numCommon,
	'7040201': numCommon,
	'7040301': numCommon,
	'7040401': numCommon,
	'7040501': numCommon,
	'7040601': numCommon,
	'7050101': numCommon,
	'7050201': numCommon,
	'7050301': numCommon,
	'7050401': numCommon,
	'7050501': numCommon,
	'7050601': numCommon,
	'7060101': num7060101,
	'7070101': num7070101,
	'7070201': num7070201,
	'7070301': num7070301,
	'7070401': num7070401,
	'7070501': num7070501,
	'7070601': num7070601,
	'7080101': num7080101,
	'7080201': num7080201,
	'7080301': num7080301,
	'7080401': num7080401,
	'7090101': num7090101,
	'7090201': num7090201,
	'7090301': num7090301,
	'7090401': num7090401,
	'70100101': num70100101,
	'70100201': num70100201,
	'70100301': num70100301,
	'70100401': num70100401,
	'70100501': num70100501,
	'70100601': num70100601,
	'70100701': num70100701,
	'70100801': num70100801,
	'70110101': numCommon,
	'70110201': numCommon,
	'70110301': numCommon,
	'70110401': numCommon,
	'70120301': numHexiao,
	'70120302': numHexiao,
	'70120401': numHexiao,
	'70120402': numHexiao,
	'70120501': numHexiao,
	'70120502': numHexiao,
	'70120601': numHexiao,
	'70120602': numHexiao,
	'70120701': numHexiao,
	'70120702': numHexiao,
	'70120801': numHexiao,
	'70120802': numHexiao,
	'70120901': numHexiao,
	'70120902': numHexiao,
	'70121001': numHexiao,
	'70121002': numHexiao,
	'70121101': numHexiao,
	'70121102': numHexiao,
	'70121201': numHexiao,
	'70121202': numHexiao,
	'70121301': numHexiao,
	'70121302': numHexiao,
	'70130101': numCommon,
	'70130201': numCommon,
	'70130301': numCommon,
	'70130401': numCommon,
	'70140101': numCommon,
	'70140201': numCommon,
	'70150101': numCommon,
	'70150201': numCommon,
	'70160101': num70160101,
	'70160201': num70160201,
	'70160301': num70160301,
	'70160401': num70160401,
	'70160501': num70160501,
	'70160601': num70160601
}
