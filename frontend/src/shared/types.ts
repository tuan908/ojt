export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date
    ? T
    : {
        [K in keyof T]: T[K] extends (infer U)[]
          ? RecursivelyReplaceNullWithUndefined<U>[]
          : RecursivelyReplaceNullWithUndefined<T[K]>;
      };

interface IParam {
  code: string;
  student_event_id: number;
}

interface ISearchParam {
  [key: string]: string | string[] | undefined;
}

export interface IPageProps {
  params: Promise<IParam>;
  searchParams?: Promise<ISearchParam>;
}

export interface IApiResponse<TData = unknown> {
  success: boolean;
  status: {
    code: number;
    message: string;
  };
  requestId: string;
  timestamp: string;
  data?: TData;
  error?: IApiError;
  pagination?: IPagination;
}

export interface IApiError {
  code: string;
  message: string;
  details?: unknown;
  path?: string;
  stack?: string;
  errors?: IValidationError[];
}

export interface IValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface IPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPageUrl?: string;
  previousPageUrl?: string;
}

export interface IGradeDto {
  id: number;
  name: string;
}

export interface IHashtagDto {
  id: number;
  name: string;
  color: string;
}

export interface IEventDto {
  id: number;
  name: string;
}

export interface IStudentsDto
  extends Partial<{
    id: number;
    code: string;
    name: string;
    grade: string;
    events: string;
    hashtags: IHashtagDto[];
  }> {}

export interface IStudentDto
  extends Partial<{
    name: string;
    grade: string;
    event: string;
    hashtags: string;
  }> {}
