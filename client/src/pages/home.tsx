import { useState } from "react";
import { useTutorial } from "@/hooks/use-tutorial";
import TutorialSidebar from "@/components/tutorial-sidebar";
import TutorialContent from "@/components/tutorial-content";
import HelpModal from "@/components/help-modal";
import ApiDocumentation from "@/components/api-documentation";
import { Code, Star, HelpCircle, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const {
    currentTutorial,
    tutorials,
    completedTutorials,
    userCode,
    isLoading,
    completeTutorial,
    goToNextTutorial,
    setCurrentTutorial,
    updateUserCode,
  } = useTutorial();

  const [showHelp, setShowHelp] = useState(false);

  const hasNextTutorial = currentTutorial ? 
    tutorials.some((t: any) => t.order === currentTutorial.order + 1) : false;

  const progressPercentage = tutorials.length > 0 ? (completedTutorials.length / tutorials.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Code className="text-white" size={16} />
                </div>
                <h1 className="text-xl font-bold text-slate-800">JavaScript Adventure</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Progress:</span>
                <Progress value={progressPercentage} className="w-32" />
                <span className="text-sm font-medium text-slate-700">
                  {completedTutorials.length}/{tutorials.length}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="text-yellow-500 fill-current" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  {completedTutorials.length * 10}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <TutorialSidebar 
          tutorials={tutorials}
          currentTutorial={currentTutorial}
          completedTutorials={completedTutorials}
          onTutorialSelect={setCurrentTutorial}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <Tabs defaultValue="tutorial" className="h-full flex flex-col">
            <div className="border-b border-slate-200 bg-white px-6 py-3">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="tutorial" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Tutorial
                </TabsTrigger>
                <TabsTrigger value="reference" className="flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Reference
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="tutorial" className="flex-1 overflow-hidden mt-0">
              {currentTutorial ? (
                <TutorialContent 
                  tutorial={currentTutorial}
                  onComplete={() => completeTutorial(currentTutorial.id)}
                  isCompleted={completedTutorials.includes(currentTutorial.id)}
                  onNext={goToNextTutorial}
                  hasNext={hasNextTutorial}
                  userCode={userCode}
                  onCodeChange={updateUserCode}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Code className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                      Select a tutorial to get started!
                    </h3>
                    <p className="text-slate-600">
                      Choose a tutorial from the sidebar to begin your JavaScript adventure.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reference" className="flex-1 overflow-hidden mt-0">
              <ApiDocumentation />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Floating Help Button */}
      <Button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <HelpCircle size={20} />
      </Button>

      {/* Help Modal */}
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)}
        currentTutorial={currentTutorial}
      />
    </div>
  );
}