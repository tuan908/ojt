"use server";

import Utils from "@/utils";

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
const getGrades = async () =>
    await Utils.RestTemplate.get<Grade[]>("/common/grades");

/**
 * Get current event
 * @returns Event List
 */
const getEvents = async () =>
    await Utils.RestTemplate.get<StudentEvent[]>("/common/events");

/**
 * Get hashtag list
 * @returns Hashtag list
 */
const getHashtags = async () =>
    await Utils.RestTemplate.get<HashtagPayload[]>("/common/hashtags");

export {getEvents, getGrades, getHashtags};
export type {Grade, HashtagPayload, StudentEvent};
