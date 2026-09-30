"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Loader2, ArrowLeft, Download, ExternalLink } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StudentCertificate() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificate = async () => {
      const token = localStorage.getItem("arova_token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/student/certificate", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => router.push("/student/dashboard")} className="btn-primary py-2 px-4 rounded-lg">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const issueDate = new Date(data.issue_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen pb-20 p-4 md:p-8">
      <button 
        onClick={() => router.push("/student/dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            
            {/* Certificate Preview */}
            <div className="flex-1 bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Certificate of Completion</h2>
              <h1 className="text-3xl font-bold text-foreground mb-6">{data.student_name}</h1>
              <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                Has successfully completed the comprehensive internship program in
              </p>
              <h3 className="text-xl font-bold text-accent mb-8">{data.internship_title}</h3>
              <div className="w-full border-t border-white/10 pt-6 flex justify-between items-center text-xs text-muted-foreground font-mono">
                <span>Date: {issueDate}</span>
                <span>ID: {data.verify_hash.substring(0,8).toUpperCase()}</span>
              </div>
            </div>

            {/* Actions & Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Your Certificate is Ready</h3>
                <p className="text-muted-foreground">
                  You can now share this verified credential with employers, on LinkedIn, or download it for your records.
                </p>
              </div>
              
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Verification Link</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`https://arova.in/verify/${data.verify_hash}`}
                    className="flex-1 bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-foreground/80 outline-none"
                  />
                  <button 
                    onClick={() => router.push(`/verify/${data.verify_hash}`)}
                    className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
                    title="Test Verification Page"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 btn-primary py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
