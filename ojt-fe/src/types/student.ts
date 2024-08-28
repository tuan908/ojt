import type {Hashtag} from "@/types/common-action.types";
import type {Comment} from "@/types/event-action.types";

type EventDetailData = {
    eventsInSchoolLife: string;
    myAction: string;
    myThought: string;
    shownPower: string;
    strengthGrown: string;
};

export type EventDetail = {
    id: number;
    name: string;
    grade: string;
    status: number;
    comments: Comment[];
    data: Partial<EventDetailData>;
};

export type StudentsResponse = Partial<{
    id: number;
    code: string;
    name: string;
    grade: string;
    events: string;
    hashtags: Hashtag[];
}>;

export type Student = Partial<{
    name: string;
    grade: string;
    events: string;
    hashtags: string[];
}>;

export type Page<T> = {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPage: number;
    };
};

export type StudentEvent = {
    id: number;
    code: string;
    name: string;
    grade: string;
    events: Array<{
        id: number;
        grade: string;
        name: string;
        status: number;
        comments: Comment[];
    }>;
};
