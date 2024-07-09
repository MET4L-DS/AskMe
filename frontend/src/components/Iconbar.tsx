import { IoChatbubble, IoCompass, IoLogOut, IoSettings } from "react-icons/io5";

import { GoLaw } from "react-icons/go";
import { BsHexagonFill } from "react-icons/bs";
import { MdLightMode } from "react-icons/md";

import { Link } from "react-router-dom";

import { IconButton } from "./";
import { useDispatch, useSelector } from "react-redux";
import { RootType } from "../store";
import { memo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../configs/firebase";
import { setUser } from "../features/user/userSlice";
import { toast } from "react-toastify";

const Iconbar = () => {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            const user = await signOut(auth);
            toast.success("Logged out successfully !!",{
                position: "top-center",
            });
            console.log(user);

            dispatch(setUser({ id: null, email: null }));
            setShowLogoutDialog(false);
        } catch (error) {
            console.error(error);
        }
    };
    const { email } = useSelector((state: RootType) => state.user!);

    return (
        <div className="flex flex-col border-r border-customLightGreen p-4">
            <IconButton
                color="white"
                bgColor=""
                className="mb-12 bg-gradient-to-b from-customAccent to-customLightGreen text-xl"
            >
                <GoLaw />
            </IconButton>
            <div className="flex flex-col gap-4">
                <IconButton color="white" bgColor="customGreen">
                    <IoChatbubble />
                </IconButton>
                <IconButton
                    color="customGreen"
                    bgColor="white"
                    className=" text-2xl"
                >
                    <IoSettings />
                </IconButton>
                <IconButton
                    color="customGreen"
                    bgColor="white"
                    className=" text-2xl"
                >
                    <IoCompass />
                </IconButton>
                <IconButton
                    color="customGreen"
                    bgColor="white"
                    className=" text-2xl"
                >
                    <BsHexagonFill />
                </IconButton>
            </div>
            <div className="mt-auto flex flex-col gap-4 text-xl font-bold">
                <Link to="/login">
                    <IconButton
                        color="white"
                        bgColor="customGreen"
                        className=""
                    >
                        {email?.slice(0, 2).toUpperCase() || "Y"}
                    </IconButton>
                </Link>
                {/* <Link to="/logout"> */}
                <IconButton
                    onClick={() => {
                        setShowLogoutDialog(true);
                    }}
                    color="customGreen"
                    bgColor="white"
                    className=" "
                >
                    <IoLogOut />
                </IconButton>
                {showLogoutDialog && (
                    <div
                        data-dialog-backdrop="animated-dialog"
                        data-dialog-backdrop-close="true"
                        className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
                    >
                        <div
                            data-dialog="animated-dialog"
                            data-dialog-mount="opacity-100 translate-y-0 scale-100"
                            data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-none"
                            data-dialog-transition="transition-all duration-300"
                            className="text-blue-gray-500 relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed antialiased shadow-2xl"
                        >
                            <div className="text-blue-gray-900 flex shrink-0 items-center p-4 font-sans text-2xl font-semibold leading-snug antialiased">
                                Logout
                            </div>
                            <div className="border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500 relative border-b border-t p-4 font-sans text-base font-light leading-relaxed antialiased">
                                Are you sure you want to Logout?
                            </div>
                            <div className="text-blue-gray-500 flex shrink-0 flex-wrap items-center justify-end p-4">
                                <button
                                    onClick={() => setShowLogoutDialog(false)}
                                    className="middle none center mr-1 rounded-lg px-6 py-3 font-sans text-xs font-bold uppercase transition-all hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="middle none center rounded-lg bg-gradient-to-tr from-customAccent to-customAccent/90 px-6 py-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* </Link> */}
                <IconButton color="customGreen" bgColor="white" className="">
                    <MdLightMode />
                </IconButton>
            </div>
        </div>
    );
};
export default memo(Iconbar);
