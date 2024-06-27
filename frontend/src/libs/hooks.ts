import { useDispatch, useSelector } from "react-redux";
import { RootType } from "../store";
import { HistoryType, InlineImageType, ContextType } from "../types";

import { auth, db } from "../configs/firebase";
import {
    collection,
    doc,
    updateDoc,
    addDoc,
    deleteDoc,
} from "firebase/firestore";

export const useAddChatsInFirestore = async (chats: HistoryType[]) => {
    const { id: userId } = useSelector((state: RootType) => state.user!);

    const chatHistoriesRef = collection(db, "chat_histories");

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
