// Backend by: CaioAPereira :)

const mdlEmprestimos = require("../model/mdlEmprestimos");
const mdlContas = require("../../contas/model/mdlContas");
const mdlClientes = require("../../clientes/model/mdlClientes");

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

// ==========================================================
// INSERT: Gera Empréstimo -> Pega ID -> Gera Conta Vinculada
// ==========================================================
const InsertEmprestimos = (request, res) =>
  (async () => {
    try {
      const registro = request.body;
      
      // 1. Insere Empréstimo e ESPERA O ID DE VOLTA
      let retornoEmp = await mdlEmprestimos.InsertEmprestimos(registro);

      if (retornoEmp.msg !== "ok" || !retornoEmp.novoID) {
        return res.json({ status: "erro", msg: retornoEmp.msg, linhasAfetadas: 0 });
      }

      // 2. Busca Nome do Cliente (apenas para montar a descrição bonita)
      let registroCliente = await mdlClientes.GetClienteByID(parseInt(registro.clienteid));
      const nomeCliente = registroCliente[0] ? registroCliente[0].nomerazaosocial : "Cliente";

      // 3. Prepara e Insere a Conta AUTOMATICAMENTE
      console.log("NovoID: "+retornoEmp.novoID );
      let jsonContas = {
        valor: registro.valoremprestimo,
        descricao: `Empréstimo Livro ID ${registro.livroid} - ${nomeCliente}`,
        dtarecebimento: registro.dataemprestimo,
        dtavencimento: registro.datadevolucao,
        clienteid: registro.clienteid,        
        emprestimoid: retornoEmp.novoID // <--- AQUI ESTÁ O VÍNCULO!
      };

      let retornoConta = await mdlContas.insertContas(jsonContas);

      if (retornoConta.msg === "ok") {
        res.json({ status: "ok", msg: "Empréstimo e Conta gerados com sucesso.", linhasAfetadas: retornoEmp.linhasAfetadas });
      } else {
        res.json({ status: "erro", msg: "Empréstimo criado, mas erro na conta: " + retornoConta.msg });
      }

    } catch (error) {
      res.json({ status: "erro", msg: "Erro fatal: " + error.message });
    }
  })();

// ==========================================================
// UPDATE: Atualiza Empréstimo -> Atualiza Conta Vinculada
// ==========================================================
const UpdateEmprestimos = (request, res) =>
  (async () => {
    try {
      const registro = request.body; 

      // 1. Atualiza Empréstimo
      let retornoEmp = await mdlEmprestimos.UpdateEmprestimos(registro);

      if (retornoEmp.msg !== "ok") {
        return res.json({ status: "erro", msg: retornoEmp.msg });
      }

      // 2. Atualiza a Conta usando o emprestimoid
      let jsonContas = {
        emprestimoid: registro.emprestimoid, // Usa isso para achar a conta
        valor: registro.valoremprestimo,     // Atualiza valor
        dtavencimento: registro.datadevolucao, // Atualiza data
        dtarecebimento: registro.dataemprestimo,
        descricao: `Empréstimo Livro ID ${registro.livroid} (Atualizado)`,
        clienteid: registro.clienteid
      };

      let retornoConta = await mdlContas.UpdateContasPorEmprestimo(jsonContas);

      res.json({ 
          status: "ok", 
          msg: "Empréstimo e Conta Financeira atualizados.", 
          linhasAfetadas: retornoEmp.linhasAfetadas 
      });

    } catch (error) {
      res.json({ status: "erro", msg: "Erro fatal: " + error.message });
    }
  })();

// =======================================================================
// @ Função de Exclusão
// =======================================================================

const DeleteEmprestimos = (request, res) =>
  (async () => {
    try {
      const registro = request.body;
      let { msg, linhasAfetadas } = await mdlEmprestimos.DeleteEmprestimos(
        registro
      );

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
  DeleteEmprestimos,
};
