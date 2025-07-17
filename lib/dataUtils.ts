// Data utility functions and types for the course system
// This file is manually maintained - do not auto-generate

import { rawCourses, rawTutorials } from "../config/data";

// Types for localized data
export interface LocalizedText {
  title: string;
  description: string;
}

export interface TutorialText extends LocalizedText {
  content: string;
  expectedOutput?: string | null;
}

// Localized tutorial type (flattened from raw Tutorial data)
export interface LocalizedTutorial {
  id: number;
  courseId: number;
  title: string;
  description: string;
  content: string;
  starterCode?: string;
  expectedOutput?: string | null;
  order: number;
}

// Localized course type (flattened from raw Course data)
export interface LocalizedCourse {
  id: number;
  title: string;
  description: string;
  type: string;
  order: number;
  requiredCourse: number | null;
}

export interface Course {
  id: number;
  text: Record<string, LocalizedText>;
  type: string;
  order: number;
  requiredCourse: number | null;
}

export interface Tutorial {
  id: number;
  courseId: number;
  text: Record<string, TutorialText>;
  starterCode?: Record<string, string>;
  order: number;
}


// Current locale (hardcoded to 'en' for now, will be configurable later)
const DEFAULT_LOCALE = "en";

// Locale-aware helper functions that return localized types
function getLocalizedCourse(
  course: Course,
  locale: string = DEFAULT_LOCALE,
): LocalizedCourse {
  const text =
    course.text[locale] ||
    course.text.en ||
    course.text[Object.keys(course.text)[0]];
  return {
    id: course.id,
    title: text.title,
    description: text.description,
    type: course.type,
    order: course.order,
    requiredCourse: course.requiredCourse,
  };
}

function getLocalizedTutorial(
  tutorial: Tutorial,
  locale: string = DEFAULT_LOCALE,
): LocalizedTutorial {
  const text =
    tutorial.text[locale] ||
    tutorial.text.en ||
    tutorial.text[Object.keys(tutorial.text)[0]];
  const starterCode =
    tutorial.starterCode?.[locale] ||
    tutorial.starterCode?.en ||
    tutorial.starterCode?.[Object.keys(tutorial.starterCode || {})[0]];

  return {
    id: tutorial.id,
    courseId: tutorial.courseId,
    title: text.title,
    description: text.description,
    content: text.content,
    starterCode,
    expectedOutput: text.expectedOutput,
    order: tutorial.order,
  };
}

// Create localized data from imported raw data
const localizedData = createLocalizedData(rawCourses, rawTutorials);

// Export only functions that require locale parameters
export const getCourse = localizedData.getCourse;
export const getTutorial = localizedData.getTutorial;
export const getTutorialsForCourse = localizedData.getTutorialsForCourse;
export const getNextTutorial = localizedData.getNextTutorial;
export const getPreviousTutorial = localizedData.getPreviousTutorial;
export const getCoursesForLocale = localizedData.getCoursesForLocale;
export const getTutorialsForLocale = localizedData.getTutorialsForLocale;
export const getAvailableLocales = localizedData.getAvailableLocales;
export const setDefaultLocale = localizedData.setDefaultLocale;

// Tutorial transformation utility
export interface TutorialTransformOptions {
  isLocked?: boolean;
  starterCode?: string;
  expectedOutput?: string;
  [key: string]: any;
}

export function transformTutorial<T extends Record<string, any>>(
  tutorial: T,
  overrides: TutorialTransformOptions = {}
): T & { starterCode: string; expectedOutput: string; isLocked: boolean } {
  return {
    ...tutorial,
    starterCode: overrides.starterCode ?? tutorial.starterCode ?? "",
    expectedOutput: overrides.expectedOutput ?? tutorial.expectedOutput ?? "",
    isLocked: overrides.isLocked ?? tutorial.isLocked ?? false,
    ...overrides,
  };
}

// Transform multiple tutorials with a common override or individual overrides
export function transformTutorials<T extends Record<string, any>>(
  tutorials: T[],
  overrides: TutorialTransformOptions | ((tutorial: T, index: number) => TutorialTransformOptions) = {}
): Array<T & { starterCode: string; expectedOutput: string; isLocked: boolean }> {
  return tutorials.map((tutorial, index) => {
    const tutorialOverrides = typeof overrides === 'function' 
      ? overrides(tutorial, index) 
      : overrides;
    return transformTutorial(tutorial, tutorialOverrides);
  });
}

// Factory function to create localized exports from raw data
export function createLocalizedData(
  rawCourses: Course[],
  rawTutorials: Tutorial[],
) {
  // Exported data (localized for current locale)
  const courses: LocalizedCourse[] = rawCourses.map((course) =>
    getLocalizedCourse(course),
  );
  const tutorials: LocalizedTutorial[] = rawTutorials.map((tutorial) =>
    getLocalizedTutorial(tutorial),
  );

  return {
    courses,
    tutorials,

    // Helper functions that return localized types
    getCourse(id: number, locale?: string): LocalizedCourse | undefined {
      const course = rawCourses.find((course) => course.id === id);
      return course ? getLocalizedCourse(course, locale) : undefined;
    },

    getTutorial(id: number, locale?: string): LocalizedTutorial | undefined {
      const tutorial = rawTutorials.find((tutorial) => tutorial.id === id);
      return tutorial ? getLocalizedTutorial(tutorial, locale) : undefined;
    },

    getTutorialsForCourse(courseId: number, locale?: string): LocalizedTutorial[] {
      return rawTutorials
        .filter((tutorial) => tutorial.courseId === courseId)
        .map((tutorial) => getLocalizedTutorial(tutorial, locale));
    },

    getNextTutorial(
      currentTutorialId: number,
      locale?: string,
    ): LocalizedTutorial | null {
      const currentTutorial = rawTutorials.find(
        (t) => t.id === currentTutorialId,
      );
      if (!currentTutorial) return null;

      const courseTutorials = rawTutorials.filter(
        (t) => t.courseId === currentTutorial.courseId,
      );
      const currentIndex = courseTutorials.findIndex(
        (t) => t.id === currentTutorialId,
      );

      if (currentIndex >= 0 && currentIndex < courseTutorials.length - 1) {
        return getLocalizedTutorial(courseTutorials[currentIndex + 1], locale);
      }

      // Check next course
      const currentCourse = rawCourses.find(
        (c) => c.id === currentTutorial.courseId,
      );
      const nextCourse = rawCourses.find(
        (c) => c.order === (currentCourse?.order || 0) + 1,
      );
      if (nextCourse) {
        const nextCourseTutorials = rawTutorials.filter(
          (t) => t.courseId === nextCourse.id,
        );
        return nextCourseTutorials.length > 0
          ? getLocalizedTutorial(nextCourseTutorials[0], locale)
          : null;
      }

      return null;
    },

    getPreviousTutorial(
      currentTutorialId: number,
      locale?: string,
    ): LocalizedTutorial | null {
      const currentTutorial = rawTutorials.find(
        (t) => t.id === currentTutorialId,
      );
      if (!currentTutorial) return null;

      const courseTutorials = rawTutorials.filter(
        (t) => t.courseId === currentTutorial.courseId,
      );
      const currentIndex = courseTutorials.findIndex(
        (t) => t.id === currentTutorialId,
      );

      if (currentIndex > 0) {
        return getLocalizedTutorial(courseTutorials[currentIndex - 1], locale);
      }

      // Check previous course
      const currentCourse = rawCourses.find(
        (c) => c.id === currentTutorial.courseId,
      );
      const prevCourse = rawCourses.find(
        (c) => c.order === (currentCourse?.order || 0) - 1,
      );
      if (prevCourse) {
        const prevCourseTutorials = rawTutorials.filter(
          (t) => t.courseId === prevCourse.id,
        );
        return prevCourseTutorials.length > 0
          ? getLocalizedTutorial(
              prevCourseTutorials[prevCourseTutorials.length - 1],
              locale,
            )
          : null;
      }

      return null;
    },

    // Locale-aware functions that return localized types
    getCoursesForLocale(locale: string = DEFAULT_LOCALE): LocalizedCourse[] {
      return rawCourses.map((course) => getLocalizedCourse(course, locale));
    },

    getTutorialsForLocale(locale: string = DEFAULT_LOCALE): LocalizedTutorial[] {
      return rawTutorials.map((tutorial) =>
        getLocalizedTutorial(tutorial, locale),
      );
    },

    getAvailableLocales(): string[] {
      const courseLocales = rawCourses.flatMap((course) =>
        Object.keys(course.text),
      );
      const tutorialLocales = rawTutorials.flatMap((tutorial) =>
        Object.keys(tutorial.text),
      );
      const allLocales = courseLocales.concat(tutorialLocales);
      return Array.from(new Set(allLocales)).sort();
    },

    // For future i18n integration
    setDefaultLocale(_locale: string) {
      // This will be implemented when we add full i18n support
      console.warn(
        "setDefaultLocale not yet implemented - locale switching will be added in future update",
      );
    },
  };
}
