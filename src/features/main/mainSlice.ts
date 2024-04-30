import { createSlice } from "@reduxjs/toolkit";
import { HistoryType } from "../../types";

export type MainType = {
    chats: HistoryType[] | [];
};

const initialState: MainType = {
    chats: [],
};

const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setChats: (state, action) => {
            console.log("setChats", action.payload);
            state.chats = action.payload.chats;
        },
    },
});

export default mainSlice.reducer;
export const { setChats } = mainSlice.actions;
