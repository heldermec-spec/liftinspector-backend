const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// 🔥 CONFIGURAÇÃO CORS (libera frontend)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

app.use(express.json());

// 🔥 CONEXÃO COM SUPABASE
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔥 ROTA TESTE
app.get("/", (req, res) => {
  res.send("API LexusLiftPro rodando 🚀");
});

// 🔥 ROTA TESTE ANALISE
app.get("/analise", (req, res) => {
  res.json({ status: "ok" });
});

// 🔥 ROTA PRINCIPAL DE IA (simulada)
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

// 🔥 ROTA DE INSPEÇÃO (SALVA + GERA OS)
app.post("/inspecao", async (req, res) => {
  const { equipamento_id, item, status, observacao } = req.body;

  try {
    // ✅ Salvar inspeção
    const inspecao = await pool.query(
      `INSERT INTO inspecoes (equipamento_id, item, status, observacao)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [equipamento_id, item, status, observacao]
    );

    let os = null;

    // 🔥 Se não conforme → gerar OS automática
    if (status === "nao_conforme") {

      // 🧠 Lógica inicial (depois vira IA real)
      const causa = "Desgaste por fadiga";
      const acao = "Substituir componente";
      const custo = 1500;
      const prazo = 3;

      os = await pool.query(
        `INSERT INTO ordens_servico 
        (equipamento_id, descricao, status, custo, prazo)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          equipamento_id,
          `${item} - ${causa} - ${acao}`,
          "aberta",
          custo,
          prazo
        ]
      );
    }

    res.json({
      inspecao: inspecao.rows[0],
      os: os ? os.rows[0] : null
    });

  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao processar inspeção");
  }
});

// 🔥 START SERVIDOR
app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando 🚀");
});
