const axios = require("axios");

const manutLivros = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    let remoteMSG = "";

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllLivros", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    }).catch(error => {
      if (error.code === "ECONNREFUSED") remoteMSG = "Servidor indisponível";
      else if (error.code === "ERR_BAD_REQUEST") remoteMSG = "Usuário não autenticado";
      else remoteMSG = error.message;
      res.render("livros/view/vwManutLivros.njk", {
        title: "Manutenção de Livros",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) return;

    res.render("livros/view/vwManutLivros.njk", {
      title: "Manutenção de Livros",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertLivros = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const userName = req.session.userName;

    if (req.method === "GET") {
      return res.render("livros/view/vwFCrLivros.njk", {
        title: "Cadastro de Livros",
        data: null,
        erro: null,
        userName: userName,
      });
    } else {
      const regData = req.body;
      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/InsertLivros", regData, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          timeout: 5000
        });

        res.json({ status: response.data.status, msg: response.data.msg, data: response.data, erro: null });
      } catch (error) {
        console.error('[ctlLivros|insertLivros] ', error.message);
        res.json({ status: "Error", msg: error.message, data: null, erro: error.message });
      }
    }
  })();

const ViewLivros = async (req, res) =>
  (async () => {
    const id = parseInt(req.params.id);
    const token = req.session.token;
    const userName = req.session.userName;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/GetLivrosByID", { livroid: id }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.status === "ok") {
        res.render("livros/view/vwFRUDrLivros.njk", {
          title: "Visualização de Livro",
          data: response.data.registro[0],
          disabled: true,
          userName: userName,
          erro: null
        });
      } else {
        res.render("livros/view/vwFRUDrLivros.njk", {
          title: "Visualização de Livro",
          data: null,
          disabled: true,
          userName: userName,
          erro: "Registro não encontrado"
        });
      }
    } catch (error) {
      console.error('[ctlLivros|ViewLivros] ', error.message);
      res.render("livros/view/vwFRUDrLivros.njk", {
        title: "Visualização de Livro",
        data: null,
        disabled: true,
        userName: userName,
        erro: error.message
      });
    }
  })();

const UpdateLivros = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const userName = req.session.userName;

    if (req.method === "GET") {
      const id = parseInt(req.params.id);
      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/GetLivrosByID", { livroid: id }, { headers: { Authorization: `Bearer ${token}` } });

        res.render("livros/view/vwFRUDrLivros.njk", {
          title: "Atualização de Livro",
          data: response.data.registro[0],
          disabled: false,
          userName: userName,
          erro: null
        });
      } catch (error) {
        console.error('[ctlLivros|UpdateLivros GET] ', error.message);
        res.render("livros/view/vwFRUDrLivros.njk", { title: "Atualização de Livro", data: null, disabled: false, userName: userName, erro: error.message });
      }
    } else {
      // POST update
      const regData = req.body;
      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/UpdateLivros", regData, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          timeout: 5000
        });

        res.json({ status: response.data.status, msg: response.data.msg, data: response.data, erro: null });
      } catch (error) {
        console.error('[ctlLivros|UpdateLivros POST] ', error.message);
        res.json({ status: "Error", msg: error.message, data: null, erro: error.message });
      }
    }
  })();

const DeleteLivros = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;
    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteLivros", regData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        timeout: 5000
      });

      res.json({ status: response.data.status, msg: response.data.msg, data: response.data, erro: null });
    } catch (error) {
      console.error('[ctlLivros|DeleteLivros] ', error.message);
      res.json({ status: "Error", msg: error.message, data: null, erro: error.message });
    }
  })();

module.exports = {
  manutLivros,
  insertLivros,
  ViewLivros,
  UpdateLivros,
  DeleteLivros,
};