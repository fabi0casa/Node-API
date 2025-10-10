const mongoose = require("mongoose");

const JogoSchema = new mongoose.Schema({
	titulo: { type: String, required: true },
	descricao: { type: String },
	preco: { type: Number, required: true },
	genero: [{ type: mongoose.Schema.Types.ObjectID, ref: "Genero", required: true}], //relacionamento com tabela genero
	plataforma: [{ type: mongoose.Schema.Types.ObjectID, ref: "Plataforma", required: true}], //relacionamento com a tabela de plataformas
	estoque: { type: Number, required: true, default: 0},
	imagem: { type: String },
	criado_em: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Jogo", JogoSchema);