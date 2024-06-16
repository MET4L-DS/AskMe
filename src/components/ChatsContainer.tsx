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
            "<b class='text-white bg-customAccent px-2 rounded-lg'>$1</b>",
        );
    };

    // function textFormatter(text: string) {
    //     // Split the text by new lines and asterisks
    //     const parts = text.split(/\n|\*/);
    //     let html = "";

    //     // Iterate over the parts to build the HTML
    //     parts.forEach((part) => {
    //         if (part.trim() === "") {
    //             // Add a line break for empty lines
    //             html += "<br/>";
    //         } else if (part.trim().startsWith("**")) {
    //             // Bold text wrapped in double asterisks
    //             const boldText = part
    //                 .trim()
    //                 .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    //             html += `<p>${boldText}</p>`;
    //         } else {
    //             // Regular text as a paragraph
    //             html += `<p>${part.trim()}</p>`;
    //         }
    //     });

    //     // Replace single asterisks with list items
    //     html = html.replace(/<p>\s*\* (.*?)<\/p>/g, "<li>$1</li>");

    //     // Wrap list items in unordered list tags
    //     html = html.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");

    //     // Remove any empty paragraphs
    //     html = html.replace(/<p>\s*<\/p>/g, "");

    //     return html;
    // }

    // const htmlContent = convertToHTML(text);
    // console.log(htmlContent);
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
