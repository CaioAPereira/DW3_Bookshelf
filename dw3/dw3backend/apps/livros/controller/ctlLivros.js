const mdlLivros = require("../model/mdlLivros");

const GetAllLivros = (req, res) =>
  (async () => {
    let registro = await mdlLivros.GetAllLivros();
    res.json({ status: "ok", registro: registro });
  })();

const GetLivrosByID = (req, res) =>
  (async () => {
    const livroID = parseInt(req.body.livroid);
    let registro = await mdlLivros.GetLivroByID(livroID);
    res.json({ status: "ok", registro: registro });
  })();

// =======================================================================
// @ Função de Inserção
// =======================================================================
const InsertLivros = (request, res) =>
  (async () => {
    try {
      const registro = request.body;
      let { msg, linhasAfetadas } = await mdlLivros.InsertLivros(registro);

      // ### CORREÇÃO DA RESPOSTA JSON ###
      let status = (msg === "ok") ? "ok" : "erro";
      res.json({ "status": status, "msg": msg, "linhasAfetadas": linhasAfetadas });

    } catch (error) {
      res.json({
        "status": "erro",
        "msg": "[ctlLivros] Erro inesperado: " + error.message,
        "linhasAfetadas": -1
      });
    }
  })();

// =======================================================================
// @ Função de Atualização
// =======================================================================
const UpdateLivros = (request, res) =>
  (async () => {
    try {
      const registro = request.body;
      let { msg, linhasAfetadas } = await mdlLivros.UpdateLivros(registro);

      let status = msg === "ok" ? "ok" : "erro";
      res.json({ status: status, msg: msg, linhasAfetadas: linhasAfetadas });
    } catch (error) {
      console.error(
        "[ctlLivros|UpdateLivros] Erro inesperado: ",
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
const DeleteLivros = (request, res) =>
  (async () => {
    try {
      const registro = request.body;
      let { msg, linhasAfetadas } = await mdlLivros.DeleteLivros(registro);

      let status = msg === "ok" ? "ok" : "erro";
      res.json({ status: status, msg: msg, linhasAfetadas: linhasAfetadas });
    } catch (error) {
      console.error(
        "[ctlLivros|DeleteLivros] Erro inesperado: ",
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
    GetAllLivros,
    GetLivrosByID,
    InsertLivros,
    UpdateLivros,
    DeleteLivros,
};