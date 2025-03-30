import type { TrackingData } from "@/features/tracking/types";
import ApiClient from "@/shared/lib/api-client";
import type { ApiResponse } from "@/shared/types";

export async function getTracking(studentCode: string) {
    const response = await ApiClient.Hono.get<ApiResponse<TrackingData>>(`/trackings`, {
        tag: "trackings",
        params: { studentCode },
    });
    return response?.data;
}
