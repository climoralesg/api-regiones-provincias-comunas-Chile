import { Router } from 'express'
import { regiones,region } from '../controllers/regiones.js';

const router = Router();


router.get("/",[],regiones);
router.get("/:codigoRegion",[],region);


export default router;