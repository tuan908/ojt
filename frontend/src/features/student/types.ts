import { z } from "zod";
import type { TComment } from "../comment/types";
import { StudentEventSchema } from "./validations";

type StudentEventData = {
    eventsInSchoolLife: string;
    myAction: string;
    myThought: string;
    shownPower: string;
    strengthGrown: string;
};

export type StudentEvent = {
    id: number;
    name: string;
    grade: string;
    status: number;
    comments: TComment[];
    data: Partial<StudentEventData>;
};

export type StudentDto = {
    id: number;
    code: string;
    name: string;
    grade: string;
    events: Array<{
        studentEventId: number;
        eventName: string;
        grade: string;
        status: number;
        commentCount: number;
    }>;
};

/**
 * RegisterEventDto
 */
export type RegisterEvent = z.infer<typeof StudentEventSchema>;
