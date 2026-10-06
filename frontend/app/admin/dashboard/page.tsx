"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Upload, LogOut, Plus, Search, BookOpen, Loader2, CheckCircle2, CircleDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("arova_token");
        const res = await axios.get("http://localhost:8000/api/admin/students", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

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

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navbar */}
      <nav className="glass-panel border-b-0 rounded-b-3xl sticky top-0 z-50 mb-8 p-4 px-6 md:px-12 flex justify-between items-center bg-background/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <span className="text-lg font-bold text-white tracking-tighter">AR</span>
          </div>
          <span className="font-semibold text-lg hidden sm:block text-primary">Admin Control Center</span>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome, Superadmin
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Manage student enrollments, upload internship tracks, and oversee the AROVA portal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Quick Action: Create Student */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-3xl group hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden"
            onClick={() => router.push("/admin/students/create")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors" />
            <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Plus className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Register Student</h3>
            <p className="text-sm text-muted-foreground">
              Manually create a new student account and enroll them in a track.
            </p>
          </motion.div>

          {/* Quick Action: Bulk Upload */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 rounded-3xl group hover:border-accent/50 transition-colors cursor-pointer relative overflow-hidden"
            onClick={() => router.push("/admin/students/bulk-upload")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent/20 transition-colors" />
            <div className="w-14 h-14 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mb-6">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Bulk CSV Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload hundreds of students at once using a standardized CSV file.
            </p>
          </motion.div>

          {/* Quick Action: Manage Tracks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8 rounded-3xl group hover:border-blue-500/50 transition-colors cursor-pointer relative overflow-hidden"
            onClick={() => router.push("/admin/internships/create")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Create Course Track</h3>
            <p className="text-sm text-muted-foreground">
              Build a new internship track, define curriculum modules, and map out the progression.
            </p>
          </motion.div>
        </div>

        {/* Search Bar for Students */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 glass-panel p-8 rounded-3xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="text-2xl font-bold">Student Directory</h2>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input-glass rounded-xl py-2.5 pl-10 pr-4 text-sm"
                placeholder="Search by ID or Email..."
              />
            </div>
          </div>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-white/10 rounded-2xl">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No students have been registered yet.</p>
              <p className="text-sm mt-1">Click "Register Student" or "Bulk CSV Upload" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-sm">
                    <th className="pb-4 font-semibold px-4">Student</th>
                    <th className="pb-4 font-semibold px-4">Track</th>
                    <th className="pb-4 font-semibold px-4">Current Module</th>
                    <th className="pb-4 font-semibold px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-foreground">{student.name}</div>
                        <div className="text-muted-foreground text-xs flex items-center gap-2 mt-1">
                          <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{student.student_id}</span>
                          {student.email}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground font-medium">
                        {student.internship_title}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground font-mono">
                        {student.current_module}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {student.completed ? (
                          <div className="inline-flex items-center gap-1.5 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Graduated
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-accent bg-accent/10 px-3 py-1 rounded-full text-xs font-semibold border border-accent/20">
                            <CircleDashed className="w-3.5 h-3.5 animate-spin-slow" /> Active
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No students match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
