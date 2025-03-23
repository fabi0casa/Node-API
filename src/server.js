const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const seedDatabase = require("./seed");
const jogoRoutes = require("./routes/routes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cors());
app.use(methodOverride("_method"));

//conectando ao mongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("conexão estabelecida com o MongoDB!");
		seedDatabase();
	})
	.catch((err) => console.error("erro ao conectar com o Mongo :( :", err))
	

//configurando o EJS
app.set("view engine", "ejs");
app.set("views", "./src/views");

//servindo arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

//rotas
app.use("/", jogoRoutes);

// rota 404 - não encontrado
app.use((req, res) => {
    res.status(404).render("404", { titulo: "Página não encontrada" });
});

//iniciando o servidor
app.listen(5000, () =>{
	console.log("servidor rodando na porta 5000...")
})