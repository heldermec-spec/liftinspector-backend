const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// 🔥 CORS liberado
app.use(cors());
app.use(express.json());

// 🔥 conexão banco (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔥 teste API
app.get("/", (req, res) => {
  res.send("API LexusLiftPro rodando 🚀");
});

// 🔥 teste
app.get("/analise", (req, res) => {
  res.json({ status: "ok" });
});

// 🔥 rota principal de inspeção
app.post("/inspecao", async (req, res) => {
  const { equipamento_id, item, status, observacao } = req.body;

  try {

    // 🔹 salvar inspeção
    const inspecao = await pool.query(
      `INSERT INTO inspecoes (equipamento_id, item, status, observacao)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [equipamento_id, item, status, observacao]
    );

    let os = null;

    // 🔥 gerar OS automática se não conforme
    if (status === "nao_conforme") {

      const causa = "Desgaste identificado";
      const acao = "Realizar manutenção corretiva";
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
      sucesso: true,
      inspecao: inspecao.rows[0],
      os: os ? os.rows[0] : null
    });

  } catch (error) {
    console.error("Erro detalhado:", error);

    res.status(500).json({
      sucesso: false,
      erro: "Erro ao salvar no banco",
      detalhe: error.message
    });
  }
});

// 🔥 iniciar servidor
app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando 🚀");
});
