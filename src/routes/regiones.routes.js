import { Router } from 'express'
const router = Router();
import { connect } from '../database'
import { ObjectID } from 'mongodb'

/*
router.get('/',(req,res)=>{
    res.send('Regiones')
});
*/

router.get('/datos', async (req, res) => {
    const db = await connect();
    const busqueda = await db.collection('regions').find({}).toArray();
    res.json(busqueda);
});

router.get('/', async (req, res) => {
    const db = await connect();

    if (db === 1) {
        const respuesta = mensajeArray(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try {
            const busqueda = await db.collection('regions').find({},
                { projection: { "region": 1, "capital_regional": 1, "region_iso_3166_2": 1 } })
                .toArray().then(function (docs) {
                    if (docs.length == 0) {
                        const respuesta = mensajeArray(3, "Consulta relizada, no se ha encontrado documento", null)
                        console.log(respuesta);
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeArray(0, "Consulta relizada", docs)
                        console.log(respuesta);
                        res.json(respuesta);
                    }
                });

            //console.log(busqueda);
            //res.json(busqueda);

        } catch (error) {
            const respuesta = mensajeArray(2, "Hubo un error en la consulta", null);
            console.log(respuesta);
            res.json(respuesta);
        }

    }

});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensaje(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try {
            const busqueda = await db.collection('regions').findOne({ _id: ObjectID(id) }, { projection: { "provincias": 0 } }).then(function (doc) {
                if (!doc) {
                    const respuesta = mensaje(3, "Consulta relizada, no se ha encontrado documento", null)
                    console.log(respuesta);
                    res.json(respuesta);
                } else {
                    const respuesta = mensaje(0, "Consulta relizada", doc)
                    console.log(respuesta);
                    res.json(respuesta);
                }
            });
            console.log(busqueda);
        } catch (error) {
            const respuesta = mensaje(2, "Hubo un error en la consulta", null);
            console.log(respuesta);
            res.json(respuesta);
        }
    }
    db.close;
});

router.get('/:id/provincias', async (req, res) => {
    const { id } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeArrayProvincias(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try {

            const busqueda = await db.collection('regions').findOne({ _id: ObjectID(id) },
                { projection: { "provincias.comunas": 0 } }).then(function (doc) {
                    console.log(doc)
                    if (!doc) {
                        const respuesta = mensajeArrayProvincias(3, "Consulta relizada, no se ha encontrado documento", null)
                        console.log(respuesta);
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeArrayProvincias(0, "Consulta relizada", doc)
                        console.log(respuesta);
                        res.json(respuesta);
                    }
                });
            console.log(busqueda);
        } catch (error) {
            const respuesta = mensajeArrayProvincias(2, "Hubo un error en la consulta", null);
            console.log(respuesta);
            res.json(respuesta);
        }
    }
    db.close;
});


router.get('/:id/provincia/:cod_provincia', async (req, res) => {
    const id = req.params.id;
    const cod_provincia = req.params.cod_provincia;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensajeProvincia(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try {

            console.log(id);
            console.log(cod_provincia);
            const busqueda = await db.collection('regions').findOne({ _id: ObjectID(id), "provincias.codigo": cod_provincia },
                { projection: { "provincias": { $elemMatch: { "codigo": cod_provincia } }, "provincias.comunas": 0 } }).then(function (doc) {
                    if (!doc) {
                        const respuesta = mensajeProvincia(3, "Consulta relizada, no se ha encontrado documento", null)
                        console.log(respuesta);
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeProvincia(0, "Consulta relizada", doc)
                        console.log(respuesta);
                        res.json(respuesta);

                        //projection: { "provincias": { $elemMatch: { "codigo": cod_provincia }
                    }
                });
            console.log(busqueda);
        } catch (error) {
            const respuesta = mensajeProvincia(2, "Hubo un error en la consulta", null);
            console.log(respuesta);
            res.json(respuesta);
        }
    }
    db.close;
});




router.get('/cod_iso/:cod_iso', async (req, res) => {
    const { cod_iso } = req.params;
    const codigo = cod_iso.toUpperCase();
    const db = await connect();
    if (db === 1) {
        const respuesta = mensaje(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try {
            const busqueda = await db.collection('regions').findOne({ region_iso_3166_2: codigo }, { projection: { "provincias": 0 } }).then(function (doc) {
                if (!doc) {
                    const respuesta = mensaje(3, "Consulta relizada, no se ha encontrado documento", null)
                    console.log(respuesta);
                    res.json(respuesta);
                } else {
                    const respuesta = mensaje(0, "Consulta relizada", doc)
                    console.log(respuesta);
                    res.json(respuesta);
                }
            });
            //console.log(busqueda);
        } catch (error) {
            const respuesta = mensaje(2, "Hubo un error en la consulta", null);
            console.log(respuesta);
            res.json(respuesta);
        }
    }
});


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
        console.log(arrayDatos);
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