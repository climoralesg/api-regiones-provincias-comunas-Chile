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
    const busqueda = await db.collection('regions').find({},
        { projection: { "region": 1, "capital_regional": 1, "region_iso_3166_2": 1 } }).toArray();
    console.log(busqueda);
    res.json(busqueda);

});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const db = await connect();
    if (db === 1) {
        const estado = {
            estado: {
                codigo: db,
                respuesta: 'Error la conexion a la base de datos'
            },
            region: null
        }
        res.json(estado);
    } else {
        try {
            await db.collection('regions').findOne({ _id: ObjectID(id) }).then(function(doc){
                if(!doc){
                    const estado = {
                        estado: {
                            codigo: 3,
                            respuesta: 'Consulta realizada, no se ha encontrado documento'
                        },
                        region:null
                    }
                    console.log(estado);
                    res.json(estado);
                }else{
                    const estado = {
                        estado: {
                            codigo: 0,
                            respuesta: 'Consulta realizada'
                        },
                        region: {
                            ...doc
                        }
                    }
                    console.log(estado);
                    res.json(estado);
                }
            });
        } catch (error) {
            const estado = {
                estado: {
                    codigo: 2,
                    respuesta: 'Hubo un error en la consulta'
                },
                region: null
            }
            res.json(estado);
        }
    }
    db.close;
});

export default router;