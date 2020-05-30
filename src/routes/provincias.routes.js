import { Router } from 'express'
const router = Router();
import { connect } from '../database'
import { ObjectID } from 'mongodb'


router.get('/', async (req, res) => {
    const db = await connect();

    if (db === 1) {
        const respuesta = mensajeArray(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try{
            const busqueda = await db.collection('regions').find({},
                { projection: { "provincias": 1, _id:1} })
                .toArray().then(function(docs){
                    if(docs.length==0){
                        const respuesta = mensajeArray(3, "Consulta relizada, no se ha encontrado documento", null)
                        console.log(respuesta);
                        res.json(respuesta);
                    }else{
                        const respuesta = mensajeArray(0, "Consulta relizada", docs)
                        console.log(respuesta);
                        res.json(respuesta);
                    }
            });
            
            //console.log(busqueda);
            //res.json(busqueda);
            
        }catch(error){
            const respuesta = mensajeArray(2, "Hubo un error en la consulta", null);
            console.log(respuesta);
            res.json(respuesta);
        }

    }

});

router.get('/:cod_provincia', async (req, res) => {
    const { id } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensaje(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try {
            const busqueda =await db.collection('regions').findOne({ _id: ObjectID(id) }, { projection: { "provincias": 1, _id:1} }).then(function (doc) {
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
        provincias: [
            ...info
        ]
    }
    return estado;
}


export default router;