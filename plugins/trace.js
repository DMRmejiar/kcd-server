'use strict';
const fp = require('fastify-plugin');
const Web3 = require('web3');
const Verify = require('../contracts/Verify.json');

const web3 = new Web3(fastify.config.WEB3_URL);
const instance = new web3.eth.Contract(
	Verify.abi,
	fastify.config.POLYGON_ADDRESS_CONTRACT
);

async function createTransaction(tx) {
	const data = tx.encodeABI();
	const gas = await tx.estimateGas({
		from: fastify.config,
	});
	const gasPrice = await web3.eth.getGasPrice();
	const nonce = await web3.eth.getTransactionCount(
		fastify.config.POLYGON_ADDRESS_USER,
		'latest'
	);
	const signedTx = await web3.eth.accounts.signTransaction(
		{
			to: fastify.config.POLYGON_ADDRESS_CONTRACT,
			value: 0,
			data: data,
			gas: gas,
			gasPrice: gasPrice,
			nonce: nonce,
		},
		fastify.config.POLYGON_PRIVATE_KEY
	);
	console.log(signedTx);
	return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

module.exports = fp(async function (fastify, opts) {
	fastify.decorate('saveBlockchain', async function (record) {
		const tx = instance.methods.setTrx(1, 'code', JSON.stringify(record));
		const receipt = await createTransaction(tx);
		return receipt;
	});
});
