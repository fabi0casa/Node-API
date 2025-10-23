const express = require("express");
const router = express.Router();
const jogoController = require("../controllers/jogoController");
const Genero = require("../models/Genero");
const Plataforma = require("../models/Plataforma");
const Jogo = require("../models/Jogo");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ====== CONFIGURAÇÃO DE UPLOAD (igual à versão original) ====== //
const uploadDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

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
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Apenas arquivos de imagem são permitidos"));
        }
        cb(null, true);
    },
});

// ====== ROTAS DA API (JSON) ====== //

// [GET] /api/jogos?page=1 — lista paginada de jogos
router.get("/jogos", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const totalJogos = await Jogo.countDocuments();
        const jogos = await Jogo.find()
            .populate("genero")
            .populate("plataforma")
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalJogos / limit);

        res.json({
            currentPage: page,
            totalPages,
            totalJogos,
            jogos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar jogos" });
    }
});

// [GET] /api/jogos/add-data — retorna listas auxiliares (gêneros e plataformas)
router.get("/jogos/add-data", async (req, res) => {
    try {
        const generos = await Genero.find();
        const plataformas = await Plataforma.find();
        res.json({ generos, plataformas });
    } catch (error) {
        res.status(500).json({ error: "Erro ao carregar dados de criação" });
    }
});

// [POST] /api/jogos/add — cria um novo jogo
router.post(
    "/jogos/add",
    (req, res, next) => {
        upload.single("upload")(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: "Erro no upload: " + err.message });
            }
            next();
        });
    },
    async (req, res) => {
        try {
            const jogo = await jogoController.criarJogo(req, res, true); // true = modo API
            if (!res.headersSent) res.status(201).json(jogo);
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar jogo" });
        }
    }
);

// [GET] /api/jogos/:id — busca um jogo por ID
router.get("/jogos/:id", async (req, res) => {
    try {
        const jogo = await Jogo.findById(req.params.id)
            .populate("genero")
            .populate("plataforma");

        if (!jogo) {
            return res.status(404).json({ error: "Jogo não encontrado" });
        }

        res.json(jogo);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar jogo" });
    }
});

// [PUT] /api/jogos/edit/:id — atualiza um jogo (com upload opcional)
router.put("/jogos/edit/:id", upload.single("upload"), async (req, res) => {
    try {
        const jogoAtualizado = await jogoController.atualizarJogo(req, res, true);
        if (!res.headersSent) res.json(jogoAtualizado);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar jogo" });
    }
});

// [DELETE] /api/jogos/delete/:id — deleta um jogo
router.delete("/jogos/delete/:id", async (req, res) => {
    try {
        const jogo = await Jogo.findById(req.params.id);
        if (!jogo) return res.status(404).json({ error: "Jogo não encontrado" });

        await jogoController.deletarJogo(req, res, true);
        if (!res.headersSent) res.json({ message: "Jogo deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar jogo" });
    }
});

module.exports = router;
