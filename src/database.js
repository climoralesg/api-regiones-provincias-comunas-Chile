import MongoClient from 'mongodb'
require('dotenv').config();

export async function connect(){
    try {        
        const db=await MongoClient.connect(process.env.Mongo_DB,{
            //useNewUrlParser:true,
            useUnifiedTopology: true
        });
        //const db = client.db('territoriochile');
        console.log('Base de datos conectada');
        return db;    
    } catch (error) {
        console.log(error);
    }
    

}




