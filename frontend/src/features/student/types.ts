import {z} from 'zod';
import {CreateStudentEventSchema, StudentEventDataSchema} from './validations';

interface IStudentEventDataDto {
  eventName: string;
  eventsInSchoolLife: string;
  myAction: string;
  myThought: string;
  shownPower: string;
  strengthGrown: string;
}

export interface IStudentEventDto {
  id: number;
  name: string;
  grade: string;
  status: number;
  data: IStudentEventDataDto;
}

export interface IStudentDto {
  id: number;
  code: string;
  name: string;
  grade: string;
  events: Array<{
    studentEventId: number;
    eventName: string;
    title: string;
    grade: string;
    status: number;
    commentCount: number;
  }>;
}

export type ICreateStudentEventDto = z.infer<typeof CreateStudentEventSchema>;

export type ICreateStudentEventDataDto = z.infer<typeof StudentEventDataSchema>;
