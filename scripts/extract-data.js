import { MemStorage } from "./server/storage.js";

const storage = new MemStorage();

// Get all courses
const courses = await storage.getAllCourses();
console.log("// Complete courses data");
console.log("export const courses = " + JSON.stringify(courses, null, 2) + ";");

// Get all tutorials
const tutorials = await storage.getAllTutorials();
console.log("\n// Complete tutorials data");
console.log(
  "export const tutorials = " + JSON.stringify(tutorials, null, 2) + ";",
);

console.log("\n// Helper functions");
console.log(`
export function getTutorialsByCourse(courseId: number) {
  return tutorials.filter(tutorial => tutorial.courseId === courseId);
}

export function getCourse(id: number) {
  return courses.find(course => course.id === id);
}

export function getTutorial(id: number) {
  return tutorials.find(tutorial => tutorial.id === id);
}`);
