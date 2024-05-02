import { createSlice } from "@reduxjs/toolkit";
import { HistoryType } from "../../types";

export type MainType = {
    allChats: HistoryType[][] | [];
};

const initialState: MainType = {
    allChats: [],
};

const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setAllChats: (state, action) => {
            state.allChats = action.payload.chats;
        },
    },
});

export default mainSlice.reducer;
export const { setAllChats } = mainSlice.actions;
