import {UserRole} from "@/constants";

/**
 * Convert role
 * @param role Database stored role
 * @returns Converted string - from role
 */
export function convertRole(role?: string) {
    switch (role) {
        case UserRole.Counselor:
            return "カウンセラー";

        case UserRole.Parent:
            return "家族";

        case UserRole.Student:
            return "学生";

        case UserRole.Teacher:
            return "先生";

        default:
            throw new Error("Invalid Role");
    }
}
