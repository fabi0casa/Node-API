const mongoose = require("mongoose");

const JogoSchema = new mongoose.Schema({
	titulo: { type: String, required: true },
	descricao: { type: String },
	preco: { type: Number, required: true },
	genero: { type: String, required: true },
	plataforma: { type: [String], required: true },
	estoque: { type: Number, required: true, default: 0},
	imagem: { type: String },
	criado_em: { type: Date, default: Date.now },
});

export default mongoose.model("Jogo", JogoSchema);