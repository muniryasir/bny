/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';

import {
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
  } from "@solana/web3.js"
  import { readFileSync } from "fs"
  import lo from "@solana/buffer-layout"
  import BN from "bn.js"
// import 'ws';
// function readKeypairFromPath(path: string) : anchor.web3.Keypair {
//     const data = JSON.parse(readFileSync(path, "utf-8"))
//     return anchor.web3.Keypair.fromSecretKey(Buffer.from(data))
//   }

function readKeypairFromPath(path: string): Keypair {
    const data = JSON.parse(readFileSync(path, "utf-8"))
    return Keypair.fromSecretKey(Buffer.from(data))
  }

interface Post {
    userId: Number;
    id: Number;
    title: String;
    body: String;
}

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    let posts: [Post] = result.data;
    
    // const socket = io("ws://api.serum-vial.dev/v1/ws", {});   
    // // socket.connected
    // socket.on("connect", () => {
    //     console.log(`connect ${socket.id}`);
    // });
    // console.log('con '+JSON.stringify(socket.connected));
    const file = readFileSync('/home/blockchain/orderbook/output.txt', 'utf-8');
    console.log(file);
    return res.status(200).json({
        message: JSON.stringify(file)
    });
      
      
    
};

// getting a single post
const execute_contract = async (req: Request, res: Response, next: NextFunction) => {
   
  
    const programKeypair = readKeypairFromPath("/home/blockchain/TradeContract/02__transfer-lamports/program/target/deploy/program-keypair.json")
    const aliceKeypair = readKeypairFromPath("/home/blockchain/TradeContract/02__transfer-lamports/wallets/alice.json")
    const bobKeypair = readKeypairFromPath("/home/blockchain/TradeContract/02__transfer-lamports/wallets/bob.json")
    const connection = new Connection("http://localhost:8899", "confirmed")
  
    // encode 0.5 SOL as an input_data
    const data = Buffer.alloc(8)
    // lo.ns64("value").encode(Number(new BN("500")), data)
  
    const ix = new TransactionInstruction({
      keys: [
        { pubkey: aliceKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: bobKeypair.publicKey, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: programKeypair.publicKey,
      data: data,
    })
    const resT = await sendAndConfirmTransaction(connection, new Transaction().add(ix), [aliceKeypair])
    console.log(res)
    return res.status(200).json({
        message: "This works"
    });
};

// updating a post
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req.params
    let id: string = req.params.id;
    // get the data from req.body
    let title: string = req.body.title ?? null;
    let body: string = req.body.body ?? null;
    // update the post
    let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        ...(title && { title }),
        ...(body && { body })
    });
    // return response
    return res.status(200).json({
        message: response.data
    });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    let id: string = req.params.id;
    // delete the post
    let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    // return response
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};

// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    let title: string = req.body.title;
    let body: string = req.body.body;
    // add the post
    let response: AxiosResponse = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
        title,
        body
    });
    // return response
    return res.status(200).json({
        message: response.data
    });
};

export default { getPosts, execute_contract, updatePost, deletePost, addPost };