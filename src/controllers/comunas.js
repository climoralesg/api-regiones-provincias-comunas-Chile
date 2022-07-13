import { request } from 'express';
import { response } from 'express';

import db from '../config/database.js';


//Todas las comunas
//http://ip:port/comunas/

const comunas=async (req=request,res=response)=>{
    const database=db.getDB();
    const options={
        projection:{
            "_id":0,
            "nombre":0,
            "capital_regional":0,
            "region_iso_3166_2":0,
            "provincias.nombre":0,
            "provincias.codigo":0,
            "provincias.capital_provincial":0,
            "provincias.comunas.$":1
        }
    }
    const query = await database.collection('regions').find({},options);  
    
    query.toArray((err,docs)=>{
        const comunas=[];
        docs.map((x)=>{
            x.provincias.map((provincia)=>{
                comunas.push(...provincia.comunas);
            }) 
        })
        res.status(200).json(comunas);
    })
}

//Comuna
//http://ip:port/comunas/{codigoComuna}
const selectComuna=async(req=request,res=response)=>{
    const codComuna=req.params.id;
    const database=db.getDB();
    const options={            
        projection:{"_id":0,
        "nombre":0,
        "capital_regional":0,
        "region_iso_3166_2":0,
        "provincias.nombre":0,
        "provincias.codigo":0,
        "provincias.capital_provincial":0,
    
    },
    };

    const regionCollection=database.collection('regions');
    const query = await regionCollection.find({"provincias.comunas": {$elemMatch:{"codigo":codComuna}}},options);
    query.toArray((err,docs)=>{
        
        const comuna=docs[0].provincias.map((provincia)=>{
            let comuna=provincia.comunas.filter((comuna)=>{
                if(comuna.codigo===req.params.id){
                    return comuna
                }
            });
            return comuna;
        })
        const elemento = comuna.reduce((acc, el) => acc.concat(el), [])
        console.log(elemento[0])

        res.status(200).json({respuesta:"Respuesta",datos:elemento[0]});

    });

}

export {
    comunas,
    selectComuna
}