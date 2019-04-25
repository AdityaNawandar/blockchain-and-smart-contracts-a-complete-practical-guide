pragma solidity 0.5.6;

//the contract

contract Contest {
    
    struct Contestant {
        uint id;
        string name;
        uint voteCount;
    }

    //mapping to fetch contestant details.
    mapping(uint => Contestant) public contestants;

    //public variable to keep count of contestants
    uint public contestantCount;

    constructor() public {
        addContestant("Namo");
        addContestant("Raga");
    }

    //function to add a contestant
    function addContestant(string memory _name) private {
        contestantCount++;
        contestants[contestantCount] = Contestant(contestantCount, _name, 0);
    }
    
}