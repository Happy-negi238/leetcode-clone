import { useMemo, useState } from "react";

export function useProblemFilters(problems = []) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = useMemo(() => {
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));

    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((problem) =>
        difficulty === "All" ? true : problem.difficulty === difficulty,
      )
      .filter((problem) =>
        selectedTag === "All" ? true : problem.tags?.includes(selectedTag),
      );
  }, [problems, search, difficulty, selectedTag]);

  return {
    search,
    difficulty,
    selectedTag,
    allTags,

    setSearch,
    setDifficulty,
    setSelectedTag,

    filteredProblems
  };
}
