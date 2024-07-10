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
            // const data = docSnap.docs.map((doc) => doc.data());
            // const newVar = docSnap.docs.map((doc) => {
            //     const chatId = doc.id;
            //     const chatData = doc.data();
            //     const chats = chatData.chats;
            //     return { chatId, chats };
            // });
            // console.log(newVar);

            const chatHistory = docSnap.docs.map((doc) => {
                const chatId = doc.id;
                const chatData = doc.data();
                const prevChats = chatData.chats;
                return { id: chatId, chats: prevChats };
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
                    {allChats.length > 0 ? (
                        allChats?.map((chat, index) => {
                            return (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        transition: {
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        },
                                    }}
                                    whileHover={{
                                        backgroundColor: " hsl(263, 52%, 91%)",
                                        transition: { duration: 0.2 },
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    key={chat.id}
                                    className={`history-item-template relative grid gap-y-2 ${chat.id === currentChatId ? "" : ""} rounded-lg py-2 pr-4`}
                                    onClick={() => {
                                        dispatch(setId({ id: chat.id }));
                                        dispatch(
                                            setCurrentChat({
                                                currentChat: chat.chats,
                                            }),
                                        );
                                    }}
                                >
                                    {chat.id === currentChatId && (
                                        <motion.div
                                            layoutId="active-chat"
                                            className=" absolute left-0 top-0 h-full w-1 bg-customGreen"
                                        />
                                    )}
                                    <div
                                        className={` col-[1/2] flex items-center justify-center text-sm  ${chat.id === currentChatId ? "text-customGreen" : "text-customDark400"}`}
                                    >
                                        <FaPenFancy />
                                    </div>
                                    <motion.h3
                                        className={` col-[2/3] line-clamp-1 font-bold ${chat.id === currentChatId ? "text-customGreen" : " text-customDark400"}`}
                                    >
                                        {chat.chats[0].parts[0].text}
                                    </motion.h3>
                                    <span
                                        className={`col-[3/4] flex items-center justify-end text-xs font-bold  ${chat.id === currentChatId ? "text-customAccent" : "text-customGray"}`}
                                    >
                                        9:34 PM
                                    </span>
                                    <p
                                        className={`col-[2/-1] line-clamp-3 text-justify text-sm  ${chat.id === currentChatId ? "text-customGreen" : "text-customDark200"}`}
                                    >
                                        {chat.chats[1].parts[0].text}
                                    </p>
                                </motion.div>
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
