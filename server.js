const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 conexão banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔥 rota base
app.get("/", (req, res) => {
  res.send("API LexusLiftPro rodando 🚀");
});

// 🔥 dashboard
app.get("/dashboard", async (req, res) => {
  try {
    const totalInspecoes = await pool.query("SELECT COUNT(*) FROM inspecoes");
    const naoConformes = await pool.query("SELECT COUNT(*) FROM inspecoes WHERE status = 'nao_conforme'");
    const osAbertas = await pool.query("SELECT COUNT(*) FROM ordens_servico WHERE status = 'aberta'");
    const custoTotal = await pool.query("SELECT COALESCE(SUM(custo),0) as total FROM ordens_servico");
    const listaOS = await pool.query("SELECT * FROM ordens_servico ORDER BY created_at DESC LIMIT 10");

    res.json({
      totalInspecoes: totalInspecoes.rows[0].count,
      naoConformes: naoConformes.rows[0].count,
      osAbertas: osAbertas.rows[0].count,
      custoTotal: custoTotal.rows[0].total,
      listaOS: listaOS.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
});

// 🔥 inspeção
app.post("/inspecao", async (req, res) => {
  const { equipamento_id, item, status, observacao } = req.body;

  try {

    const inspecao = await pool.query(
      `INSERT INTO inspecoes (equipamento_id, item, status, observacao)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [equipamento_id, item, status, observacao]
    );

    let os = null;

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
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando 🚀");
});
