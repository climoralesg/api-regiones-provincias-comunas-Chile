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

/*
//Provincias de region.
////http://ip:port/regiones/{identificadorRegion}/provincias
router.get('/:id/provincias', async (req, res) => {
    const { id } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorProvincias(1, "Hubo un error en la conexion a la base de datos")
        res.json(respuesta);
    } else {
        db.collection('regions').findOne({ _id: ObjectID(id) },
            { projection: { "provincias.comunas": 0 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorProvincias(2, "Hubo un error en la consulta");
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorProvincias(3, "Consulta realizada, no se ha encontrado documento",)
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeArrayProvincias(0, "Consulta realizada", doc)
                        res.json(respuesta);
                    }
                }
            });
        db.close;
    }

});

//Provincia de region.
////http://ip:port/regiones/{identificadorRegion}/provincias/{codigoProvincia}
router.get('/:id/provincia/:cod_provincia', async (req, res) => {
    const id = req.params.id;
    const cod_provincia = req.params.cod_provincia;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorProvincia(1, "Hubo un error en la conexion a la base de datos");
        res.json(respuesta);
    } else {
        db.collection('regions').findOne({ _id: ObjectID(id), "provincias.codigo": cod_provincia },
            { projection: { "provincias": { $elemMatch: { "codigo": cod_provincia } }, "provincias.comunas": 0 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorProvincia(2, "Hubo un error en la consulta");
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorProvincia(3, "Consulta realizada, no se ha encontrado documento");
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeProvincia(0, "Consulta realizada", doc)
                        res.json(respuesta);
                    }
                }
            });
        db.close;
    }

});



//Region.
////http://ip:port/regiones/{identificadorRegionCodigoIso}
router.get('/cod_iso/:cod_iso', async (req, res) => {
    const { cod_iso } = req.params;
    const codigo = cod_iso.toUpperCase();
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorRegion(1, "Hubo un error en la conexion a la base de datos")
        res.json(respuesta);
    } else {
        db.collection('regions').findOne({ region_iso_3166_2: codigo }, { projection: { "provincias": 0 } },
            function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorRegion(2, "Hubo un error en la consulta");
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorRegion(3, "Consulta realizada, no se ha encontrado documento");
                        res.json(respuesta);
                    } else {
                        const respuesta = mensaje(0, "Consulta realizada", doc)
                        res.json(respuesta);
                    }
                }
            });
        db.close;
    }

});



//Comunas de una region
////http://ip:port/regiones/{identificadorRegion}/comunas
router.get('/:id/comunas', async (req, res) => {
    const { id } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorComunas(1, "Hubo un error al conectar la base de datos");
        res.json(respuesta)
    } else {
        db.collection('regions').findOne({ _id: ObjectID(id) },
            { projection: { "provincias.comunas": 1 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeComunas(1, "Hubo un error en la conexion a la base de datos");
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorComunas(3, "Hubo un error en la conexion a la base de datos");
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeComunas(0, "Consulta realizada", doc)
                        res.json(respuesta);
                    }
                }
            })
        db.close;
    }

})


//Comunas de una region
////http://ip:port/regiones/{identificadorRegion}/comunas/{CodigoComuna}
router.get('/:id/comunas/:cod_comuna', async (req, res) => {
    const id = req.params.id;
    const cod_comuna = req.params.cod_comuna;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorComuna(1, "Hubo un error al conectar la base de datos");
        res.json(respuesta);
    } else {
        db.collection('regions').findOne({ _id: ObjectID(id) },
            { projection: { "provincias.comunas": 1 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorComuna(1, "Hubo un error en la conexion a la base de datos")
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorComuna(3, "Hubo un error en la conexion a la base de datos", null)
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeComunaRegion(0, "Consulta realizada", doc, cod_comuna)
                        res.json(respuesta);
                    }
                }
            })
        db.close;
    }
})

//Comunas de una provincia y region
////http://ip:port/regiones/{identificadorRegion}/provincias/{CodigoProvincia}/comunas
router.get('/:id/provincias/:cod_provincia/comunas', async (req, res) => {
    const id = req.params.id;
    const cod_provincia = req.params.cod_provincia;
    const db = await connect();

    if (db === 1) {
        const respuesta = mensajeErrorComunas(1, "Hubo un error al conectar la base de datos")
        res.json(respuesta)
    } else {
        db.collection('regions').findOne({ _id: ObjectID(id) },
            { projection: { "provincias": { $elemMatch: { "codigo": cod_provincia } }, "provincia.comunas": 1 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorComunas(1, "Hubo un error en la conexion a la base de datos")
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorComunas(1, "Consulta realizada")
                        res.json(respuesta);
                    } else {
                        const respuesta = comunasRegionProvincia(0, "Consulta realizada", doc)
                        res.json(respuesta);
                    }
                }
            })
        db.close;
    }
})


//Comuna de una provincia y region
////http://ip:port/regiones/{identificadorRegion}/provincias/{CodigoProvincia}/comunas/{CodigoComuna}
router.get('/:id/provincias/:cod_provincia/comunas/:cod_comuna', async (req, res) => {
    const id = req.params.id;
    const cod_provincia = req.params.cod_provincia;
    const cod_comuna = req.params.cod_comuna;
    const db = await connect();

    if (db === 1) {
        const respuesta = mensajeErrorComuna(1, "Hubo un error al conectar la base de datos", null)
        res.json(respuesta)
    } else {
        db.collection('regions').findOne({ _id: ObjectID(id) },
            { projection: { "provincias": { $elemMatch: { "codigo": cod_provincia } }, "provincia.comunas": 1 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorComuna(1, "Hubo un error en la conexion a la base de datos")
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorComuna(1, "Consulta realizada")
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeComunaRegion(0, "Consulta realizada", doc, cod_comuna)
                        res.json(respuesta);
                    }
                }
            })
        db.close;
    }
})
*/


export {
    regiones,
    region
}