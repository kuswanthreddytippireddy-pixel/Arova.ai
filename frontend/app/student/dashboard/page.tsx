"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, ChevronRight, Award, LogOut, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Module {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface DashboardData {
  internship_title: string;
  duration_months: number;
  completed: boolean;
  current_module: Module;
  message?: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("arova_token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/student/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("arova_token");
          router.push("/");
        } else {
          setError(err.response?.data?.detail || "Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("arova_token");
      if (token) {
        await axios.post("http://localhost:8000/api/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem("arova_token");
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={handleLogout} className="btn-primary py-2 px-4 rounded-lg w-full">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // If not enrolled in anything
  if (data?.message) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel p-10 rounded-3xl max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Welcome to AROVA</h2>
          <p className="text-muted-foreground mb-8">
            You are not currently enrolled in any internship track. Please contact your administrator.
          </p>
          <button onClick={handleLogout} className="btn-primary py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navbar */}
      <nav className="glass-panel border-b-0 rounded-b-3xl sticky top-0 z-50 mb-8 p-4 px-6 md:px-12 flex justify-between items-center bg-background/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <span className="text-lg font-bold text-white tracking-tighter">AR</span>
          </div>
          <span className="font-semibold text-lg hidden sm:block">AROVA Portal</span>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-semibold text-primary mb-4 border-primary/20">
            {data?.duration_months}-Month Track
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {data?.internship_title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Master the skills, complete your 30-day modules, and earn your verified certificate.
          </p>
        </motion.div>

        {data?.completed ? (
          /* Completed State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-10 md:p-16 rounded-3xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-primary/10 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                <Award className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Internship Completed!</h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
                Congratulations! You have successfully passed all modules in the {data.internship_title} track.
              </p>
              <button 
                onClick={() => router.push('/student/certificate')}
                className="btn-primary py-3 px-8 rounded-xl font-medium inline-flex items-center gap-2"
              >
                View Certificate <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Active Module State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-accent font-medium mb-6">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    {data?.current_module?.order}
                  </div>
                  <span>Current Module</span>
                </div>
                
                <h2 className="text-3xl font-bold mb-4">{data?.current_module?.title}</h2>
                <div className="prose prose-invert max-w-none text-muted-foreground mb-10">
                  <p>{data?.current_module?.content}</p>
                </div>
                
                <button 
                  onClick={() => router.push(`/student/module/${data?.current_module?.id}/test`)}
                  className="btn-primary w-full sm:w-auto py-3 px-8 rounded-xl font-medium inline-flex items-center justify-center gap-2"
                >
                  Take Module Test <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Sidebar */}
            <div className="glass-panel p-8 rounded-3xl h-fit">
              <h3 className="text-xl font-bold mb-6">Your Progress</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="w-0.5 h-12 bg-primary/30 my-1" />
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">Enrolled</p>
                    <p className="text-sm text-muted-foreground mt-1">Track Started</p>
                  </div>
                </div>

                <div className="flex gap-4 opacity-100">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-accent bg-accent/20 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold text-accent">Module {data?.current_module?.order}</p>
                    <p className="text-sm text-muted-foreground mt-1">In Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
