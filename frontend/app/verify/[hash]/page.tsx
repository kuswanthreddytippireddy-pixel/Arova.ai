"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Award, Loader2, Search, Calendar, FileText, User } from "lucide-react";
import axios from "axios";

export default function CertificateVerificationPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/certificates/verify/${hash}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Invalid or tampered certificate.");
      } finally {
        setLoading(false);
      }
    };

    if (hash) {
      verifyCertificate();
    }
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">Verifying cryptographic hash...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg glass-panel p-10 rounded-3xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Verification Failed</h1>
            <p className="text-muted-foreground text-lg mb-6">
              This certificate hash is invalid or does not exist in our database. It may be forged or tampered with.
            </p>
            <div className="bg-background/50 border border-white/5 p-4 rounded-xl inline-block w-full">
              <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">Searched Hash</span>
              <span className="font-mono text-red-400 break-all">{hash}</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-10 p-4 md:p-8 bg-background flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl relative"
      >
        {/* Certificate Holographic Border Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-blue-500 rounded-[2rem] blur opacity-30 animate-pulse" />
        
        <div className="glass-panel p-8 md:p-12 rounded-[2rem] relative overflow-hidden bg-background/80 backdrop-blur-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-accent/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 border-[1px] border-white/5 rounded-full pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-60 h-60 border-[1px] border-white/5 rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                  <span className="text-xl font-bold text-white tracking-tighter">AR</span>
                </div>
                <div>
                  <span className="font-bold text-xl block">AROVA</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Verified Credential</span>
                </div>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">AUTHENTIC</span>
              </div>
            </div>

            {/* Core Details */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-primary/30">
                <Award className="w-10 h-10" />
              </div>
              
              <p className="text-muted-foreground text-lg mb-3">This is to certify that</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono text-white tracking-tight">
                {data?.student_details?.student_id}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">has successfully completed the</p>
              
              <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent inline-block">
                {data?.internship_details?.title}
              </h3>
              <p className="text-accent/80 font-semibold mt-2 text-lg">
                ({data?.internship_details?.duration_months} Month Track)
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-0.5">Issue Date</p>
                  <p className="font-medium">{new Date(data?.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              
              <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-0.5">Verification Hash</p>
                  <p className="font-mono text-sm truncate pr-2 text-primary/80">{data?.verification_hash}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center border-t border-white/10 pt-6">
              <p className="text-sm text-muted-foreground">
                {data?.message} Employers can scan or click the original link to view this page directly on arova.in.
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
