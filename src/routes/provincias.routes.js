import { Router } from "express";
import {provincias,provinciaCodigo, provinciaComunas,comunaProvincia} from '../controllers/provincias.js';

const router=Router();

router.get("/",[],provincias);
router.get("/:codigoProvincia",[],provinciaCodigo);
router.get("/:codigoProvincia/comunas",[],provinciaComunas);
router.get("/:codigoProvincia/comunas/:codigoComuna",[],comunaProvincia);


export default router;