import { useState } from "react";
import { auth } from "../configs/firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSignUp = async () => {
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            console.log(user);

            alert("User created successfully");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
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
            <button type="button" onClick={handleSignUp}>
                Sign Up
            </button>
        </div>
    );
};

export default SignUp;
