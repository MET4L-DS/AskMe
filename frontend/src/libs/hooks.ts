import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RootType } from "../store";
import { ContextType, HistoryType, InlineImageType } from "../types";
import {
    setLastChatText,
    setIsLoading,
    setCurrentChat,
    setId,
} from "../features/chat/chatSlice";
import { setAllChats, updateIndividualChat } from "../features/main/mainSlice";
import {
    createGenerativeAI,
    addChatsInFirestore,
    updateChatsInFirestore,
    safetySettings,
} from "./utils";
import { Timestamp } from "firebase/firestore";

export const useChat = () => {
    const dispatch = useDispatch();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = createGenerativeAI(API_KEY);

    const {
        prompt,
        id: chatId,
        currentChat,
        inlineImageData,
    } = useSelector((state: RootType) => state.chat!);

    const { id: userId } = useSelector((state: RootType) => state.user!);
    const { allChats } = useSelector((state: RootType) => state.main!);

    const printResponseText = (text: string) => {
        const textArray = text.split(" ");
        const emptyTextArray: string[] = [];

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

    const getResponse = async () => {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings: safetySettings,
        });
        let newChat: HistoryType[] = [
            { role: "user", parts: [{ text: prompt }] },
        ];

        dispatch(setCurrentChat({ currentChat: [...currentChat, ...newChat] }));

        const chat = model.startChat({
            history: [...currentChat],
        });

        dispatch(setIsLoading({ isLoading: true }));

        const url = `${BASE_URL}/api/v1/context`;
        const axiosResponse = await axios.post(url, { prompt });
        const contexts: ContextType[] = await axiosResponse.data.data;
        const context = contexts
            .map((context) => context.pageContent)
            .join("\n\n");

        console.log("CONTEXT : \n", context);

        const promptWithContext = `
        Answer the question by extracting relevant information on The Bharatiya Nyaya Sanhita (BNS) provided in the CONTEXT below. Highlight the Sections of The Bharatiya Nyaya Sanhita (BNS) that are applicable in your responses. Do not use the word 'context' in your responses. If the question is not related, just say "Question is irrelevant".

        CONTEXT:${context}

        QUESTION:${prompt}
        `;

        let chatText;
        try {
            const result = await chat.sendMessage(promptWithContext);
            chatText = result.response.text();
        } catch (error: any) {
            chatText = error?.response?.promptFeedback?.blockReason
                ? "The response was blocked. Please try something else."
                : "Something went wrong. Please try something else.";
        }

        dispatch(setIsLoading({ isLoading: false }));
        newChat = [...newChat, { role: "model", parts: [{ text: "" }] }];
        dispatch(setCurrentChat({ currentChat: [...currentChat, ...newChat] }));

        printResponseText(chatText);

        const updatedNewChat: HistoryType[] = [
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [{ text: chatText }] },
        ];
        const updatedChat: HistoryType[] = [...currentChat, ...updatedNewChat];

        if (chatId) {
            updateChatsInFirestore(updatedChat, chatId);
            dispatch(
                updateIndividualChat({
                    id: chatId,
                    chats: [...updatedChat],
                    timestamp: new Date(Timestamp.now().toDate()).getTime(),
                }),
            );
        } else if (userId) {
            const chatDoc = await addChatsInFirestore(updatedChat, userId);
            dispatch(
                setAllChats({
                    allChats: [
                        ...allChats,
                        {
                            id: chatDoc?.id,
                            chats: updatedChat,
                            timestamp: new Date(
                                Timestamp.now().toDate(),
                            ).getTime(),
                        },
                    ],
                }),
            );
            dispatch(setId({ id: chatDoc?.id }));
        }
    };

    return {
        textAndImagePromptRun,
        getResponse,
    };
};

export const useMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return {
        isMenuOpen,
        toggleMenu,
    };
};
