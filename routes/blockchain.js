const express = require("express");
const router = express.Router();
const {BlockChain} = require("../Blockchain/Blockchain");

let blockchain = new BlockChain();

router.post("/transaction/new",(req,res,next)=>{

});

router.get("/mine",(req,res,next)=>{
    
});

router.get("/chain",(req,res,next)=>{
    let fullChain = {
        chain: blockchain.chain,
        length: blockchain.chain.length
    }
    return res.json(fullChain);
});

module.exports = router;