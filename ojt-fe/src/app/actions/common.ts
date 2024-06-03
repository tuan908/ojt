"use server";

import {KeyPart} from "@/constants";
import Utils from "@/utils";
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
    async () => await Utils.RestTemplate.get<Grade[]>("/common/grades"),
    [KeyPart.Common.Grade]
);

/**
 * Get current event
 * @returns Event List
 */
const getEvents = unstable_cache(
    async () => await Utils.RestTemplate.get<StudentEvent[]>("/common/events"),
    [KeyPart.Common.Event]
);

/**
 * Get hashtag list
 * @returns Hashtag list
 */
const getHashtags = unstable_cache(
    async () =>
        await Utils.RestTemplate.get<HashtagPayload[]>("/common/hashtags"),
    [KeyPart.Common.Hashtag]
);

export {getEvents, getGrades, getHashtags};
export type {Grade, HashtagPayload, StudentEvent};
