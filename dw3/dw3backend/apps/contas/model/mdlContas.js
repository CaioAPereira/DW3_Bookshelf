const db = require("../../../database/databaseconfig");
const { get } = require("../../../routes/router");

const getAllContas = async () => {
  return (
    await db.query(
      "SELECT *, (SELECT nomerazaosocial from clientes where clienteid = contas.clienteid)" +
        "FROM contas WHERE removido = false ORDER BY contasid ASC"
    )
  ).rows;
};

const getContaByID = async (contaIDPar) => {
  return (
    await db.query(
      "SELECT *, (SELECT nomerazaosocial from clientes where clienteid = contas.clienteid)" +
        "FROM contas WHERE contasid = $1 and removido = false",
      [contaIDPar]
    )
  ).rows;
};

const getContaByIDGeral = async (contaIDPar) => {
  return (
    await db.query(
      "SELECT *, (SELECT nomerazaosocial from clientes where clienteid = contas.clienteid)" +
        "FROM contas WHERE contasid = $1",
      [contaIDPar]
    )
  ).rows;
};

const insertContas = async (contaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    const valor = contaREGPar.valor || null;
    const dtavencimento = contaREGPar.dtavencimento || null;
    const dtarecebimento = contaREGPar.dtarecebimento || null;
    const descricao = contaREGPar.descricao || null;
    const clienteid = contaREGPar.clienteid || null;
    const emprestimoid = contaREGPar.emprestimoid || null;

    linhasAfetadas = (
      await db.query(
        "INSERT INTO contas (removido, valor, dtavencimento, dtarecebimento, descricao, clienteid, emprestimoid) " +
          "values(default, $1, $2, $3, $4, $5, $6)",
        [
          valor,
          dtavencimento,
          dtarecebimento,
          descricao,
          clienteid,
          emprestimoid,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlContas|insertContas] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const UpdateContas = async (contaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    const dtarecebimento = contaREGPar.dtarecebimento || null;
    const clienteid = contaREGPar.clienteid || null;
    linhasAfetadas = (
      await db.query(
        "UPDATE contas SET " +
          "valor = $2, " +
          "dtavencimento = $3, " +
          "dtarecebimento= $4, " +
          "descricao = $5, " +
          "removido = $6, " +
          "clienteid = $7 " +
          "WHERE contasid = $1",
        [
          contaREGPar.contasid,
          contaREGPar.valor,
          contaREGPar.dtavencimento,
          dtarecebimento,
          contaREGPar.descricao,
          contaREGPar.removido,
          clienteid,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlContas|updateContas] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// Função Especial: Atualiza a conta procurando pelo ID DO EMPRÉSTIMO
const UpdateContasPorEmprestimo = async (contaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE contas SET " +
          "valor = $2, " +
          "dtavencimento = $3, " +
          "dtarecebimento = $4, " +
          "descricao = $5, " +
          "clienteid = $6 " +
          "WHERE emprestimoid = $1 AND removido = false", // <--- O SEGRED0: Vínculo pelo emprestimo
        [
          contaREGPar.emprestimoid, // $1
          contaREGPar.valor, // $2
          contaREGPar.dtavencimento, // $3
          contaREGPar.dtarecebimento, // $4
          contaREGPar.descricao, // $5
          contaREGPar.clienteid, // $6
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlContas|UpdateContasPorEmprestimo] " + error.message;
    linhasAfetadas = -1;
  }
  return { msg, linhasAfetadas };
};

const DeleteContas = async (contaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE contas SET " + "removido = true " + "WHERE contasid = $1",
        [contaREGPar.contasid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlContas|DeleteContas] " + error.message;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllContas,
  getContaByID,
  getContaByIDGeral,
  insertContas,
  UpdateContas,
  DeleteContas,
  UpdateContasPorEmprestimo,
};
