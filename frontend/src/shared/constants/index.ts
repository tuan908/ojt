import type {MenuProps, SxProps, Theme} from '@mui/material';

export const UserRole = {
  /** 学生 */
  Student: '001',
  /** 家族 */
  Parent: '002',
  /** 先生 */
  Teacher: '003',
  /** カウンセラー */
  Counselor: '004',
};

export enum EventStatus {
  /** 未確認 */
  UNCONFIRMED = 1,
  /** 確認中 */
  UNDER_REVIEWING = 2,
  /** 修了 */
  CONFIRMED = 3,
}

/** Item height = 48px */
export const ITEM_HEIGHT = 48;

/** Item's padding top = 8px */
export const ITEM_PADDING_TOP = 8;

/** Default page size = 10 */
export const PAGE_SIZE = 10;

/** Sort increment */
export const SORT_ORDER_ASCENDING = 1;

/** Sort decrement */
export const SORT_ORDER_DESCENDING = 1;

export const Route = {
  /** /students */
  Students: '/students',
  /** /event/register */
  RegisterEven: '/event/register',
  /** /signin */
  Login: '/auth/login',
  /** / */
  Root: '/',
  /** /home */
  Home: '/home',
} as const;

/** Empty string - "" */
export const STRING_EMPTY = '';

export enum ScreenMode {
  NEW = 0,
  EDIT = 1,
  CHAT = 2,
}

/** クラス名 */
export const DEFAULT_GRADE_NAME_OPTION = 'クラス名';

/** イベント */
export const DEFAULT_EVENT_OPTION = 'イベント';

export const menuProps: Partial<MenuProps> = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  },
};

export const sx: SxProps<Theme> = {
  bgcolor: '#ffffff',
  paddingX: 1,
  '& .MuiSelect-select:focus': {
    bgcolor: 'transparent',
  },
};

/** Take from here: https://tailwindcss.com/docs/responsive-design */
export const MEDIA_QUERY = {
  SM: '(min-width:640px)',
  MD: '(min-width:768px)',
  LG: '(min-width:1024px)',
  XL: '(min-width:1280px)',
  '2XL': '(min-width:1536px)',
} as const;

export const ACCESS_TOKEN = 'access_token';

export const QUERY_KEY = {
  STUDENTS: 'Students',
  EVENT: 'Event',
};

/**
 * Predefined error types
 */
export const ErrorCodes = {
  // Client errors (4xx)
  BAD_REQUEST: 'bad_request',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  METHOD_NOT_ALLOWED: 'method_not_allowed',
  CONFLICT: 'conflict',
  UNPROCESSABLE_ENTITY: 'unprocessable_entity',
  TOO_MANY_REQUESTS: 'too_many_requests',

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR: 'internal_server_error',
  NOT_IMPLEMENTED: 'not_implemented',
  SERVICE_UNAVAILABLE: 'service_unavailable',

  // Custom domain errors
  VALIDATION_ERROR: 'validation_error',
  BUSINESS_CONSTRAINT_VIOLATION: 'business_constraint_violation',
  RESOURCE_EXISTS: 'resource_exists',
  RESOURCE_EXPIRED: 'resource_expired',
  DEPENDENCY_FAILURE: 'dependency_failure',
} as const;

// Type-safe error code union type
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const MediaQueries = {
  SM: `@media (width >= 40rem)`,
  MD: `@media (width >= 48rem)`,
  LG: `@media (width >= 64rem)`,
  XL: `@media (width >= 80rem)`,
  '2XL': `@media (width >= 96rem)`,
} as const;
