import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { redirect } from "next/navigation";
// import { useState } from "react";

const DEFAULT_ROLE = "Frontend Developer";
const DEFAULT_LEVEL = "Junior";
const DEFAULT_TYPE = "Technical";
const DEFAULT_TECHSTACK = ["React", "TypeScript", "Next.js", "Tailwind CSS"];
const DEFAULT_AMOUNT = 5;

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");

  // Generate questions using Gemini (same as API)
  const { text: questionsText } = await generateText({
    model: google("gemini-2.0-flash-001"),
    prompt: `Prepare questions for a job interview.\nThe job role is ${DEFAULT_ROLE}.\nThe job experience level is ${DEFAULT_LEVEL}.\nThe tech stack used in the job is: ${DEFAULT_TECHSTACK.join(",")}.\nThe focus between behavioural and technical questions should lean towards: ${DEFAULT_TYPE}.\nThe amount of questions required is: ${DEFAULT_AMOUNT}.\nPlease return only the questions, without any additional text.\nThe questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.\nReturn the questions formatted like this:\n["Question 1", "Question 2", "Question 3"]\nThank you! <3`,
  });
  const questions = JSON.parse(questionsText);

  // Create interview in Firestore
  const interviewRef = await db.collection("interviews").add({
    role: DEFAULT_ROLE,
    type: DEFAULT_TYPE,
    level: DEFAULT_LEVEL,
    techstack: DEFAULT_TECHSTACK,
    questions,
    userId: user.id,
    finalized: true,
    coverImage: getRandomInterviewCover(),
    createdAt: new Date().toISOString(),
  });

  return (
    <>
      <h3>Interview generation</h3>
      <Agent
        userName={user.name!}
        userId={user.id}
        interviewId={interviewRef.id}
        type="interview"
        questions={questions}
        profileImage={user.profileURL}
      />
    </>
  );
};

export default Page;
