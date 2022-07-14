
import { request } from "express";
import { response } from "express";

import db from '../config/database.js';


//Consulta de todas las provincias.
////http://ip:port/provincias
const provincias= async(req=request,res=response)=>{
    const database=db.getDB();
    const options={
        projection:{
            "_id":0,
            "nombre":0,
            "capital_regional":0,
            "region_iso_3166_2":0,
            "provincias.nombre":1,
            "provincias.codigo":1,
            "provincias.capital_provincial":1,
            "provincias.comunas.$":1
        }

    }
    const query=await database.collection('regions').find({},options);
    query.toArray((err,docs)=>{
        const provincias=[];
        docs.map((x)=>{
            provincias.push(...x.provincias);
        })
        res.status(200).json(provincias);
    })
}


//Consulta de provincia.
////http://ip:port/provincias/{codigoProvincia}
const provinciaCodigo = async (req=request,res=response)=>{
    const codProvincia=req.params.codigoProvincia;
    const database=db.getDB();
    const options={
        projection:{
            "_id":0,
            "nombre":0,
            "capital_regional":0,
            "region_iso_3166_2":0,     
        }
    }
    const query=await database.collection('regions').findOne({"provincias.codigo":codProvincia},options);
    
    const provincia=query.provincias.find((provincia)=>{
        return provincia.codigo===codProvincia;
    });
    
    res.status(200).json(provincia);
}

//Consulta de las comunas de una provincia.
////http://ip:port/provincias/{codigoProvincia}/comunas

const provinciaComunas=async(req=request,res=request)=>{
    const codigoProvincia=req.params.codigoProvincia;
    const database=db.getDB();
    const options={
        projection:{
            "_id":0,
            "nombre":0,
            "capital_regional":0,
            "region_iso_3166_2":0,     
        }
        
    }

    const query=await database.collection('regions').findOne({"provincias.codigo":codigoProvincia},options);
    
    const comunas=query.provincias.find((provincia)=>{
        return provincia.codigo===codigoProvincia;
    })?.comunas;
    
    res.status(200).json(comunas);
    
}

//Consulta de una comuna de una provincia.
////http://ip:port/provincias/{codigoProvincia}/comunas/{codigoComuna}
const comunaProvincia=async(req=request,res=response)=>{
    const codigoProvincia=req.params.codigoProvincia;
    const codigoComuna=req.params.codigoComuna;

    const database=db.getDB();
    const options={
        projection:{
            "_id":0,
            "nombre":0,
            "capital_regional":0,
            "region_iso_3166_2":0,     
        }
        
    }

    const query=await database.collection('regions').findOne({"provincias.codigo":codigoProvincia,"provincias.comunas.codigo":codigoComuna},options);
    
    const comunasProvincia=query.provincias.find((provincia)=>{
        return provincia.codigo===codigoProvincia;
    }).comunas;

    const comunaBuscada=comunasProvincia.find((comuna)=>{
        return comuna.codigo===codigoComuna;
    })
    

    res.status(200).json(comunaBuscada);
}


export {
    provincias,
    provinciaCodigo,
    provinciaComunas,
    comunaProvincia
}