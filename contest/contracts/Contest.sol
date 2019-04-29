pragma solidity >=0.5.0;

//the contract

contract Contest {
    
    struct Contestant {
        uint id;
        string name;
        uint voteCount;
    }

    //mapping to fetch contestant details.
    mapping(uint => Contestant) public contestants;

    //
    mapping(address => bool) public voters;
    
    //public variable to keep count of contestants
    uint public contestantCount;

    event votedEvent (
        uint indexed _contestantId
    );


    constructor() public {
        addContestant("Namo");
        addContestant("Raga");
    }

    //function to add a contestant
    function addContestant(string memory _name) private {
        contestantCount++;
        contestants[contestantCount] = Contestant(contestantCount, _name, 0);
    }
    
    function vote (uint _contestantId) public {
        //restricting the person who already casted the vote
        require(!voters[msg.sender]);
        
        //require that the vote is casted to a valid contestant
        require(_contestantId > 0 && _contestantId <= contestantCount);
        
        //increase the contestant vote count
        contestants[_contestantId].voteCount ++;
        
        //set the voter's voted status to true
        voters[msg.sender] = true;

        //trigger the vote event
        emit votedEvent(_contestantId);
	}


} 