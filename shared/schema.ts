import { z } from "zod";

// Pure TypeScript types without database dependencies
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  type: string; // 'canvas', 'printData', 'iframe'
  order: number;
  requiredCourse: number | null;
}

export interface UserProgress {
  id: number;
  userId: number;
  completedTutorials: number[];
  currentTutorial: number;
  currentCourse: number;
  completedCourses: number[];
  stars: number;
}

export interface Tutorial {
  id: number;
  courseId: number;
  title: string;
  description: string;
  content: string;
  starterCode: string;
  expectedOutput?: string;
  order: number;
  isLocked: boolean;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertUserProgressSchema = z.object({
  userId: z.number(),
  completedTutorials: z.array(z.number()).default([]),
  currentTutorial: z.number().default(1),
  currentCourse: z.number().default(1),
  completedCourses: z.array(z.number()).default([]),
  stars: z.number().default(0),
});

export const insertCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
  order: z.number(),
  requiredCourse: z.number().nullable(),
});

export const insertTutorialSchema = z.object({
  courseId: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  starterCode: z.string().default(""),
  expectedOutput: z.string().optional(),
  order: z.number(),
  isLocked: z.boolean().default(false),
});

// Inferred types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
