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
import { setId, setCurrentChat } from "../features/chat/chatSlice";
import { useEffect } from "react";

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
        <aside className="col-[1/3] flex">
            <Iconbar />
            <div className=" flex flex-grow flex-col gap-4 px-4">
                <div className="mt-4 flex justify-between gap-4">
                    <h1 className="mr-auto text-3xl font-semibold">My Chats</h1>
                    <IconButton
                        color="white"
                        bgColor="var(--customGreen)"
                        onClick={() => {
                            dispatch(setId({ id: "" }));
                            dispatch(setCurrentChat({ currentChat: [] }));
                        }}
                    >
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
                        <span onClick={() => console.log(allChats)}>Chats</span>
                        <span className=" rounded bg-customLightGreen px-1">
                            {allChats.length}
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
                    {allChats?.map((chat) => {
                        return (
                            <div
                                key={chat.id}
                                className={`history-item-template grid min-h-20 gap-y-2 ${chat.id === currentChatId ? "bg-customLightGreen" : ""} rounded-lg py-2 pr-4`}
                                onClick={() => {
                                    dispatch(setId({ id: chat.id }));
                                    dispatch(
                                        setCurrentChat({
                                            currentChat: chat.chats,
                                        }),
                                    );
                                }}
                            >
                                <div className=" col-[1/2] flex items-center justify-center text-sm text-customDark400">
                                    <FaPenFancy />
                                </div>
                                <h3 className=" col-[2/3] line-clamp-1 font-bold text-customDark400">
                                    {chat.chats[0].parts[0].text}
                                </h3>
                                <span className="col-[3/4] flex items-center justify-end text-xs font-bold text-customGray">
                                    9:34 PM
                                </span>
                                <p className="col-[2/-1] line-clamp-3 text-justify text-sm text-customDark200">
                                    {chat.chats[1].parts[0].text}
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