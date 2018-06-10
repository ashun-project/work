function num601(betballs) {
	if (!betballs) return 0;
	var balls = betballs.split(",");
	return balls.length;
}

function num602(betballs) {
	if (!betballs) return 0;
	var balls = betballs.split(",");
	return balls.length;
}

function num603(betballs) {
	if (!betballs) return 0;
	var balls = betballs.split(",");
	return balls.length;
}

function num604(betballs) {
	var balls = betballs.split(",");
	if (balls.length < 3) return 0;
	if (balls.length > 3) {
		return -3;
	}
	return 1;
}

function num605(betballs) {
	if (!betballs) return 0;
	var balls = betballs.split(",");
	return balls.length;
}
module.exports = {
	'601': num601,
	'602': num602,
	'603': num603,
	'604': num604,
	'605': num605
}
