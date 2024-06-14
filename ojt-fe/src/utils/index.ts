import {UserRole} from "@/constants";
import json from "@/i18n/jp.json";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export default class Utils {
    public static cn(...inputs: ClassValue[]) {
        return twMerge(clsx(inputs));
    }

    /**
     * Convert role
     * @param role Database stored role
     * @returns Converted string - from role
     */
    public static convertRole(role?: string) {
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
}
