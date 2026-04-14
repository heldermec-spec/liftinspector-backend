const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API LexusLiftPro rodando 🚀");
});

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
