import { Router } from 'express'
const router = Router();
import { connect } from '../database'
import { ObjectID } from 'mongodb'


router.get('/', async (req, res) => {
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeArrayComunas(1, "Hubo un error al conectar la base de datos", null)
        console.log(respuesta);
        res.json(respuesta)
    } else {
        db.collection('regions').find({}).toArray(function (err, docs) {
            if (err) {
                const respuesta = mensajeArrayTodasComunas(2, "Hubo un error en la consulta", null);
                console.log(respuesta);
                res.json(respuesta);
            } else {
                if (docs.length == 0) {
                    const respuesta = mensajeArrayTodasComunas(3, "Consulta relizada, no se ha encontrado documento", null);
                    console.log(respuesta);
                    res.json(respuesta);
                } else {
                    const respuesta = mensajeArrayTodasComunas(0, "Consulta relizada", docs)
                    console.log(respuesta);
                    res.json(respuesta);
                }
            }
        })
    }
});

router.get('/:cod_comuna', async (req, res) => {
    const { cod_comuna } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeArrayComunas(1, "Hubo un error al conectar la base de datos", null)
        console.log(respuesta);
        res.json(respuesta)
    } else {
        db.collection('regions').findOne({ "provincias.comunas.codigo": cod_comuna },
            { projection: { "provincias": { $elemMatch: { "comunas.codigo": cod_comuna } }, _id: 0 } }, function (err, doc) {
                if (err) {
                    const respuesta = mensajeArrayTodasComunas(2, "Hubo un error en la consulta", null);
                    console.log(respuesta);
                    res.json(respuesta);
                } else {
                    if (!doc) {
                        const respuesta = mensajeArrayTodasComunas(3, "Consulta relizada, no se ha encontrado documento", null);
                        console.log(respuesta);
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeComuna(0, "Consulta realizada", doc, cod_comuna);
                        res.json(respuesta);
                    }
                }
            })
    }
});




function mensajeArrayTodasComunas(cod, resp, info) {

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
        comunas: [
            ...arrayDatos
        ]

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

export default router;