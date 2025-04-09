import {z} from 'zod';
import {CreateCommentSchema} from '../student/validations';

export interface ICreateCommentDto
  extends z.infer<typeof CreateCommentSchema> {}

export interface ICommentDto {
  id?: number;
  name?: string;
  roleName?: string;
  createdAt?: string;
  username?: string;
  content?: string;
}

export interface IDeleteCommentDto {
  studentEventId: number;
  commentId: number;
}
