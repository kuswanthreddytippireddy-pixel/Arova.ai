"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Target, Briefcase, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-900 font-sans">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-3">
              <span className="text-xl font-bold text-white -rotate-3">AR</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#0a1435] leading-tight">AROVA</span>
              <span className="text-[10px] tracking-widest font-semibold text-blue-600">— AI TECH —</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-600 tracking-wide">
            <a href="#" className="hover:text-blue-600 transition-colors">ABOUT US</a>
            <a href="#" className="hover:text-blue-600 transition-colors">PROGRAMS</a>
            <a href="#" className="hover:text-blue-600 transition-colors">INTERNSHIPS</a>
            <a href="#" className="hover:text-blue-600 transition-colors">JOURNEY</a>
            <button 
              onClick={() => router.push("/login")}
              className="text-slate-800 hover:text-blue-600 transition-colors"
            >
              SIGN IN
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-bold text-slate-700">
              <Phone className="w-4 h-4 text-emerald-500" />
              +91 6360111080
            </div>
            <button 
              className="bg-[#0066ff] hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              APPLY INTERNSHIP <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-28 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#e4e7ec] to-[#f1f3f7] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-[600px] flex items-center px-12 md:px-20 border border-white">
            
            {/* Background Aesthetic Elements */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-60 pointer-events-none">
              <div className="absolute inset-0 bg-grid-slate-200/[0.2] bg-[length:30px_30px]" />
              <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-extrabold text-[#0a1435] tracking-tight mb-6"
              >
                Arova AI Tech Pvt. Ltd.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl"
              >
                Arova AI Tech Pvt. Ltd., also known as Arova, is an EdTech company focused on training, internships, and industry-oriented learning programs.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4"
              >
                <button className="bg-[#0a1435] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                  Explore Programs
                </button>
                <button className="bg-[#0066ff] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  Apply for Internship <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-white text-slate-800 px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all border border-slate-100">
                  Student Registration
                </button>
              </motion.div>
            </div>
            
            {/* 3D Mock Element */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block"
            >
              <div className="w-[300px] h-[300px] bg-gradient-to-br from-blue-400 to-[#0066ff] rounded-[3rem] shadow-[0_40px_80px_rgba(0,102,255,0.4)] transform rotate-12 flex items-center justify-center border-t-4 border-l-4 border-white/30 backdrop-blur-md">
                <div className="w-20 h-6 bg-white/20 rounded-full absolute top-4 left-1/2 -translate-x-1/2" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Banner Strip */}
      <div className="bg-[#0a1435] py-4 text-white/80 text-xs font-bold tracking-widest flex justify-center gap-8 md:gap-16 overflow-hidden">
        <span className="flex items-center gap-2"><span className="text-yellow-500">✦</span> SYSTEMS — WE TEACH THE FULL JOURNEY.</span>
        <span className="flex items-center gap-2"><span className="text-yellow-500">✦</span> SKILLS YOU CAN DEMO, NOT JUST DESCRIBE.</span>
        <span className="hidden md:flex items-center gap-2"><span className="text-yellow-500">✦</span> EVERY CLASS IS A LAB, NOT A LECTURE.</span>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-[#8b5cf6]">100%</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">PLACEMENT RATE</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-[#8b5cf6]">8,431+</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">STUDENTS ENROLLED</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-[#8b5cf6]">40+</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">HIRING CLIENTS</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-[#8b5cf6]">250+</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">CORPORATE MENTORS</p>
          </div>
          <div className="bg-[#0a1435] p-6 rounded-3xl shadow-[0_20px_40px_rgba(10,20,53,0.2)] text-center flex flex-col justify-center col-span-2 md:col-span-1">
            <h3 className="text-3xl font-extrabold text-blue-400">2 Month</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">ONLINE INTERNSHIPS</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#0a1435] mb-4">What We Provide & Why Us?</h2>
          <p className="text-slate-500">A structured approach to technical competence and placement readiness.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0a1435] mb-3">Premium Tech Training</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Attend real-time, interactive online classes or learn hands-on inside state-of-the-art physical labs with advanced hardware-software setups.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[#0a1435] mb-3">Guaranteed Internships</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Work on live commercial platforms under senior developers. Gain verified workspace credentials and build production-ready projects.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-[#0a1435] mb-3">Placement Infrastructure</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Access ATS resume builders, intensive mock interview grids, active job referral channels, and resume hand-offs directly to engineering leads.
            </p>
          </div>
        </div>
      {/* Programs Section */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#0a1435] mb-4">Our Programs</h2>
          <p className="text-slate-500">Industry-oriented learning tracks.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Program 1 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-700 relative">
              <div className="absolute top-4 left-4 bg-[#0a1435] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">ONLINE</div>
              <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>TECH & DEVELOPMENT</span>
                <span className="text-orange-400 flex items-center gap-1">★ 4.9</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0a1435] mb-3">AI & Machine Learning</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                Comprehensive specialization covering Python, Supervised/Unsupervised Learning, Neural Networks, Deep Learning, and Generative AI.
              </p>
              
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-400">Duration</span>
                <span className="text-[#0a1435]">2 Month</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-8">
                <span className="text-slate-400">Certification Fees</span>
                <span className="text-blue-600">₹12,000</span>
              </div>
              
              <button className="w-full py-4 rounded-2xl bg-[#f8f9fc] text-[#0a1435] font-bold text-sm group-hover:bg-[#0a1435] group-hover:text-white transition-colors">
                PROGRAM DETAILS
              </button>
            </div>
          </div>

          {/* Program 2 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-cyan-500 to-blue-600 relative">
              <div className="absolute top-4 left-4 bg-[#0a1435] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">ONLINE</div>
              <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>TECH & DEVELOPMENT</span>
                <span className="text-orange-400 flex items-center gap-1">★ 4.7</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0a1435] mb-3">Cloud Computing</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                Learn deployment and scaling on AWS/Azure. Setup virtual networks, configure auto-scaling blocks, and launch secure VPC systems.
              </p>
              
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-400">Duration</span>
                <span className="text-[#0a1435]">2 Month</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-8">
                <span className="text-slate-400">Certification Fees</span>
                <span className="text-blue-600">₹12,000</span>
              </div>
              
              <button className="w-full py-4 rounded-2xl bg-[#f8f9fc] text-[#0a1435] font-bold text-sm group-hover:bg-[#0a1435] group-hover:text-white transition-colors">
                PROGRAM DETAILS
              </button>
            </div>
          </div>

          {/* Program 3 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-700 relative">
              <div className="absolute top-4 left-4 bg-[#0a1435] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">ONLINE</div>
              <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>TECH & DEVELOPMENT</span>
                <span className="text-orange-400 flex items-center gap-1">★ 4.8</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0a1435] mb-3">Cybersecurity</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                Master ethical hacking, network pentesting, OWASP web vulnerabilities audit, and configure secure intrusion detection systems.
              </p>
              
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-400">Duration</span>
                <span className="text-[#0a1435]">2 Month</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-8">
                <span className="text-slate-400">Certification Fees</span>
                <span className="text-blue-600">₹12,000</span>
              </div>
              
              <button className="w-full py-4 rounded-2xl bg-[#f8f9fc] text-[#0a1435] font-bold text-sm group-hover:bg-[#0a1435] group-hover:text-white transition-colors">
                PROGRAM DETAILS
              </button>
            </div>
          </div>

          {/* Program 4 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
              <div className="absolute top-4 left-4 bg-[#0a1435] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">ONLINE</div>
              <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>TECH & DEVELOPMENT</span>
                <span className="text-orange-400 flex items-center gap-1">★ 4.8</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0a1435] mb-3">Full Stack Development</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                Become a job-ready developer. Learn React, Node.js, Express, Databases, and DevOps deployment pipelines.
              </p>
              
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-400">Duration</span>
                <span className="text-[#0a1435]">2 Month</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-8">
                <span className="text-slate-400">Certification Fees</span>
                <span className="text-blue-600">₹12,000</span>
              </div>
              
              <button className="w-full py-4 rounded-2xl bg-[#f8f9fc] text-[#0a1435] font-bold text-sm group-hover:bg-[#0a1435] group-hover:text-white transition-colors">
                PROGRAM DETAILS
              </button>
            </div>
          </div>

          {/* Program 5 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-gray-800 to-slate-900 relative">
              <div className="absolute top-4 left-4 bg-[#0a1435] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">ONLINE</div>
              <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>TECH & DEVELOPMENT</span>
                <span className="text-orange-400 flex items-center gap-1">★ 4.8</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0a1435] mb-3">Data Science</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                Master statistics, Python programming, database SQL controls, and build predictive machine learning models to solve business challenges.
              </p>
              
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-400">Duration</span>
                <span className="text-[#0a1435]">2 Month</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-8">
                <span className="text-slate-400">Certification Fees</span>
                <span className="text-blue-600">₹12,000</span>
              </div>
              
              <button className="w-full py-4 rounded-2xl bg-[#0a1435] text-white font-bold text-sm transition-colors">
                PROGRAM DETAILS
              </button>
            </div>
          </div>

          {/* Program 6 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative">
              <div className="absolute top-4 left-4 bg-[#0a1435] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">ONLINE</div>
              <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>ENGINEERING & VLSI</span>
                <span className="text-orange-400 flex items-center gap-1">★ 4.6</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0a1435] mb-3">AutoCAD & 3D Drafting</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                Learn professional architectural and mechanical drafting. Model 2D blueprints, generate 3D CAD meshes, and scale layouts.
              </p>
              
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-400">Duration</span>
                <span className="text-[#0a1435]">2 Month</span>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-8">
                <span className="text-slate-400">Certification Fees</span>
                <span className="text-blue-600">₹12,000</span>
              </div>
              
              <button className="w-full py-4 rounded-2xl bg-[#f8f9fc] text-[#0a1435] font-bold text-sm group-hover:bg-[#0a1435] group-hover:text-white transition-colors">
                PROGRAM DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
