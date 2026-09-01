import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const pasaran = [
  { nama: "KENTUCKY MID", kode: "p32307" },
  { nama: "ROMA", kode: "p32308" },
  { nama: "FLORIDA MID", kode: "p32309" },
  { nama: "TURIN", kode: "p32310" },
  { nama: "NEWYORK MID", kode: "p32311" },
  { nama: "CAROLINA DAY", kode: "p32312" },
  { nama: "MADRID", kode: "p32313" },
  { nama: "OREGON 03", kode: "p32314" },
  { nama: "MIAMI", kode: "p32315" },
  { nama: "OREGON 06", kode: "p32316" },
  { nama: "CALIFORNIA", kode: "p32317" },
  { nama: "FLORIDA EVE", kode: "p32318" },
  { nama: "OREGON 09", kode: "p32319" },
  { nama: "KENTUCKY EVE", kode: "p32321" },
  { nama: "CAROLINA EVE", kode: "p32322" },
  { nama: "AUSTRIA", kode: "p32323" },
  { nama: "CAMBODIA", kode: "p32324" },
  { nama: "BULLSEYE", kode: "p32325" },
  { nama: "OREGON 12", kode: "p32326" },
  { nama: "SYDNEY", kode: "p32327" },
  { nama: "GUANGDONG", kode: "p32328" },
  { nama: "CHINA", kode: "p32329" },
  { nama: "PHILIPPINES", kode: "p32330" },
  { nama: "JAPAN", kode: "p32331" },
  { nama: "SINGAPORE", kode: "p32332" },
  { nama: "CYPRUS", kode: "p32334" },
  { nama: "TAIWAN", kode: "p32335" },
  { nama: "ICELAND", kode: "p32336" },
  { nama: "HONGKONG", kode: "p32337" },
  { nama: "NEWYORK EVE", kode: "p71958" },
  { nama: "MONACO", kode: "p76081" },
  { nama: "CUBA", kode: "p76082" },
  { nama: "ECUADOR", kode: "p76083" },
  { nama: "FOSHAN", kode: "p76084" },
  { nama: "CHENGDU", kode: "p76085" },
  { nama: "CHONGQING", kode: "p76086" },
  { nama: "KOWLOON", kode: "p76087" },
  { nama: "TAICHUNG", kode: "p76088" },
  { nama: "HAITI", kode: "p76089" },
  { nama: "DENVER", kode: "p76090" },
  { nama: "ITALY", kode: "p78017" },
  { nama: "FRANCE", kode: "p78018" },
  { nama: "CHILE", kode: "p78019" },
  { nama: "MEXICO", kode: "p78020" },
  { nama: "OSLO", kode: "p78021" },
  { nama: "LAOS", kode: "p65064" },
  { nama: "TTM 4D P", kode: "m17" },
  { nama: "JEJU LOTTO", kode: "p65057" },
  { nama: "TOTO BEIJING", kode: "p65061" },
  { nama: "TOTO FUZHOU", kode: "p65062" },
  { nama: "BULGARIA", kode: "p65059" },
  { nama: "HUNGARY", kode: "p65058" },
  { nama: "BHUTAN", kode: "p65060" },
  { nama: "TORONTO", kode: "p65063" },
  { nama: "TTM 5D P", kode: "m51" },
  { nama: "KINGKONG P1", kode: "m83" }
];

const HISTORY_BASE =
  "https://96fqi69zo1.tanjung918.com/history/result";

const sourceNames = {
  m17: "4DTotoMacau",
  m51: "5DTotoMacau",
  m83: "KingKong4D"
};

/*
|--------------------------------------------------------------------------
| Ambil angka dari HTML
|--------------------------------------------------------------------------
*/

function ambilAngka(text) {
  if (!text) return "";

  // Format:
  // <div class='result-balls ...'>7</div>
  const balls = [
    ...text.matchAll(
      /result-balls[^>]*>\s*(\d+)\s*<\/div>/gi
    )
  ].map(x => x[1]);

  if (balls.length) {
    return balls.join("");
  }

  // Kalau history menggunakan <td>1234</td>
  const plain = String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plain;
}

/*
|--------------------------------------------------------------------------
| Bersihkan HTML
|--------------------------------------------------------------------------
*/

function decodeHtml(text) {
  return String(text)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

/*
|--------------------------------------------------------------------------
| Ambil tanggal + jam dari halaman history
|--------------------------------------------------------------------------
|
| Format yang kita temukan:
|
| 2026-09-01 | 18:36:00
|
*/

function ambilTanggalJam(html) {
  const text = decodeHtml(html)
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\t/g, " ");

  const match = text.match(
    /(\d{4}-\d{2}-\d{2})\s*\|\s*(\d{2}:\d{2}(?::\d{2})?)/
  );

  if (!match) {
    return null;
  }

  let tanggal = match[1];
  let jam = match[2];

  if (jam.length === 5) {
    jam += ":00";
  }

  return {
    tanggal,
    jam
  };
}

/*
|--------------------------------------------------------------------------
| Ambil result dari baris pertama tabel
|--------------------------------------------------------------------------
|
| Contoh:
|
| <tr>
|   <td>953</td>
|   <td>Selasa</td>
|   <td>2026-09-01 | 18:36:00</td>
|   <td>1428</td>
|   <td>4531</td>
|   <td>1769</td>
| </tr>
|
*/

function ambilBarisPertama(html) {
  if (!html) return null;

  const clean = decodeHtml(html)
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\t/g, " ");

  const trMatch = clean.match(/<tr\b[^>]*>([\s\S]*?)<\/tr>/i);

  if (!trMatch) {
    return null;
  }

  const row = trMatch[1];

  const cells = [
    ...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)
  ].map(x =>
    x[1]
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

  if (cells.length < 4) {
    return null;
  }

  const periode = cells[0] || "";
  const hari = cells[1] || "";
  const tanggalJam = cells[2] || "";

  const angka = cells[3] || "";

  const waktuMatch = tanggalJam.match(
    /(\d{4}-\d{2}-\d{2})\s*\|\s*(\d{2}:\d{2}(?::\d{2})?)/
  );

  if (!waktuMatch) {
    return null;
  }

  let tanggal = waktuMatch[1];
  let jam = waktuMatch[2];

  if (jam.length === 5) {
    jam += ":00";
  }

  return {
    periode,
    hari,
    tanggal,
    jam,
    angka
  };
}

/*
|--------------------------------------------------------------------------
| Timestamp untuk perbandingan
|--------------------------------------------------------------------------
*/

function buatTimestamp(tanggal, jam) {
  if (!tanggal || !jam) return 0;

  const value = `${tanggal}T${jam}`;

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return timestamp;
}

/*
|--------------------------------------------------------------------------
| Ambil history satu pasaran
|--------------------------------------------------------------------------
*/

async function ambilHistory(pasar) {
  const url =
    `${HISTORY_BASE}/${encodeURIComponent(pasar.kode)}/kosong`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  });

  if (!response.ok) {
    throw new Error(
      `History HTTP ${response.status}`
    );
  }

  const html = await response.text();

  const hasil = ambilBarisPertama(html);

  if (!hasil) {
    throw new Error(
      "Data history tidak ditemukan"
    );
  }

  return {
    status: true,
    kode: pasar.kode,
    nama: pasar.nama,
    tanggal: hasil.tanggal,
    jam: hasil.jam,
    angka: hasil.angka,
    periode: hasil.periode,
    hari: hasil.hari,
    timestamp: buatTimestamp(
      hasil.tanggal,
      hasil.jam
    )
  };
}

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "API Result aktif",
    totalCodes: pasaran.length,
    historySource: HISTORY_BASE
  });
});

/*
|--------------------------------------------------------------------------
| LIST KODE
|--------------------------------------------------------------------------
*/

app.get("/api", async (req, res) => {
  const kode = req.query.kode;

  /*
  |--------------------------------------------------------------------------
  | Tidak ada kode
  |--------------------------------------------------------------------------
  */

  if (!kode) {
    return res.json({
      status: true,
      message: "Gunakan parameter ?kode=m17",
      availableCodes: pasaran.map(x => x.kode),
      totalCodes: pasaran.length
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Cari pasaran
  |--------------------------------------------------------------------------
  */

  const pasar = pasaran.find(
    x => x.kode === kode
  );

  if (!pasar) {
    return res.status(404).json({
      status: false,
      message: "Kode pasaran tidak ditemukan",
      kode
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Ambil history
  |--------------------------------------------------------------------------
  */

  try {
    const hasil = await ambilHistory(pasar);

    return res.json(hasil);

  } catch (error) {

    console.error(
      `Gagal ${pasar.nama} (${pasar.kode}):`,
      error.message
    );

    return res.status(500).json({
      status: false,
      kode: pasar.kode,
      nama: pasar.nama,
      message: "Gagal mengambil history pasaran",
      error: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| Endpoint BARU
|--------------------------------------------------------------------------
|
| /api/latest
|
| Endpoint ini mengecek SEMUA pasaran dan memilih result
| berdasarkan tanggal + jam AKTUAL dari history.
|
*/

app.get("/api/latest", async (req, res) => {

  console.log(
    "Mengecek result terbaru semua pasaran..."
  );

  const hasilSemua = [];

  /*
  |--------------------------------------------------------------------------
  | Kita gunakan Promise.allSettled supaya kalau satu pasaran
  | gagal, pasaran lainnya tetap diproses.
  |--------------------------------------------------------------------------
  */

  const results = await Promise.allSettled(
    pasaran.map(pasar =>
      ambilHistory(pasar)
    )
  );

  results.forEach((result, index) => {

    const pasar = pasaran[index];

    if (result.status === "fulfilled") {

      hasilSemua.push(
        result.value
      );

      console.log(
        `${pasar.nama} | ${result.value.tanggal} | ${result.value.jam} | ${result.value.angka}`
      );

    } else {

      console.log(
        `${pasar.nama} | GAGAL | ${result.reason?.message || "unknown"}`
      );

    }
  });

  /*
  |--------------------------------------------------------------------------
  | Tidak ada data
  |--------------------------------------------------------------------------
  */

  if (!hasilSemua.length) {

    return res.status(404).json({
      status: false,
      message: "Tidak ada result history yang berhasil diambil"
    });

  }

  /*
  |--------------------------------------------------------------------------
  | URUTKAN BERDASARKAN TANGGAL + JAM AKTUAL
  |--------------------------------------------------------------------------
  */

  hasilSemua.sort(
    (a, b) =>
      b.timestamp - a.timestamp
  );

  /*
  |--------------------------------------------------------------------------
  | Result paling baru
  |--------------------------------------------------------------------------
  */

  const terbaru = hasilSemua[0];

  console.log(
    "RESULT TERBARU:",
    terbaru.nama,
    terbaru.tanggal,
    terbaru.jam,
    terbaru.angka
  );

  return res.json({
    status: true,

    kode: terbaru.kode,

    nama: terbaru.nama,

    tanggal: terbaru.tanggal,

    jam: terbaru.jam,

    angka: terbaru.angka,

    periode: terbaru.periode,

    hari: terbaru.hari,

    timestamp: terbaru.timestamp,

    totalPasaranDicek:
      hasilSemua.length
  });
});

/*
|--------------------------------------------------------------------------
| PORT
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `API berjalan di port ${PORT}`
  );

});
