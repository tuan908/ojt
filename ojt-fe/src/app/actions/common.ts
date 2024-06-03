"use server";

import HttpClient from "@/configs/http-client.config";
import {KeyPart} from "@/constants";
import {unstable_cache} from "next/cache";

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
const getGrades = unstable_cache(
    async () => await HttpClient.get<Grade[]>("/common/grades"),
    [KeyPart.Common.Grade]
);

/**
 * Get current event
 * @returns Event List
 */
const getEvents = unstable_cache(
    async () => await HttpClient.get<StudentEvent[]>("/common/events"),
    [KeyPart.Common.Event]
);

/**
 * Get hashtag list
 * @returns Hashtag list
 */
const getHashtags = unstable_cache(
    async () => await HttpClient.get<HashtagPayload[]>("/common/hashtags"),
    [KeyPart.Common.Hashtag]
);

export {getEvents, getGrades, getHashtags};
export type {Grade, HashtagPayload, StudentEvent};
