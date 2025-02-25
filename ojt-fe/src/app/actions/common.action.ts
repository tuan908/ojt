"use server";

import { type SelectOption } from "@/components/Select";
import { honoApi } from "@/lib/api";
import { cache } from "react";
import type { Grade, Hashtag } from "@/types/common-action.types";

/**
 * Get Grade List
 * @returns Grade List
 */
export const getGrades = cache(
    async () => await honoApi.get<Grade[]>("/common/grades")
);

/**
 * Get current event
 * @returns Event List
 */
export const getEvents = cache(
    async () => await honoApi.get<SelectOption[]>("/common/events")
);

/**
 * Get hashtag list
 * @returns Hashtag list
 */
export const getHashtags = cache(
    async () => await honoApi.get<Hashtag[]>("/common/hashtags")
);
