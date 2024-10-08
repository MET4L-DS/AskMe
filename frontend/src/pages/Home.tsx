import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/generative-ai";

import axios from "axios";

import { ChatsContainer, ChatBar, IconButton, Sidebar } from "../components";

import { HistoryType, InlineImageType, ContextType } from "../types";

import { FaMagnifyingGlass, FaTrashCan } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";
import {
    setLastChatText,
    setIsLoading,
    setCurrentChat,
    setId,
} from "../features/chat/chatSlice";
import { RootType } from "../store";

import { auth, db } from "../configs/firebase";
import {
    collection,
    doc,
    updateDoc,
    addDoc,
    deleteDoc,
} from "firebase/firestore";
import { updateIndividualChat, setAllChats } from "../features/main/mainSlice";
import { setUser } from "../features/user/userSlice";

import { onAuthStateChanged } from "firebase/auth";

import { useState } from "react";
import { motion } from "framer-motion";

const Home = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {
        prompt,
        id: chatId,
        currentChat,
        inlineImageData,
    } = useSelector((state: RootType) => state.chat!);

    const { id: userId } = useSelector((state: RootType) => state.user!);

    const { allChats } = useSelector((state: RootType) => state.main!);

    const dispatch = useDispatch();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user.uid);
            dispatch(setUser({ id: user.uid, email: user.email }));
        } else {
            console.log("User is signed out");
            dispatch(setUser({ id: null, email: null }));
        }
    });

    const chatHistoriesRef = collection(db, "chat_histories");

    const addChatsInFirestore = async (chats: HistoryType[]) => {
        try {
            console.log("Adding Chats: ", chats);
            const chatHistoryDoc = await addDoc(chatHistoriesRef, {
                chats: chats,
                userId: userId,
            });
            console.log("Chat History Doc: ", chatHistoryDoc);
            return chatHistoryDoc;
        } catch (error) {
            console.log(error);
        }
    };

    const deleteChatsInFirestore = async () => {
        console.log("Deleting Chats from Firestore: ", chatId);

        if (!chatId) return;
        console.log("Delete from firestore start");
        try {
            const chatHistoryDoc = doc(db, "chat_histories", chatId);
            await deleteDoc(chatHistoryDoc);
            console.log("Chat History Doc: ", chatHistoryDoc);
        } catch (error) {
            console.log(error);
        }
    };
    const deleteChatsInStore = () => {
        console.log("Deleting Chats from Store: ", chatId);

        if (!chatId) return;
        console.log("Delete from store start");

        const chats = allChats.filter((chat) => chat.id !== chatId);

        dispatch(setId({ id: "" }));
        dispatch(setCurrentChat({ currentChat: [] }));
        dispatch(setAllChats({ allChats: chats }));
    };

    const updateChatsInFirestore = async (chats: HistoryType[]) => {
        try {
            console.log("Updating Chats: ", chats);

            const chatHistoryDoc = doc(db, "chat_histories", chatId);
            await updateDoc(chatHistoryDoc, { chats: chats });
            console.log("Updating DONE");
        } catch (error) {
            console.log(error);
        }
    };

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
        const model = genAI.getGenerativeModel({
            model: "gemini-pro-vision",
            safetySettings,
        });
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
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings,
        });

        let newChat: HistoryType[] = [
            { role: "user", parts: [{ text: prompt }] },
        ];

        dispatch(
            setCurrentChat({
                currentChat: [...currentChat, ...newChat],
            }),
        );

        console.log("Get Response: ", currentChat);
        const newHistory = [...currentChat];
        console.log("New History: ", newHistory);

        const chat = model.startChat({
            history: newHistory,
        });

        dispatch(setIsLoading({ isLoading: true }));

        const url = `${BASE_URL}/api/v1/context`;
        const axiosResponse = await axios.post(url, {
            prompt: prompt,
        });

        const contexts: ContextType[] = await axiosResponse.data.data;

        console.log("Context: ", contexts);

        const pageContentArray = contexts.map((context) => context.pageContent);

        const context = pageContentArray.join("\n\n");
        console.log("Page Context: ", context);

        const promptWithContext = `
        Answer the question by extracting relevant information on Indian Penal Code provided in the CONTEXT below. Highlight the Sections of Indian Penal Code that are applicable in your responses. Do not use the word 'context' in your responses. If the question is not related, just say "Question is irrelevant".

        CONTEXT:${context}

        QUESTION:${prompt}
        `;

        let chatText;

        try {
            const result = await chat.sendMessage(promptWithContext);
            const response = result.response;
            chatText = response.text();
        } catch (error: any) {
            console.log({ error });

            if (error?.response?.promptFeedback?.blockReason) {
                chatText =
                    "The response was blocked. Please try something else.";
            } else {
                chatText = "Something went wrong. Please try something else.";
            }
        }

        dispatch(setIsLoading({ isLoading: false }));
        newChat = [...newChat, { role: "model", parts: [{ text: "" }] }];
        dispatch(
            setCurrentChat({
                currentChat: [...currentChat, ...newChat],
            }),
        );

        printResponseText(chatText);

        const updatedNewChat: HistoryType[] = [
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [{ text: chatText }] },
        ];
        const updatedChat: HistoryType[] = [...currentChat, ...updatedNewChat];

        if (chatId) {
            console.log("Updated Chat: ", updatedChat);

            updateChatsInFirestore(updatedChat);
            dispatch(
                updateIndividualChat({
                    id: chatId,
                    chats: [...updatedChat],
                }),
            );
        } else {
            if (userId) {
                const chatDoc = await addChatsInFirestore(updatedChat);
                console.log("Adding Chat Doc ID: ", chatDoc?.id);

                console.log("Adding DONE");

                dispatch(
                    setAllChats({
                        allChats: [
                            ...allChats,
                            { id: chatDoc?.id, chats: updatedChat },
                        ],
                    }),
                );
                dispatch(setId({ id: chatDoc?.id }));
            }
        }
    }

    return (
        <>
            <Sidebar />
            <motion.main
                transition={{ duration: 0.5 }}
                className="col-[1/-1] flex h-svh flex-col pb-4 lg:col-[3/-1]"
            >
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex items-center justify-between gap-4 p-4 "
                >
                    <h2 className=" mr-auto line-clamp-1 text-3xl font-semibold">
                        {currentChat[0]?.parts[0].text || (
                            <>
                                <span className="text-customGreen">Law</span>
                                <span>GPT</span>
                            </>
                        )}
                    </h2>
                    <IconButton color="customGray" bgColor="customNeutral">
                        <FaMagnifyingGlass />
                    </IconButton>
                    <div className=" relative">
                        <div className=" relative z-10">
                            <IconButton
                                color="customGray"
                                bgColor="customNeutral"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <HiDotsHorizontal />
                            </IconButton>
                        </div>
                        <menu
                            className={` absolute right-0 top-0 grid origin-top-right gap-4 rounded-lg bg-white p-4 py-20 pb-4 text-white transition-all duration-500 *:flex *:items-center *:justify-center *:gap-1 *:rounded-lg *:bg-customGreen *:p-4 *:py-2 ${isMenuOpen ? "scale-100" : "scale-0"}`}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    deleteChatsInStore();
                                    deleteChatsInFirestore();
                                }}
                            >
                                {" "}
                                <FaTrashCan /> Delete
                            </button>
                            <button type="button">Edit</button>
                        </menu>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="no-scrollbar col-[1/-1] flex-grow overflow-y-scroll rounded-lg bg-customNeutral px-8 py-4 text-sm lg:px-32"
                >
                    <ChatsContainer />
                    <ChatBar
                        getResponse={getResponse}
                        textAndImagePromptRun={textAndImagePromptRun}
                    />
                </motion.div>
            </motion.main>
        </>
    );
};

export default Home;
