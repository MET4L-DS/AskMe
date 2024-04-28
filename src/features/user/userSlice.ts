import { createSlice } from "@reduxjs/toolkit";
export type UserType = {
    // userName: string | null;
    email: string | null;
};

const initialState: UserType = {
    // userName: null,
    email: null,
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log("setUser", action.payload);

            state.email = action.payload.email;
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
