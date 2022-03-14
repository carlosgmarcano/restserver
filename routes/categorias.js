const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categorias");
const { existCategoriaPorId } = require("../helpers/db-validators");
const { validarJWT, esAdminRole } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

//Obtener todas las categorias
router.get("/", obtenerCategorias);

//Obtener una categoria
router.get(
  "/:id",
  [
    check("id", "No es un ID válido")
      .exists({ checkNull: true })
      .bail()
      .isMongoId()
      .bail()
      .custom(existCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);

//Crear categoria - Privado (cualquier rol - token valido)
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar categoria - Privado (cualquier rol -  token valido)
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido").isMongoId(),
    check("nombre", "El nombre es obligatorio").notEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

//Borrar categoria - Solo Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un mongo id valido").isMongoId(),
    validarCampos,
  ],
  eliminarCategoria
);

module.exports = router;
