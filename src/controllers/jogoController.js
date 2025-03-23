const Jogo = require("../models/Jogo");

const criarJogo = async (req, res) => {
	try{
		const { titulo, descricao, preco, genero, plataforma, estoque, imagem } = req.body;
		const novoJogo = await Jogo.create({ titulo, descricao, preco, genero, plataforma, estoque, imagem });
		res.status(201).json(novoJogo);
	} catch (error) {
		res.status(400).json({ erro: "Erro ao criar jogo", detalhes: error.message });
	}
};

const listarJogos = async (req, res) => {
	try{
		const jogos = await Jogo.find().populate("genero").populate("plataforma");
		res.json(jogos);
	} catch (error) {
		res.status(500).json({ erro: "Erro ao buscar jogos" });
	}
};

const atualizarJogo = async (req, res) => {
	try{
		const jogoAtualizado = await Jogo.findByIdAndUpdate(req.params.id, req.body, { new:true }).populate("genero").populate("plataforma");
		res.json(jogoAtualizado);
	} catch (error) {
		res.status(400).json({ erro: "Erro ao atualizar o jogo" });
	}
};

const deletarJogo = async (req, res) => {
	try{
		await Jogo.findByIdAndDelete(req.params.id);
		res.json({ mensagem: "Jogo deletado com sucesso" });
	} catch (error) {
		res.status(500).json({ erro: "Erro ao deletar o jogo" });
	}
};

module.exports = { criarJogo, listarJogos, atualizarJogo, deletarJogo };