/**
 * UserInfo
 */
export interface IUserInfo {
  id: string;
  password: string;
  name: string;
  username: string;
  role: string;
  grade: string;
  code: string;
}

export interface ILoginResponseDto extends IUserInfo {
  accessToken: string;
}

/**
 * Login State
 */
export interface ILoginState {
  message: string;
  user?: IUserInfo;
}
