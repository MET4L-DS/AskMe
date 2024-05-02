import { GoogleGenerativeAI } from "@google/generative-ai";

import { ChatsContainer, ChatBar, IconButton, Sidebar } from "../components";

import { InlineImageType } from "../types";

import { FaMagnifyingGlass } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
    setLastChatText,
    appendChat,
    setIsLoading,
} from "../features/chat/chatSlice";
import { RootType } from "../store";

const Home = () => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);

    const { prompt, currentChat, inlineImageData } = useSelector(
        (state: RootType) => state.chat!,
    );

    const dispatch = useDispatch();

    const printResponseText = (text: string) => {
        dispatch(
            appendChat({ chat: { role: "model", parts: [{ text: "" }] } }),
        );
        console.log("Print Response: ", currentChat);

        const textArray = text.split(" ");
        let emptyTextArray = [];

        textArray.forEach((word, _index) => {
            emptyTextArray.push(word);
            const text = emptyTextArray.join(" ");
            const timeout = setTimeout(() => {
                dispatch(setLastChatText({ text: text }));
                clearTimeout(timeout);
            }, _index * 50);
        });
    };

    const textAndImagePromptRun = async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const images = [inlineImageData] as [InlineImageType];

        dispatch(setIsLoading({ isLoading: true }));
        try {
            const result = await model.generateContent([prompt, ...images]);
            const response = result.response;
            dispatch(setIsLoading({ isLoading: false }));
            printResponseText(response.text());
        } catch (error) {
            console.log(error);
            dispatch(setIsLoading({ isLoading: false }));
        }
    };

    async function getResponse() {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("Get Response: ", currentChat);
        const newHistory = [...currentChat];
        console.log("New History: ", newHistory);

        const chat = model.startChat({
            history: newHistory,
        });

        dispatch(setIsLoading({ isLoading: true }));
        try {
            const result = await chat.sendMessage(prompt);
            const response = result.response;
            dispatch(setIsLoading({ isLoading: false }));
            printResponseText(response.text());
        } catch (error) {
            console.log(error);
            dispatch(setIsLoading({ isLoading: false }));
        }
    }

    return (
        <>
            <Sidebar />
            <main className="col-[3/-1] flex h-svh flex-col pb-4">
                <div className="flex items-center justify-between gap-4 p-4 ">
                    <h2 className=" mr-auto text-3xl font-semibold">
                        {currentChat[0]?.parts[0].text || "Ask Me"}
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
                    <ChatsContainer />
                    <ChatBar
                        getResponse={getResponse}
                        textAndImagePromptRun={textAndImagePromptRun}
                    />
                </div>
            </main>
        </>
    );
};

export default Home;
