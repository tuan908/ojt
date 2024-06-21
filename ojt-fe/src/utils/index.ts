import {UserRole} from "@/constants";
import json from "@/i18n/jp.json";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export const convertRole = (role?: string) => {
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
};

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
