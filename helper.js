// These variables and functions helped me trouble shoot my web3.js and solidity code

let item1 = '0x616d0c91dbe9ad3bd37d62d5404e77a54bd91c9c7fb58eb2788d3bf0373bebb7'
let item2 = '0x2200da62c7240a3532e6cb28546c02a2f85012362d239f814cecb72db5841572'
let item3 = '0xe07d3bbad7db7a629e53955b88be80b1d6b1c5b0c368c5bda4a862ab8bd68e24'
let item4 = '0x4079ff530d3cfb65e89d1bac00def660437c36a8271d6cfbf861e75db983c4a3'
let item5 = '0x9061881bacf91901dc5dded374ed3755695bc8dbd7a91f442516b5894f3649fc'


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
