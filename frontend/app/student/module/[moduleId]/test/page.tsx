"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Award } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Question {
  text: string;
  options: string[];
}

interface TestData {
  module_title: string;
  title: string;
  max_attempts: number;
  pass_mark_percentage: number;
  questions: Question[];
}

export default function TestTakingPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const router = useRouter();
  const { moduleId } = use(params);
  
  const [test, setTest] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchTest = async () => {
      const token = localStorage.getItem("arova_token");
      if (!token) return router.push("/");

      try {
        const res = await axios.get(`http://localhost:8000/api/student/module/${moduleId}/test`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTest(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load test. You may not have access.");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [moduleId, router]);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!test) return;
    
    // Validate all questions answered
    if (Object.keys(answers).length < test.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("arova_token");
      
      const payload = {
        answers: Object.entries(answers).map(([qIdx, oIdx]) => ({
          question_index: parseInt(qIdx),
          selected_option_index: oIdx
        }))
      };

      const res = await axios.post(`http://localhost:8000/api/student/module/${moduleId}/test`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResult(res.data);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to submit test.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col justify-center">
        <div className="glass-panel p-8 rounded-2xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button onClick={() => router.push("/student/dashboard")} className="btn-primary py-2 px-6 rounded-xl">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- RESULT VIEW ---
  if (result) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg glass-panel p-10 rounded-3xl text-center relative overflow-hidden"
        >
          {result.passed ? (
            <>
              <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                {result.internship_completed ? <Award className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
              </div>
              <h2 className="text-3xl font-bold mb-2">Passed!</h2>
              <p className="text-green-400 font-semibold text-xl mb-4">Score: {result.score_percentage}%</p>
              
              <p className="text-muted-foreground mb-8">
                {result.internship_completed 
                  ? "Incredible work! You have completed the entire internship track."
                  : "Great job! You have passed this module and unlocked the next one."}
              </p>
              
              <button 
                onClick={() => router.push("/student/dashboard")}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
              <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Failed</h2>
              <p className="text-red-400 font-semibold text-xl mb-4">Score: {result.score_percentage}%</p>
              <p className="text-muted-foreground mb-8">
                You need {test?.pass_mark_percentage}% to pass this module. Please review the material and try again.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Retry Test
              </button>
              <button 
                onClick={() => router.push("/student/dashboard")}
                className="w-full mt-3 text-muted-foreground hover:text-white py-3 px-6 rounded-xl transition-colors"
              >
                Back to Dashboard
              </button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // --- TEST TAKING VIEW ---
  return (
    <div className="min-h-screen pb-20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.push("/student/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
            {test?.module_title}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{test?.title}</h1>
          <p className="text-muted-foreground">Answer all questions below. You need {test?.pass_mark_percentage}% to pass.</p>
        </div>

        <div className="space-y-8">
          {test?.questions.map((q, qIndex) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
              key={qIndex} 
              className="glass-panel p-6 md:p-8 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-5">
                <span className="text-muted-foreground mr-2">{qIndex + 1}.</span> 
                {q.text}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  return (
                    <div 
                      key={oIndex}
                      onClick={() => handleOptionSelect(qIndex, oIndex)}
                      className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center gap-4
                        ${isSelected 
                          ? 'border-primary bg-primary/10' 
                          : 'border-transparent bg-muted/20 hover:bg-muted/40 hover:border-white/10'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                        ${isSelected ? 'border-primary' : 'border-muted-foreground/50'}`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <span className={isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < (test?.questions.length || 0)}
            className="btn-primary py-4 px-10 rounded-xl font-bold text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
