import { getStudentEvent } from "@/app/actions/event";
import { QUERY_KEY } from "@/shared/constants";
import { queryOptions } from "@tanstack/react-query";

export const studentEventOptions = ({
    studentCode,
    studentEventId,
}: {
    studentCode: string;
    studentEventId: string;
}) => {
    const queryKey = [QUERY_KEY.EVENT, studentCode, studentEventId];
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const response = await getStudentEvent({
                studentCode,
                studentEventId,
            });

            return response!;
        },
    });
};
