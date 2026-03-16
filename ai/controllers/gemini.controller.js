const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY1,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
];
let currentKey = 0;
const getNextKey = () => {
  const key = GEMINI_KEYS[currentKey];
  currentKey = (currentKey + 1) % GEMINI_KEYS.length;
  return key;
};
const getAiInstance = () => {
  return new GoogleGenAI({
    apiKey: getNextKey(),
  });
};

const openerSchema = z
  .array(z.string())
  .length(4)
  .describe("Exactly 4 short conversation starters");

const getConversationStart = async (req, res) => {
  const { interests } = req.body;

  const prompt =
    (!interests || interests === "")
      ? `
  Role: Dating expert.
  Task: Viết 4 câu bắt chuyện tự nhiên, duyên dáng, không sáo rỗng.
  Style: Ngôn ngữ nói, trẻ trung, tạo tò mò.
  Rules:
    Max 20 từ/câu.
    Không emoji, không ngoặc kép.
    Tránh: Chào em/bạn, làm quen.
  `
      : 
  `
  
  
  Role: Dating expert.
  Task: Viết 4 câu bắt chuyện tự nhiên, duyên dáng, không sáo rỗng.
  Context: Sở thích người kia: ${interests}
  Style: Ngôn ngữ nói, trẻ trung, tạo tò mò.
  Rules:

    Max 20 từ/câu.

    Không emoji, không ngoặc kép.

    Tránh: Chào em/bạn, làm quen.
  `;

  // mỗi lần prompt sẽ thử 1 key mới
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const apiKey = getNextKey(); // chuyển sang key mới

    try {
      console.log("Using Gemini key:", apiKey.slice(0, 10));

      const ai = getAiInstance(apiKey);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
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
      // nếu 1 key lỗi thì sẽ in ra lỗi và quay lại vòng lặp để thử key mới
      console.error("Gemini failed with key:", apiKey.slice(0, 10));

      if (i === GEMINI_KEYS.length - 1) {
        return res.status(503).json({
          error: "AI service temporarily unavailable",
        });
      }
    }
  }
};

module.exports = { getConversationStart };
