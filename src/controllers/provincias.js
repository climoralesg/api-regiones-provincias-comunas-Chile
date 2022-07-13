
import { request } from "express";
import { response } from "express";

import db from '../config/database.js';


//Consulta de todas las provincias.
////http://ip:port/provincias
const provincias= async(req=request,res=response)=>{
    const database=db.getDB();
    const options={
        projections:{
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
const provinciaCodigo = (req=request,res=response)=>{
    const codProvincia=req.params.codigoProvincia;
    
}


/*
router.get('/:cod_provincia', async (req, res) => {
    const { cod_provincia } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorProvincia(1, "Hubo un error en la conexion a la base de datos", null)
        res.json(respuesta);
    } else {
        db.collection('regions').findOne({ "provincias.codigo": cod_provincia }, {
            projection: { "provincias": { $elemMatch: { "codigo": cod_provincia } }, "provincias.comunas": 0 }
        }, function (err, doc) {
            if (err) {
                const respuesta = mensajeErrorProvincia(2, "Hubo un error en la consulta");
                res.json(respuesta);
            } else {
                if (!doc) {
                    const respuesta = mensajeErrorProvincia(3, "Consulta realizada, no se ha encontrado documento")
                    res.json(respuesta);
                } else {
                    const respuesta = mensajeProvincia(0, "Consulta relizada", doc)
                    res.json(respuesta);
                }
            }
        })
        db.close;
    }

});

//Consulta de las comunas de una provincia.
////http://ip:port/provincias/{codigoProvincia}/comunas
router.get('/:cod_provincia/comunas', async (req, res) => {
    const { cod_provincia } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeArrayComunas(1, "Hubo un error al conectar la base de datos");
        res.json(respuesta)
    } else {
        db.collection('regions').findOne({ "provincias.codigo": cod_provincia },
            { projection: { "provincias": { $elemMatch: { "codigo": cod_provincia } }, "provincias.comunas": 1, _id: 0 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorComunas(2, "Hubo un error en la consulta");
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorComunas(3, "Consulta realizada, no se ha encontrado documento", null);
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeComunas(0, "consulta realizada", doc)
                        res.json(respuesta);
                    }
                }
            })
        db.close;
    }
})

//Consulta de una comuna de una provincia.
////http://ip:port/provincias/{codigoProvincia}/comunas/{codigoComuna}
router.get('/:cod_provincia/comunas/:cod_comuna', async (req, res) => {
    const cod_provincia = req.params.cod_provincia;
    const cod_comuna = req.params.cod_comuna;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorComuna(1, "Hubo un error al conectar la base de datos")
        res.json(respuesta)
    } else {
        db.collection('regions').findOne({ "provincias.codigo": cod_provincia },
            { projection: { "provincias": { $elemMatch: { "codigo": cod_provincia } }, "provincias.comunas": 1, _id: 0 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorComuna(2, "consulta realizada, hubo un error en la consulta");

                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorComuna(3, "Consulta realizada, no se ha encontrado documento");
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeComuna("consulta realizada", doc, cod_comuna);
                        res.json(respuesta);
                    }
                }
            })
        db.close;
    }

})


function mensajeErrorComunas(cod, resp) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        comunas: null
    }
    return estado;
}


function mensajeErrorComuna(cod, resp) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        comuna: null
    }
    return estado;
}

function mensajeErrorProvincia(cod, resp) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        provincia: null
    }
    return estado;
}

function mensajeErrorProvincias(cod, resp) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        provincias: null
    }
    return estado;
}


function mensajeProvincia(cod, resp, info) {

    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        provincia: {
            ...info.provincias[0]
        }


    }
    return estado;
}

function mensajeComuna(resp, info, cod_comuna) {

    const comuna = info.provincias.map(function (provincia) {
        const consulta = provincia.comunas.filter(
            comuna => comuna.codigo === cod_comuna
        )
        return consulta[0];
    });


    if (comuna[0] == null || comuna[0] == undefined) {
        const estado = {
            estado: {
                codigo: 2,
                respuesta: "no se encontro la busqueda, verifique la comuna",
            },
            comuna: null

        }
        return estado;

    } else {
        const estado = {
            estado: {
                codigo: 0,
                respuesta: resp,
            },
            comuna: {
                ...comuna[0]
            }

        }
        return estado;
    }

}


function mensajeComunas(cod, res, info) {
    const comunas = [];
    const comuna = info.provincias.map(function (provincia) {
        const consulta = provincia.comunas.map(function (comuna) {
            comunas.push(comuna);
        });
    });
    const estado = {
        estado: {
            codigo: cod,
            respuesta: res,

        },
        comunas
    }
    return estado;
}

function mensajeProvincias(cod, resp, info) {
    const arrayDatos = [];
    for (let i = 0; i < info.length; i++) {
        for (let j = 0; j < info[i].provincias.length; j++) {
            arrayDatos.push(info[i].provincias[j]);
        }

    }
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        }, provincias: [
            ...arrayDatos
        ]

    }
    return estado;
}


export default router;
*/

export {
    provincias,
    provinciaCodigo
}