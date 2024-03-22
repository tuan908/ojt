import type {CommentDto} from "@/app/actions/event";
import type {MaybeUndefined} from ".";

type EventDto = Array<{
    id: number;
    name: string;
    grade: string;
    status: number;
    comments: CommentDto[];
}>[number];

type HashtagDto = Array<{
    id: number;
    name: string;
    color: string;
}>[number];

type StudentResponseDto = Partial<{
    id: number;
    code: string;
    name: string;
    grade: string;
    events: EventDto[];
    hashtags: HashtagDto[];
}>;

type StudentListRequestDto = MaybeUndefined<{
    name: string;
    grade: string;
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
