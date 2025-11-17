const mdlEmprestimos = require("../model/mdlEmprestimos");

const GetAllEmprestimos = (req, res) =>
  (async () => {
    let registro = await mdlEmprestimos.GetAllEmprestimos();
    res.json({ status: "ok", registro: registro });
  })();

const GetEmprestimosByID = (req, res) =>
  (async () => {
    const emprestimoid = parseInt(req.body.emprestimoid);
    let registro = await mdlEmprestimos.GetEmprestimosByID(emprestimoid);
    res.json({ status: "ok", registro: registro });
  })();

// =======================================================================
// @ Função de Inserção
// =======================================================================
const InsertEmprestimos = (request, res) =>
  (async () => {
    try {
      const registro = request.body;
      let { msg, linhasAfetadas } = await mdlEmprestimos.InsertEmprestimos(registro);

      let status = (msg === "ok") ? "ok" : "erro";
      res.json({ "status": status, "msg": msg, "linhasAfetadas": linhasAfetadas });

    } catch (error) {
      res.json({
        "status": "erro",
        "msg": "[ctlEmprestimos] Erro inesperado: " + error.message,
        "linhasAfetadas": -1
      });
    }
  })();

// =======================================================================
// @ Função de Atualização
// =======================================================================

const UpdateEmprestimos = (request, res) =>
  (async () => {
    try {
      const registro = request.body;
      let { msg, linhasAfetadas } = await mdlEmprestimos.UpdateEmprestimos(registro);

      let status = msg === "ok" ? "ok" : "erro";
      res.json({ status: status, msg: msg, linhasAfetadas: linhasAfetadas });
    } catch (error) {
      console.error(
        "[ctlEmprestimos|UpdateEmprestimos] Erro inesperado: ",
        error.message
      );
      res.json({
        status: "erro",
        msg: "Erro fatal no controlador: " + error.message,
        linhasAfetadas: -1,
      });
    }
  })();

// =======================================================================
// @ Função de Exclusão
// =======================================================================

const DeleteEmprestimos = (request, res) =>
  (async () => {
    try {
      const registro = request.body;
      let { msg, linhasAfetadas } = await mdlEmprestimos.DeleteEmprestimos(registro);

      let status = msg === "ok" ? "ok" : "erro";
      res.json({ status: status, msg: msg, linhasAfetadas: linhasAfetadas });
    } catch (error) {
      console.error(
        "[ctlEmprestimos|DeleteEmprestimos] Erro inesperado: ",
        error.message
      );
      res.json({
        status: "erro",
        msg: "Erro fatal no controlador: " + error.message,
        linhasAfetadas: -1,
      });
    }
  })();

module.exports = {
    GetAllEmprestimos,
    GetEmprestimosByID,
    InsertEmprestimos,
    UpdateEmprestimos,
    DeleteEmprestimos
};
