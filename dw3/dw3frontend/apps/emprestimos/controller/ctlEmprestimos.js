const axios = require("axios");
const moment = require("moment");

// =====================================================================
// MANUTENÇÃO (LISTAGEM)
// =====================================================================
const manutEmprestimos = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;



  try {
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllEmprestimos", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    });

    const dadosFormatadosEmp = resp.data.registro.map((emprestimo) => {
      if (emprestimo.dataemprestimo) {
        emprestimo.dataemprestimo = moment(emprestimo.dataemprestimo).format(
          "DD/MM/YYYY"
        );
      }
      if (emprestimo.datadevolucao) {

        emprestimo.datadevolucao = moment(emprestimo.datadevolucao).format(
          "DD/MM/YYYY"
        );
      }
      return emprestimo;
    });

    res.render("emprestimos/view/vwManutEmprestimos.njk", {
      title: "Manutenção de Empréstimos",
      data: dadosFormatadosEmp,
      erro: null,
      userName: userName,
    });

  } catch (error) {
    let remoteMSG = error.message;
    if (error.code === "ECONNREFUSED") remoteMSG = "Servidor Backend indisponível";
    else if (error.response && error.response.status === 401) remoteMSG = "Usuário não autenticado";

    res.render("emprestimos/view/vwManutEmprestimos.njk", {
      title: "Manutenção de Empréstimos",
      data: null,
      erro: remoteMSG,
      userName: userName,
    });
  }
};





// =====================================================================
// INSERT (CADASTRO)
// =====================================================================
const insertEmprestimos = async (req, res) => {
  const token = req.session.token;
  const userName = req.session.userName;

  // SE FOR GET: Carrega o formulário com os Dropdowns (Clientes e Livros)
  if (req.method === "GET") {
    try {
      const [clientesResp, livrosResp] = await Promise.all([
        axios.get(process.env.SERVIDOR_DW3Back + "/GetAllClientes", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(process.env.SERVIDOR_DW3Back + "/GetAllLivros", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      res.render("emprestimos/view/vwFCrEmprestimos.njk", {
        title: "Cadastro de Empréstimos",
        clientes: clientesResp.data.registro,
        livros: livrosResp.data.registro,
        erro: null,
        userName: userName,
      });

    } catch (error) {
      console.error("[ctlEmprestimos|insertEmprestimos GET]", error.message);
      const remoteMSG = (error.code === "ECONNREFUSED") ? "Servidor Backend indisponível" : error.message;

      res.render("emprestimos/view/vwFCrEmprestimos.njk", {
        title: "Cadastro de Empréstimos",
        clientes: null,
        livros: null,
        erro: remoteMSG,
        userName: userName,
      });
    }

  } else {
    // SE FOR POST: Envia os dados para o Backend inserir
    const regData = req.body;
    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/InsertEmprestimos", regData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      // O backend retorna msg de sucesso ou erro (inclusive da conta financeira)
      res.json({
        status: response.data.status,
        msg: response.data.msg,
        data: response.data,
        erro: null,
      });

    } catch (error) {
      console.error('[ctlEmprestimos|insertEmprestimos POST] ', error.message);
      const msgErro = (error.code === "ECONNREFUSED") ? "Erro de conexão com o servidor" : error.message;
      res.json({ status: "Error", msg: msgErro, data: null, erro: msgErro });
    }
  }
};

// =====================================================================
// VIEW (VISUALIZAÇÃO APENAS LEITURA)
// =====================================================================
const ViewEmprestimos = async (req, res) => {
  const id = parseInt(req.params.id);
  const token = req.session.token;
  const userName = req.session.userName;

  try {
    // Busca dados do emprestimo (POST porque o backend lê req.body.emprestimoid)
    // Busca Clientes e Livros para preencher os Selects corretamente
    const [registroResp, clientesResp, livrosResp] = await Promise.all([
      axios.post(process.env.SERVIDOR_DW3Back + "/GetEmprestimosByID",
        { emprestimoid: id },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(process.env.SERVIDOR_DW3Back + "/GetAllClientes", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(process.env.SERVIDOR_DW3Back + "/GetAllLivros", { headers: { Authorization: `Bearer ${token}` } })
    ]);

    if (registroResp.data.registro[0].dataemprestimo) {
      registroResp.data.registro[0].datadevolucao = moment(
        registroResp.data.registro[0].datadevolucao
      ).format("YYYY-MM-DD");
    }
    if (registroResp.data.registro[0].dataemprestimo) {
      registroResp.data.registro[0].dataemprestimo = moment(
        registroResp.data.registro[0].dataemprestimo
      ).format("YYYY-MM-DD");
    }


    res.render("emprestimos/view/vwFRUDrEmprestimos.njk", {
      title: "Visualização de Empréstimo",
      data: registroResp.data.registro[0], // Pega o primeiro item do array
      clientes: clientesResp.data.registro,
      livros: livrosResp.data.registro,
      disabled: true, // Desabilita os campos no HTML
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
      erro: "Erro ao carregar dados: " + error.message,
    });
  }
};

// =====================================================================
// UPDATE (ATUALIZAÇÃO)
// =====================================================================
const UpdateEmprestimos = async (req, res) => {
  const token = req.session.token;
  const userName = req.session.userName;
  const id = parseInt(req.params.id);

  if (req.method === "GET") {
    try {
      const [registroResp, clientesResp, livrosResp] = await Promise.all([
        axios.post(process.env.SERVIDOR_DW3Back + "/GetEmprestimosByID",
          { emprestimoid: id },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(process.env.SERVIDOR_DW3Back + "/GetAllClientes", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(process.env.SERVIDOR_DW3Back + "/GetAllLivros", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (registroResp.data.registro[0].dataemprestimo) {
        registroResp.data.registro[0].datadevolucao = moment(
          registroResp.data.registro[0].datadevolucao
        ).format("YYYY-MM-DD");
      }
      if (registroResp.data.registro[0].dataemprestimo) {
        registroResp.data.registro[0].dataemprestimo = moment(
          registroResp.data.registro[0].dataemprestimo
        ).format("YYYY-MM-DD");
      }

      res.render("emprestimos/view/vwFRUDrEmprestimos.njk", {
        title: "Atualização de Empréstimo",
        data: registroResp.data.registro[0],
        clientes: clientesResp.data.registro,
        livros: livrosResp.data.registro,
        disabled: false, // Habilita edição
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
        erro: "Erro ao carregar dados: " + error.message,
      });
    }

  } else {
    // POST - Envia atualização
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
};

// =====================================================================
// DELETE (EXCLUSÃO)
// =====================================================================
const DeleteEmprestimos = async (req, res) => {
  const regData = req.body; // Deve conter { emprestimoid: X }
  const token = req.session.token;

  try {
    const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteEmprestimos", regData, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      timeout: 5000
    });

    res.json({
      status: response.data.status,
      msg: response.data.msg,
      data: response.data,
      erro: null
    });

  } catch (error) {
    console.error('[ctlEmprestimos|DeleteEmprestimos] ', error.message);
    res.json({ status: "Error", msg: error.message, data: null, erro: error.message });
  }
};

module.exports = {
  manutEmprestimos,
  insertEmprestimos,
  ViewEmprestimos,
  UpdateEmprestimos,
  DeleteEmprestimos,
};