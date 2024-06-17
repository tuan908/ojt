"use server";

import HttpClient from "@/configs/http-client.config";
import {cache} from "react";

type Grade = {
    id: number;
    name: string;
};

type StudentEvent = {
    id: number;
    name: string;
};

type HashtagPayload = {
    id: number;
    name: string;
    color: string;
};

/**
 * Get Grade List
 * @returns Grade List
 */
const getGrades = cache(
    async () => await HttpClient.get<Grade[]>("/common/grades", "node")
);

/**
 * Get current event
 * @returns Event List
 */
const getEvents = cache(
    async () => await HttpClient.get<StudentEvent[]>("/common/events", "node")
);

/**
 * Get hashtag list
 * @returns Hashtag list
 */
const getHashtags = cache(
    async () =>
        await HttpClient.get<HashtagPayload[]>("/common/hashtags", "node")
);

export {getEvents, getGrades, getHashtags};
export type {Grade, HashtagPayload, StudentEvent};
