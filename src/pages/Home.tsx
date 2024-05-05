import { GoogleGenerativeAI } from "@google/generative-ai";

import { ChatsContainer, ChatBar, IconButton, Sidebar } from "../components";

import { HistoryType, InlineImageType } from "../types";

import { FaMagnifyingGlass } from "react-icons/fa6";
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

const Home = () => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);

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
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

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
        try {
            const result = await chat.sendMessage(prompt);
            const response = result.response;
            dispatch(setIsLoading({ isLoading: false }));
            newChat = [...newChat, { role: "model", parts: [{ text: "" }] }];
            dispatch(
                setCurrentChat({
                    currentChat: [...currentChat, ...newChat],
                }),
            );

            printResponseText(response.text());

            const updatedNewChat: HistoryType[] = [
                { role: "user", parts: [{ text: prompt }] },
                { role: "model", parts: [{ text: response.text() }] },
            ];
            const updatedChat: HistoryType[] = [
                ...currentChat,
                ...updatedNewChat,
            ];
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
                    <h2 className=" mr-auto line-clamp-1 text-3xl font-semibold">
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
                <div className="no-scrollbar col-[1/-1] flex-grow overflow-y-scroll rounded-lg bg-customNeutral px-32 py-4 text-sm">
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
