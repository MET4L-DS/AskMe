import { IoChatbubble, IoFilter } from "react-icons/io5";

import {
    FaPlus,
    FaBookmark,
    FaMagnifyingGlass,
    FaPenFancy,
} from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";

import { IconButton, Iconbar } from "./";

import { db } from "../configs/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootType } from "../store";
import { setChats } from "../features/main/mainSlice";
import { useEffect, useState } from "react";

const Sidebar = ({ setHistory }: { setHistory: any }) => {
    const { id } = useSelector((state: RootType) => state.user!);
    const { chats } = useSelector((state: RootType) => state.main!);
    console.log(id);
    const dispatch = useDispatch();
    const [cuurentChat, setCurrentChat] = useState<Number | null>(null);

    const historyCollectionRef = collection(db, "chat_histories");

    const getData = async () => {
        try {
            const q = query(historyCollectionRef, where("userId", "==", id));
            const docSnap = await getDocs(q);
            const data = docSnap.docs.map((doc) => doc.data());
            const chatHistory = data.map((data) => data.chats);
            if (docSnap) {
                console.log("Document data:", chatHistory);
                dispatch(setChats({ chats: chatHistory }));
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    return (
        <aside className="col-[1/3] flex">
            <Iconbar />
            <div className=" flex flex-grow flex-col gap-4 px-4">
                <div className="mt-4 flex justify-between gap-4">
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
                        <span onClick={() => console.log(chats)}>Chats</span>
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
                <div className="flex gap-2">
                    <div className="relative flex flex-grow items-center">
                        <div className="absolute left-0">
                            <IconButton
                                color="var(--customGray)"
                                bgColor="transparent"
                            >
                                <FaMagnifyingGlass />
                            </IconButton>
                        </div>
                        <input
                            type="search"
                            name="search"
                            id="search"
                            placeholder="Search"
                            className=" flex-grow rounded-lg bg-customNeutral p-2 pl-10"
                        />
                    </div>
                    <IconButton
                        color="var(--customGray)"
                        bgColor="var(--customNeutral)"
                    >
                        <IoFilter />
                    </IconButton>
                </div>
                <div className=" no-scrollbar flex flex-grow flex-col gap-2 overflow-y-scroll">
                    {chats?.map((chat, index) => {
                        return (
                            <div
                                key={index}
                                className={`history-item-template grid min-h-20 gap-y-2 ${index === cuurentChat ? "bg-customLightGreen" : ""} rounded-lg py-2 pr-4`}
                                onClick={() => {
                                    setHistory(chat);
                                    setCurrentChat(index);
                                }}
                            >
                                <div className=" col-[1/2] flex items-center justify-center text-sm text-customDark400">
                                    <FaPenFancy />
                                </div>
                                <h3 className=" col-[2/3] line-clamp-1 font-bold text-customDark400">
                                    {chat[0].parts[0].text}
                                </h3>
                                <span className="col-[3/4] flex items-center justify-end text-xs font-bold text-customGray">
                                    9:34 PM
                                </span>
                                <p className="col-[2/-1] line-clamp-3 text-justify text-sm text-customDark200">
                                    {chat[1].parts[0].text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};
export default Sidebar;
