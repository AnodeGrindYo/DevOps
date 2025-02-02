import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/completions",
      {
        model: "deepseek/deepseek-r1:free",
        prompt,
        max_tokens: 200,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ output: response.data.choices[0].text });
  } catch (error) {
    console.error("Erreur API OpenRouter :", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la génération des instructions" });
  }
}
