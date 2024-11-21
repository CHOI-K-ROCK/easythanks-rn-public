export type PostDataType = {
    id: string;
    author_id: string;

    title: string;
    content: string;

    photos: string[];

    date: string;

    created_at: string;
    updated_at: string;
};

export type PostCommentType = {
    id: string;

    author_id: string;
    post_id: string;

    title: string;
    content: string;

    created_at: string;
    updated_at: string;
};

export type PostSummaryDataType = {
    today_count: number;
    monthly_count: number;
    month_overview: { [day: string]: boolean };
};
