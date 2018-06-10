function randomCommon(optballs) {
	var balls = optballs.split("|");
	var index = Math.ceil(Math.random() * (balls.length - 1));
	return balls[index];
}

function random7060101(optballs) {
	var balls = optballs.split("|");
	var rnd = ["", "", "", "", "", ""];
	var rnindex1 = Math.ceil(Math.random() * (balls.length - 1));
	rnd[rnindex1 % 6] = balls[rnindex1] + "";
	/*var rnindex2 = Math.ceil(Math.random()*(balls.length - 1));
	if(rnd[rnindex2%6] != ""){//说明冲突了
		rnd[(rnindex2+1)%6] = balls[rnindex2]+"";
	}else{
		rnd[rnindex2%6] = balls[rnindex2]+"";
	}*/
	return rnd.join("|"); //返回随机的格式|大||||，表示在6个分组里大是落在第二位
}

function random7070101(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 4)
			break;
	}
	return randoms.join(",");
}

function random7070201(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 3)
			break;
	}
	return randoms.join(",");
}

function random7070301(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 3)
			break;
	}
	return randoms.join(",");
}

function random7070401(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 2)
			break;
	}
	return randoms.join(",");
}

function random7070501(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 2)
			break;
	}
	return randoms.join(",");
}

function random7070601(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 2)
			break;
	}
	return randoms.join(",");
}

function random7080101(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 2) { //2个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random() * (randomArr.length - 1));
	return randomArr[index].join(",");
}

function random7080201(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 3) { //3个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random() * (randomArr.length - 1));
	return randomArr[index].join(",");
}

function random7080301(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 4) { //4个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random() * (randomArr.length - 1));
	return randomArr[index].join(",");
}

function random7080401(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 5) { //5个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random() * (randomArr.length - 1));
	return randomArr[index].join(",");
}

function random7090101(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 2) { //2个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random() * (randomArr.length - 1));
	return randomArr[index].join(",");
}

function random7090201(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 3) { //3个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random() * (randomArr.length - 1));
	return randomArr[index].join(",");
}

function random7090301(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 4) { //4个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random() * (randomArr.length - 1));
	return randomArr[index].join(",");
}

function random7090401(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 5) { //5个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random() * (randomArr.length - 1));
	return randomArr[index].join(",");
}

function random70100101(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (balls[random] === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 5)
			break;
	}
	return randoms.join(",");
}

function random70100201(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (balls[random] === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 6)
			break;
	}
	return randoms.join(",");
}

function random70100301(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (balls[random] === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 7)
			break;
	}
	return randoms.join(",");
}

function random70100401(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (balls[random] === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 8)
			break;
	}
	return randoms.join(",");
}

function random70100501(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (balls[random] === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 9)
			break;
	}
	return randoms.join(",");
}

function random70100601(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (balls[random] === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 10)
			break;
	}
	return randoms.join(",");
}

function random70100701(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (balls[random] === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 11)
			break;
	}
	return randoms.join(",");
}

function random70100801(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (balls[random] === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists)
			randoms.push(balls[random]);
		if (randoms.length === 12)
			break;
	}
	return randoms.join(",");
}

function randomHexiao(optballs, id) {
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
	var results = [];
	var balls = optballs.split("|");
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == size) { //三个号码
			results.push(cur)
		}
	}
	var index = Math.ceil(Math.random() * (results.length - 1));
	return results[index].join(",");
}

function random70160101(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists) {
			randoms.push(random);
			randomArr.push(balls[random])
		}

		if (randoms.length === 5) {
			break;
		}
	}
	return randomArr.join(",");
}

function random70160201(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists) {
			randoms.push(random);
			randomArr.push(balls[random])
		}

		if (randoms.length === 6) {
			break;
		}
	}
	return randomArr.join(",");
}

function random70160301(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists) {
			randoms.push(random);
			randomArr.push(balls[random])
		}

		if (randoms.length === 7) {
			break;
		}
	}
	return randomArr.join(",");
}

function random70160401(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists) {
			randoms.push(random);
			randomArr.push(balls[random])
		}

		if (randoms.length === 8) {
			break;
		}
	}
	return randomArr.join(",");
}

function random70160501(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists) {
			randoms.push(random);
			randomArr.push(balls[random])
		}

		if (randoms.length === 9) {
			break;
		}
	}
	return randomArr.join(",");
}

function random70160601(optballs) {
	var randomArr = [];
	var balls = optballs.split("|");
	var randoms = [];
	while (true) {
		var isExists = false;
		var random = Math.floor(Math.random() * balls.length);
		for (var i = 0; i < randoms.length; i++) {
			if (random === randoms[i]) {
				isExists = true;
				break;
			}
		}
		if (!isExists) {
			randoms.push(random);
			randomArr.push(balls[random])
		}

		if (randoms.length === 10) {
			break;
		}
	}
	return randomArr.join(",");
}

module.exports = {
	'7010101': randomCommon,
	'7010201': randomCommon,
	'7010301': randomCommon,
	'7020101': randomCommon,
	'7020201': randomCommon,
	'7020301': randomCommon,
	'7020401': randomCommon,
	'7020501': randomCommon,
	'7020601': randomCommon,
	'7020701': randomCommon,
	'7030101': randomCommon,
	'7040101': randomCommon,
	'7040201': randomCommon,
	'7040301': randomCommon,
	'7040401': randomCommon,
	'7040501': randomCommon,
	'7040601': randomCommon,
	'7050101': randomCommon,
	'7050201': randomCommon,
	'7050301': randomCommon,
	'7050401': randomCommon,
	'7050501': randomCommon,
	'7050601': randomCommon,
	'7060101': random7060101,
	'7070101': random7070101,
	'7070201': random7070201,
	'7070301': random7070301,
	'7070401': random7070401,
	'7070501': random7070501,
	'7070601': random7070601,
	'7080101': random7080101,
	'7080201': random7080201,
	'7080301': random7080301,
	'7080401': random7080401,
	'7090101': random7090101,
	'7090201': random7090201,
	'7090301': random7090301,
	'7090401': random7090401,
	'70100101': random70100101,
	'70100201': random70100201,
	'70100301': random70100301,
	'70100401': random70100401,
	'70100501': random70100501,
	'70100601': random70100601,
	'70100701': random70100701,
	'70100801': random70100801,
	'70110101': randomCommon,
	'70110201': randomCommon,
	'70110301': randomCommon,
	'70110401': randomCommon,
	'70120301': randomHexiao,
	'70120302': randomHexiao,
	'70120401': randomHexiao,
	'70120402': randomHexiao,
	'70120501': randomHexiao,
	'70120502': randomHexiao,
	'70120601': randomHexiao,
	'70120602': randomHexiao,
	'70120701': randomHexiao,
	'70120702': randomHexiao,
	'70120801': randomHexiao,
	'70120802': randomHexiao,
	'70120901': randomHexiao,
	'70120902': randomHexiao,
	'70121001': randomHexiao,
	'70121002': randomHexiao,
	'70121101': randomHexiao,
	'70121102': randomHexiao,
	'70121201': randomHexiao,
	'70121202': randomHexiao,
	'70121301': randomHexiao,
	'70121302': randomHexiao,
	'70130101': randomCommon,
	'70130201': randomCommon,
	'70130301': randomCommon,
	'70130401': randomCommon,
	'70140101': randomCommon,
	'70140201': randomCommon,
	'70150101': randomCommon,
	'70150201': randomCommon,
	'70160101': random70160101,
	'70160201': random70160201,
	'70160301': random70160301,
	'70160401': random70160401,
	'70160501': random70160501,
	'70160601': random70160601
}
