import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Check, X, CalendarRange, Clock, User, Filter, 
  Search, ChevronDown, Briefcase, Stethoscope, AlignLeft, 
  Calendar, CalendarDays, AlertCircle, Sparkles, Trash2,
  GraduationCap, UserCheck, Users, PhoneCall, CheckCircle2,
  XCircle, Clock3
} from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';

interface LeaveRequestsTabProps {
  uiLang?: string;
}

export default function LeaveRequestsTab({ uiLang }: LeaveRequestsTabProps) {
  const [localLang, setLocalLang] = useState(uiLang || localStorage.getItem("plc_lang") || "kh");

  useEffect(() => {
    if (uiLang) {
      setLocalLang(uiLang);
    }
  }, [uiLang]);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setLocalLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  const localIdt = (kh: string, en?: string) => {
    if (localLang === "en") return en || kh;
    return kh;
  };

  const [requests, setRequests] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteTargetReq, setDeleteTargetReq] = useState<any | null>(null);
  
  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'STAFF'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    applicantType: 'STUDENT' as 'STUDENT' | 'TEACHER' | 'STAFF',
    applicantId: '',
    applicantName: '',
    applicantCode: '',
    type: 'SICK',
    startDate: '',
    endDate: '',
    reason: '',
    guardianPhone: ''
  });

  const [applicantSearch, setApplicantSearch] = useState('');
  const [isApplicantDropdownOpen, setIsApplicantDropdownOpen] = useState(false);
  const applicantDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (applicantDropdownRef.current && !applicantDropdownRef.current.contains(event.target as Node)) {
        setIsApplicantDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
    window.addEventListener("sms_leave_requests_updated", fetchData);
    return () => {
      window.removeEventListener("sms_leave_requests_updated", fetchData);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const safeFetchObj = async (url: string) => {
        try {
          const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) return { data: [] };
          const text = await res.text();
          try {
            return { data: JSON.parse(text) };
          } catch {
            return { data: [] };
          }
        } catch {
          return { data: [] };
        }
      };

      const [requestsRes, teachersRes, studentsRes] = await Promise.all([
        safeFetchObj('/api/leave-requests'),
        safeFetchObj('/api/teachers'),
        safeFetchObj('/api/students')
      ]);

      let deletedIds: string[] = [];
      try {
        const stored = localStorage.getItem("plc_deleted_leave_requests");
        if (stored) deletedIds = JSON.parse(stored);
      } catch (e) {}

      let reqList = Array.isArray(requestsRes.data) ? requestsRes.data : [];
      
      // Initial default dummy data if server has zero requests
      if (reqList.length === 0) {
        reqList = [
          {
            id: 'lr-demo-1',
            applicantType: 'STUDENT',
            applicantName: 'ជូ លីណាន',
            applicantCode: 'STU-26-001',
            type: 'SICK',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            reason: 'មានអាការៈគ្រុនក្តៅ និងឈឺក្បាល ត្រូវការសម្រាក និងលេបថ្នាំ',
            guardianPhone: '087 850 014',
            status: 'PENDING',
            createdAt: new Date().toISOString()
          },
          {
            id: 'lr-demo-2',
            applicantType: 'TEACHER',
            applicantName: 'ហ៊ន សុខុម',
            applicantCode: 'TCH-26-001',
            type: 'PERSONAL',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            reason: 'មានធុរៈផ្ទាល់ខ្លួនចាំបាច់នៅស្រុកកំណើត',
            guardianPhone: '012 345 678',
            status: 'PENDING',
            createdAt: new Date().toISOString()
          },
          {
            id: 'lr-demo-3',
            applicantType: 'STAFF',
            applicantName: 'សាន សុខា',
            applicantCode: 'STF-26-002',
            type: 'SICK',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            reason: 'សុំច្បាប់ជួបគ្រូពេទ្យពិនិត្យសុខភាពประจำឆ្នាំ',
            guardianPhone: '098 765 432',
            status: 'APPROVED',
            createdAt: new Date().toISOString()
          }
        ];
      }

      reqList = reqList.filter(item => item && !deletedIds.includes(item.id));
      setRequests(reqList);

      const teachersList = teachersRes.data && Array.isArray(teachersRes.data.teachers) 
        ? teachersRes.data.teachers 
        : (Array.isArray(teachersRes.data) ? teachersRes.data : []);
      setTeachers(teachersList);

      const studentsList = studentsRes.data && Array.isArray(studentsRes.data.students) 
        ? studentsRes.data.students 
        : (Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setStudents(studentsList);

    } catch (error) {
      console.warn("Notice: Leave requests fetch fallback:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDateError = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return false;
    return new Date(formData.endDate) < new Date(formData.startDate);
  }, [formData.startDate, formData.endDate]);

  const totalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate || isDateError) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [formData.startDate, formData.endDate, isDateError]);

  // Applicants available for current selected category in modal form
  const availableApplicants = useMemo(() => {
    const query = applicantSearch.toLowerCase();
    if (formData.applicantType === 'STUDENT') {
      return students.filter(Boolean)
        .filter(s => {
          const nameKh = (s.nameKh || `${s.lastNameKh || ''} ${s.firstNameKh || ''}`).toLowerCase();
          const nameEn = (s.nameEn || `${s.lastNameEn || ''} ${s.firstNameEn || ''}`).toLowerCase();
          const code = (s.studentId || s.id || '').toLowerCase();
          return nameKh.includes(query) || nameEn.includes(query) || code.includes(query);
        })
        .map(s => ({
          id: s.id,
          code: s.studentId || `STU-${s.id.substring(0, 6)}`,
          name: s.nameKh || `${s.lastNameKh || ''} ${s.firstNameKh || ''}`.trim() || s.nameEn || 'សិស្ស',
          phone: s.guardianPhone || s.phoneNumber || '',
          detail: s.course ? `${s.course} ${s.level || ''}`.trim() : 'ថ្នាក់សិក្សា'
        }));
    } else if (formData.applicantType === 'TEACHER') {
      return teachers.filter(Boolean)
        .filter(t => {
          if (t.status === 'EXITED' || t.status === 'STOP' || t.status === 'RESIGNED') return false;
          const nameKh = (t.nameKh || '').toLowerCase();
          const nameEn = (t.nameEn || '').toLowerCase();
          const code = (t.teacherId || t.code || '').toLowerCase();
          return nameKh.includes(query) || nameEn.includes(query) || code.includes(query);
        })
        .map(t => ({
          id: t.id,
          code: t.teacherId || t.code || `TCH-${t.id.substring(0, 6)}`,
          name: t.nameKh || t.nameEn || 'គ្រូបង្រៀន',
          phone: t.phoneNumber || t.phone || '',
          detail: t.specialty || 'គ្រូបង្រៀន'
        }));
    } else {
      // Staff default list or from teachers/users
      return teachers.filter(Boolean)
        .map(t => ({
          id: t.id,
          code: t.teacherId || t.code || `STF-${t.id.substring(0, 6)}`,
          name: t.nameKh || t.nameEn || 'បុគ្គលិក',
          phone: t.phoneNumber || t.phone || '',
          detail: 'បុគ្គលិករដ្ឋបាល/បច្ចេកទេស'
        }))
        .filter(st => st.name.toLowerCase().includes(query) || st.code.toLowerCase().includes(query));
    }
  }, [students, teachers, formData.applicantType, applicantSearch]);

  const selectedApplicantObj = useMemo(() => {
    return availableApplicants.find(a => a.id === formData.applicantId);
  }, [availableApplicants, formData.applicantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantId && !formData.applicantName) return;
    if (!formData.startDate || !formData.endDate || isDateError) return;

    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      const selected = selectedApplicantObj;
      const submissionData = {
        applicantType: formData.applicantType,
        studentId: formData.applicantType === 'STUDENT' ? formData.applicantId : null,
        teacherId: formData.applicantType === 'TEACHER' ? formData.applicantId : null,
        applicantName: selected ? selected.name : formData.applicantName,
        applicantCode: selected ? selected.code : formData.applicantCode,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        guardianPhone: formData.guardianPhone || (selected ? selected.phone : ''),
        status: 'PENDING'
      };

      const res = await fetch('/api/leave-requests', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        }, 
        body: JSON.stringify(submissionData) 
      });

      if (res.ok) {
        const created = await res.json();
        setRequests(prev => [created, ...prev]);
      } else {
        // Fallback local update
        const fallbackObj = {
          id: `lr-local-${Date.now()}`,
          ...submissionData,
          createdAt: new Date().toISOString()
        };
        setRequests(prev => [fallbackObj, ...prev]);
      }

      setIsAddDialogOpen(false);
      setFormData({
        applicantType: 'STUDENT',
        applicantId: '',
        applicantName: '',
        applicantCode: '',
        type: 'SICK',
        startDate: '',
        endDate: '',
        reason: '',
        guardianPhone: ''
      });
    } catch (error) {
      console.error("Failed to submit request", error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      await fetch(`/api/leave-requests/${id}/status`, { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }, 
        body: JSON.stringify({ status }) 
      });

      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      console.error("Failed to update status", error);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!id) return;

    // Save to local blacklist
    try {
      const stored = localStorage.getItem("plc_deleted_leave_requests");
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem("plc_deleted_leave_requests", JSON.stringify(list));
      }
    } catch (e) {}

    // Update local state immediately
    setRequests(prev => prev.filter(r => r.id !== id));
    setDeleteTargetReq(null);

    try {
      const token = localStorage.getItem('plc_auth_token') || localStorage.getItem('token') || '';
      await fetch(`/api/leave-requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.warn("Delete request API error:", error);
    }
  };

  // Helper for Applicant Type Badge
  const getCategoryMeta = (type?: string, req?: any) => {
    const raw = type || req?.applicantType || (req?.studentId || req?.student ? 'STUDENT' : req?.teacherId || req?.teacher ? 'TEACHER' : 'STAFF');
    switch(raw) {
      case 'STUDENT':
        return {
          key: 'STUDENT',
          labelKh: 'សិស្ស',
          labelEn: 'Student',
          icon: GraduationCap,
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          avatarBg: 'bg-purple-100 text-purple-700'
        };
      case 'TEACHER':
        return {
          key: 'TEACHER',
          labelKh: 'គ្រូបង្រៀន',
          labelEn: 'Teacher',
          icon: UserCheck,
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          avatarBg: 'bg-blue-100 text-blue-700'
        };
      default:
        return {
          key: 'STAFF',
          labelKh: 'បុគ្គលិក',
          labelEn: 'Staff',
          icon: Users,
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          avatarBg: 'bg-amber-100 text-amber-800'
        };
    }
  };

  const getStatusMeta = (status: string) => {
    switch(status) {
      case 'PENDING':
        return {
          labelKh: 'រង់ចាំការអនុម័ត',
          labelEn: 'Pending Approval',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          icon: Clock3
        };
      case 'APPROVED':
        return {
          labelKh: 'បានអនុម័ត',
          labelEn: 'Approved',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          icon: CheckCircle2
        };
      case 'REJECTED':
        return {
          labelKh: 'បដិសេធ',
          labelEn: 'Rejected',
          color: 'text-rose-700 bg-rose-50 border-rose-200',
          icon: XCircle
        };
      default:
        return {
          labelKh: status,
          labelEn: status,
          color: 'text-slate-600 bg-slate-100 border-slate-200',
          icon: Clock3
        };
    }
  };

  const getTypeLabel = (type: string) => {
    return (type === 'SICK' || type?.includes('ឈឺ'))
      ? localIdt('ឈប់សម្រាកឈឺ (Sick)', 'Sick Leave') 
      : localIdt('ធុរៈផ្ទាល់ខ្លួន (Personal)', 'Personal Leave');
  };

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const catMeta = getCategoryMeta(req.applicantType, req);
      
      // Category filter
      if (categoryFilter !== 'ALL' && catMeta.key !== categoryFilter) return false;

      // Status filter
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (req.applicantName || req.student?.nameKh || req.teacher?.nameKh || req.user?.fullName || '').toLowerCase();
        const code = (req.applicantCode || req.student?.studentId || req.teacher?.teacherId || '').toLowerCase();
        const reason = (req.reason || '').toLowerCase();
        const phone = (req.guardianPhone || '').toLowerCase();
        return name.includes(q) || code.includes(q) || reason.includes(q) || phone.includes(q);
      }

      return true;
    });
  }, [requests, categoryFilter, statusFilter, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'PENDING').length;
    const approved = requests.filter(r => r.status === 'APPROVED').length;
    const rejected = requests.filter(r => r.status === 'REJECTED').length;

    const studentCount = requests.filter(r => getCategoryMeta(r.applicantType, r).key === 'STUDENT').length;
    const teacherCount = requests.filter(r => getCategoryMeta(r.applicantType, r).key === 'TEACHER').length;
    const staffCount = requests.filter(r => getCategoryMeta(r.applicantType, r).key === 'STAFF').length;

    return { total, pending, approved, rejected, studentCount, teacherCount, staffCount };
  }, [requests]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CalendarRange className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
              {localIdt("ប្រព័ន្ធអនុម័តការសុំច្បាប់ (Leave Approval System)", "Leave Approval System")}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-1">
            {localIdt("គ្រប់គ្រង និងអនុម័តការសុំច្បាប់សម្រាករបស់ សិស្ស, គ្រូបង្រៀន និងបុគ្គលិកទាំងអស់ក្នុងប្រព័ន្ធ", "Manage and approve leave requests for Students, Teachers, and Staff")}
          </p>
        </div>
        <button 
          onClick={() => {
            setIsAddDialogOpen(true);
            setFormData({
              applicantType: 'STUDENT',
              applicantId: '',
              applicantName: '',
              applicantCode: '',
              type: 'SICK',
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              reason: '',
              guardianPhone: ''
            });
          }} 
          className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 font-bold text-sm shrink-0"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3]" /> {localIdt("បង្កើតសំណើសុំច្បាប់", "New Leave Request")}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pending */}
        <div 
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'PENDING' ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400' : 'bg-white border-slate-200 hover:border-amber-200'}`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-700">{localIdt("រង់ចាំការអនុម័ត", "Pending Approval")}</span>
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Clock3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">{stats.pending}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">សំណើសុំច្បាប់ដែលត្រូវការពិនិត្យ</div>
        </div>

        {/* Approved */}
        <div 
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'APPROVED' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400' : 'bg-white border-slate-200 hover:border-emerald-200'}`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-700">{localIdt("បានអនុម័ត", "Approved")}</span>
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">{stats.approved}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">សំណើដែលបានយល់ព្រម</div>
        </div>

        {/* Rejected */}
        <div 
          onClick={() => setStatusFilter('REJECTED')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${statusFilter === 'REJECTED' ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400' : 'bg-white border-slate-200 hover:border-rose-200'}`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-rose-700">{localIdt("បានបដិសេធ", "Rejected")}</span>
            <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-900 mt-2">{stats.rejected}</div>
          <div className="text-[10px] text-rose-600 font-semibold mt-1">សំណើដែលត្រូវបានបដិសេធ</div>
        </div>

        {/* Breakdown by Category */}
        <div 
          onClick={() => { setCategoryFilter('ALL'); setStatusFilter('ALL'); }}
          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">{localIdt("សំណើសរុបទាំងអស់", "Total Requests")}</span>
            <span className="text-xs font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold">
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> {stats.studentCount}
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> {stats.teacherCount}
            </span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Users className="w-3 h-3" /> {stats.staffCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${categoryFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {localIdt("ទាំងអស់ (All)", "All")}
            </button>
            <button
              onClick={() => setCategoryFilter('STUDENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${categoryFilter === 'STUDENT' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-700'}`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {localIdt("សិស្ស", "Students")} ({stats.studentCount})
            </button>
            <button
              onClick={() => setCategoryFilter('TEACHER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${categoryFilter === 'TEACHER' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-700'}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              {localIdt("គ្រូបង្រៀន", "Teachers")} ({stats.teacherCount})
            </button>
            <button
              onClick={() => setCategoryFilter('STAFF')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${categoryFilter === 'STAFF' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-amber-700'}`}
            >
              <Users className="w-3.5 h-3.5" />
              {localIdt("បុគ្គលិក", "Staff")} ({stats.staffCount})
            </button>
          </div>

          {/* Right Side: Status Dropdown & Search */}
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">{localIdt("គ្រប់ស្ថានភាពទាំងអស់", "All Statuses")}</option>
              <option value="PENDING">{localIdt("រង់ចាំការអនុម័ត (Pending)", "Pending")}</option>
              <option value="APPROVED">{localIdt("បានអនុម័ត (Approved)", "Approved")}</option>
              <option value="REJECTED">{localIdt("បដិសេធ (Rejected)", "Rejected")}</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={localIdt("ស្វែងរកឈ្មោះ, អត្តលេខ, មូលហេតុ...", "Search name, ID, reason...")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-left text-xs text-slate-600 uppercase font-black tracking-wider">
              <tr>
                <th className="px-5 py-3.5">{localIdt("អ្នកស្នើសុំ / អត្តលេខ", "Applicant / ID")}</th>
                <th className="px-5 py-3.5">{localIdt("ប្រភេទ", "Category")}</th>
                <th className="px-5 py-3.5">{localIdt("ប្រភេទច្បាប់", "Leave Type")}</th>
                <th className="px-5 py-3.5">{localIdt("កាលបរិច្ឆេទ & រយៈពេល", "Dates & Duration")}</th>
                <th className="px-5 py-3.5">{localIdt("មូលហេតុ & ទំនាក់ទំនង", "Reason & Contact")}</th>
                <th className="px-5 py-3.5 text-center">{localIdt("ស្ថានភាព", "Status")}</th>
                <th className="px-5 py-3.5 text-right">{localIdt("សកម្មភាពអនុម័ត", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                      <span className="font-bold text-xs">{localIdt("កំពុងទាញយកទិន្នន័យ...", "Loading leave requests...")}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center">
                      <CalendarRange className="w-10 h-10 text-slate-300 mb-2" />
                      <span className="font-bold text-sm text-slate-600">{localIdt("មិនមានសំណើសុំច្បាប់ត្រូវបង្ហាញឡើយ", "No leave requests found")}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{localIdt("សូមសាកល្បងជ្រើសរើសតម្រងផ្សេង ឬចុចបង្កើតសំណើថ្មី", "Try selecting another filter or click New Request")}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const catMeta = getCategoryMeta(req.applicantType, req);
                  const statusMeta = getStatusMeta(req.status);
                  const CategoryIcon = catMeta.icon;
                  const StatusIcon = statusMeta.icon;

                  const name = req.applicantName || req.student?.nameKh || req.teacher?.nameKh || req.user?.fullName || "អ្នកស្នើសុំ";
                  const code = req.applicantCode || req.student?.studentId || req.teacher?.teacherId || req.teacher?.code || "ID-001";
                  const phone = req.guardianPhone || req.student?.guardianPhone || req.teacher?.phoneNumber || "";

                  const startDateFormatted = req.startDate ? new Date(req.startDate).toLocaleDateString() : "-";
                  const endDateFormatted = req.endDate ? new Date(req.endDate).toLocaleDateString() : "-";

                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      key={req.id} 
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name & ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${catMeta.avatarBg} flex items-center justify-center font-black text-sm shrink-0 shadow-sm`}>
                            {name[0]}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm leading-snug">{name}</div>
                            <div className="text-[11px] font-mono font-bold text-slate-500 mt-0.5">{code}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${catMeta.badgeBg}`}>
                          <CategoryIcon className="w-3.5 h-3.5" />
                          {catMeta.labelKh}
                        </span>
                      </td>

                      {/* Leave Type */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs border border-slate-200/60">
                          {getTypeLabel(req.type)}
                        </span>
                      </td>

                      {/* Dates & Duration */}
                      <td className="px-5 py-4">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{startDateFormatted}</span>
                          <span className="text-slate-400">ដល់</span>
                          <span>{endDateFormatted}</span>
                        </div>
                      </td>

                      {/* Reason & Phone */}
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-xs font-medium text-slate-800 line-clamp-2">{req.reason || '-'}</p>
                        {phone && (
                          <div className="text-[11px] text-slate-500 font-mono font-semibold flex items-center gap-1 mt-1">
                            <PhoneCall className="w-3 h-3 text-slate-400" />
                            {phone}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl border text-xs font-black ${statusMeta.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusMeta.labelKh}
                        </span>
                      </td>

                      {/* Approve / Reject / Delete Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'PENDING' ? (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(req.id, 'APPROVED')} 
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm shadow-emerald-600/20 active:scale-95" 
                                title={localIdt("អនុម័តសំណើ", "Approve Request")}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>អនុម័ត</span>
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(req.id, 'REJECTED')} 
                                className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm shadow-rose-600/20 active:scale-95" 
                                title={localIdt("បដិសេធសំណើ", "Reject Request")}
                              >
                                <X className="w-3.5 h-3.5 stroke-[3]" />
                                <span>បដិសេធ</span>
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleUpdateStatus(req.id, 'PENDING')}
                              className="text-xs font-bold text-slate-500 hover:text-amber-600 underline px-2 py-1"
                              title={localIdt("ប្តូរមកជាកំពុងរង់ចាំ", "Reset to Pending")}
                            >
                              {localIdt("ប្តូរឡើងវិញ", "Reset")}
                            </button>
                          )}

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetReq(req);
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all ml-1 cursor-pointer active:scale-95 shrink-0"
                            title={localIdt("លុបសំណើ", "Delete Request")}
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin New Leave Request Modal */}
      <AnimatePresence>
        {isAddDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsApplicantDropdownOpen(false);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 relative z-10"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 font-sans">
                      {localIdt("បង្កើតសំណើសុំច្បាប់ថ្មី", "New Leave Request")}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {localIdt("បញ្ចូលការសុំច្បាប់សម្រាប់ សិស្ស, គ្រូ ឬ បុគ្គលិក", "Add leave request for Student, Teacher, or Staff")}
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setIsApplicantDropdownOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* 1. Category Selector (សិស្ស / គ្រូ / បុគ្គលិក) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    {localIdt("ប្រភេទអ្នកស្នើសុំ", "Applicant Category")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, applicantType: 'STUDENT', applicantId: '', applicantName: '', applicantCode: '' });
                        setApplicantSearch('');
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all ${formData.applicantType === 'STUDENT' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>{localIdt("សិស្ស", "Student")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, applicantType: 'TEACHER', applicantId: '', applicantName: '', applicantCode: '' });
                        setApplicantSearch('');
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all ${formData.applicantType === 'TEACHER' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{localIdt("គ្រូបង្រៀន", "Teacher")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, applicantType: 'STAFF', applicantId: '', applicantName: '', applicantCode: '' });
                        setApplicantSearch('');
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all ${formData.applicantType === 'STAFF' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      <Users className="w-4 h-4" />
                      <span>{localIdt("បុគ្គលិក", "Staff")}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Applicant Search & Select */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>
                      {formData.applicantType === 'STUDENT' ? 'ជ្រើសរើសសិស្ស' : formData.applicantType === 'TEACHER' ? 'ជ្រើសរើសគ្រូបង្រៀន' : 'ជ្រើសរើសបុគ្គលិក'} <span className="text-rose-500">*</span>
                    </span>
                  </label>

                  <div className="relative" ref={applicantDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsApplicantDropdownOpen(!isApplicantDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-700 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xs">
                          {selectedApplicantObj ? selectedApplicantObj.name[0] : <User className="w-4 h-4" />}
                        </div>
                        <span className={selectedApplicantObj ? "text-slate-900 font-bold text-sm" : "text-slate-400 text-sm font-medium"}>
                          {selectedApplicantObj ? `${selectedApplicantObj.name} (${selectedApplicantObj.code})` : localIdt("សូមជ្រើសរើសបុគ្គល...", "Select person...")}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isApplicantDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isApplicantDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-60"
                        >
                          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            <input
                              type="text"
                              placeholder={localIdt("ស្វែងរកឈ្មោះ ឬអត្តលេខ...", "Search name or ID...")}
                              value={applicantSearch}
                              onChange={e => setApplicantSearch(e.target.value)}
                              className="w-full p-1.5 bg-transparent border-none outline-none focus:ring-0 text-xs font-bold text-slate-800 placeholder-slate-400"
                              autoFocus
                            />
                            {applicantSearch && (
                              <button type="button" onClick={() => setApplicantSearch('')} className="p-1 hover:bg-slate-200 rounded-full text-slate-400">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="overflow-y-auto flex-1 max-h-48 divide-y divide-slate-50">
                            {availableApplicants.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                {localIdt("រកមិនឃើញទិន្នន័យឡើយ", "No persons found")}
                              </div>
                            ) : (
                              availableApplicants.map(app => (
                                <button
                                  key={app.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ 
                                      ...formData, 
                                      applicantId: app.id,
                                      applicantName: app.name,
                                      applicantCode: app.code,
                                      guardianPhone: app.phone || formData.guardianPhone
                                    });
                                    setIsApplicantDropdownOpen(false);
                                    setApplicantSearch('');
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50/50 transition-colors ${formData.applicantId === app.id ? 'bg-blue-50 font-bold' : ''}`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                    {app.name[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">{app.name}</div>
                                    <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                                      <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{app.code}</span>
                                      <span className="truncate">• {app.detail}</span>
                                    </div>
                                  </div>
                                  {formData.applicantId === app.id && (
                                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 3. Leave Type */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    {localIdt("ប្រភេទច្បាប់", "Leave Type")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'SICK' })}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${formData.type === 'SICK' ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-400/20' : 'border-slate-200 bg-slate-50'}`}
                    >
                      <div className={`p-2 rounded-xl ${formData.type === 'SICK' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-extrabold text-slate-900">{localIdt("ឈប់សម្រាកឈឺ", "Sick Leave")}</div>
                        <div className="text-[10px] text-slate-500 font-medium">Sick Leave</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'PERSONAL' })}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${formData.type === 'PERSONAL' ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-400/20' : 'border-slate-200 bg-slate-50'}`}
                    >
                      <div className={`p-2 rounded-xl ${formData.type === 'PERSONAL' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-extrabold text-slate-900">{localIdt("ធុរៈផ្ទាល់ខ្លួន", "Personal Leave")}</div>
                        <div className="text-[10px] text-slate-500 font-medium">Personal Leave</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      {localIdt("ចាប់ពីថ្ងៃ", "From Date")} <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      required 
                      type="date" 
                      value={formData.startDate} 
                      onChange={e => setFormData({...formData, startDate: e.target.value})} 
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-800" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      {localIdt("ដល់ថ្ងៃ", "To Date")} <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      required 
                      type="date" 
                      value={formData.endDate} 
                      onChange={e => setFormData({...formData, endDate: e.target.value})} 
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-800" 
                    />
                  </div>
                </div>

                {isDateError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>ថ្ងៃបញ្ចប់មិនអាចមុនថ្ងៃចាប់ផ្តើមបានទេ!</span>
                  </div>
                )}

                {totalDays > 0 && !isDateError && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>រយៈពេលសរុប៖ {totalDays} ថ្ងៃ</span>
                  </div>
                )}

                {/* 5. Contact / Guardian Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    {localIdt("លេខទូរស័ព្ទទំនាក់ទំនង / អាណាព្យាបាល", "Contact / Guardian Phone")}
                  </label>
                  <input 
                    type="text" 
                    placeholder="087 850 014" 
                    value={formData.guardianPhone} 
                    onChange={e => setFormData({...formData, guardianPhone: e.target.value})} 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-800" 
                  />
                </div>

                {/* 6. Reason */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    {localIdt("មូលហេតុនៃការសុំច្បាប់", "Reason for Leave")} <span className="text-rose-500">*</span>
                  </label>
                  <textarea 
                    required 
                    rows={3}
                    placeholder={localIdt("សូមបញ្ជាក់មូលហេតុច្បាស់លាស់...", "Specify clear reason...")} 
                    value={formData.reason} 
                    onChange={e => setFormData({...formData, reason: e.target.value})} 
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-800 resize-none" 
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsAddDialogOpen(false)} 
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    {localIdt("បោះបង់", "Cancel")}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isDateError || (!formData.applicantId && !formData.applicantName)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                  >
                    {localIdt("រក្សាទុក & ដាក់ស្នើ", "Save & Submit")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]"
              onClick={() => setDeleteTargetReq(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative z-10 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Trash2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 font-sans">
                  {localIdt("លុបសំណើសុំច្បាប់", "Delete Leave Request")}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1.5 leading-relaxed">
                  {localIdt(
                    `តើអ្នកប្រាកដជាចង់លុបសំណើសុំច្បាប់របស់ "${deleteTargetReq.applicantName || deleteTargetReq.student?.nameKh || deleteTargetReq.teacher?.nameKh || 'អ្នកស្នើសុំ'}" មែនទេ?`,
                    `Are you sure you want to delete the leave request for "${deleteTargetReq.applicantName || 'Applicant'}"?`
                  )}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetReq(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  {localIdt("បោះបង់", "Cancel")}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRequest(deleteTargetReq.id)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs transition-all shadow-md shadow-rose-600/20 active:scale-95"
                >
                  {localIdt("យល់ព្រមលុប", "Confirm Delete")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
