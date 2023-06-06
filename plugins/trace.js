'use strict';
const fp = require('fastify-plugin');

const Web3 = require('web3');
const Verify = require('../contracts/Verify.json');
const addressContract = '0x261cf7Fe96355Ae6C8575545f2D07571202bC795';
const addressUSer = '0x6eE624DaB5FcEc9f6B2DCbcEe005930d4B944eDb';
const privateKey =
	'f3b6295c6ba5c4c6b0b337a881a31b6e2a0fef2cf969df2997c7e7820537fcfb';
const web3 = new Web3(
	'https://rpc-mumbai.maticvigil.com/v1/cd0ce6d1685d6a2b4656ebc71e8aa6e63ce33957'
);
const instance = new web3.eth.Contract(Verify.abi, addressContract);

async function createTransaction(tx) {
	const data = tx.encodeABI();
	const gas = await tx.estimateGas({
		from: addressContract,
	});
	const gasPrice = await web3.eth.getGasPrice();
	const nonce = await web3.eth.getTransactionCount(addressUSer, 'latest');
	const signedTx = await web3.eth.accounts.signTransaction(
		{
			to: addressContract,
			value: 0,
			data: data,
			gas: gas,
			gasPrice: gasPrice,
			nonce: nonce,
		},
		privateKey
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
