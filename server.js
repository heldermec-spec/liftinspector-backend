const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 CONFIGURAÇÃO COMPLETA DE CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// 🔥 responder preflight manualmente
app.options("*", cors());

app.use(express.json());

// 🔥 rota teste
app.get("/", (req, res) => {
  res.send("API LexusLiftPro rodando 🚀");
});

// 🔥 rota GET (teste navegador)
app.get("/analise", (req, res) => {
  res.json({ status: "ok" });
});

// 🔥 rota POST (principal)
app.post("/analise", (req, res) => {
  const { item } = req.body;

  res.json({
    causa_raiz: "Desgaste por fadiga em " + item,
    acao_corretiva: "Substituir componente",
    custo: 1500,
    tempo: 4,
    prioridade: "urgente"
  });
});

app.listen(process.env.PORT || 3000);
