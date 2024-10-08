import { useState } from "react";
import { FaGoogle, FaRegEnvelope } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../configs/firebase";
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logged In Successfully");
            toast.success("User Logged In Successfully !!", {
                position: "top-center",
            });
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                navigate("/");
            }, 1000);
        } catch (error: any) {
            console.log(error.message);
            toast.error("Invalid Credentials", { position: "bottom-center" });
        }
    };

    const googleIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (result) => {
            // console.log(result);
            if (result.user) {
                toast.success("User Logged In Successfully !!", {
                    position: "top-center",
                });
                const timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    navigate("/");
                }, 1000);
            }
        });
    };

    return (
        <div className="col-span-7 flex min-h-screen flex-col items-center justify-center bg-gray-100 py-2">
            <main className="flex flex-1 flex-col items-center justify-center px-20 text-center">
                <div className="flex flex-col rounded-2xl bg-white shadow-2xl sm:flex-row">
                    <div className="p-5 px-20">
                        <div className="flex items-center gap-2">
                            <img
                                alt="logo"
                                src="/LawGPT.png"
                                className=" aspect-square w-10 rounded-full p-1"
                            />
                            <div className="text-left text-xl font-bold">
                                <span className="text-customGreen">Law</span>
                                <span className="text-black">GPT</span>
                            </div>
                        </div>

                        <div className="py-10">
                            <h2 className="mb-2 text-3xl font-bold text-customGreen">
                                Sign in to Account
                            </h2>

                            <div className="mb-2 inline-block w-10 border-2 border-customGreen"></div>

                            <div className="my-2 flex justify-center">
                                <button
                                    type="button"
                                    className="mx-1 flex items-center gap-2 rounded-full border-2 border-gray-200 p-3 hover:bg-gray-200 "
                                    onClick={googleIn}
                                >
                                    <FaGoogle className="text-sm" /> Sign In
                                    With Google
                                </button>
                            </div>
                            <p className="my-3 text-gray-400">
                                or use your email account
                            </p>
                            <div className="flex flex-col items-center">
                                <div className="mb-3 flex w-64 items-center rounded-xl bg-gray-100 p-2">
                                    <FaRegEnvelope className="m-2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="flex-1 bg-gray-100 text-sm outline-none"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mb-3 flex w-64 items-center rounded-xl bg-gray-100 p-2">
                                    <RiLockPasswordLine className=" text-gray-400" />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder="Password"
                                        className="flex-1 bg-gray-100 text-sm outline-none"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    {showPassword ? (
                                        <IoEyeOffOutline
                                            className="m-2 text-gray-400"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        />
                                    ) : (
                                        <IoEyeOutline
                                            className="m-2 text-gray-400"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        />
                                    )}
                                </div>
                                <div className="mt-4 flex w-64">
                                    <label className="flex items-center text-xs text-gray-600 ">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            className="mr-2"
                                        />
                                        Remember Me
                                    </label>
                                    <a
                                        href="#"
                                        className="ml-auto text-xs text-blue-600"
                                    >
                                        Forgot Password ?
                                    </a>
                                </div>
                                <a
                                    href="#"
                                    className="m-10 inline-block rounded-full border-2 border-solid border-customGreen px-14 py-2 font-bold text-customGreen hover:bg-white hover:text-customGreen"
                                    onClick={handleSubmit}
                                >
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-br-2xl rounded-tr-2xl bg-customGreen px-12 py-36 text-white">
                        <h2 className="mb-2 text-3xl font-bold">Hi, there!</h2>
                        <div className="mb-4 inline-block w-10 border-2 border-white"></div>
                        <p className="mb-10 text-balance">
                            If you don't have an account yet,
                            <br />
                            please sign up to create one.
                        </p>

                        <Link to="/signup">
                            <p className="inline-block rounded-full border-2 border-solid border-white px-12 py-2 font-bold text-white hover:bg-white hover:text-customGreen">
                                Sign Up
                            </p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignIn;
