import { Server } from "./src/config/server.js";
import db from "./src/config/database.js";

import dotenv from 'dotenv'
dotenv.config()

const server=new Server();

db.connect().then(function(){
    console.log("Iniciada la conexion a Base de Datos");
    server.listen();
})