// const mongoose = require("mongoose");

// // Define a schema for individual messages
// const messageSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["user", "ai"],
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Define a schema for chat conversations
// const chatSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true,
//   },
//   title: {
//     type: String,
//     default: function () {
//       // Generate a title based on the date if none is provided
//       return `Chat ${new Date().toLocaleDateString()}`;
//     },
//   },
//   messages: [messageSchema],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Update the updatedAt timestamp before saving
// chatSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model("Chat", chatSchema);

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chat_id: { type: String, required: true }, // Unique ID for each chat
  type: { type: String, required: true }, // "user" or "ai"
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
