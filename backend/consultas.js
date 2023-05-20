//Usar el paquete pg para conectarse e interactuar con la base de datos.
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "123",
  host: "localhost",
  database: "likeme",
  port: 5432,
  allowExitOnIdle: true,
});

//Consulta get
const getPosts = async () => {
  const result = await pool.query("SELECT * FROM posts");
  const { rows } = result;
  return rows;
};
//Consulta post
const addPost = async (titulo, img, descripcion, likes) => {
  const values = [titulo, img, descripcion, likes];
  const query =
    "INSERT INTO posts(id, titulo, img, descripcion, likes) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *";
  try {
    const result = await pool.query(query, values);
    const { rows } = result;
    return rows[0];
  } catch (error) {
    throw new Error("No se pudo agregar el post");
  }
};

//Consulta put
const likePost = async (id) => {
  const query = "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *";
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0].likes;
  } catch (error) {
    return false;
    console.log(error);
  }
};

//Consulta delete
const deletePost = async (id) => {
  try {
    const values = [id];
    const query = "DELETE FROM posts WHERE id = $1";
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (error) {
    console.log(error);
  }
};

//exportación de módulos de consultas
module.exports = {
  getPosts,
  addPost,
  likePost,
  deletePost,
};
