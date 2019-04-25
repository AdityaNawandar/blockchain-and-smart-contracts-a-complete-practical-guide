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

  // initWeb3: async function () {
  //   if (typeof web3 !== 'undefined') {
  //     App.web3Provider = web3.currentProvider;
  //     web3 = new Web3(web3.currentProvider);
  //   }
  //   else {
  //     //specify deault instance if no web3 instance is provided
  //     App.web3Provider = new Web3.providers.HttpProvider('http://localhost:1337');
  //     web3 = new Web3(App.web3Provider);
  //   }
  //   return App.initContract();
  // },

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

    $.getJSON("Contest.json", function(contest) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Contest = TruffleContract(contest);
      // Connect provider to interact with contract
      App.contracts.Contest.setProvider(App.web3Provider);

    //App.listenForEvents();  
    return App.render();
    


    // $.getJSON("Contest.json", function (contest) {

    //   //Instantiate a new truffle contract from the artifact
    //   App.contracts.Contest = TruffleContract(contest)
    //   //Connect provider to interact with the contract
    //   App.contracts.Contest.setProvider(App.web3Provider);
    //   return App.render();
    });

    // return App.render();
    //return App.bindEvents();
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

      for (var i = 1; i <= contestantCount; i++) {
        contestInstance.contestants(i).then(function (contestant) {
          var id = contestant[0];
          var name = contestant[1];
          var voteCount = contestant[2];

          contestantTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          contestantsResults.append(contestantTemplate);
        });

        //Render contestant results
        
      }

      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });
  },


  // bindEvents: function () {
  //   $(document).on('click', '.btn-adopt', App.handleAdopt);
  // },

  // markAdopted: function (adopters, account) {
  //   /*
  //    * Replace me...
  //    */
  // },

  // handleAdopt: function (event) {
  //   event.preventDefault();

  //   var petId = parseInt($(event.target).data('id'));

  //   /*
  //    * Replace me...
  //    */
  // }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
