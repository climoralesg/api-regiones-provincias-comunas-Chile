import MongoClient from 'mongodb'

export async function connect(){
    try {
        const db=await MongoClient.connect(,{
            //useNewUrlParser:true,
            useUnifiedTopology: true
        });
        //const db = client.db('territoriochile');
        console.log('Base de datos conectada')
        return db;    
    } catch (error) {
        console.log(error);
    }
    

}




