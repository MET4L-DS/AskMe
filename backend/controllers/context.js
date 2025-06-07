import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	RunnableSequence,
	RunnablePassthrough,
} from "@langchain/core/runnables";
import { TaskType } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const getContext = async (req, res) => {
	const { prompt } = req.body;

	try {
		console.log("Processing prompt:", prompt);

		// Standalone question template
		const standaloneQuestionTemplate = `Given a prompt, generate a stand alone question from the prompt.
Prompt: {prompt}
Stand alone question: `;

		const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
			standaloneQuestionTemplate
		);

		// Prompt with context template
		const promptWithContextTemplate = `
Answer the question by extracting relevant information on The Bharatiya Nyaya Sanhita (BNS) provided in the 'Context' below. Highlight the Sections of The Bharatiya Nyaya Sanhita (BNS) that are applicable in your responses. Do not use the word 'context' in your responses. Use suitable Markdown format of your responses. If the question is not related, just say "Question is irrelevant".
 
Context: {context}
Prompt: {prompt}
Answer: `;

		const promptWithContextPrompt = PromptTemplate.fromTemplate(
			promptWithContextTemplate
		);

		// Initialize LLM
		const llm = new ChatGoogleGenerativeAI({
			apiKey: process.env.GOOGLE_API_KEY,
			model: "gemini-2.0-flash",
		});

		// Standalone question chain
		const standaloneQuestionChain = RunnableSequence.from([
			standaloneQuestionPrompt,
			llm,
			new StringOutputParser(),
		]);

		// Initialize embeddings and vector store
		const embeddings = new GoogleGenerativeAIEmbeddings({
			apiKey: process.env.GOOGLE_API_KEY,
			model: "text-embedding-004",
			taskType: TaskType.RETRIEVAL_DOCUMENT,
		});

		const directory = "./BNSVectorStore";
		const vectorStore = await FaissStore.load(directory, embeddings);
		const retriever = vectorStore.asRetriever(100);

		// Retrieval chain
		const retrievalChain = RunnableSequence.from([
			(prevResult) => prevResult.standaloneQuestion,
			retriever,
			(content) =>
				content.map((content) => content.pageContent).join("\n\n"),
		]);

		// Answer chain
		const answerChain = RunnableSequence.from([
			promptWithContextPrompt,
			llm,
			new StringOutputParser(),
		]);

		// Main chain
		const chain = RunnableSequence.from([
			{
				standaloneQuestion: standaloneQuestionChain,
				originalInput: new RunnablePassthrough(),
			},
			{
				context: retrievalChain,
				prompt: ({ originalInput }) => originalInput.prompt,
			},
			answerChain,
		]);

		// Execute the chain
		const response = await chain.invoke({ prompt });

		console.log("Generated response successfully");
		res.status(200).json({
			prompt: prompt,
			response: response,
			success: true,
		});
	} catch (error) {
		console.error("Error in getContext:", error);
		res.status(500).json({
			msg: error.message,
			success: false,
		});
	}
};

export { getContext };
