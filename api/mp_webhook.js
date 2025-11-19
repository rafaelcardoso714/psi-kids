import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const data = req.body;

    if (data.type === "payment") {
      const paymentId = data.data.id;

      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      });

      const info = await response.json();

      if (!info || !info.metadata) {
        return res.status(200).send("OK");
      }

      const preferenceId = info.metadata.preference_id;

      const dbPath = path.join(process.cwd(), "payment-db.json");
      let db = {};

      if (fs.existsSync(dbPath)) {
        db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
      }

      if (info.status === "approved") {
        db[preferenceId] = { paid: true };
        console.log("Pagamento aprovado:", preferenceId);
      }

      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }

    res.send("OK");

  } catch (e) {
    console.log("Webhook error:", e);
    res.status(500).send("Webhook error");
  }
}
