const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.CalculateHash();
        this.nonce = 0;
        
    }

    CalculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }

    MineBlock(difficulty)
    {
        while(this.hash.substring(0,difficulty) !== (new Array(difficulty+1).join("0")))
        {
            this.nonce++;
            this.hash =  this.CalculateHash();
           
        }
    }
}

class Blockchain
{
    constructor()
    {
        var block = this.CreateGenesisBlock();
        this.chain = [block];
        this.difficulty = 4;
    }

    CreateGenesisBlock()
    {
        var genesisBlock = new Block(0, new Date, "This is the genesis block", "0000");
        return genesisBlock;
    }

    GetLatestBlock()
    {
        var lastBlock = this.chain[this.chain.length - 1];
        return lastBlock;
    }

    AddBlock(newBlock){
        newBlock.previousHash = this.GetLatestBlock().hash;
        newBlock.MineBlock(this.difficulty);
        this.chain.push(newBlock);
    }



    IsChainValid(){
        for(var i=1; i<this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash!==currentBlock.CalculateHash())
                
            {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
            
        }
        return true;
    }
}

//create blocks
let index = 1;
let block1 = new Block(index, new Date, {myBalance : 20000}, );
index++;
let block2 = new Block(index, new Date, {myBalance : 30000});

//create blockchain
var myBlockChain = new Blockchain();

//add blocks
myBlockChain.AddBlock(block1);
myBlockChain.AddBlock(block2);

console.log(JSON.stringify(myBlockChain, null, 4));
console.log("Is the BlockChain Valid? ",   +myBlockChain.IsChainValid());
