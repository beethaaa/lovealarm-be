const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const openerSchema = z
  .array(z.string())
  .length(4)
  .describe("Exactly 4 short conversation starters");

const getConversationStart = async (req, res) => {
  try {
    const { interests } = req.body;

    const prompt = `
Tạo 4 câu bắt chuyện ngắn gọn, tự nhiên, thú vị.
Sở thích người kia: ${interests}

- Mỗi câu tối đa 20 từ
- Không emoji
- Không dùng dấu ngoặc kép
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,

      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(openerSchema),
        temperature: 0.7,
      },
    });

    const parsed = openerSchema.parse(JSON.parse(response.text));

    return res.json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gemini error" });
  }
};

module.exports = { getConversationStart };
