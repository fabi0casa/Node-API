const mongoose = require("mongoose");

const PlataformaSchema = new mongoose.Schema({
	nome: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Plataforma", PlataformaSchema);