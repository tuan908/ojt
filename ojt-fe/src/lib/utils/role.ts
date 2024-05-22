import {OjtUserRole} from "@/constants";

/**
 * Convert role
 * @param role Database stored role
 * @returns Converted string - from role
 */
export function convertRole(role?: string) {
    switch (role) {
        case OjtUserRole.Counselor:
            return "カウンセラー";

        case OjtUserRole.Parent:
            return "家族";

        case OjtUserRole.Student:
            return "学生";

        case OjtUserRole.Teacher:
            return "先生";

        default:
            throw new Error("Invalid Role");
    }
}
