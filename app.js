const selectFileBtn = document.getElementById('input-file');
const selectFileBtnCtm = document.getElementById('select-a-file-custom-button');
const hashBtn = document.getElementById('hash-button');
const customTxt = document.getElementById('custom-text');
const hashBtnTxt = document.getElementById('custom-text1');
const storeBtn = document.getElementById('grey-button2');
const storeHashDiv = document.getElementById('store-hash-div')
const verifyBtn = document.getElementById('grey-button3');


let abi = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_digitalFingerprint",
				"type": "bytes32"
			}
		],
		"name": "notarize",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_digitalFingerprint",
				"type": "bytes32"
			}
		],
		"name": "verifyPossession",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "notary",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "digitalFingerprint",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lengthOfDynamicArray",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "notarizer",
				"type": "address"
			}
		],
		"name": "notarizationSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "verifier",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "verificationSuccess",
		"type": "event"
	}
]

let contractInstance;

window.addEventListener('load', async () => {
	// Modern dapp browsers...
	if (window.ethereum) {
	  window.web3 = new Web3(ethereum);
	  try {
		await ethereum.enable();
		web3.eth.defaultAccount = web3.eth.accounts.givenProvider.selectedAddress;
        contractInstance = new web3.eth.Contract(abi, '0x15013d783fadAaA9e9d2F0e8d71C575f81a39834');
		// Acccounts now exposed
	  } catch (error) {
		// User denied account access...
		console.log(error);
	  }
	}
	// Legacy dapp browsers...
	else if (window.web3) {
	  window.web3 = new Web3(web3.currentProvider);
	   // Ganache contract address '0x15013d783fadAaA9e9d2F0e8d71C575f81a39834'
	}
	// Non-dapp browsers...
	else {
	  console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
	}
  });

// set up web3 provider and contract instance


// Step 1: Load file
selectFileBtnCtm.addEventListener("click", () => {
    selectFileBtn.click();
});

selectFileBtn.addEventListener('change', e => {
    
    selectFileBtnCtm.innerHTML = "FILE LOADED"
	
	customTxt.innerHTML = e.target.value;
    hashBtnTxt.innerHTML = "Ready to hash!"; 
    hashBtn.id = 'custom-button';

});

// Step 2: Hash File
hashBtn.addEventListener('click', () => {
    
    const input = selectFileBtn;
    if ('files' in input && input.files.length > 0) {

        read(input.files[0]).then(content => {
            document.getElementById('custom-text1').value = content;
            hashBtnTxt.innerHTML = web3.utils.sha3(content, { encoding: 'hex' });
        });
    }

    hashBtn.innerHTML = "FILE HASHED"
    hashBtn.id = 'grey-button';
    selectFileBtnCtm.id = 'grey-button';
    storeBtn.id = 'custom-button2';
    verifyBtn.id = 'custom-button';

}); 

// Option 1: Store Hash on Ethereum

let span;
let details;

storeBtn.addEventListener('click', async () => {
	verifyBtn.hidden = true;
    document.getElementById('or').hidden = true;
	console.log(hashBtnTxt.innerText);
	contractInstance.methods.notarize(item1).send({from: web3.eth.defaultAccount})
        .once('receipt', receipt => {
            if (receipt.events.notarizationSuccess.returnValues.success) {
				span = document.createElement('SPAN')
				details = document.createElement('SPAN')
				span.innerText = "Notarization Successful! <br> You can verify this notarization in the future by refreshing this page and using the 'Verify Possession' button.`" 
				storeHashDiv.insertAdjacentElement('afterend', span);
				details = document.createElement('SPAN')
				details.innerText = `You can verify this notarization in the future by refreshing this page and using the 'Verify Possession' button.`
				span.insertAdjacentElement('afterend', details)

				

				console.log('yeet')
            } else {
                console.log('Something went wrong')
            }
        })
});

// Option 2: Verify Possession


verifyBtn.addEventListener('click', async () => {
	contractInstance.methods.verifyPossession(hash)
		.send({from: web3.eth.defaultAccount})
        .once('receipt', receipt => {
            if (receipt.events.verificationSuccess.returnValues.success) {
				console.log('verification successful');
			} else {
                console.log('Something went wrong')
            }
            //data = receipt; console.log(data)});
        })
});

// helper function for Step 3
let checkIndex = (index) => {contractInstance.notary(web3.eth.defaultAccount, index, (e,r) => console.log(r))}

function read(file) {
    const reader = new FileReader();
    console.log('FileReader', reader);

    return new Promise((resolve, reject) => {
        reader.onload = event => {
            // Convert Array Buffer to Base16
            var u = new Uint8Array(event.target.result);
            a = new Array(u.length),
            i = u.length;
            while (i--) // map to hex
                a[i] = (u[i] < 16 ? '0' : '') + u[i].toString(16);
            u = null; // free memory
            resolve(a.join("")); 
        }
        reader.onerror = error => reject(error)
        reader.readAsArrayBuffer(file)
    });
}