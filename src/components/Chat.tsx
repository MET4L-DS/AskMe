import React, { memo } from "react";
import { FaPenFancy } from "react-icons/fa";
import { IconButton } from "./";
import { useSelector } from "react-redux";
import { UserType } from "../features/user/userSlice";

type RootType = {
    user: UserType;
};

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
    const user = useSelector((state: RootType) => state.user);
    return (
        <div className="grid gap-1">
            <div className="px-8 font-semibold ">
                {role === "user" ? "You" : "Teacher"}
            </div>
            <div className="relative ">
                <div className="absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center font-bold">
                    <IconButton color="white" bgColor="var(--customGreen)">
                        {role === "user" ? (
                            user?.email?.slice(0, 2).toUpperCase() || "Y"
                        ) : (
                            <FaPenFancy />
                        )}
                    </IconButton>
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
        </div>
    );
};

export default memo(Chat);
