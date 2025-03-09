/**
 * ServerActionResponse
 */
export type ServerActionResponse = {
    data: unknown;
    errors?: Array<{ path: unknown; message: string }>;
};

/**
 * Nullable of type T
 */
export type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

/**
 * ErrorResponse
 */
export type ErrorResponse = {
    message: string;
    type: string;
    code: number;
};

/**
 * Status code
 *  - Error
 *  - ResultNotFound
 *  - UpdateError
 *  - UpdateSuccess
 */
export const StatusCode = {
    InternalServerError: 9999,
    ResultNotFound: 0,
    Error: -1,
    Success: 1,
} as const;

/**
 * LayoutProps
 */
export type LayoutProps = Readonly<{ children: React.ReactNode }>;

export type RecursivelyReplaceNullWithUndefined<T> = T extends null
    ? undefined
    : T extends Date
      ? T
      : {
            [K in keyof T]: T[K] extends (infer U)[]
                ? RecursivelyReplaceNullWithUndefined<U>[]
                : RecursivelyReplaceNullWithUndefined<T[K]>;
        };

/**
 * Dynamic Page Props
 */
export type DynamicPageProps = {
    params: Promise<{ id: string; eventId: number }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type TableDto = {
    code: string;
    name: string;
    year: string;
    event: string;
    hashtag: string;
};

export type ApiResponse<T> = {
    data: T | null; // Generic Payload (nullable)
    code: string; // Response Code (e.g., "SUCCESS", "NOT_FOUND")
    message: string; // Human-readable message
    error?: string | null; // Optional error description (null if success)
    success: boolean; // Indicates success or failure
    pagination?: Pagination | null; // Optional pagination metadata
};

// Pagination Type
export type Pagination = {
    page: number; // Current page
    size: number; // Items per page
    totalItems: number; // Total number of items
    totalPages: number; // Total pages calculated from totalItems & size
};

// Utility Functions for API Responses
export const ApiResponse = {
    success<T>(data: T, message = "Success"): ApiResponse<T> {
        return { data, code: "SUCCESS", message, error: null, success: true, pagination: null };
    },

    paginated<T>(data: T[], message = "Success", pagination: Pagination): ApiResponse<T[]> {
        return {
            data: data ?? [], // Ensures non-null list
            code: "SUCCESS",
            message,
            error: null,
            success: true,
            pagination
        };
    },

    error<T>(code: string, message: string, error: string): ApiResponse<T> {
        return { data: null, code, message, error, success: false, pagination: null };
    },
};