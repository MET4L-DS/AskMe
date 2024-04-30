import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prevHistory } from "../prevHistory";
import { HistoryType } from "../types";

import { ChatsContainer, ChatBar, IconButton, Sidebar } from "../components";

import { InlineImageType } from "../types";

import { FaMagnifyingGlass } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";

const Home = () => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);

    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState("");
    const [inlineImageData, setInlineImageData] = useState({});
    const [history, setHistory] = useState<HistoryType>([]);
    const [isLoading, setIsLoading] = useState(false);

    const printResponseText = (text: string) => {
        const textArray = text.split(" ");
        let emptyTextArray = [];

        textArray.forEach((word, _index) => {
            emptyTextArray.push(word);
            const text = emptyTextArray.join(" ");
            const timeout = setTimeout(() => {
                setHistory((history) => {
                    let updatedHistory = [...history];
                    updatedHistory[updatedHistory.length - 1].parts[0].text =
                        text;
                    return updatedHistory;
                });
                clearTimeout(timeout);
            }, _index * 50);
        });
    };

    const textAndImagePromptRun = async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const images = [inlineImageData] as [InlineImageType];

        setIsLoading(true);
        const result = await model.generateContent([prompt, ...images]);
        const response = await result.response;
        setIsLoading(false);

        setHistory((prevHistory) => [
            ...prevHistory,
            { role: "model", parts: [{ text: "" }] },
        ]);
        printResponseText(response.text());
    };

    async function getResponse() {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: history,
        });

        setIsLoading(true);
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        setIsLoading(false);

        setHistory((prevHistory) => [
            ...prevHistory,
            { role: "model", parts: [{ text: "" }] },
        ]);

        printResponseText(response.text());
    }

    const handleInput = () => {
        setHistory((prevHistory) => [
            ...prevHistory,
            { role: "user", parts: [{ text: prompt }] },
        ]);

        if (image) console.log("image is set");
        image ? textAndImagePromptRun() : getResponse();

        setPrompt("");
        setImage("");
        setInlineImageData({});
    };

    const handleFileInput = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result !== null) {
                const base64Img = reader.result as string;
                setImage(base64Img);
                setInlineImageData({
                    inlineData: {
                        data: base64Img.split(",")[1],
                        mimeType: file.type,
                    },
                });
            }
            // console.log(reader.result);
        };
    };

    return (
        <>
            <Sidebar setHistory={setHistory} />
            <main className="col-[3/-1] flex h-svh flex-col pb-4">
                <div className="flex items-center justify-between gap-4 p-4 ">
                    <h2 className=" mr-auto text-3xl font-semibold">
                        Warning Messages Sample
                    </h2>
                    <IconButton
                        color="var(--customGray)"
                        bgColor="var(--customNeutral)"
                    >
                        <FaMagnifyingGlass />
                    </IconButton>
                    <IconButton
                        color="var(--customGray)"
                        bgColor="var(--customNeutral)"
                    >
                        <HiDotsHorizontal />
                    </IconButton>
                </div>
                <div className="col-[1/-1] flex-grow overflow-y-scroll rounded-lg bg-customNeutral px-32 py-4 text-sm">
                    <ChatsContainer history={history} isLoading={isLoading} />
                    <ChatBar
                        prompt={prompt}
                        setPrompt={setPrompt}
                        handleInput={handleInput}
                        handleFileInput={handleFileInput}
                        image={image}
                        setImage={setImage}
                    />
                </div>
            </main>
        </>
    );
};

export default Home;
