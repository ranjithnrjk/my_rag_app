# 📚 RAG Chatbot with LangChain.js, Supabase, and Google Generative AI

This project implements a **Retrieval-Augmented Generation (RAG)** chatbot using:

- **LangChain.js**
- **Supabase** (vector store)
- **Google Generative AI** (Gemini Flash / 1.5)
- **HTML/CSS** frontend
- **Express.js** backend

Users can query information based on documents loaded into a vector database, with conversation history for more context-aware answers.

---

## 🚀 Features

- 🔍 Document-based question answering using a vector retriever
- 🧠 Context-aware responses via conversation history
- 🛠️ Modular LangChain setup
- 🌐 Simple HTML/CSS frontend
- ⚙️ Lightweight Express server for backend logic

---

## 📁 Project Structure

```plaintext
rag-chatbot/
│
├── public/
│   ├── index.html
│   ├── index.css
│   ├── script.js
│
├── utils/
│   ├── retriever.js
│   └── combineDocuments.js
│
├── langchain_setup.js
├── server.js
├── .env
└── README.md
```

---

## 🔧 Prerequisites

- Node.js (v18 or higher)
- A [Google Generative AI](https://makersuite.google.com/app/apikey) API key
- A [Supabase](https://supabase.com) project with:
  - A `documents` table storing content and embeddings
  - A `match_documents` RPC function for semantic search

---

## 📦 Install Dependencies

```bash
npm install express dotenv @langchain/google-genai @langchain/core @langchain/community @supabase/supabase-js
```

---

## 🔐 .env File Setup

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_genai_api_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PRIVATE_KEY=your_supabase_private_key
```

---

## ⚙️ Backend Setup (`server.js`)

- Serves static frontend files from `/public`
- Receives chat input and responds using the LangChain pipeline

```bash
node server.js
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to access the chatbot.

---

## 🧠 LangChain Pipeline

The LangChain chain includes:

- **Standalone Question Generation**:
  Reformulates the question to a self-contained one.

- **Document Retrieval**:
  Queries relevant content from Supabase vector store.

- **Answer Generation**:
  Combines context, history, and the question to generate a final response.

---

## 📜 Prompt Templates

### Standalone Question Template

```txt
Given a question, convert it into a standalone question.
question: {question}
standalone question:
```

### Final Answer Prompt Template

```txt
You are a helpful assistant who answers questions based on the context and previous conversation.

Conversation history:
{history}

context: {context}
question: {question}
answer:
```

---

## 🌐 Frontend Setup

### `public/index.html`

A simple layout with:

- Header
- Chat container
- Text input form

### `public/index.css`

Styled UI with speech bubbles for user and AI, responsive layout.

### `public/script.js`

Handles:

- Sending input + history to server
- Updating chat window
- Tracking history in the browser session

---

## 🧪 Running the App

1. Start the server:

```bash
node server.js
```

2. Visit:

```
http://localhost:3000
```

3. Ask a question about your documents.

---

## 🧠 How Conversation History Works

- Messages are tracked as an array of `{ role: "user" | "ai", content: string }`
- History is passed to the prompt as part of the LangChain chain input
- You can customize how much of the history to include by trimming it in the prompt logic

---

## 📌 Example `.env`

```env
GOOGLE_API_KEY=AIzaSyXXXX...
SUPABASE_URL=https://abcd.supabase.co
SUPABASE_PRIVATE_KEY=your-secret-key
```

---

## 📦 Future Ideas

- Upload documents from UI and embed on-the-fly
- Limit context size using token count
- Add user authentication and persistent history
- Switch to React/Vue frontend

---

## 📃 License

MIT License

---

## 🛠️ Built With

- [LangChain.js](https://js.langchain.com)
- [Supabase](https://supabase.com)
- [Google Generative AI](https://ai.google.dev/)
- [Express](https://expressjs.com)
- HTML + CSS
