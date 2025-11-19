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

      if (info.status === "approved") {
        console.log("Pagamento confirmado!", info.payer.email);
        // Aqui você aplicaria lógica real de liberar acesso no seu banco
      }
    }

    res.send("OK");
  } catch (e) {
    res.status(500).send("Webhook error");
  }
}
