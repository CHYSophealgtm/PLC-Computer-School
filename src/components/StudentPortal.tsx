import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import CertificatesTemplate from "./tabs/CertificatesTemplate";
import { exportCertificateAsJpg, exportCertificateAsPdf } from "../utils/exportCertificate";
import { 
  ArrowLeft, Loader2, CheckCircle, Calendar, CreditCard, Award, FileText, Check,
  Bell, Plus, BookOpen, Megaphone, Globe, QrCode, Search, ChevronRight, X, Phone, MapPin,
  Clock, AlertCircle, Send, User, ChevronDown, RefreshCw, BarChart3, Star, LogOut,
  Camera, Upload, Save, Sparkles, ImageIcon, ShieldCheck, Printer, Download, Receipt, ExternalLink, Menu,
  GraduationCap, Play, Trophy, Folder
} from "lucide-react";


// High Resolution Tech Banner Carousel Image
const DEFAULT_BANNER_IMG = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800";

export default function StudentPortal({ 
  studentId, 
  initialOpenExam = false,
  onBackToLogin 
}: { 
  studentId: string; 
  initialOpenExam?: boolean;
  onBackToLogin?: () => void;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(studentId);
  const [sysSettings, setSysSettings] = useState<any>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [portalCoverImage, setPortalCoverImage] = useState("");
  const [portalBannerTitle, setPortalBannerTitle] = useState("");
  const [portalBannerSubtitle, setPortalBannerSubtitle] = useState("");
  const [isSavingPortalBanner, setIsSavingPortalBanner] = useState(false);

  const [isExportingCert, setIsExportingCert] = useState(false);

  const handleDownloadCertJpg = async () => {
    setIsExportingCert(true);
    const certNo = viewingCertificate?.certificateNumber || viewingCertificate?.certNumber || "Certificate";
    await exportCertificateAsJpg("printable-certificate-container", `Certificate_${certNo}.jpg`);
    setIsExportingCert(false);
  };

  const handleDownloadCertPdf = async () => {
    setIsExportingCert(true);
    const certNo = viewingCertificate?.certificateNumber || viewingCertificate?.certNumber || "Certificate";
    await exportCertificateAsPdf("printable-certificate-container", `Certificate_${certNo}.pdf`);
    setIsExportingCert(false);
  };




  const bannerPresets = [
    {
      name: "បន្ទប់កុំព្យូទ័រ ICT",
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "ការសិក្សាកូដ & បច្ចេកវិទ្យា",
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "សិក្ខាសាលា & សន្និសីទ",
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "ថ្នាក់រៀនអប់រំបច្ចេកវិទ្យា",
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const handleOpenBannerModal = () => {
    setPortalCoverImage(sysSettings?.coverImage || sysSettings?.bannerImage || DEFAULT_BANNER_IMG);
    setPortalBannerTitle(sysSettings?.bannerTitle || "វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ");
    setPortalBannerSubtitle(sysSettings?.bannerSubtitle || "អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ");
    setIsBannerModalOpen(true);
  };

  const handleSavePortalBanner = async () => {
    setIsSavingPortalBanner(true);
    try {
      const res = await fetch("/api/system/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coverImage: portalCoverImage,
          bannerImage: portalCoverImage,
          bannerTitle: portalBannerTitle,
          bannerSubtitle: portalBannerSubtitle
        })
      });
      if (res.ok) {
        setSysSettings((prev: any) => ({
          ...prev,
          coverImage: portalCoverImage,
          bannerImage: portalCoverImage,
          bannerTitle: portalBannerTitle,
          bannerSubtitle: portalBannerSubtitle
        }));
        setIsBannerModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingPortalBanner(false);
    }
  };

  useEffect(() => {
    fetch("/api/system/settings")
      .then(async res => {
        if (res.ok) {
          const text = await res.text();
          try { return JSON.parse(text); } catch { return null; }
        }
        return null;
      })
      .then(json => {
        if (!json) return;
        setSysSettings(json);
        if (json.appTheme) {
          localStorage.setItem("plc_app_theme", json.appTheme);
        }
        if (json.schoolPhone) {
          setLeaveGuardianPhone(json.schoolPhone);
        }
      })
      .catch(err => console.warn("Notice: Error loading system settings:", err));
  }, []);

  const themeCfg = (() => {
    const t = sysSettings?.appTheme?.toLowerCase() || localStorage.getItem("plc_app_theme")?.toLowerCase() || "indigo";
    if (t === "indigo" || t === "blue" || t === "navy") {
      return {
        bannerBg: "bg-[#1e3a8a]",
        cardGradient: "bg-[#1e3a8a]",
        primaryColor: "#1e3a8a",
        primaryBg: "bg-[#1e3a8a]",
        textColor: "text-[#1e3a8a]",
        borderColor: "border-[#1e3a8a]",
        ringColor: "ring-[#1e3a8a]/20",
        sealBg: "bg-[#1e3a8a]"
      };
    } else if (t === "emerald" || t === "green") {
      return {
        bannerBg: "bg-[#065f46]",
        cardGradient: "bg-[#065f46]",
        primaryColor: "#065f46",
        primaryBg: "bg-[#065f46]",
        textColor: "text-[#065f46]",
        borderColor: "border-[#065f46]",
        ringColor: "ring-[#065f46]/20",
        sealBg: "bg-[#065f46]"
      };
    } else if (t === "purple" || t === "violet") {
      return {
        bannerBg: "bg-[#581c87]",
        cardGradient: "bg-[#581c87]",
        primaryColor: "#581c87",
        primaryBg: "bg-[#581c87]",
        textColor: "text-[#581c87]",
        borderColor: "border-[#581c87]",
        ringColor: "ring-[#581c87]/20",
        sealBg: "bg-[#581c87]"
      };
    } else if (t === "amber" || t === "orange") {
      return {
        bannerBg: "bg-[#78350f]",
        cardGradient: "bg-[#78350f]",
        primaryColor: "#78350f",
        primaryBg: "bg-[#78350f]",
        textColor: "text-[#78350f]",
        borderColor: "border-[#78350f]",
        ringColor: "ring-[#78350f]/20",
        sealBg: "bg-[#78350f]"
      };
    }
    return {
      bannerBg: "bg-[#8f1218]",
      cardGradient: "bg-[#8f1218]",
      primaryColor: "#8f1218",
      primaryBg: "bg-[#8f1218]",
      textColor: "text-[#8f1218]",
      borderColor: "border-[#8f1218]",
      ringColor: "ring-[#8f1218]/20",
      sealBg: "bg-[#8f1218]"
    };
  })();

  // View Screen Mode: "overview" (Guardian Home Screen as requested) | "menu" (Detailed Student Menu)
  const [viewMode, setViewMode] = useState<"overview" | "menu">("overview");

  // Bottom Navigation Bar Active Tab ("home" | "library" | "announcements" | "info")
  const [activeBottomTab, setActiveBottomTab] = useState<"home" | "library" | "announcements" | "info">("home");

  // Action Modals
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isHonorModalOpen, setIsHonorModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isClassesModalOpen, setIsClassesModalOpen] = useState(false);

  // Course Final Exam & Earned Certificates State
  const [isCourseFinalExamModalOpen, setIsCourseFinalExamModalOpen] = useState(false);
  const [isEarnedCertificatesModalOpen, setIsEarnedCertificatesModalOpen] = useState(false);
  const [examFilterTab, setExamFilterTab] = useState<"my_course" | "all">("my_course");
  const [activeCourseExam, setActiveCourseExam] = useState<any>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScoreResult, setExamScoreResult] = useState<any>(null);
  const [examTimeLeft, setExamTimeLeft] = useState<number | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<any>(null);
  const [earnedCertificatesList, setEarnedCertificatesList] = useState<any[]>([]);

  useEffect(() => {
    if (initialOpenExam) {
      setIsCourseFinalExamModalOpen(true);
    }
  }, [initialOpenExam]);

  // Sample Course Final Exams Data
    // Available Course Final Exams State
  const [availableCourseExams, setAvailableCourseExams] = useState<any[]>([]);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const res = await fetch("/api/exams");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAvailableCourseExams(data.filter(e => e.status !== "INACTIVE"));
        }
      } catch (e) {
        console.error("Error loading exams in student portal:", e);
      }
    };
    loadExams();
  }, []);

  // Load student leave requests from API
  useEffect(() => {
    const sId = data?.id || selectedStudentId;
    if (!sId) return;

    fetch(`/api/leave-requests?studentId=${encodeURIComponent(sId)}`)
      .then(res => res.json())
      .then(reqs => {
        if (Array.isArray(reqs) && reqs.length > 0) {
          const mapped = reqs.map((r: any) => {
            const start = r.startDate ? new Date(r.startDate).toLocaleDateString('km-KH') : '';
            const end = r.endDate ? new Date(r.endDate).toLocaleDateString('km-KH') : '';
            const status = r.status || 'PENDING';
            return {
              id: r.id,
              dateRange: start && end && start !== end ? `${start} ដល់ ${end}` : start || 'ថ្ងៃនេះ',
              type: r.type || 'ច្បាប់ឈប់សម្រាក',
              days: 'ច្បាប់',
              reason: r.reason || '',
              status,
              statusKh: status === 'APPROVED' ? 'បានអនុម័ត' : status === 'REJECTED' ? 'បានបដិសេធ' : 'កំពុងពិនិត្យ',
            };
          });
          setLeaveRequestsList(mapped);
        }
      })
      .catch(err => console.error("Error fetching student leave requests:", err));
  }, [data?.id, selectedStudentId]);
  const [leaveType, setLeaveType] = useState("ឈឺ (Sick Leave)");
  const [leaveStartDate, setLeaveStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveEndDate, setLeaveEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveGuardianPhone, setLeaveGuardianPhone] = useState(data?.guardianPhone || "");
  const [isLeaveSubmitted, setIsLeaveSubmitted] = useState(false);
  const [leaveRequestsList, setLeaveRequestsList] = useState<any[]>([]);

  const fetchData = (targetId: string) => {
    setLoading(true);
    fetch(`/api/portal/student/${encodeURIComponent(targetId)}`)
      .then(async res => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error("ប្រព័ន្ធមានបញ្ហា ឬមមាញឹក (Rate limit exceeded) សូមព្យាយាមម្ដងទៀត!");
        }
      })
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(selectedStudentId);
  }, [selectedStudentId]);

  // Load and sync Earned & Admin-Issued Certificates for student
  useEffect(() => {
    const loadStudentCertificates = () => {
      try {
        const sNameKh = data?.nameKh || `${data?.lastNameKh || ''} ${data?.firstNameKh || ''}`.trim() || data?.nameEn || "";
        const sNameEn = data?.nameEn || "";

        // Read latest system settings
        const savedSettings = localStorage.getItem("sms_system_settings");
        let activeSettings = sysSettings;
        if (savedSettings) {
          try {
            activeSettings = { ...JSON.parse(savedSettings), ...sysSettings };
          } catch (e) {}
        }

        const allCerts: any[] = [];

        // 1. Load official Admin-issued certificates from database
        if (data?.certificates && Array.isArray(data.certificates)) {
          data.certificates.forEach((cert: any) => {
            const tmpl = cert.template || {};
            allCerts.push({
              id: cert.id,
              certNumber: cert.certificateNumber || `CERT-${cert.id}`,
              studentId: cert.studentId,
              studentNameKh: sNameKh,
              studentNameEn: sNameEn,
              genderKh: data?.gender === "Male" ? "ប្រុស" : "ស្រី",
              genderEn: data?.gender === "Male" ? "Male" : "Female",
              dateOfBirthKh: data?.dob ? new Date(data.dob).toLocaleDateString("km-KH") : "",
              dateOfBirthEn: data?.dob ? new Date(data.dob).toLocaleDateString("en-US") : "",
              courseName: tmpl.title || "វគ្គសិក្សាកុំព្យូទ័រ",
              courseNameEn: "Computer Course",
              periodOfStudyKh: "",
              periodOfStudyEn: "",
              lunarDateKh: "",
              grade: cert.gradeTitle || "ល្អប្រសើរ (A+)",
              score: 100,
              maxScore: 100,
              percentage: 100,
              issueDateKh: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString("km-KH") : new Date().toLocaleDateString("km-KH"),
              issueDateEn: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString("en-US") : new Date().toLocaleDateString("en-US"),
              directorName: activeSettings?.directorName || "ជី សុភា",
              schoolNameKh: activeSettings?.schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី",
              schoolNameEn: activeSettings?.schoolName || "PLC Computer School",
              schoolLogo: activeSettings?.schoolLogo,
              directorSignature: activeSettings?.directorSignature,
              schoolStamp: activeSettings?.schoolStamp,
              studentPhoto: data?.photoUrl,
              isFromAdmin: true,
              qrCodeUrl: cert.qrCodeUrl
            });
          });
        }
        
        // 2. We can still allow local ones (like exam auto-generated)
        const savedEarned = localStorage.getItem(`plc_earned_certificates_${data?.id || selectedStudentId}`);
        if (savedEarned) {
          try {
            const earnedCerts = JSON.parse(savedEarned);
            earnedCerts.forEach((earnedCert: any) => {
              if (!allCerts.some(c => c.id === earnedCert.id || c.certNumber === earnedCert.certNumber)) {
                allCerts.push({
                  ...earnedCert,
                  directorName: activeSettings?.directorName || earnedCert.directorName || "ជី សុភា",
                  schoolNameKh: activeSettings?.schoolKhmerName || earnedCert.schoolNameKh || "សាលាកុំព្យូទ័រ ភីអិលស៊ី",
                  schoolNameEn: activeSettings?.schoolName || earnedCert.schoolNameEn || "PLC Computer School",
                  schoolLogo: activeSettings?.schoolLogo || earnedCert.schoolLogo
                });
              }
            });
          } catch (e) {
            console.error("Error parsing earned certificates:", e);
          }
        }

        setEarnedCertificatesList(allCerts);
      } catch (e) {
        console.error("Error loading student certificates:", e);
      }
    };

    loadStudentCertificates();
    window.addEventListener("plc_certificate_earned", loadStudentCertificates);
    window.addEventListener("storage", loadStudentCertificates);
    return () => {
      window.removeEventListener("plc_certificate_earned", loadStudentCertificates);
      window.removeEventListener("storage", loadStudentCertificates);
    };
  }, [selectedStudentId, data, sysSettings]);

  // Exam Timer Effect
  useEffect(() => {
    if (examTimeLeft === null || examSubmitted) return;
    if (examTimeLeft <= 0) {
      handleSubmitCourseFinalExam();
      return;
    }
    const timer = setInterval(() => {
      setExamTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [examTimeLeft, examSubmitted]);

  // Select Answer for Course Final Exam Question
  const handleSelectExamAnswer = (questionId: string, answerText: string) => {
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: answerText
    }));
  };

  // Start Course Final Exam
  const handleStartCourseFinalExam = (exam: any) => {
    setActiveCourseExam(exam);
    setExamAnswers({});
    setExamSubmitted(false);
    setExamScoreResult(null);
    setExamTimeLeft(exam.duration * 60);
  };

  // Submit Course Final Exam & Calculate Score
  const handleSubmitCourseFinalExam = async () => {
    if (!activeCourseExam) return;
    let score = 0;
    let totalPoints = 0;

    activeCourseExam.questions.forEach((q: any) => {
      const p = q.points || 20;
      totalPoints += p;
      if (examAnswers[q.id] === q.answer) {
        score += p;
      }
    });

    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= activeCourseExam.passingPercent;

    const result = {
      score,
      totalPoints,
      percentage,
      passed,
      grade: percentage >= 90 ? "ល្អប្រសើរ (A+)" : percentage >= 75 ? "ល្អណាស់ (A)" : percentage >= 50 ? "ល្អ (B)" : "មិនជាប់ (F)"
    };

    setExamScoreResult(result);
    setExamSubmitted(true);

    try {
      await fetch(`/api/exams/${activeCourseExam.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          answers: examAnswers
        })
      });
    } catch (err) {
      console.warn("Notice: Offline or error saving exam:", err);
    }

    if (passed) {
      const sId = data?.id || selectedStudentId;
      const sNameKh = data?.nameKh || "សាម៉ែត សុខា";
      const sNameEn = data?.nameEn || "Samet Sokha";
      const certNumber = `PLC-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      const newCert = {
        id: `cert-${Date.now()}`,
        certNumber,
        studentId: sId,
        studentNameKh: sNameKh,
        studentNameEn: sNameEn,
        courseName: activeCourseExam.courseName,
        courseNameEn: activeCourseExam.courseNameEn,
        grade: result.grade,
        score,
        maxScore: totalPoints,
        percentage,
        issueDateKh: new Date().toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" }),
        issueDateEn: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        directorName: sysSettings?.directorName || "ជី សុភា",
        schoolNameKh: sysSettings?.schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី",
        schoolNameEn: sysSettings?.schoolName || "PLC Computer School"
      };

      setEarnedCertificatesList(prev => {
        const filtered = prev.filter(c => c && c.courseName !== newCert.courseName);
        const updated = [newCert, ...filtered];
        try {
          localStorage.setItem(`plc_earned_certificates_${sId}`, JSON.stringify(updated));

          // Also sync to sms_certificates so Admin tab sees it immediately
          const savedAdmin = localStorage.getItem("sms_certificates");
          let adminCerts = savedAdmin ? JSON.parse(savedAdmin) : [];
          const adminCertObj = {
            id: newCert.id,
            studentId: sId,
            studentNameKh: sNameKh,
            studentNameEn: sNameEn,
            courseName: newCert.courseName,
            issueDate: new Date().toISOString().split('T')[0],
            certificateNumber: newCert.certNumber,
            grade: newCert.grade,
            status: "issued"
          };
          adminCerts = [adminCertObj, ...adminCerts.filter((c: any) => c.certificateNumber !== newCert.certNumber)];
          localStorage.setItem("sms_certificates", JSON.stringify(adminCerts));

          window.dispatchEvent(new CustomEvent("plc_certificate_earned", { detail: newCert }));
          window.dispatchEvent(new CustomEvent("sms_certificates_updated"));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    try {
      const res = await fetch("/api/portal/leave-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: data?.id || selectedStudentId,
          startDate: leaveStartDate,
          endDate: leaveEndDate,
          type: leaveType,
          reason: leaveReason,
          guardianPhone: leaveGuardianPhone
        })
      });
      const resText = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(resText);
      } catch {
        throw new Error("ប្រព័ន្ធមានបញ្ហា ឬមមាញឹក (Rate limit exceeded) សូមព្យាយាមម្ដងទៀត!");
      }
      if (json.success) {
        setIsLeaveSubmitted(true);
        const newReq = {
          id: json.leaveRequest?.id || `LR-00${leaveRequestsList.length + 1}`,
          dateRange: `${leaveStartDate} ដល់ ${leaveEndDate}`,
          type: leaveType,
          days: "1 ថ្ងៃ",
          reason: leaveReason,
          status: "PENDING",
          statusKh: "កំពុងពិនិត្យ",
        };
        setLeaveRequestsList((prev) => [newReq, ...prev]);
        window.dispatchEvent(new CustomEvent("sms_leave_requests_updated"));
      }
    } catch (err) {
      console.error(err);
      alert("មានបញ្ហាក្នុងការបញ្ជូនសំណើ! សូមព្យាយាមម្ដងទៀត។");
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className={`w-10 h-10 animate-spin ${themeCfg.textColor}`} />
        <span className="text-xs font-black text-slate-500 mt-3 uppercase tracking-wider">
          កំពុងទាញយកទិន្នន័យពីប្រព័ន្ធ...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] p-4 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h2 className="text-base font-black text-slate-800 mb-2 font-serif">មានបញ្ហាក្នុងការទាញយកទិន្នន័យ</h2>
          <p className="text-sm text-slate-500 mb-6 font-medium">{error || "រកមិនឃើញទិន្នន័យសិស្សទេ!"}</p>
          {onBackToLogin && (
            <button
              onClick={onBackToLogin}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              ត្រឡប់ទៅទំព័រចូល (Back to Login)
            </button>
          )}
        </div>
      </div>
    );
  }

  // Children / Students List from Actual System Database
  const childrenList = (data?.children && data.children.length > 0)
    ? data.children
    : (data ? [{
        id: data.id || "student-1",
        studentId: data.studentId || "",
        nameKh: data.nameKh || `${data.lastNameKh || ''} ${data.firstNameKh || ''}`.trim() || data.nameEn || "សិស្ស",
        photoUrl: data.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nameKh || 'សិស្ស')}&background=0D8ABC&color=fff`,
        course: data.course || "ថ្នាក់សិក្សា",
        level: data.level || ""
      }] : []);

  // Current active student profile from system
  const currentStudentName = data?.nameKh || `${data?.lastNameKh || ''} ${data?.firstNameKh || ''}`.trim() || data?.nameEn || "មិនមានឈ្មោះ";
  const currentStudentId = data?.studentId || data?.id || selectedStudentId || "N/A";
  const currentClassName = data?.course ? (data.level && data.course.toLowerCase().includes(data.level.toLowerCase()) ? data.course : `${data.course} ${data.level || ''}`.trim()) : "មិនមានវគ្គសិក្សា";

  // Dynamic attendance rate calculation from real system attendance records
  const calcAttendanceRate = (() => {
    if (data?.attendances && Array.isArray(data.attendances) && data.attendances.length > 0) {
      const presentCount = data.attendances.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE' || a.status === 'PERMISSION').length;
      return `${Math.round((presentCount / data.attendances.length) * 100)}%`;
    }
    return "0%";
  })();

  // Dynamic overall grade calculation from real system scores/records
  const calcOverallGrade = (() => {
    if (data?.grade) return data.grade;
    if (data?.scores && Array.isArray(data.scores) && data.scores.length > 0) {
      const latest = data.scores[0];
      if (latest.grade) return latest.grade;
      if (latest.score >= 85) return "ល្អប្រសើរ (A)";
      if (latest.score >= 75) return "ល្អ (B)";
      if (latest.score >= 50) return "មធ្យម (C)";
      return "ធ្លាក់ (F)";
    }
    return "មិនទាន់មាន";
  })();

  // Filter course exams based on student's enrolled course/skill
  const isStudentCourseExam = (exam: any) => {
    const studentCourseStr = `${data?.course || ''} ${data?.subject || ''} ${currentClassName}`.toLowerCase();
    const examCourseStr = `${exam.courseName || ''} ${exam.courseNameEn || ''} ${exam.subject || ''}`.toLowerCase();

    if (studentCourseStr.includes("graphic") || studentCourseStr.includes("ក្រាហ្វិក") || studentCourseStr.includes("photoshop")) {
      return examCourseStr.includes("graphic") || examCourseStr.includes("ក្រាហ្វិក") || examCourseStr.includes("photoshop");
    }
    if (studentCourseStr.includes("office") || studentCourseStr.includes("រដ្ឋបាល") || studentCourseStr.includes("excel") || studentCourseStr.includes("word") || studentCourseStr.includes("admin")) {
      return examCourseStr.includes("office") || examCourseStr.includes("រដ្ឋបាល") || examCourseStr.includes("excel") || examCourseStr.includes("word") || examCourseStr.includes("admin");
    }
    if (studentCourseStr.includes("web") || studentCourseStr.includes("គេហទំព័រ") || studentCourseStr.includes("html") || studentCourseStr.includes("react") || studentCourseStr.includes("coding")) {
      return examCourseStr.includes("web") || examCourseStr.includes("គេហទំព័រ") || examCourseStr.includes("html") || examCourseStr.includes("react") || examCourseStr.includes("coding");
    }

    if (!data?.course && currentClassName === "ថ្នាក់សិក្សា") return true;

    return (
      (data?.course && examCourseStr.includes(data.course.toLowerCase())) ||
      (exam.courseName && studentCourseStr.includes(exam.courseName.toLowerCase()))
    );
  };

  let myCourseExams = availableCourseExams.filter(isStudentCourseExam);
  if (data?.course && currentClassName !== "មិនមានវគ្គសិក្សា") {
    if (myCourseExams.length === 0) {
      myCourseExams = [{
        id: `cfe-dynamic-${data.id || "1"}`,
        courseName: `វគ្គ ${currentClassName}`,
        courseNameEn: currentClassName,
        subject: currentClassName,
        duration: 15,
        passingPercent: 50,
        description: `ប្រឡងបញ្ចប់វគ្គ ${currentClassName} ដើម្បីទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការពីសាលា`,
        iconColor: "from-blue-500 to-indigo-600",
        questions: availableCourseExams[0]?.questions || []
      }];
    } else {
      myCourseExams = myCourseExams.map(exam => ({
        ...exam,
        courseName: `វគ្គ ${currentClassName}`,
        courseNameEn: currentClassName,
        subject: currentClassName
      }));
    }
  }
  const displayedCourseExams = myCourseExams;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] font-sans select-none flex flex-col items-center relative pb-16">
      
      {/* MAX WIDTH WRAPPER MATCHING MOBILE DISPLAY */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#ffffff] flex flex-col shadow-2xl relative overflow-hidden border-x border-slate-100">
        
        {/* ========================================================================= */}
        {/* 1. TOP DYNAMIC THEME BANNER HEADER                                       */}
        {/* ========================================================================= */}
        <div className={`w-full ${themeCfg.bannerBg} text-white pt-4 pb-6 px-4 relative z-10 shadow-md border-t-[4px] border-[#5c3a21]`}>
          
          {viewMode === "menu" ? (
            /* MENU VIEW HEADER: Back arrow, "ម៉ឺនុយ", Student Avatar & Info */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setViewMode("overview"); setActiveBottomTab("home"); }}
                    className="p-1 -ml-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                  </button>
                  <h1 className="text-xl font-black text-white font-serif tracking-tight">
                    ម៉ឺនុយ (Menu)
                  </h1>
                </div>

                {/* Right Controls: Removed Bell Notification */}
                <div className="flex items-center gap-2">
                </div>
              </div>

              {/* Student Profile Info Banner inside Theme Header */}
              <div className="flex items-center gap-3.5 pt-1 px-1">
                <div className="w-14 h-14 rounded-full border-2 border-white/90 overflow-hidden bg-slate-200 shrink-0 shadow-sm">
                  <img
                    src={data?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStudentName || 'សិស្ស')}&background=0D8ABC&color=fff`}
                    alt={currentStudentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight font-serif">
                    {currentStudentName}
                  </h2>
                  <p className="text-xs font-mono text-white/90 font-bold mt-0.5 tracking-wide">
                    {currentStudentId}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* OVERVIEW MODE HEADER: School Seal & Bell / Profile Icons */
            <div className="flex items-center justify-between">
              {/* School Logo Seal & Khmer Title */}
              <div className="flex items-center gap-3.5">
                <div className="w-[52px] h-[52px] rounded-full border-[2.5px] border-[#fbbf24] shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative box-border" style={{ backgroundColor: themeCfg.primaryColor }}>
                  {sysSettings?.schoolLogo ? (
                    <img src={sysSettings.schoolLogo} alt="School Logo" className="w-full h-full object-contain p-0.5 bg-white" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-1.5 text-center">
                      <svg className="w-full h-full text-[#fbbf24] drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h1 
                    className="text-[17px] sm:text-[19px] text-white leading-tight drop-shadow-xs"
                    style={{ fontFamily: "'Khmer OS Muol Light', 'Moul', 'Khmer OS Muol', serif", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  >
                    {sysSettings?.schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                  </h1>
                  <p 
                    className="text-[13.5px] sm:text-[14.5px] text-[#fde047] tracking-[0.03em] font-black leading-none mt-1.5 drop-shadow-xs uppercase"
                    style={{ fontFamily: "'Roboto Slab', 'Courier New', serif", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  >
                    {sysSettings?.schoolName || "PLC Computer School"}
                  </p>
                </div>
              </div>
              {/* Right Icons: Removed Bell Notification & Parent Avatar */}
              <div className="flex items-center gap-2 sm:gap-2.5">
              </div>
            </div>
          )}
        </div>
        {/* ========================================================================= */}
        {/* VIEW MODE A: STUDENT PORTAL HOME (OVERVIEW SCREEN)                        */}
        {/* ========================================================================= */}
        {viewMode === "overview" ? (
          <div className="flex-1 w-full bg-[#f8fafc] px-4 pt-4 pb-24 space-y-4 overflow-y-auto">
            {/* 1. Student Info Card */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 relative overflow-hidden">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full border-2 border-amber-400 overflow-hidden bg-slate-100 shrink-0 shadow-xs">
                  <img
                    src={data?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStudentName || 'សិស្ស')}&background=0D8ABC&color=fff`}
                    alt={currentStudentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      សិស្សសកម្ម (Verified)
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{currentStudentId}</span>
                  </div>
                  <h2 className="text-base font-black text-slate-800 font-serif leading-tight mt-1 truncate flex items-center gap-1.5">
                    <span>{currentStudentName}</span>
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-xs font-medium text-slate-500">
                      {currentClassName}
                    </p>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md font-medium border border-slate-200/60">
                      🔒 ឈ្មោះត្រូវបានការពារ (មិនអាចកែបាន)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Summary Stats Bar */}
              <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 text-center text-xs">
                <div className="bg-blue-50/70 p-2 rounded-xl">
                  <span className="text-[10px] font-bold text-blue-600 block">វត្តមានសរុប</span>
                  <span className="font-black text-blue-900 text-sm">{calcAttendanceRate}</span>
                </div>
                <div className="bg-amber-50/70 p-2 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-600 block">វិញ្ញាបនបត្រ</span>
                  <span className="font-black text-amber-900 text-sm">{earnedCertificatesList.length}</span>
                </div>
                <div className="bg-emerald-50/70 p-2 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-600 block">និទ្ទេសសរុប</span>
                  <span className="font-black text-emerald-900 text-sm">{calcOverallGrade}</span>
                </div>
              </div>
            </div>

            {/* 2. Highlight Banner: Course Final Exam & Certificate */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-5 h-5 text-amber-300 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                    ប្រឡងបញ្ចប់វគ្គ & វិញ្ញាបនបត្រ
                  </span>
                </div>
                <h3 className="text-sm font-black text-white font-serif mb-1">
                  ប្រឡងបញ្ចប់វគ្គសិក្សាដើម្បីទទួលបានវិញ្ញាបនបត្រ
                </h3>
                <p className="text-[11px] text-blue-100 leading-relaxed mb-3 opacity-90">
                  ឆ្លើយសំណួរប្រឡងឱ្យបាន ≥ 50% ដើម្បីទាញយកវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការដែលបានកំណត់ដោយ Admin
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCourseFinalExamModalOpen(true)}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>ចូលប្រឡងបញ្ចប់វគ្គ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEarnedCertificatesModalOpen(true)}
                    className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-white/20"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>វិញ្ញាបនបត្រ ({earnedCertificatesList.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Main Quick Action Grid */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5 px-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                សេវាកម្ម និងប្រព័ន្ធសិក្សា
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Final Exam */}
                <button
                  type="button"
                  onClick={() => setIsCourseFinalExamModalOpen(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 block">ប្រឡងបញ្ចប់វគ្គ</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">សំណួរប្រឡង និងលក្ខខណ្ឌជាប់ ≥ 50%</p>
                  </div>
                </button>

                {/* Earned Certificates */}
                <button
                  type="button"
                  onClick={() => setIsEarnedCertificatesModalOpen(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 block">វិញ្ញាបនបត្រ</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">ទាញយកវិញ្ញាបនបត្រផ្លូវការ</p>
                  </div>
                </button>

                {/* Attendance */}
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 block">បញ្ជីវត្តមាន</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">កំណត់ត្រាវត្តមានរៀងរាល់ថ្ងៃ</p>
                  </div>
                </button>

                {/* Exam Scores */}
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <CheckCircle className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 block">លទ្ធផលប្រឡង</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">ពិន្ទុ និងនិទ្ទេសប្រចាំខែ</p>
                  </div>
                </button>

                {/* Timetable */}
                <button
                  type="button"
                  onClick={() => setIsClassesModalOpen(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <Clock className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 block">កាលវិភាគសិក្សា</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">ម៉ោងសិក្សា និងបន្ទប់</p>
                  </div>
                </button>

                {/* Leave Requests */}
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-400 transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 block">ពាក្យសុំច្បាប់</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">ដាក់ពាក្យសុំច្បាប់ឈប់សម្រាក</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Latest Announcements Section */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-600 shrink-0" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    សេចក្តីជូនដំណឹងសាលា
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  មើលទាំងអស់
                </button>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="inline-block text-[9.5px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md mb-1">
                  ជូនដំណឹងសំខាន់
                </span>
                <h4 className="text-xs font-bold text-slate-800">ការប្រឡងបញ្ចប់វគ្គសិក្សា និងទទួលវិញ្ញាបនបត្រ</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  សិស្សទាំងអស់អាចចូលប្រឡងបញ្ចប់វគ្គតាមផ្នែកនីមួយៗក្នុងប្រព័ន្ធនេះបាន។ នៅពេលប្រឡងជាប់ចាប់ពី ៥០% ឡើងទៅ ប្រព័ន្ធនឹងចេញវិញ្ញាបនបត្រផ្លូវការជូនភ្លាមៗ។
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE B: DETAILED STUDENT MENU VIEW */
          <div className="flex-1 w-full bg-[#f8fafc] pt-4 px-4 pb-24 space-y-4 overflow-y-auto">
            {/* Student Profile Quick Banner */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={data?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStudentName || 'សិស្ស')}&background=0D8ABC&color=fff`}
                  alt={currentStudentName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-800 font-serif truncate">{currentStudentName}</h3>
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-400 font-mono">{currentStudentId}</p>
                  <span className="text-[9.5px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    🔒 ឈ្មោះត្រូវបានការពារ (មិនអាចកែបាន)
                  </span>
                </div>
              </div>
            </div>

            {/* Academic & Exam Menu Group */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                ការប្រឡង និងវិញ្ញាបនបត្រ (Exams & Certificates)
              </div>
              <div className="divide-y divide-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCourseFinalExamModalOpen(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">ប្រឡងបញ្ចប់វគ្គសិក្សា</span>
                      <span className="text-[10px] text-slate-400">ប្រឡងយកវិញ្ញាបនបត្រ (≥ 50%)</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsEarnedCertificatesModalOpen(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">វិញ្ញាបនបត្រទទួលបាន</span>
                      <span className="text-[10px] text-slate-400">ទស្សនា & បោះពុម្ពវិញ្ញាបនបត្រ</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">លទ្ធផលប្រឡង</span>
                      <span className="text-[10px] text-slate-400">របាយការណ៍ពិន្ទុ និងនិទ្ទេស</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* School Services Group */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                សេវាកម្មសាលារៀន (School Services)
              </div>
              <div className="divide-y divide-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">បញ្ជីវត្តមាន</span>
                      <span className="text-[10px] text-slate-400">ពិនិត្យវត្តមាន និងអវត្តមាន</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsClassesModalOpen(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">កាលវិភាគសិក្សា</span>
                      <span className="text-[10px] text-slate-400">ម៉ោងសិក្សាប្រចាំសប្ដាហ៍</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">ពាក្យសុំច្បាប់</span>
                      <span className="text-[10px] text-slate-400">ស្នើសុំច្បាប់ឈប់សម្រាក</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">សេចក្តីជូនដំណឹង</span>
                      <span className="text-[10px] text-slate-400">ដំណឹងផ្លូវការពីសាលា</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Back / Exit Button */}
            {onBackToLogin && (
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ចាកចេញ / ត្រឡប់ទៅទំព័រដើម</span>
              </button>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. FIXED BOTTOM NAVIGATION BAR                                            */}
        {/* ========================================================================= */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 shadow-lg z-30 flex items-center justify-around py-2.5 px-2">
          
          {/* TAB 1: ទំព័រដើម (Home) */}
          <button
            type="button"
            onClick={() => { setActiveBottomTab("home"); setViewMode("overview"); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeBottomTab === "home" ? themeCfg.textColor : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-[10px] font-black tracking-tight">ទំព័រដើម</span>
          </button>

          {/* TAB 3: សេចក្តីជូនដំណឹង (Announcements) */}
          <button
            type="button"
            onClick={() => { setActiveBottomTab("announcements"); setIsNotificationModalOpen(true); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeBottomTab === "announcements" ? themeCfg.textColor : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Megaphone className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight">សេចក្តីជូនដំណឹង</span>
          </button>

          {/* TAB 4: ម៉ឺនុយ (Menu) */}
          <button
            type="button"
            onClick={() => { setActiveBottomTab("info"); setViewMode("menu"); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeBottomTab === "info" ? themeCfg.textColor : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight">ម៉ឺនុយ</span>
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 2: បញ្ជីវត្តមាន (ATTENDANCE LOG)                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAttendanceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Calendar className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">បញ្ជីវត្តមាន (Attendance Records)</h3>
                  <p className="text-xs text-slate-400 font-medium">កំណត់ត្រាវត្តមានផ្ទាល់ពីប្រព័ន្ធសាលា</p>
                </div>
              </div>

              {/* Attendance Statistics Summary */}
              {(() => {
                const attendancesList = data?.attendances || [];

                const totalPresent = attendancesList.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length;
                const totalAbsent = attendancesList.filter((a: any) => a.status === 'ABSENT').length;
                const totalPermission = attendancesList.filter((a: any) => a.status === 'PERMISSION' || a.status === 'LEAVE' || a.status === 'ABSENT_WITH_PERMISSION').length;

                return (
                  <>
                    <div className="bg-[#f4f5f7] p-4 rounded-2xl border border-slate-200/80 flex items-center justify-around mb-4 text-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">វត្តមាន</span>
                        <span className="text-base font-black text-emerald-600">{totalPresent} ថ្ងៃ</span>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-300" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">អវត្តមាន</span>
                        <span className="text-base font-black text-rose-600">{totalAbsent} ថ្ងៃ</span>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-300" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">មានច្បាប់</span>
                        <span className="text-base font-black text-amber-600">{totalPermission} ថ្ងៃ</span>
                      </div>
                    </div>

                    {/* Attendance List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {attendancesList.length > 0 ? attendancesList.map((item: any, idx: number) => {
                        const isPresent = item.status === "PRESENT" || item.status === "LATE";
                        const isPermission = item.status === "PERMISSION" || item.status === "LEAVE" || item.status === "ABSENT_WITH_PERMISSION";
                        const dateStr = item.date ? new Date(item.date).toLocaleDateString("km-KH", { year: 'numeric', month: 'long', day: 'numeric' }) : `ថ្ងៃទី ${20 - idx} កក្កដា ២០២៦`;

                        return (
                          <div key={item.id || idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                isPresent ? "bg-emerald-100 text-emerald-700" : isPermission ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                              }`}>
                                {isPresent ? <CheckCircle className="w-4 h-4" /> : isPermission ? <Clock className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="font-black text-slate-800 block">{dateStr}</span>
                                <span className="text-[10.5px] text-slate-400">
                                  {item.reason || (isPresent ? "ម៉ោង 08:00 AM - 11:00 AM" : "សុំច្បាប់")}
                                </span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase ${
                              isPresent ? "bg-emerald-100 text-emerald-800" : isPermission ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                            }`}>
                              {isPresent ? "វត្តមាន" : isPermission ? "មានច្បាប់" : "អវត្តមាន"}
                            </span>
                          </div>
                        );
                      }) : (
                        <div className="text-center py-8">
                          <p className="text-xs text-slate-500 font-bold">មិនទាន់មានកំណត់ត្រាវត្តមានទេ</p>
                        </div>
                        )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: លទ្ធផលប្រឡង (EXAM RESULTS & REPORT CARD)                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isExamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Award className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">លទ្ធផលប្រឡង (Exam Results)</h3>
                  <p className="text-xs text-slate-400 font-medium">របាយការណ៍ពិន្ទុ និងនិទ្ទេសប្រចាំខែ/ឆមាស</p>
                </div>
              </div>

              {/* Overall Score Summary */}
              {(() => {
                const scoreRecords = data?.scores || [];

                const totalScore = scoreRecords.reduce((acc: number, curr: any) => acc + (Number(curr.score) || 0), 0);
                const avgScore = scoreRecords.length > 0 ? (totalScore / scoreRecords.length).toFixed(1) : "0";
                const overallGrade = Number(avgScore) >= 95 ? "A+" : Number(avgScore) >= 85 ? "A" : Number(avgScore) >= 75 ? "B" : "C";

                return (
                  <>
                    <div className={`${themeCfg.cardGradient} text-white p-4.5 rounded-2xl shadow-md space-y-2 mb-4`}>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-rose-200 font-bold uppercase">ឆមាសទី១ - ២០២៦</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-black text-[10px]">
                          ចំណាត់ថ្នាក់លេខ ១
                        </span>
                      </div>
                      <div className="flex justify-between items-end pt-1">
                        <div>
                          <span className="text-2xl font-black font-mono text-white">{avgScore}</span>
                          <span className="text-xs text-rose-200 font-bold"> / 100</span>
                        </div>
                        <span className="text-xl font-black text-amber-300 font-serif">និទ្ទេស {overallGrade}</span>
                      </div>
                    </div>

                    {/* Subject Breakdown */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      <h4 className="text-xs font-black text-slate-800">ពិន្ទុតាមមុខវិជ្ជា៖</h4>
                      {scoreRecords.length > 0 ? scoreRecords.map((sc: any, idx: number) => (
                        <div key={sc.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">{idx + 1}. {sc.subject}</span>
                          <span className="font-mono font-black text-emerald-600">{sc.score} / {sc.maxScore || 100} ({sc.grade || "A+"})</span>
                        </div>
                      )) : (
                        <div className="text-center py-6">
                          <p className="text-xs text-slate-500 font-bold">មិនទាន់មានលទ្ធផលប្រឡងទេ</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: តារាងកិត្តិយស (HONOR ROLL BOARD)                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isHonorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsHonorModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Star className="w-6 h-6 stroke-[2] text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">តារាងកិត្តិយស (Honor Roll)</h3>
                  <p className="text-xs text-slate-400 font-medium">សិស្សឆ្នើមប្រចាំខែកក្កដា ២០២៦</p>
                </div>
              </div>

              {/* Honor Student Certificate Card */}
              {(() => {
                const honorStudents = data?.honorRollStudents || [];

                const top1 = honorStudents[0] || {};

                return (
                  <div className="space-y-3">
                    <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 text-center space-y-3 mb-2">
                      <div className="w-20 h-20 mx-auto rounded-full border-4 border-amber-400 overflow-hidden shadow-lg bg-white">
                        <img src={top1.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent('សិស្ស')}&background=0D8ABC&color=fff`} alt={top1.nameKh || ""} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 font-serif">{top1.nameKh || "សិស្ស"}</h4>
                        <p className={`text-xs font-bold ${themeCfg.textColor}`}>{top1.course || currentClassName}</p>
                      </div>
                      <div className="bg-white/80 py-1.5 px-3 rounded-full border border-amber-300 inline-block text-xs font-black text-amber-800">
                        🏆 សិស្សពូកែទូទាំងសាលា ចំណាត់ថ្នាក់លេខ ១
                      </div>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      <h4 className="text-xs font-black text-slate-800 font-serif">បញ្ជីសិស្សឆ្នើមប្រចាំខែ ({honorStudents.length})</h4>
                      {honorStudents.map((st: any, idx: number) => (
                        <div key={st?.id || idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                            idx === 0 ? "bg-amber-400 text-slate-900" : idx === 1 ? "bg-slate-300 text-slate-800" : idx === 2 ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                            <img src={st?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(st?.nameKh || 'សិស្ស')}&background=0D8ABC&color=fff`} alt={st?.nameKh || ""} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <h5 className="font-black text-slate-800 truncate">{st?.nameKh || st?.nameEn || "សិស្ស"}</h5>
                            <p className="text-[10px] text-slate-400">{st?.course || "ថ្នាក់ទូទៅ"}</p>
                          </div>
                          <span className="text-xs font-mono font-black text-emerald-600">{st?.gpa || "98% (A+)"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 5: វិក្កយបត្រ (INVOICE & FEE)                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">វិក្កយបត្រថ្លៃសិក្សា (Invoices)</h3>
                  <p className="text-xs text-slate-400 font-medium">ស្ថានភាពបង់ប្រាក់ និងវិក្កយបត្រផ្លូវការ</p>
                </div>
              </div>

              {/* Fee Summary */}
              {(() => {
                const baseTuition = data?.baseFee ? Number(data.baseFee) : 120;
                const discountVal = data?.discount ? Number(data.discount) : 0;
                const netTuition = Math.max(0, baseTuition - discountVal);

                const paymentsList = data?.invoices || [];

                const totalPaid = paymentsList.filter((p: any) => p.status === 'PAID' || p.status === 'APPROVED' || p.status === 'SUCCESS').reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
                const balanceDue = Math.max(0, netTuition - totalPaid);

                return (
                  <>
                    <div className={`${themeCfg.cardGradient} text-white p-4.5 rounded-2xl shadow-md space-y-2 mb-4`}>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-rose-200 font-bold uppercase">ថ្លៃសិក្សាសរុប</span>
                        <span className="font-mono font-bold">${netTuition.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 flex justify-between items-center">
                        <span className="text-sm font-black text-white">ប្រាក់ត្រូវបង់ (Balance Due)</span>
                        <span className="text-lg font-black text-amber-300 font-mono">${balanceDue.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {paymentsList.length > 0 ? paymentsList.map((inv: any, idx: number) => {
                        const invNo = inv.invoiceNumber || `INV-2026-0${idx + 101}`;
                        const dateStr = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("km-KH") : "01/07/2026";
                        const isPaid = inv.status === "PAID" || inv.status === "APPROVED" || inv.status === "SUCCESS";

                        return (
                          <div key={inv.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-black text-slate-800 block">{invNo}</span>
                              <span className="text-[10.5px] text-slate-400">{dateStr} • {inv.feeType || "ថ្លៃសិក្សា"}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-black font-mono text-slate-800 block">${Number(inv.amount || netTuition).toFixed(2)}</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {isPaid ? "បានបង់រួច (PAID)" : "រង់ចាំបង់ (PENDING)"}
                              </span>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="text-center py-6">
                          <p className="text-xs text-slate-500 font-bold">មិនទាន់មានវិក្កយបត្រទេ</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 6: ប្រវត្តិការបង់ប្រាក់ (PAYMENT HISTORY)                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPaymentHistoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsPaymentHistoryModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <CreditCard className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">ប្រវត្តិការបង់ប្រាក់ (Payment History)</h3>
                  <p className="text-xs text-slate-400 font-medium">កំណត់ត្រាប្រតិបត្តិការបង់ប្រាក់កន្លងមក</p>
                </div>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(() => {
                  const paymentHistoryList = data?.payments && data.payments.length > 0 ? data.payments : [
                    {
                      id: "pay-1",
                      receiptNumber: "REC-2026-001",
                      paymentMethod: "ABA KHQR",
                      amount: data?.baseFee ? Number(data.baseFee) : 120,
                      status: "APPROVED",
                      createdAt: new Date().toISOString()
                    }
                  ];

                  return paymentHistoryList.map((pay: any, idx: number) => {
                    const recNo = pay.receiptNumber || `REC-2026-00${idx + 1}`;
                    const method = pay.paymentMethod || "ABA KHQR";
                    const dateStr = pay.createdAt ? new Date(pay.createdAt).toLocaleDateString("km-KH") : "01/07/2026";
                    const amountVal = pay.amount ? Number(pay.amount).toFixed(2) : "120.00";

                    return (
                      <div key={pay.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-black text-slate-800 block">បង្កាន់ដៃលេខ: {recNo}</span>
                          <span className="text-[10.5px] text-slate-400">{dateStr} ({method})</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black font-mono text-emerald-600 block text-sm">+${amountVal}</span>
                          <span className="text-[10px] text-emerald-600 font-bold">ជោគជ័យ</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 7: សេចក្តីជូនដំណឹង (NOTIFICATION MODAL)                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isNotificationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsNotificationModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${themeCfg.primaryBg} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Bell className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">សេចក្តីជូនដំណឹង (Notifications)</h3>
                  <p className="text-xs text-slate-400 font-medium">ព័ត៌មាន និងការជូនដំណឹងពីសាលារៀន</p>
                </div>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(() => {
                  const announcementsList = data?.announcements && data.announcements.length > 0 ? data.announcements : [
                    {
                      id: "ann-1",
                      title: "📢 ជូនដំណឹងអំពីការឈប់សម្រាក",
                      sentAt: "២ ម៉ោងមុន",
                      content: `${sysSettings?.schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"} សូមជូនដំណឹងដល់អាណាព្យាបាលសិស្សទាំងអស់អំពីការឈប់សម្រាកក្នុងឱកាសពិធីបុណ្យភ្ជុំបិណ្ឌខាងមុខនេះ...`
                    },
                    {
                      id: "ann-2",
                      title: "📝 កាលវិភាគប្រឡងឆមាស",
                      sentAt: "ម្សិលមិញ",
                      content: "សូមជម្រាបជូនអំពីកាលវិភាគប្រឡងឆមាសទី១ សម្រាប់សិស្សានុសិស្សគ្រប់កម្រិតថ្នាក់ សូមអាណាព្យាបាលជួយរំលឹកសិស្សឱ្យខិតខំរៀនសូត្រ..."
                    }
                  ];

                  return announcementsList.map((ann: any, idx: number) => (
                    <div key={ann.id || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-black ${themeCfg.textColor}`}>{ann.title}</span>
                        <span className="text-[10px] font-bold text-slate-400">{ann.sentAt || "ថ្មីៗ"}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {ann.content}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 11: សុំច្បាប់ (LEAVE PERMISSION REQUEST MODAL)                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isLeaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  setIsLeaveSubmitted(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header with Whistle/Timer Icon */}
              <div className="flex items-center gap-3.5 mb-4 shrink-0 pr-8">
                <Clock className={`w-12 h-12 shrink-0 drop-shadow-xs text-[${themeCfg.primaryColor}]`} />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-serif leading-tight">
                    ទម្រង់សុំច្បាប់ឈប់សម្រាក (Leave Request)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ផ្ញើសំណើទៅកាន់នាយកដ្ឋានសិក្សា និងគ្រូបន្ទុកថ្នាក់
                  </p>
                </div>
              </div>

              {/* Success Notification Banner */}
              {isLeaveSubmitted ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3 my-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-emerald-900 font-serif">
                      សំណើសុំច្បាប់ត្រូវបានផ្ញើដោយជោគជ័យ!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      ព័ត៌មាននៃការសុំច្បាប់ត្រូវបានបញ្ជូនទៅកាន់គ្រូបន្ទុកថ្នាក់ និងលោកនាយក${sysSettings?.schoolKhmerName || "សាលា"}ដើម្បីពិនិត្យ និងអនុម័ត។
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLeaveSubmitted(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    បង្កើតសំណើសុំច្បាប់ថ្មីទៀត
                  </button>
                </motion.div>
              ) : (
                /* Leave Request Form */
                <form
                  onSubmit={handleLeaveSubmit}
                  className="space-y-4"
                >
                  {/* Student Info Box */}
                  <div className="p-3.5 rounded-2xl flex items-center gap-3" style={{ backgroundColor: `${themeCfg.primaryColor}0d`, borderColor: `${themeCfg.primaryColor}33`, borderWidth: '1px' }}>
                    <div className="w-11 h-11 rounded-full border-2 overflow-hidden bg-slate-200 shrink-0" style={{ borderColor: themeCfg.primaryColor }}>
                      <img src={data?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStudentName || 'សិស្ស')}&background=0D8ABC&color=fff`} alt={currentStudentName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] font-bold ${themeCfg.textColor} uppercase tracking-wider block`}>
                        សិស្សសុំច្បាប់
                      </span>
                      <h4 className="text-sm font-black text-slate-800 truncate font-serif">
                        {currentStudentName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {currentClassName} • ID: {currentStudentId}
                      </p>
                    </div>
                  </div>

                  {/* Leave Type Options */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">
                      ប្រភេទនៃការសុំច្បាប់ <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "ឈឺ (Sick Leave)", label: "🤒 ឈឺ" },
                        { id: "ធុរៈផ្ទាល់ខ្លួន (Personal)", label: "🏡 ធុរៈផ្ទាល់ខ្លួន" },
                        { id: "ផ្សេងៗ (Other)", label: "📝 ផ្សេងៗ" },
                      ].map((t) => {
                        const isSelected = leaveType === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setLeaveType(t.id)}
                            className={`p-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
                              isSelected
                                ? `${themeCfg.primaryBg} text-white shadow-xs`
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-700 block">
                        ចាប់ពីថ្ងៃទី <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={leaveStartDate ?? ""}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-700 block">
                        ដល់ថ្ងៃទី <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={leaveEndDate ?? ""}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Reason Textarea */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 block">
                      មូលហេតុនៃការសុំច្បាប់ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={leaveReason ?? ""}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="សូមរៀបរាប់ពីមូលហេតុនៃការសុំច្បាប់ (ឧទាហរណ៍៖ សិស្សមានអាការៈក្តៅខ្លួន និងឈឺក្បាល...)"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Guardian Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 block">
                      លេខទូរស័ព្ទទំនាក់ទំនងអាណាព្យាបាល
                    </label>
                    <input
                      type="text"
                      value={leaveGuardianPhone ?? ""}
                      onChange={(e) => setLeaveGuardianPhone(e.target.value)}
                      placeholder={sysSettings?.schoolPhone || "087 850 014 / 097 501 3648"}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
                    />
                  </div>

                  {/* Attach Medical/Doctor Note (Optional) */}
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-1.5">
                    <span className="text-xs font-bold text-slate-600 block">
                      📎 បញ្ជូនលិខិតបញ្ជាក់ពីគ្រូពេទ្យ ឬឯកសារពាក់ព័ន្ធ (ជម្រើសបន្ថែម)
                    </span>
                    <button
                      type="button"
                      onClick={() => alert("លោកអ្នកអាចថតរូប ឬជ្រើសរើសលិខិតបញ្ជាក់ពីគ្រូពេទ្យដើម្បីភ្ជាប់ជាមួយសំណើ។")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-[11px] font-black text-slate-700 cursor-pointer shadow-2xs"
                    >
                      + បន្ថែមរូបភាពលិខិតបញ្ជាក់
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full py-3.5 ${themeCfg.primaryBg} hover:opacity-90 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98`}
                  >
                    <Send className="w-4 h-4" />
                    <span>ផ្ញើសំណើសុំច្បាប់ (Submit Request)</span>
                  </button>
                </form>
              )}

              {/* Past Leave Requests History */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2.5">
                <h4 className="text-xs font-black text-slate-800 font-serif flex items-center justify-between">
                  <span>ប្រវត្តិសុំច្បាប់កន្លងមក ({leaveRequestsList.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">ប្រព័ន្ធស្វ័យប្រវត្តិ</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {leaveRequestsList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-black ${themeCfg.textColor}`}>{item.type}</span>
                          <span className="text-[10px] font-bold text-slate-400">• {item.dateRange}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{item.reason}</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.statusKh}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 12: ថ្នាក់រៀនទាំងអស់ (ALL ENROLLED CLASSES MODAL)                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isClassesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsClassesModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3.5 mb-5 shrink-0 pr-8">
                <Folder className={`w-12 h-12 shrink-0 drop-shadow-xs text-[${themeCfg.primaryColor}]`} />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-serif leading-tight">
                    បញ្ជីថ្នាក់រៀនទាំងអស់ (All Classes)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ព័ត៌មានថ្នាក់រៀន កាលវិភាគ និងគ្រូបន្ទុកថ្នាក់របស់សិស្ស
                  </p>
                </div>
              </div>

              {/* Student Header Card */}
              <div className="p-3.5 rounded-2xl flex items-center gap-3 mb-4" style={{ backgroundColor: `${themeCfg.primaryColor}0d`, borderColor: `${themeCfg.primaryColor}33`, borderWidth: '1px' }}>
                <div className="w-12 h-12 rounded-full border-2 overflow-hidden bg-slate-200 shrink-0" style={{ borderColor: themeCfg.primaryColor }}>
                  <img src={data?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStudentName || 'សិស្ស')}&background=0D8ABC&color=fff`} alt={currentStudentName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold ${themeCfg.textColor} uppercase tracking-wider block`}>
                    សិស្សចុះឈ្មោះរៀន
                  </span>
                  <h4 className="text-sm font-black text-slate-800 truncate font-serif">
                    {currentStudentName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    អត្តលេខ៖ {currentStudentId} • {sysSettings?.schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                  </p>
                </div>
              </div>

              {/* List of Enrolled Classes */}
                            <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 font-serif uppercase tracking-wider">
                  ថ្នាក់កំពុងសិក្សាសរុប ({data?.enrollments?.length || 0} ថ្នាក់)
                </h4>

                {(!data?.enrollments || data.enrollments.length === 0) ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Folder className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">មិនទាន់មានថ្នាក់រៀនទេ</p>
                  </div>
                ) : (
                  data.enrollments.map((enrollment: any, idx: number) => {
                    const course = enrollment.course || {};
                    const teacher = course.teacher || {};
                    const teacherName = teacher.nameKh || teacher.nameEn || "មិនបញ្ជាក់";
                    const statusText = enrollment.status === "ENROLLED" ? "កំពុងសិក្សា" : 
                                       enrollment.status === "COMPLETED" ? "បញ្ចប់ការសិក្សា" : "ផ្សេងៗ";
                    const statusColor = enrollment.status === "ENROLLED" ? "bg-emerald-100 text-emerald-800" : 
                                        enrollment.status === "COMPLETED" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800";

                    return (
                      <div key={enrollment.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-black inline-block mb-1">
                              វគ្គសិក្សា
                            </span>
                            <h5 className="text-sm font-black text-slate-800 font-serif">
                              {course.title || currentClassName}
                            </h5>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${statusColor}`}>
                            {statusText}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-400 font-bold block">កាលវិភាគសិក្សា</span>
                            <p className="font-bold text-slate-700">{course.hours || "មិនបញ្ជាក់"}</p>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-400 font-bold block">រយៈពេល</span>
                            <p className="font-bold text-slate-700">{course.duration || "មិនបញ្ជាក់"}</p>
                          </div>
                        </div>

                        <div className="text-xs pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-slate-500 font-medium">គ្រូបន្ទុកថ្នាក់៖ <strong className="text-slate-800">{teacherName}</strong></span>
                          <button
                            type="button"
                            onClick={() => alert(`កាលវិភាគលម្អិតថ្នាក់ ${course.title}៖\nមិនទាន់មានកាលវិភាគលម្អិតទេ`)}
                            className={`px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-black ${themeCfg.textColor} cursor-pointer shadow-2xs`}
                          >
                            មើលកាលវិភាគ ➔
                          </button>
                        </div>
                      </div>
                    );
                  })
                  )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK BANNER SETTINGS MODAL */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm">កំណត់រូបតាំង / រូបបដា</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Banner Preview */}
              <div className="rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-200 shadow-inner">
                <img
                  src={portalCoverImage || DEFAULT_BANNER_IMG}
                  alt="Preview"
                  className="w-full h-32 object-cover opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_BANNER_IMG;
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] font-black text-amber-300 uppercase">
                    {portalBannerTitle || "វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ"}
                  </span>
                  <p className="text-xs font-bold line-clamp-1">
                    {portalBannerSubtitle || "អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធីកុំព្យូទ័រ"}
                  </p>
                </div>
              </div>

              {/* Preset selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">ជ្រើសរើសរូបភាពគំរូស្រាប់</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {bannerPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPortalCoverImage(preset.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer h-12 ${
                        portalCoverImage === preset.url ? "border-amber-500 ring-2 ring-amber-500/30 scale-105" : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* URL or Upload */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">URL រូបភាព</label>
                  <input
                    type="url"
                    value={portalCoverImage ?? ""}
                    onChange={(e) => setPortalCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">ចំណងជើង</label>
                  <input
                    type="text"
                    value={portalBannerTitle ?? ""}
                    onChange={(e) => setPortalBannerTitle(e.target.value)}
                    placeholder="ឧ. វគ្គបណ្តុះបណ្តាលជំនាញកុំព្យូទ័រ"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">អនុចំណងជើង</label>
                  <input
                    type="text"
                    value={portalBannerSubtitle ?? ""}
                    onChange={(e) => setPortalBannerSubtitle(e.target.value)}
                    placeholder="ឧ. អភិវឌ្ឍសមត្ថភាពបច្ចេកវិទ្យាឌីជីថល និងការសរសេរកម្មវិធី"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  onClick={handleSavePortalBanner}
                  disabled={isSavingPortalBanner}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingPortalBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>រក្សាទុក</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 12: COURSE FINAL EXAM SELECTOR MODAL (ប្រឡងបញ្ចប់វគ្គសិក្សា)         */}
        {/* ========================================================================= */}
        {isCourseFinalExamModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsCourseFinalExamModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-4 shrink-0 pr-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-serif leading-tight">
                    ប្រឡងបញ្ចប់វគ្គសិក្សា (Course Final Exams)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ឆ្លើយសំណួរប្រឡងឲ្យបានត្រឹមត្រូវ ≥ 50% ដើម្បីទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការ
                  </p>
                </div>
              </div>

              {/* Enrolled Course Banner Info */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200/80 mb-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 block">មុខជំនាញដែលសិស្សកំពុងរៀន</span>
                    <span className="font-black text-amber-950 font-serif">{currentClassName || data?.course || "ថ្នាក់ទូទៅ"}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-200/60 text-amber-900 rounded-lg text-[10px] font-black shrink-0">
                  {myCourseExams.length} វិញ្ញាសា
                </span>
              </div>

              {/* Course Exam Cards List */}
              <div className="space-y-3.5">
                {displayedCourseExams.length > 0 ? (
                  displayedCourseExams.map((exam) => {
                    const hasPassed = earnedCertificatesList.some(c => c.courseName === exam.courseName);
                    const cert = earnedCertificatesList.find(c => c.courseName === exam.courseName);

                    return (
                      <div
                        key={exam.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-slate-800 font-serif">
                              {exam.courseName}
                            </span>
                            {hasPassed && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                បានប្រឡងជាប់
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-medium line-clamp-2">
                            {exam.description}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium pt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              {exam.duration} នាទី
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-rose-500" />
                              លក្ខខណ្ឌជាប់៖ ≥ {exam.passingPercent}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {hasPassed && cert ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsCourseFinalExamModalOpen(false);
                                setViewingCertificate(cert);
                              }}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>ទស្សនាវិញ្ញាបនបត្រ</span>
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => {
                              setIsCourseFinalExamModalOpen(false);
                              handleStartCourseFinalExam(exam);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{hasPassed ? "ប្រឡងឡើងវិញ" : "ចាប់ផ្ដើមប្រឡង"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-2.5">
                    <p className="text-xs font-bold text-slate-600">
                      មិនទាន់មានវិញ្ញាសាប្រឡងផ្ទាល់សម្រាប់មុខជំនាញ "{currentClassName || data?.course}" នៅឡើយទេ
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 13: ACTIVE COURSE FINAL EXAM TAKING & RESULTS MODAL                  */}
        {/* ========================================================================= */}
        {activeCourseExam && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-6 relative border border-slate-100 max-h-[92vh] overflow-y-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                    ប្រឡងបញ្ចប់វគ្គសិក្សា
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-serif">
                    {activeCourseExam.courseName}
                  </h3>
                </div>

                {!examSubmitted && examTimeLeft !== null && (
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-black">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>
                      {Math.floor(examTimeLeft / 60)}:{(examTimeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveCourseExam(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* IF NOT SUBMITTED: QUESTIONS FORM */}
              {!examSubmitted ? (
                <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                  <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs text-blue-900 font-medium">
                    សូមជ្រើសរើសចម្លើយត្រឹមត្រូវបំផុតសម្រាប់សំណួរនីមួយៗ។ ដើម្បីប្រឡងជាប់ និងទទួលបានវិញ្ញាបនបត្រ អ្នកត្រូវទទួលបានពិន្ទុយ៉ាងតិច <b>{activeCourseExam.passingPercent}%</b>។
                  </div>

                  <div className="space-y-5">
                    {activeCourseExam.questions.map((q: any, idx: number) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed font-serif">
                            {q.text}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pl-8">
                          {q.options.map((opt: string, oIdx: number) => {
                            const isChecked = examAnswers[q.id] === opt;
                            return (
                              <label
                                key={oIdx}
                                onClick={() => handleSelectExamAnswer(q.id, opt)}
                                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-3 cursor-pointer transition-all ${
                                  isChecked
                                    ? "bg-amber-50/90 border-amber-500 text-amber-900 font-bold ring-2 ring-amber-500/20"
                                    : "bg-white border-slate-200 hover:bg-slate-100/70 text-slate-700"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={isChecked}
                                  onChange={() => handleSelectExamAnswer(q.id, opt)}
                                  className="accent-amber-500 w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveCourseExam(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      បោះបង់
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitCourseFinalExam}
                      disabled={Object.keys(examAnswers).length < activeCourseExam.questions.length}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>បញ្ជូនចម្លើយប្រឡង ({Object.keys(examAnswers).length}/{activeCourseExam.questions.length})</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* IF SUBMITTED: RESULT VIEW */
                <div className="space-y-6 text-center py-4">
                  {examScoreResult?.passed ? (
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-emerald-200 animate-bounce">
                        <Trophy className="w-10 h-10" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase text-emerald-600 tracking-widest">
                          អបអរសាទរ! ប្រឡងជាប់ដោយជោគជ័យ
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-serif">
                          អ្នកទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សា!
                        </h3>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-md mx-auto space-y-2">
                        <div className="flex items-center justify-around">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">ពិន្ទុទទួលបាន</span>
                            <p className="text-lg font-black text-emerald-700">
                              {examScoreResult.score} / {examScoreResult.totalPoints} ({examScoreResult.percentage}%)
                            </p>
                          </div>
                          <div className="h-8 w-px bg-emerald-200" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">និទ្ទេសទទួលបាន</span>
                            <p className="text-lg font-black text-amber-600 font-serif">
                              {examScoreResult.grade}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                        ប្រព័ន្ធបានបង្កើត និងចេញផ្សាយ <b>វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា (Certificate of Completion)</b> ដោយស្វ័យប្រវត្តិចូនអ្នករួចរាល់។
                      </p>

                      <div className="flex items-center justify-center gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            const lastCert = earnedCertificatesList[0];
                            setActiveCourseExam(null);
                            if (lastCert) setViewingCertificate(lastCert);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white rounded-2xl text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Award className="w-4 h-4" />
                          <span>ទស្សនា & បោះពុម្ពវិញ្ញាបនបត្រ</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto border-2 border-rose-200">
                        <AlertCircle className="w-8 h-8" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-800 font-serif">
                          សូមព្យាយាមម្ដងទៀត!
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          ពិន្ទុរបស់អ្នក៖ {examScoreResult.score}/{examScoreResult.totalPoints} ({examScoreResult.percentage}%) • ត្រូវទទួលបានយ៉ាងតិច {activeCourseExam.passingPercent}%
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartCourseFinalExam(activeCourseExam)}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-md inline-flex items-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>ប្រឡងឡើងវិញ</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 14: MY EARNED CERTIFICATES MODAL (វិញ្ញាបនបត្រ)             */}
        {/* ========================================================================= */}
        {isEarnedCertificatesModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsEarnedCertificatesModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-5 shrink-0 pr-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-serif leading-tight">
                    វិញ្ញាបនបត្រ (Certificates)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    បញ្ជីវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការដែលទទួលបានតាមវគ្គសិក្សា
                  </p>
                </div>
              </div>

              {earnedCertificatesList.length === 0 ? (
                <div className="text-center py-10 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Award className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">
                    អ្នកមិនទាន់មានវិញ្ញាបនបត្រនៅឡើយទេ។ សូមចូលប្រឡងបញ្ចប់វគ្គដើម្បីទទួលបានវិញ្ញាបនបត្រ!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEarnedCertificatesModalOpen(false);
                      setIsCourseFinalExamModalOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer"
                  >
                    ទៅកាន់ការប្រឡងបញ្ចប់វគ្គ
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {earnedCertificatesList.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/30 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                          លេខកូដ៖ {cert.certNumber}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 font-serif truncate">
                          {cert.courseName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <span>និទ្ទេស៖ <strong className="text-amber-600">{cert.grade}</strong></span>
                          <span>•</span>
                          <span>{cert.issueDateKh}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEarnedCertificatesModalOpen(false);
                          setViewingCertificate(cert);
                        }}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>មើលវិញ្ញាបនបត្រ</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 15: OFFICIAL CERTIFICATE OF COMPLETION FULL VIEW & PRINT            */}
        {/* ========================================================================= */}
        {viewingCertificate && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:bg-white print:p-0">
            <style type="text/css" media="print">
              {`
                @page { size: A4 landscape !important; margin: 0 !important; }
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 297mm !important;
                  height: 210mm !important;
                  background: #ffffff !important;
                }
                div, section, main, body * {
                  transform: none !important;
                  filter: none !important;
                  backdrop-filter: none !important;
                }
                body * { visibility: hidden !important; }
                #printable-certificate-container, 
                #printable-certificate-container *,
                #printable-certificate-area,
                #printable-certificate-area * { 
                  visibility: visible !important; 
                }
                #printable-certificate-container,
                #printable-certificate-area { 
                  position: fixed !important; 
                  left: 0 !important; 
                  top: 0 !important; 
                  right: 0 !important;
                  bottom: 0 !important;
                  width: 297mm !important; 
                  height: 210mm !important; 
                  min-width: 297mm !important;
                  max-width: 297mm !important;
                  min-height: 210mm !important;
                  max-height: 210mm !important;
                  display: flex !important; 
                  align-items: center !important; 
                  justify-content: center !important; 
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #ffffff !important;
                  z-index: 99999999 !important;
                  transform: none !important;
                  overflow: hidden !important;
                  page-break-before: avoid !important;
                  page-break-after: avoid !important;
                  page-break-inside: avoid !important;
                  break-before: avoid !important;
                  break-after: avoid !important;
                  break-inside: avoid !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              `}
            </style>

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-4 sm:p-6 relative my-auto print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none print:rounded-none">
              
              {/* Top Controls (Hidden during print) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2 print:hidden">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                      វិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការ (Official Certificate)
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-amber-600 inline" />
                      🔒 គំរូវិញ្ញាបនបត្រផ្លូវការពីប្រព័ន្ធ Admin - មិនអាចកែប្រែបានទេ (Read-Only)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                  <button
                    type="button"
                    disabled={isExportingCert}
                    onClick={handleDownloadCertPdf}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isExportingCert ? 'កំពុងដំណើរការ...' : 'រក្សាទុកជា PDF'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={isExportingCert}
                    onClick={handleDownloadCertJpg}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExportingCert ? 'កំពុងដំណើរការ...' : 'រក្សាទុកជា JPG'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingCertificate(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Official Admin Certificate Template Frame Container */}
              <div className="flex-1 overflow-x-auto flex items-center justify-center bg-slate-100/60 p-2 sm:p-4 rounded-2xl print:p-0 print:bg-white min-h-[400px]">
                <div className="transform scale-[0.35] sm:scale-[0.52] md:scale-[0.7] lg:scale-[0.82] xl:scale-[0.9] origin-center transition-transform my-2 print:scale-100 print:m-0">
                  <CertificatesTemplate 
                    previewCert={{
                      ...viewingCertificate,
                      certificateNumber: viewingCertificate.certificateNumber || viewingCertificate.certNumber || `PLC-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                      studentNameKh: viewingCertificate.studentNameKh || data?.nameKh || `${data?.lastNameKh || ''} ${data?.firstNameKh || ''}`.trim() || "ជូ លីណាន",
                      studentNameEn: viewingCertificate.studentNameEn || data?.nameEn || "Chou luchhean",
                      genderKh: viewingCertificate.genderKh || (data?.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស'),
                      genderEn: viewingCertificate.genderEn || (data?.gender === 'FEMALE' ? 'Female' : 'Male'),
                      dateOfBirthKh: viewingCertificate.dateOfBirthKh || (data?.dob ? new Date(data.dob).toLocaleDateString('km-KH') : '01/07/2007'),
                      dateOfBirthEn: viewingCertificate.dateOfBirthEn || (data?.dob ? new Date(data.dob).toLocaleDateString('en-GB') : '01/07/2007'),
                      courseName: viewingCertificate.courseName || data?.course || "រចនាក្រាហ្វិក (Graphic Design)",
                      periodOfStudyKh: viewingCertificate.periodOfStudyKh || '01/01/2026 ដល់ 01/06/2026',
                      periodOfStudyEn: viewingCertificate.periodOfStudyEn || '01/01/2026 to 01/06/2026',
                      lunarDateKh: viewingCertificate.lunarDateKh || 'ថ្ងៃច័ន្ទ ៥កើត ខែស្រាពណ៍ ឆ្នាំមមី ឆស័ក ព.ស. ២៥៦៩',
                      issueDay: viewingCertificate.issueDay || (viewingCertificate.issueDateKh ? viewingCertificate.issueDateKh.split('-')[2] || '10' : new Date().getDate().toString().padStart(2, '0')),
                      issueMonth: viewingCertificate.issueMonth || (viewingCertificate.issueDateKh ? viewingCertificate.issueDateKh.split('-')[1] || '08' : (new Date().getMonth() + 1).toString().padStart(2, '0')),
                      issueYear: viewingCertificate.issueYear || (viewingCertificate.issueDateKh ? viewingCertificate.issueDateKh.split('-')[0] || '2026' : new Date().getFullYear().toString().slice(-2)),
                      studentPhoto: viewingCertificate.studentPhoto || data?.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
                      photoTop: viewingCertificate.photoTop || '70.5%',
                      photoLeft: viewingCertificate.photoLeft || '16.8%',
                      photoWidth: viewingCertificate.photoWidth || '9.5%',
                      photoHeight: viewingCertificate.photoHeight || '17%'
                    }} 
                    schoolLogo={viewingCertificate.schoolLogo || sysSettings?.schoolLogo} 
                    customBackground={localStorage.getItem("sms_certificate_background") || sysSettings?.certificateBackground || "/uploads/blank_certificate_template.jpg"}  
                  />
                </div>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
