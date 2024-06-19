import { createSlice } from "@reduxjs/toolkit";
import { HistoryType, InlineImageType } from "../../types";

export type ChatType = {
    id: string;
    currentChat: HistoryType[] | [];
    prompt: string;
    isLoading: boolean;
    image?: string;
    inlineImageData?: InlineImageType;
};

const initialState: ChatType = {
    id: "",
    currentChat: [],
    prompt: "",
    isLoading: false,
    image: undefined,
    inlineImageData: undefined,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setId(state, action) {
            state.id = action.payload.id;
        },
        setPrompt(state, action) {
            state.prompt = action.payload.prompt;
        },
        setCurrentChat(state, action) {
            state.currentChat = action.payload.currentChat;
        },
        setLastChatText(state, action) {
            state.currentChat[state.currentChat.length - 1].parts[0].text =
                action.payload.text;
        },
        appendChat(state, action) {
            const chat: HistoryType = action.payload.chat;
            return {
                ...state,
                currentChat: [...state.currentChat, chat],
            };
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload.isLoading;
        },
        setImage(state, action) {
            state.image = action.payload.image;
        },
        setInlineImageData(state, action) {
            state.inlineImageData = action.payload.data;
        },
    },
});

export const {
    setId,
    setPrompt,
    setCurrentChat,
    setLastChatText,
    appendChat,
    setIsLoading,
    setImage,
    setInlineImageData,
} = chatSlice.actions;
export default chatSlice.reducer;
