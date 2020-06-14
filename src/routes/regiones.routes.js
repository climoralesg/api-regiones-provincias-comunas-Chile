import { Router } from 'express'
const router = Router();
import { connect } from '../database'
import { ObjectID } from 'mongodb'


//Todas las regiones.
////http://ip:port/regiones/
router.get('/', async (req, res) => {
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorRegiones(1, "Hubo un error en la conexion a la base de datos")
        res.json(respuesta);
    } else {
        db.collection('regions').find({},
            { projection: { "region": 1, "capital_regional": 1, "region_iso_3166_2": 1 } })
            .toArray(function (err, docs) {
                if (err) {
                    const respuesta = mensajeErrorRegiones(2, "Hubo un error en la consulta");
                    res.json(respuesta);
                } else {
                    if (docs.length == 0) {
                        const respuesta = mensajeErrorRegiones(3, "Consulta relizada, no se ha encontrado documento")
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeArray(0, "Consulta relizada", docs)
                        res.json(respuesta);
                    }
                }
            });
        db.close;
    }

});


//Region.
////http://ip:port/regiones/{identificadorRegion}
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorRegion(1, "Hubo un error en la conexion a la base de datos");
        res.json(respuesta);
    } else {
        db.collection('regions').findOne({ _id: ObjectID(id) }, { projection: { "provincias": 0 } }, function (err, doc) {
            if (err) {
                const respuesta = mensajeErrorRegion(2, "Hubo un error en la consulta");
                res.json(respuesta);
            } else {
                if (!doc) {
                    const respuesta = mensajeErrorRegion(3, "Consulta relizada, no se ha encontrado documento")
                    res.json(respuesta);
                } else {
                    const respuesta = mensaje(0, "Consulta relizada", doc)
                    res.json(respuesta);
                }
            }
        });
        db.close;
    }

});


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

function mensajeErrorRegiones(cod, resp) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,

        },
        regiones: null
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


function mensajeErrorRegion(cod, resp) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,

        },
        region: null
    }
    return estado;
}

function comunasRegionProvincia(cod, resp, info) {
    const comunas = [];
    const comuna = info.provincias.map(function (provincia) {
        const consulta = provincia.comunas.map(function (comuna) {
            comunas.push(comuna);
        });
    });

    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,

        },
        comunas
    }
    return estado;
}

function mensajeComunaRegion(cod, resp, info, cod_comuna) {
    const comuna = info.provincias.map(function (provincia) {
        const consulta = provincia.comunas.filter(
            comuna => comuna.codigo === cod_comuna
        )
        return consulta[0];
    });

    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        comuna: {
            ...comuna[0]
        }

    }
    return estado;
}



function mensajeComunas(cod, resp, info) {
    const comunas = [];
    const comuna = info.provincias.map(function (provincia) {
        const consulta = provincia.comunas.map(function (comuna) {
            comunas.push(comuna);
        });
    });

    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,

        },
        comunas
    }
    return estado;
}



function mensaje(cod, resp, info) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        region: {
            ...info
        }
    }
    return estado;
}

function mensajeArray(cod, resp, info) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        regiones: [
            ...info
        ]
    }
    return estado;
}

function mensajeProvincia(cod, resp, info) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp
        },
        provincia: {
            ...info.provincias[0]
        }
    }
    return estado;
}

function mensajeArrayProvincias(cod, resp, info) {
    const arrayDatos = [];
    for (let j = 0; j < info.provincias.length; j++) {
        arrayDatos.push(info.provincias[j]);
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