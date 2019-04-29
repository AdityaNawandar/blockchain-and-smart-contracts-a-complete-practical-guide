//header("Access-Control-Allow-Origin: *");

App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  // init: async function () {
  //   return await App.initWeb3();
  // },

  init: function () {
    return App.initWeb3();
  },


  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else {
      //specify deault instance if no web3 instance is provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    //
    return App.initContract();
  },



  initContract: function () {

    $.getJSON("Contest.json", function (contest) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Contest = TruffleContract(contest);
      // Connect provider to interact with contract
      App.contracts.Contest.setProvider(App.web3Provider);

      App.listenForEvents();  
      return App.render();

    });
  },

  listenForEvents: function () {
    App.contracts.Contest.deployed().then(function (instance) {
      instance.votedEvent({}, { fromBlock: 0, toBlock: 'latest' }).watch(function (err, event) {
        console.log("Event triggered", event);

        //reload after a vote is recorded
        App.render();
      });
    });
  },

  render: function () {
    var contestInstance;
    var loader = $("#loader");
    var content = $("#tblContent");

    loader.show();
    content.hide();

    //Load account data
    web3.eth.getCoinbase(function (err, strAccount) {
      if (err === null) {
        //alert(strAccount)
        App.account = strAccount;
        //alert(App.account)
        $("#accountAddress").html("Your account : " + App.account);
      }
    });

    //Load contract data
    App.contracts.Contest.deployed().then(function (instance) {
      contestInstance = instance;
      return contestInstance.contestantCount();
    }).then(function (contestantCount) {
      var contestantsResults = $("#tbdyContestantResults");
      var contestantTemplate = "";
      contestantsResults.empty();

      //select contestant to vote
      var ddlSelectContestant = $("#ddlSelectContestant");
      ddlSelectContestant.empty();


      for (var i = 1; i <= contestantCount; i++) {
        contestInstance.contestants(i).then(function (contestant) {
          var id = contestant[0];
          var name = contestant[1];
          var voteCount = contestant[2];

          //load results in the table
          contestantTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          contestantsResults.append(contestantTemplate);

          //load the dropdown with contestants' list
          var contestantsList = "<option value='" + id + "'>" + name + "</option>"
          ddlSelectContestant.append(contestantsList);
        });

        //Render contestant results

      }

      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });
  },

  castVote: function () {

    var contestantId = $("#ddlSelectContestant").val();
    //alert("contestantId = " + contestantId);
    App.contracts.Contest.deployed().then(function (instance) {
      return instance.vote(contestantId, { from: App.account })
    }).then(function (result) {
      $("#loader").show();
      $("#content").hide();
    }).catch(function (err) {
      console.error(err);
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
