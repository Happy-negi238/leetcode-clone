import { useState, useEffect } from "react";
import { getProblemById } from "../actions";

export function useProblem(id: string) {
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const problem = await getProblemById(id);

        if (problem.success) {
          // @ts-ignore
          setProblem(problem.data);
        }
      } catch (error) {
        console.log("Error fetching problem: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  return {
    problem,
    isLoading,
  };
}
