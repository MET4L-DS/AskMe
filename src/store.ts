import { configureStore } from "@reduxjs/toolkit";
import mainSlice from "./features/main/mainSlice";
import userSlice from "./features/user/userSlice";
import { UserType } from "./features/user/userSlice";
import { MainType } from "./features/main/mainSlice";

export type RootType = {
    main?: MainType;
    user?: UserType;
};

export const store = configureStore({
    reducer: {
        main: mainSlice,
        user: userSlice,
    },
});
