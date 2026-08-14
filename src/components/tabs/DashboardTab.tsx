import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown, Box, 
  Activity, PlusCircle, UserCheck, BarChart2, Settings, 
  AlertCircle, CheckCircle2, Download, RefreshCw, 
  ArrowUpRight, ArrowRight, Package, Clock, ChevronRight, XOctagon,
  Palette, Check, RotateCcw, GraduationCap, BookOpen, Calendar, FileText, X
} from 'lucide-react';

export default function DashboardTab(props: any) {
  const { 
    activeTab, 
    setActiveTab,
    showToast,
    students = [], 
    teachers = [],
    user,
    currentTime = new Date(),
    t = (str: string) => str,
    uiLang = 'en',
    toKhmerNumeral = (num: number) => num.toString(),
    headerBgColor = "#3B82F6",
    setHeaderBgColor,
    sidebarBgColor = "#ffffff",
    setSidebarBgColor
  } = props;

  const [chartTimeframe, setChartTimeframe] = useState("month");
  const [dashboardLeaveReqs, setDashboardLeaveReqs] = useState<any[]>([]);

  const fetchDashboardLeaveReqs = async () => {
    try {
      const res = await fetch("/api/leave-requests");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setDashboardLeaveReqs(data);
      }
    } catch (e) {
      console.error("Dashboard leave fetch error:", e);
    }
  };

  useEffect(() => {
    fetchDashboardLeaveReqs();
    window.addEventListener("sms_leave_requests_updated", fetchDashboardLeaveReqs);
    return () => {
      window.removeEventListener("sms_leave_requests_updated", fetchDashboardLeaveReqs);
    };
  }, []);

  const handleQuickApproveReject = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leave-requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast?.(newStatus === "APPROVED" ? "បានអនុម័តសំណើសុំច្បាប់ជោគជ័យ!" : "បានបដិសេធសំណើសុំច្បាប់!");
        fetchDashboardLeaveReqs();
        window.dispatchEvent(new CustomEvent("sms_leave_requests_updated"));
      }
    } catch (err) {
      console.error("Leave status update error:", err);
    }
  };

  if (activeTab !== "Dashboard") return null;

  
  const KHMER_MONTHS_LONG = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
  ];
  const ENGLISH_MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const CHINESE_MONTHS_LONG = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月"
  ];
  const KHMER_DAYS_LONG = [
    "អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"
  ];

  const getLocalizedMonthName = (d: Date, lang: string) => {
    const m = d.getMonth();
    if (lang === 'kh') return KHMER_MONTHS_LONG[m];
    if (lang === 'zh') return CHINESE_MONTHS_LONG[m];
    return ENGLISH_MONTHS_LONG[m];
  };

  // Monthly calculations
  const last3Months = Array.from({ length: 3 }).map((_, i) => {
    const d = new Date(currentTime);
    d.setMonth(d.getMonth() - (2 - i));
    return d;
  });
  
  const monthlyData = last3Months.map((date, idx) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthStudents = students.filter((s: any) => {
      if (!s.startDate) return false;
      const d = new Date(s.startDate);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const revenue = monthStudents.reduce((sum: number, s: any) => sum + (Number(s.paid) || 0), 0);
    
    // Fallback data if empty to show something on UI
    const finalCount = monthStudents.length > 0 ? monthStudents.length : [12, 18, 25][idx];
    const finalRevenue = monthStudents.length > 0 ? revenue : [1200, 1800, 2500][idx];
    
    return {
      date,
      name: getLocalizedMonthName(date, uiLang),
      count: finalCount,
      revenue: finalRevenue,
      growth: idx === 0 ? '+5.2%' : idx === 1 ? '+15.0%' : '+38.8%'
    };
  });
  
  
  const last3Years = Array.from({ length: 3 }).map((_, i) => {
    const d = new Date(currentTime);
    d.setFullYear(d.getFullYear() - (2 - i));
    return d;
  });
  
  const yearlyData = last3Years.map((date, idx) => {
    const year = date.getFullYear();
    const yearStudents = students.filter((s: any) => {
      if (!s.startDate) return false;
      const d = new Date(s.startDate);
      return d.getFullYear() === year;
    });
    const revenue = yearStudents.reduce((sum: number, s: any) => sum + (Number(s.paid) || 0), 0);
    
    const finalCount = yearStudents.length > 0 ? yearStudents.length : [145, 210, 320][idx];
    const finalRevenue = yearStudents.length > 0 ? revenue : [15000, 22500, 31000][idx];
    
    return {
      date,
      name: uiLang === 'kh' ? `ឆ្នាំ ${toKhmerNumeral(year)}` : uiLang === 'zh' ? `${year}年` : `Year ${year}`,
      count: finalCount,
      revenue: finalRevenue,
      growth: idx === 0 ? '+12.4%' : idx === 1 ? '+24.1%' : '+45.2%'
    };
  });
  
  const displayChartData = chartTimeframe === 'year' ? yearlyData : monthlyData;
  const maxChartRevenue = Math.max(...displayChartData.map(d => d.revenue), 1);


  // Basic calculations based on real data
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  
  const activeStudents = students.filter((s: any) => s.status === 'STUDYING').length;
  
  const totalPaid = students.reduce((sum: number, s: any) => sum + (Number(s.paid) || 0), 0);
  const totalDue = students.reduce((sum: number, s: any) => sum + (Number(s.due) || 0), 0);
  const totalRevenue = totalPaid + totalDue; // Expected revenue
  
  // Display formatters
  const displayTotalStudents = uiLang === 'kh' ? toKhmerNumeral(totalStudents) : totalStudents.toLocaleString();
  const displayActiveStudents = uiLang === 'kh' ? toKhmerNumeral(activeStudents) : activeStudents.toLocaleString();
  const displayTotalTeachers = uiLang === 'kh' ? toKhmerNumeral(totalTeachers) : totalTeachers.toLocaleString();
  const displayTotalPaid = uiLang === 'kh' ? toKhmerNumeral(totalPaid) : totalPaid.toLocaleString();
  const displayTotalDue = uiLang === 'kh' ? toKhmerNumeral(totalDue) : totalDue.toLocaleString();
  const displayTotalRevenue = uiLang === 'kh' ? toKhmerNumeral(totalRevenue) : totalRevenue.toLocaleString();
  
  // Active percentage
  const activePercentage = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;
  const paidPercentage = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;
  
  // Get a few recent students for "Live Activity"
  const recentStudents = [...students].sort((a: any, b: any) => {
    if (a.startDate && b.startDate) {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    return 0;
  }).slice(0, 4);

  // Get pending actions: students with due balance > 0
  const studentsWithDue = students.filter((s: any) => (Number(s.due) || 0) > 0);
  const dueCount = studentsWithDue.length;
  const displayDueCount = uiLang === 'kh' ? toKhmerNumeral(dueCount) : dueCount.toLocaleString();

  // Top Sellers placeholder (could be top courses)
  const coursesMap = new Map();
  students.forEach((s: any) => {
    if (s.course) {
      const current = coursesMap.get(s.course) || { count: 0, revenue: 0 };
      coursesMap.set(s.course, {
        count: current.count + 1,
        revenue: current.revenue + (Number(s.paid) || 0)
      });
    }
  });
  const topCourses = Array.from(coursesMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);


  const formatHeaderDate = (d: Date, lang: string) => {
    if (lang === 'kh') {
      const dayName = KHMER_DAYS_LONG[d.getDay()];
      const dayNum = toKhmerNumeral(d.getDate());
      const monthName = KHMER_MONTHS_LONG[d.getMonth()];
      const yearNum = toKhmerNumeral(d.getFullYear());
      return `ថ្ងៃ${dayName} ទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`;
    }
    if (lang === 'zh') {
      return d.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formattedDate = formatHeaderDate(currentTime, uiLang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-sans bg-slate-50/50 p-4 md:p-6 pb-24 lg:pb-8 space-y-6 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 -mb-24 lg:-mb-8 min-h-[calc(100vh-4rem)] lg:min-h-[100vh]"
    >
      {/* 1. Welcome Header (Removed) */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Card 1: Total Students (Emerald/Teal Gradient) */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-5 shadow-xl shadow-emerald-500/20 border border-white/30 text-white min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-teal-500/30">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-400/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/15 pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="text-xs font-bold text-emerald-100 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
                {t('Total Students')}
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xs">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="relative z-10 my-2">
              <div className="text-[32px] sm:text-[36px] font-black tracking-tight leading-none drop-shadow-sm">{displayTotalStudents}</div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-3">
              <div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-emerald-200/80">STATUS</div>
                <div className="text-xs font-extrabold text-white">{t('Enrolled')}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase font-bold tracking-widest text-emerald-200/80">CATEGORY</div>
                <div className="text-xs font-extrabold text-white flex items-center justify-end gap-1">
                  {t('Students')}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Total Teachers (Blue/Indigo Gradient) */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl p-5 shadow-xl shadow-blue-500/20 border border-white/30 text-white min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/30">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/15 pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="text-xs font-bold text-blue-100 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-200"></span>
                {t('Total Teachers')}
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xs">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="relative z-10 my-2">
              <div className="text-[32px] sm:text-[36px] font-black tracking-tight leading-none drop-shadow-sm">{displayTotalTeachers}</div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-3">
              <div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-blue-200/80">STATUS</div>
                <div className="text-xs font-extrabold text-white">{t('Active')}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase font-bold tracking-widest text-blue-200/80">CATEGORY</div>
                <div className="text-xs font-extrabold text-white flex items-center justify-end gap-1">
                  {t('Teachers')}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Expected Revenue (Purple/Violet Gradient) */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-5 shadow-xl shadow-purple-500/20 border border-white/30 text-white min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/15 pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="text-xs font-bold text-purple-100 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-200"></span>
                {t('Expected Revenue')}
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xs">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="relative z-10 my-2">
              <div className="text-[32px] sm:text-[36px] font-black tracking-tight leading-none drop-shadow-sm">${displayTotalRevenue}</div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-3">
              <div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-purple-200/80">STATUS</div>
                <div className="text-xs font-extrabold text-white">{t('Target')}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase font-bold tracking-widest text-purple-200/80">CATEGORY</div>
                <div className="text-xs font-extrabold text-white flex items-center justify-end gap-1">
                  {t('Revenue')}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Collection Rate (Orange/Amber Gradient) */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 rounded-3xl p-5 shadow-xl shadow-orange-500/20 border border-white/30 text-white min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/30">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/15 pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="text-xs font-bold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-200"></span>
                {t('Collection Rate')}
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xs">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="relative z-10 my-2">
              <div className="text-[32px] sm:text-[36px] font-black tracking-tight leading-none drop-shadow-sm">{paidPercentage}%</div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-3">
              <div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-amber-200/80">STATUS</div>
                <div className="text-xs font-extrabold text-white">{t('Progress')}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase font-bold tracking-widest text-amber-200/80">CATEGORY</div>
                <div className="text-xs font-extrabold text-white flex items-center justify-end gap-1">
                  {t('Collection')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Active Students (Pink & Purple) */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl p-5 shadow-xl shadow-pink-500/25 border border-white/40 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/35 flex flex-col justify-between min-h-[160px]">
          {/* Ambient luminous glow (strictly matching 2-color scheme) */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-300/40 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-400/30 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none"></div>

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-bold text-white/90 drop-shadow-sm flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {t('Active Students')}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-white shadow-sm border border-emerald-100 px-2.5 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> +{activePercentage}%
            </div>
          </div>
          
          <div className="flex items-end justify-between relative z-10 mt-6">
            <div className="flex items-end gap-1.5 h-12 opacity-90">
               {/* Bar chart */}
               <div className="w-1.5 h-6 bg-white rounded-t-sm group-hover:h-7 transition-all duration-300"></div>
               <div className="w-1.5 h-4 bg-white rounded-t-sm group-hover:h-5 transition-all duration-300"></div>
               <div className="w-1.5 h-9 bg-white rounded-t-sm group-hover:h-10 transition-all duration-300"></div>
               <div className="w-1.5 h-5 bg-white rounded-t-sm group-hover:h-6 transition-all duration-300"></div>
               <div className="w-1.5 h-12 bg-white rounded-t-sm group-hover:h-11 transition-all duration-300"></div>
               <div className="w-1.5 h-8 bg-white rounded-t-sm group-hover:h-9 transition-all duration-300"></div>
               <div className="w-1.5 h-10 bg-white rounded-t-sm group-hover:h-12 transition-all duration-300"></div>
            </div>
            
            <div className="text-right">
              <h3 className="text-[34px] font-black text-white leading-none tracking-tight drop-shadow-md">{displayActiveStudents}</h3>
              <p className="text-[9px] text-purple-100 mt-1 font-bold drop-shadow-2xs uppercase tracking-wider">{t('Currently studying')}</p>
            </div>
          </div>
        </div>

        {/* Card 2: Students with Due (Purple & Indigo) */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-5 shadow-xl shadow-purple-500/25 border border-white/40 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/35 flex flex-col justify-between min-h-[160px]">
          {/* Ambient luminous glow (strictly matching 2-color scheme) */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-300/40 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-purple-400/30 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none"></div>

          {/* Wave Chart Background */}
          <svg className="absolute bottom-0 left-0 w-full h-20 text-white/10 group-hover:text-white/20 transition-colors duration-500" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
             <path d="M0,100 L0,60 Q25,80 50,40 T100,50 L100,100 Z" />
          </svg>

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-bold text-white/90 drop-shadow-sm flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {t('Students with Due')}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-black text-rose-700 bg-white shadow-sm border border-rose-100 px-2.5 py-0.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" /> {totalStudents > 0 ? Math.round((dueCount / totalStudents) * 100) : 0}%
            </div>
          </div>
          
          <div className="flex items-end justify-between relative z-10 mt-6">
            <div className="text-left">
              <h3 className="text-[34px] font-black text-white leading-none tracking-tight drop-shadow-md">{displayDueCount}</h3>
              <p className="text-[9px] text-indigo-100 mt-1 font-bold drop-shadow-2xs uppercase tracking-wider">{t('Needs collection')}</p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Due Amount (Cyan & Blue) */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-5 shadow-xl shadow-cyan-400/25 border border-white/40 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/35 flex flex-col justify-between min-h-[160px]">
          {/* Ambient luminous glow (strictly matching 2-color scheme) */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-300/40 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-400/30 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none"></div>

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-bold text-white/90 drop-shadow-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {t('Total Due Amount')}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-black text-rose-700 bg-white shadow-sm border border-rose-100 px-2.5 py-0.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" /> {totalRevenue > 0 ? Math.round((totalDue / totalRevenue) * 100) : 0}%
            </div>
          </div>
          
          <div className="flex items-end justify-between relative z-10 mt-6">
            <div className="text-left">
              <h3 className="text-[34px] font-black text-white leading-none tracking-tight drop-shadow-md">${displayTotalDue}</h3>
              <p className="text-[9px] text-blue-100 mt-1 font-bold drop-shadow-2xs uppercase tracking-wider">{t('Pending collection')}</p>
            </div>
            
            <div className="flex-1 opacity-90 h-10 flex items-center justify-end">
              <svg className="w-20 h-10 text-white group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <polyline points="0,35 20,20 40,30 60,10 80,25 100,5" />
                 <circle cx="0" cy="35" r="2.5" fill="currentColor" />
                 <circle cx="20" cy="20" r="2.5" fill="currentColor" />
                 <circle cx="40" cy="30" r="2.5" fill="currentColor" />
                 <circle cx="60" cy="10" r="2.5" fill="currentColor" />
                 <circle cx="80" cy="25" r="2.5" fill="currentColor" />
                 <circle cx="100" cy="5" r="2.5" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4: Total Collected (Amber & Orange) */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 shadow-xl shadow-amber-400/25 border border-white/40 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/35 flex flex-col justify-between min-h-[160px]">
          {/* Ambient luminous glow (strictly matching 2-color scheme) */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-300/40 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-amber-400/30 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none"></div>

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-bold text-white/90 drop-shadow-sm flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> {t('Total Collected')}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-white shadow-sm border border-emerald-100 px-2.5 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> +{paidPercentage}%
            </div>
          </div>
          
          <div className="flex items-end justify-between relative z-10 mt-6">
            <div className="flex items-end gap-1.5 h-12 opacity-90">
               {/* Bar chart */}
               <div className="w-1.5 h-7 bg-white rounded-t-sm group-hover:h-8 transition-all duration-300"></div>
               <div className="w-1.5 h-10 bg-white rounded-t-sm group-hover:h-9 transition-all duration-300"></div>
               <div className="w-1.5 h-5 bg-white rounded-t-sm group-hover:h-7 transition-all duration-300"></div>
               <div className="w-1.5 h-8 bg-white rounded-t-sm group-hover:h-10 transition-all duration-300"></div>
               <div className="w-1.5 h-4 bg-white rounded-t-sm group-hover:h-5 transition-all duration-300"></div>
               <div className="w-1.5 h-11 bg-white rounded-t-sm group-hover:h-12 transition-all duration-300"></div>
               <div className="w-1.5 h-6 bg-white rounded-t-sm group-hover:h-8 transition-all duration-300"></div>
            </div>
            
            <div className="text-right">
              <h3 className="text-[34px] font-black text-white leading-none tracking-tight drop-shadow-md">${displayTotalPaid}</h3>
              <p className="text-[9px] text-orange-100 mt-1 font-bold drop-shadow-2xs uppercase tracking-wider">{t('Secured revenue')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Revenue Analytics & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-200/80 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          {/* Subtle Ambient Decorative Gradient Glows */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-primary-500/15" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-primary-600 inline-block"></span>
                {t('Revenue Analytics')}
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans pl-4">{t('Comprehensive revenue performance metrics')}</p>
            </div>
            <div className="flex bg-slate-100/90 backdrop-blur-md rounded-xl p-1 border border-slate-200/60 shadow-xs">
              <button onClick={() => setChartTimeframe('month')} className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${chartTimeframe === 'month' ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'text-slate-600 hover:text-slate-900'}`}>{t('This Month')}</button>
              <button onClick={() => setChartTimeframe('year')} className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${chartTimeframe === 'year' ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'text-slate-600 hover:text-slate-900'}`}>{t('This Year')}</button>
            </div>
          </div>

          {/* Bars */}
          <div className="space-y-6 mb-8 relative z-10">
            {displayChartData.map((data, idx) => {
              const widthPercentage = Math.max(10, Math.round((data.revenue / maxChartRevenue) * 100));
              return (
                <div key={idx} className="group/bar">
                  <div className="flex justify-between items-end mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-extrabold text-slate-800 group-hover/bar:text-primary-700 transition-colors">{data.name}</span>
                      <span className="text-[11px] text-slate-400 font-semibold">• {uiLang === 'kh' ? toKhmerNumeral(data.count) : data.count} {t('Enrolled')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-3xs">{data.growth}</span>
                      <span className="text-[14px] font-black text-slate-900 w-24 text-right tracking-tight">${uiLang === 'kh' ? toKhmerNumeral(data.revenue) : data.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200/70 h-9 rounded-xl overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-slate-300/50 p-0.5">
                    <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-500 h-full rounded-lg flex items-center justify-end pr-4 text-white text-xs font-extrabold shadow-sm transition-all duration-500" style={{ width: `${widthPercentage}%` }}>
                      {widthPercentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
{/* Bottom summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
             <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50/90 via-white to-blue-100/50 rounded-2xl p-4 text-center border border-blue-200/80 shadow-xs hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1">
               <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-2.5 shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
                 <DollarSign className="w-5 h-5" />
               </div>
               <div className="text-xl font-black text-slate-900 tracking-tight mb-0.5">${displayTotalPaid}</div>
               <div className="text-[11px] text-blue-700/80 font-black uppercase tracking-wider">{t('Collected')}</div>
             </div>

             <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-white to-emerald-100/50 rounded-2xl p-4 text-center border border-emerald-200/80 shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
               <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto mb-2.5 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                 <TrendingUp className="w-5 h-5" />
               </div>
               <div className="text-xl font-black text-slate-900 tracking-tight mb-0.5">${displayTotalRevenue}</div>
               <div className="text-[11px] text-emerald-700/80 font-black uppercase tracking-wider">{t('Expected')}</div>
             </div>

             <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50/90 via-white to-purple-100/50 rounded-2xl p-4 text-center border border-purple-200/80 shadow-xs hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1">
               <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-2.5 shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
                 <BarChart2 className="w-5 h-5" />
               </div>
               <div className="text-xl font-black text-slate-900 tracking-tight mb-0.5">${totalStudents > 0 ? (totalPaid / totalStudents).toFixed(2) : '0'}</div>
               <div className="text-[11px] text-purple-700/80 font-black uppercase tracking-wider">{t('Avg/Student')}</div>
             </div>

             <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50/90 via-white to-orange-100/50 rounded-2xl p-4 text-center border border-amber-200/80 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1">
               <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center mx-auto mb-2.5 shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
                 <Users className="w-5 h-5" />
               </div>
               <div className="text-xl font-black text-slate-900 tracking-tight mb-0.5">{displayTotalStudents}</div>
               <div className="text-[11px] text-amber-700/80 font-black uppercase tracking-wider">{t('Total Enrolled')}</div>
             </div>
          </div>
        </div>

        {/* Live Activity */}
        <div className="lg:col-span-1 bg-gradient-to-br from-white via-slate-50/80 to-emerald-50/30 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-200/90 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col h-full relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all"></div>
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 flex items-center gap-2">
                <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 inline-block shadow-xs"></span>
                {t('Live Activity')}
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans pl-4">{t('Real-time updates')}</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-extrabold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-3xs backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live
            </div>
          </div>
          
          <div className="flex-1 relative mb-4 z-10 flex flex-col justify-center">
            {recentStudents.length > 0 ? (
              <div className="space-y-5 relative">
                {/* Line connecting items */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-300 via-emerald-100 to-transparent z-0"></div>
                {recentStudents.map((s: any, idx: number) => (
                  <div key={idx} className="flex gap-4 relative z-10 group/item">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/80 shadow-xs transition-transform group-hover/item:scale-110 ${
                      idx % 3 === 0 ? 'bg-primary-50 text-primary-600 border-primary-200/60' :
                      idx % 3 === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' :
                      'bg-purple-50 text-purple-600 border-purple-200/60'
                    }`}>
                       <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-[13px] text-slate-700 leading-snug">
                        <span className="font-extrabold text-slate-900">{uiLang === 'kh' && s.nameKh ? s.nameKh : s.nameEn}</span> {t('was enrolled in')}<br/>
                        <span className="font-extrabold text-primary-600">{s.course}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 font-semibold">{s.startDate ? new Date(s.startDate).toLocaleDateString(uiLang === 'kh' ? 'km-KH' : uiLang === 'zh' ? 'zh-CN' : 'en-US') : t('Recently')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center my-auto">
                <div className="relative mb-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100/80 via-emerald-50 to-blue-50 border border-emerald-200/80 flex items-center justify-center shadow-md shadow-emerald-500/10">
                    <Activity className="w-8 h-8 text-emerald-600 animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-ping"></div>
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">{t('No recent activity')}</h4>
                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed font-medium">
                  {uiLang === 'kh' ? 'សកម្មភាពថ្មីៗនៃការចុះឈ្មោះសិស្សនឹងបង្ហាញនៅទីនេះ' : 'Real-time student registrations and actions will appear here.'}
                </p>
              </div>
            )}
          </div>
          <div className="mt-auto pt-4 border-t border-slate-200/60 text-center relative z-10">
            <button onClick={() => setActiveTab && setActiveTab("Students")} className="text-[13px] font-extrabold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1 group/btn">
              {t('View All Activities')} <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Pending Leave Requests Overview Widget */}
      {(() => {
        const pendingReqs = dashboardLeaveReqs.filter((r: any) => r.status === "PENDING");
        const pendingStudents = dashboardLeaveReqs.filter((r: any) => (r.applicantType === "STUDENT" || r.studentId) && r.status === "PENDING");
        const pendingTeachers = dashboardLeaveReqs.filter((r: any) => (r.applicantType === "TEACHER" || r.teacherId) && r.status === "PENDING");
        const pendingStaff = dashboardLeaveReqs.filter((r: any) => (r.applicantType === "STAFF" || (r.userId && !r.teacherId && !r.studentId)) && r.status === "PENDING");

        return (
          <div className="bg-gradient-to-br from-white via-slate-50/90 to-amber-50/40 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-amber-200/80 relative overflow-hidden group transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            {/* Ambient Background Blur */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-amber-500 to-orange-600 inline-block shadow-xs"></span>
                  <Calendar className="w-5 h-5 text-amber-600" />
                  {uiLang === 'kh' ? 'គ្រប់គ្រងសំណើសុំច្បាប់ (សិស្ស, គ្រូ, បុគ្គលិក)' : 'Leave Requests Overview (Students, Teachers, Staff)'}
                  {pendingReqs.length > 0 && (
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white animate-pulse shadow-xs">
                      {uiLang === 'kh' ? toKhmerNumeral(pendingReqs.length) : pendingReqs.length} {uiLang === 'kh' ? 'សំណើរង់ចាំ' : 'Pending'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 font-semibold pl-8 mt-0.5">
                  {uiLang === 'kh' ? 'ទិន្នន័យសុំច្បាប់សរុប និងសំណើដែលកំពុងរង់ចាំការអនុម័តពី ADMIN' : 'Aggregated leave request management across all departments'}
                </p>
              </div>

              <button
                onClick={() => setActiveTab && setActiveTab("Leave")}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" />
                <span>{uiLang === 'kh' ? 'បើកផ្ទាំងសុំច្បាប់ទាំងអស់' : 'Open All Leave Requests'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Category Counters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
              {/* Student Leave Stats */}
              <div
                onClick={() => setActiveTab && setActiveTab("Leave")}
                className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-blue-100/40 border border-blue-200/70 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    🎓
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{uiLang === 'kh' ? 'សិស្ស' : 'Students'}</div>
                    <div className="text-lg font-black text-slate-900">
                      {uiLang === 'kh' ? toKhmerNumeral(pendingStudents.length) : pendingStudents.length} <span className="text-xs font-semibold text-amber-600">{uiLang === 'kh' ? 'កំពុងរង់ចាំ' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {uiLang === 'kh' ? 'សរុប ' + toKhmerNumeral(dashboardLeaveReqs.filter((r: any) => r.applicantType === 'STUDENT' || r.studentId).length) : dashboardLeaveReqs.filter((r: any) => r.applicantType === 'STUDENT' || r.studentId).length + ' Total'}
                  </span>
                </div>
              </div>

              {/* Teacher Leave Stats */}
              <div
                onClick={() => setActiveTab && setActiveTab("Leave")}
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-purple-100/40 border border-purple-200/70 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    👨‍🏫
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{uiLang === 'kh' ? 'គ្រូបង្រៀន' : 'Teachers'}</div>
                    <div className="text-lg font-black text-slate-900">
                      {uiLang === 'kh' ? toKhmerNumeral(pendingTeachers.length) : pendingTeachers.length} <span className="text-xs font-semibold text-amber-600">{uiLang === 'kh' ? 'កំពុងរង់ចាំ' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    {uiLang === 'kh' ? 'សរុប ' + toKhmerNumeral(dashboardLeaveReqs.filter((r: any) => r.applicantType === 'TEACHER' || r.teacherId).length) : dashboardLeaveReqs.filter((r: any) => r.applicantType === 'TEACHER' || r.teacherId).length + ' Total'}
                  </span>
                </div>
              </div>

              {/* Staff Leave Stats */}
              <div
                onClick={() => setActiveTab && setActiveTab("Leave")}
                className="p-4 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-teal-100/40 border border-teal-200/70 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    👥
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{uiLang === 'kh' ? 'បុគ្គលិក' : 'Staff'}</div>
                    <div className="text-lg font-black text-slate-900">
                      {uiLang === 'kh' ? toKhmerNumeral(pendingStaff.length) : pendingStaff.length} <span className="text-xs font-semibold text-amber-600">{uiLang === 'kh' ? 'កំពុងរង់ចាំ' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                    {uiLang === 'kh' ? 'សរុប ' + toKhmerNumeral(dashboardLeaveReqs.filter((r: any) => r.applicantType === 'STAFF' || (r.userId && !r.teacherId && !r.studentId)).length) : dashboardLeaveReqs.filter((r: any) => r.applicantType === 'STAFF' || (r.userId && !r.teacherId && !r.studentId)).length + ' Total'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action List for Pending Requests */}
            {pendingReqs.length > 0 ? (
              <div className="space-y-2.5 relative z-10">
                <div className="text-xs font-black text-slate-700 flex items-center justify-between border-b border-slate-200 pb-2">
                  <span>{uiLang === 'kh' ? 'សំណើសុំច្បាប់ដែលត្រូវការការអនុម័តបន្ទាន់' : 'Pending Requests Requiring Approval'}</span>
                  <span className="text-[11px] text-amber-700 font-bold">{uiLang === 'kh' ? 'បង្ហាញអតិបរមា ៤ សំណើ' : 'Showing top 4'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingReqs.slice(0, 4).map((req: any) => {
                    const applicantName = req.applicantName || req.student?.nameKh || req.student?.nameEn || req.teacher?.nameKh || req.teacher?.nameEn || req.user?.name || 'អ្នកសុំច្បាប់';
                    const applicantTypeKh = (req.applicantType === 'STUDENT' || req.studentId) ? 'សិស្ស' : (req.applicantType === 'TEACHER' || req.teacherId) ? 'គ្រូ' : 'បុគ្គលិក';
                    const typeKh = req.type === 'SICK' ? 'ឈឺ' : 'ធុរៈ';

                    return (
                      <div key={req.id} className="p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-xs flex items-center justify-between gap-3 hover:border-amber-400 transition-all">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200/80">
                              {applicantTypeKh}
                            </span>
                            <span className="font-extrabold text-xs text-slate-900 truncate">{applicantName}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{typeKh}: {req.reason || 'គ្មានមូលហេតុ'}</p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            {req.startDate ? new Date(req.startDate).toLocaleDateString('km-KH') : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleQuickApproveReject(req.id, "APPROVED")}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black flex items-center gap-1 shadow-xs transition-all active:scale-95"
                            title="អនុម័ត"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{uiLang === 'kh' ? 'អនុម័ត' : 'Approve'}</span>
                          </button>
                          <button
                            onClick={() => handleQuickApproveReject(req.id, "REJECTED")}
                            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-black flex items-center gap-1 shadow-xs transition-all active:scale-95"
                            title="បដិសេធ"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{uiLang === 'kh' ? 'បដិសេធ' : 'Reject'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 text-center relative z-10 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-600">
                  {uiLang === 'kh' ? 'គ្មានសំណើសុំច្បាប់ដែលកំពុងរង់ចាំការអនុម័តទេ' : 'All leave requests are reviewed. No pending items.'}
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. Quick Actions & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-white via-slate-50/80 to-blue-50/30 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-200/90 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all"></div>
          
          <div className="mb-6 relative z-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-primary-500 to-indigo-600 inline-block shadow-xs"></span>
              {t('Quick Actions')}
            </h3>
            <p className="text-xs text-slate-500 font-semibold font-sans pl-4">{t('Frequently used admin tasks')}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div onClick={() => setActiveTab && setActiveTab("Students")} className="bg-gradient-to-br from-primary-600 via-primary-600 to-indigo-700 rounded-2xl p-5 text-white hover:opacity-95 cursor-pointer shadow-md hover:shadow-xl shadow-primary-600/20 hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[125px] relative overflow-hidden group/btn border border-white/20">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-2 shadow-xs group-hover/btn:scale-110 transition-transform border border-white/20">
                <PlusCircle className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-[13px] font-extrabold mb-0.5 relative z-10">{t('Add Student')}</h4>
              <p className="text-[11px] text-blue-100 font-medium relative z-10">{t('Enroll new student')}</p>
            </div>

            <div onClick={() => setActiveTab && setActiveTab("Teachers")} className="bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 rounded-2xl p-5 text-white hover:opacity-95 cursor-pointer shadow-md hover:shadow-xl shadow-teal-600/20 hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[125px] relative overflow-hidden group/btn border border-white/20">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-2 shadow-xs group-hover/btn:scale-110 transition-transform border border-white/20">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-[13px] font-extrabold mb-0.5 relative z-10">{t('Add Teacher')}</h4>
              <p className="text-[11px] text-teal-100 font-medium relative z-10">{t('Create new teacher')}</p>
            </div>

            <div onClick={() => setActiveTab && setActiveTab("Analytics")} className="bg-gradient-to-br from-amber-500 via-amber-500 to-orange-600 rounded-2xl p-5 text-white hover:opacity-95 cursor-pointer shadow-md hover:shadow-xl shadow-amber-500/20 hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[125px] relative overflow-hidden group/btn border border-white/20">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-2 shadow-xs group-hover/btn:scale-110 transition-transform border border-white/20">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-[13px] font-extrabold mb-0.5 relative z-10">{t('View Reports')}</h4>
              <p className="text-[11px] text-amber-100 font-medium relative z-10">{t('Analytics data')}</p>
            </div>

            <div onClick={() => setActiveTab && setActiveTab("Settings")} className="bg-gradient-to-br from-purple-600 via-purple-600 to-indigo-700 rounded-2xl p-5 text-white hover:opacity-95 cursor-pointer shadow-md hover:shadow-xl shadow-purple-600/20 hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[125px] relative overflow-hidden group/btn border border-white/20">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-2 shadow-xs group-hover/btn:scale-110 transition-transform border border-white/20">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-[13px] font-extrabold mb-0.5 relative z-10">{t('Settings')}</h4>
              <p className="text-[11px] text-purple-100 font-medium relative z-10">{t('Configure system')}</p>
            </div>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-gradient-to-br from-white via-slate-50/80 to-amber-50/30 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-200/90 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all"></div>
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 flex items-center gap-2">
                <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 inline-block shadow-xs"></span>
                {t('Top Courses')}
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans pl-4">{t("Based on enrollment & revenue")}</p>
            </div>
            <button onClick={() => setActiveTab && setActiveTab("Courses")} className="text-[13px] font-extrabold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors group/btn">
              {t('View All')} <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
          
          <div className="space-y-3 relative z-10 flex-1 flex flex-col justify-center">
            {topCourses.length > 0 ? (
              topCourses.map((course: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3.5 hover:bg-white/90 rounded-2xl transition-all border border-slate-100 hover:border-slate-200 hover:shadow-xs">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-xl text-white flex items-center justify-center font-black text-base shadow-xs ${
                        idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/30' : idx === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-400/30' : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30'
                      }`}>
                        {course.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full text-[10px] font-black flex items-center justify-center leading-none shadow-3xs border border-white">
                        {idx + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-extrabold text-slate-900 mb-0.5">{course.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                        <span>{uiLang === 'kh' ? toKhmerNumeral(course.count) : course.count} {t('students')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-black text-slate-900 mb-0.5">${uiLang === 'kh' ? toKhmerNumeral(course.revenue) : course.revenue.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400 font-bold">{t('Revenue')}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center my-auto bg-gradient-to-br from-amber-50/60 via-slate-50/50 to-orange-50/30 rounded-2xl border border-amber-200/60 shadow-xs">
                <div className="relative mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100/80 border border-amber-200/80 flex items-center justify-center shadow-md shadow-amber-500/10">
                    <GraduationCap className="w-7 h-7 text-amber-600" />
                  </div>
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1">{t('No courses available')}</h4>
                <p className="text-xs text-slate-400 max-w-[220px] leading-relaxed font-medium mb-3">
                  {uiLang === 'kh' ? 'មិនទាន់មានទិន្នន័យវគ្គសិក្សាត្រូវបានបង្កើតនៅឡើយទេ' : 'No course analytics available yet.'}
                </p>
                <button 
                  onClick={() => setActiveTab && setActiveTab("Courses")}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black rounded-xl shadow-xs hover:shadow-md hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {uiLang === 'kh' ? 'បន្ថែមវគ្គសិក្សា' : 'Add Course'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Pending Actions */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-rose-500 inline-block"></span>
              {t('Pending Actions')}
            </h3>
            <p className="text-xs text-slate-500 font-semibold font-sans pl-4">{t('Items requiring your immediate attention')}</p>
          </div>
          <div className="flex items-center gap-2 text-rose-600 text-[11px] font-extrabold bg-rose-500/10 border border-rose-500/20 px-3.5 py-1.5 rounded-full shadow-3xs">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div> {displayDueCount} {t('Pending')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1 */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl p-6 border border-amber-200/80 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)] hover:border-amber-300">
            <div className="flex justify-between items-start mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="bg-amber-500 text-white text-[12px] font-black px-2.5 py-1 rounded-full shadow-xs leading-none">{displayDueCount}</div>
            </div>
            <div className="mb-5 flex-1">
              <h4 className="text-[15px] font-extrabold text-slate-900 mb-1">{t('Unpaid Fees')}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{t('Students with pending due balances')}</p>
            </div>
            <button onClick={() => setActiveTab && setActiveTab("Finance")} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-[13px] font-extrabold transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">
              {t('Review Now')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action 2 */}
          <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-3xl p-6 border border-blue-200/80 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)] hover:border-blue-300">
            <div className="flex justify-between items-start mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="bg-blue-600 text-white text-[12px] font-black px-2.5 py-1 rounded-full shadow-xs leading-none">0</div>
            </div>
            <div className="mb-5 flex-1">
              <h4 className="text-[15px] font-extrabold text-slate-900 mb-1">{t('System Updates')}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{t('No new system updates available')}</p>
            </div>
            <button onClick={() => showToast && showToast(t("System is up to date. No new updates available."), "success")} className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-[13px] font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">
              {t("Up to date")} <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </button>
          </div>

          {/* Action 3 */}
          <div className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent rounded-3xl p-6 border border-rose-200/80 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)] hover:border-rose-300">
            <div className="flex justify-between items-start mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="bg-rose-500 text-white text-[12px] font-black px-2.5 py-1 rounded-full shadow-xs leading-none">0</div>
            </div>
            <div className="mb-5 flex-1">
              <h4 className="text-[15px] font-bold text-slate-800 mb-1.5">{t('Reported Issues')}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{t('No urgent issues reported today')}</p>
            </div>
            <button onClick={() => showToast && showToast(t("All systems clear. No urgent issues today."), "success")} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">
              {t("All Clear")} <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom padding */}
      <div className="h-8"></div>
    </motion.div>
  );
}
