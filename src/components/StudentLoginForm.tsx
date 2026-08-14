import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, User, Lock, Loader2, ArrowRight, AlertCircle, School } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

interface StudentLoginFormProps {
  onLogin: (studentId: string, autoExam?: boolean) => void;
  onSwitchToAdminLogin?: () => void;
}

export default function StudentLoginForm({ onLogin }: StudentLoginFormProps) {
  const [studentInput, setStudentInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sampleStudents, setSampleStudents] = useState<Array<{ studentId: string; name: string; phone: string }>>([]);
  const [uiLang, setUiLang] = useState(() => localStorage.getItem("plc_lang") || "kh");

  useEffect(() => {
    const handleLangChange = () => setUiLang(localStorage.getItem("plc_lang") || "kh");
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  useEffect(() => {
    fetch("/api/portal/student/samples")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.samples) && data.samples.length > 0) {
          setSampleStudents(data.samples);
        } else {
          setSampleStudents([
            { studentId: "SMS-ST-101", name: "សាម៉ែត សុខា", phone: "012345678" },
            { studentId: "STU-26-001", name: "លី ស៊ាវម៉ី", phone: "098765432" },
            { studentId: "STU-26-002", name: "ឆាយ វ៉ាន់ដា", phone: "088123456" }
          ]);
        }
      })
      .catch(() => {
        setSampleStudents([
          { studentId: "SMS-ST-101", name: "សាម៉ែត សុខា", phone: "012345678" },
          { studentId: "STU-26-001", name: "លី ស៊ាវម៉ី", phone: "098765432" }
        ]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = studentInput.trim();
    if (!query) {
      setErrorMsg(
        uiLang === "en"
          ? "Please enter Student ID or Phone Number!"
          : uiLang === "zh"
          ? "请输入学生 ID 或手机号码！"
          : "សូមបញ្ចូលអត្តលេខសិស្ស (ID) ឬ លេខទូរស័ព្ទ!"
      );
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/portal/student/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        const resolvedId = data?.studentId || data?.id || query;
        setIsLoading(false);
        onLogin(resolvedId, true);
      } else {
        const matchSample = sampleStudents.find(
          (s) =>
            s.studentId.toLowerCase() === query.toLowerCase() ||
            s.phone.replace(/\D/g, "") === query.replace(/\D/g, "")
        );

        if (matchSample) {
          setIsLoading(false);
          onLogin(matchSample.studentId, true);
        } else {
          setIsLoading(false);
          setErrorMsg(
            uiLang === "en"
              ? `Student ID or Phone "${query}" is not registered in the system!`
              : uiLang === "zh"
              ? `系统中未找到学生 ID 或手机号 "${query}"！`
              : `រកមិនឃើញអត្តលេខសិស្ស ឬ លេខទូរស័ព្ទ "${query}" ក្នុងប្រព័ន្ធឡើយ!`
          );
        }
      }
    } catch (err) {
      const matchSample = sampleStudents.find(
        (s) =>
          s.studentId.toLowerCase() === query.toLowerCase() ||
          s.phone.replace(/\D/g, "") === query.replace(/\D/g, "")
      );
      if (matchSample) {
        setIsLoading(false);
        onLogin(matchSample.studentId, true);
      } else {
        setIsLoading(false);
        setErrorMsg(
          uiLang === "en"
            ? `Unable to verify Student ID "${query}". Please check your ID or contact school admin.`
            : `មិនអាចផ្ទៀងផ្ទាត់អត្តលេខសិស្ស "${query}" បានទេ! សូមពិនិត្យអត្តលេខរបស់អ្នកឡើងវិញ។`
        );
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 select-none font-sans">
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>
      
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
          <School className="w-4 h-4" />
        </div>
        <span className="text-xs font-black tracking-wider uppercase text-slate-700">
          PLC COMPUTER SCHOOL
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {uiLang === "en"
              ? "Exam Login"
              : uiLang === "zh"
              ? "考试登录"
              : "Form Login ចូលប្រឡង"}
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {uiLang === "en"
              ? "Enter your Student ID to access the final exam"
              : uiLang === "zh"
              ? "输入您的学生 ID 登录并参加课程结业考试"
              : "បញ្ចូលអត្តលេខសិស្ស ឬលេខទូរស័ព្ទ ដើម្បីចូលប្រឡង"}
          </p>
        </div>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              {uiLang === "en"
                ? "Student ID or Phone"
                : uiLang === "zh"
                ? "学生 ID 或手机号码"
                : "អត្តលេខសិស្ស (ID) ឬ លេខទូរស័ព្ទ"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={studentInput}
                onChange={(e) => {
                  setStudentInput(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder={uiLang === "en" ? "Enter ID..." : "បញ្ជូលអត្តលេខ..."}
                className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex justify-between">
              <span>
                {uiLang === "en"
                  ? "PIN (Optional)"
                  : uiLang === "zh"
                  ? "PIN 码 (可选)"
                  : "លេខសម្ងាត់ PIN (ជម្រើស)"}
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="123456"
                className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {uiLang === "en"
                      ? "Verifying..."
                      : "កំពុងផ្ទៀងផ្ទាត់..."}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {uiLang === "en"
                      ? "Login"
                      : uiLang === "zh"
                      ? "登录"
                      : "ចូលប្រឡង"}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
