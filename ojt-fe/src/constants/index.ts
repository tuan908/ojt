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

export enum UserRole {
    /** 学生 */
    Student = "001",
    /** 家族 */
    Parent = "002",
    /** 先生 */
    Teacher = "003",
    /** カウンセラー */
    Counselor = "004",
}

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
export const GRADE_OPTION_DEFAULT = "クラス名";

/** イベント */
export const EVENT_OPTION_DEFAULT = "イベント";

export const KeyPart = {
    Common: {
        Event: "common/event",
        Hashtag: "common/hashtag",
        Grade: "common/grade",
    },
    Students: "students",
    Student: {
        Default: "student/student",
        EventDetail: "student/event-detail",
    },
} as const;
