
//Todas las comunas
//http://ip:port/comunas/
router.get('/', async (req, res) => {
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorComunas(1, "Hubo un error al conectar la base de datos")
        res.json(respuesta)
    } else {
        db.collection('regions').find({}).toArray(function (err, docs) {
            if (err) {
                const respuesta = mensajeErrorComunas(2, "Hubo un error en la consulta");
                res.json(respuesta);
            } else {
                if (docs.length == 0) {
                    const respuesta = mensajeErrorComunas(3, "Consulta realizada, no se ha encontrado documento");
                    res.json(respuesta);
                } else {
                    const respuesta = mensajeComunas(0, "Consulta realizada", docs)
                    res.json(respuesta);
                }
            }
        })
        db.close;
    }
});

//Comuna
//http://ip:port/comunas/{codigoComuna}
router.get('/:cod_comuna', async (req, res) => {
    const { cod_comuna } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeErrorComuna(1, "Hubo un error al conectar la base de datos")
        res.json(respuesta)
    } else {
        db.collection('regions').findOne({ "provincias.comunas.codigo": cod_comuna },
            { projection: { "provincias": { $elemMatch: { "comunas.codigo": cod_comuna } }, _id: 0 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeErrorComuna(2, "Hubo un error en la consulta");
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeErrorComuna(3, "Consulta realizada, no se ha encontrado documento");
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeComuna(0, "Consulta realizada", doc, cod_comuna);
                        res.json(respuesta);
                    }
                }
            })
        db.close;
    }
});


function mensajeErrorComunas(cod, resp) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp
        },
        comunas: null
    }
    return estado;
}


function mensajeErrorComuna(cod, resp) {
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp
        },
        comuna: null
    }
    return estado;
}

function mensajeComuna(cod, resp, info, cod_comuna) {
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
    const arrayDatos = [];
    const region = info.map(function (region) {
        const provincia = region.provincias.map(function (provincia) {
            const comunas = provincia.comunas.map(function (comuna) {
                arrayDatos.push(comuna);
            });
        });
    });

    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        comunas: arrayDatos

    }
    return estado;
}