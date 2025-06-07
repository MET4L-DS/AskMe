import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import {
    FaMagnifyingGlass,
    FaTrashCan,
    FaBookmark,
    FaRegBookmark,
} from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";

import { ChatsContainer, ChatBar, IconButton, Sidebar } from "../components";
import { auth } from "../configs/firebase";
import { setUser } from "../features/user/userSlice";
import {
    setCurrentChat,
    setCurrentSaved,
    setId,
} from "../features/chat/chatSlice";
import { setAllChats, setSaved } from "../features/main/mainSlice";
import { RootType } from "../store";
import { useChat, useMenu } from "../libs/hooks";
import { deleteChatsInFirestore, updateSavedInFirestore } from "../libs/utils";

const Home = () => {
    const { textAndImagePromptRun, getResponse } = useChat();
    const { isMenuOpen, toggleMenu } = useMenu();

    const dispatch = useDispatch();
    const {
        id: chatId,
        currentChat,
        currentSaved,
    } = useSelector((state: RootType) => state.chat!);
    const { allChats } = useSelector((state: RootType) => state.main!);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(setUser({ id: user.uid, email: user.email }));
        } else {
            dispatch(setUser({ id: null, email: null }));
        }
    });

    const deleteChatsInStore = () => {
        if (!chatId) return;
        const chats = allChats.filter((chat) => chat.id !== chatId);
        dispatch(setId({ id: "" }));
        dispatch(setCurrentChat({ currentChat: [] }));
        dispatch(setAllChats({ allChats: chats }));
    };

    const handleDelete = () => {
        deleteChatsInStore();
        deleteChatsInFirestore(chatId);
        toggleMenu();
    };

    const handleSave = () => {
        dispatch(setSaved({ id: chatId, saved: !currentSaved }));
        dispatch(setCurrentSaved({ currentSaved: !currentSaved }));
        updateSavedInFirestore(chatId, !currentSaved);
    };

    return (
        <>
            <Sidebar />
            <motion.main
                transition={{ duration: 0.5 }}
                className="col-[1/-1] flex h-svh flex-col pb-4 lg:col-[3/-1]"
            >
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex items-center justify-between gap-4 p-4 "
                >
                    <h2 className="mr-auto line-clamp-1 text-3xl font-semibold">
                        {currentChat[0]?.parts[0].text || (
                            <>
                                <span className="text-customGreen">Law</span>
                                <span>GPT</span>
                            </>
                        )}
                    </h2>
                    <IconButton color="customGray" bgColor="customNeutral">
                        <FaMagnifyingGlass />
                    </IconButton>
                    <div className="relative">
                        <div className="relative z-20">
                            <IconButton
                                color="customGray"
                                bgColor="customNeutral"
                                onClick={toggleMenu}
                            >
                                <HiDotsHorizontal />
                            </IconButton>
                        </div>
                        <menu
                            className={`absolute right-0 top-0 z-10 grid origin-top-right gap-4 rounded-lg bg-white p-4 py-20 pb-4 text-white transition-all duration-500 *:flex *:items-center *:justify-center *:gap-1 *:rounded-lg *:bg-customGreen *:p-4 *:py-2 ${isMenuOpen ? "scale-100" : "scale-0"}`}
                        >
                            <button type="button" onClick={handleDelete}>
                                <FaTrashCan /> Delete
                            </button>
                            <button type="button" onClick={handleSave}>
                                {currentSaved ? (
                                    <FaBookmark />
                                ) : (
                                    <FaRegBookmark />
                                )}
                                {currentSaved ? "Unsave" : "Save"}
                            </button>
                        </menu>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="no-scrollbar col-[1/-1] flex-grow overflow-y-scroll rounded-lg bg-customNeutral px-8 py-4 text-sm lg:px-32"
                >
                    <ChatsContainer />
                    <ChatBar
                        getResponse={getResponse}
                        textAndImagePromptRun={textAndImagePromptRun}
                    />
                </motion.div>
            </motion.main>
        </>
    );
};

export default Home;
