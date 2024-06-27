import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setId, setCurrentChat } from "../features/chat/chatSlice";

import { FaPenFancy } from "react-icons/fa6";

type TypeSidebarChatItem = {
    id: string;
    chats: any;
    currentChatId: string;
    timestamp: number;
    index: number;
};
const SidebarChatItem = ({
    id,
    chats,
    currentChatId,
    timestamp,
    index,
}: TypeSidebarChatItem) => {
    const dispatch = useDispatch();

    const time =
        (new Date(timestamp).getHours() % 12) +
        ":" +
        `${new Date(timestamp).getMinutes() < 10 ? "0" + new Date(timestamp).getMinutes() : new Date(timestamp).getMinutes()}` +
        ` ${new Date(timestamp).getHours() >= 12 ? "PM" : "AM"}`;

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
            key={id}
            className={`history-item-template relative grid gap-y-2 ${id === currentChatId ? "" : ""} rounded-lg py-2 pr-4`}
            onClick={() => {
                dispatch(setId({ id: id }));
                dispatch(
                    setCurrentChat({
                        currentChat: chats,
                    }),
                );
            }}
        >
            {id === currentChatId && (
                <motion.div
                    layoutId="active-chat"
                    className=" absolute left-0 top-0 h-full w-1 bg-customGreen"
                />
            )}
            <div
                className={` col-[1/2] flex items-center justify-center text-sm  ${id === currentChatId ? "text-customGreen" : "text-customDark400"}`}
            >
                <FaPenFancy />
            </div>
            <motion.h3
                className={` col-[2/3] line-clamp-1 font-bold ${id === currentChatId ? "text-customGreen" : " text-customDark400"}`}
            >
                {chats[0].parts[0].text}
            </motion.h3>
            <span
                className={`col-[3/4] flex items-center justify-end text-xs font-bold  ${id === currentChatId ? "text-customAccent" : "text-customGray"}`}
            >
                {time}
            </span>
            <p
                className={`col-[2/-1] line-clamp-3 text-justify text-sm  ${id === currentChatId ? "text-customGreen" : "text-customDark200"}`}
            >
                {chats[1].parts[0].text}
            </p>
        </motion.div>
    );
};
export default SidebarChatItem;
