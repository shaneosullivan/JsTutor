import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tutorial } from "@shared/schema";

interface TutorialSidebarProps {
  tutorials: Tutorial[];
  currentTutorial: Tutorial | null;
  completedTutorials: number[];
  onTutorialSelect: (tutorial: Tutorial) => void;
}

export default function TutorialSidebar({
  tutorials,
  currentTutorial,
  completedTutorials,
  onTutorialSelect
}: TutorialSidebarProps) {
  const isUnlocked = (tutorial: Tutorial) => {
    if (tutorial.order === 1) return true;
    const previousTutorial = tutorials.find(t => t.order === tutorial.order - 1);
    return previousTutorial ? completedTutorials.includes(previousTutorial.id) : false;
  };

  const getStatusIcon = (tutorial: Tutorial) => {
    if (completedTutorials.includes(tutorial.id)) {
      return (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="text-white" size={16} />
        </div>
      );
    }
    
    if (currentTutorial?.id === tutorial.id) {
      return (
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-purple-600 font-bold text-sm">{tutorial.order}</span>
        </div>
      );
    }
    
    if (!isUnlocked(tutorial)) {
      return (
        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
          <Lock className="text-slate-500" size={16} />
        </div>
      );
    }
    
    return (
      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
        <span className="text-slate-600 font-medium text-sm">{tutorial.order}</span>
      </div>
    );
  };

  const getTutorialClassName = (tutorial: Tutorial) => {
    if (completedTutorials.includes(tutorial.id)) {
      return "bg-gradient-to-r from-green-50 to-green-100 border border-green-200 hover:shadow-md";
    }
    
    if (currentTutorial?.id === tutorial.id) {
      return "gradient-primary border border-purple-400 text-white hover:shadow-md";
    }
    
    if (!isUnlocked(tutorial)) {
      return "bg-slate-50 border border-slate-200 opacity-60 cursor-not-allowed";
    }
    
    return "bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md";
  };

  return (
    <aside className="w-80 bg-white shadow-sm border-r border-slate-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Learn JavaScript</h2>
        
        <div className="space-y-3">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              onClick={() => isUnlocked(tutorial) && onTutorialSelect(tutorial)}
              className={cn(
                "rounded-lg p-4 cursor-pointer transition-all duration-200",
                getTutorialClassName(tutorial)
              )}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(tutorial)}
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium",
                    currentTutorial?.id === tutorial.id ? "text-white" : "text-slate-800"
                  )}>
                    {tutorial.order}. {tutorial.title}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    currentTutorial?.id === tutorial.id ? "text-white/80" : "text-slate-600"
                  )}>
                    {tutorial.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
