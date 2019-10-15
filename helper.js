// These variables and functions helped me trouble shoot my web3.js and solidity code

let item1 = '0x616d0c91dbe9ad3bd37d62d5404e77a54bd91c9c7fb58eb2788d3bf0373bebb7'
let item2 = '0x2200da62c7240a3532e6cb28546c02a2f85012362d239f814cecb72db5841572'
let item3 = '0xe07d3bbad7db7a629e53955b88be80b1d6b1c5b0c368c5bda4a862ab8bd68e24'
let item4 = '0x4079ff530d3cfb65e89d1bac00def660437c36a8271d6cfbf861e75db983c4a3'
let item5 = '0x9061881bacf91901dc5dded374ed3755695bc8dbd7a91f442516b5894f3649fc'

const Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
let accounts = web3.eth.getAccounts((e,r) => {accounts = r; web3.eth.defaultAccount = r[0]});
let abi = [{"constant": false,	"inputs": [{"internalType": "bytes32","name": "_digitalFingerprint","type": "bytes32"}	],"name": "notarize","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [	{"internalType": "bytes32","name": "_digitalFingerprint","type": "bytes32"}	],"name": "verifyPossession",	"outputs": [{"internalType": "bool",	"name": "","type": "bool"	}],"payable": false,	"stateMutability": "nonpayable","type": "function"},{"constant": true,	"inputs": [{		"internalType": "address","name": "","type": "address"	},{"internalType": "uint256","name": "",	"type": "uint256"}],	"name": "notary","outputs": [	{"internalType": "uint256","name": "timestamp",	"type": "uint256"},	{"internalType": "bytes32","name": "digitalFingerprint",	"type": "bytes32"}	],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,	"inputs": [	{"internalType": "address","name": "",	"type": "address"}	],"name": "lengthOfDynamicArray","outputs": [	{"internalType": "uint256","name": "","type": "uint256"	}],"payable": false,	"stateMutability": "view","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,	"internalType": "bool", "name": "success","type": "bool"},{	"indexed": true,"internalType": "address","name": "notarizer",	"type": "address"}	],"name": "notarizationSuccess","type": "event"},{"anonymous": false,"inputs": [	{		"indexed": false,		"internalType": "bool",		"name": "success",		"type": "bool"	},	{		"indexed": true,		"internalType": "address",		"name": "verifier",		"type": "address"	},	{		"indexed": false,		"internalType": "uint256",		"name": "timestamp",		"type": "uint256"	}],"name": "verificationSuccess","type": "event"}]
let address = '0x203383270fc3983643bd2582f6a1ccf1e0726c69'; // ganache address = '0x15013d783fadAaA9e9d2F0e8d71C575f81a39834' ropsten address = '0x203383270fc3983643bd2582f6a1ccf1e0726c69'
let contractInstance = new web3.eth.Contract(abi, address);

let temp_data = null;
let notarize = async () => {
    contractInstance.methods.notarize(item1).send({from: web3.eth.defaultAccount})
        .once('receipt', receipt => {
            if (receipt.events.notarizationSuccess.returnValues.success) {
                console.log('Notarization successful') // include function that changes time to good UX
            } else {
                console.log('Something went wrong')
            }
        })
};

let verify = async hash => {
    contractInstance.methods.verifyPossession(hash).send({from: web3.eth.defaultAccount})
        .once('receipt', receipt => {
            if (receipt.events.verificationSuccess.returnValues.success) {
                console.log('Verification was successful. This owner of this address submitted this hash at this time', receipt.events.verificationSuccess.returnValues.timestamp)
            } else {
                console.log('Something went wrong')
            }
            //data = receipt; console.log(data)});
        })
};

let checkLength = async address => {
    contractInstance.methods.lengthOfDynamicArray(address).call()
        .then(result => console.log(result))
};

let nextBlock = async () => {
    web3.eth.sendTransaction({to: '0x4fd387Ca85c2c70Dc6B8a4bC6d4423459Df56E74', value: web3.utils.toWei('.01')})
        .once('receipt', receipt => {console.log('moved to next block')}
    );
};
