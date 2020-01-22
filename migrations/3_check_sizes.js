const checkSize = require('../scripts/check-size')

module.exports = async (deployer, network) => {

	let max_reached = await checkSize(artifacts);

	if(max_reached) {
		console.log('\n CONTRACT TOO BIG!')
	}

};



