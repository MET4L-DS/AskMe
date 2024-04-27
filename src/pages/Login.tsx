import { useState } from "react";
import { auth } from "../configs/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            alert("Logged in successfully");
            console.log(user);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
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
