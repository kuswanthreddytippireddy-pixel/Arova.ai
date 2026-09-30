"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateStudent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    duration_months: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("arova_token");
      
      const payload = {
        name: formData.name,
        email: formData.email,
        internship_track_months: Number(formData.duration_months)
      };

      const res = await axios.post("http://localhost:8000/api/admin/students", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStudentId(res.data.student_id);
      setSuccess(true);
      setFormData({ name: "", email: "", duration_months: 1 });
      
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 p-4 md:p-8">
      <button 
        onClick={() => router.push("/admin/dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Register New Student</h1>
                <p className="text-muted-foreground text-sm">Enroll a student into an internship track</p>
              </div>
            </div>

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl mb-8 flex gap-4 items-start"
              >
                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-green-400 mb-1">Student Registered Successfully!</h3>
                  <p className="text-sm text-green-400/80 mb-3">
                    The student can now log in using their ID and the default password: <b>ChangeMe#2026</b>
                  </p>
                  <div className="bg-green-500/20 px-3 py-2 rounded-lg inline-block">
                    <span className="text-xs text-green-400/80 uppercase font-semibold block mb-0.5">Student ID</span>
                    <span className="font-mono text-lg text-green-300 font-bold tracking-wider">{studentId}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium pl-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full input-glass rounded-xl py-3 px-4 text-sm"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium pl-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full input-glass rounded-xl py-3 px-4 text-sm"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium pl-1">Internship Track Duration</label>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 3, 6].map((months) => (
                    <div 
                      key={months}
                      onClick={() => setFormData({...formData, duration_months: months})}
                      className={`cursor-pointer rounded-xl p-4 text-center transition-all ${
                        formData.duration_months === months 
                        ? "bg-primary/20 border-2 border-primary text-primary" 
                        : "bg-muted/30 border-2 border-transparent text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className="font-bold text-xl mb-1">{months}</div>
                      <div className="text-xs font-medium uppercase">Months</div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-4 rounded-xl font-medium flex justify-center gap-2 mt-8 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Register Student</>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
