"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Clock, BookOpen, Award, Filter, Plus } from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: "", difficulty: "" });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/exams");
      const data = await res.json();
      if (data.success) setExams(data.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (examId: string) => {
    router.push(`/exams/${examId}/start`);
  };

  const filteredExams = exams.filter((exam) => {
    if (filter.category && exam.category !== filter.category) return false;
    if (filter.difficulty && exam.difficulty !== filter.difficulty)
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Available Exams
            </h1>
            <p className="text-text-secondary">
              Choose an exam and test your knowledge
            </p>
          </div>

          <Button
            variant="primary"
            className="flex items-center gap-2 px-6 py-3 shadow-lg"
            onClick={() => router.push("/exams/create")}
          >
            <Plus size={18} />
            Create Exam
          </Button>
        </div>

        {/* Filters */}
        <Card
          variant="glass"
          className="mb-10 p-6 backdrop-blur-xl border border-white/10"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <Filter size={18} />
              <span className="font-medium">Filter by Difficulty</span>
            </div>

            <select
              className="input max-w-xs"
              value={filter.difficulty}
              onChange={(e) =>
                setFilter({ ...filter, difficulty: e.target.value })
              }
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </Card>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <Card
            variant="glass"
            className="text-center py-20 border border-white/10"
          >
            <BookOpen size={60} className="mx-auto mb-4 text-text-muted" />
            <h2 className="text-2xl font-semibold mb-2">
              No Exams Available
            </h2>
            <p className="text-text-secondary mb-6">
              Create a new exam to get started.
            </p>
            <Button onClick={() => router.push("/exams/create")}>
              Create Your First Exam
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExams.map((exam, index) => (
              <Card
                key={exam._id}
                variant="glass"
                hover
                className="p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/10"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Top */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyColor(
                        exam.difficulty
                      )}`}
                    >
                      {exam.difficulty}
                    </span>

                    <span className="text-xs text-text-secondary uppercase tracking-wide">
                      {exam.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                    {exam.title}
                  </h3>

                  <p className="text-text-secondary text-sm line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center text-text-secondary">
                    <Clock size={16} className="mr-2" />
                    {exam.duration} minutes
                  </div>

                  <div className="flex items-center text-text-secondary">
                    <BookOpen size={16} className="mr-2" />
                    {exam.questions?.length || 0} questions
                  </div>

                  <div className="flex items-center text-text-secondary">
                    <Award size={16} className="mr-2" />
                    {exam.totalMarks} marks
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full py-2.5"
                  onClick={() => handleStartExam(exam._id)}
                >
                  Start Exam
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}