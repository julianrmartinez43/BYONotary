 pragma solidity ^0.5.4;

// Disclaimer!!
// This code has not received an audit by security professionals; therefore it is not ready to use.

// Purpose of BYONotary
    // This contract allows users to notarize data without a third party.
    // It allows you to be your own notary (BYONotary).

contract BYONotary {
    
    event notarizationSuccess(bool success, address indexed notarizer);
    event verificationSuccess(bool success, address indexed verifier, uint timestamp);

    struct NotarizedItem {
        uint timestamp;
        bytes32 digitalFingerprint;
    }
    
    mapping (address => NotarizedItem[]) public notary;
    // this mapping tracks the length of a dynamic array
    mapping (address => uint) public lengthOfDynamicArray;
    
    // users use this function to later prove that they owned a file at a specific time
    function notarize (bytes32 _digitalFingerprint) public {
        notary[msg.sender].push(NotarizedItem({
            timestamp: now,
            digitalFingerprint: _digitalFingerprint
        }));
        
        lengthOfDynamicArray[msg.sender]++;
        
        emit notarizationSuccess(true, msg.sender);
    }
    
    // a user can use this function to prove to a 3rd party that they possessed a file at a specific time
    
    function verifyPossession(bytes32 _digitalFingerprint) public returns(bool) {
        
        bool verified = false;
        uint timestamp; 
        
        for (uint i = 0; i < lengthOfDynamicArray[msg.sender]; i++) {
            if (notary[msg.sender][i].digitalFingerprint == _digitalFingerprint) {
                verified = true;
                timestamp = notary[msg.sender][i].timestamp;
                break;
            }
        }
        
        emit verificationSuccess(verified, msg.sender, timestamp);
    }
}
