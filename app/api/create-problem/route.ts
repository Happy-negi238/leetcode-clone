import { prisma } from "@/lib/db";
import { UserRole } from "@/lib/generated/prisma/enums";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "@/lib/judge0";
import { currentUserRole, getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUserData();

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = await request.json();

    if (
      !title ||
      !description ||
      !difficulty ||
      testCases ||
      codeSnippets ||
      referenceSolutions
    ) {
      return NextResponse.json(
        { message: "Fields are missing" },
        { status: 400 },
      );
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { message: "At least one testcase required" },
        { status: 400 },
      );
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      // 1. get language id from judge 0
      const languageId = getJudge0LanguageId(language);

      // 2. prepare judge 0 submission for all test cases
      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      // 3. submit all testcases in one batch
      const submissionResult = await submitBatch(submissions);

      // 4. Extract token from response
      const tokens = submissionResult.map((res: any) => res.token);

      // 5. Poll judge 0 api until submission are done
      const results = await pollBatchResults(tokens);

      // 6. Validate that each test cases
      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: {
                input: submissions[i].stdin,
                expectedOutput: submissions[i].expected_output,
                actualOutput: result.stdout,
                error: result.stderr || result.compile_output,
              },
              details: result,
            },
            { status: 400 },
          );
        }
      }
    }

    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        // @ts-ignore
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        succes: true,
        message: "Problem created successfully",
        data: newProblem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("POST create problem: ", error);
    return NextResponse.json(
      {
        error: "Failed to create problem",
      },
      { status: 500 },
    );
  }
}
