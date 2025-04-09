import {z} from 'zod';
import json from '~/shared/i18n/locales/ja.json';

export const StudentEventDataSchema = z.object({
  eventName: z
    .string({message: json.error.eventFieldRequired})
    .min(1, {message: json.error.eventFieldRequired}),
  eventsInSchoolLife: z.string().optional(),
  myAction: z.string().optional(),
  shownPower: z.string().optional(),
  strengthGrown: z.string().optional(),
  myThought: z.string().optional(),
});

export const CreateStudentEventSchema = z.object({
  studentCode: z.string(),
  username: z.string(),
  gradeName: z.string(),
  data: StudentEventDataSchema,
});

export interface ICreateStudentEventDto
  extends z.infer<typeof CreateStudentEventSchema> {}

export const EditStudentEventSchema = z.object({
  id: z.number(),
  studentCode: z.string(),
  username: z.string(),
  gradeName: z.string(),
  data: StudentEventDataSchema,
});

export interface IEditStudentEventDto
  extends z.infer<typeof EditStudentEventSchema> {}

export const CreateCommentSchema = z.object({
  studentEventId: z.number(),
  username: z.string(),
  content: z.string().optional(),
});
