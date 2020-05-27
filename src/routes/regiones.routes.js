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
        { projection: { "region": 1, "numero": 1, "capital_regional": 1, "region_number": 1 } }).toArray();
    console.log(busqueda);
    res.json(busqueda);

});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const db = await connect();
    const result = await db.collection('regions').findOne({ _id: ObjectID(id) })
    console.log(result);
    res.json(result);

    //console.log(id);
    //res.json(id);
    //const busqueda=await db.collection('regions').find({})
});



export default router;