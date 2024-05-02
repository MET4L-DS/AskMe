import { FaRegTrashCan } from "react-icons/fa6";
import { BiImageAdd } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { RootType } from "../store";
import {
    setPrompt,
    setImage,
    setInlineImageData,
    appendChat,
} from "../features/chat/chatSlice";

type CharBarProps = {
    textAndImagePromptRun: () => void;
    getResponse: () => void;
};

const ChatBar = ({ textAndImagePromptRun, getResponse }: CharBarProps) => {
    const { prompt, image } = useSelector((state: RootType) => state.chat!);
    const dispatch = useDispatch();

    const handleInput = () => {
        dispatch(
            appendChat({ chat: { role: "user", parts: [{ text: prompt }] } }),
        );

        if (image) console.log("image is set");
        image ? textAndImagePromptRun() : getResponse();

        dispatch(setPrompt({ prompt: "" }));
        dispatch(setImage({ image: undefined }));
        dispatch(setInlineImageData({ data: undefined }));
    };

    const handleFileInput = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result !== null) {
                const base64Img = reader.result as string;
                dispatch(setImage({ image: base64Img }));
                dispatch(
                    setInlineImageData({
                        data: {
                            inlineData: {
                                data: base64Img.split(",")[1],
                                mimeType: file.type,
                            },
                        },
                    }),
                );
            }
        };
    };

    return (
        <div className="sticky bottom-4 mt-20 grid gap-4">
            {image && (
                <div className="relative w-fit">
                    <img
                        src={image}
                        alt="image"
                        className="aspect-square h-20 rounded-2xl bg-white object-cover p-2"
                    />
                    <FaRegTrashCan
                        className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 cursor-pointer text-red-500"
                        onClick={() => dispatch(setImage({ image: undefined }))}
                    />
                </div>
            )}

            <div className="flex flex-grow items-center gap-4">
                <div className=" relative flex flex-grow">
                    <input
                        className="flex-grow rounded-2xl bg-white p-4 pr-16 text-base font-semibold shadow-xl focus:outline-0"
                        type="text"
                        name="input"
                        id="input"
                        value={prompt}
                        onChange={(e) =>
                            dispatch(setPrompt({ prompt: e.target.value }))
                        }
                        onKeyDown={(e) => {
                            if (!prompt) return;
                            e.key === "Enter" && handleInput();
                        }}
                    />
                    <label
                        htmlFor="image"
                        className="absolute right-0 grid h-full place-items-center rounded-2xl bg-white px-4  hover:text-customGreen active:bg-customGreen active:text-white"
                    >
                        <BiImageAdd size={24} />
                    </label>
                </div>

                <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            console.log(e.target.files[0]);
                            handleFileInput(e.target.files[0]);
                        }
                    }}
                    className=" hidden"
                />

                <button
                    type="button"
                    className="h-full rounded-2xl bg-white px-4 shadow-xl hover:text-customGreen active:bg-customGreen active:text-white "
                    onClick={() => {
                        if (!prompt) return;
                        handleInput();
                    }}
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default ChatBar;
