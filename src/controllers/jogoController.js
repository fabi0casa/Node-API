const Jogo = require("../models/Jogo");

const criarJogo = async (req, res) => {
	try{
		const { titulo, descricao, preco, genero, plataforma, estoque, imagem } = req.body;
		const novoJogo = await Jogo.create({ titulo, descricao, preco, genero, plataforma, estoque, imagem });
		req.flash('success', 'Jogo criado com sucesso!');
		res.redirect('/');
	} catch (error) {
		req.flash('error', 'Erro ao criar jogo: ' + error.message);
		res.redirect('/jogos/add'); 
	}
};

const listarJogos = async (req, res) => {
	try{
		const jogos = await Jogo.find().populate("genero").populate("plataforma");
		res.json(jogos);
	} catch (error) {
		req.flash('error', 'Erro ao buscar jogos');
		res.redirect('/');
	}
};

const atualizarJogo = async (req, res) => {
	try{
		const jogoAtualizado = await Jogo.findByIdAndUpdate(req.params.id, req.body, { new:true }).populate("genero").populate("plataforma");
		req.flash('success', 'Jogo atualizado com sucesso!');
		res.redirect('/');
	} catch (error) {
		req.flash('error', 'Erro ao atualizar o jogo: ' + error.message);
		res.redirect(`/jogos/edit/${req.params.id}`);
	}
};

const deletarJogo = async (req, res) => {
	try{
		await Jogo.findByIdAndDelete(req.params.id);
		req.flash('success', 'Jogo deletado com sucesso!');
		res.redirect('/');
	} catch (error) {
		req.flash('error', 'Erro ao deletar o jogo');
		res.redirect('/');
	}
};

module.exports = { criarJogo, listarJogos, atualizarJogo, deletarJogo };