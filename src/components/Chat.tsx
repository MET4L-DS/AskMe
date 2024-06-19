import { memo } from "react";
import { FaPenFancy } from "react-icons/fa";
import { IconButton } from "./";
import { useSelector } from "react-redux";

import { RootType } from "../store";

type ChatProps = {
    children: string;
    role: "user" | "model";
};

const Chat = ({ children, role }: ChatProps) => {
    const user = useSelector((state: RootType) => state.user);
    return (
        <div className="grid gap-1">
            <div className="px-8 font-semibold ">
                {role === "user" ? "You" : "Advisor"}
            </div>
            <div className="relative ">
                <div className="absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center font-bold">
                    <IconButton color="white" bgColor="customGreen">
                        {role === "user" ? (
                            user?.email?.slice(0, 2).toUpperCase() || "Y"
                        ) : (
                            <FaPenFancy />
                        )}
                    </IconButton>
                </div>
                <div
                    className={`rounded-2xl ${role === "user" ? "bg-white py-4" : " text-balance bg-customLightGreen py-8"} w-fit px-10 `}
                    dangerouslySetInnerHTML={{ __html: children }}
                ></div>
            </div>
        </div>
    );
};

export default memo(Chat);
