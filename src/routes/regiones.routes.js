import {Router} from 'express'

const router=Router();

import {connect} from '../database'

router.get('/',(req,res)=>{
    res.send('Regiones')
});

export default router;