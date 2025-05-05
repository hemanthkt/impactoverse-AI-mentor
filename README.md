# 🌌 Impactoverse AI Mentor

An AI-powered chat mentor that helps users interact with educational PDFs and documents. Built using DeepSeek API, FAISS, and Docling for contextual PDF understanding. Combines two separate backends: one for open-source AI models and another for MongoDB-based data management.

---

## 🔐 Environment Setup

Create a `.env` file in the **Node.js backend** and add the following:

DEEPSEEK_API_KEY=your_deepseek_api_key
MONGO_URI=your_mongodb_connection_string

## 🚀 Tech Stack

**Frontend:**
-  React

**Backend:**
-  Node.js (API & MongoDB)
-  FastAPI (Open-source models)
-  Docling, FAISS, SentenceTransformers

**AI & NLP:**
-  DeepSeek API
-  Sentence Transformers
-  FAISS (Facebook AI Similarity Search)
-  Docling for parsing PDFs

---

## 🛠️ Installation

### 🔧 FastAPI Backend for AI Models

1. **Navigate to the backend folder:**
    
   cd backend

2. **Create a virtual environment:**

   python3.11 -m venv parse

3. **Activate the virtual enviornment**

     *On Windows*
      parse\Scripts\activate

     *On macOS/Linux*
     source parse/bin/activate

4. **Install dependencies:**

    pip install fastapi uvicorn faiss-cpu sentence-transformers docling python-multipart

5. **Run the FastAPI server:**
    
    uvicorn app.app:app --reload

    *This will start the backend server on http://localhost:8000*


 ### 🗃️ Node.js + MongoDB Backend

1. **Navigate to the server directory:**
    
    cd backend
    npm install

2. **Run MongoDB server**

   node server.js

*⚠️ Ensure MongoDB is installed and running locally or provide a cloud URI.*

### 💻 React Frontend 

1. **Navigate to the frontend directory:**
   cd frontend

2. **Install dependencies**
   npm install


3. **Start the frontend server:**
   npm run dev

## 🌟 Features
- AI Mentor using DeepSeek API

- Intelligent PDF parsing with Docling

- Vector embeddings via Sentence Transformers

- Semantic search using FAISS

- MongoDB integration for chat and user history

- Modular backend architecture (FastAPI + Node.js)
