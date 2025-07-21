"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Tutorial, UserProgress } from "@shared/schema";

// Local storage keys
const COMPLETED_TUTORIALS_KEY = "js-adventure-completed";
const USER_CODE_KEY = "js-adventure-code";

export function useTutorial() {
  const queryClient = useQueryClient();
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [userCode, setUserCode] = useState<string>("");

  // Fetch tutorials
  const { data: tutorials = [], isLoading: tutorialsLoading } = useQuery({
    queryKey: ["/api/tutorials"],
    select: (data: Tutorial[]) => data.sort((a, b) => a.order - b.order)
  });

  // Fetch user progress (kept for server sync, but local storage takes precedence)
  const { data: progress } = useQuery({
    queryKey: ["/api/progress"]
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { completedTutorials: number[] }) => {
      const response = await apiRequest("POST", "/api/progress", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    }
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedCompleted = localStorage.getItem(COMPLETED_TUTORIALS_KEY);
    if (savedCompleted) {
      try {
        const completed = JSON.parse(savedCompleted);
        setCompletedTutorials(completed);
      } catch (error) {
        console.error("Error parsing saved completed tutorials:", error);
      }
    } else if (
      progress &&
      typeof progress === "object" &&
      progress !== null &&
      "completedTutorials" in progress
    ) {
      // Fallback to server data if no local storage
      const userProgress = progress as UserProgress;
      setCompletedTutorials(userProgress.completedTutorials || []);
    }
  }, [progress]);

  useEffect(() => {
    if (tutorials.length > 0 && !currentTutorial) {
      const firstTutorial = tutorials.find((t: Tutorial) => t.order === 1);
      if (firstTutorial) {
        setCurrentTutorial(firstTutorial);
        loadUserCodeForTutorial(firstTutorial);
      }
    }
  }, [tutorials, currentTutorial]);

  const loadUserCodeForTutorial = (tutorial: Tutorial) => {
    const savedCode = localStorage.getItem(`${USER_CODE_KEY}-${tutorial.id}`);
    setUserCode(savedCode || tutorial.starterCode || "");
  };

  const saveUserCode = (code: string, tutorialId: number) => {
    localStorage.setItem(`${USER_CODE_KEY}-${tutorialId}`, code);
  };

  const saveCompletedTutorials = (completed: number[]) => {
    localStorage.setItem(COMPLETED_TUTORIALS_KEY, JSON.stringify(completed));
  };

  const completeTutorial = async (tutorialId: number) => {
    if (completedTutorials.includes(tutorialId)) {
      return;
    }

    const newCompleted = [...completedTutorials, tutorialId];
    setCompletedTutorials(newCompleted);
    saveCompletedTutorials(newCompleted);
    updateProgressMutation.mutate({ completedTutorials: newCompleted });
  };

  const goToNextTutorial = () => {
    if (!currentTutorial) {
      return;
    }

    const nextTutorial = tutorials.find(
      (t: Tutorial) => t.order === currentTutorial.order + 1
    );
    if (nextTutorial) {
      setCurrentTutorial(nextTutorial);
      loadUserCodeForTutorial(nextTutorial);
    }
  };

  const selectTutorial = (tutorial: Tutorial) => {
    // Check if tutorial is unlocked
    const previousTutorial = tutorials.find(
      (t: Tutorial) => t.order === tutorial.order - 1
    );
    const isUnlocked =
      tutorial.order === 1 ||
      !previousTutorial ||
      completedTutorials.includes(previousTutorial.id);

    if (isUnlocked) {
      setCurrentTutorial(tutorial);
      loadUserCodeForTutorial(tutorial);
    }
  };

  const updateUserCode = (code: string) => {
    setUserCode(code);
    if (currentTutorial) {
      saveUserCode(code, currentTutorial.id);
    }
  };

  return {
    tutorials,
    currentTutorial,
    completedTutorials,
    userCode,
    isLoading: tutorialsLoading,
    completeTutorial,
    goToNextTutorial,
    setCurrentTutorial: selectTutorial,
    updateUserCode
  };
}
