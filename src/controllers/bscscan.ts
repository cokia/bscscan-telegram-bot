/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
// import io from 'socket.io-client';
import request from 'request';
import WebSocket from 'ws';
import abiDecoder from 'abi-decoder';
import sendMessage from './telegram';
import abi from '../../abi.json';
import config from '../../config.json';
// const socket = io.connect('wss://www.bscscan.com/wshandler');
// const socket = require('socket.io-client')('wss://www.bscscan.com/wshandler');

// const socket = require('socket.io-client')('wss://www.bscscan.com/wshandler'); // 소켓 주소 설정

// const io = require('socket.io-client');

// start

const { chats } = config;
let finalblock: string = '593288';
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

export interface IBscscanWsResult {
  dashb: Dashb;
  blocks: Block[];
  txns: any[];
}

export interface Result {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

export interface IBscscanApiResult {
  status: string;
  message: string;
  result: Result[];
}

abiDecoder.addABI(abi);
const { targetContractAddress } = config;

async function telegramMessageGenerator(data:any, senderAddr:string) {
  // console.log(data);
  if (data.name === 'deposit') {
    const pair:string = data.params[0].value;
    let amount:number = Number(data.params[1].value);
    amount /= 10 ** 18;
    const payload:string = `✅ Approve to ${pair}, ${amount} by ${senderAddr}`;
    sendMessage(chats, payload);
  } else if (data.name === 'add') {
    sendMessage(chats, '‼️ ADD NEW POOL ‼️');
  } else if (data.name === 'withdraw') {
    const pair:string = data.params[0].value;
    let amount:number = Number(data.params[1].value);
    amount /= 10 ** 18;
    const payload:string = `❌ Withdraw from ${pair}, ${amount} by ${senderAddr}`;
    sendMessage(chats, payload);
  }
}

async function findTransactionFromNewBlock(endblock: string) {
  const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${targetContractAddress}&startblock=${finalblock}&endblock=${endblock}&sort=asc`;
  // console.log(`url: ${url}`);
  request(url, (err, res, body) => {
    // const resultCount = result.length;
    const bodyData:IBscscanApiResult = JSON.parse(body);
    const result = bodyData.result;
    if (result !== undefined) {
      // console.log(result);
      result.map((v:any) => {
        const data = abiDecoder.decodeMethod(v.input);
        // console.log(finalblock);
        telegramMessageGenerator(data, v.from);
        finalblock = endblock;
      });
    }
  });
}
const socket = new WebSocket('wss://www.bscscan.com/wshandler');
socket.onopen = function () {
  console.log('[open] Connection established');
  socket.send("{'event':'gs'}");
};

socket.onmessage = function (event) {
  if (event.data.toString().startsWith('{"event":"welcome -')) {
    console.log('[open] welcome message comming!');
  } else {
    console.log('message comming');
    // console.log(event);
    const data:IBscscanWsResult = JSON.parse(event.data.toString());
    if (data.blocks !== undefined || data.blocks != null) {
      data.blocks.map((block) => {
        // console.log(`blocknumber: ${block.b_no}`);
        findTransactionFromNewBlock(block.b_no);
      });
    }
    // console.log(data);
  }
};

// function heartbeat() {
//   if (!socket) return;
//   if (socket.readyState !== 1) return;
//   socket.send("heartbeat");
//   setTimeout(heartbeat, 500);
// }
