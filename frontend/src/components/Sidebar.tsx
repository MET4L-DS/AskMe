import { IoChatbubble, IoFilter } from "react-icons/io5";

import { FaPlus, FaBookmark, FaMagnifyingGlass } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";

import { IconButton, Iconbar, SidebarChatItem } from "./";

import { db } from "../configs/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootType } from "../store";
import { setAllChats } from "../features/main/mainSlice";
import {
    setId,
    setCurrentChat,
    setIsLoading,
} from "../features/chat/chatSlice";
import { memo, useEffect, useState } from "react";

import { motion } from "framer-motion";

const Sidebar = () => {
    const { id: userId } = useSelector((state: RootType) => state.user!);
    const { allChats } = useSelector((state: RootType) => state.main!);
    const { id: currentChatId } = useSelector((state: RootType) => state.chat!);
    const dispatch = useDispatch();

    const historyCollectionRef = collection(db, "chat_histories");

    const [saved, setSaved] = useState(false);

    const getData = async () => {
        try {
            const q = query(
                historyCollectionRef,
                where("userId", "==", userId),
            );
            const docSnap = await getDocs(q);

            const chatHistory = docSnap.docs.map((doc) => {
                const chatId = doc.id;
                const chatData = doc.data();
                const prevChats = chatData.chats;
                const createdAt = new Date(
                    chatData.createdAt.toDate(),
                ).getTime();

                return {
                    id: chatId,
                    chats: prevChats,
                    timestamp: createdAt,
                    saved: chatData.saved,
                };
            });

            if (docSnap) {
                console.log(chatHistory);

                dispatch(setAllChats({ allChats: chatHistory }));
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
    }, [userId]);

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="col-[1/3] hidden h-screen lg:flex"
        >
            <Iconbar />
            <div className=" flex w-0 flex-grow flex-col gap-4 px-4 pb-4">
                <div className="mt-4 flex justify-between gap-4">
                    <h1 className="mr-auto text-3xl font-semibold">My Chats</h1>
                    <IconButton
                        color="white"
                        bgColor="customGreen"
                        onClick={() => {
                            dispatch(setId({ id: "" }));
                            dispatch(setCurrentChat({ currentChat: [] }));
                            dispatch(setIsLoading({ isLoading: false }));
                        }}
                    >
                        <FaPlus />
                    </IconButton>
                    <IconButton color="customGray" bgColor="customNeutral">
                        <HiDotsHorizontal />
                    </IconButton>
                </div>
                <div className="flex flex-wrap gap-4 rounded-lg bg-customNeutral p-1 *:rounded *:p-3 *:text-xs *:font-bold *:uppercase">
                    <motion.button
                        // whileHover={{ backgroundColor: " hsl(263, 52%, 91%)" }}
                        whileTap={{ scale: 0.98 }}
                        className={` relative flex flex-grow items-center justify-center gap-1 ${saved == false ? " text-customGreen " : ""}`}
                        type="button"
                        onClick={() => {
                            setSaved(false);
                        }}
                    >
                        {saved === false && (
                            <motion.div
                                layoutId="active-section"
                                className=" absolute left-0 top-0 h-full w-full rounded-lg bg-white"
                            />
                        )}
                        <IoChatbubble className=" z-10" />
                        <span
                            onClick={() => console.log(allChats)}
                            className="z-10"
                        >
                            Chats
                        </span>
                        <span
                            className={` z-10 rounded ${saved == false ? "bg-customLightGreen" : "bg-customGray"} px-1`}
                        >
                            {allChats.length}
                        </span>
                    </motion.button>
                    <motion.button
                        // whileHover={{ backgroundColor: " hsl(263, 52%, 91%)" }}
                        whileTap={{ scale: 0.98 }}
                        className={` relative flex flex-grow items-center justify-center gap-1 ${saved == true ? " text-customGreen " : ""}`}
                        type="button"
                        onClick={() => {
                            setSaved(true);
                        }}
                    >
                        {saved === true && (
                            <motion.div
                                layoutId="active-section"
                                className=" absolute left-0 top-0 h-full w-full rounded-lg bg-white"
                            />
                        )}
                        <FaBookmark className=" z-10" />
                        <span className="z-10">Saved</span>
                        <span
                            className={` z-10 rounded ${saved == true ? "bg-customLightGreen" : "bg-customGray"} px-1`}
                        >
                            {
                                allChats.filter((chat) => chat.saved == true)
                                    .length
                            }
                        </span>
                    </motion.button>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex flex-grow items-center">
                        <div className="absolute left-0">
                            <IconButton
                                color="customGray"
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
                            className=" w-0 flex-grow rounded-lg bg-customNeutral p-2 pl-10"
                        />
                    </div>
                    <IconButton color="customGray" bgColor="customNeutral">
                        <IoFilter />
                    </IconButton>
                </div>
                <div className=" no-scrollbar flex flex-grow flex-col gap-2 overflow-y-scroll">
                    {allChats.length > 0 ? (
                        allChats?.map((chat, index) => {
                            if (saved && chat.saved == false) {
                                return;
                            }
                            return (
                                <SidebarChatItem
                                    key={chat.id}
                                    id={chat.id}
                                    chats={chat.chats}
                                    currentChatId={currentChatId}
                                    timestamp={chat.timestamp}
                                    index={index}
                                    saved={chat.saved}
                                />
                            );
                        })
                    ) : (
                        <div className="mt-4 text-center text-gray-500">
                            No chat history available.
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};
export default memo(Sidebar);
