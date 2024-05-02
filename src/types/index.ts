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

export type { HistoryType, InlineImageType };
