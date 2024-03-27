import type {CommentDto} from "@/app/actions/event";
import type {MaybeUndefined} from ".";

type EventDetailDto = Array<{
    id: number;
    name: string;
    grade: string;
    status: number;
    comments: CommentDto[];
    data: Partial<{
        eventsInSchoolLife: string;
        myAction: string;
        myThought: string;
        shownPower: string;
        strengthGrown: string;
    }>;
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
    events: EventDetailDto[];
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
    EventDetailDto,
    HashtagDto,
    Page,
    StudentListRequestDto,
    StudentResponseDto,
};
