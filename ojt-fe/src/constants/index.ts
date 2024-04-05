export enum CollectionName {
    User = "ojt_user",
    Event = "ojt_event",
    StudentEvent = "ojt_student_event",
    StudentEventDetail = "ojt_student_event_detail",
    Grade = "ojt_grade",
    Hashtag = "ojt_hashtag",
    StudentHashTag = "ojt_student_hashtag",
}

export enum UserRole {
    Student = "001",
    Parent = "002",
    Teacher = "003",
    Counselor = "004",
}

export enum EventStatus {
    UNCONFIRMED = 1,
    UNDER_REVIEWING = 2,
    CONFIRMED = 3,
}

export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;
// Default page size:
// AstraDB can only sort with a page of size 10 only:
export const PAGE_SIZE = 10;

// Sort increment
export const SORT_ORDER_ASCENDING = 1;

//Sort decrement
export const SORT_ORDER_DESCENDING = 1;

export enum Route {
    StudentList = "/student/list",
    RegisterEvent = "/event/register",
    Login = "/login",
    Root = "/",
    Home = "/home",
}

export const STRING_EMPTY = "";

export enum ScreenMode {
    NEW = 0,
    EDIT = 1,
    CHAT = 2,
}
