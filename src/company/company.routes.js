import { Router } from "express";
import { check } from "express-validator";
import { updateCompanyById, getCompanies, createCompany ,getCompaniesByYearsExperience, getCompaniesByCategory, getCompaniesByName} from "./company.controller.js";
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
);

router.get(
    "/category/:businessCategory",
    [
    validarJWT,
    ],
    getCompaniesByCategory
);

router.get(
    "/companies",
    [
        validarJWT,
    ],
    getCompaniesByName
);

router.post(
    "/",
    [
        validarJWT,
        validateCategory,
        validarCampos
    ],
    createCompany
);

router.put(
    "/:id",
    [
        validarJWT,
        validateCategory,
        validarCampos, 
    ],
    updateCompanyById
);

export default router;