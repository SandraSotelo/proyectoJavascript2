const request = require("supertest");

const app = require("../src/index");
const mongoose = require("mongoose");

describe("Endpoints de Libros", () => {
  test("Debería obtener una lista de libros", async () => {
    const res = await request(app)
      .get("/libros")
      .set("authorization", "miTokenSecreto123");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });

  test("Deberia crear un nuevo libro", async () => {
    const res = await request(app)
      .post("/libros")
      .send({
        titulo: "Libro test",
        autor: "Autor test",
      })
      .set("authorization", "miTokenSecreto123");
    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toEqual("Libro test");
  });

  // Actualizar el libro 
  test("Debería actualizar un libro existente", async () => {
    const res = await request(app)
      .put(`/libros/${res.body._id}`)
      .send({
        titulo: "Libro actualizado",
        autor: "Nuevo autor",
      })
      .set("authorization", "miTokenSecreto123");

    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toEqual("Libro actualizado");
  });

  // Eliminar el libro
  test("Debería eliminar un libro existente", async () => {
    const res = await request(app)
      .delete(`/libros/${res.body._id}`)
      .set("authorization", "miTokenSecreto123");

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Libro eliminado correctamente");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
