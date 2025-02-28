import { response, request } from "express";
import Company from "./company.model.js";
import validateCategory from "../middlewares/validateCategory.js"

export const getCompanies = async (req, res) => {
    try {
        const query = { estado: true };

        const [total, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query, "nameCompany descriptionCompany impactLevel yearsExperience businessCategory estado _id")
        ]);

        res.status(200).json({
            success: true,
            total,
            companies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener las empresas",
            error
        });
    }
};


export const createCompany = async (req, res) => {
    try {
        const data = req.body;

        const existingCompany = await Company.findOne({
            nameCompany: data.nameCompany,
        });
        if (existingCompany) {
            return res.status(400).json({
                message: "El nombre de la empresa ya está en uso",
                error: "Duplicado",
            });
        }

        const newCompany = new Company({
            nameCompany: data.nameCompany,
            descriptionCompany: data.descriptionCompany,
            impactLevel: data.impactLevel,
            yearsExperience: data.yearsExperience,
            businessCategory: data.businessCategory,
        });

        await newCompany.save();

        return res.status(201).json({
            message: "Empresa registrada exitosamente",
            company: newCompany,
        });
    } catch (error) {
        console.log(error);

        if (error.name === "ValidationError") {
            let errorMessage = "Error de validación";

            if (error.errors && error.errors.impactLevel) {
                errorMessage =
                    "El valor de 'impactLevel' es inválido. " +
                    "Por favor, asegúrate de que sea uno de los siguientes: 'Bajo', 'Medio', 'Alto'.";
            }

            return res.status(400).json({
                message: errorMessage,
            });
        }

        return res.status(500).json({
            message: "Error al registrar la empresa",
            error: error.message,
        });
    }
};


export const getCompaniesByYearsExperience = async (req, res) => {
    try {
        const { yearsExperience } = req.params;
        const years = parseInt(yearsExperience);

        if (isNaN(years)) {
            return res.status(400).json({
                message: "El parámetro para buscar por Años de experiencia debe ser un número válido",
            });
        }

        const companies = await Company.find({ yearsExperience: years });

        if (companies.length === 0) {
            return res.status(404).json({
                message: `No se encontraron empresas con ${years} años de experiencia`,
            });
        }

        return res.status(200).json({ companies });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener las empresas",
            error: error.message,
        });
    }
};
