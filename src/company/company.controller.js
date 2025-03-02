import { response, request } from "express";
import Company from "./company.model.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import os from "os";
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

export const getCompaniesByCategory = async (req, res) => {
    try {
        const { businessCategory } = req.params;

        if (!businessCategory) {
            return res.status(400).json({
                message: "El parámetro para buscar por Categoría de negocio es requerido",
            });
        }

        const companies = await Company.find({ businessCategory });

        if (companies.length === 0) {
            return res.status(404).json({
                message: `No se encontraron empresas con la categoría de negocio: ${businessCategory}`,
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

export const getCompaniesByName = async (req, res) => {
    try {
        const { order } = req.query;
        let sortOrder = 1;

        if (order && order.toLowerCase() === 'desc') {
            sortOrder = -1;
        }

        const companies = await Company.find().sort({ nameCompany: sortOrder });

        if (companies.length === 0) {
            return res.status(404).json({
                message: "No se encontraron empresas",
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


export const updateCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nameCompany, descriptionCompany, impactLevel, yearsExperience, businessCategory } = req.body;

        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                message: "Empresa no encontrada",
            });
        }

        const existingCompany = await Company.findOne({
            nameCompany,
            _id: { $ne: id } 
        });
        if (existingCompany) {
            return res.status(400).json({
                message: "El nombre de la empresa ya está en uso",
                error: "Duplicado",
            });
        }

        company.nameCompany = nameCompany || company.nameCompany;
        company.descriptionCompany = descriptionCompany || company.descriptionCompany;
        company.impactLevel = impactLevel || company.impactLevel;
        company.yearsExperience = yearsExperience || company.yearsExperience;
        company.businessCategory = businessCategory || company.businessCategory;

        await company.save();

        return res.status(200).json({
            message: "Empresa actualizada exitosamente",
            company,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error al actualizar la empresa",
            error: error.message,
        });
    }
};

export const generateReport = async (req, res) => {
    try {
      const companies = await Company.find();
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Empresas');
  
      worksheet.columns = [
        { header: 'Nombre de la empresa', key: 'nameCompany', width: 30 },
        { header: 'Descripción', key: 'descriptionCompany', width: 40 },
        { header: 'Nivel de impacto', key: 'impactLevel', width: 20 },
        { header: 'Años de experiencia', key: 'yearsExperience', width: 20 },
        { header: 'Categoría de negocio', key: 'businessCategory', width: 30 },
        { header: 'Estado', key: 'estado', width: 10 },
        { header: 'Fecha de registro', key: 'createdAt', width: 20 },
      ];
  
      companies.forEach(company => {
        worksheet.addRow({
          nameCompany: company.nameCompany,
          descriptionCompany: company.descriptionCompany,
          impactLevel: company.impactLevel,
          yearsExperience: company.yearsExperience,
          businessCategory: company.businessCategory,
          estado: company.estado ? 'Activo' : 'Inactivo',
          createdAt: company.createdAt.toLocaleString(), 
        });
      });
  
      const desktopPath = path.join(os.homedir(), 'Desktop', 'reporte_empresas.xlsx');
  
      if (fs.existsSync(desktopPath)) {
        fs.unlinkSync(desktopPath); 
      }
  
      await workbook.xlsx.writeFile(desktopPath);
      console.log('Reporte generado exitosamente en el escritorio.');
  
      res.status(200).json({
        message: 'Reporte generado y guardado en el escritorio.',
      });
  
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      res.status(500).json({ error: 'Error al generar el reporte' });
    }
  };