const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.get("/analise", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/analise", (req, res) => {
  res.json({
    resultado: "funcionando",
    item: req.body.item
  });
});

app.listen(process.env.PORT || 3000);
