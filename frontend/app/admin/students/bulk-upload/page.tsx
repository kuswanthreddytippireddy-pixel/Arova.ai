"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, ArrowLeft, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BulkUploadStudents() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please upload a valid .csv file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("arova_token");
      
      const res = await axios.post("http://localhost:8000/api/admin/students/bulk-upload", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      setResults(res.data.results);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to upload file");
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
        className="max-w-3xl mx-auto"
      >
        <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-accent/20 text-accent rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Bulk Student Upload</h1>
                <p className="text-muted-foreground text-sm">Upload a CSV file containing student emails</p>
              </div>
            </div>

            {/* Results View */}
            {results ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-400 text-lg">Upload Processed!</h3>
                    <p className="text-sm text-green-400/80">
                      Successfully processed {results.length} records from the CSV file.
                    </p>
                  </div>
                </div>

                <div className="bg-background/40 rounded-2xl overflow-hidden border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/40 text-muted-foreground">
                      <tr>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {results.map((r, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-4 font-medium">{r.email}</td>
                          <td className="p-4">
                            {r.status === "success" ? (
                              <span className="inline-flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2 py-1 rounded-md text-xs font-semibold">
                                <CheckCircle2 className="w-3 h-3" /> Created
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2 py-1 rounded-md text-xs font-semibold">
                                <AlertCircle className="w-3 h-3" /> Failed
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground font-mono text-xs">
                            {r.status === "success" ? `ID: ${r.student_id}` : r.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button 
                  onClick={() => { setResults(null); setFile(null); }}
                  className="btn-primary py-3 px-6 rounded-xl font-medium w-full mt-4"
                >
                  Upload Another File
                </button>
              </motion.div>
            ) : (
              /* Upload View */
              <div className="space-y-6">
                
                {/* Instructions Box */}
                <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl text-sm mb-6">
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> CSV Format Requirements
                  </h4>
                  <p className="text-muted-foreground mb-3">Your CSV file must include a header row with exactly this column:</p>
                  <code className="bg-background px-3 py-1.5 rounded-lg text-primary font-mono block w-fit border border-primary/20">
                    email
                  </code>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl">
                    {error}
                  </div>
                )}

                <div 
                  className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[250px]
                    ${file ? "border-accent bg-accent/5" : "border-white/20 hover:border-white/40 hover:bg-white/5"}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept=".csv"
                    className="hidden"
                  />
                  
                  {file ? (
                    <>
                      <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-bold text-foreground mb-1">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      <button className="text-accent text-sm mt-4 hover:underline">Click to change file</button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-muted/50 text-muted-foreground rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-bold text-foreground mb-2">Click to browse or drag and drop</p>
                      <p className="text-sm text-muted-foreground">CSV files only</p>
                    </>
                  )}
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="w-full btn-primary py-4 rounded-xl font-medium flex justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Upload & Process Students</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
