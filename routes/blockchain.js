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

router.post("/nodes/register",(req,res,next)=>{
    if(!req.body.nodes){
        return next({status:400,message:"Invalid Nodes List"});
    }
    req.body.nodes.map(node=> blockchain.registerNode(node));
    return res.json({
        message:"New Nodes have been added",
        "total_nodes": [...blockchain.nodes]
    });
});

router.get("/nodes/resolve",(req,res,next)=>{
    let response = {}
    blockchain.resolveConflict().then(replaced=>{
        if(replaced){
            response.message = "Our Chain was replaced",
            response.new_chain = blockchain.chain
        }else{
            response.message = "Our chain is authoritative",
            response.chain = blockchain.chain
        }
        return res.json(response);
    }).catch(err=>{
        return next(err);
    })
});

module.exports = router;