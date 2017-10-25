
# ExpressChain - NodeJs - Http - Implementation of basic Blockchain

Expresschain is basic implentation of Blockchain for people who are struggling hard to understand What Blockchain is basically. 

This Repository is inspired by this articly on hackernoon - https://hackernoon.com/learn-blockchains-by-building-one-117428612f46

###Running it ? 

    $ git clone https://github.com/arihantdaga/blockchain-basic-example-nodeJs.git
    $ cd blockchain-basic-example-nodeJs
    $ npm install
    $ npm start

By default port no. is 3000. So you should see server running at http://localhost:3000/

###Endpoints

 - /blockchain/transaction/new [POST] - Add a new transaction
 - /blockchain/mine [GET] - Mine a new Block
 - /blockchain/chain [GET] - Get Full chain
 - /blockchain/nodes/register [POST] - Register a new node in the blockchain network
 - /blockchain/nodes/resolve [GET] - Resolve Conflict among nodes in the network

### Tutorial 
You can refer to the original article posted on hackernoon -  https://hackernoon.com/learn-blockchains-by-building-one-117428612f46. 

### Future Plans 
Adding Database Support
