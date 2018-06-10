function formatDate(time, type) {
	if (typeof time === 'string') {
		time = time.replace(/-/g, '/');
	}
	let date = new Date()
	if (time) {
		if (typeof time === 'object') {
			date = time
		} else if (typeof time === 'string' && time.indexOf('/') > -1) {
			date = new Date(time);
		} else {
			date = new Date(Number(time));
		}
	}
	let str = '';
	let dateArr = [date.getFullYear(), '-', date.getMonth() + 1, '-', date.getDate()];
	let timeArr = [date.getHours(), ':', date.getMinutes(), ':', date.getSeconds()];
	let timeArr2 = [date.getHours(), ':', date.getMinutes()];

	dateArr.forEach(item => {
		if (typeof item === 'number' && item < 10) item = '0' + item;
		str += item;
	})
	if (type === 'yymmddhhmmss') {
		str += ' ';
		timeArr.forEach(item => {
			if (typeof item === 'number' && item < 10) item = '0' + item;
			str += item;
		})
	}
	if (type === 'yymmddhhmm') {
		str += ' ';
		timeArr2.forEach(item => {
			if (typeof item === 'number' && item < 10) item = '0' + item;
			str += item;
		})
	}

	return str;
}

export default {
	getFormatDate: formatDate
}
