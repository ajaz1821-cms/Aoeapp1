/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  LogOut, 
  Calendar, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  ChevronRight, 
  Trophy, 
  TrendingUp,
  LayoutGrid,
  Users,
  Backpack,
  Search,
  PlusCircle,
  Bell,
  Clock,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';

// --- AI Initialization ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Static Data ---
const PERFORMANCE_DATA = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 78 },
  { month: 'Apr', score: 88 },
  { month: 'May', score: 92 },
  { month: 'Jun', score: 90 },
];

const MARKS_DATA = [
  { subject: 'Mathematics', internal: 18, theory: 72, total: 90, grade: 'A+' },
  { subject: 'Physics', internal: 19, theory: 68, total: 87, grade: 'A' },
  { subject: 'Chemistry', internal: 17, theory: 75, total: 92, grade: 'A+' },
  { subject: 'Computer Science', internal: 20, theory: 78, total: 98, grade: 'O' },
  { subject: 'English', internal: 18, theory: 70, total: 88, grade: 'A' },
];

const TASKS = [
  { id: 1, title: 'Calculus Integration', type: 'Homework', status: 'Pending', color: 'orange' },
  { id: 2, title: 'Optics Lab Report', type: 'Classwork', status: 'Completed', color: 'mint' },
  { id: 3, title: 'Thermodynamics Project', type: 'Assignment', status: 'Pending', color: 'orange' },
];

// --- Components ---

const GlassCard = ({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <div id={id} className={`glass-card rounded-3xl p-6 ${className}`}>
    {children}
  </div>
);

const GlassButton = ({ children, onClick, className = '', variant = 'primary', id, disabled = false, type = 'button' }: any) => {
  const variants: any = {
    primary: 'bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue border border-brand-blue/20',
    mint: 'bg-brand-mint/20 hover:bg-brand-mint/30 text-emerald-700 border border-brand-mint/20',
    orange: 'bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange border border-brand-orange/20',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20',
    ghost: 'hover:bg-black/5 text-slate-500 hover:text-slate-900',
    solid: 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20',
  };

  return (
    <button 
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const ChatBot = ({ studentData }: { studentData: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: `Hey ${studentData.name}! I'm your AOE sidekick. Ask me anything about your grades, attendance, or even when the next holiday is! Is there any other thing you want to know -:(` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const prompt = `
        User context:
        - Student Name: ${studentData.name}
        - Class: ${studentData.class}
        - Roll Number: ${studentData.roll}
        - Attendance: ${studentData.attendance}
        - Rank: ${studentData.rank}
        - Subjects & Marks: ${JSON.stringify(MARKS_DATA)}
        - Recent Tasks: ${JSON.stringify(TASKS)}
        - Next Holiday: Next Friday (May 8th) - Summer Break starts soon!

        User Question: ${userMessage}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: `You are a friendly, cool AOE student assistant. Act like a friend to the student. 
          Use the provided context to answer accurately. 
          If you don't know the specific answer, be honest but encouraging.
          CRITICAL: You MUST end every single response with the exact phrase: "Is there any other thing you want to know  -:("`
        }
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "Sorry, I'm a bit lost right now. Is there any other thing you want to know  -:(" }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Oops, my brain glitched! Let's try that again. Is there any other thing you want to know  -:(" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] h-[500px] glass p-0 overflow-hidden flex flex-col !bg-white/90 border-white/60 shadow-2xl rounded-3xl"
          >
            <div className="bg-brand-blue p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-display font-black text-xs uppercase tracking-widest italic">AOE Helper</p>
                  <p className="text-[10px] opacity-70 font-bold uppercase">Online & Ready</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${
                    m.role === 'user' 
                      ? 'bg-brand-blue text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your friend..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-blue/30 transition-all font-semibold"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-blue/40 border-4 border-white/50 backdrop-blur-xl relative"
      >
        <Sparkles className="w-8 h-8" />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-mint"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'login' | 'dashboard' | 'admin'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const isValidAjaz = username === 'ajaz1821' && password === 'mylove';
      const isValidNewUser = username === '80032320' && password === '1234';

      if (isValidAjaz || isValidNewUser) {
        setView('dashboard');
        setError('');
      } else {
        setError('Invalid credentials. Please check your ID and Password.');
      }
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setView('login');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans overflow-x-hidden selection:bg-brand-blue/20">
      <div className="frosted-bg" />
      <div className="bg-pattern" />

      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center min-h-screen p-4 relative z-10"
          >
            <GlassCard id="login-card" className="w-full max-w-md p-10 border-white/50 !bg-white/40 shadow-2xl backdrop-blur-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 rotate-3 shadow-xl shadow-brand-blue/30">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-display font-black text-slate-900 mb-2 tracking-tight uppercase italic">Academy of Excellence</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">A.O.E Student Portal</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter User ID"
                      className="w-full bg-white/40 border border-white/60 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-blue/50 focus:bg-white/60 transition-all text-slate-900 placeholder:text-slate-300 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      className="w-full bg-white/40 border border-white/60 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-brand-blue/50 focus:bg-white/60 transition-all text-slate-900 placeholder:text-slate-300 font-semibold"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-red-500 text-xs text-center font-bold bg-red-500/10 py-2 rounded-xl"
                  >
                    {error}
                  </motion.p>
                )}

                <GlassButton 
                  id="login-btn"
                  type="submit"
                  className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-blue/20"
                  variant="solid"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In To Portal'}
                </GlassButton>
              </form>

              <div className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                &copy; AJAZ-SOFTWARE | PREMIER SYSTEMS
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div 
            key="interface"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4 md:p-8 max-w-7xl mx-auto relative z-10 pb-24"
          >
            {/* --- Navbar --- */}
            <nav className="flex items-center justify-between glass px-6 py-4 rounded-3xl mb-8 sticky top-4 z-50 border-white/50 bg-white/20 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-blue flex items-center justify-center rounded-xl font-display font-black text-white shadow-lg shadow-brand-blue/30 italic">
                  AOE
                </div>
                <div>
                  <h2 className="font-display font-black text-lg leading-none text-slate-900 uppercase italic">Academy of Excellence</h2>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black">Premier Education Systems</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <GlassButton variant="ghost" onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'text-brand-blue bg-brand-blue/10 font-black' : 'font-bold uppercase tracking-tight text-xs'}>
                  STUDENT PORTAL
                </GlassButton>
                <GlassButton variant="ghost" onClick={() => setView('admin')} className={view === 'admin' ? 'text-brand-mint bg-brand-mint/10 font-black' : 'font-bold uppercase tracking-tight text-xs'}>
                  TEACHER ACCESS
                </GlassButton>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-orange rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                </div>
                <GlassButton id="logout-btn" onClick={logout} variant="danger" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest !px-4">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </GlassButton>
              </div>
            </nav>

            {view === 'dashboard' ? (
              <div className="space-y-8">
                {/* --- Profile Header --- */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassCard className="flex flex-col md:flex-row items-center gap-8 md:p-10 !bg-white/40 shadow-2xl">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full border-4 border-brand-mint bg-slate-100 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                        <img 
                          src="https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400&h=400&fit=crop" 
                          alt="Student" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-blue border-4 border-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-end gap-2 mb-2">
                        <h1 className="text-4xl font-display font-black text-slate-900 leading-tight">Welcome back, Ajaz</h1>
                        <span className="text-slate-400 font-mono text-[11px] mb-1.5 ml-1 hidden md:inline uppercase font-bold tracking-tight">/ Member ID: <span className="text-brand-blue font-black">#1821</span></span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                        <div className="text-center md:text-left">
                          <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1 font-sans">Class ID</p>
                          <p className="font-black text-xl text-slate-900">XII-A</p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1 font-sans">Global Rank</p>
                          <p className="font-black text-xl text-brand-mint">#04</p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1 font-sans">Status</p>
                          <p className="font-black text-xl text-brand-blue italic">ACTIVE</p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1 font-sans">Roll Number</p>
                          <p className="font-black text-xl text-slate-900">#1821</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-3">
                      <div className="bg-white/20 backdrop-blur-md border border-white/40 p-4 rounded-3xl flex items-center gap-6 shadow-lg shadow-black/5">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="rgba(0,0,0,0.05)" strokeWidth="6" fill="transparent" />
                            <circle cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="6" fill="transparent" strokeDasharray="176" strokeDashoffset="14" strokeLinecap="round" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-sm font-black text-slate-900 leading-none">92%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Attendance</p>
                          <p className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">EXCELLENT</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* --- Feature Grid --- */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { title: 'Marks & Results', icon: Trophy, color: 'blue', id: 'marks-btn' },
                        { title: 'Homework', icon: Backpack, color: 'orange', id: 'homework-btn' },
                        { title: 'Assignments', icon: FileText, color: 'mint', id: 'assignments-btn' },
                        { title: 'Holidays', icon: Calendar, color: 'blue', id: 'holidays-btn' },
                        { title: 'Classwork', icon: BookOpen, color: 'orange', id: 'classwork-btn' },
                        { title: 'Complaints', icon: MessageSquare, color: 'mint', id: 'complaints-btn' },
                      ].map((item, idx) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + idx * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <GlassCard className="h-full flex flex-col items-center justify-center p-6 cursor-pointer hover:border-white/60 transition-all border-white/20 !bg-white/40 shadow-lg group">
                            <div className={`w-14 h-14 rounded-3xl bg-brand-${item.color}/10 flex items-center justify-center mb-4 border border-brand-${item.color}/20 group-hover:scale-110 transition-transform`}>
                              <item.icon className={`w-7 h-7 text-brand-${item.color}`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-center text-slate-500 group-hover:text-slate-900 transition-colors">{item.title}</span>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>

                    {/* --- Performance Analytics --- */}
                    <GlassCard className="h-[400px]">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="font-display font-black text-xs uppercase tracking-widest text-slate-400 mb-1">Academic Performance Analytics</h3>
                          <p className="text-slate-900 text-lg font-black italic uppercase tracking-tighter">Historical Growth Trend</p>
                        </div>
                        <div className="flex items-center gap-2 bg-brand-mint/10 text-emerald-600 text-[10px] font-black px-3 py-2 rounded-xl uppercase border border-brand-mint/20">
                          <TrendingUp className="w-3.5 h-3.5" />
                          ↑ 5.2% Increase
                        </div>
                      </div>
                      
                      <div className="w-full h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={PERFORMANCE_DATA}>
                            <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                            <XAxis 
                              dataKey="month" 
                              stroke="rgba(0,0,0,0.3)" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}
                            />
                            <YAxis 
                              stroke="rgba(0,0,0,0.3)" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 800 }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                background: 'rgba(255,255,255,0.9)', 
                                border: '1px solid rgba(0,0,0,0.05)',
                                borderRadius: '16px',
                                backdropFilter: 'blur(20px)',
                                color: '#0f172a',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                fontFamily: 'Inter',
                                fontWeight: 'bold'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="score" 
                              stroke="#2563eb" 
                              strokeWidth={4}
                              fillOpacity={1} 
                              fill="url(#colorScore)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </GlassCard>
                  </div>

                  {/* --- Sidebar Widgets --- */}
                  <div className="space-y-8">
                    {/* --- Marks Table --- */}
                    <GlassCard>
                      <div className="flex items-center gap-2 mb-6">
                        <Trophy className="w-5 h-5 text-brand-orange" />
                        <h3 className="font-display font-black text-xs uppercase tracking-widest text-slate-400">Academic Result</h3>
                      </div>
                      <div className="space-y-4">
                        {MARKS_DATA.slice(0, 4).map((mark) => (
                          <div key={mark.subject} className="flex items-center justify-between p-4 rounded-2xl bg-white/20 border border-white/40 hover:bg-white/40 transition-colors shadow-sm">
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-tight text-slate-800">{mark.subject}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Internal: {mark.internal} • Theory: {mark.theory}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-black text-brand-blue leading-none mb-1">{mark.total}</p>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${mark.grade === 'A+' || mark.grade === 'O' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>{mark.grade}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* --- Tasks & Homework --- */}
                    <GlassCard>
                      <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-brand-mint" />
                        <h3 className="font-display font-black text-xs uppercase tracking-widest text-slate-400">Active Pipeline</h3>
                      </div>
                      <div className="space-y-3">
                        {TASKS.map((task) => (
                          <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/40 bg-white/20 hover:bg-white/40 transition-colors cursor-pointer group shadow-sm">
                            <div className={`w-1.5 h-10 rounded-full bg-brand-${task.color}`} />
                            <div className="flex-1">
                              <p className="text-xs font-black text-slate-800 truncate">{task.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">{task.type}</span>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${task.status === 'Completed' ? 'bg-brand-mint/10 text-emerald-600' : 'bg-brand-orange/10 text-brand-orange'}`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* --- Complaints / Feedback --- */}
                    <GlassCard className="!bg-brand-blue/5 border-brand-blue/20">
                      <h3 className="font-display font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Support & Feedback</h3>
                      <textarea 
                        placeholder="Direct transmission to A.O.E Admin..."
                        className="w-full bg-white/40 border border-white/60 rounded-2xl p-4 text-xs min-h-[120px] outline-none focus:border-brand-blue/40 transition-all placeholder:text-slate-300 font-semibold text-slate-800 resize-none shadow-inner"
                      />
                      <GlassButton variant="solid" className="w-full mt-4 flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-[0.2em]">
                        <MessageSquare className="w-4 h-4" />
                        Submit Transmission
                      </GlassButton>
                    </GlassCard>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* --- Teacher / Admin Portal --- */}
                <div className="flex items-center justify-between glass-card px-8 py-6 rounded-3xl !bg-white/40">
                  <div>
                    <h1 className="text-3xl font-display font-black text-slate-900 uppercase italic">Teacher Portal <span className="text-brand-mint italic">Management</span></h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Authorized Access: Administrator</p>
                  </div>
                  <GlassButton variant="mint" className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] py-4 px-6">
                    <PlusCircle className="w-4 h-4" />
                    New Notification
                  </GlassButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <GlassCard className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Student Registry</h3>
                      <div className="flex items-center gap-3 bg-white/40 border border-white/60 px-4 py-2.5 rounded-2xl shadow-inner">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search Registry..." 
                          className="bg-transparent border-none outline-none text-xs w-48 placeholder:text-slate-300 font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-slate-400 text-[10px] uppercase font-black border-b border-white/40">
                            <th className="pb-5 font-black tracking-widest">Student</th>
                            <th className="pb-5 font-black tracking-widest">Enrollment</th>
                            <th className="pb-5 font-black tracking-widest">Class</th>
                            <th className="pb-5 font-black tracking-widest">Level</th>
                            <th className="pb-5 font-black tracking-widest">Meta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {[
                            { name: 'Ajaz', id: '#1821', class: 'XII-A', status: 'Active', img: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=100&h=100&fit=crop' },
                            { name: 'Sameer Khan', id: '#1822', class: 'XII-A', status: 'Active', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
                            { name: 'Priya Sharma', id: '#1823', class: 'XII-B', status: 'On Leave', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
                            { name: 'Rahul V.', id: '#1824', class: 'XI-A', status: 'Active', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
                          ].map((stu) => (
                            <tr key={stu.id} className="group hover:bg-white/10 transition-colors">
                              <td className="py-5">
                                <div className="flex items-center gap-3">
                                  <img src={stu.img} className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm" alt="" />
                                  <span className="font-black text-sm text-slate-800">{stu.name}</span>
                                </div>
                              </td>
                              <td className="py-5 font-mono text-[10px] text-brand-blue font-black uppercase">{stu.id}</td>
                              <td className="py-5 text-xs font-black text-slate-600">{stu.class}</td>
                              <td className="py-5">
                                <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter ${stu.status === 'Active' ? 'bg-brand-mint/10 text-emerald-600' : 'bg-brand-orange/10 text-brand-orange'}`}>
                                  {stu.status}
                                </span>
                              </td>
                              <td className="py-5">
                                <GlassButton variant="ghost" className="!p-2">
                                  <ChevronRight className="w-4 h-4" />
                                </GlassButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>

                  <div className="space-y-8">
                    <GlassCard>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Student Enrollment</h3>
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Full Identity Name</label>
                          <input className="w-full bg-white/40 border border-white/60 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-mint/50 font-bold text-slate-800 placeholder:text-slate-300 shadow-inner" placeholder="E.g. Sameer Khan" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Roll Identifier</label>
                            <input className="w-full bg-white/40 border border-white/60 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-mint/50 font-bold text-slate-800 placeholder:text-slate-300 shadow-inner" placeholder="#0000" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Academic Class</label>
                            <select className="w-full bg-white/40 border border-white/60 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand-mint/50 appearance-none font-bold text-slate-800 shadow-inner">
                              <option>XII-A</option>
                              <option>XII-B</option>
                              <option>XI-A</option>
                            </select>
                          </div>
                        </div>
                        <GlassButton variant="mint" className="w-full py-4 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-mint/10">
                          Register Entry
                        </GlassButton>
                      </div>
                    </GlassCard>

                    <GlassCard className="bg-brand-orange/5 border-brand-orange/20">
                      <div className="flex items-center gap-3 mb-6">
                         <LayoutGrid className="w-5 h-5 text-brand-orange" />
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Curriculum Mapping</h3>
                      </div>
                      <div className="space-y-2">
                        {['Advanced Calculus', 'Quantum Mechanics', 'Organic Chemistry'].map(course => (
                          <div key={course} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/60 hover:border-brand-orange/40 cursor-pointer transition-all shadow-sm">
                            <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">{course}</span>
                            <Users className="w-3.5 h-3.5 text-slate-300" />
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- Footer --- */}
            <footer className="mt-12 bg-slate-900 overflow-hidden rounded-3xl relative shadow-2xl">
              <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h4 className="font-display font-black text-xl mb-1 text-white uppercase italic italic">Academy of Excellence <span className="text-brand-mint">A.O.E</span></h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Integrated Learning Environment</p>
                </div>
                <div className="flex items-center gap-10 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                  <div className="flex flex-col items-center md:items-end">
                    <span className="text-slate-600 mb-1 font-bold">Campus Location</span>
                    <span className="text-white">SAHARSA, BIHAR</span>
                  </div>
                  <div className="flex flex-col items-center md:items-end">
                    <span className="text-slate-600 mb-1 font-bold">System Engineer</span>
                    <span className="text-emerald-400 font-extrabold italic">AJAZ-SOFTWARE</span>
                  </div>
                </div>
              </div>
              <div className="bg-black/20 border-t border-white/5 py-3 px-8 flex justify-center items-center">
                 <p className="text-[9px] font-black tracking-[0.5em] text-slate-500 uppercase">
                    &copy; 2024 AOE SYSTEMS • SECURE ACADEMIC GATEWAY
                 </p>
              </div>
            </footer>

            {/* --- ChatBot --- */}
            {view === 'dashboard' && (
              <ChatBot 
                studentData={{
                  name: 'Ajaz',
                  class: 'XII-A',
                  roll: '#1821',
                  attendance: '92%',
                  rank: '#04'
                }} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
