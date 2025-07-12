import generateResponse from "../services/openai.service.js";

export const chatWithAI = async (req, res) => {
	const { message } = req.body;
	if (!message) return res.status(400).json({ error: "Message is required" });

	try {
		const reply = await generateResponse(message);
		res.status(200).json({ success: true, data: reply });
	} catch (error) {
		res.status(500).json({ error: "Failed to get response from AI." });
	}
};
