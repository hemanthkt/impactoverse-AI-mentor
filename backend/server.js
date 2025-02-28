// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const Message = require("./models/Chat");

// const { v4: uuidv4 } = require("uuid"); // Import UUID for unique chat_id

// const app = express();
// app.use(cors());
// app.use(express.json());

// // connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

// let conversationHistory = [];

// app.get("/", (req, res) => {
//   res.send("DeepSeek Chatbot API");
// });

// app.post("/chat", async (req, res) => {
//   console.log(req.body.message);

//   // In server.js, enhance the /chats route to provide more information:
//   app.get("/chats", async (req, res) => {
//     try {
//       const chatIds = await Message.distinct("chat_id");

//       // For each chat ID, get the first message to use as a title
//       const chatList = await Promise.all(
//         chatIds.map(async (chat_id) => {
//           const firstMessage = await Message.findOne({ chat_id, type: "user" })
//             .sort({ createdAt: 1 })
//             .limit(1);

//           const title = firstMessage
//             ? firstMessage.content.substring(0, 30) +
//               (firstMessage.content.length > 30 ? "..." : "")
//             : `Chat ${chat_id.slice(-4)}`;

//           return {
//             chat_id,
//             title,
//             timestamp: firstMessage ? firstMessage.createdAt : new Date(),
//           };
//         })
//       );

//       // Sort by most recent first
//       chatList.sort((a, b) => b.timestamp - a.timestamp);

//       res.json(chatList);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Failed to fetch chat IDs" });
//     }
//   });

//   try {
//     // let { chat_id, message } = req.body;

//     // // If chat_id is not provided, create a new one
//     // if (!chat_id) {
//     //   chat_id = uuidv4();
//     // }

//     const response = await axios.post(
//       "https://api.deepseek.com/v1/chat/completions",
//       {
//         model: "deepseek-chat",
//         messages: [...conversationHistory, req.body.message],
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const aiResponse = response.data.choices[0].message.content;
//     conversationHistory.push(req.body.message, {
//       role: "assistant",
//       content: aiResponse,
//     });

//     // Save user message to MongoDB
//     const userMessage = new Message({
//       chat_id,
//       type: "user",
//       content: req.body.message.content,
//     });
//     await userMessage.save();

//     // Save AI response to MongoDB
//     const aiMessage = new Message({
//       chat_id,
//       type: "ai",
//       content: aiResponse,
//     });
//     await aiMessage.save();

//     res.json({ text: aiResponse, chat_id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "AI processing failed" });
//   }
// });

// // This route will return the chat history for a given chat_id.
// app.get("/chats/:chat_id", async (req, res) => {
//   try {
//     const { chat_id } = req.params;
//     const chatHistory = await Message.find({ chat_id }).sort("createdAt");

//     res.json(chatHistory);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to fetch chat history" });
//   }
// });

// // This route will return all chat IDs.
// app.get("/chats", async (req, res) => {
//   try {
//     const chatIds = await Message.distinct("chat_id");

//     res.json(chatIds.map((chat_id) => ({ chat_id })));
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to fetch chat IDs" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Message = require("./models/Chat");

const { v4: uuidv4 } = require("uuid"); // For unique chat_id

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Initialize conversation history
let conversationHistory = [];

// Home route
app.get("/", (req, res) => {
  res.send("DeepSeek Chatbot API");
});

// Chat route for handling user messages
app.post("/chat", async (req, res) => {
  try {
    let { chat_id, message } = req.body;

    // Generate a new chat_id if not provided
    if (!chat_id) {
      chat_id = uuidv4();
    }

    // Call external AI API
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [...conversationHistory, message],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Get AI response
    const aiResponse = response.data.choices[0].message.content;

    // Update conversation history
    conversationHistory.push(message, { role: "assistant", content: aiResponse });

    // Save messages to MongoDB
    const userMessage = new Message({
      chat_id,
      type: "user",
      content: message.content,
    });
    await userMessage.save();

    const aiMessage = new Message({
      chat_id,
      type: "ai",
      content: aiResponse,
    });
    await aiMessage.save();

    res.json({ text: aiResponse, chat_id });
  } catch (error) {
    console.error("Error in /chat route:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

// Route to get chat history by chat_id
app.get("/chats/:chat_id", async (req, res) => {
  try {
    const { chat_id } = req.params;
    const chatHistory = await Message.find({ chat_id }).sort("createdAt");

    res.json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Route to fetch a list of chat summaries
app.get("/chats", async (req, res) => {
  try {
    const chatIds = await Message.distinct("chat_id");

    // Fetch the first user message for each chat to use as a title
    const chatList = await Promise.all(
      chatIds.map(async (chat_id) => {
        const firstMessage = await Message.findOne({ chat_id, type: "user" })
          .sort({ createdAt: 1 })
          .limit(1);

        const title = firstMessage
          ? firstMessage.content.substring(0, 30) +
            (firstMessage.content.length > 30 ? "..." : "")
          : `Chat ${chat_id.slice(-4)}`;

        return {
          chat_id,
          title,
          timestamp: firstMessage ? firstMessage.createdAt : new Date(),
        };
      })
    );

    // Sort chats by most recent
    chatList.sort((a, b) => b.timestamp - a.timestamp);

    res.json(chatList);
  } catch (error) {
    console.error("Error fetching chat summaries:", error);
    res.status(500).json({ error: "Failed to fetch chat summaries" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
