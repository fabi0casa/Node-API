const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//conectando ao mongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("conexão estabelecida com o MongoDB!"))
	.catch((err) => console.error("erro ao conectar com o Mongo :( :", err))
	
//rota de teste
app.get("/", (req, res) =>{
	res.send("minha api está no ar!");
});

//iniciando o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
	console.log("servidor rodando na porta 5000...")
})