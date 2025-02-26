import { Router } from "express";
import { check } from "express-validator";
import { createCompany } from "./company.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        validarCampos
    ],
    createCompany
)
export default router;