<<<<<<< Updated upstream
// ctlContas.js - Frontend Controller para Contas

const axios = require("axios");
const moment = require("moment");

// =======================================================================
// @ Função principal - Manutenção de Contas
// =======================================================================
const manutContas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      const resp = await axios.get(
        process.env.SERVIDOR_DW3Back + "/getAllContas",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dadosFormatados = resp.data.registro.map((conta) => {
        if (conta.dtavencimento) {
          // Corrigido: 'datavencimento'
          conta.dtavencimento = moment(conta.dtavencimento).format(
            "DD/MM/YYYY"
          );
        }
        if (conta.dtarecebimento) {
    
          conta.dtarecebimento = moment(conta.dtarecebimento).format(
            "DD/MM/YYYY"
          );
        }
        return conta;
      });

      res.render("contas/view/vwManutContas.njk", {
        title: "Manutenção de Contas",
        data: dadosFormatados,
        erro: null,
        userName: userName,
      });
    } catch (error) {

      let remoteMSG = "";
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível";
      } else if (error.code === "ERR_BAD_REQUEST") {
        remoteMSG = "Usuário não autenticado";
      } else {
        remoteMSG = error.message;
      }
      res.render("contas/view/vwManutContas.njk", {
        title: "Manutenção de Contas",
=======
const axios = require("axios");

const manutEmprestimos = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    let remoteMSG = "";

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllEmprestimos", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    }).catch(error => {
      if (error.code === "ECONNREFUSED") remoteMSG = "Servidor indisponível";
      else if (error.code === "ERR_BAD_REQUEST") remoteMSG = "Usuário não autenticado";
      else remoteMSG = error.message;
      res.render("emprestimos/view/vwManutEmprestimos.njk", {
        title: "Manutenção de Empréstimos",
>>>>>>> Stashed changes
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
<<<<<<< Updated upstream
    }
  })();

// =======================================================================
// @ Função de Inserção de Contas
// =======================================================================
const insertContas = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;
      try {
        const clientes = await axios.get(
          process.env.SERVIDOR_DW3Back + "/getAllClientes",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return res.render("contas/view/vwFCrContas.njk", {
          title: "Cadastro de Contas",
          data: null,
          erro: null,
          clientes: clientes.data.registro,
          userName: req.session.userName,
        });
      } catch (error) {
        console.error(
          "[ctlContas|insertContas-GET] Erro ao buscar clientes:",
          error.message
        );
        return res.render("contas/view/vwFCrContas.njk", {
          title: "Cadastro de Contas",
          data: null,
          erro: "Erro ao buscar clientes",
          clientes: [],
          userName: req.session.userName,
=======
    });

    if (!resp) return;

    res.render("emprestimos/view/vwManutEmprestimos.njk", {
      title: "Manutenção de Empréstimos",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertEmprestimos = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const userName = req.session.userName;

    if (req.method === "GET") {
      // precisa carregar lista de clientes e livros para o select
      try {
        const [clientesResp, livrosResp] = await Promise.all([
          axios.get(process.env.SERVIDOR_DW3Back + "/GetAllClientes", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(process.env.SERVIDOR_DW3Back + "/GetAllLivros", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        res.render("emprestimos/view/vwFCrEmprestimos.njk", {
          title: "Cadastro de Empréstimos",
          clientes: clientesResp.data.registro,
          livros: livrosResp.data.registro,
          erro: null,
          userName: userName,
        });
      } catch (error) {
        const remoteMSG = error.message || "Erro carregando clientes/livros";
        res.render("emprestimos/view/vwFCrEmprestimos.njk", {
          title: "Cadastro de Empréstimos",
          clientes: null,
          livros: null,
          erro: remoteMSG,
          userName: userName,
>>>>>>> Stashed changes
        });
      }
    } else {
      // POST
      const regData = req.body;
<<<<<<< Updated upstream
      const token = req.session.token;

      try {
        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/insertContas",
          regData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        );
=======
      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/InsertEmprestimos", regData, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          timeout: 5000
        });
>>>>>>> Stashed changes

        res.json({
          status: response.data.status,
          msg: response.data.msg,
          data: response.data,
          erro: null,
        });
      } catch (error) {
<<<<<<< Updated upstream
        console.error(
          "[ctlContas|insertContas] Erro ao inserir conta:",
          error.message
        );
        res.json({
          status: "Error",
          msg: error.message,
          data: null,
          erro: null,
        });
=======
        console.error('[ctlEmprestimos|insertEmprestimos] ', error.message);
        res.json({ status: "Error", msg: error.message, data: null, erro: error.message });
>>>>>>> Stashed changes
      }
    }
  })();

<<<<<<< Updated upstream
// =======================================================================
// @ Função de Visualização de Contas
// =======================================================================
const ViewContas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      const id = req.params.id;
      const response = await axios.post(
        process.env.SERVIDOR_DW3Back + "/getContaByIDGeral",
        { contaid: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "ok") {
        try {
          const clientes = await axios.get(
            process.env.SERVIDOR_DW3Back + "/getAllClientes",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          ); 

          response.data.registro[0].dtavencimento = moment(
            response.data.registro[0].dtavencimento
          ).format("YYYY-MM-DD");
          if (response.data.registro[0].dtarecebimento) {
            response.data.registro[0].dtarecebimento = moment(
              response.data.registro[0].dtarecebimento
            ).format("YYYY-MM-DD");
          }

          res.render("contas/view/vwFRUDrContas.njk", {
            title: "Visualização de Conta",
            data: response.data.registro[0],
            disabled: true,
            clientes: clientes.data.registro,
            userName: userName,
            erro: null,
          });
        } catch (errorClientes) {
          // ... (seu código de erro está ok) ...
        }
      } else {
        // ... (seu código de erro está ok) ...
      }
    } catch (error) {
      // ... (seu código de erro está ok) ...
    }
  })();

// =======================================================================
// @ Função de Atualização de Contas
// =======================================================================
const UpdateContas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      if (req.method == "GET") {
        const id = req.params.id;

        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getContaByID",
          { contaid: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "ok") {
          try {
            const clientes = await axios.get(
              process.env.SERVIDOR_DW3Back + "/getAllClientes",
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            ); 

            response.data.registro[0].dtavencimento = moment(
              response.data.registro[0].dtavencimento
            ).format("YYYY-MM-DD");
            if (response.data.registro[0].dtarecebimento) {
              response.data.registro[0].dtarecebimento = moment(
                response.data.registro[0].dtarecebimento
              ).format("YYYY-MM-DD");
            }

            res.render("contas/view/vwFRUDrContas.njk", {
              title: "Atualização de Conta",
              data: response.data.registro[0],
              disabled: false,
              clientes: clientes.data.registro,
              userName: userName,
              erro: null,
            });
          } catch (errorClientes) {
  
          }
        } else {

        }
      } else {
        // POST
        const regData = req.body;
        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/updateContas",
          regData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
          }
        ); // ### CORREÇÃO DO ERRO 'undefined' ###

        res.json({
          status: response.data.status,
          msg: response.data.msg, // CORRIGIDO
          data: response.data,
          erro: null,
        });
      }
    } catch (error) {
      console.error(
        "[ctlContas|UpdateContas] Erro ao atualizar conta:",
        error.message
      );
      res.json({ status: "Error", msg: error.message, data: null, erro: null });
    }
  })();

// =======================================================================
// @ Função de Exclusão de Contas (CORRIGIDA)
// =======================================================================
const DeleteContas = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(
        process.env.SERVIDOR_DW3Back + "/deleteContas",
        regData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        }
      ); // ### CORREÇÃO DO ERRO 'undefined' ###

      res.json({
        status: response.data.status,
        msg: response.data.msg, // CORRIGIDO
        data: response.data,
        erro: null,
      });
    } catch (error) {
      console.error(
        "[ctlContas|DeleteContas] Erro ao deletar conta:",
        error.message
      );
      res.json({ status: "Error", msg: error.message, data: null, erro: null });
    }
  })();

// =======================================================================
// @ Exportação dos módulos
// =======================================================================
module.exports = {
  manutContas,
  insertContas,
  ViewContas,
  UpdateContas,
  DeleteContas,
};
=======
const ViewEmprestimos = async (req, res) =>
  (async () => {
    const id = parseInt(req.params.id);
    const token = req.session.token;
    const userName = req.session.userName;

    try {
      const [registroResp, clientesResp, livrosResp] = await Promise.all([
        axios.post(process.env.SERVIDOR_DW3Back + "/GetEmprestimosByID", { emprestimoid: id }, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(process.env.SERVIDOR_DW3Back + "/GetAllClientes", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(process.env.SERVIDOR_DW3Back + "/GetAllLivros", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      res.render("emprestimos/view/vwFRUDrEmprestimos.njk", {
        title: "Visualização de Empréstimo",
        data: registroResp.data.registro[0],
        clientes: clientesResp.data.registro,
        livros: livrosResp.data.registro,
        disabled: true,
        userName: userName,
        erro: null,
      });
    } catch (error) {
      console.error('[ctlEmprestimos|ViewEmprestimos] ', error.message);
      res.render("emprestimos/view/vwFRUDrEmprestimos.njk", {
        title: "Visualização de Empréstimo",
        data: null,
        clientes: null,
        livros: null,
        disabled: true,
        userName: userName,
        erro: error.message,
      });
    }
  })();

const UpdateEmprestimos = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const userName = req.session.userName;

    if (req.method === "GET") {
      const id = parseInt(req.params.id);
      try {
        const [registroResp, clientesResp, livrosResp] = await Promise.all([
          axios.post(process.env.SERVIDOR_DW3Back + "/GetEmprestimosByID", { emprestimoid: id }, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(process.env.SERVIDOR_DW3Back + "/GetAllClientes", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(process.env.SERVIDOR_DW3Back + "/GetAllLivros", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        res.render("emprestimos/view/vwFRUDrEmprestimos.njk", {
          title: "Atualização de Empréstimo",
          data: registroResp.data.registro[0],
          clientes: clientesResp.data.registro,
          livros: livrosResp.data.registro,
          disabled: false,
          userName: userName,
          erro: null,
        });
      } catch (error) {
        console.error('[ctlEmprestimos|UpdateEmprestimos GET] ', error.message);
        res.render("emprestimos/view/vwFRUDrEmprestimos.njk", {
          title: "Atualização de Empréstimo",
          data: null,
          clientes: null,
          livros: null,
          disabled: false,
          userName: userName,
          erro: error.message,
        });
      }
    } else {
      // POST update
      const regData = req.body;
      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/UpdateEmprestimos", regData, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          timeout: 5000
        });

        res.json({
          status: response.data.status,
          msg: response.data.msg,
          data: response.data,
          erro: null,
        });
      } catch (error) {
        console.error('[ctlEmprestimos|UpdateEmprestimos POST] ', error.message);
        res.json({ status: "Error", msg: error.message, data: null, erro: error.message });
      }
    }
  })();

const DeleteEmprestimos = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;
    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteEmprestimos", regData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      res.json({ status: response.data.status, msg: response.data.msg, data: response.data, erro: null });
    } catch (error) {
      console.error('[ctlEmprestimos|DeleteEmprestimos] ', error.message);
      res.json({ status: "Error", msg: error.message, data: null, erro: error.message });
    }
  })();

module.exports = {
  manutEmprestimos,
  insertEmprestimos,
  ViewEmprestimos,
  UpdateEmprestimos,
  DeleteEmprestimos,
};
>>>>>>> Stashed changes
