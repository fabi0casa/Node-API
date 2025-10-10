const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const seedDatabase = require("./seed");
const jogoRoutes = require("./routes/routes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cors());
app.use(methodOverride("_method"));
app.use(expressLayouts);
app.set("layout", "layout");

//configurando express-session e connect-flash
app.use(session({
  secret: 'seuSegredoAqui',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

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
app.use("/uploads", express.static("public/uploads"));

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