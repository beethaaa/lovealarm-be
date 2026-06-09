const { AzureOpenAI } = require("openai");

const endpoint = process.env.ENDPOINT_URL;
const modelName = process.env.DEPLOYMENT_MODEL;
const apiVersion = process.env.API_VERSION;
const apiKey = process.env.AZURE_OPENAI_API_KEY;

const client = new AzureOpenAI({
  endpoint,
  apiKey,
  deployment: modelName,
  apiVersion,
});

async function getConversationStart(req, res) {
  try {
    const { interests } = req.body;

    const prompt = `
  Task: Viết 4 câu bắt chuyện tự nhiên, duyên dáng, không sáo rỗng.
  Style: Ngôn ngữ nói, trẻ trung, tạo tò mò.
  ${interests?.length > 0 && `Context: Sở thích người kia: ${interests}`}
  Rules:
    Max 20 từ/câu.
    Không emoji, không ngoặc kép.
    Tránh: Chào em/bạn, làm quen.
  `;

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful dating expert. 
                Your response MUST be a JSON array of strings.
                Example:
                [
                "message 1",
                "message 2",
                "message 3"
                ]
                Do not return any other text.`,
        },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 13107,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: modelName,
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    console.error("OpenAi failed", error);
    res.status(503).json({
      error: "AI service temporarily unavailable",
    });
  }
}

const recommendGift = async (req, res) => {
  try {
    const { interests, event, budget, gender, age } = req.body;
    const prompt = `
  Task: Đề xuất 5 món quà phù hợp với các tiêu chí sau:
  - Vị trí: Việt Nam
  - Giới tính: ${gender}
  - Độ tuổi: ${age}
  - Sở thích: ${interests}
  - Dịp: ${event}
  - Ngân sách: ${budget}
  Style: Ngôn ngữ nói, trẻ trung, tạo tò mò.
  Rules:
    Mô tả ngắn về từng món quà.
    Mỗi món kèm giá dự kiến.
    Max 25 từ/món quà.
    Không emoji, không ngoặc kép.
    Không chào.
  `;

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful dating expert.`,
        },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "gift_recommendations",
          schema: {
            type: "object",
            properties: {
              gifts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    description: {
                      type: "string",
                    },
                    price: {
                      type: "number",
                    },
                  },
                  required: ["description", "price"],
                  additionalProperties: false,
                },
              },
            },
            required: ["gifts"],
            additionalProperties: false,
          },
        },
      },
      max_completion_tokens: 13107,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: modelName,
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    console.error("OpenAi failed", error);
    res.status(503).json({
      error: "AI service temporarily unavailable",
    });
  }
};

const recommendEntertainmentAddress = async (req, res) => {
  try {
    const { interests, event, budget, gender, age, address } = req.body;
    const prompt = `
  Task: Đề xuất 5 địa điểm phù hợp với các tiêu chí sau:
  - Vị trí: ${address}
  - Giới tính: ${gender}
  - Độ tuổi: ${age}
  - Sở thích: ${interests}
  - Dịp: ${event}
  - Ngân sách: ${budget}
  Style: Ngôn ngữ nói, trẻ trung, tạo tò mò.
  Rules:
    Mô tả ngắn về vibe của từng địa điểm.
    Max 30 từ/địa điểm.
    Không emoji, không ngoặc kép.
    Không chào.
  `;

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful dating expert.`,
        },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "entertainment_address_recommendations",
          schema: {
            type: "object",
            properties: {
              addresses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                    price: {
                      type: "number",
                    },
                  },
                  required: ["name", "description", "address", "price"],
                  additionalProperties: false,
                },
              },
            },
            required: ["addresses"],
            additionalProperties: false,
          },
        },
      },
      max_completion_tokens: 13107,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: modelName,
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    console.error("OpenAi failed", error);
    res.status(503).json({
      error: "AI service temporarily unavailable",
    });
  }
};

module.exports = {
  getConversationStart,
  recommendGift,
  recommendEntertainmentAddress,
};
