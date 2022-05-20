pragma solidity ^0.4.18;

contract Election {
    struct CandidateStructure {
        string name;
        uint voteCount;
        address CandidateAddress;
    }

    address public manager;
    CandidateStructure[] public candidates;
    mapping(address => bool) voters;

    modifier _onlyManagerAcess(){
        require(manager == msg.sender);
        _;
    }

    constructor() public{
        manager = msg.sender;
    }

    function participate(string memory name) public payable {
        CandidateStructure memory newCandidate = CandidateStructure({
            name: name,
            voteCount: 0,
            CandidateAddress: msg.sender
        });

        candidates.push(newCandidate);
    }

    function castVote(uint index) public payable{
        CandidateStructure storage candidate = candidates[index];
        require(!voters[msg.sender], "Vote already casted by user");
            candidate.voteCount++;
            voters[msg.sender] = true;
    }

    function pickWinner() public _onlyManagerAcess view  returns(string memory, address){
        CandidateStructure memory winner;
        uint largest;
        for(uint i=0 ; i< candidates.length; i++) {
            if(candidates[i].voteCount > largest) {
                candidates[i].voteCount;
                winner = candidates[i];
            }
        }
        return (winner.name, winner.CandidateAddress);
    }
}

