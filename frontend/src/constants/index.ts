import type { MenuProps, SxProps, Theme } from "@mui/material";

export enum Entity {
    User = "_user",
    Event = "_event",
    StudentEvent = "_student_event",
    StudentEventDetail = "_student_event_detail",
    Grade = "_grade",
    Hashtag = "_hashtag",
    StudentHashTag = "_student_hashtag",
    Comment = "_comment",
}

export const UserRole = {
    /** 学生 */
    Student: "001",
    /** 家族 */
    Parent: "002",
    /** 先生 */
    Teacher: "003",
    /** カウンセラー */
    Counselor: "004",
} as const;

export enum EventStatus {
    /** 未確認 */
    UNCONFIRMED = 1,
    /** 確認中 */
    UNDER_REVIEWING = 2,
    /** 修了 */
    CONFIRMED = 3,
}

/** Item height = 48px */
export const ITEM_HEIGHT = 48;

/** Item's padding top = 8px */
export const ITEM_PADDING_TOP = 8;

/** Default page size = 10 */
export const PAGE_SIZE = 10;

/** Sort increment */
export const SORT_ORDER_ASCENDING = 1;

/** Sort decrement */
export const SORT_ORDER_DESCENDING = 1;

export enum Route {
    /** /students */
    Students = "/students",
    /** /event/register */
    RegisterEvent = "/event/register",
    /** /login */
    Login = "/login",
    /** / */
    Root = "/",
    /** /home */
    Home = "/home",
}

/** Empty string - "" */
export const STRING_EMPTY = "";

export enum ScreenMode {
    NEW = 0,
    EDIT = 1,
    CHAT = 2,
}

/** クラス名 */
export const DEFAULT_GRADE_NAME_OPTION = "クラス名";

/** イベント */
export const DEFAULT_EVENT_OPTION = "イベント";

export const menuProps: Partial<MenuProps> = {
    slotProps: {
        paper: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            },
        },
    },
};

export const sx: SxProps<Theme> = {
    bgcolor: "#ffffff",
    paddingX: 1,
    "& .MuiSelect-select:focus": {
        bgcolor: "transparent",
    },
};

/** Take from here: https://tailwindcss.com/docs/responsive-design */
export const MEDIA_QUERY = {
    SM: "(min-width:640px)",
    MD: "(min-width:768px)",
    LG: "(min-width:1024px)",
    XL: "(min-width:1280px)",
    "2XL": "(min-width:1536px)",
} as const;
