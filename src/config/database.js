//import 'dotenv/config'
//require('dotenv').config();
import MongoClient from 'mongodb';
import dotenv from 'dotenv'
dotenv.config()


//const MongoClient=require('mongodb').MongoClient;

const url="mongodb+srv://"+process.env.USER_NAME_DB+":"+process.env.PASSWORD_DB+"@cluster0.abzm7.mongodb.net/?retryWrites=true&w=majority"
const password=process.env.PASSWORD_DB;
const user=process.env.USER_NAME_DB;
const databaseName=process.env.DB_NAME;

const connectionOptions = { poolSize: process.env.MONGO_DB_POOLSIZE || 1 };

let database;
let client;


const connect= async ()=>{
    client= await MongoClient.connect(url);
    database = client.db(process.env.DB_NAME);
}

const getDB=()=>{
    if(!database){
        throw{message:"Conexion no establecida"};
    }
    return database;
}

const closeClient=async()=>{
    client.close();
}

export default {
    connect ,
    closeClient,
    getDB
}