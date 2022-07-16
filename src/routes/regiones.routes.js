import { Router } from 'express'
import { regiones, region, provinciaRegion, comunasRegion } from '../controllers/regiones.js';

const router = Router();


router.get("/",[],regiones);
router.get("/:codigoRegion",[],region);
router.get("/:codigoRegion/provincias",[],provinciaRegion);
router.get("/:codigoRegion/comunas",[],comunasRegion);

export default router;