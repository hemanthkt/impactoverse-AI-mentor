const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

let conversationHistory = [];

app.get("/", (req, res) => {
  res.send("DeepSeek Chatbot API");
});

app.post("/chat", async (req, res) => {
  console.log(req.body.message);

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [...conversationHistory, req.body.message],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    conversationHistory.push(req.body.message, {
      role: "assistant",
      content: aiResponse,
    });

    res.json({ text: aiResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
