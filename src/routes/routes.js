const express = require("express");
const router = express.Router();
const jogoController = require("../controllers/jogoController");
const Genero = require("../models/Genero");
const Plataforma = require("../models/Plataforma");
const Jogo = require("../models/Jogo");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


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

// Garantir que a pasta de uploads exista
const uploadDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // limite 5MB (ajuste se quiser)
    fileFilter: (req, file, cb) => {
        // aceitar apenas imagens
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Apenas arquivos de imagem são permitidos"));
        }
        cb(null, true);
    },
});

// Rota GET (formulário)
router.get("/jogos/add", async (req, res) => {
    const generos = await Genero.find();
    const plataformas = await Plataforma.find();
    res.render("criar", { title: "Adicionar Jogo", generos, plataformas });
});

// Rota POST com tratamento de erro do multer (evita crash/silêncio)
router.post(
    "/jogos/add",
    (req, res, next) => {
        // chama o multer e captura erro para tratar e redirecionar
        upload.single("upload")(req, res, (err) => {
            if (err) {
                // se houver erro de upload (tipo/limite), retorna ao form com flash
                req.flash("error", "Erro no upload: " + err.message);
                return res.redirect("/jogos/add");
            }
            next();
        });
    },
    jogoController.criarJogo
);

module.exports = router;


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