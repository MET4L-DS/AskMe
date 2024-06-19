type HistoryType = {
    role: "user" | "model";
    parts: {
        text: string;
    }[];
};

type InlineImageType = {
    inlineData: {
        data: string;
        mimeType: string;
    };
};

type ContextType = {
    pageContent: string;
    metadata: any;
};

export type { HistoryType, InlineImageType, ContextType };
