let memory = {};

export default async function handler(req, res) {
  const { preference_id } = req.query;
  res.json(memory[preference_id] || { paid: false });
}
