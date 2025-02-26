import { Schema, model } from "mongoose";

const CompanySchema = Schema(
    {
        nameCompany: {
            type: String,
            required: true 
        },
        descriptionCompany: {
            type: String,
            required: true 
        },
        impactLevel: {
            type: String,
            enum: ['Bajo', 'Medio', 'Alto'],
            required: true
        },
        yearsExperience: {
            type: Number, 
            required: true
        },
        businessCategory: {
            type: String,
            required: true
        },
        estado: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default model("Company", CompanySchema)
