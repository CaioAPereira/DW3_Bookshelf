const db = require("../../../database/databaseconfig");

const GetAllEmprestimos = async () => {
  return (
    await db.query(
      "SELECT E.emprestimoid, E.dataemprestimo, E.datadevolucao, E.removido, E.clienteid, E.livroid, C.nomerazaosocial, L.titulo" +
      " FROM Emprestimos AS E" +
      " INNER JOIN Clientes AS C ON E.clienteid = C.clienteid" +
      " INNER JOIN Livros AS L ON E.livroid = L.livroid"
    )
  ).rows;
};

const GetEmprestimosByID = async (emprestimoIDPar) => {
  return (
    await db.query(
      "SELECT * " +
      "FROM emprestimos WHERE emprestimoid = $1 and removido = false ORDER BY emprestimoid ASC",
      [emprestimoIDPar]
    )
  ).rows;
};

const InsertEmprestimos = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    const clienteid = registroPar.clienteid || null;
    const livroid = registroPar.livroid || null;

    const result = await db.query(
      "INSERT INTO emprestimos (removido, clienteid, livroid, dataemprestimo, datadevolucao, valoremprestimo) " +
      "values(default, $1, $2, $3, $4, $5) RETURNING emprestimoid",
      [
        clienteid,
        livroid,
        registroPar.dataemprestimo,
        registroPar.datadevolucao,
        registroPar.valoremprestimo,
      ]
    );

    linhasAfetadas = result.rowCount;

    // Pega o ID gerado
    if (result.rows.length > 0) {
      novoID = result.rows[0].emprestimoid;
    }
  } catch (error) {
    msg = "[mdlEmprestimos|insertEmprestimos] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas, novoID };
};

const UpdateEmprestimos = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    const clienteid = registroPar.clienteid || null;
    const livroid = registroPar.livroid || null;

    linhasAfetadas = (
      await db.query(
        "UPDATE emprestimos SET " +
        "clienteid = $2, " +
        "livroid = $3, " +
        "dataemprestimo = $4, " +
        "datadevolucao = $5, " +
        "valoremprestimo = $6 " +
        "WHERE emprestimoid = $1",
        [
          registroPar.emprestimoid,
          clienteid,
          livroid,
          registroPar.dataemprestimo,
          registroPar.datadevolucao,
          registroPar.valoremprestimo,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlEmprestimos|UpdateEmprestimos] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const DeleteEmprestimos = async (registroPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE emprestimos SET " +
        "removido = true " +
        "WHERE emprestimoid = $1",
        [registroPar.emprestimoid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlEmprestimos|DeleteEmprestimos] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  GetAllEmprestimos,
  GetEmprestimosByID,
  InsertEmprestimos,
  UpdateEmprestimos,
  DeleteEmprestimos,
};
