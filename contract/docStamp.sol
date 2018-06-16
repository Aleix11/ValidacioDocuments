pragma solidity ^0.4.24;

contract docStamp {

    // Document mapping contruction
    mapping(string => address) docHashMap;

    // Modifiers
    modifier nonPayable() {
        require(msg.value == 0);
        _;
    }

    // Events
    event StampDocument(uint timestamp, string indexed docHash, address indexed signer);

    // DocStamp administration
    function newStamp(string _docHash) external nonPayable {
        require(docHashMap[_docHash] == address(0) );
        docHashMap[_docHash] = msg.sender;
        emit StampDocument(block.timestamp, _docHash, msg.sender);
    }

    function getStamp(string _docHash) external view returns (address signer){
        signer = docHashMap[_docHash];
    }
}
