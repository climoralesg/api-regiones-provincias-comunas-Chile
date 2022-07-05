import { Router } from 'express'
import { comunas } from '../controllers/comunas.js';

const router = Router();

router.get("/",[],comunas);


export default router;