/**
 * UserInfo
 */
export type UserInfo = {
    id: number;
    name: string;
    username: string;
    role: string;
    grade: string;
    code: string;
};

/**
 * Login State
 */
export type LoginState = {
    message: string;
    user?: UserInfo;
};
