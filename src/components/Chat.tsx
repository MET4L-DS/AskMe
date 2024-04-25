import React, { memo } from "react";
import { FaPenFancy } from "react-icons/fa";

type ChatProps = {
    children: React.ReactNode;
    role: "user" | "model";
};

const Chat = ({ children, role }: ChatProps) => {
    // const htmlParser = (text) => {
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(text, "text/html");
    //     return doc.body.innerHTML;
    // };
    return (
        <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid aspect-square w-12 -translate-x-1/2 place-items-center rounded-2xl bg-customGreen font-bold text-white">
                {role === "user" ? "Y" : <FaPenFancy />}
            </div>
            <div className="px-8 font-semibold ">
                {role === "user" ? "You" : "Teacher"}
            </div>
            <pre
                className={`text-wrap rounded-2xl ${role === "user" ? "bg-white py-4" : " bg-customLightGreen py-8"} w-fit px-10 `}
                // dangerouslySetInnerHTML={{__html: prevHistoryText,}}
                // dangerouslySetInnerHTML={{ __html: children }}
            >
                {/* {htmlParser(children)} */}
                {children}
            </pre>
        </div>
    );
};

export default memo(Chat);
