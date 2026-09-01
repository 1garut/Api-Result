import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const pasaran = [
  {nama:"KENTUCKY MID",kode:"p32307"},
  {nama:"ROMA",kode:"p32308"},
  {nama:"FLORIDA MID",kode:"p32309"},
  {nama:"TURIN",kode:"p32310"},
  {nama:"NEWYORK MID",kode:"p32311"},
  {nama:"CAROLINA DAY",kode:"p32312"},
  {nama:"MADRID",kode:"p32313"},
  {nama:"OREGON 03",kode:"p32314"},
  {nama:"MIAMI",kode:"p32315"},
  {nama:"OREGON 06",kode:"p32316"},
  {nama:"CALIFORNIA",kode:"p32317"},
  {nama:"FLORIDA EVE",kode:"p32318"},
  {nama:"OREGON 09",kode:"p32319"},
  {nama:"KENTUCKY EVE",kode:"p32321"},
  {nama:"CAROLINA EVE",kode:"p32322"},
  {nama:"AUSTRIA",kode:"p32323"},
  {nama:"CAMBODIA",kode:"p32324"},
  {nama:"BULLSEYE",kode:"p32325"},
  {nama:"OREGON 12",kode:"p32326"},
  {nama:"SYDNEY",kode:"p32327"},
  {nama:"GUANGDONG",kode:"p32328"},
  {nama:"CHINA",kode:"p32329"},
  {nama:"PHILIPPINES",kode:"p32330"},
  {nama:"JAPAN",kode:"p32331"},
  {nama:"SINGAPORE",kode:"p32332"},
  {nama:"CYPRUS",kode:"p32334"},
  {nama:"TAIWAN",kode:"p32335"},
  {nama:"ICELAND",kode:"p32336"},
  {nama:"HONGKONG",kode:"p32337"},
  {nama:"NEWYORK EVE",kode:"p71958"},
  {nama:"MONACO",kode:"p76081"},
  {nama:"CUBA",kode:"p76082"},
  {nama:"ECUADOR",kode:"p76083"},
  {nama:"FOSHAN",kode:"p76084"},
  {nama:"CHENGDU",kode:"p76085"},
  {nama:"CHONGQING",kode:"p76086"},
  {nama:"KOWLOON",kode:"p76087"},
  {nama:"TAICHUNG",kode:"p76088"},
  {nama:"HAITI",kode:"p76089"},
  {nama:"DENVER",kode:"p76090"},
  {nama:"ITALY",kode:"p78017"},
  {nama:"FRANCE",kode:"p78018"},
  {nama:"CHILE",kode:"p78019"},
  {nama:"MEXICO",kode:"p78020"},
  {nama:"OSLO",kode:"p78021"},
  {nama:"LAOS",kode:"p65064"},
  {nama:"TTM 4D P",kode:"m17"},
  {nama:"JEJU LOTTO",kode:"p65057"},
  {nama:"TOTO BEIJING",kode:"p65061"},
  {nama:"TOTO FUZHOU",kode:"p65062"},
  {nama:"BULGARIA",kode:"p65059"},
  {nama:"HUNGARY",kode:"p65058"},
  {nama:"BHUTAN",kode:"p65060"},
  {nama:"TORONTO",kode:"p65063"},
  {nama:"TTM 5D P",kode:"m51"},
  {nama:"KINGKONG P1",kode:"m83"}
];

app.get("/", (req, res) => {
  res.json({
    message: "API Result aktif",
    totalCodes: pasaran.length
  });
});

app.get("/api", (req, res) => {
  const kode = req.query.kode;

  if (!kode) {
    return res.json({
      message: "Gunakan parameter ?kode=m17",
      availableCodes: pasaran.map(x => x.kode),
      totalCodes: pasaran.length
    });
  }

  const data = pasaran.find(x => x.kode === kode);

  if (!data) {
    return res.status(404).json({
      status: false,
      message: "Kode pasaran tidak ditemukan",
      kode
    });
  }

  res.json({
    status: false,
    kode: data.kode,
    nama: data.nama,
    message: "Sumber data belum dihubungkan"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API berjalan di port ${PORT}`);
});
