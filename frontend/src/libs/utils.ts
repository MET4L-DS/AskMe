import { HistoryType } from "../types";
import {
    collection,
    doc,
    updateDoc,
    addDoc,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "../configs/firebase";

export const addChatsInFirestore = async (
    chats: HistoryType[],
    userId: string,
) => {
    const chatHistoriesRef = collection(db, "chat_histories");
    try {
        // console.log("Adding Chats: ", chats);
        const chatHistoryDoc = await addDoc(chatHistoriesRef, {
            chats: chats,
            userId: userId,
            createdAt: Timestamp.now(),
            saved: false,
        });
        // console.log("Chat History Doc: ", chatHistoryDoc);
        return chatHistoryDoc;
    } catch (error) {
        console.log(error);
    }
};

export const deleteChatsInFirestore = async (chatId: string) => {
    if (!chatId) return;
    try {
        const chatHistoryDoc = doc(db, "chat_histories", chatId);
        await deleteDoc(chatHistoryDoc);
    } catch (error) {
        console.log(error);
    }
};

export const updateChatsInFirestore = async (
    chats: HistoryType[],
    chatId: string,
) => {
    try {
        const chatHistoryDoc = doc(db, "chat_histories", chatId);
        await updateDoc(chatHistoryDoc, {
            chats: chats,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateSavedInFirestore = async (
    chatId: string,
    saved: boolean,
) => {
    try {
        const chatHistoryDoc = doc(db, "chat_histories", chatId);
        await updateDoc(chatHistoryDoc, {
            saved: saved,
        });
    } catch (error) {
        console.log(error);
    }
};
