import MongoClient from 'mongodb'
require('dotenv').config();

export async function connect() {
    try {
        const client = await MongoClient.connect(process.env.MONGO_DB_URL, {
            //useNewUrlParser:true,
            useUnifiedTopology: true
        });
        const db = client.db(process.env.DB_NAME);
        console.log('Base de datos conectada');
        return db;
    } catch (error) {
        console.log(error);
        return 1;
    }
}




