const express = require("express"); // Web framework for building APIs
const axios = require("axios"); // HTTP client for making API requests
const mongoose = require("mongoose");
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
require("dotenv").config(); // Load environment variables from .env file

const app = express();
app.use(cors()); // Enable CORS policy
app.use(express.json()); // Parse incoming JSON request bodies

let conversationHistory = []; // Array to store the conversation history

// Root endpoint
app.get("/", (req, res) => {
  res.send("DeepSeek Chatbot API"); // Simple response to verify API is running
});

// Chat endpoint to handle user messages and AI responses
app.post("/chat", async (req, res) => {
  console.log(req.body.message); // Log the incoming user message

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions", // DeepSeek API endpoint
      {
        model: "deepseek-chat", // AI model to use
        messages: [...conversationHistory, req.body.message], // Include conversation history and new message
        temperature: 0.7, // Parameter to control AI response randomness
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, // Authorization header with API key
          "Content-Type": "application/json", // Specify JSON content type
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content; // Extract AI response from API response

    // Update conversation history with user and AI messages
    conversationHistory.push(req.body.message, {
      role: "assistant",
      content: aiResponse,
    });

    res.json({ text: aiResponse }); // Send AI response back to the client
  } catch (error) {
    console.log(error); // Log error details
    res.status(500).json({ error: "AI processing failed" }); // Respond with error message
  }
});

const PORT = process.env.PORT || 5000; // Define the port for the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server and log the running port
