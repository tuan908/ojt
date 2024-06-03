import type {HashtagPayload} from "@/app/actions/common";
import type {Comment} from "@/app/actions/event";

type EventDetail = {
    id: number;
    name: string;
    grade: string;
    status: number;
    comments: Comment[];
    data: Partial<{
        eventsInSchoolLife: string;
        myAction: string;
        myThought: string;
        shownPower: string;
        strengthGrown: string;
    }>;
};

type StudentsResponse = Partial<{
    id: number;
    code: string;
    name: string;
    grade: string;
    events: string;
    hashtags: HashtagPayload[];
}>;

type StudentsRequest = Partial<{
    name: string;
    grade: string;
    events: string;
    hashtags: string[];
}>;

export type {EventDetail, StudentsRequest, StudentsResponse};

export type Page<T> = {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPage: number;
    };
};

export type StudentEventResponse = {
    id: number;
    code: string;
    name: string;
    grade: string;
    events: Array<{
        id: number;
        grade: string;
        name: string;
        status: number;
        comments: number;
    }>;
};
