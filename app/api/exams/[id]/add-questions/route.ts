import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import connectDB from "@/lib/mongodb";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params (Next.js 15 requirement)
    const { id } = await context.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Exam ID" },
        { status: 400 }
      );
    }

    const exam = await Exam.findById(id);
    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { questions } = body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, message: "No questions provided" },
        { status: 400 }
      );
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        category: q.category || exam.category,
        difficulty: q.difficulty || exam.difficulty,
        createdBy: authUser.id,
      }))
    );

    const createdIds = createdQuestions.map((q) => q._id);

    exam.questions.push(...createdIds);
    await exam.save();

    return NextResponse.json({
      success: true,
      message: "Questions added successfully",
      totalAdded: createdIds.length,
    });
  } catch (error: any) {
    console.error("Error adding questions:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}