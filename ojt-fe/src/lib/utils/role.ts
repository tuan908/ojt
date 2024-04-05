import {UserRole} from "@/constants";

/**
 * Convert role
 * @param role Database stored role
 * @returns Converted string - from role
 */
export function convertRole(role?: string) {
    switch (role) {
        case UserRole.Counselor:
            return "Counselor";

        case UserRole.Parent:
            return "Parent";

        case UserRole.Student:
            return "Student";

        case UserRole.Teacher:
            return "Teacher";

        default:
            throw new Error("Invalid Role");
    }
}
