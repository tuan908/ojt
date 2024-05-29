export enum OjtEntity {
    User = "ojt_user",
    Event = "ojt_event",
    StudentEvent = "ojt_student_event",
    StudentEventDetail = "ojt_student_event_detail",
    Grade = "ojt_grade",
    Hashtag = "ojt_hashtag",
    StudentHashTag = "ojt_student_hashtag",
    Comment = "ojt_comment",
}

export enum OjtUserRole {
    /** 学生 */
    Student = "001",
    /** 家族 */
    Parent = "002",
    /** 先生 */
    Teacher = "003",
    /** カウンセラー */
    Counselor = "004",
}

export enum OjtEventStatus {
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

export enum OjtRoute {
    /** /student/list */
    StudentList = "/student/list",
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

export enum OjtScreenMode {
    NEW = 0,
    EDIT = 1,
    CHAT = 2,
}

/** クラス名 */
export const GRADE_OPTION_DEFAULT = "クラス名";

/** イベント */
export const EVENT_OPTION_DEFAULT = "イベント";
