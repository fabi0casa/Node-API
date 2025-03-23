const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Genero = require("./models/Genero");
const Plataforma = require("./models/Plataforma");

dotenv.config();

const seedDatabase = async () => {
	try{
		//criando lista enumerada de generos e plataformas
		const generos = ["Ação", "RPG", "Estratégia", "Esportes"];
		const plataformas = ["PC", "Playstation 4", "Xbox 360", "Nintendo GameCube"];
		
		//insere os generos no banco, apenas caso eles não existam ainda
		for (const nome of generos){
			await Genero.updateOne(
				{ nome }, // verifica se já existe
				{ $setOnInsert: { nome } }, //se não existir, insere
				{ upsert: true } //cria caso não exista
			);
		}
		
		for (const nome of plataformas){
			await Plataforma.updateOne(
				{ nome },
				{ $setOnInsert: { nome } },
				{ upsert: true }
			);
		}
	} catch (err) {
		console.error("Erro ao conectar ao inserir dados no Mongo");
	}
		
};

module.exports = seedDatabase;