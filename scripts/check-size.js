const fs = require('fs') ;

module.exports = async () => {
	console.log('\n *** CONTRACT SIZES: \n')

	const LIMIT = 1 ;
	const MAX = 24 * 1024;

	let max_reached = false;

	async function asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}

	const sizes = name => {
		let contract = require('../build/contracts/' + name);
		let size = (contract.bytecode.length / 2) - 1 ;
		let deployedSize = (contract.deployedBytecode.length / 2) - 1 ;
		return {name, size, deployedSize} ;
	};

	const fmt = obj => `${obj.name} ${obj.size} ${obj.deployedSize}`;

	let l = fs.readdirSync("build/contracts") ;
	await asyncForEach(l,function (f) {
		let name = f.replace(/.json/, '') ;
		let sz = sizes(name) ;
		if (sz.size >= LIMIT || sz.deployedSize >= LIMIT) {
			console.log(fmt(sz)) ;
		}
		if (sz.deployedSize >= MAX) {
			max_reached = true
			console.log('OVER MAX: ' + name + ': '  + sz)
		}
	}) ;

	return max_reached
}


