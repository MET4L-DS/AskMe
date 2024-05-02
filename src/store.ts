import { configureStore } from "@reduxjs/toolkit";
import mainSlice from "./features/main/mainSlice";
import userSlice from "./features/user/userSlice";
import chatSlice from "./features/chat/chatSlice";
import { UserType } from "./features/user/userSlice";
import { MainType } from "./features/main/mainSlice";
import { ChatType } from "./features/chat/chatSlice";

export type RootType = {
    main?: MainType;
    user?: UserType;
    chat?: ChatType;
};

export const store = configureStore({
    reducer: {
        main: mainSlice,
        user: userSlice,
        chat: chatSlice,
    },
});
