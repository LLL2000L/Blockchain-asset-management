let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

// let abi=[
// 	{
// 		"constant": false,
// 		"inputs": [],
// 		"name": "getName",
// 		"outputs": [
// 			{
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"payable": false,
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"constant": true,
// 		"inputs": [
// 			{
// 				"name": "_name",
// 				"type": "string"
// 			}
// 		],
// 		"name": "setName",
// 		"outputs": [],
// 		"payable": false,
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]
// let addr='0x053DF496Fa490a42f206AA28A1D7208e6dd5deC5'

// var myContract = new web3.eth.Contract(abi, addr)

// // myContract.methods.setName('zhangsan').call((err,res)=>{
// //     console.log(err)
// //     console.log(res)
// // })

// myContract.methods.setName('lisi').send({from:'0x802C1Cde7Dd69686FCE43dFed262E37A06C12309'}).on('transactionHash', hash => {
//     console.log(hash)
// })

// myContract.methods.getName().call(null,(err,res)=>{
//     console.log(err)
//     console.log(res)
// })

var BigNumber = require("bignumber.js");
// let groupArtifact=require('../build/contracts/Group.json')
// var web3=new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8545"))
let oneCompanyArtifact = require("../build/contracts/OneCompany.json");

var abi = oneCompanyArtifact.abi;
web3.eth.net.getId().then((networkId) => {
  const oneCompanyDeployedNetwork = oneCompanyArtifact.networks[networkId];

  var contractAddress = oneCompanyDeployedNetwork.address;
  // console.log(contractAddress)
  var myContract = new web3.eth.Contract(abi, contractAddress);

  // myContract.methods.getRole("master").call(null,(err,res)=>{
  //     // console.log(res)
  // })
  // myContract.methods.getRole("master").call(null,(err,res)=>{
  //     console.log(res)
  // })

  // var balance = new BigNumber('68190559932315141266632125108232224971044441279863219359889690399086015912719')
  // // console.log(68190559932315141266632125108232224971044441279863219359889690399086015912719)
  // // console.log(web3.utils.isBigNumber(68190559932315141266632125108232224971044441279863219359889690399086015912719))
  // myContract.methods.sendAssets('0x3230e16abf612f80ecf9c435aedec63ed0602021',balance,'0x3230e16abf612f80ecf9c435aedec63ed0602021')
  // .send({from:'0x3699f3C027DFeB8FB74Ce142cC2562C159763694',gas:200000000000000000})
  // .on('transactionHash',hash=>{
  //     console.log(hash)
  // })

  // myContract.methods.getTask('0x716d17f0a45cb4233b778eac8a2f6d807946ecac').call({from:'0xabe2a35b91a404b40c1b131c25c43c46e64e3d70'},(err,res)=>{
  //     // console.log(err)
  //     console.log(res[0])
  // })

  // myContract.methods.agreeApplication('0xabe2a35b91a404b40c1b131c25c43c46e64e3d70',1,5625397477622437649232500920593836553332938363983417425061030059492752049837,1)
  // .send({from:'0x716d17f0a45cb4233b778eac8a2f6d807946ecac',gas:2000000000000})
  // .on('transactionHash',hash=>{
  //     console.log(hash)
  // })

  // myContract.methods.addRole('master','0x6cbd7da49d880dfbb8366cecebd9719f57bf43b8').send({from: '0xd8F183F16748242dE3cccd3D055Fb095CF4Bd057'})
  // .on('transactionHash',hash=>{
  //     console.log(hash)
  // })

  // myContract.methods.sendAs('0xe8eeb55948a305fe08f2bc0cf04e00e6c5b042ec',16019,'0xFF5B3b76883Ff651771fEbe6507cF2600d76E01E').send({from: '0xd8F183F16748242dE3cccd3D055Fb095CF4Bd057'})
  // .on('transactionHash',hash=>{
  //     console.log(hash)
  // })
  // // function sendAs(address _common, uint _id, address target){
  // myContract.methods.getSender().call((error,result)=>{
  //     console.log(error)
  //     console.log(result)
  // })
  // myContract.methods.

  // myContract.methods.receiveAssets(123,"a","a","a").send({from: '0xd8F183F16748242dE3cccd3D055Fb095CF4Bd057',gas:200000000})
  // .on('transactionHash',hash=>{
  //     console.log(hash)
  // })
  myContract.methods.getSender().call((error, result) => {
    console.log(result);
  });

  myContract.methods
    .getTmpStore("0x6cbd7da49D880dFbb8366cEcebd9719F57bf43B8")
    .call((error, result) => {
      // console.log(error)
      console.log(result);
    });
});
