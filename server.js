const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API LexusLiftPro rodando 🚀");
});

app.post("/analise", (req, res) => {
  const { item } = req.body;

  return res.json({
    causa_raiz: "Desgaste por fadiga",
    acao_corretiva: "Substituir componente",
    custo: 1500,
    tempo: 4,
    prioridade: "urgente"
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando");
});
