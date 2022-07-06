import express from 'express';

import indexRoute from '../routes/index.routes.js';
import comunasRoute from '../routes/comunas.routes.js';
//const express = require('express');
//require('dotenv').config();

import dotenv from 'dotenv'
dotenv.config()


class Server{
    constructor(){
        this.port=process.env.PORT;
        this.express=express();
        this.middlewares();
        this.routes();
       
    }

    connectDatabase=async()=> {
        await connect();
    }

    middlewares=()=>{
        this.express.set('key',process.env.KEY);
        this.express.use(express.json());
        this.express.use(express.static('public'));
    }

    routes=()=>{
        this.express.use('/', indexRoute);
        this.express.use('/comunas',comunasRoute);
    }

    listen=()=>{
        this.express.listen(this.port,()=>{
            console.log("Iniciando aplicacion, puerto: ", this.port);
        })
    }
}

export {Server};
