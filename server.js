import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/api", (req, res) => {
  const kode = req.query.kode;

  if (!kode) {
    return res.json({
      message: "Gunakan parameter ?kode=m17",
      availableCodes: [
        "m17",
        "m51",
        "m83",
        "p65061",
        "p32329",
        "p32324",
        "p32337",
        "p32332",
        "p32335",
        "p32327"
      ],
      totalCodes: 10
    });
  }

  res.json({
    status: true,
    kode: kode,
    message: "API berhasil"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API berjalan di port ${PORT}`);
});
