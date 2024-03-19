import {MaybeUndefined} from ".";

type EventDto = Array<{
    id: string;
    name: string;
    status: number;
    comments: number;
}>[number];

type HashtagDto = Array<{
    id: string;
    name: string;
    color: string;
}>[number];

type StudentResponseDto = Partial<{
    id: number;
    studentCode: string;
    studentName: string;
    schoolYear: string;
    events: EventDto[];
    hashtags: HashtagDto[];
}>;

type StudentListRequestDto = MaybeUndefined<{
    studentName: string;
    schoolYear: string;
    events: string;
    hashtags: string[];
}>;

interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

interface Page<T> {
    content: T[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export type {
    EventDto,
    HashtagDto,
    Page,
    StudentListRequestDto,
    StudentResponseDto,
};
