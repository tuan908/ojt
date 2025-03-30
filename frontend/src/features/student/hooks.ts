import {
    addComment,
    createEvent,
    editComment,
    getStudentEvent,
} from "@/app/actions/event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Hook for fetching student event
export const useStudentEvent = ({
    studentCode,
    studentEventId,
}: {
    studentEventId: string;
    studentCode: string;
}) => {
    return useQuery({
        queryKey: ["studentEvent", studentEventId],
        queryFn: () => getStudentEvent({ studentCode, studentEventId }),
    });
};

// Hook for adding comment
export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addComment,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
};

// Hook for editing comment
export const useEditComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
};

// Hook for registering event
export const useRegisterEvent = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            router.back();
        },
    });
};
