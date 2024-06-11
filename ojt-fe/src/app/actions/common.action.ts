"use server";

import HttpClient from "@/configs/http-client.config";
import {KeyPart} from "@/constants";

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
const getGrades = async () => await HttpClient.get<Grade[]>("/common/grades");

/**
 * Get current event
 * @returns Event List
 */
const getEvents = async () =>
    await HttpClient.get<StudentEvent[]>("/common/events");

/**
 * Get hashtag list
 * @returns Hashtag list
 */
const getHashtags = async () =>
    await HttpClient.get<HashtagPayload[]>("/common/hashtags");

export {getEvents, getGrades, getHashtags};
export type {Grade, HashtagPayload, StudentEvent};
