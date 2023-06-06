const Web3 = require("web3");
const Verify = require("./contracts/Verify.json");
const addressContract = "0x261cf7Fe96355Ae6C8575545f2D07571202bC795";
const addressUSer = "0x6eE624DaB5FcEc9f6B2DCbcEe005930d4B944eDb";
const privateKey =
  "f3b6295c6ba5c4c6b0b337a881a31b6e2a0fef2cf969df2997c7e7820537fcfb";
const web3 = new Web3(
  "https://rpc-mumbai.maticvigil.com/v1/cd0ce6d1685d6a2b4656ebc71e8aa6e63ce33957"
);
const instance = new web3.eth.Contract(Verify.abi, addressContract);

async function createTransaction(tx) {
  const data = tx.encodeABI();
  const gas = await tx.estimateGas({
    from: addressContract,
  });
  const gasPrice = await web3.eth.getGasPrice();
  const nonce = await web3.eth.getTransactionCount(addressUSer, "latest");
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

async function getTrx(id) {
  const data = await instance.methods.getTrx(id).call();
  console.log(data);
  return data;
}

async function createPurchase(id, code, data) {
  const tx = instance.methods.setTrx(id, code, data);
  const receipt = await createTransaction(tx);
  console.log(receipt);
}

// createPurchase(
//   '1',
//   'ZZW8EPBNE',
//   'Pagare:199|VALUE:10000|DATE|06-03-2023',
// )

createPurchase(
  "1",
  "WJJ9Q6WK4E",
  "COMPESAR|NAME:Santiago Montoya|DATE:14-04-2024"
  //'PAGARE:001|NAME:Cristian Camilo Sandoval Torres|IDENTIFICATION:****8153|DATE:07-03-2023|VALUE:10000|ACTION:FILL',
);
// getTrx('1')
