import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'canvas', 'printData', 'iframe'
  order: integer("order").notNull(),
  requiredCourse: integer("required_course").references(() => courses.id),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  completedTutorials: json("completed_tutorials").$type<number[]>().default([]),
  currentTutorial: integer("current_tutorial").default(1),
  currentCourse: integer("current_course").default(1),
  completedCourses: json("completed_courses").$type<number[]>().default([]),
  stars: integer("stars").default(0),
});

export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  starterCode: text("starter_code").notNull(),
  expectedOutput: text("expected_output"),
  order: integer("order").notNull(),
  isLocked: boolean("is_locked").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertTutorialSchema = createInsertSchema(tutorials).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
