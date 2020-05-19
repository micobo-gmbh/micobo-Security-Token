const truffleAssert = require('truffle-assertions')
const MicoboSecurityToken = artifacts.require('SecurityToken')

const { Role } = require('./Constants')

contract('Test Document Management', async (accounts) => {
	const doc = {
		documentName:
			'0x7465737420646f63000000000000000000000000000000000000000000000000', // 'test doc' in hex
		uri: 'google.com',
		documentHash:
			'0x678e749011f8a911f011e105c618db898a71f8759929cc9a9ebcfe7b125870ee', // 'some hash' sha256
	}

	let contracts

	before(async () => {
		contracts = {
			micoboSecurityToken: await MicoboSecurityToken.deployed(),
		}
	})

	it('cannot set Document if not DOCUMENT_EDITOR', async () => {
		await truffleAssert.fails(
			contracts.micoboSecurityToken.setDocument(
				doc.documentName,
				doc.uri,
				doc.documentHash
			)
		)
	})

	it('can set Document and read it', async () => {
		await contracts.micoboSecurityToken.addRole(
			Role.DOCUMENT_EDITOR,
			accounts[0]
		)

		await truffleAssert.passes(
			contracts.micoboSecurityToken.setDocument(
				doc.documentName,
				doc.uri,
				doc.documentHash
			)
		)

		const res = await contracts.micoboSecurityToken.getDocument(
			doc.documentName
		)

		// console.log(res)

		assert.deepEqual(res[0], doc.uri)

		assert.deepEqual(res[1], doc.documentHash)
	})
})
