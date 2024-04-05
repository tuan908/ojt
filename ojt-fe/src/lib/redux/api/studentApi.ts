import {EventDetailDto, StudentResponseDto} from "@/types/student.types";
import {baseApi} from "../baseApi";

const studentApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getEventListByStudentCode: builder.query<StudentResponseDto, string>({
            query: arg => `/api/student/${arg}`,
            transformResponse: (data: StudentResponseDto) => data,
        }),
    }),
    overrideExisting: true,
});

export const {
    endpoints: {getEventListByStudentCode},
} = studentApi;
