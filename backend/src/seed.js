const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Genero = require("./models/Genero");
const Plataforma = require("./models/Plataforma");

dotenv.config();

const seedDatabase = async () => {
	try{
		//criando lista enumerada de generos e plataformas
		const generos = [
		  "Ação",
		  "Aventura",
		  "RPG",
		  "Estratégia",
		  "Esportes",
		  "Simulação",
		  "Corrida",
		  "Terror",
		  "Puzzle",
		  "Plataforma",
		  "Tiro em Primeira Pessoa (FPS)",
		  "Tiro em Terceira Pessoa (TPS)",
		  "Mundo Aberto",
		  "Luta",
		  "Sobrevivência",
		  "Battle Royale",
		  "Hack and Slash",
		  "Stealth (Furtividade)",
		  "Musical / Ritmo",
		  "Visual Novel"
		];

		const plataformas = [
		  "PC",
		  "PlayStation 2",
		  "PlayStation 3",
		  "PlayStation 4",
		  "PlayStation 5",
		  "Xbox",
		  "Xbox 360",
		  "Xbox One",
		  "Xbox Series X/S",
		  "Nintendo GameCube",
		  "Nintendo Wii",
		  "Nintendo Wii U",
		  "Nintendo Switch",
		  "NES",
		  "SNES",
		  "Gameboy",
		  "Nintendo 64",
		  "Nintendo DS",
		  "Nintendo 3DS",
		  "PSP",
		  "PlayStation Vita",
		  "Sega Dreamcast",
		  "Atari",
		  "Mobile (Android/iOS)",
		  "Flash"
		];
		
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