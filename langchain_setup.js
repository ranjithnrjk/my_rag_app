import 'dotenv/config';

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

import { retriever } from './utils/retriever.js';
import { combineDocuments } from './utils/combineDocuments.js';

// === Set up the LLM ===
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.8,
});

// === Prompt Templates ===
const standaloneQuestionTemplate = `Given a question, convert it into a standalone question.
question: {question}
standalone question:`;

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given 
question about Scrimba based on the context provided. Try to find the answer in the
context + conversation history.

Conversation history:
{history}

If you really don't know the answer, say "I'm sorry, I don't know the answer to that." 
And direct the questioner to email help@scrimba.com. Don't try to make up an answer. 
Always speak as if you were chatting to a friend.
context: {context}
question: {question}
answer:`;

// === Prompt Chains ===
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

const standaloneQuestionChain = RunnableSequence.from([
  standaloneQuestionPrompt,
  llm,
  new StringOutputParser(),
]);

const retrieverChain = RunnableSequence.from([
  (prevResults) => prevResults.standalone_question,
  retriever,
  combineDocuments,
]);

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneQuestionChain,
    original_input: new RunnablePassthrough(),
  },
  {
    context: retrieverChain,
    question: ({ original_input }) => original_input.question,
    history: ({ original_input }) => {
      const history = original_input.history || [];
      return history
        .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
        .join("\n");
    },
  },
  answerChain,
]);

export { chain };
