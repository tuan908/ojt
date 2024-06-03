import {OjtUserRole} from "@/constants";
import json from "@/dictionaries/jp.json";
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
            case OjtUserRole.Counselor:
                return json.role.counselor;

            case OjtUserRole.Parent:
                return json.role.parent;

            case OjtUserRole.Student:
                return json.role.student;

            case OjtUserRole.Teacher:
                return json.role.teacher;

            default:
                throw new Error("Invalid Role");
        }
    }
}
