import { request } from 'express';
import { response } from 'express';

import db from '../config/database.js';

//Todas las regiones.
////http://ip:port/regiones/
const regiones= async(req=request,res=response)=>{
    const database=db.getDB();
    const options={
        projection:{
        }
    }
    const query=await database.collection('regions').find({},options);
    query.toArray((err,docs)=>{
        res.status(200).json(docs);
    });
}

//Region
////http://ip:port/regiones/{identificadorRegion}
const region=async(req=request,res=response)=>{
    const codigoRegion=req.params.codigoRegion;
    const database=db.getDB();
    
    const options={
        projection:{
        }
    }
    //Pasar region_iso a minuscula
    const query = await database.collection('regions').findOne({"region_iso_3166_2":codigoRegion},options);
    res.status(200).json(query);

}

//Provincias de region.
////http://ip:port/regiones/{identificadorRegion}/provincias
const provinciaRegion=async (req=request,res=response)=>{
    const codigoRegion=req.params.codigoRegion;
    const database=db.getDB();

    const options={
        projection:{

        }
    }

    const query = await database.collection('regions').findOne({"region_iso_3166_2":codigoRegion},options);

    res.status(200).json(query.provincias);

}

//Comunas de una region.
////http://ip:port/regiones/{identificadorRegion}/comunas
const comunasRegion=async (req=request,res=response)=>{
    const codigoRegion=req.params.codigoRegion;
    const database=db.getDB();
    const comunas=[];
    const options={
        projection:{

        }
    }

    const query = await database.collection('regions').findOne({"region_iso_3166_2":codigoRegion},options);

    await query.provincias.map((provincia)=>{
        comunas.push(...provincia.comunas);
    });

    res.status(200).json(comunas);
}


export {
    regiones,
    region,
    provinciaRegion,
    comunasRegion
}