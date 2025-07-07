import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Tutorial, UserProgress } from "@shared/schema";

export function useTutorial() {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const queryClient = useQueryClient();

  // Fetch all tutorials
  const { data: tutorials = [], isLoading: tutorialsLoading } = useQuery({
    queryKey: ["/api/tutorials"],
  });

  // Fetch user progress
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress"],
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (newProgress: Partial<UserProgress>) => {
      const response = await apiRequest("POST", "/api/progress", newProgress);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  // Set initial current tutorial
  useEffect(() => {
    if (tutorials.length > 0 && !currentTutorial) {
      const firstTutorial = tutorials.find((t: Tutorial) => t.order === 1);
      if (firstTutorial) {
        setCurrentTutorial(firstTutorial);
      }
    }
  }, [tutorials, currentTutorial]);

  const completeTutorial = async (tutorialId: number) => {
    if (!progress) return;

    const completedTutorials = progress.completedTutorials || [];
    if (completedTutorials.includes(tutorialId)) return;

    const newCompleted = [...completedTutorials, tutorialId];
    const newStars = progress.stars + 10; // Award 10 stars per tutorial
    const nextTutorial = tutorials.find((t: Tutorial) => t.order === currentTutorial?.order + 1);

    await updateProgressMutation.mutateAsync({
      completedTutorials: newCompleted,
      stars: newStars,
      currentTutorial: nextTutorial?.id || progress.currentTutorial,
    });

    // Auto-advance to next tutorial if available
    if (nextTutorial) {
      setCurrentTutorial(nextTutorial);
    }
  };

  const selectTutorial = (tutorial: Tutorial) => {
    // Check if tutorial is unlocked
    if (tutorial.order === 1) {
      setCurrentTutorial(tutorial);
      return;
    }

    const previousTutorial = tutorials.find((t: Tutorial) => t.order === tutorial.order - 1);
    const isUnlocked = previousTutorial && progress?.completedTutorials?.includes(previousTutorial.id);

    if (isUnlocked) {
      setCurrentTutorial(tutorial);
    }
  };

  return {
    currentTutorial,
    tutorials,
    progress,
    isLoading: tutorialsLoading || progressLoading,
    setCurrentTutorial: selectTutorial,
    completeTutorial,
    updateProgress: updateProgressMutation.mutateAsync,
  };
}
