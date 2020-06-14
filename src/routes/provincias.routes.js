import { Router } from 'express'
import { connect } from '../database'
const router = Router();


//Todas las provincias.
////http://ip:port/provincias/
router.get('/', async (req, res) => {
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorProvincias(1, "Hubo un error en la conexion a la base de datos")
        res.json(respuesta);
    } else {
        db.collection('regions').find({},
            { projection: { "provincias.nombre": 1, "provincias.codigo": 1, _id: 1 } })
            .toArray(function (err, docs) {
                if (err) {
                    const respuesta = mensajeErrorProvincias(2, "Hubo un error en la consulta");
                    res.json(respuesta);
                } else {
                    if (docs.length == 0) {
                        const respuesta = mensajeErrorProvincias(3, "Consulta realizada, no se ha encontrado documento");
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeProvincias(0, "Consulta realizada", docs)
                        res.json(respuesta);
                    }
                }
            });
        db.close;
    }

});


//Consulta de provincia.
////http://ip:port/provincias/{codigoProvincia}
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