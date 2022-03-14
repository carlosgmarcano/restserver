const Role = require("../models/role");
const { Categoria, Usuario } = require("../models");
const { Mongoose } = require("mongoose");

//Verificar si el correo existe
const existEmail = async (correo = "") => {
  const existe = await Usuario.findOne({ correo });
  if (existe) {
    throw new Error(`El correo ${correo} ya existe`);
  }
};

//Verificar los roles en DB
const isValidRole = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado`);
  }
};

//Verificar los roles en DB
const isValidUserId = async (id) => {
  const existeId = await Usuario.findById(id);
  if (!existeId) {
    throw new Error(`El id ${id} no esta registrado`);
  }
};

//Verificar si la categoria existe
const existCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`No existe la categoria ${id}`);
  }
};

module.exports = {
  isValidRole,
  existEmail,
  isValidUserId,
  existCategoriaPorId,
};
