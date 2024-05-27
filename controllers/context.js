import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const getContext = async (req, res) => {
    const { prompt } = req.body;

    try {
        console.log(prompt);
        const pinecone = new Pinecone({
            apiKey: "9b0c2770-8107-48e3-9b4a-b12f71b88372",
        });

        const pineconeIndex = pinecone.Index("law-gpt-embeddings");

        const embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: "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", // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
            model: "intfloat/multilingual-e5-large",
        });

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
        });

        const data = await vectorStore.similaritySearch(prompt, 10);

        console.log(data);
        res.status(200).json({ prompt: prompt, data: data });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export { getContext };
