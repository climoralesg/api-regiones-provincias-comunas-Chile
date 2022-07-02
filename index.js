import { Server } from "./src/config/server.js";
//import db from "./src/config/database";

import dotenv from 'dotenv'
dotenv.config()

const server=new Server();

server.listen();