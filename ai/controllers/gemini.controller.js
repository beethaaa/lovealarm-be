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
    !interests || interests === ""
      ? `
  Role: Bạn là một chuyên gia tâm lý và là người có sức hút lớn trên các ứng dụng hẹn hò. Bạn có lối nói chuyện dí dỏm, thông minh và cực kỳ tự nhiên.

Task: Hãy viết 4 câu mở đầu tin nhắn (ice-breakers) để bắt đầu một cuộc trò chuyện mới.

Style Guidelines:

    Tuyệt đối tránh các câu chào hỏi rập khuôn hoặc quá trang trọng.

    Tập trung vào việc tạo ra sự tò mò hoặc một sự đồng cảm nhẹ nhàng.

    Ngôn ngữ sử dụng phải là ngôn ngữ nói hàng ngày của giới trẻ, gần gũi nhưng vẫn lịch sự.

Constraints:

    Mỗi câu tối đa 20 từ.

    Không sử dụng emoji.

    Không sử dụng dấu ngoặc kép.

    Trả về danh sách thuần văn bản.
  `
      : 
  `
  Role: Bạn là một chuyên gia tâm lý và là người có sức hút lớn trên các ứng dụng hẹn hò. Bạn có lối nói chuyện dí dỏm, thông minh và cực kỳ tự nhiên.
 Sở thích người kia: ${interests}
Task: Hãy viết 4 câu mở đầu tin nhắn (ice-breakers) để bắt đầu một cuộc trò chuyện mới.

Style Guidelines:

    Tuyệt đối tránh các câu chào hỏi rập khuôn hoặc quá trang trọng.

    Tập trung vào việc tạo ra sự tò mò hoặc một sự đồng cảm nhẹ nhàng.

    Ngôn ngữ sử dụng phải là ngôn ngữ nói hàng ngày của giới trẻ, gần gũi nhưng vẫn lịch sự.

Constraints:

    Mỗi câu tối đa 20 từ.

    Không sử dụng emoji.

    Không sử dụng dấu ngoặc kép.

    Trả về danh sách thuần văn bản.
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
