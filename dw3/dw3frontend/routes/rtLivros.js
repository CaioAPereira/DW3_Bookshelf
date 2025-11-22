var express = require('express');
var router = express.Router();
var livrosApp = require("../apps/livros/controller/ctlLivros");

// Autenticação igual ao rtClientes
function authenticationMiddleware(req, res, next) {
  isLogged = req.session.isLogged;
  if (!isLogged) {
    res.redirect("/Login");
  }
  next();
}

/* GET métodos */
router.get('/ManutLivros', authenticationMiddleware, livrosApp.manutLivros)
router.get('/InsertLivros', authenticationMiddleware, livrosApp.insertLivros);
router.get('/ViewLivros/:id', authenticationMiddleware, livrosApp.ViewLivros);
router.get('/UpdateLivros/:id', authenticationMiddleware, livrosApp.UpdateLivros);

/* POST métodos */
router.post('/InsertLivros', authenticationMiddleware, livrosApp.insertLivros);
router.post('/UpdateLivros', authenticationMiddleware, livrosApp.UpdateLivros);
router.post('/DeleteLivros', authenticationMiddleware, livrosApp.DeleteLivros);

module.exports = router;