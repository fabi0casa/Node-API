const Jogo = require("../models/Jogo");

const criarJogo = async (req, res, isApiOrNext = false) => {
  const isApi = typeof isApiOrNext === "boolean" ? isApiOrNext : false;
  try {
    const { titulo, descricao } = req.body;

    let preco = req.body.preco ? parseFloat(req.body.preco) : 0;
    let estoque = req.body.estoque ? parseInt(req.body.estoque, 10) : 0;

    let genero = req.body.genero;
    let plataforma = req.body.plataforma;
    if (genero && !Array.isArray(genero)) genero = [genero];
    if (plataforma && !Array.isArray(plataforma)) plataforma = [plataforma];

    // imagem enviada via upload (req.file) ou URL (req.body.imagemUrl)
    let imagemFinal = null;
    if (req.file) {
      imagemFinal = "/uploads/" + req.file.filename;
    } else if (req.body.imagemUrl && req.body.imagemUrl.trim() !== "") {
      imagemFinal = req.body.imagemUrl.trim();
    }

    const novoJogo = new Jogo({
      titulo,
      descricao,
      preco,
      estoque,
      genero,
      plataforma,
      imagem: imagemFinal,
    });

    await novoJogo.save();

    if (isApi) {
      // Modo API — responde JSON
      return res.status(201).json({
        message: "Jogo criado com sucesso",
        jogo: novoJogo,
      });
    } else {
      // Modo web tradicional (ejs)
      req.flash("success", "Jogo criado com sucesso!");
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Erro ao criar jogo:", error);

    if (isApi) {
      return res.status(500).json({
        error: "Erro ao criar jogo",
        details: error.message,
      });
    } else {
      req.flash("error", "Erro ao criar jogo: " + (error.message || "Erro desconhecido"));
      return res.redirect("/jogos/add");
    }
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

const atualizarJogo = async (req, res, isApiOrNext = false) => {
  const isApi = typeof isApiOrNext === "boolean" ? isApiOrNext : false;

  try {
    const { titulo, descricao, preco, estoque, imagem } = req.body;

    const jogo = await Jogo.findById(req.params.id);
    if (!jogo) {
      if (isApi) {
        return res.status(404).json({ success: false, message: "Jogo não encontrado!" });
      }
      req.flash("error", "Jogo não encontrado!");
      return res.redirect("/");
    }

    let imagemFinal = jogo.imagem; // começa com a imagem atual

    if (req.file) {
      imagemFinal = "/uploads/" + req.file.filename;
    } else if (imagem && imagem.trim() !== "") {
      imagemFinal = imagem;
    }

    jogo.titulo = titulo;
    jogo.descricao = descricao;
    jogo.preco = preco;
    jogo.estoque = estoque;
    jogo.imagem = imagemFinal;
	
	let genero = req.body["genero[]"] || req.body.genero;
	let plataforma = req.body["plataforma[]"] || req.body.plataforma;

	if (genero && !Array.isArray(genero)) genero = [genero];
	if (plataforma && !Array.isArray(plataforma)) plataforma = [plataforma];

	jogo.genero = genero;
	jogo.plataforma = plataforma;

    await jogo.save();

    if (isApi) {
      return res.json({
        success: true,
        message: "Jogo atualizado com sucesso!",
        jogo,
      });
    }

    req.flash("success", "Jogo atualizado com sucesso!");
    res.redirect("/");
  } catch (error) {
    if (isApi) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar o jogo",
        error: error.message,
      });
    }

    req.flash("error", "Erro ao atualizar o jogo: " + error.message);
    res.redirect(`/jogos/edit/${req.params.id}`);
  }
};

const deletarJogo = async (req, res, isApiOrNext = false) => {
  const isApi = typeof isApiOrNext === "boolean" ? isApiOrNext : false;

  try {
    await Jogo.findByIdAndDelete(req.params.id);

    if (isApi) {
      return res.json({ success: true, message: "Jogo deletado com sucesso!" });
    } else {
      req.flash("success", "Jogo deletado com sucesso!");
      return res.redirect("/");
    }
  } catch (error) {
    console.error(error);

    if (isApi) {
      return res.status(500).json({
        success: false,
        message: "Erro ao deletar o jogo",
        error: error.message,
      });
    } else {
      req.flash("error", "Erro ao deletar o jogo");
      return res.redirect("/");
    }
  }
};

module.exports = { criarJogo, listarJogos, atualizarJogo, deletarJogo };