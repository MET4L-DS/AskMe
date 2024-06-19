import { memo } from "react";
import { Chat } from "./";

import { useSelector } from "react-redux";
import { RootType } from "../store";

const ChatsContainer = () => {
    const { currentChat, isLoading } = useSelector(
        (state: RootType) => state.chat!,
    );
    const textFormatter = (text: string) => {
        return text.replace(
            /\*\*(.*?)\*\*/g,
            "<span class='text-white bg-customAccent font-medium text-pretty px-1 pb-0.5 rounded-lg'>$1</span>",
        );
    };

    const textToListFormatter = (text: string) => {
        return text.replace(
            /^\* (.+)/gm,
            "<div class=' flex'><div class='px-2 text-xl leading-none'>•</div><div>$1</div></div>",
        );
    };

    const textLineBreak = (text: string) => {
        return text.replace(/\n/g, "<br/>");
    };

    return (
        <div className="flex flex-col gap-8 rounded py-4 leading-6">
            {currentChat.map((item, index) => {
                const formattedText = textFormatter(
                    item.parts.map((part) => part.text).join("\n"),
                );

                const formattedListText = textToListFormatter(formattedText);

                const formattedLineBreak = textLineBreak(formattedListText);
                return (
                    <Chat key={index} role={item.role}>
                        {formattedLineBreak}
                    </Chat>
                );
            })}
            {isLoading && <div className="loading-div " />}
        </div>
    );
};

export default memo(ChatsContainer);
