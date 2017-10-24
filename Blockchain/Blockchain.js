const CryptoJs = require("crypto-js");

// Good for Json Dumps with keys in sorted order - simmilar to python's 
// json.dumps(dict, sort_keys=True)
const stringify = require('json-stable-stringify');


class BlockChain{
    constructor(){
        this.chain = [];
        this.current_transactions = [];
        this.newBlock(100,1);
    }

    newBlock(proof,previous_hash=null){
        let block = {
            index: this.chain.length,
            timestamp : Date.now(),
            transactions: this.current_transactions,
            proof:proof,
            previous_hash : previous_hash || this._hash(this.chain[this.chain.length-1])
        };
        this.chain.push(block);
        this.current_transactions = [];
        return block;
    }

    lastBlock(){
        return this.chain[this.chain.length-1];
    }

    _hash(block){
        return CryptoJs.SHA256(stringify(block)).toString(CryptoJs.enc.Hex);
    }

    newTransaction(sender,recipient,amount){
        this.current_transactions.push({sender,recipient,amount});
        return this.lastBlock()["index"] + 1;
    }

    proofOfWork(last_proof){
        /**
         * 
         * Simple Proof of Work Algorithm:
         * - Find a number p' such that hash(pp') contains leading 4 zeroes, where p is the previous p'
         * - p is the previous proof, and p' is the new proof
         * @param last_proof :  <int>
         * :return: <int>
        */
        let proof = 0;
        while (!this.isValidProof(last_proof,proof))
            proof+=1;

        
    }

    isValidProof(last_proof,proof){
        let hash = CryptoJs.SHA256(`${last_proof}${proof}`).toString(CryptoJs.enc.Hex);
        return hash.substr(0,4) == "0000";
    }

}
exports.BlockChain = BlockChain;
