const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
//Importación de las consultas
const { getPosts, addPost, likePost, deletePost } = require("./consultas");
//Servidor
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

//Crear una ruta GET con Express para devolver los registros de una tabla alojada en PostgreSQL.
app.get("/posts", async (req, res) => {
  const posts = await getPosts();
  res.json(posts);
});

//Crear una ruta POST con Express que reciba y almacene en PostgreSQL un nuevo registro.
app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const result = await addPost(titulo, img, descripcion, 0);
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Agregar una ruta PUT en una API REST y utilizarla para modificar registros en una tabla alojada en PostgreSQL.
app.put("/posts/like/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const newLikes = await likePost(postId);
    console.log(newLikes);
    if (newLikes === null) {
      res.status(404).send(`No se pudo encontrar el post con ID ${postId}`);
    } else {
      res
        .status(200)
        .send(`El post con ID ${postId} ahora tiene ${newLikes} likes.`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Ocurrió un error al actualizar el post.");
  }
});

//Agregar una ruta DELETE en una API REST y utilizarla para eliminar registros en una tabla alojada en PostgreSQL.
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = deletePost(id);
    console.log(`Post ${id} fue borrado`);
    res.status(200).send("borrado");
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
