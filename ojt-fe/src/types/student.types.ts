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
    events: EventDetail[];
    hashtags: HashtagPayload[];
}>;

type StudentsRequest = Partial<{
    name: string;
    grade: string;
    events: string;
    hashtags: string[];
}>;

export type {EventDetail, StudentsRequest, StudentsResponse};
