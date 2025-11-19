import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { preference_id } = req.query;

  const dbPath = path.join(process.cwd(), "payment-db.json");

  // Se o arquivo não existe, retorna falso
  if (!fs.existsSync(dbPath)) {
    return res.json({ paid: false });
  }

  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  const record = db[preference_id];

  if (!record) return res.json({ paid: false });

  return res.json({ paid: record.paid });
}
