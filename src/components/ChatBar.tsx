import { FaImage, FaRegTrashCan } from "react-icons/fa6";
import { BiImageAdd } from "react-icons/bi";

const ChatBar = ({
    prompt,
    setPrompt,
    handleInput,
    handleFileInput,
    image,
    setImage,
}) => {
    return (
        <div className="sticky bottom-4 col-[2/-2] grid gap-4 px-8">
            {image && (
                <div className="relative w-fit">
                    <img
                        src={image}
                        alt="image"
                        className="aspect-square h-20 rounded-2xl bg-white object-cover p-2"
                    />
                    <FaRegTrashCan
                        className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 cursor-pointer text-red-500"
                        onClick={() => setImage("")}
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
                        onChange={(e) => setPrompt(e.target.value)}
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
                        console.log(e.target.files[0]);
                        handleFileInput(e.target.files[0]);
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
