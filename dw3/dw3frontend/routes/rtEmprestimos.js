<<<<<<< Updated upstream
var express = require("express");
var router = express.Router();
var emprestimosApp = require("../apps/contas/controller/ctlEmprestimos");

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  // Verificar se existe uma sessão válida.
  isLogged = req.session.isLogged;

=======
var express = require('express');
var router = express.Router();
var emprestimosApp = require("../apps/emprestimos/controller/ctlEmprestimos");

// Autenticação igual ao rtClientes
function authenticationMiddleware(req, res, next) {
  isLogged = req.session.isLogged;
>>>>>>> Stashed changes
  if (!isLogged) {
    res.redirect("/Login");
  }
  next();
}

/* GET métodos */
<<<<<<< Updated upstream
router.get("/ManutEmprestimos", authenticationMiddleware, emprestimosApp.manutEmprestimos);
router.get("/InsertEmprestimos", authenticationMiddleware, emprestimosApp.insertEmprestimos);
router.get("/ViewEmprestimos/:id", authenticationMiddleware, emprestimosApp.ViewEmprestimos);
router.get(
  "/UpdateEmprestimos/:id",
  authenticationMiddleware,
  emprestimosApp.UpdateEmprestimos
);

/* POST métodos */
router.post("/InsertEmprestimos", authenticationMiddleware, emprestimosApp.insertEmprestimos);
router.post("/UpdateEmprestimos", authenticationMiddleware, emprestimosApp.UpdateEmprestimos);
router.post("/DeleteEmprestimos", authenticationMiddleware, emprestimosApp.DeleteEmprestimos);

module.exports = router;
=======
router.get('/ManutEmprestimos', authenticationMiddleware, emprestimosApp.manutEmprestimos)
router.get('/InsertEmprestimos', authenticationMiddleware, emprestimosApp.insertEmprestimos);
router.get('/ViewEmprestimos/:id', authenticationMiddleware, emprestimosApp.ViewEmprestimos);
router.get('/UpdateEmprestimos/:id', authenticationMiddleware, emprestimosApp.UpdateEmprestimos);

/* POST métodos */
router.post('/InsertEmprestimos', authenticationMiddleware, emprestimosApp.insertEmprestimos);
router.post('/UpdateEmprestimos', authenticationMiddleware, emprestimosApp.UpdateEmprestimos);
router.post('/DeleteEmprestimos', authenticationMiddleware, emprestimosApp.DeleteEmprestimos);

module.exports = router;
>>>>>>> Stashed changes
