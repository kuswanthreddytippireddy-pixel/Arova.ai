"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Upload, LogOut, Plus, Search, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("arova_token");
    router.push("/");
  };

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
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Internship Tracks</h3>
            <p className="text-sm text-muted-foreground">
              View and manage the 1-month, 3-month, and 6-month curriculum structures.
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
                className="w-full input-glass rounded-xl py-2.5 pl-10 pr-4 text-sm"
                placeholder="Search by ID or Email..."
              />
            </div>
          </div>
          
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-white/10 rounded-2xl">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No students have been registered yet.</p>
            <p className="text-sm mt-1">Click "Register Student" or "Bulk CSV Upload" to get started.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
