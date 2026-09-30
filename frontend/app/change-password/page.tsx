"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ShieldAlert } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("arova_token");
      if (!token) {
        router.push("/");
        return;
      }

      const res = await axios.post("http://localhost:8000/api/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword
      }, {
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
      });
      
      // Save the fresh token
      localStorage.setItem("arova_token", res.data.access_token);
      
      // Decode JWT to find the role
      const payload = JSON.parse(atob(res.data.access_token.split('.')[1]));
      const role = payload.role;
      
      if (role === "SUPERADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
      
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to change password. Ensure your old password is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-2xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />
          
          <div className="relative z-10 text-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Password Change Required</h1>
            <p className="text-muted-foreground text-sm">
              You are using a temporary password. You must set a new password before continuing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium pl-1">Current/Temporary Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full input-glass rounded-xl py-3 pl-10 pr-4 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium pl-1">New Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full input-glass rounded-xl py-3 pl-10 pr-4 text-sm"
                  minLength={8}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_4px_14px_rgba(239,68,68,0.4)] py-3 rounded-xl mt-4 flex justify-center gap-2"
            >
              Update Password & Continue <ArrowRight className="w-4 h-4 mt-0.5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
