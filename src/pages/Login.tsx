import { useState } from "react";
import { auth } from "../configs/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const userEmail = userCredential.user.email;
            console.log("Logged in user email:", userEmail);
            dispatch(
                setUser({ id: userCredential.user.uid, email: userEmail }),
            );
            // ...rest of your code
            console.log("Current User", auth.currentUser);
        } catch (error) {
            console.error("Login error:", error);
        }
    };
    return (
        <div className=" col-span-full grid place-items-center">
            <h2>Login</h2>
            <div>
                <p>
                    Email:{" "}
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </p>
                <p>
                    Password:{" "}
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </p>
            </div>
            <button type="button" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};
export default Login;
