const { response } = require("express")

const esAdminRole = (req, res = response, next) => {

    if (!req.userAuthenticate) {
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.userAuthenticate;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `No autorizado - ${nombre} no es administrador`
        });
    }

    next();
}

const tieneRol = (...roles) => {

    return (req, res = response, next) => {

        if (!req.userAuthenticate) {
            return res.status(500).json({
                msg: 'Se requiere verificar el role sin validar el token primero'
            });
        }

        const { rol, nombre } = req.userAuthenticate;
        if (!roles.includes(rol)) {
            return res.status(401).json({
                msg: `${nombre} no tiene un rol autorizado. Roles permitidos ${roles}`
            });

        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}