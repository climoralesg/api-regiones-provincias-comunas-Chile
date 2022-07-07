import { Router } from 'express'
import { comunas,selectComuna } from '../controllers/comunas.js';

const router = Router();

router.get("/",[],comunas);
router.get("/:id",[],selectComuna);


export default router;