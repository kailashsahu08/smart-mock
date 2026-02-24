"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useFetchUsingAuth } from "@/hooks/fetchUsingAuth";

export default function ExamQuestionBuilder() {
  const { id: examId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { post } = useFetchUsingAuth();

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "",
      difficulty: "easy",
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        category: "",
        difficulty: "easy",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated: any = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (
    qIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    updated[qIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await post(`/api/exams/${examId}/add-questions`, { questions });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Questions added successfully!");
      router.push("/exams");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 gradient-text">
          Build Question Set
        </h1>

        {questions.map((q, qIndex) => (
          <Card key={qIndex} className="p-6 mb-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">
                Question {qIndex + 1}
              </h2>
              {questions.length > 1 && (
                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Remove
                </button>
              )}
            </div>

            <textarea
              className="input w-full mb-4"
              placeholder="Enter question"
              value={q.question}
              onChange={(e) =>
                handleChange(qIndex, "question", e.target.value)
              }
            />

            {q.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={q.correctAnswer === optIndex}
                  onChange={() =>
                    handleChange(qIndex, "correctAnswer", optIndex)
                  }
                />
                <input
                  type="text"
                  className="input w-full"
                  placeholder={`Option ${optIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, optIndex, e.target.value)
                  }
                />
              </div>
            ))}

            <textarea
              className="input w-full mt-3"
              placeholder="Explanation"
              value={q.explanation}
              onChange={(e) =>
                handleChange(qIndex, "explanation", e.target.value)
              }
            />
          </Card>
        ))}

        <div className="flex gap-4">
          <Button onClick={addQuestion}>Add Another Question</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Question Set"}
          </Button>
        </div>
      </div>
    </div>
  );
}