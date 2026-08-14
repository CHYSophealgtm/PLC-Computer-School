import React, { useState, useEffect, useMemo } from "react";
import { 
  GraduationCap, Search, Plus, Trash2, X, Save, Edit, 
  Sparkles, Award, Calendar, BookOpen, CheckCircle2, 
  Clock, FileText, Eye, Filter, RefreshCw, Printer, AlertCircle,
  HelpCircle, Check, ArrowRight, Layers, UserCheck, ShieldCheck, FileCheck, Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: string;
  points: number;
}

interface Exam {
  id: string;
  courseName: string;
  courseNameEn: string;
  subject: string;
  duration: number; // minutes
  passingPercent: number;
  description: string;
  iconColor?: string;
  status: "active" | "inactive";
  createdDate: string;
  questions: Question[];
}

export default function CourseFinalExamTab({ 
  students = [], 
  teachers = [], 
  uiLang: propUiLang, 
  courseOptions = [], 
  showToast 
}: any) {
  const [uiLang, setUiLang] = useState<"en" | "kh">(
    (propUiLang as "en" | "kh") || (localStorage.getItem("plc_lang") as "en" | "kh") || "kh"
  );

  useEffect(() => {
    if (propUiLang) {
      setUiLang(propUiLang as "en" | "kh");
    }
  }, [propUiLang]);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setUiLang(e.detail);
    };
    window.addEventListener("plc_language_changed", handleLangChange);
    return () => window.removeEventListener("plc_language_changed", handleLangChange);
  }, []);

  // State
  const [exams, setExams] = useState<Exam[]>([]);
  const [activeTab, setActiveTab] = useState<"exams" | "results">("exams");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCertificatePreviewOpen, setIsCertificatePreviewOpen] = useState(false);
  const [isPaperPrintModalOpen, setIsPaperPrintModalOpen] = useState(false);
  const [isAddResultModalOpen, setIsAddResultModalOpen] = useState(false);
  const [deleteTargetExam, setDeleteTargetExam] = useState<Exam | null>(null);
  const [printPaperTargetExam, setPrintPaperTargetExam] = useState<Exam | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [selectedExamForQuestions, setSelectedExamForQuestions] = useState<Exam | null>(null);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [previewCertificateData, setPreviewCertificateData] = useState<any>(null);

  // Practice Test state inside Preview Modal
  const [practiceAnswers, setPracticeAnswers] = useState<{ [key: number]: string }>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [practiceScore, setPracticeScore] = useState<number | null>(null);

  // Student Results search and form state
  const [resultsSearchQuery, setResultsSearchQuery] = useState("");
  const [newResultForm, setNewResultForm] = useState({
    studentId: "",
    examId: "",
    score: 85,
    issueDate: new Date().toISOString().split("T")[0]
  });

  // Form states for Create/Edit Exam
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseNameKh: "",
    courseNameEn: "",
    subject: "",
    duration: 15,
    passingPercent: 50,
    description: "",
    status: "active" as "active" | "inactive",
    iconColor: "from-blue-600 to-indigo-700"
  });

  // Question Form State
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [points, setPoints] = useState(20);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Student exam results state
  const [studentExamResults, setStudentExamResults] = useState<any[]>([]);

  // Default Sample Exams
  const defaultExams: Exam[] = [
    {
      id: "cfe-graphic-design",
      courseName: "វគ្គ រចនាក្រាហ្វិក (Graphic Design)",
      courseNameEn: "Graphic Design Master Course",
      subject: "Graphic Design & Photoshop",
      duration: 15,
      passingPercent: 50,
      description: "ប្រឡងបញ្ចប់វគ្គរចនាក្រាហ្វិក ដើម្បីទទួលបានវិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការពីសាលា",
      iconColor: "from-amber-500 to-rose-600",
      status: "active",
      createdDate: "2026-01-10",
      questions: [
        {
          id: "gd-q1",
          text: "តើ Color Mode មួយណាដែលត្រូវបានប្រើប្រាស់សម្រាប់ស្នាដៃរចនាបោះពុម្ព (Print Design)?",
          options: ["RGB", "CMYK", "HSB", "Grayscale"],
          answer: "CMYK",
          points: 20
        },
        {
          id: "gd-q2",
          text: "តើសកាត់ (Shortcut Key) មួយណាប្រើសម្រាប់ទាញ Undo នៅក្នុងកម្មវិធី Adobe Photoshop?",
          options: ["Ctrl + Z", "Ctrl + C", "Ctrl + V", "Ctrl + S"],
          answer: "Ctrl + Z",
          points: 20
        },
        {
          id: "gd-q3",
          text: "តើ Vector Graphic មានលក្ខណៈពិសេសអ្វីខ្លះ?",
          options: [
            "ពង្រីកធំប៉ុណ្ណា ក៏មិនបាត់បង់គុណភាពរូបភាព (No quality loss)",
            "បង្កើតឡើងពី Pixel តូចៗ",
            "មិនអាចកែសម្រួលបាន",
            "ប្រើតែលើបណ្ដាញសង្គម"
          ],
          answer: "ពង្រីកធំប៉ុណ្ណា ក៏មិនបាត់បង់គុណភាពរូបភាព (No quality loss)",
          points: 20
        },
        {
          id: "gd-q4",
          text: "តើ Resolution កម្រិតណាដែលសមស្របសម្រាប់រូបភាពលើ Website?",
          options: ["72 DPI", "300 DPI", "600 DPI", "1200 DPI"],
          answer: "72 DPI",
          points: 20
        },
        {
          id: "gd-q5",
          text: "តើ Tool មួយណាប្រើសម្រាប់កាត់រូបភាព (Crop)?",
          options: ["Crop Tool (C)", "Move Tool (V)", "Marquee Tool (M)", "Lasso Tool (L)"],
          answer: "Crop Tool (C)",
          points: 20
        }
      ]
    },
    {
      id: "cfe-computer-admin",
      courseName: "វគ្គ កុំព្យូទ័ររដ្ឋបាល (Computer Admin)",
      courseNameEn: "Computer Office Administration",
      subject: "Microsoft Word, Excel, PowerPoint",
      duration: 20,
      passingPercent: 50,
      description: "ប្រឡងរដ្ឋបាលកុំព្យូទ័រ និងការប្រើប្រាស់កម្មវិធីការិយាល័យ MS Office ស្ទាត់ជំនាញ",
      iconColor: "from-blue-600 to-cyan-600",
      status: "active",
      createdDate: "2026-01-15",
      questions: [
        {
          id: "ca-q1",
          text: "តើ រូបមន្ត (Formula) មួយណាប្រើសម្រាប់បូកសរុបពិន្ទុនៅក្នុង MS Excel?",
          options: ["=SUM()", "=AVERAGE()", "=COUNT()", "=MAX()"],
          answer: "=SUM()",
          points: 20
        },
        {
          id: "ca-q2",
          text: "តើសកាត់ keyboard មួយណាប្រើសម្រាប់ Select All អត្ថបទក្នុង MS Word?",
          options: ["Ctrl + A", "Ctrl + B", "Ctrl + F", "Ctrl + H"],
          answer: "Ctrl + A",
          points: 20
        },
        {
          id: "ca-q3",
          text: "តើមុខងារ Mail Merge នៅក្នុង MS Word ប្រើប្រាស់សម្រាប់ធ្វើអ្វី?",
          options: [
            "បង្កើតលិខិត ឬប័ណ្ណអញ្ជើញផ្ញើជូនមនុស្សច្រើននាក់ស្វ័យប្រវត្តិ",
            "ផ្ញើអ៊ីមែលតាម Outlook តែមួយមុខ",
            "គណនាប្រាក់ខែបុគ្គលិក",
            "រចនាស្លាយបកស្រាយ"
          ],
          answer: "បង្កើតលិខិត ឬប័ណ្ណអញ្ជើញផ្ញើជូនមនុស្សច្រើននាក់ស្វ័យប្រវត្តិ",
          points: 20
        },
        {
          id: "ca-q4",
          text: "តើ Extension ដើមរបស់ File MS Excel ជាអ្វី?",
          options: [".xlsx", ".docx", ".pptx", ".pdf"],
          answer: ".xlsx",
          points: 20
        },
        {
          id: "ca-q5",
          text: "តើរូបមន្តទាញរកមធ្យមភាគពិន្ទុក្នុង MS Excel ជាអ្វី?",
          options: ["=AVERAGE()", "=SUM()", "=IF()", "=VLOOKUP()"],
          answer: "=AVERAGE()",
          points: 20
        }
      ]
    },
    {
      id: "cfe-web-dev",
      courseName: "វគ្គ អភិវឌ្ឍន៍គេហទំព័រ (Web Development)",
      courseNameEn: "Full-Stack Web Development",
      subject: "HTML, CSS, JavaScript & React",
      duration: 30,
      passingPercent: 50,
      description: "ប្រឡងបញ្ចប់វគ្គអភិវឌ្ឍន៍គេហទំព័រ HTML5, CSS3, JavaScript ES6 & React Framework",
      iconColor: "from-emerald-600 to-teal-700",
      status: "active",
      createdDate: "2026-02-01",
      questions: [
        {
          id: "wd-q1",
          text: "តើ HTML តំណាងឲ្យពាក្យពេញអ្វី?",
          options: [
            "HyperText Markup Language",
            "HighText Machine Language",
            "HyperTransfer Mode Language",
            "Home Tool Markup Language"
          ],
          answer: "HyperText Markup Language",
          points: 25
        },
        {
          id: "wd-q2",
          text: "តើ Hook មួយណាប្រើសម្រាប់គ្រប់គ្រង State នៅក្នុង React Component?",
          options: ["useState", "useEffect", "useContext", "useRef"],
          answer: "useState",
          points: 25
        },
        {
          id: "wd-q3",
          text: "តើ keyword មួយណាប្រើសម្រាប់ប្រកាស variable ដែលមិនអាច re-assign បានក្នុង JS?",
          options: ["const", "let", "var", "static"],
          answer: "const",
          points: 25
        },
        {
          id: "wd-q4",
          text: "តើ CSS selector មួយណាប្រើសម្រាប់ target តាមរយៈ class name?",
          options: [".className", "#idName", "elementName", "*"],
          answer: ".className",
          points: 25
        }
      ]
    }
  ];

  // Load Exams & Results from localStorage
  useEffect(() => {
    try {
      const savedExams = localStorage.getItem("sms_course_final_exams");
      if (savedExams) {
        setExams(JSON.parse(savedExams));
      } else {
        setExams(defaultExams);
        localStorage.setItem("sms_course_final_exams", JSON.stringify(defaultExams));
      }
    } catch (e) {
      console.error("Error loading exams:", e);
      setExams(defaultExams);
    }

    // Load Exam Results
    try {
      const allResults: any[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("plc_earned_certificates_")) {
          const val = localStorage.getItem(key);
          if (val) {
            const list = JSON.parse(val);
            if (Array.isArray(list)) {
              allResults.push(...list);
            }
          }
        }
      }
      setStudentExamResults(allResults);
    } catch (e) {
      console.error("Error loading exam results:", e);
    }
  }, []);

  // Save exams helper
  const saveExamsToStorage = (updatedExams: Exam[]) => {
    setExams(updatedExams);
    localStorage.setItem("sms_course_final_exams", JSON.stringify(updatedExams));
    window.dispatchEvent(new CustomEvent("sms_exams_updated"));
  };

  // Filtered exams
  const filteredExams = useMemo(() => {
    return exams.filter(ex => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        ex.courseName.toLowerCase().includes(q) ||
        ex.courseNameEn.toLowerCase().includes(q) ||
        ex.subject.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q);

      const matchesCourse = filterCourse === "all" || ex.courseName.includes(filterCourse);
      const matchesStatus = filterStatus === "all" || ex.status === filterStatus;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [exams, searchQuery, filterCourse, filterStatus]);

  // Statistics
  const stats = useMemo(() => {
    const totalExams = exams.length;
    const activeExams = exams.filter(e => e.status === "active").length;
    const totalStudentsPassed = studentExamResults.length;
    const avgPassing = exams.length > 0
      ? Math.round(exams.reduce((acc, curr) => acc + curr.passingPercent, 0) / exams.length)
      : 70;

    return { totalExams, activeExams, totalStudentsPassed, avgPassing };
  }, [exams, studentExamResults]);

  // Open Create Exam Modal
  const handleOpenCreateModal = () => {
    setFormData({
      courseNameKh: "",
      courseNameEn: "",
      subject: "",
      duration: 15,
      passingPercent: 70,
      description: "",
      status: "active",
      iconColor: "from-blue-600 to-indigo-700"
    });
    setEditingExamId(null);
    setIsCreateModalOpen(true);
  };

  // Save New / Edited Exam
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseNameKh.trim() || !formData.subject.trim()) {
      alert(uiLang === "kh" ? "សូមបញ្ចូលឈ្មោះវគ្គសិក្សា និងមុខវិជ្ជាប្រឡង" : "Please enter course name and subject");
      return;
    }

    if (editingExamId) {
      // Update
      const updated = exams.map(ex => {
        if (ex.id === editingExamId) {
          return {
            ...ex,
            courseName: formData.courseNameKh,
            courseNameEn: formData.courseNameEn || formData.courseNameKh,
            subject: formData.subject,
            duration: Number(formData.duration),
            passingPercent: Number(formData.passingPercent),
            description: formData.description,
            status: formData.status,
            iconColor: formData.iconColor
          };
        }
        return ex;
      });
      saveExamsToStorage(updated);
      if (showToast) showToast(uiLang === "kh" ? "បានកែប្រែវិញ្ញាសាប្រឡងជោគជ័យ" : "Exam updated successfully");
    } else {
      // Create new
      const newExam: Exam = {
        id: `cfe-${Date.now()}`,
        courseName: formData.courseNameKh,
        courseNameEn: formData.courseNameEn || formData.courseNameKh,
        subject: formData.subject,
        duration: Number(formData.duration),
        passingPercent: Number(formData.passingPercent),
        description: formData.description,
        iconColor: formData.iconColor,
        status: formData.status,
        createdDate: new Date().toISOString().split("T")[0],
        questions: []
      };
      saveExamsToStorage([newExam, ...exams]);
      if (showToast) showToast(uiLang === "kh" ? "បានបង្កើតវិញ្ញាសាប្រឡងថ្មីជោគជ័យ" : "New exam created successfully");
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Open Edit Exam Modal
  const handleOpenEditModal = (exam: Exam) => {
    setEditingExamId(exam.id);
    setFormData({
      courseNameKh: exam.courseName,
      courseNameEn: exam.courseNameEn,
      subject: exam.subject,
      duration: exam.duration,
      passingPercent: exam.passingPercent,
      description: exam.description,
      status: exam.status,
      iconColor: exam.iconColor || "from-blue-600 to-indigo-700"
    });
    setIsEditModalOpen(true);
  };

  // Delete Exam
  const handleDeleteExam = (id: string) => {
    const updated = exams.filter(ex => ex.id !== id);
    saveExamsToStorage(updated);
    if (showToast) showToast(uiLang === "kh" ? "បានលុបវិញ្ញាសាប្រឡង" : "Exam deleted");
  };

  // Open Manage Questions Modal
  const handleOpenQuestionsModal = (exam: Exam) => {
    setSelectedExamForQuestions(exam);
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectOptionIndex(0);
    setPoints(20);
    setEditingQuestionId(null);
    setIsQuestionsModalOpen(true);
  };

  // Add / Edit Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamForQuestions) return;
    if (!questionText.trim() || !optionA.trim() || !optionB.trim()) {
      alert(uiLang === "kh" ? "សូមបញ្ចូលសំណួរ និងជម្រើសចម្លើយយ៉ាងតិច ២" : "Please fill in question and at least 2 options");
      return;
    }

    const options = [optionA, optionB];
    if (optionC.trim()) options.push(optionC.trim());
    if (optionD.trim()) options.push(optionD.trim());

    const chosenAnswer = options[correctOptionIndex] || options[0];

    let updatedQuestions: Question[] = [...selectedExamForQuestions.questions];

    if (editingQuestionId) {
      updatedQuestions = updatedQuestions.map(q => {
        if (q.id === editingQuestionId) {
          return {
            ...q,
            text: questionText,
            options,
            answer: chosenAnswer,
            points: Number(points)
          };
        }
        return q;
      });
    } else {
      const newQ: Question = {
        id: `q-${Date.now()}`,
        text: questionText,
        options,
        answer: chosenAnswer,
        points: Number(points)
      };
      updatedQuestions.push(newQ);
    }

    const updatedExam: Exam = {
      ...selectedExamForQuestions,
      questions: updatedQuestions
    };

    const updatedExamsList = exams.map(e => e.id === updatedExam.id ? updatedExam : e);
    saveExamsToStorage(updatedExamsList);
    setSelectedExamForQuestions(updatedExam);

    // Reset Form
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectOptionIndex(0);
    setPoints(20);
    setEditingQuestionId(null);

    if (showToast) showToast(uiLang === "kh" ? "បានរក្សាទុកសំណួរជោគជ័យ" : "Question saved successfully");
  };

  // Edit question inline
  const handleEditQuestionInModal = (q: Question) => {
    setEditingQuestionId(q.id);
    setQuestionText(q.text);
    setOptionA(q.options[0] || "");
    setOptionB(q.options[1] || "");
    setOptionC(q.options[2] || "");
    setOptionD(q.options[3] || "");
    const foundIndex = q.options.findIndex(opt => opt === q.answer);
    setCorrectOptionIndex(foundIndex >= 0 ? foundIndex : 0);
    setPoints(q.points || 20);
  };

  // Delete Question
  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedExamForQuestions) return;
    const updatedQuestions = selectedExamForQuestions.questions.filter(q => q.id !== questionId);
    const updatedExam: Exam = {
      ...selectedExamForQuestions,
      questions: updatedQuestions
    };
    const updatedExamsList = exams.map(e => e.id === updatedExam.id ? updatedExam : e);
    saveExamsToStorage(updatedExamsList);
    setSelectedExamForQuestions(updatedExam);
  };

  // Toggle Active Status
  const handleToggleStatus = (exam: Exam) => {
    const updated = exams.map(e => {
      if (e.id === exam.id) {
        return { ...e, status: e.status === "active" ? "inactive" : "active" as "active" | "inactive" };
      }
      return e;
    });
    saveExamsToStorage(updated);
  };

  // Delete Exam with Confirmation Modal
  const handleConfirmDeleteExam = () => {
    if (!deleteTargetExam) return;
    const updated = exams.filter(ex => ex.id !== deleteTargetExam.id);
    saveExamsToStorage(updated);
    if (showToast) showToast(uiLang === "kh" ? "បានលុបវិញ្ញាសាប្រឡង" : "Exam paper deleted");
    setDeleteTargetExam(null);
  };

  // Download Printable Paper as PDF
  const handleDownloadPaperPdf = async () => {
    const el = document.getElementById("printable-exam-worksheet");
    if (!el || !printPaperTargetExam) return;
    setIsGeneratingPdf(true);
    try {
      const { generatePDF } = await import("../../lib/pdf-generator");
      const filename = `Exam_Paper_${printPaperTargetExam.courseNameEn || printPaperTargetExam.courseName || 'Worksheet'}.pdf`;
      await generatePDF(el, filename, "portrait");
      if (showToast) showToast(uiLang === "kh" ? "បានទាញយកវិញ្ញាសាជា PDF ដោយជោគជ័យ" : "Exam paper downloaded as PDF successfully");
    } catch (err) {
      console.error("PDF generation error:", err);
      if (showToast) showToast(uiLang === "kh" ? "មានបញ្ហាក្នុងការបង្កើត PDF" : "Error generating PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Save Manual Student Exam Result
  const handleSaveManualResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResultForm.studentId || !newResultForm.examId) {
      alert(uiLang === "kh" ? "សូមជ្រើសរើសសិស្ស និងវិញ្ញាសាប្រឡង" : "Please select a student and an exam");
      return;
    }

    const selectedStud = students.find((s: any) => s.id === newResultForm.studentId || s.studentId === newResultForm.studentId);
    const selectedEx = exams.find((e) => e.id === newResultForm.examId);

    const studentNameKh = selectedStud?.nameKh || selectedStud?.name || "សិស្សសាកល្បង";
    const studentNameEn = selectedStud?.nameEn || selectedStud?.latinName || "Student";
    const courseName = selectedEx?.courseName || "វគ្គសិក្សា";
    const scoreVal = Number(newResultForm.score);
    const maxScoreVal = 100;
    const pct = Math.round((scoreVal / maxScoreVal) * 100);

    let gradeStr = "A+";
    if (pct < 50) gradeStr = "F";
    else if (pct < 65) gradeStr = "C";
    else if (pct < 80) gradeStr = "B";
    else if (pct < 90) gradeStr = "A";
    else gradeStr = "A+";

    const certCode = `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCertRecord = {
      id: `cert-rec-${Date.now()}`,
      certNumber: certCode,
      studentId: newResultForm.studentId,
      studentNameKh,
      studentNameEn,
      courseName,
      subject: selectedEx?.subject || "",
      score: scoreVal,
      maxScore: maxScoreVal,
      percentage: pct,
      grade: gradeStr,
      issueDateKh: newResultForm.issueDate,
      issueDateEn: newResultForm.issueDate,
      schoolNameKh: "សាលាកុំព្យូទ័រ ភីអិលស៊ី",
      directorName: "លោកនាយកសាលា"
    };

    const updatedResults = [newCertRecord, ...studentExamResults];
    setStudentExamResults(updatedResults);

    // Save to student specific localStorage
    if (selectedStud?.id) {
      const existingStudCertsStr = localStorage.getItem(`plc_earned_certificates_${selectedStud.id}`);
      let existingList: any[] = [];
      if (existingStudCertsStr) {
        try { existingList = JSON.parse(existingStudCertsStr); } catch (err) {}
      }
      localStorage.setItem(`plc_earned_certificates_${selectedStud.id}`, JSON.stringify([newCertRecord, ...existingList]));
    }

    if (showToast) showToast(uiLang === "kh" ? "បានរក្សាទុកលទ្ធផលប្រឡងសិស្សជោគជ័យ" : "Student exam result recorded successfully");
    setIsAddResultModalOpen(false);
  };

  // Filtered Student Results
  const filteredStudentResults = useMemo(() => {
    return studentExamResults.filter((res: any) => {
      const q = resultsSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        (res.studentNameKh && res.studentNameKh.toLowerCase().includes(q)) ||
        (res.studentNameEn && res.studentNameEn.toLowerCase().includes(q)) ||
        (res.certNumber && res.certNumber.toLowerCase().includes(q)) ||
        (res.courseName && res.courseName.toLowerCase().includes(q))
      );
    });
  }, [studentExamResults, resultsSearchQuery]);

  return (
    <div className="w-full space-y-6 pb-12 font-khmer">
      {/* HEADER BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-md shadow-indigo-200">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {uiLang === "kh" ? "ប្រឡងបញ្ចប់វគ្គសិក្សា" : "Course Final Exams Management"}
              </h1>
              <p className="text-sm text-slate-500">
                {uiLang === "kh" 
                  ? "បង្កើត រៀបចំ និងគ្រប់គ្រងវិញ្ញាសាប្រឡងបញ្ចប់វគ្គសិក្សាសម្រាប់សិស្សានុសិស្ស" 
                  : "Create, structure, and manage course final exams and certificates for students"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-100 transition-all text-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{uiLang === "kh" ? "បង្កើតវិញ្ញាសាថ្មី" : "Create New Exam"}</span>
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {uiLang === "kh" ? "វិញ្ញាសាប្រឡងសរុប" : "Total Exam Papers"}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.totalExams}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {uiLang === "kh" ? "វិញ្ញាសាកំពុងដំណើការ" : "Active Exams"}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.activeExams}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {uiLang === "kh" ? "សិស្សប្រឡងជាប់សរុប" : "Total Students Passed"}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.totalStudentsPassed}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {uiLang === "kh" ? "លក្ខខណ្ឌជាប់មធ្យម" : "Avg Passing Grade"}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">≥ {stats.avgPassing}%</h3>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS (Exams vs Results) */}
      <div className="flex border-b border-slate-200 bg-white px-4 pt-2 rounded-t-2xl">
        <button
          onClick={() => setActiveTab("exams")}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "exams"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{uiLang === "kh" ? "បញ្ជីវិញ្ញាសាប្រឡង" : "Exam Papers List"} ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("results")}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "results"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{uiLang === "kh" ? "លទ្ធផលការប្រឡងសិស្ស" : "Student Exam Results"} ({studentExamResults.length})</span>
        </button>
      </div>

      {/* EXAMS LIST TAB CONTENT */}
      {activeTab === "exams" && (
        <div className="space-y-4">
          {/* SEARCH AND FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={uiLang === "kh" ? "ស្វែងរកវិញ្ញាសា..." : "Search exams..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">{uiLang === "kh" ? "គ្រប់វគ្គសិក្សា" : "All Courses"}</option>
                {Array.from(new Set(exams.map(e => e.courseName))).map((cName) => (
                  <option key={cName} value={cName}>{cName}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">{uiLang === "kh" ? "ស្ថានភាពទាំងអស់" : "All Status"}</option>
                <option value="active">{uiLang === "kh" ? "កំពុងដំណើការ (សកម្ម)" : "Active"}</option>
                <option value="inactive">{uiLang === "kh" ? "ផ្អាកបណ្ដោះអាសន្ន" : "Inactive"}</option>
              </select>
            </div>
          </div>

          {/* EXAMS GRID */}
          {filteredExams.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-medium text-slate-600">
                {uiLang === "kh" ? "មិនមានវិញ្ញាសាប្រឡងត្រូវបានរកឃើញទេ" : "No exam papers found"}
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-medium text-sm hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                {uiLang === "kh" ? "បង្កើតវិញ្ញាសាដំបូង" : "Create First Exam"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExams.map((exam) => (
                <div 
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className={`p-4 bg-gradient-to-r ${exam.iconColor || "from-indigo-600 to-purple-600"} text-white flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-[11px] font-medium bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                            {exam.duration} {uiLang === "kh" ? "នាទី" : "mins"}
                          </span>
                          <h3 className="font-bold text-white text-base leading-snug mt-1 line-clamp-1">
                            {uiLang === "kh" ? exam.courseName : (exam.courseNameEn || exam.courseName)}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(exam)}
                        title={exam.status === "active" ? "Click to deactivate" : "Click to activate"}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border cursor-pointer ${
                          exam.status === "active"
                            ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/40"
                            : "bg-slate-500/20 text-slate-200 border-slate-400/40"
                        }`}
                      >
                        {exam.status === "active" 
                          ? (uiLang === "kh" ? "សកម្ម" : "Active") 
                          : (uiLang === "kh" ? "ផ្អាក" : "Inactive")}
                      </button>
                    </div>

                    {/* CARD BODY */}
                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md inline-block mb-1">
                          {exam.subject}
                        </span>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {exam.description || (uiLang === "kh" ? "វិញ្ញាសាប្រឡងបញ្ចប់វគ្គសិក្សា" : "Course final assessment exam paper")}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            {uiLang === "kh" ? "ចំនួនសំណួរ" : "Total Questions"}
                          </span>
                          <span className="font-bold text-slate-800 text-sm">
                            {exam.questions?.length || 0} {uiLang === "kh" ? "សំណួរ" : "Questions"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            {uiLang === "kh" ? "លក្ខខណ្ឌជាប់" : "Passing Mark"}
                          </span>
                          <span className="font-bold text-emerald-600 text-sm">
                            ≥ {exam.passingPercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD FOOTER ACTIONS */}
                  <div className="p-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleOpenQuestionsModal(exam)}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 px-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{uiLang === "kh" ? "គ្រប់គ្រងសំណួរ" : "Questions"} ({exam.questions?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => {
                        setPrintPaperTargetExam(exam);
                        setIsPaperPrintModalOpen(true);
                      }}
                      title={uiLang === "kh" ? "បោះពុម្ពក្រដាសប្រឡង" : "Print Exam Paper"}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setPreviewExam(exam);
                        setPracticeAnswers({});
                        setPracticeSubmitted(false);
                        setPracticeScore(null);
                        setIsPreviewModalOpen(true);
                      }}
                      title={uiLang === "kh" ? "មើលគំរូ / សាកល្បងប្រឡង" : "Preview / Practice Exam"}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(exam)}
                      title={uiLang === "kh" ? "កែប្រែ" : "Edit"}
                      className="p-2 text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTargetExam(exam)}
                      title={uiLang === "kh" ? "លុប" : "Delete"}
                      className="p-2 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STUDENT EXAM RESULTS TAB CONTENT */}
      {activeTab === "results" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {uiLang === "kh" ? "កំណត់ត្រាលទ្ធផលប្រឡងបញ្ចប់វគ្គ និងវិញ្ញាបនបត្រសិស្ស" : "Student Final Exam Results & Certificate Logs"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {uiLang === "kh" ? "បញ្ជីសិស្សដែលបានប្រឡងបញ្ចប់វគ្គសិក្សា និងទទួលបានវិញ្ញាបនបត្រ" : "List of students who passed course final exams and earned certificates"}
              </p>
            </div>

            <button
              onClick={() => {
                setNewResultForm({
                  studentId: students[0]?.id || "",
                  examId: exams[0]?.id || "",
                  score: 85,
                  issueDate: new Date().toISOString().split("T")[0]
                });
                setIsAddResultModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{uiLang === "kh" ? "បញ្ចូលលទ្ធផលប្រឡងផ្ទាល់" : "Record Exam Result"}</span>
            </button>
          </div>

          {/* SEARCH IN RESULTS */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={uiLang === "kh" ? "ស្វែងរកតាមឈ្មោះសិស្ស, កូដវិញ្ញាបនបត្រ..." : "Search student, cert code..."}
                value={resultsSearchQuery}
                onChange={(e) => setResultsSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {filteredStudentResults.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Award className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                {uiLang === "kh" ? "មិនទាន់មានទិន្នន័យប្រឡងរបស់សិស្សនៅឡើយទេ" : "No student exam records found"}
              </p>
              <button
                onClick={() => setIsAddResultModalOpen(true)}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-medium text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                {uiLang === "kh" ? "+ បញ្ចូលលទ្ធផលប្រឡងដំបូង" : "+ Record First Result"}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="p-3">#</th>
                    <th className="p-3">{uiLang === "kh" ? "លេខកូដវិញ្ញាបនបត្រ" : "Cert Code"}</th>
                    <th className="p-3">{uiLang === "kh" ? "ឈ្មោះសិស្ស" : "Student Name"}</th>
                    <th className="p-3">{uiLang === "kh" ? "វគ្គសិក្សា" : "Course Name"}</th>
                    <th className="p-3">{uiLang === "kh" ? "ពិន្ទុទទួលបាន" : "Score"}</th>
                    <th className="p-3">{uiLang === "kh" ? "កម្រិត/និទ្ទេស" : "Grade"}</th>
                    <th className="p-3">{uiLang === "kh" ? "កាលបរិច្ឆេទ" : "Date"}</th>
                    <th className="p-3 text-right">{uiLang === "kh" ? "សកម្មភាព" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudentResults.map((res, idx) => (
                    <tr key={res.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-slate-400 text-xs">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-indigo-600 text-xs">{res.certNumber}</td>
                      <td className="p-3 font-medium text-slate-800">
                        {res.studentNameKh} <span className="text-slate-400 text-xs font-normal">({res.studentNameEn})</span>
                      </td>
                      <td className="p-3 text-slate-700">{res.courseName}</td>
                      <td className="p-3 font-semibold text-emerald-600">
                        {res.score}/{res.maxScore || 100} ({res.percentage || 100}%)
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${
                          res.grade === 'A+' || res.grade === 'A'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : res.grade === 'B'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : res.grade === 'C'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {res.grade || "A+"}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 text-xs">{res.issueDateKh || res.issueDateEn}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setPreviewCertificateData(res);
                            setIsCertificatePreviewOpen(true);
                          }}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{uiLang === "kh" ? "មើលវិញ្ញាបនបត្រ" : "View Cert"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT EXAM MODAL */}
      <AnimatePresence>
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Award className="w-5 h-5" />
                  <span>
                    {editingExamId 
                      ? (uiLang === "kh" ? "កែប្រែវិញ្ញាសាប្រឡង" : "Edit Exam Paper")
                      : (uiLang === "kh" ? "បង្កើតវិញ្ញាសាប្រឡងថ្មី" : "Create New Exam Paper")}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveExam} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ឈ្មោះវគ្គសិក្សា (ភាសាខ្មែរ) *" : "Course Name (Khmer) *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. វគ្គ រចនាក្រាហ្វិក (Graphic Design)"
                    value={formData.courseNameKh || ""}
                    onChange={(e) => setFormData({ ...formData, courseNameKh: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ឈ្មោះវគ្គសិក្សា (English)" : "Course Name (English)"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Graphic Design Master Course"
                    value={formData.courseNameEn || ""}
                    onChange={(e) => setFormData({ ...formData, courseNameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "មុខវិជ្ជាប្រឡង *" : "Subject / Topic *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. Photoshop & Illustrator Fundamentals"
                    value={formData.subject || ""}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "រយះពេល (នាទី)" : "Duration (Mins)"}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={formData.duration || ""}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "លក្ខខណ្ឌជាប់ (%)" : "Passing Rate (%)"}
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={formData.passingPercent || ""}
                      onChange={(e) => setFormData({ ...formData, passingPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ការពណ៌នា" : "Description"}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ពណ៌នាបន្ថែមអំពីការប្រឡងបញ្ចប់វគ្គ..."
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ស្ថានភាព" : "Status"}
                  </label>
                  <select
                    value={formData.status || ""}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="active">{uiLang === "kh" ? "សកម្ម (អនុញ្ញាតឲ្យសិស្សប្រឡង)" : "Active"}</option>
                    <option value="inactive">{uiLang === "kh" ? "ផ្អាក (មិនទាន់ឲ្យប្រឡង)" : "Inactive"}</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 cursor-pointer"
                  >
                    {uiLang === "kh" ? "បោះបង់" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all cursor-pointer"
                  >
                    {uiLang === "kh" ? "រក្សាទុក" : "Save Exam"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANAGE QUESTIONS MODAL */}
      <AnimatePresence>
        {isQuestionsModalOpen && selectedExamForQuestions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
            >
              <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-md">
                    {selectedExamForQuestions.courseName}
                  </span>
                  <h3 className="font-bold text-lg text-white mt-1">
                    {uiLang === "kh" ? "គ្រប់គ្រងសំណួរប្រឡង" : "Manage Exam Questions"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsQuestionsModalOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* ADD/EDIT QUESTION FORM */}
                <form onSubmit={handleSaveQuestion} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-600" />
                    <span>
                      {editingQuestionId 
                        ? (uiLang === "kh" ? "កែប្រែសំណួរ" : "Edit Question") 
                        : (uiLang === "kh" ? "បន្ថែមសំណួរថ្មី" : "Add New Question")}
                    </span>
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {uiLang === "kh" ? "អត្ថបទសំណួរ *" : "Question Text *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. តើ Color Mode មួយណាប្រើសម្រាប់ Print Design?"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {uiLang === "kh" ? "ជម្រើស A *" : "Option A *"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="RGB"
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {uiLang === "kh" ? "ជម្រើស B *" : "Option B *"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="CMYK"
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {uiLang === "kh" ? "ជម្រើស C" : "Option C"}
                      </label>
                      <input
                        type="text"
                        placeholder="HSB"
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {uiLang === "kh" ? "ជម្រើស D" : "Option D"}
                      </label>
                      <input
                        type="text"
                        placeholder="Grayscale"
                        value={optionD}
                        onChange={(e) => setOptionD(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {uiLang === "kh" ? "ចម្លើយត្រឹមត្រូវ (Correct Answer)" : "Correct Answer"}
                      </label>
                      <select
                        value={correctOptionIndex}
                        onChange={(e) => setCorrectOptionIndex(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value={0}>ជម្រើស A ({optionA || "A"})</option>
                        <option value={1}>ជម្រើស B ({optionB || "B"})</option>
                        {optionC && <option value={2}>ជម្រើស C ({optionC})</option>}
                        {optionD && <option value={3}>ជម្រើស D ({optionD})</option>}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {uiLang === "kh" ? "ពិន្ទុសម្រាប់សំណួរនេះ" : "Points"}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    {editingQuestionId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuestionId(null);
                          setQuestionText("");
                          setOptionA("");
                          setOptionB("");
                          setOptionC("");
                          setOptionD("");
                        }}
                        className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        {uiLang === "kh" ? "បោះបង់" : "Cancel Edit"}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer shadow-sm"
                    >
                      {editingQuestionId 
                        ? (uiLang === "kh" ? "កែប្រែសំណួរ" : "Update Question")
                        : (uiLang === "kh" ? "បន្ថែមសំណួរ" : "Save Question")}
                    </button>
                  </div>
                </form>

                {/* EXISTING QUESTIONS LIST */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {uiLang === "kh" ? "បញ្ជីសំណួរដែលមានស្រាប់" : "Existing Questions"} ({selectedExamForQuestions.questions.length})
                  </h4>

                  {selectedExamForQuestions.questions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      {uiLang === "kh" ? "មិនទាន់មានសំណួរនៅក្នុងវិញ្ញាសានេះនៅឡើយ" : "No questions added yet"}
                    </p>
                  ) : (
                    selectedExamForQuestions.questions.map((q, idx) => (
                      <div key={q.id || idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            <span className="text-indigo-600 mr-1.5">Q{idx + 1}.</span>
                            {q.text}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleEditQuestionInModal(q)}
                              className="p-1 text-slate-500 hover:text-amber-600 rounded hover:bg-slate-100 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pl-4 text-xs">
                          {q.options.map((opt, oIdx) => (
                            <div 
                              key={oIdx}
                              className={`p-1.5 rounded-lg border ${
                                opt === q.answer 
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
                                  : "bg-slate-50 text-slate-600 border-slate-200"
                              }`}
                            >
                              {opt === q.answer && <Check className="w-3 h-3 inline mr-1 text-emerald-600" />}
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREVIEW EXAM MODAL */}
      <AnimatePresence>
        {isPreviewModalOpen && previewExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col"
            >
              <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    {previewExam.duration} mins • Passing ≥ {previewExam.passingPercent}%
                  </span>
                  <h3 className="font-bold text-lg text-white mt-1">
                    {previewExam.courseName}
                  </h3>
                </div>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {previewExam.description}
                </p>

                <h4 className="font-bold text-slate-800 text-sm border-b pb-2">
                  {uiLang === "kh" ? "សំណួរប្រឡងគំរូ" : "Exam Questions Preview"} ({previewExam.questions.length})
                </h4>

                {previewExam.questions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <p className="font-medium text-slate-800 text-sm">
                      <span className="font-bold text-indigo-600 mr-2">{idx + 1}.</span>
                      {q.text}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {q.options.map((opt, oIdx) => (
                        <div 
                          key={oIdx} 
                          className={`p-2 rounded-lg border ${
                            opt === q.answer 
                              ? "bg-emerald-100/70 border-emerald-400 text-emerald-900 font-bold"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          {opt === q.answer && "✓ "} {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CERTIFICATE PREVIEW MODAL */}
      <AnimatePresence>
        {isCertificatePreviewOpen && previewCertificateData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:static print:bg-transparent print:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-4 text-center font-serif printable-area print:shadow-none print:border-none print:p-4 print:max-w-full"
            >
              <div className="border-4 border-double border-amber-600/40 p-6 rounded-xl bg-gradient-to-b from-amber-50/30 to-white relative">
                <button
                  onClick={() => setIsCertificatePreviewOpen(false)}
                  className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-sans cursor-pointer print:hidden"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-widest font-sans">
                    {previewCertificateData.schoolNameKh || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                  </p>
                  <h2 className="text-2xl font-black text-amber-900 font-khmer pt-2">
                    វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា
                  </h2>
                  <p className="text-xs text-slate-500 tracking-wider uppercase font-sans">
                    ACADEMIC CERTIFICATE OF COMPLETION
                  </p>
                </div>

                <div className="my-6 space-y-2">
                  <p className="text-xs text-slate-600 italic">វិញ្ញាបនបត្រនេះបញ្ជាក់ជូនថា</p>
                  <h3 className="text-xl font-bold text-slate-900 underline decoration-amber-500 decoration-2 underline-offset-4">
                    {previewCertificateData.studentNameKh} ({previewCertificateData.studentNameEn})
                  </h3>
                  <p className="text-xs text-slate-600">បានប្រឡងជាប់បញ្ចប់វគ្គសិក្សាដោយជោគជ័យ</p>
                  <h4 className="text-base font-bold text-indigo-900 pt-1">
                    {previewCertificateData.courseName}
                  </h4>
                  <p className="text-xs text-emerald-700 font-bold font-sans">
                    Grade: {previewCertificateData.grade || "Pass"} ({previewCertificateData.percentage}%)
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs text-slate-500 font-sans border-t border-amber-200/60">
                  <div className="text-left">
                    <p className="font-bold text-slate-700">Cert No: {previewCertificateData.certNumber}</p>
                    <p>Issue Date: {previewCertificateData.issueDateEn || "July 2026"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 font-khmer">{previewCertificateData.directorName || "លោកនាយក"}</p>
                    <p className="text-[10px] text-slate-400">School Director</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 font-sans print:hidden">
                <button
                  onClick={() => setIsCertificatePreviewOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  {uiLang === "kh" ? "បិទ" : "Close"}
                </button>
                <button
                  onClick={async () => {
                    const el = document.querySelector('.printable-area') as HTMLElement;
                    if (el) {
                      setIsGeneratingPdf(true);
                      try {
                        const { generatePDF } = await import('../../lib/pdf-generator');
                        await generatePDF(el, `Certificate_${previewCertificateData?.studentNameEn || 'Student'}.pdf`, 'landscape');
                      } catch (e) {
                        console.error('PDF error:', e);
                        window.print();
                      } finally {
                        setIsGeneratingPdf(false);
                      }
                    } else {
                      window.print();
                    }
                  }}
                  disabled={isGeneratingPdf}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>{isGeneratingPdf ? (uiLang === "kh" ? "កំពុងបង្កើត PDF..." : "Saving...") : (uiLang === "kh" ? "រក្សាទុកជា PDF" : "Save as PDF")}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                >
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>{uiLang === "kh" ? "បោះពុម្ពវិញ្ញាបនបត្រ" : "Print Certificate"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE EXAM CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteTargetExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative z-10 text-center space-y-4 font-khmer"
            >
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Trash2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {uiLang === "kh" ? "លុបវិញ្ញាសាប្រឡង" : "Delete Exam Paper"}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
                  {uiLang === "kh"
                    ? `តើអ្នកប្រាកដជាចង់លុបវិញ្ញាសាប្រឡង "${deleteTargetExam.courseName}" មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
                    : `Are you sure you want to delete "${deleteTargetExam.courseName}"? This action cannot be undone.`}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetExam(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {uiLang === "kh" ? "បោះបង់" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteExam}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20 active:scale-95 cursor-pointer"
                >
                  {uiLang === "kh" ? "យល់ព្រមលុប" : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PAPER EXAM PRINTABLE WORKSHEET MODAL */}
      <AnimatePresence>
        {isPaperPrintModalOpen && printPaperTargetExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm print:static print:bg-transparent print:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col text-slate-800 font-khmer printable-exam-sheet print:max-h-none print:h-auto print:shadow-none print:border-none print:p-0 print:max-w-full"
            >
              {/* TOP MODAL BAR (Screen only) */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm">
                    {uiLang === "kh" ? "មើលគំរូក្រដាសប្រឡងសម្រាប់បោះពុម្ព" : "Printable Exam Worksheet Preview"}
                  </span>
                </div>
                <button
                  onClick={() => setIsPaperPrintModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SCROLLABLE WORKSHEET BODY */}
              <div id="printable-exam-worksheet" className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:overflow-visible print:p-2">
                {/* PRINTABLE HEADER */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-indigo-950 uppercase tracking-wide">
                      សាលាកុំព្យូទ័រ ភីអិលស៊ី • PLC COMPUTER ACADEMY
                    </h2>
                    <p className="text-sm font-bold text-slate-700">
                      វិញ្ញាសាប្រឡងបញ្ចប់វគ្គសិក្សា: <span className="text-indigo-700 font-black">{printPaperTargetExam.courseName}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      មុខវិជ្ជា: {printPaperTargetExam.subject} | រយៈពេល: {printPaperTargetExam.duration} នាទី | លក្ខខណ្ឌជាប់: ≥ {printPaperTargetExam.passingPercent}%
                    </p>
                  </div>
                </div>

                {/* STUDENT INFO LINES */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-transparent print:border-slate-300">
                  <div>ឈ្មោះសិស្ស: ..............................................................</div>
                  <div>អត្តលេខសិស្ស: .....................................................</div>
                  <div>ថ្នាក់សិក្សា: ................................................................</div>
                  <div>កាលបរិច្ឆេទប្រឡង: ..............................................</div>
                </div>

                {/* INSTRUCTION BOX */}
                <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium print:bg-transparent print:border-slate-300">
                  📌 <span className="font-bold">ការណែនាំ:</span> សូមជ្រើសរើស និងគូសសញ្ញា (✓) ឬជ្រើសរើសចម្លើយដែលត្រឹមត្រូវតែមួយគត់ក្នុងចំណោមចម្លើយ A, B, C, D ខាងក្រោម។
                </div>

                {/* QUESTIONS WORKSHEET */}
                <div className="space-y-5 text-xs leading-relaxed">
                  {printPaperTargetExam.questions.map((q, qIdx) => (
                    <div key={q.id || qIdx} className="space-y-2 border-b border-slate-100 pb-3 print:border-slate-200">
                      <p className="font-bold text-sm text-slate-900">
                        សំណួរទី {qIdx + 1}: {q.text} <span className="text-slate-400 font-normal">({q.points || 20} ពិន្ទុ)</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const optionLetters = ["A", "B", "C", "D"];
                          return (
                            <div key={oIdx} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded border border-slate-400 inline-block shrink-0 mt-0.5 print:border-black"></span>
                              <span className="font-bold text-slate-700">{optionLetters[oIdx]}.</span>
                              <span className="text-slate-800">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER SIGNATURE */}
                <div className="pt-8 flex justify-between text-xs text-slate-700 border-t border-slate-200">
                  <div className="text-center space-y-12">
                    <p className="font-bold">ហត្ថលេខា និងឈ្មោះសិស្ស</p>
                    <p>................................................</p>
                  </div>
                  <div className="text-center space-y-12">
                    <p className="font-bold">ហត្ថលេខាគ្រូត្រួតពិនិត្យ / នាយកសាលា</p>
                    <p>................................................</p>
                  </div>
                </div>
              </div>

              {/* FIXED ACTION BUTTONS AT BOTTOM (Screen only) */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 print:hidden">
                <span className="text-xs text-slate-500 font-medium">
                  {uiLang === "kh" ? `សរុប ${printPaperTargetExam.questions.length} សំណួរ` : `Total ${printPaperTargetExam.questions.length} Questions`}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsPaperPrintModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {uiLang === "kh" ? "បិទ" : "Close"}
                  </button>
                  <button
                    onClick={handleDownloadPaperPdf}
                    disabled={isGeneratingPdf}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isGeneratingPdf 
                        ? (uiLang === "kh" ? "កំពុងបង្កើត PDF..." : "Generating PDF...") 
                        : (uiLang === "kh" ? "ទាញយកជា PDF" : "Download PDF")}
                    </span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{uiLang === "kh" ? "បោះពុម្ពក្រដាសប្រឡង" : "Print Exam Worksheet"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECORD MANUAL RESULT MODAL */}
      <AnimatePresence>
        {isAddResultModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100 font-khmer"
            >
              <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-base">
                  <Award className="w-5 h-5" />
                  <span>{uiLang === "kh" ? "បញ្ចូលលទ្ធផលប្រឡងសិស្ស" : "Record Student Exam Result"}</span>
                </div>
                <button
                  onClick={() => setIsAddResultModalOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveManualResult} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ជ្រើសរើសសិស្ស *" : "Select Student *"}
                  </label>
                  <select
                    required
                    value={newResultForm.studentId}
                    onChange={(e) => setNewResultForm({ ...newResultForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">{uiLang === "kh" ? "-- ជ្រើសរើសសិស្ស --" : "-- Select Student --"}</option>
                    {students.map((s: any) => (
                      <option key={s.id || s.studentId} value={s.id || s.studentId}>
                        {s.nameKh || s.name || s.nameEn} ({s.code || s.id || 'Student'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ជ្រើសរើសវិញ្ញាសាប្រឡង *" : "Select Exam Paper *"}
                  </label>
                  <select
                    required
                    value={newResultForm.examId}
                    onChange={(e) => setNewResultForm({ ...newResultForm, examId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">{uiLang === "kh" ? "-- ជ្រើសរើសវិញ្ញាសា --" : "-- Select Exam --"}</option>
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.courseName} - {ex.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "ពិន្ទុទទួលបាន (លើ ១០០)" : "Score (Out of 100)"}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={newResultForm.score}
                      onChange={(e) => setNewResultForm({ ...newResultForm, score: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "កាលបរិច្ឆេទ" : "Issue Date"}
                    </label>
                    <input
                      type="date"
                      required
                      value={newResultForm.issueDate}
                      onChange={(e) => setNewResultForm({ ...newResultForm, issueDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddResultModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {uiLang === "kh" ? "បោះបង់" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all cursor-pointer"
                  >
                    {uiLang === "kh" ? "រក្សាទុកលទ្ធផល" : "Save Result"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
