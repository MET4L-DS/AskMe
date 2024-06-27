import { createSlice } from "@reduxjs/toolkit";
import { HistoryType } from "../../types";

export type MainType = {
    allChats: { id: string; chats: HistoryType[]; timestamp: number }[] | [];
};

const initialState: MainType = {
    allChats: [],
};

const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setAllChats: (state, action) => {
            console.log("setAllChats", action.payload);

            state.allChats = action.payload.allChats;
        },
        updateIndividualChat: (state, action) => {
            console.log("updateIndividualChat", action.payload);

            const individualChat = state.allChats.find(
                (chat) => chat.id === action.payload.id,
            );
            individualChat!.chats = action.payload.chats;
            individualChat!.timestamp = action.payload.timestamp;
        },
    },
});

export default mainSlice.reducer;
export const { setAllChats, updateIndividualChat } = mainSlice.actions;
