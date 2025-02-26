import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: "ADMIN_ROLE" });

        if (!adminExists) {

            const hashedPassword = await hash("admin2025");

            const adminUser = new User({
                name: "Admin",
                username: "AdminSystem",
                email: "admin@system.com",
                password: hashedPassword,
                role: "ADMIN_ROLE",
            });

            await adminUser.save();
            console.log("Administrador creado correctamente.");
        } else {
            console.log("Administrador ya existente.");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error);
    }
};