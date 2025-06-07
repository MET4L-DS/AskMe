import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	RunnableSequence,
	RunnablePassthrough,
} from "@langchain/core/runnables";

import dotenv from "dotenv";
dotenv.config();

const standaloneQuestionTemplate = `Given a prompt, generate a stand alone question from the prompt.
Prompt: {prompt}
Stand alone question: `;

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
	standaloneQuestionTemplate
);
// console.log({ standaloneQuestionPrompt });

const promptWithContextTemplate = `
Answer the question by extracting relevant information on The Bharatiya Nyaya Sanhita (BNS) provided in the 'Context' below. Highlight the Sections of The Bharatiya Nyaya Sanhita (BNS) that are applicable in your responses. Do not use the word 'context' in your responses. Use suitable Markdown format of your responses. If the question is not related, just say "Question is irrelevant".
 
Context: {context}
Prompt: {prompt}
Answer: `;

const promptWithContextPrompt = PromptTemplate.fromTemplate(
	promptWithContextTemplate
);
// console.log({ promptWithContextPrompt });

const llm = new ChatGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_API_KEY,
	model: "gemini-2.0-flash",
});

const standaloneQuestionChain = RunnableSequence.from([
	standaloneQuestionPrompt,
	llm,
	new StringOutputParser(),
]);

const embedding = new GoogleGenerativeAIEmbeddings({
	apiKey: process.env.GOOGLE_API_KEY,
	model: "text-embedding-004",
});
const vectorStore = await FaissStore.load("./BNSVectorStore", embedding);
const retriever = vectorStore.asRetriever(100);

const retrivalChain = RunnableSequence.from([
	(prevResult) => prevResult.standaloneQuestion,
	retriever,
	(content) => content.map((content) => content.pageContent).join("\n\n"),
]);

const answerChain = RunnableSequence.from([
	promptWithContextPrompt,
	llm,
	new StringOutputParser(),
]);

const chain = RunnableSequence.from([
	{
		standaloneQuestion: standaloneQuestionChain,
		originalInput: new RunnablePassthrough(),
	},
	(prevResult) => {
		console.log(prevResult);
		return prevResult;
	},
	{
		context: retrivalChain,
		prompt: ({ originalInput }) => originalInput.prompt,
	},
	(prevResult) => {
		console.log(prevResult);
		return prevResult;
	},
	answerChain,
]);

const response = await chain.invoke({
	prompt: "What are the laws for cheating case?",
});
console.log({ response });
