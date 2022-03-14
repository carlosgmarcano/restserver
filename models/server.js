const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../DB/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      categorias: "/api/categorias",
      usuarios: "/api/usuarios",
    };

    //Metodo Conectar DB
    this.conectarDB();

    //Middlewares
    this.middlewares();

    //Rutas de Aplicacion
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //Directorio publico
    this.app.use(express.static("public"));

    //CORS
    this.app.use(cors());

    //Lestura y Parceo del body
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto: ", this.port);
    });
  }
}

module.exports = Server;
