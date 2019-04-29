var Contest = artifacts.require("./Contest.sol");

contract("Contest", function(accounts) {
    //check if getting initialized correctly
    it("initializes with two contestants", function(){
        return Contest.deployed().then(function(instance){
            return instance.contestantCount();
        }).then(function(count){
            assert.equal(count, 2);
        });
    });

    it("it initializes the contestants with the correct values", function() {
        return Contest.deployed().then(function(instance) {
          contestInstance = instance;
          return contestInstance.contestants(1);
        }).then(function(contestant) {
          assert.equal(contestant[0], 1, "contains the correct id");
          assert.equal(contestant[1], "Namo", "contains the correct name");
          assert.equal(contestant[2], 0, "contains the correct vote count");
          return contestInstance.contestants(2);
        }).then(function(contestant) {
          assert.equal(contestant[0], 2, "contains the correct id");
          assert.equal(contestant[1], "Raga", "contains the correct name");
          assert.equal(contestant[2], 0, "contains the correct vote count");
        });
      });

      it("allows a voter to cast a vote", function() {
        return Contest.deployed().then(function(instance) {
          contestInstance = instance;
          contestantId = 2;
          return contestInstance.vote(contestantId, { from: accounts[0] });
        }).then(function(receipt) {
          return contestInstance.voters(accounts[0]);
        }).then(function(voted) {
          assert(voted, "the voter was marked as voted");
          return contestInstance.contestants(contestantId);
        }).then(function(contestant) {
          var voteCount = contestant[2];
          assert.equal(voteCount, 2, "increments the contestant's vote count");
        });
      });


      // it("allows a voter to cast a vote", function() {
      //   return Election.deployed().then(function(instance) {
      //     electionInstance = instance;
      //     candidateId = 1;
      //     return electionInstance.vote(candidateId, { from: accounts[0] });
      //   }).then(function(receipt) {
      //     return electionInstance.voters(accounts[0]);
      //   }).then(function(voted) {
      //     assert(voted, "the voter was marked as voted");
      //     return electionInstance.candidates(candidateId);
      //   }).then(function(candidate) {
      //     var voteCount = candidate[2];
      //     assert.equal(voteCount, 1, "increments the candidate's vote count");
      //   })
      // });

});