import { UserRole } from "@/constants";
import json from "@/i18n/jp.json";
import { RecursivelyReplaceNullWithUndefined } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertRole(role?: string) {
    switch (role) {
        case UserRole.Counselor:
            return json.role.counselor;

        case UserRole.Parent:
            return json.role.parent;

        case UserRole.Student:
            return json.role.student;

        case UserRole.Teacher:
            return json.role.teacher;

        default:
            throw new Error("Invalid Role");
    }
}

export function nullsToUndefined<T>(
    obj: T
): RecursivelyReplaceNullWithUndefined<T> {
    if (obj === null) {
        return undefined as any;
    }

    // object check based on: https://stackoverflow.com/a/51458052/6489012
    if (obj?.constructor.name === "Object") {
        for (let key in obj) {
            obj[key] = nullsToUndefined(obj[key]) as any;
        }
    }
    return obj as any;
}
