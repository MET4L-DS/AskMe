import { configureStore } from "@reduxjs/toolkit";
import mainSlice from "./features/main/mainSlice";
import userSlice from "./features/user/userSlice";

export const store = configureStore({
    reducer: {
        main: mainSlice,
        user: userSlice,
    },
});
