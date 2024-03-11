import {Collection} from "@/constants";
import {pgTable, serial, text, timestamp, boolean, integer} from "drizzle-orm/pg-core";

export const users = pgTable(Collection.User, {
    id: serial("id").primaryKey(),
    username: text("username"),
    password: text("password"),
    role: text("role"),
    eventId: integer("events").array(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const hashtags = pgTable(Collection.Hashtag, {
    id: serial("id").primaryKey(),
    name: text("name"),
    color: text("color"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable(Collection.Event, {
    id: serial("id").primaryKey(),
    name: text("name"),
    status: text("status"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const grades = pgTable(Collection.Grade, {
    id: serial("id").primaryKey(),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventDetails = pgTable(Collection.EventDetail, {
    id: serial("id").primaryKey(),
    studentId: text("student_id").primaryKey(),
    name: text("name"),
    events: text("events").array(),
    hashtags:text("hashtags").array(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});