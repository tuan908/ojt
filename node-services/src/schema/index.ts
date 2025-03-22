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

const Comment = pgTable("t_comment", {
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
        .references(() => User.id, { onDelete: "cascade" })
        .notNull(),
    eventDetailId: integer("event_detail_id")
        .references(() => EventDetail.id, { onDelete: "cascade" })
        .notNull(),
});

const commentRelations = relations(Comment, ({ one }) => ({
    user: one(User, {
        fields: [Comment.userId],
        references: [User.id],
    }),
    eventDetail: one(EventDetail, {
        fields: [Comment.eventDetailId],
        references: [EventDetail.id],
    }),
}));

const Event = pgTable("t_event", {
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

const EventDetail = pgTable("t_event_detail", {
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
        .references(() => Event.id)
        .notNull(),
    gradeId: integer("grade_id")
        .references(() => Grade.id)
        .notNull(),
    studentId: integer("student_id")
        .references(() => Student.id)
        .notNull(),
});

const eventDetailRelations = relations(EventDetail, ({ one, many }) => ({
    student: one(Student, {
        fields: [EventDetail.studentId],
        references: [Student.id],
    }),
    event: one(Event, {
        fields: [EventDetail.detailId],
        references: [Event.id],
    }),
    grade: one(Grade, {
        fields: [EventDetail.gradeId],
        references: [Grade.id],
    }),
    comments: many(Comment),
}));

const Grade = pgTable("t_grade", {
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

const Hashtag = pgTable("t_hashtag", {
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

const hashtagRelations = relations(Hashtag, ({ many }) => ({
    studentHashtags: many(StudentHashtag),
}));

const Student = pgTable("t_student", {
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
        .references(() => User.id)
        .notNull(),
    gradeId: integer("grade_id")
        .references(() => Grade.id)
        .notNull(),
});

const studentRelations = relations(Student, ({ many, one }) => ({
    eventDetail: many(EventDetail),
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

const User = pgTable("t_user", {
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

const userRelations = relations(User, ({ many }) => ({
    comments: many(Comment),
}));

const StudentHashtag = pgTable(
    "t_student_hashtag",
    {
        studentId: integer("student_id")
            .references(() => Student.id)
            .notNull(),
        hashtagId: integer("hashtag_id")
            .references(() => Hashtag.id)
            .notNull(),
        value: jsonb("value"),
    },
    t => [
        {
            pk: primaryKey({ columns: [t.studentId, t.hashtagId] }),
        },
    ]
);

const studentHashtagRelations = relations(StudentHashtag, ({ one }) => ({
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
    EventDetail,
    Grade,
    Hashtag,
    StudentHashtag,
    User,
    studentRelations,
    commentRelations,
    eventDetailRelations,
    hashtagRelations,
    studentHashtagRelations,
    userRelations,
};

export default DbSchema;
