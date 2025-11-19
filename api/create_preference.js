import mercadopago from "mercadopago";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
  });

  try {
    const { price, return_url } = req.body;

    const preference = await mercadopago.preferences.create({
      items: [{
        title: "Acesso Vitalício – Beta",
        quantity: 1,
        currency_id: "BRL",
        unit_price: Number(price)
      }],
      back_urls: {
        success: return_url,
        failure: return_url,
        pending: return_url
      },
      auto_return: "approved",
      notification_url: process.env.WEBHOOK_URL,
      metadata: {
        preference_id: preference?.body?.id
      }
    });

    // Salva inicial no DB
    const dbPath = path.join(process.cwd(), "payment-db.json");
    let db = {};

    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    }

    db[preference.body.id] = { paid: false };

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.json({
      init_point: preference.body.init_point,
      preference_id: preference.body.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
