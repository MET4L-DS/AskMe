import { configureStore } from "@reduxjs/toolkit";
import mainSlice from "./features/main/mainSlice";

export const store = configureStore({
    reducer: {
        main: mainSlice,
    },
});
