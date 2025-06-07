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
import { addChatsInFirestore, updateChatsInFirestore } from "./utils";
import { Timestamp } from "firebase/firestore";

export const useChat = () => {
    const dispatch = useDispatch();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

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
        // This functionality would need to be implemented separately
        // as the current backend doesn't handle image processing
        console.log("Image processing not yet implemented with new backend");
    };

    const getResponse = async () => {
        let newChat: HistoryType[] = [
            { role: "user", parts: [{ text: prompt }] },
        ];

        dispatch(setCurrentChat({ currentChat: [...currentChat, ...newChat] }));
        dispatch(setIsLoading({ isLoading: true }));

        try {
            const url = `${BASE_URL}/api/v1/context`;
            const axiosResponse = await axios.post(url, { prompt });

            if (axiosResponse.data.success) {
                const responseText = axiosResponse.data.response;

                dispatch(setIsLoading({ isLoading: false }));
                newChat = [
                    ...newChat,
                    { role: "model", parts: [{ text: "" }] },
                ];
                dispatch(
                    setCurrentChat({
                        currentChat: [...currentChat, ...newChat],
                    }),
                );

                printResponseText(responseText);

                const updatedNewChat: HistoryType[] = [
                    { role: "user", parts: [{ text: prompt }] },
                    { role: "model", parts: [{ text: responseText }] },
                ];
                const updatedChat: HistoryType[] = [
                    ...currentChat,
                    ...updatedNewChat,
                ];

                if (chatId) {
                    updateChatsInFirestore(updatedChat, chatId);
                    dispatch(
                        updateIndividualChat({
                            id: chatId,
                            chats: [...updatedChat],
                            timestamp: new Date(
                                Timestamp.now().toDate(),
                            ).getTime(),
                        }),
                    );
                } else if (userId) {
                    const chatDoc = await addChatsInFirestore(
                        updatedChat,
                        userId,
                    );
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
            } else {
                throw new Error(
                    axiosResponse.data.msg || "Unknown error occurred",
                );
            }
        } catch (error: any) {
            dispatch(setIsLoading({ isLoading: false }));
            const errorText = error?.response?.data?.msg
                ? `Error: ${error.response.data.msg}`
                : "Something went wrong. Please try something else.";

            newChat = [...newChat, { role: "model", parts: [{ text: "" }] }];
            dispatch(
                setCurrentChat({ currentChat: [...currentChat, ...newChat] }),
            );
            printResponseText(errorText);
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
