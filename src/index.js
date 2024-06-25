const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

try {
  mongoose.connect(mongoUri);
  console.log("Conexion DB exitosa");
} catch (error) {
  console.error("Error de conexion", error);
}

const librosSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
});

const Libro = mongoose.model("Libro", librosSchema);

//Rutas

app.get("/api", (req, res) => {
  res.send("Hola, has ingresado a la colección de libro.  Bienvenido");
});

//Midelwor de autenticacion

app.use((req, res, next) => {
  const authToken = req.headers["authorization"];
  if (authToken == "miTokenSecreto123") {
    next();
  } else {
    res.status(401).send("Acceso no autorizado");
  }
});

//Creando un nuevo libro
app.post("/libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });

  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).send("Error al guardar libro");
  }
});

//Traer todos los libros
app.get("/libros", async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
    console.log("Error al obtener los libros");
  } catch (error) {
    res.status(500).send("Error al obtener libros");
  }
});

//Obtener un libro por su id

app.get("/libros/:id", async (req, res) => {
  try {
    //  const id = req.params.id;
    // const libro = await Libro.findBy(id);

    const libro = await Libro.findById(req.params.id);

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrato");
    }
  } catch (error) {
    res.status(500).send("Error al buscar libro");
  }
});

//Obtener libros por nombre

app.get("/librotitulo", async (req, res) => {
  try {
    const tituloLibro = req.query.titulo;
    const libro = await Libro.findOne({ titulo: tituloLibro });
    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al buscar libro");
  }
});

// Actualizar un libro por su ID
app.put("/libros/:id", async (req, res) => {
  try {
    const libroId = req.params.id;
    const { titulo, autor } = req.body;

    const libroActualizado = await Libro.findByIdAndUpdate(
      libroId,
      { titulo, autor },
      { new: true } // Devuelve el documento actualizado
    );

    if (libroActualizado) {
      res.json(libroActualizado);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al intentar actualizar el libro");
  }
});

// Eliminar un libro por su ID
app.delete("/libros/:id", async (req, res) => {
  try {
    const libroId = req.params.id;
    const libroEliminado = await Libro.findByIdAndDelete(libroId);

    if (libroEliminado) {
      res.json({ message: "El libro fue eliminado" });
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al tratar de eliminar el libro");
  }
});

module.exports = app;
