const fs = require('fs') ;

module.exports = async (artifacts) => {
	console.log('\n *** CONTRACT SIZES: \n')

	const LIMIT = 1024 ;
	const MAX = 24 * 1024;

	let max_reached = false;

	async function asyncForEach(array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}

	const sizes = name => {
		let abi = artifacts.require(name) ;
		let size = (abi.bytecode.length / 2) - 1 ;
		let deployedSize = (abi.deployedBytecode.length / 2) - 1 ;
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
		}
	}) ;

	return max_reached
}


