"use client";

import { Spinner } from "@/components/ui/spinner";
import { CodeEditorPanel } from "@/modules/problems/components/code-editor-panel";
import { ProblemDescription } from "@/modules/problems/components/problem-description";
import { ProblemHeader } from "@/modules/problems/components/problem-header";
import { ProblemTabs } from "@/modules/problems/components/problem-tabs";
import TestCasesPanel from "@/modules/problems/components/testcases-panel";
import { useEditor } from "@/modules/problems/hooks/use-editor";
import { useProblem } from "@/modules/problems/hooks/use-problem";
import { useParams } from "next/navigation";

const ProblemIdPage = () => {
  const params = useParams<{ id: string }>();
  const { problem, isLoading } = useProblem(params.id);
  const {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  } = useEditor(problem);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <ProblemHeader problem={problem} />
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT Panel */}
          <div className="space-y-6">
            <ProblemDescription
              problem={problem}
              selectedLanguage={"JAVASCRIPT"}
            />
            <ProblemTabs problem={problem} />
          </div>

          {/* RIGHT Panel */}
          <div className="space-y-6">
            <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />

            {/* @ts-ignore */}
            <TestCasesPanel testCases={problem.testCases}/>

            {/* TODO: Execution result */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;
