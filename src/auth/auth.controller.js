import { hash, verify } from "argon2";
import Usuario from "../users/user.model.js"
import { generarJWT } from "../helpers/generate-jwt.js"

export const login = async (req, res) => {

    //No hay register de parte de BrandonPu
    const { email, password, username } = req.body;

    try {

        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso!!',
            userDetails: {
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            }
        })

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}