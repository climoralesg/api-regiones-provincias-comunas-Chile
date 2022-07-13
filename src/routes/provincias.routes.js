import { Router } from "express";
import {provincias,provinciaCodigo} from '../controllers/provincias.js';

const router=Router();

router.get("/",[],provincias);
router.get("/:codigoProvincia",[],provinciaCodigo);


export default router;