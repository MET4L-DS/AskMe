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
import { memo, useEffect } from "react";

import { motion } from "framer-motion";

const Sidebar = () => {
    const { id: userId } = useSelector((state: RootType) => state.user!);
    const { allChats } = useSelector((state: RootType) => state.main!);
    const { id: currentChatId } = useSelector((state: RootType) => state.chat!);
    const dispatch = useDispatch();

    const historyCollectionRef = collection(db, "chat_histories");

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
                console.log(chatId);

                return { id: chatId, chats: prevChats, timestamp: createdAt };
            });

            if (docSnap) {
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
                        whileHover={{ backgroundColor: " hsl(263, 52%, 91%)" }}
                        whileTap={{ scale: 0.98 }}
                        className=" flex flex-grow items-center justify-center gap-1 bg-white text-customGreen"
                        type="button"
                    >
                        <IoChatbubble />
                        <span onClick={() => console.log(allChats)}>Chats</span>
                        <span className=" rounded bg-customLightGreen px-1">
                            {allChats.length}
                        </span>
                    </motion.button>
                    <motion.button
                        whileHover={{ backgroundColor: " hsl(263, 52%, 91%)" }}
                        whileTap={{ scale: 0.98 }}
                        className=" flex flex-grow items-center justify-center gap-1"
                        type="button"
                    >
                        <FaBookmark />
                        <span>Saved</span>
                        <span className=" rounded bg-customGray px-1">24</span>
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
                    {allChats?.map((chat, index) => {
                        return (
                            <SidebarChatItem
                                key={chat.id}
                                id={chat.id}
                                chats={chat.chats}
                                currentChatId={currentChatId}
                                timestamp={chat.timestamp}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </motion.aside>
    );
};
export default memo(Sidebar);
