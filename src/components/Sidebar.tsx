import { IoChatbubble } from "react-icons/io5";

import { FaPlus, FaBookmark } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";

import { IconButton, Iconbar } from "./";

const Sidebar = () => {
    return (
        <aside className="col-[1/3] flex">
            <Iconbar />
            <div className=" flex-grow px-4">
                <div className="flex justify-between gap-4 py-4">
                    <h1 className="mr-auto text-3xl font-semibold">My Chats</h1>
                    <IconButton color="white" bgColor="var(--customGreen)">
                        <FaPlus />
                    </IconButton>
                    <IconButton
                        color="var(--customGray)"
                        bgColor="var(--customNeutral)"
                    >
                        <HiDotsHorizontal />
                    </IconButton>
                </div>
                <div className="flex gap-4 rounded-lg bg-customNeutral p-1 *:rounded *:p-3 *:text-xs *:font-bold *:uppercase">
                    <button
                        className=" flex flex-grow items-center justify-center gap-1 bg-white text-customGreen"
                        type="button"
                    >
                        <IoChatbubble />
                        <span>Chats</span>
                        <span className=" rounded bg-customLightGreen px-1">
                            24
                        </span>
                    </button>
                    <button
                        className=" flex flex-grow items-center justify-center gap-1"
                        type="button"
                    >
                        <FaBookmark />
                        <span>Saved</span>
                        <span className=" rounded bg-customGray px-1">24</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
export default Sidebar;
