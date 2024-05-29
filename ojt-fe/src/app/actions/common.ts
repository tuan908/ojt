"use server";

import {fetchNoCache} from "@/lib/utils/fetchNoCache";

type Grade = {
    id: number;
    name: string;
};

type StudentEvent = {
    id: number;
    name: string;
};

type Hashtag = {
    id: number;
    name: string;
    color: string;
};

const get = async <T>(path: string) => await fetchNoCache<T[]>(path);

/**
 * Get Grade List
 * @returns Grade List
 */
const getGrades = async () => await get<Grade>("/common/grades");

/**
 * Get current event
 * @returns Event List
 */
const getEvents = async () => await get<StudentEvent>("/common/events");

/**
 * Get hashtag list
 * @returns Hashtag list
 */
const getHashtags = async () => await get<Hashtag>("/common/hashtags");

export {getEvents, getGrades, getHashtags};
export type {StudentEvent, Grade, Hashtag};
