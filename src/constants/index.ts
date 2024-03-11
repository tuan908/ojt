export const Collection = {
    User: "ojt_user",
    Event: "ojt_event",
    ChartLabel: "ojt_chart_label",
    EventDetail: "ojt_event_detail",
    Grade: "ojt_student_grade",
    Hashtag: "ojt_hashtag",
    Student: "ojt_student",
    Account: "ojt_account",
} as const;

export const UserRole = {
    Student: "001",
    Parent: "002",
    Teacher: "003",
    Counselor: "004",
} as const;

export const EventStatus = {
    "To do": 0,
    "Doing": 1,
    "Done": 2,
} as const;

export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;
