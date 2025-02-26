import { response, request } from "express";
import Company from "./company.model.js";

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
