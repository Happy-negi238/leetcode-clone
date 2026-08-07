"use client";

import { toast } from "@/components/ui/toast";
import { getJudge0LanguageId } from "@/lib/judge0";
import { useEffect, useState } from "react";
import { executeCode } from "../actions";

export function useEditor(problem: any, initialLanguage = "JAVASCRIPT") {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResponse, setExecutionResponse] = useState(null);

  useEffect(() => {
    if (problem?.codeSnippets[selectedLanguage]) {
      setCode(problem?.codeSnippets[selectedLanguage]);
    }
  }, [selectedLanguage, problem]);

  const handleRun = () => {
    toast.add({
      type: "success",
      description: "This is assignment",
    });
  };

  const handleSubmit = async () => {
    if (!problem) return;

    try {
      setIsRunning(true);
      const language_id = getJudge0LanguageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);

      const res = await executeCode(
        code,
        language_id,
        stdin,
        expected_outputs,
        problem.id,
      );
      setExecutionResponse(res);

      if (res.success) {
        toast.add({
          type: "success",
          description: "Code execution succesfully",
        });
      }
    } catch (error) {
      console.error("Error executing code", error);
      toast.add({
        type: "error",
        description: "Error executing code",
      });
    } finally{
      setIsRunning(false)
    }
  };

  return {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  };
}
