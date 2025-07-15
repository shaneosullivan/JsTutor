export interface AccountData {
  id: string;
  email: string;
  lastUpdated: string; // ISO timestamp
  version: number; // For conflict resolution
}

export interface UserProfile {
  id: string;
  accountId: string;
  name: string;
  icon: string;
  createdAt: string; // ISO timestamp
  lastActive: string; // ISO timestamp
}

// export interface UserProfileProgress {
//   profileId: string;
//   courses: [CourseProgress];
// }

export interface CourseProgress {
  accountId: string;
  profileId: string;
  courseId: string;
  tutorialCode: {
    [key: string]: {
      code: string;
      completed: boolean;
      lastAccessed: string; // ISO timestamp
    };
  };
  lastUpdated: string; // ISO timestamp
}

// Tutorial code table interface for TinyBase
export interface TutorialCode {
  id: string; // "${profileId}_${tutorialId}"
  profileId: string;
  tutorialId: number;
  courseId: number;
  code: string;
  completed: boolean;
  lastAccessed: string; // ISO timestamp
}
