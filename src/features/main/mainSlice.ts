import { createSlice } from "@reduxjs/toolkit";
import { prevHistory } from "../../prevHistory";
import { HistoryType } from "../../types";

export type MainType = {
    history: HistoryType;
};

const initialState: MainType = {
    history: prevHistory,
};

const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        logger: (state) => {
            console.log(state);
        },
    },
});

export default mainSlice.reducer;
export const { logger } = mainSlice.actions;
