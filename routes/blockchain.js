const express = require("express");
const router = express.Router();
const {BlockChain} = require("../Blockchain/Blockchain");

let blockchain = new BlockChain();

router.post("/transaction/new",(req,res,next)=>{
    let required = ['sender', 'recipient', 'amount'];
    
    // Validate input
    if(!req.body) return next({status:400,message: "Invalid data"});

    for(let item of required){
        if(!req.body[item]){
            return next({status:400,message:`${item} is required`});
        }
    }
    let block = blockchain.newTransaction(req.body.sender,req.body.recipient,req.body.amount);
    return res.json({status:1, message: `Transaction will be added in the block index - ${block}`});

});

router.get("/mine",(req,res,next)=>{
    let last_proof = blockchain.lastBlock().proof;
    let proof = blockchain.proofOfWork(last_proof);
    let reward_transaction = {
        sender: "0",
        recipient: req.app.get("node_id"),
        amount: 1
    }
    // Reward The Miner
    blockchain.newTransaction(reward_transaction.sender,reward_transaction.recipient,reward_transaction.amount);
    
    // Forge New Block
    let block = blockchain.newBlock(proof);
    let response = {
        'status': 1,
        'message': "New Block Forged",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
    }
    return res.json(response);



});

router.get("/chain",(req,res,next)=>{
    let fullChain = {
        chain: blockchain.chain,
        length: blockchain.chain.length
    }
    return res.json(fullChain);
});

module.exports = router;