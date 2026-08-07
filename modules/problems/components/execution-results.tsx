"use client";

import { SubmissionDetails } from "./submission-details";
import { TestCaseTable } from "./testcases-table";

export function ExecutionResults({ executionResponse }: any) {
  if (!executionResponse?.submission) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <SubmissionDetails submission={executionResponse.submission} />
      <TestCaseTable testCases={executionResponse.submission.testcases} />
    </div>
  );
}
