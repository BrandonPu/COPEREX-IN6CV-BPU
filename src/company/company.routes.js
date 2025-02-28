import { Router } from "express";
import { check } from "express-validator";
import { getCompanies, createCompany ,getCompaniesByYearsExperience } from "./company.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import validateCategory from "../middlewares/validateCategory.js";

const router = Router();

router.get("/", [validarJWT], getCompanies);

router.get(
    "/experience/:yearsExperience",
    [
    validarJWT,
    ],
    getCompaniesByYearsExperience
)

router.post(
    "/",
    [
        validarJWT,
        validateCategory,
        validarCampos
    ],
    createCompany
)
export default router;