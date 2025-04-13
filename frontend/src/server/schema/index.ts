import {relations} from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

const Comment = pgTable('t_comment', {
  id: serial('id').primaryKey(),
  content: text('content'),
  createdAt: timestamp('created_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }).defaultNow(),
  isDeleted: boolean('is_deleted').default(false),
  userId: integer('user_id')
    .references(() => User.id, {onDelete: 'cascade'})
    .notNull(),
  studentEventId: integer('student_event_id')
    .references(() => StudentEvent.id, {onDelete: 'cascade'})
    .notNull(),
});

const commentRelations = relations(Comment, ({one}) => ({
  user: one(User, {
    fields: [Comment.userId],
    references: [User.id],
  }),
  eventDetail: one(StudentEvent, {
    fields: [Comment.studentEventId],
    references: [StudentEvent.id],
  }),
}));

const Event = pgTable('t_event', {
  id: serial('id').primaryKey(),
  title: text('title'),
  name: text('name'),
  description: text('description'),
  createdAt: timestamp('created_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean('is_deleted'),
});

const StudentEvent = pgTable('t_student_event', {
  id: serial('id').primaryKey(),
  data: jsonb('data'),
  status: integer('status'),
  createdAt: timestamp('created_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean('is_deleted'),
  eventId: integer('detail_id')
    .references(() => Event.id)
    .notNull(),
  gradeId: integer('grade_id')
    .references(() => Grade.id)
    .notNull(),
  studentId: integer('student_id')
    .references(() => Student.id)
    .notNull(),
  commentId: integer('comment_id')
    .references(() => Student.id)
    .notNull(),
});

const studentEventRelations = relations(StudentEvent, ({one}) => ({
  student: one(Student, {
    fields: [StudentEvent.studentId],
    references: [Student.id],
  }),
  event: one(Event, {
    fields: [StudentEvent.eventId],
    references: [Event.id],
  }),
  grade: one(Grade, {
    fields: [StudentEvent.gradeId],
    references: [Grade.id],
  }),
  comments: one(Comment, {
    fields: [StudentEvent.commentId],
    references: [Comment.id],
  }),
}));

const Grade = pgTable('t_grade', {
  id: serial('id').primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean('is_deleted'),
});

const Hashtag = pgTable('t_hashtag', {
  id: serial('id').primaryKey(),
  name: text('name'),
  color: text('color'),
  createdAt: timestamp('created_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean('is_deleted'),
});

const hashtagRelations = relations(Hashtag, ({many}) => ({
  studentHashtags: many(StudentHashtag),
}));

const Student = pgTable('t_student', {
  id: serial('id').primaryKey(),
  code: text('code'),
  createdAt: timestamp('created_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean('is_deleted'),
  userId: integer('user_id')
    .references(() => User.id)
    .notNull(),
  gradeId: integer('grade_id')
    .references(() => Grade.id)
    .notNull(),
});

const studentRelations = relations(Student, ({many, one}) => ({
  eventDetail: many(StudentEvent),
  user: one(User, {
    fields: [Student.userId],
    references: [User.id],
  }),
  studentHashtag: many(StudentHashtag),
  grade: one(Grade, {
    fields: [Student.gradeId],
    references: [Grade.id],
  }),
}));

const User = pgTable('t_user', {
  id: serial('id').primaryKey(),
  password: text('password'),
  userRole: text('user_role', {enum: ['001', '002', '003', '004']}).default(
    '001',
  ),
  username: text('username'),
  name: text('name'),
  createdAt: timestamp('created_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean('is_deleted'),
});

const userRelations = relations(User, ({many}) => ({
  comments: many(Comment),
}));

const StudentHashtag = pgTable(
  't_student_hashtag',
  {
    studentId: integer('student_id')
      .references(() => Student.id)
      .notNull(),
    hashtagId: integer('hashtag_id')
      .references(() => Hashtag.id)
      .notNull(),
    studentEventId: integer('student_event_id')
      .references(() => Hashtag.id)
      .notNull(),
    count: integer('count').default(0),
    createdAt: timestamp('created_at', {
      mode: 'string',
      precision: 6,
      withTimezone: true,
    }),
    updatedAt: timestamp('updated_at', {
      mode: 'string',
      precision: 6,
      withTimezone: true,
    }),
    isDeleted: boolean('is_deleted'),
  },
  t => [
    {
      pk: primaryKey({columns: [t.studentId, t.hashtagId, t.studentEventId]}),
    },
  ],
);

const studentHashtagRelations = relations(StudentHashtag, ({one}) => ({
  student: one(Student, {
    fields: [StudentHashtag.studentId],
    references: [Student.id],
  }),
  hashtag: one(Hashtag, {
    fields: [StudentHashtag.hashtagId],
    references: [Hashtag.id],
  }),
}));

const DbSchema = {
  Student,
  Comment,
  Event,
  StudentEvent,
  Grade,
  Hashtag,
  StudentHashtag,
  User,
  studentRelations,
  commentRelations,
  studentEventRelations,
  hashtagRelations,
  studentHashtagRelations,
  userRelations,
};

export default DbSchema;
