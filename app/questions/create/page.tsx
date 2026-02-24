"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useFetchUsingAuth } from "@/hooks/fetchUsingAuth";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CreateQuestionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, hasRole } = useAuth();
  const { post } = useFetchUsingAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    category: "",
    difficulty: "easy",
    tags: "",
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated || !hasRole('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <h1 className="text-xl font-semibold">Unauthorized Access</h1>
      </div>
    );
  }

  const handleOptionChange = (value: string, index: number) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await post("/api/questions", {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Question created successfully!");
      router.push("/admin/questions");
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

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 gradient-text">
          Create Question
        </h1>

        <Card variant="glass" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Question */}
            <div>
              <label className="label">Question</label>
              <textarea
                className="input w-full"
                rows={3}
                value={form.question}
                onChange={(e) =>
                  setForm({ ...form, question: e.target.value })
                }
                required
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <label className="label">Options</label>
              {form.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={form.correctAnswer === index}
                    onChange={() =>
                      setForm({ ...form, correctAnswer: index })
                    }
                  />
                  <input
                    type="text"
                    className="input w-full"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(e.target.value, index)
                    }
                    required
                  />
                </div>
              ))}
              <p className="text-xs text-text-secondary">
                Select the correct answer using the radio button.
              </p>
            </div>

            {/* Explanation */}
            <div>
              <label className="label">Explanation</label>
              <textarea
                className="input w-full"
                rows={3}
                value={form.explanation}
                onChange={(e) =>
                  setForm({ ...form, explanation: e.target.value })
                }
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="label">Category</label>
              <input
                type="text"
                className="input w-full"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="label">Difficulty</label>
              <select
                className="input w-full"
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value })
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="label">Tags (comma separated)</label>
              <input
                type="text"
                className="input w-full"
                placeholder="arrays, recursion, sorting"
                value={form.tags}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Question"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}