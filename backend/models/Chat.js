const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chat_id: { type: String, required: true }, // Unique ID for each chat
  type: { type: String, required: true }, // "user" or "ai"
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;