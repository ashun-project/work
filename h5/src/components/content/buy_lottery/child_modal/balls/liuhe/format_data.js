import zodica from '@/components/common/module_js/zodica.js'

function setMant(ball) {
	let arr = [{
			label: '尾1',
			data: ['01', '11', '21', '31', '41']
		},
		{
			label: '尾2',
			data: ['02', '12', '22', '32', '42']
		},
		{
			label: '尾3',
			data: ['03', '13', '23', '33', '43']
		},
		{
			label: '尾4',
			data: ['04', '14', '24', '34', '44']
		},
		{
			label: '尾5',
			data: ['05', '15', '25', '35', '45']
		},
		{
			label: '尾6',
			data: ['06', '16', '26', '36', '46']
		},
		{
			label: '尾7',
			data: ['07', '17', '27', '37', '47']
		},
		{
			label: '尾8',
			data: ['08', '18', '28', '38', '48']
		},
		{
			label: '尾9',
			data: ['09', '19', '29', '39', '49']
		},
		{
			label: '尾0',
			data: ['10', '20', '30', '40']
		}
	]
	return arr.filter(item => ball === item.label)[0];
}

function setZodica(ball, id) {
	let arr = zodica().filter(item => ball === item.label)[0];
	if (id && id === '7012') {
		arr.data = arr.data.filter(item => item !== '49')
	}
	return arr;
}

let formatData = {
	mant: setMant,
	zodica: setZodica
}
export default formatData;
