const express = require("express");
const router = express.Router();
const jogoController = require("../controllers/jogoController");

//rotas dos jogos
router.post("/add", jogoController.criarJogo);
router.get("/all", jogoController.listarJogos);
router.put("/update/:id", jogoController.atualizarJogo);
router.delete("/delete/:id", jogoController.deletarJogo);

module.exports = router;