const express = require("express");
const router = express.Router();
const jogoController = require("./controllers/jogoController");
const Genero = require("./models/Genero");
const Plataforma = require("./models/Plataforma");
const Jogo = require("./models/Jogo");

// página inicial (Home)
router.get("/", async (req, res) => {
    const jogos = await Jogo.find().populate("genero").populate("plataforma");
    res.render("home", { title: "Home", jogos });
});

// Página de criar
router.get("/jogos/add", async (req, res) => {
    const generos = await Genero.find();
    const plataformas = await Plataforma.find();
    res.render("criar", { title: "Adicionar Jogo", generos, plataformas });
});
router.post("/jogos/add", jogoController.criarJogo);

// página de edição
router.get("/jogos/edit/:id", async (req, res) => {
    const jogo = await Jogo.findById(req.params.id);
    res.render("editar", { title: "Editar Jogo", jogo });
});
router.post("/jogos/update/:id", jogoController.atualizarJogo);

// página de deletar
router.get("/jogos/delete/:id", async (req, res) => {
    const jogo = await Jogo.findById(req.params.id);
    res.render("deletar", { title: "Deletar Jogo", jogo });
});
router.post("/jogos/delete/:id", jogoController.deletarJogo);

module.exports = router;