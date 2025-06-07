import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Chat } from "./";

import { useSelector } from "react-redux";
import { RootType } from "../store";

const ChatsContainer = () => {
    const { currentChat, isLoading } = useSelector(
        (state: RootType) => state.chat!,
    );

    return (
        <div className="flex flex-col gap-8 rounded py-4 leading-6">
            {currentChat.map((item, index) => {
                const content = item.parts.map((part) => part.text).join("\n");

                return (
                    <Chat key={index} role={item.role}>
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                                components={{
                                    // Custom styling for strong/bold text
                                    strong: ({ children }) => (
                                        <span className="text-pretty rounded-lg bg-customAccent px-1 pb-0.5 font-medium text-white">
                                            {children}
                                        </span>
                                    ),
                                    // Custom styling for list items
                                    li: ({ children }) => (
                                        <li className="flex">
                                            <span className="px-2 text-xl leading-none">
                                                •
                                            </span>
                                            <span>{children}</span>
                                        </li>
                                    ),
                                    // Custom styling for paragraphs
                                    p: ({ children }) => (
                                        <p className="mb-2">{children}</p>
                                    ),
                                    // Custom styling for headings
                                    h1: ({ children }) => (
                                        <h1 className="mb-2 text-xl font-bold text-customAccent">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="mb-2 text-lg font-bold text-customAccent">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="mb-2 text-base font-bold text-customAccent">
                                            {children}
                                        </h3>
                                    ),
                                    // Custom styling for code blocks
                                    code: ({ children, className }) => {
                                        const isInline =
                                            !className?.includes("language-");
                                        if (isInline) {
                                            return (
                                                <code className="rounded bg-gray-100 px-1 text-sm">
                                                    {children}
                                                </code>
                                            );
                                        }
                                        return (
                                            <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4">
                                                <code>{children}</code>
                                            </pre>
                                        );
                                    },
                                    // Custom styling for blockquotes
                                    blockquote: ({ children }) => (
                                        <blockquote className="my-2 border-l-4 border-customAccent pl-4 italic">
                                            {children}
                                        </blockquote>
                                    ),
                                    // Custom styling for unordered lists
                                    ul: ({ children }) => (
                                        <ul className="my-2 space-y-1">
                                            {children}
                                        </ul>
                                    ),
                                    // Custom styling for ordered lists
                                    ol: ({ children }) => (
                                        <ol className="my-2 space-y-1">
                                            {children}
                                        </ol>
                                    ),
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </Chat>
                );
            })}
            {isLoading && <div className="loading-div " />}
        </div>
    );
};

export default memo(ChatsContainer);
