const express = require("express");
const router = express.Router();
const jogoController = require("../controllers/jogoController");
const Genero = require("../models/Genero");
const Plataforma = require("../models/Plataforma");
const Jogo = require("../models/Jogo");

// página inicial (Home)
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;   // página atual
        const limit = 5; // quantidade de jogos por página
        const skip = (page - 1) * limit;

        // total de jogos
        const totalJogos = await Jogo.countDocuments();

        // buscar somente os jogos da página atual
        const jogos = await Jogo.find()
            .populate("genero")
            .populate("plataforma")
            .skip(skip)
            .limit(limit);

        // total de páginas
        const totalPages = Math.ceil(totalJogos / limit);

        res.render("home", { 
            title: "Home", 
            jogos, 
            currentPage: page, 
            totalPages 
        });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
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