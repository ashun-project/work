function random601(optballs) {
	var balls = optballs.split("|");

	var index = Math.ceil(Math.random() * (balls.length - 1));
	return balls[index] + "";
}

function random602(optballs) {
	var balls = optballs.split("|");
	var index = Math.ceil(Math.random() * (balls.length - 1));
	return balls[index] + "";
}

function random603(optballs) {
	var balls = optballs.split("|");
	var index = Math.ceil(Math.random() * (balls.length - 1));
	return balls[index] + "";
}

function random604(optballs) {
	Array.prototype.remove = function (dx) {
		if (isNaN(dx) || dx > this.length) {
			return false;
		}
		this.splice(dx, 1);
	}
	var randomArr = [];
	var balls = optballs.split("|");
	var index = Math.ceil(Math.random() * (balls.length - 1));
	randomArr.push(balls[index]);
	balls.remove(index);
	index = Math.ceil(Math.random() * (balls.length - 1));
	randomArr.push(balls[index]);
	balls.remove(index);
	index = Math.ceil(Math.random() * (balls.length - 1));
	randomArr.push(balls[index]);
	balls.remove(index);
	return randomArr.join(",");
}

function random605(optballs) {
	var balls = optballs.split("|");
	var index = Math.ceil(Math.random() * (balls.length - 1));
	return balls[index] + "";
}
module.exports = {
	'601': random601,
	'602': random602,
	'603': random603,
	'604': random604,
	'605': random605
}
