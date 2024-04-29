import { IoChatbubble, IoCompass, IoLogOut, IoSettings } from "react-icons/io5";

import { FaPenFancy } from "react-icons/fa6";
import { BsHexagonFill } from "react-icons/bs";
import { MdLightMode } from "react-icons/md";

import { Link } from "react-router-dom";

import { IconButton } from "./";
import { useSelector } from "react-redux";
import { RootType } from "../store";

const Iconbar = () => {
    const user = useSelector((state: RootType) => state.user);

    return (
        <div className="flex flex-col border-r border-customLightGreen p-4">
            <IconButton
                color="white"
                bgColor="var(--customGray)"
                className="mb-12"
            >
                <FaPenFancy />
            </IconButton>
            <div className="flex flex-col gap-4">
                <IconButton color="white" bgColor="var(--customGreen)">
                    <IoChatbubble />
                </IconButton>
                <IconButton
                    color="var(--customGreen)"
                    bgColor="white"
                    className=" text-2xl"
                >
                    <IoSettings />
                </IconButton>
                <IconButton
                    color="var(--customGreen)"
                    bgColor="white"
                    className=" text-2xl"
                >
                    <IoCompass />
                </IconButton>
                <IconButton
                    color="var(--customGreen)"
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
                        bgColor="var(--customGreen)"
                        className=""
                    >
                        {user?.email?.slice(0, 2).toUpperCase() || "Y"}
                    </IconButton>
                </Link>
                <Link to="/logout">
                    <IconButton
                        color="var(--customGreen)"
                        bgColor="white"
                        className=" "
                    >
                        <IoLogOut />
                    </IconButton>
                </Link>
                <IconButton
                    color="var(--customGreen)"
                    bgColor="white"
                    className=""
                >
                    <MdLightMode />
                </IconButton>
            </div>
        </div>
    );
};
export default Iconbar;
