const db = require("../../../database/databaseconfig");

const GetAllLivros = async () => {
  return (
    await db.query(
      "SELECT * FROM livros where removido = false ORDER BY titulo ASC"
    )
  ).rows;
};

const GetLivroByID = async (livroIDPar) => {
  return (
    await db.query(
      "SELECT * " +
        "FROM livros WHERE livroid = $1 and removido = false ORDER BY titulo ASC",
      [livroIDPar]
    )
  ).rows;
};

const InsertLivros = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    const titulo = registroPar.titulo || null;
    const genero = registroPar.genero || null;

    linhasAfetadas = (
      await db.query(
        "INSERT INTO livros (removido, titulo, genero, autor, anopublicacao) " +
          "values(default, $1, $2, $3, $4)",
        [
          titulo,
          genero,
          registroPar.autor,
          registroPar.anopublicacao,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlLivros|insertLivros] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const UpdateLivros = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    const titulo = registroPar.titulo || null;
    const genero = registroPar.genero || null;

    linhasAfetadas = (
      await db.query(
        "UPDATE livros SET " +
          "titulo = $2, " +
          "genero = $3, " +
          "autor = $4, " +
          "anopublicacao = $5, " +
          "removido = $6 " +
          "WHERE livroid = $1",
        [
          registroPar.livroid,
          titulo,
          genero,
          registroPar.autor,
          registroPar.anopublicacao,
          registroPar.removido,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlLivros|updateLivros] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const DeleteLivros = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE livros SET " + "removido = true " + "WHERE livroid = $1",
        [registroPar.livroid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlLivros|deleteLivros] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
    GetAllLivros,
    GetLivroByID,
    InsertLivros,
    UpdateLivros,
    DeleteLivros,
};
