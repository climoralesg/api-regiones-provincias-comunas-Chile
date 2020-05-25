import {Router} from 'express'
const router=Router();
import {connect} from '../database'

/*
router.get('/',(req,res)=>{
    res.send('Regiones')
});
*/

router.get('/datos',async(req,res)=>{
    const db=await connect();
    const busqueda=await db.collection('regions').find({}).toArray();
    res.json(busqueda);
});

router.get('/nombres',async(req,res)=>{
    const db=await connect();
    const busqueda=await db.collection('regions').find({'region':'Arica y Parinacota'},{'region':1,'region_number':1}).toArray();
    console.log(busqueda);
    res.json(busqueda);
    db.close;
});

export default router;