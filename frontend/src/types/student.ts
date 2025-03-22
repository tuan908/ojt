import type { Hashtag } from "@/types/common";
import type { Comment } from "@/types/event";

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
    event: string;
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

type StudentEventData = {
    id: number;
    grade: string;
    name: string;
    status: number;
    comments: Comment[];
};

export type StudentEvent = {
    id: number;
    code: string;
    name: string;
    grade: string;
    events: StudentEventData[];
};
