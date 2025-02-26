import jwt from "jsonwebtoken";
import Usuario from "../users/user.model.js"

export const validarJWT = async (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: "No Hay Token En La Peticion"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: "Usuario No Existente En La Base de Datos"
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Token No Valido - Usuario Status: False"
            });
        }

        if (usuario.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                msg: "No tiene permisos para realizar esta acción Solo el administrador puede realizar cambios"
            });
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token No Valido"
        });
    }

};