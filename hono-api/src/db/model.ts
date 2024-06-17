import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const comment = pgTable("ojt_comment", {
  id: serial("id").primaryKey(),
  content: text("content"),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean("is_deleted"),
  userId: integer("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  eventDetailId: integer("event_detail_id")
    .references(() => eventDetail.id, { onDelete: "cascade" })
    .notNull(),
});

const commentRelations = relations(comment, ({ one }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  eventDetail: one(eventDetail, {
    fields: [comment.eventDetailId],
    references: [eventDetail.id],
  }),
}));

const event = pgTable("ojt_event", {
  id: serial("id").primaryKey(),
  description: text("description"),
  name: text("name"),
  title: text("title"),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean("is_deleted"),
});

const eventDetail = pgTable("ojt_event_detail", {
  id: serial("id").primaryKey(),
  data: jsonb("data"),
  status: integer("status"),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean("is_deleted"),
  detailId: integer("detail_id")
    .references(() => event.id)
    .notNull(),
  gradeId: integer("grade_id")
    .references(() => grade.id)
    .notNull(),
  studentId: integer("student_id")
    .references(() => student.id)
    .notNull(),
});

const eventDetailRelations = relations(eventDetail, ({ one }) => ({
  student: one(student, {
    fields: [eventDetail.studentId],
    references: [student.id],
  }),
  event: one(event, {
    fields: [eventDetail.detailId],
    references: [event.id],
  }),
  grade: one(grade, {
    fields: [eventDetail.gradeId],
    references: [grade.id],
  }),
}));

const grade = pgTable("ojt_grade", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean("is_deleted"),
});

const hashtag = pgTable("ojt_hashtag", {
  id: serial("id").primaryKey(),
  name: text("name"),
  color: text("color"),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean("is_deleted"),
});

const hashtagRelations = relations(hashtag, ({ many }) => ({
  studentHashtags: many(studentHashtag),
}));

const student = pgTable("ojt_student", {
  id: serial("id").primaryKey(),
  code: text("code"),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean("is_deleted"),
  userId: integer("user_id")
    .references(() => user.id)
    .notNull(),
  gradeId: integer("grade_id")
    .references(() => grade.id)
    .notNull(),
});

const studentRelations = relations(student, ({ many, one }) => ({
  eventDetail: many(eventDetail),
  user: one(user, {
    fields: [student.userId],
    references: [user.id],
  }),
  studentHashtag: many(studentHashtag),
  grade: one(grade, {
    fields: [student.gradeId],
    references: [grade.id],
  }),
}));

const user = pgTable("ojt_user", {
  id: serial("id").primaryKey(),
  password: text("password"),
  role: text("role", { enum: ["001", "002", "003", "004"] }),
  username: text("username"),
  name: text("name"),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    precision: 6,
    withTimezone: true,
  }),
  isDeleted: boolean("is_deleted"),
});

const userRelations = relations(user, ({ many }) => ({
  comments: many(comment),
}));

const studentHashtag = pgTable(
  "ojt_student_hashtag",
  {
    studentId: integer("student_id")
      .references(() => student.id)
      .notNull(),
    hashtagId: integer("hashtag_id")
      .references(() => hashtag.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.studentId, t.hashtagId] }),
  })
);

const studentHashtagRelations = relations(studentHashtag, ({ one }) => ({
  student: one(student, {
    fields: [studentHashtag.studentId],
    references: [student.id],
  }),
  hashtag: one(hashtag, {
    fields: [studentHashtag.hashtagId],
    references: [hashtag.id],
  }),
}));

const model = {
  student,
  comment,
  commentRelations,
  event,
  eventDetail,
  eventDetailRelations,
  grade,
  hashtag,
  hashtagRelations,
  studentRelations,
  studentHashtag,
  studentHashtagRelations,
  user,
  userRelations,
};

export default model;
