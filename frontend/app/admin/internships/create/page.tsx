"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";
import axios from "axios";

interface Question {
  text: string;
  options: string[];
  correct_option_index: number;
}

interface ModuleData {
  id: string;
  title: string;
  content: string;
  order: number;
  test: {
    title: string;
    pass_mark_percentage: number;
    questions: Question[];
  };
}

export default function CreateInternshipPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMonths, setDurationMonths] = useState(1);
  const [modules, setModules] = useState<ModuleData[]>([{ 
    id: "m1", 
    title: "", 
    content: "", 
    order: 1, 
    test: {
      title: "",
      pass_mark_percentage: 70,
      questions: []
    }
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addModule = () => {
    setModules([...modules, { 
      id: `m${modules.length + 1}`, 
      title: "", 
      content: "", 
      order: modules.length + 1, 
      test: {
        title: "",
        pass_mark_percentage: 70,
        questions: []
      }
    }]);
  };

  const removeModule = (index: number) => {
    const newModules = [...modules];
    newModules.splice(index, 1);
    // Reorder
    newModules.forEach((m, i) => m.order = i + 1);
    setModules(newModules);
  };

  const updateModule = (index: number, field: string, value: string) => {
    const newModules = [...modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setModules(newModules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("arova_token");
      await axios.post("http://localhost:8000/api/admin/internships", {
        title,
        description,
        duration_months: durationMonths,
        modules
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => router.push("/admin/dashboard"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create internship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl"
        >
          <h1 className="text-3xl font-bold mb-2">Course Builder</h1>
          <p className="text-muted-foreground mb-8">Design a new internship track and curriculum modules.</p>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-2xl text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Internship Created!</h2>
              <p className="text-green-400/80">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Internship Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full input-glass rounded-xl py-3 px-4"
                    placeholder="e.g. Data Science Intern"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (Months)</label>
                  <select 
                    value={durationMonths}
                    onChange={e => setDurationMonths(Number(e.target.value))}
                    className="w-full input-glass rounded-xl py-3 px-4"
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full input-glass rounded-xl py-3 px-4 h-24 resize-none"
                  placeholder="Describe the learning outcomes..."
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Curriculum Modules</h3>
                  <button 
                    type="button" 
                    onClick={addModule}
                    className="flex items-center gap-2 text-sm bg-primary/20 text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
                </div>

                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={index} className="flex gap-4 items-start bg-white/5 border border-white/10 p-4 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                        {module.order}
                      </div>
                      <div className="flex-1 grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Module ID</label>
                          <input 
                            type="text" 
                            value={module.id}
                            onChange={e => updateModule(index, "id", e.target.value)}
                            className="w-full input-glass rounded-lg py-2 px-3 text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Module Title</label>
                          <input 
                            type="text" 
                            value={module.title}
                            onChange={e => updateModule(index, "title", e.target.value)}
                            className="w-full input-glass rounded-lg py-2 px-3 text-sm"
                            placeholder="e.g. Intro to Python"
                            required
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs text-muted-foreground">Study Material (Content)</label>
                          <textarea 
                            value={module.content}
                            onChange={e => updateModule(index, "content", e.target.value)}
                            className="w-full input-glass rounded-lg py-2 px-3 text-sm min-h-[100px]"
                            placeholder="Paste the learning material here..."
                            required
                          />
                        </div>

                        {/* Test Builder Section inside the module */}
                        <div className="md:col-span-2 space-y-3 mt-4 border-t border-white/10 pt-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-primary">Module Test Builder</h4>
                            <button
                              type="button"
                              onClick={() => {
                                const newModules = [...modules];
                                newModules[index].test.questions.push({
                                  text: "",
                                  options: ["", "", "", ""],
                                  correct_option_index: 0
                                });
                                setModules(newModules);
                              }}
                              className="text-xs bg-primary/20 text-primary px-3 py-1 rounded hover:bg-primary/30"
                            >
                              + Add Question
                            </button>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">Test Title</label>
                              <input 
                                type="text" 
                                value={module.test.title}
                                onChange={e => {
                                  const newModules = [...modules];
                                  newModules[index].test.title = e.target.value;
                                  setModules(newModules);
                                }}
                                className="w-full input-glass rounded-lg py-2 px-3 text-sm"
                                placeholder="e.g. Python Basics Quiz"
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">Passing Grade (%)</label>
                              <input 
                                type="number" 
                                value={module.test.pass_mark_percentage}
                                onChange={e => {
                                  const newModules = [...modules];
                                  newModules[index].test.pass_mark_percentage = Number(e.target.value);
                                  setModules(newModules);
                                }}
                                className="w-full input-glass rounded-lg py-2 px-3 text-sm"
                                min={1} max={100}
                                required
                              />
                            </div>
                          </div>

                          {module.test.questions.map((q: any, qIndex: number) => (
                            <div key={qIndex} className="bg-black/20 p-3 rounded-lg space-y-2 mt-2 border border-white/5">
                              <div className="flex justify-between">
                                <label className="text-xs font-semibold text-muted-foreground">Question {qIndex + 1}</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newModules = [...modules];
                                    newModules[index].test.questions.splice(qIndex, 1);
                                    setModules(newModules);
                                  }}
                                  className="text-red-400 hover:text-red-300 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                              <input 
                                type="text" 
                                value={q.text}
                                onChange={e => {
                                  const newModules = [...modules];
                                  newModules[index].test.questions[qIndex].text = e.target.value;
                                  setModules(newModules);
                                }}
                                className="w-full input-glass rounded-lg py-2 px-3 text-sm"
                                placeholder="What is a Python tuple?"
                                required
                              />
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {q.options.map((opt: string, optIndex: number) => (
                                  <div key={optIndex} className="flex items-center gap-2">
                                    <input 
                                      type="radio" 
                                      name={`correct-${index}-${qIndex}`}
                                      checked={q.correct_option_index === optIndex}
                                      onChange={() => {
                                        const newModules = [...modules];
                                        newModules[index].test.questions[qIndex].correct_option_index = optIndex;
                                        setModules(newModules);
                                      }}
                                    />
                                    <input 
                                      type="text" 
                                      value={opt}
                                      onChange={e => {
                                        const newModules = [...modules];
                                        newModules[index].test.questions[qIndex].options[optIndex] = e.target.value;
                                        setModules(newModules);
                                      }}
                                      className="w-full input-glass rounded-lg py-1 px-2 text-xs"
                                      placeholder={`Option ${optIndex + 1}`}
                                      required
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {modules.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeModule(index)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center text-sm">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-4 rounded-xl font-bold text-lg disabled:opacity-50"
              >
                {loading ? "Saving Course..." : "Create Internship Track"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
