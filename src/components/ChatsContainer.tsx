import { memo } from "react";
import { Chat } from "./";

import { useSelector } from "react-redux";
import { RootType } from "../store";

const ChatsContainer = () => {
    const { currentChat, isLoading } = useSelector(
        (state: RootType) => state.chat!,
    );
    const textFormatter = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    };
    return (
        <div className="flex flex-col gap-8 rounded py-4">
            {currentChat.map((item, index) => {
                const formattedText = textFormatter(
                    item.parts.map((part) => part.text).join("\n"),
                );
                return (
                    <Chat key={index} role={item.role}>
                        {formattedText}
                    </Chat>
                );
            })}
            {isLoading && <div className="loading-div " />}
        </div>
    );
};

export default memo(ChatsContainer);
