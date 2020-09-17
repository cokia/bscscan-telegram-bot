import io from 'socket.io';

export interface Dashb {
    marketcap: string;
    price: string;
    lastblock: string;
    decOpenPrice: string;
    decCurrentPrice: string;
}

export interface Block {
    b_no: string;
    b_time: string;
    b_miner: string;
    b_miner_tag: string;
    b_txns: string;
    b_mtime: string;
    b_reward: string;
}

export interface IBscscanResponse {
    dashb: Dashb;
    blocks: Block[];
    txns: any[];
}

var socket = io('wss://www.bscscan.com/wshandler');

async function findTransactionFromNewBlock(_blocknumber: string){
    console.log(_blocknumber);
}
  socket.on('connection', function(){
    socket.send("{'event':'gs'}"); 
  })

  socket.on('recMsg', function (data:IBscscanResponse) {
    //   const newBlockCount = data.blocks.length;
      data.blocks.map(function (block) {
        findTransactionFromNewBlock(block.b_no)
      });
    });

