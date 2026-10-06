"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/auth/forgot-password", {
        email: email
      });
      
      setSuccess(true);
      if (res.data.dev_token) {
        setDevToken(res.data.dev_token);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-2xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Reset Password</h1>
              <p className="text-muted-foreground text-sm">
                Enter your email address and we'll send you a secure reset token.
              </p>
            </div>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="font-bold text-green-400 mb-2">Code Sent Successfully</h3>
                  <p className="text-sm text-green-400/80 mb-4">
                    Check your email for the 6-character reset token.
                  </p>
                  
                  {/* FOR DEVELOPMENT ONLY */}
                  {devToken && (
                    <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                      <p className="text-xs text-green-300 font-semibold mb-1">DEVELOPMENT MODE TOKEN:</p>
                      <p className="text-2xl font-mono tracking-widest text-white">{devToken}</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
                  className="w-full btn-primary py-3 rounded-xl font-medium"
                >
                  Proceed to Reset
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full input-glass rounded-xl py-3 pl-10 pr-4 text-sm"
                      placeholder="name@arova.in"
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
                  className="w-full btn-primary rounded-xl py-3 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send Reset Code <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="text-center mt-6">
                  <button 
                    type="button" 
                    onClick={() => router.push("/login")}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
