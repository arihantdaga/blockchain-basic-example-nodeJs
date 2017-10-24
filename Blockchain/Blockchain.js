const CryptoJs = require("crypto-js");
const request = require("request-promise");
const async = require("async");
const url = require("url");

// Good for Json Dumps with keys in sorted order - simmilar to python's 
// json.dumps(dict, sort_keys=True)
const stringify = require('json-stable-stringify');


class BlockChain{
    constructor(){
        this.chain = [];
        this.current_transactions = [];
        this.newBlock(100,1);
        this.nodes = new Set();
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
    registerNode(address){
        /**
         * Add a new node to the list of nodes
         * @param address: <string> Address of node. Eg. 'http://192.168.0.5:5000'
         * return: None
         */
        let hostaddress = url.parse(address);
        hostaddress = hostaddress.host;
        this.nodes.add(hostaddress);
    }
    resolveConflict(){
        /**
         * This is our Consensus Algorithm, it resolves conflicts
         * by replacing our chain with the longest one in the network.
         * @return: Promise with boolean True - if chain replaced, false if chain not replaced. 
         */
        return new Promise((resolve,reject)=>{
            let index = 1;
            let new_chain = null;
            let $this = this;
            let max_chain_length = this.chain.length;

            async.each([...this.nodes], function(node,callback){
                request({
                    uri: `http://${node}/blockchain/chain`,
                    json: true,
                    method:"GET"
                }).then(data=>{

                    if($this.isValidChain(data.chain) && data.length > max_chain_length){
                        max_chain_length = data.length;
                        new_chain = data.chain;
                    }
                    callback();
                }).catch(err=>{
                    console.log(err);
                    callback(err);    
                })
            }, function(err){
                if(err){
                    console.log("Error Occured in verifying chain");
                    console.log(err);
                    return reject(err);
                }
                if(new_chain){
                    $this.chain = new_chain;
                    return resolve(true);;
                }
                return resolve(false);;
            })
        });

        
        
    }
    isValidChain(chain){
        let index = 1;
        while (index<chain.length){
            // Check if it has a valid previous_hash

            if(chain[index].previous_hash!=this._hash(chain[index-1]))
                return false;
            
            // Check if it has a valid Prood of work
            if(!this.isValidProof(chain[index-1]["proof"], chain[index]["proof"]))
                return false;

            index+=1;

        }
        return true;

    
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
        
        return proof;
        
    }

    isValidProof(last_proof,proof){
        let hash = CryptoJs.SHA256(`${last_proof}${proof}`).toString(CryptoJs.enc.Hex);
        return hash.substr(0,4) == "0000";
    }

}
exports.BlockChain = BlockChain;
