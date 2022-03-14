const { request, response } = require("express");
const { Categoria, Usuario } = require("../models");

const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const activos = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(activos),
    Categoria.find(activos)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categorias = await Categoria.findById(id).populate("usuario", "nombre");
  res.json({
    categorias,
  });
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.userAuthenticate._id,
  };

  const categoria = new Categoria(data);

  //Guardar en base de datos
  await categoria.save();

  res.status(201).json(categoria);
};

const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.userAuthenticate._id;

  const categoriaDB = await Categoria.findOne({ nombre: data.nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `El nombre ${categoriaDB.nombre} ya existe`,
    });
  }

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
  res.json({
    categoria,
  });
};

const eliminarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, estado, ...resto } = req.body;
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json({
    categoria,
  });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
