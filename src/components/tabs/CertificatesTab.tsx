import { exportToExcel } from "../../exportUtils";
import React, { useState, useEffect, useRef } from "react";
import { Award, Search, Plus, Trash2, X, Save, Edit, Calendar, CheckCircle2, FileText, Eye, User, BookOpen, Printer, Download, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CertificatesTemplate from "./CertificatesTemplate";
import { safeToJpeg } from "../../lib/safe-html-to-image";
import { LayoutTemplate } from "lucide-react";
import { exportCertificateAsJpg, exportCertificateAsPdf } from "../../utils/exportCertificate";

interface Certificate {
  id: string;
  studentId: string;
  studentNameKh: string;
  studentNameEn: string;
  genderKh?: string;
  genderEn?: string;
  dateOfBirthKh?: string;
  dateOfBirthEn?: string;
  courseName: string;
  periodOfStudyKh?: string;
  periodOfStudyEn?: string;
  lunarDateKh?: string;
  issueDay?: string;
  issueMonth?: string;
  issueYear?: string;
  issueDate?: string;
  grade?: string;
  certificateNumber: string;
  studentPhoto?: string;
  status: "issued" | "revoked";
}

export default function CertificatesTab({  
  students = [], 
  uiLang: propUiLang, 
  courseOptions = [], 
  showToast, schoolLogo, schoolName, schoolKhmerName, directorName, schoolAddress }: any) {
  const [uiLang, setUiLang] = useState<"en" | "kh">(
    (propUiLang as "en" | "kh") || (localStorage.getItem("plc_lang") as "en" | "kh") || "kh"
  );
  
  useEffect(() => {
    if (propUiLang) setUiLang(propUiLang as "en" | "kh");
  }, [propUiLang]);

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

interface CertificateFormData {
  studentId: string;
  studentNameKh: string;
  studentNameEn: string;
  courseName: string;
  issueDate: string;
  grade: string;
  certificateNumber: string;
  studentPhoto?: string;
  genderKh?: string;
  genderEn?: string;
  dateOfBirthKh?: string;
  dateOfBirthEn?: string;
  periodOfStudyKh?: string;
  periodOfStudyEn?: string;
  lunarDateKh?: string;
  issueDay?: string;
  issueMonth?: string;
  issueYear?: string;
}

  // Form State
  const [formData, setFormData] = useState<CertificateFormData>({
    studentId: "",
    studentNameKh: "",
    studentNameEn: "",
    courseName: "",
    issueDate: new Date().toISOString().split('T')[0],
    grade: "Excellent",
    certificateNumber: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  });

  useEffect(() => {
    try {
      const defaultCert: Certificate = {
        id: "1",
        studentId: "STU-26-001",
        studentNameKh: "ជូ លីណាន",
        studentNameEn: "CHOU LUCHHEAN",
        genderKh: "ប្រុស",
        genderEn: "Male",
        dateOfBirthKh: "2007-07-01",
        dateOfBirthEn: "2007-07-01",
        courseName: "ADOBE PHOTOSHOP",
        periodOfStudyKh: "2026-08-10 ដល់ 2026-11-10",
        periodOfStudyEn: "2026-08-10 to 2026-11-10",
        lunarDateKh: "ឃ្នើត ស្សព្ស័ក ព.ស. ២៥៦៩",
        issueDay: "10",
        issueMonth: "សីហា",
        issueYear: "26",
        issueDate: "2026-08-10",
        certificateNumber: "CERT-2026-6246",
        grade: "A",
        status: "issued"
      };

      const saved = localStorage.getItem("sms_certificates");
      if (saved) {
        const parsed: Certificate[] = JSON.parse(saved);
        // Enrich any incomplete certificate with actual defaults if fields are missing
        const enriched = parsed.map(c => {
          if (c.id === "1" || c.studentNameKh === "ជូ លីណាន") {
            return {
              ...defaultCert,
              ...c,
              studentNameKh: c.studentNameKh || defaultCert.studentNameKh,
              studentNameEn: c.studentNameEn || defaultCert.studentNameEn,
              genderKh: c.genderKh || defaultCert.genderKh,
              genderEn: c.genderEn || defaultCert.genderEn,
              dateOfBirthKh: c.dateOfBirthKh || defaultCert.dateOfBirthKh,
              dateOfBirthEn: c.dateOfBirthEn || defaultCert.dateOfBirthEn,
              courseName: c.courseName || defaultCert.courseName,
              periodOfStudyKh: c.periodOfStudyKh || defaultCert.periodOfStudyKh,
              periodOfStudyEn: c.periodOfStudyEn || defaultCert.periodOfStudyEn,
              lunarDateKh: c.lunarDateKh || defaultCert.lunarDateKh,
              issueDay: c.issueDay || defaultCert.issueDay,
              issueMonth: c.issueMonth || defaultCert.issueMonth,
              issueYear: c.issueYear || defaultCert.issueYear,
              certificateNumber: c.certificateNumber || defaultCert.certificateNumber
            };
          }
          return c;
        });
        setCertificates(enriched);
        localStorage.setItem("sms_certificates", JSON.stringify(enriched));
      } else {
        const initialCerts: Certificate[] = [defaultCert];
        setCertificates(initialCerts);
        localStorage.setItem("sms_certificates", JSON.stringify(initialCerts));
      }
    } catch (e) {}
  }, []);

  const saveCertificates = (updated: Certificate[]) => {
    setCertificates(updated);
    localStorage.setItem("sms_certificates", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("sms_certificates_updated"));
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stId = e.target.value;
    if (!stId) {
      setFormData(prev => ({ ...prev, studentId: "" }));
      return;
    }

    const student = students.find((s: any) => s.id === stId || s.studentId === stId);
    if (student) {
      // Determine Khmer Name
      const sNameKh = (
        student.nameKh ||
        `${student.lastNameKh || ''} ${student.firstNameKh || ''}`.trim() ||
        student.nameEn ||
        ""
      );

      // Determine English Name
      const sNameEn = (
        student.nameEn ||
        `${student.firstNameEn || ''} ${student.lastNameEn || ''}`.trim() ||
        student.nameKh ||
        ""
      );

      // Determine Gender
      const gRaw = (student.gender || "").toString().toLowerCase();
      const isMale = gRaw.includes("male") || gRaw.includes("ប្រុស") || gRaw === "m";
      const isFemale = gRaw.includes("female") || gRaw.includes("ស្រី") || gRaw === "f";
      const genderKh = isMale ? "ប្រុស" : isFemale ? "ស្រី" : (student.gender || "");
      const genderEn = isMale ? "Male" : isFemale ? "Female" : (student.gender || "");

      // Date of birth
      const rawDob = student.dob || student.dateOfBirth || "";
      const dobKh = student.dateOfBirthKh || rawDob;
      const dobEn = student.dateOfBirthEn || rawDob;

      // Period of study
      let periodKh = student.periodOfStudyKh || "";
      let periodEn = student.periodOfStudyEn || "";
      if (!periodKh && (student.startDate || student.endDate)) {
        const start = student.startDate || "";
        const end = student.endDate || "";
        periodKh = start && end ? `${start} ដល់ ${end}` : (start || end);
        periodEn = start && end ? `${start} to ${end}` : (start || end);
      }

      // Default issue date
      const now = new Date();
      const currentDay = now.getDate().toString();
      const monthsKh = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
      const currentMonthKh = monthsKh[now.getMonth()];
      const currentYearKh = (now.getFullYear() % 100).toString();

      setFormData(prev => ({
        ...prev,
        studentId: student.studentId || student.id,
        studentNameKh: sNameKh,
        studentNameEn: sNameEn,
        genderKh: genderKh,
        genderEn: genderEn,
        dateOfBirthKh: dobKh,
        dateOfBirthEn: dobEn,
        courseName: student.course || prev.courseName || "",
        periodOfStudyKh: periodKh,
        periodOfStudyEn: periodEn,
        studentPhoto: student.photoUrl || student.photo || student.studentPhoto || student.avatarUrl || prev.studentPhoto || "",
        issueDay: prev.issueDay || currentDay,
        issueMonth: prev.issueMonth || currentMonthKh,
        issueYear: prev.issueYear || currentYearKh
      }));

      if (showToast) {
        showToast(
          uiLang === 'kh' 
            ? `បានទាញយកព័ត៌មានសិស្ស ${sNameKh} ដោយស្វ័យប្រវត្តិ!` 
            : `Loaded details for ${sNameEn || sNameKh}!`, 
          "success"
        );
      }
    } else {
      setFormData(prev => ({ ...prev, studentId: stId }));
    }
  };

  const handleSaveCertificate = () => {
    if (!formData.studentNameKh || !formData.courseName) {
      if (showToast) showToast(uiLang === 'kh' ? 'សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់' : 'Please fill all required fields', 'error');
      return;
    }

    if (editingCertId) {
      const updated = certificates.map(c => 
        c.id === editingCertId ? { ...c, ...formData } : c
      );
      saveCertificates(updated);
      if (showToast) showToast(uiLang === 'kh' ? 'បានកែប្រែជោគជ័យ' : 'Updated Successfully', 'success');
    } else {
      const newCert: Certificate = {
        id: Date.now().toString(),
        ...formData,
        status: "issued"
      };
      const updated = [newCert, ...certificates];
      saveCertificates(updated);
      if (showToast) showToast(uiLang === 'kh' ? 'រក្សាទុកជោគជ័យ' : 'Saved Successfully', 'success');
    }
    
    setIsCreateModalOpen(false);
    setEditingCertId(null);
  };

  const handleEdit = (cert: Certificate) => {
    setFormData({
      studentId: cert.studentId,
      studentNameKh: cert.studentNameKh,
      studentNameEn: cert.studentNameEn,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
      grade: cert.grade,
      certificateNumber: cert.certificateNumber,
      studentPhoto: cert.studentPhoto || "",
      genderKh: cert.genderKh || "",
      genderEn: cert.genderEn || "",
      dateOfBirthKh: cert.dateOfBirthKh || "",
      dateOfBirthEn: cert.dateOfBirthEn || "",
      periodOfStudyKh: cert.periodOfStudyKh || "",
      periodOfStudyEn: cert.periodOfStudyEn || "",
      lunarDateKh: cert.lunarDateKh || "",
      issueDay: cert.issueDay || "",
      issueMonth: cert.issueMonth || "",
      issueYear: cert.issueYear || ""
    });
    setEditingCertId(cert.id);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(uiLang === 'kh' ? 'តើអ្នកពិតជាចង់លុបមែនទេ?' : 'Are you sure you want to delete?')) {
      const updated = certificates.filter(c => c && c.id !== id);
      saveCertificates(updated);
      if (showToast) showToast(uiLang === 'kh' ? 'បានលុបជោគជ័យ' : 'Deleted Successfully', 'success');
    }
  };

  const handlePrint = (cert: Certificate) => {
    setPreviewCert(cert);
    setIsPreviewModalOpen(true);
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadJpg = async () => {
    setIsExporting(true);
    const certNo = previewCert?.certificateNumber || formData?.certificateNumber || "Certificate";
    await exportCertificateAsJpg("printable-certificate-container", `Certificate_${certNo}.jpg`);
    setIsExporting(false);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const certNo = previewCert?.certificateNumber || formData?.certificateNumber || "Certificate";
    await exportCertificateAsPdf("printable-certificate-container", `Certificate_${certNo}.pdf`);
    setIsExporting(false);
  };

  
    
  
  const [customBackground, setCustomBackground] = useState<string>(() => {
    return localStorage.getItem("sms_certificate_background") || '/uploads/blank_certificate_template.jpg';
  });

  // Fetch certificate background from system settings on mount
  useEffect(() => {
    fetch("/api/system/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.certificateBackground) {
          setCustomBackground(data.certificateBackground);
          localStorage.setItem("sms_certificate_background", data.certificateBackground);
        }
      })
      .catch(err => console.error("Error loading certificate background setting:", err));
  }, []);

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Upload to server storage /uploads/
      const uploadData = new FormData();
      uploadData.append("file", file);

      let serverBgUrl = "";
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (uploadRes.ok) {
        const uploadJson = await uploadRes.json();
        if (uploadJson.url || uploadJson.fileUrl) {
          serverBgUrl = uploadJson.url || uploadJson.fileUrl;
        }
      }

      // Fallback to base64 if server upload endpoint returned no fileUrl
      if (!serverBgUrl) {
        serverBgUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      setCustomBackground(serverBgUrl);
      localStorage.setItem("sms_certificate_background", serverBgUrl);
      window.dispatchEvent(new Event("sms_certificates_updated"));

      // 2. Persist to server system settings so all computers receive this background
      const authToken = localStorage.getItem("plc_auth_token") || localStorage.getItem("token") || "";
      await fetch("/api/system/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ certificateBackground: serverBgUrl }),
      });

      if (showToast) {
        showToast(
          uiLang === "kh"
            ? "បានរក្សាទុករូបភាពផ្ទៃខាងក្រោយវិញ្ញាបនបត្រជាអចិន្ត្រៃយ៍លើ Server!"
            : "Certificate background saved permanently on server!",
          "success"
        );
      }
    } catch (err) {
      console.error("Error saving certificate background:", err);
      // Local fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        const bg = reader.result as string;
        setCustomBackground(bg);
        localStorage.setItem("sms_certificate_background", bg);
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, studentPhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);

      try {
        const token = localStorage.getItem("plc_token") || "";
        const uploadData = new FormData();
        uploadData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
          body: uploadData
        });
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.url || uploadJson.fileUrl) {
            const photoUrl = uploadJson.url || uploadJson.fileUrl;
            setFormData(prev => ({ ...prev, studentPhoto: photoUrl }));
          }
        }
      } catch (err) {
        console.warn("Cert student photo upload error:", err);
      }
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = filteredCerts.map((c, i) => ({
        [uiLang === 'kh' ? 'ល.រ' : 'No.']: i + 1,
        [uiLang === 'kh' ? 'អត្តលេខ' : 'Student ID']: c.studentId,
        [uiLang === 'kh' ? 'ឈ្មោះ (ខ្មែរ)' : 'Name (KH)']: c.studentNameKh,
        [uiLang === 'kh' ? 'ឈ្មោះ (ឡាតាំង)' : 'Name (EN)']: c.studentNameEn,
        [uiLang === 'kh' ? 'វគ្គសិក្សា' : 'Course']: c.courseName,
        [uiLang === 'kh' ? 'លេខវិញ្ញាបនបត្រ' : 'Cert Number']: c.certificateNumber,
        [uiLang === 'kh' ? 'កាលបរិច្ឆេទចេញ' : 'Issue Date']: c.issueDate,
        [uiLang === 'kh' ? 'និទ្ទេស' : 'Grade']: c.grade
      }));

      exportToExcel(
        exportData, 
        `Certificates_Export_${new Date().toISOString().split('T')[0]}`, 
        uiLang === 'kh' ? 'របាយការណ៍បញ្ជីវិញ្ញាបនបត្រ' : 'Certificates Report'
      );
      
      if (showToast) showToast(uiLang === 'kh' ? 'ទាញយកទិន្នន័យជោគជ័យ' : 'Exported successfully', 'success');
    } catch (e) {
      console.error('Export Error:', e);
      if (showToast) showToast(uiLang === 'kh' ? 'មានបញ្ហាក្នុងការទាញយក' : 'Export failed', 'error');
    }
  };

  const filteredCerts = certificates.filter(c => 
    c.studentNameKh.includes(searchQuery) || 
    c.studentNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 w-full h-full flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      
      {/* PANE 1: Certificate List (Left Sidebar) */}
      <div className="w-full lg:w-[340px] flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-slate-200 shrink-0 z-20">
        <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 tracking-tight font-serif flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              {uiLang === 'kh' ? 'បញ្ជីវិញ្ញាបនបត្រ' : 'Certificates'}
            </h2>
            <button
              onClick={() => {
                setFormData({
                  studentId: "",
                  studentNameKh: "",
                  studentNameEn: "",
                  courseName: "",
                  issueDate: new Date().toISOString().split('T')[0],
                  grade: "A",
                  certificateNumber: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                  studentPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                });
                setEditingCertId('new');
              }}
              className="p-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center"
              title={uiLang === 'kh' ? 'បន្ថែមថ្មី' : 'Add New'}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={uiLang === 'kh' ? 'ស្វែងរកឈ្មោះ ឬ លេខ...' : 'Search name or cert no...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
          {filteredCerts.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <FileText className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 text-sm font-medium">
                {uiLang === 'kh' ? 'មិនមានទិន្នន័យទេ' : 'No certificates found'}
              </p>
            </div>
          ) : (
            filteredCerts.map(cert => (
              <div
                key={cert.id}
                onClick={() => {
                  setFormData({
                    studentId: cert.studentId || "",
                    studentNameKh: cert.studentNameKh || "",
                    studentNameEn: cert.studentNameEn || "",
                    courseName: cert.courseName || "",
                    issueDate: cert.issueDate || "",
                    grade: cert.grade || "A",
                    certificateNumber: cert.certificateNumber || "",
                    studentPhoto: cert.studentPhoto || "",
                    genderKh: cert.genderKh || "",
                    genderEn: cert.genderEn || "",
                    dateOfBirthKh: cert.dateOfBirthKh || "",
                    dateOfBirthEn: cert.dateOfBirthEn || "",
                    periodOfStudyKh: cert.periodOfStudyKh || "",
                    periodOfStudyEn: cert.periodOfStudyEn || "",
                    lunarDateKh: cert.lunarDateKh || "",
                    issueDay: cert.issueDay || "",
                    issueMonth: cert.issueMonth || "",
                    issueYear: cert.issueYear || ""
                  });
                  setEditingCertId(cert.id);
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex flex-col gap-2 relative overflow-hidden group ${
                  editingCertId === cert.id 
                    ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-500/10' 
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                {editingCertId === cert.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl"></div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{cert.studentNameKh}</h4>
                    <p className="text-xs font-mono text-slate-500">{cert.studentNameEn}</p>
                  </div>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200/50">
                    {cert.grade}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded-lg">
                  <BookOpen className="w-3.5 h-3.5" />
                  {cert.courseName}
                </div>
                
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 pt-1 border-t border-slate-100/80">
                  <span className="font-mono">{cert.certificateNumber}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {cert.issueDate}</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 border-t border-slate-200 bg-white">
           <button
             onClick={handleExportExcel}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-colors border border-emerald-200 text-sm"
           >
             <Download className="w-4 h-4" />
             {uiLang === 'kh' ? 'ទាញយក Excel' : 'Export Excel'}
           </button>
        </div>
      </div>

      {/* PANE 2 & 3: Main Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden relative">
        {!editingCertId ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-slate-400 p-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-200 mb-6">
              <Award className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              {uiLang === 'kh' ? 'សូមជ្រើសរើសវិញ្ញាបនបត្រ' : 'Select a Certificate'}
            </h3>
            <p className="text-sm font-medium text-slate-500 max-w-sm">
              {uiLang === 'kh' ? 'ជ្រើសរើសពីបញ្ជីខាងឆ្វេង ឬបង្កើតថ្មីដើម្បីចាប់ផ្តើមបំពេញព័ត៌មាន' : 'Select from the list on the left or create a new one to start filling in the details'}
            </p>
            <button
              onClick={() => {
                setFormData({
                  studentId: "",
                  studentNameKh: "",
                  studentNameEn: "",
                  courseName: "",
                  issueDate: new Date().toISOString().split('T')[0],
                  grade: "A",
                  certificateNumber: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                  studentPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                });
                setEditingCertId('new');
              }}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {uiLang === 'kh' ? 'បង្កើតវិញ្ញាបនបត្រថ្មី' : 'Create New'}
            </button>
          </div>
        ) : (
          <>
            {/* PANE 2: Form Editor */}
            <div className="w-full xl:w-[420px] flex flex-col bg-white border-b xl:border-b-0 xl:border-r border-slate-200 shrink-0 z-10 shadow-[0_0_15px_rgba(0,0,0,0.02)] h-full">
              
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                  <Edit className="w-5 h-5 text-blue-500" />
                  {editingCertId === 'new' 
                    ? (uiLang === 'kh' ? 'បង្កើតថ្មី' : 'Create New') 
                    : (uiLang === 'kh' ? 'កែប្រែព័ត៌មាន' : 'Edit Info')}
                </h3>
                <div className="flex items-center gap-1">
                  {editingCertId !== 'new' && (
                    <button
                      onClick={() => handleDelete(editingCertId)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title={uiLang === 'kh' ? 'លុប' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setEditingCertId(null)}
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Search Student Dropdown */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    {uiLang === 'kh' ? 'ទាញទិន្នន័យសិស្សពីបញ្ជី' : 'Load from Students List'}
                  </label>
                  <select
                    onChange={handleStudentSelect}
                    value={formData.studentId || ""}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium text-slate-700 shadow-sm"
                  >
                    <option value="">{uiLang === 'kh' ? '-- ជ្រើសរើសសិស្ស --' : '-- Select Student --'}</option>
                    {students.map((st: any) => (
                      <option key={st.id} value={st.id}>
                        {st.nameKh} ({st.nameEn}) - {st.course}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Photo Upload Section */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden relative">
                    {formData.studentPhoto ? (
                      <img src={formData.studentPhoto} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                        <User className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-bold">4x6 PHOTO</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {uiLang === 'kh' ? 'ចុចដើម្បីបញ្ចូលរូបថត 4x6' : 'Click to upload 4x6 photo'}
                  </div>
                </div>

                <div className="space-y-4">
                  
                  {/* Basic Info */}
                  <div className="p-4 rounded-xl border border-slate-200 space-y-4 bg-slate-50/50">
                    <h4 className="font-bold text-slate-700 text-sm">{uiLang === 'kh' ? 'ព័ត៌មានផ្ទាល់ខ្លួន' : 'Personal Info'}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ឈ្មោះ (ខ្មែរ) *</label>
                        <input type="text" value={formData.studentNameKh || ""} onChange={e => setFormData({...formData, studentNameKh: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Name (EN) *</label>
                        <input type="text" value={formData.studentNameEn || ""} onChange={e => setFormData({...formData, studentNameEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ភេទ (ខ្មែរ)</label>
                        <input type="text" value={formData.genderKh || ""} onChange={e => setFormData({...formData, genderKh: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Gender (EN)</label>
                        <input type="text" value={formData.genderEn || ""} onChange={e => setFormData({...formData, genderEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ថ្ងៃខែឆ្នាំកំណើត</label>
                        <input type="text" placeholder="០៣ កញ្ញា ១៩៩៨" value={formData.dateOfBirthKh || ""} onChange={e => setFormData({...formData, dateOfBirthKh: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                        <input type="text" placeholder="03 September 1998" value={formData.dateOfBirthEn || ""} onChange={e => setFormData({...formData, dateOfBirthEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-4 rounded-xl border border-slate-200 space-y-4 bg-slate-50/50">
                    <h4 className="font-bold text-slate-700 text-sm">{uiLang === 'kh' ? 'ព័ត៌មានវគ្គសិក្សា' : 'Course Info'}</h4>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ឈ្មោះវគ្គសិក្សា / Course Name *</label>
                      <input type="text" value={formData.courseName || ""} onChange={e => setFormData({...formData, courseName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">រយៈពេលសិក្សា</label>
                        <input type="text" placeholder="១ មេសា ដល់ ១ កក្កដា" value={formData.periodOfStudyKh || ""} onChange={e => setFormData({...formData, periodOfStudyKh: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Period of Study</label>
                        <input type="text" placeholder="1 April to 1 July" value={formData.periodOfStudyEn || ""} onChange={e => setFormData({...formData, periodOfStudyEn: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Issue Info */}
                  <div className="p-4 rounded-xl border border-slate-200 space-y-4 bg-slate-50/50">
                    <h4 className="font-bold text-slate-700 text-sm">{uiLang === 'kh' ? 'ព័ត៌មានចេញវិញ្ញាបនបត្រ' : 'Issue Info'}</h4>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">លេខៈ / Cert No.</label>
                      <input type="text" value={formData.certificateNumber || ""} onChange={e => setFormData({...formData, certificateNumber: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-blue-600" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">ថ្ងៃខែឆ្នាំចេញ (ចន្ទគតិ)</label>
                      <input type="text" value={formData.lunarDateKh || ""} onChange={e => setFormData({...formData, lunarDateKh: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ថ្ងៃទី</label>
                        <input type="text" placeholder="១១" value={formData.issueDay || ""} onChange={e => setFormData({...formData, issueDay: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-center" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ខែ</label>
                        <input type="text" placeholder="តុលា" value={formData.issueMonth || ""} onChange={e => setFormData({...formData, issueMonth: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-center" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">ឆ្នាំ២០</label>
                        <input type="text" placeholder="២៦" value={formData.issueYear || ""} onChange={e => setFormData({...formData, issueYear: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-center" />
                      </div>
                    </div>
                  </div>

                </div>
<div className="p-4 border-t border-slate-200 bg-white shrink-0">
                 <button
                  onClick={() => {
                    if (!formData.studentNameKh || !formData.courseName) {
                      if (showToast) showToast(uiLang === 'kh' ? 'សូមបំពេញព័ត៌មានអោយបានគ្រប់គ្រាន់' : 'Please fill all required fields', 'error');
                      return;
                    }
                    if (editingCertId && editingCertId !== 'new') {
                      const updated = certificates.map(c => 
                        c.id === editingCertId ? { ...c, ...formData } : c
                      );
                      saveCertificates(updated);
                      if (showToast) showToast(uiLang === 'kh' ? 'បានកែប្រែជោគជ័យ' : 'Updated Successfully', 'success');
                    } else {
                      const newCert = {
                        id: Date.now().toString(),
                        ...formData,
                        status: "issued" as const
                      };
                      const updated = [newCert, ...certificates];
                      saveCertificates(updated);
                      setEditingCertId(newCert.id);
                      if (showToast) showToast(uiLang === 'kh' ? 'រក្សាទុកជោគជ័យ' : 'Saved Successfully', 'success');
                    }
                  }}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {uiLang === 'kh' ? 'រក្សាទុកព័ត៌មាន' : 'Save Details'}
                </button>
              </div>
            </div>

            </div>

            {/* PANE 3: Preview Area */}
            <div className="flex-1 bg-slate-200/50 flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 z-20 flex gap-2 shadow-sm rounded-xl overflow-hidden bg-white border border-slate-200">
                
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Upload custom background" />
                  <button className="px-5 py-2.5 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 border-r border-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {uiLang === 'kh' ? 'ផ្ទៃខាងក្រោយ' : 'Upload BG'}
                  </button>
                </div>
<button
                  onClick={() => {
                    setPreviewCert({ ...formData, id: 'preview', status: 'issued' });
                    setIsPreviewModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  {uiLang === 'kh' ? 'បោះពុម្ព' : 'Print View'}
                </button>
              </div>
              
              <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                <div className="transform scale-[0.4] sm:scale-[0.55] md:scale-[0.7] lg:scale-[0.85] xl:scale-[0.95] 2xl:scale-100 origin-center transition-transform">
                  <CertificatesTemplate previewCert={formData} schoolLogo={schoolLogo} customBackground={customBackground}  
                    schoolName={schoolName} 
                    schoolKhmerName={schoolKhmerName} 
                    directorName={directorName} 
                    schoolAddress={schoolAddress} 
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PRINT MODAL (Full Screen strictly for printing) */}
      <AnimatePresence>
        {isPreviewModalOpen && previewCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm print:bg-white print:p-0">
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
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-100 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] print:h-auto print:shadow-none print:w-full print:max-w-none print:rounded-none"
            >
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 print:hidden">
                <h3 className="text-xl font-black text-slate-800 font-serif flex items-center gap-2">
                  <Printer className="w-6 h-6 text-slate-500" />
                  {uiLang === 'kh' ? 'មើល និង បោះពុម្ព' : 'Preview & Print'}
                </h3>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    disabled={isExporting}
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <FileText className="w-4 h-4" />
                    {isExporting ? (uiLang === 'kh' ? 'កំពុងដំណើរការ...' : 'Exporting...') : (uiLang === 'kh' ? 'រក្សាទុកជា PDF' : 'Save as PDF')}
                  </button>
                  <button
                    disabled={isExporting}
                    onClick={handleDownloadJpg}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    {isExporting ? (uiLang === 'kh' ? 'កំពុងដំណើរការ...' : 'Exporting...') : (uiLang === 'kh' ? 'រក្សាទុកជា JPG' : 'Save as JPG')}
                  </button>
                  <button
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-100/50 flex flex-col items-center print:bg-white print:overflow-visible">
                <CertificatesTemplate previewCert={previewCert} schoolLogo={schoolLogo} customBackground={customBackground}  
                  schoolName={schoolName} 
                  schoolKhmerName={schoolKhmerName} 
                  directorName={directorName} 
                  schoolAddress={schoolAddress} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
