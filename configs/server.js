'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from "../src/middlewares/validar-cant-peticiones.js"
import authRouters from "../src/auth/auth.routes.js"
import { createAdminUser} from "../src/users/user.controller.js"
import companyRoutes from "../src/company/company.routes.js"

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use("/interferSystem/v1/auth", authRouters);
    app.use("/interferSystem/v1/company", companyRoutes);
}

const conectarDB = async() => {
    try{
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    }catch(error){
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async() => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        await conectarDB(); 
        await createAdminUser();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}