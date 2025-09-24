const Jogo = require("../models/Jogo");

const criarJogo = async (req, res) => {
    try {
        // campos vindos do body (notar que com multipart/form-data, multer já preenche req.body)
        const { titulo, descricao } = req.body;

        // normaliza preço e estoque
        let preco = req.body.preco;
        let estoque = req.body.estoque;
        preco = preco ? parseFloat(preco) : 0;
        estoque = estoque ? parseInt(estoque, 10) : 0;

        // normaliza generos/plataformas (podem ser string ou array)
        let genero = req.body.genero;
        let plataforma = req.body.plataforma;
        if (genero && !Array.isArray(genero)) genero = [genero];
        if (plataforma && !Array.isArray(plataforma)) plataforma = [plataforma];

        // decide a imagem final: se tiver arquivo enviado -> /uploads/..., caso contrário usa a URL (se houver)
        let imagemFinal = req.body.imagem && req.body.imagem.trim() !== "" ? req.body.imagem.trim() : null;
        if (req.file) {
            imagemFinal = "/uploads/" + req.file.filename;
        }

        // cria e salva o jogo
        const novoJogo = new Jogo({
            titulo,
            descricao,
            preco,
            genero,
            plataforma,
            estoque,
            imagem: imagemFinal,
        });

        await novoJogo.save();

        req.flash("success", "Jogo criado com sucesso!");
        return res.redirect("/");
    } catch (error) {
        // envia a mensagem de erro como flash e volta ao form
        req.flash("error", "Erro ao criar jogo: " + (error.message || "Erro desconhecido"));
        return res.redirect("/jogos/add");
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
    try {
        const { titulo, descricao, preco, estoque, imagem } = req.body;

        const jogo = await Jogo.findById(req.params.id);
        if (!jogo) {
            req.flash("error", "Jogo não encontrado!");
            return res.redirect("/");
        }

        let imagemFinal = jogo.imagem; // começa com a imagem atual

        if (req.file) {
            // Se o usuário fez upload, prioriza ele
            imagemFinal = "/uploads/" + req.file.filename;
        } else if (imagem && imagem.trim() !== "") {
            // Se ele colocou link novo, sobrescreve
            imagemFinal = imagem;
        }
        // Se não mexer em nada, continua a imagem atual

        jogo.titulo = titulo;
        jogo.descricao = descricao;
        jogo.preco = preco;
        jogo.estoque = estoque;
        jogo.imagem = imagemFinal;

        await jogo.save();

        req.flash("success", "Jogo atualizado com sucesso!");
        res.redirect("/");
    } catch (error) {
        req.flash("error", "Erro ao atualizar o jogo: " + error.message);
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