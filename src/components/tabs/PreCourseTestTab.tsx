import React, { useState, useEffect, useMemo } from "react";
import { 
  FileCheck, Search, Plus, Trash2, X, Save, Edit, 
  Award, Calendar, BookOpen, CheckCircle2, 
  Clock, FileText, Eye, Filter, HelpCircle, Check, 
  ArrowRight, Layers, UserCheck, ShieldCheck, Sparkles, Target, Compass, Printer, Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  id: string;
  text: string;
  options: string[];
  answer: string;
  points: number;
}

interface PlacementTest {
  id: string;
  titleKh: string;
  titleEn: string;
  targetCategory: string; // e.g. Computer Administration, Graphic Design, Web Development
  duration: number; // minutes
  description: string;
  status: "active" | "inactive";
  createdDate: string;
  recommendedLevels: {
    beginnerThreshold: number; // e.g. < 50% => Beginner
    intermediateThreshold: number; // e.g. 50-80% => Intermediate
    advancedThreshold?: number; // e.g. > 80% => Advanced
  };
  questions: Question[];
}

interface CandidateResult {
  id: string;
  candidateNameKh: string;
  candidateNameEn: string;
  phone: string;
  testTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  recommendedLevel: string;
  recommendedLevelEn: string;
  date: string;
}

// Theme generator for test cards based on category or index
const getCategoryCardTheme = (category: string, idx: number) => {
  const cat = (category || "").toLowerCase();
  
  if (cat.includes("admin") || cat.includes("រដ្ឋបាល") || cat.includes("computer") || cat.includes("កុំព្យូទ័រ")) {
    return {
      headerGradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700",
      badgeStyle: "bg-blue-50 text-blue-700 border-blue-200/80 font-bold",
      qBtnStyle: "bg-blue-50 hover:bg-blue-100 text-blue-700",
      thresholdColor: "text-blue-600",
      hoverBorder: "hover:border-blue-400",
      glowColor: "hover:shadow-blue-500/10"
    };
  }
  
  if (cat.includes("graphic") || cat.includes("design") || cat.includes("រចនា")) {
    return {
      headerGradient: "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600",
      badgeStyle: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80 font-bold",
      qBtnStyle: "bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700",
      thresholdColor: "text-fuchsia-600",
      hoverBorder: "hover:border-fuchsia-400",
      glowColor: "hover:shadow-fuchsia-500/10"
    };
  }

  if (cat.includes("web") || cat.includes("dev") || cat.includes("គេហទំព័រ")) {
    return {
      headerGradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700",
      badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
      qBtnStyle: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700",
      thresholdColor: "text-emerald-600",
      hoverBorder: "hover:border-emerald-400",
      glowColor: "hover:shadow-emerald-500/10"
    };
  }

  if (cat.includes("net") || cat.includes("hardware") || cat.includes("បណ្តាញ") || cat.includes("ប្រព័ន្ធ")) {
    return {
      headerGradient: "bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80 font-bold",
      qBtnStyle: "bg-amber-50 hover:bg-amber-100 text-amber-800",
      thresholdColor: "text-amber-700",
      hoverBorder: "hover:border-amber-400",
      glowColor: "hover:shadow-amber-500/10"
    };
  }

  const themes = [
    {
      headerGradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700",
      badgeStyle: "bg-teal-50 text-teal-700 border-teal-200/80 font-bold",
      qBtnStyle: "bg-teal-50 hover:bg-teal-100 text-teal-700",
      thresholdColor: "text-teal-600",
      hoverBorder: "hover:border-teal-400",
      glowColor: "hover:shadow-teal-500/10"
    },
    {
      headerGradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700",
      badgeStyle: "bg-blue-50 text-blue-700 border-blue-200/80 font-bold",
      qBtnStyle: "bg-blue-50 hover:bg-blue-100 text-blue-700",
      thresholdColor: "text-blue-600",
      hoverBorder: "hover:border-blue-400",
      glowColor: "hover:shadow-blue-500/10"
    },
    {
      headerGradient: "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600",
      badgeStyle: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80 font-bold",
      qBtnStyle: "bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700",
      thresholdColor: "text-fuchsia-600",
      hoverBorder: "hover:border-fuchsia-400",
      glowColor: "hover:shadow-fuchsia-500/10"
    },
    {
      headerGradient: "bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80 font-bold",
      qBtnStyle: "bg-amber-50 hover:bg-amber-100 text-amber-800",
      thresholdColor: "text-amber-700",
      hoverBorder: "hover:border-amber-400",
      glowColor: "hover:shadow-amber-500/10"
    }
  ];

  return themes[idx % themes.length];
};

export default function PreCourseTestTab({ 
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

  // Main Tab State
  const [activeSubTab, setActiveSubTab] = useState<"tests" | "results">("tests");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Tests & Candidate Results state
  const [tests, setTests] = useState<PlacementTest[]>([]);
  const [candidateResults, setCandidateResults] = useState<CandidateResult[]>([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isResultPrintModalOpen, setIsResultPrintModalOpen] = useState(false);
  const [isPaperPrintModalOpen, setIsPaperPrintModalOpen] = useState(false);
  const [isAddCandidateResultModalOpen, setIsAddCandidateResultModalOpen] = useState(false);
  const [deleteTargetTest, setDeleteTargetTest] = useState<PlacementTest | null>(null);
  const [printPaperTargetTest, setPrintPaperTargetTest] = useState<PlacementTest | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [selectedTestForQuestions, setSelectedTestForQuestions] = useState<PlacementTest | null>(null);
  const [previewTest, setPreviewTest] = useState<PlacementTest | null>(null);
  const [selectedResultForPrint, setSelectedResultForPrint] = useState<CandidateResult | null>(null);

  // Practice Test Taking State
  const [testAnswers, setTestAnswers] = useState<{ [key: string]: string }>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScoreResult, setTestScoreResult] = useState<{ score: number; total: number; percentage: number; recommendedLevel: string } | null>(null);

  // Candidate Result Form State
  const [resultsSearchQuery, setResultsSearchQuery] = useState("");
  const [candidateForm, setCandidateForm] = useState({
    candidateNameKh: "",
    candidateNameEn: "",
    phone: "",
    testId: "",
    score: 80,
    date: new Date().toISOString().split("T")[0]
  });

  // Form state for Create/Edit Test
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titleKh: "",
    titleEn: "",
    targetCategory: "កុំព្យូទ័ររដ្ឋបាល (Computer Admin)",
    duration: 15,
    description: "",
    status: "active" as "active" | "inactive",
    beginnerThreshold: 50,
    intermediateThreshold: 80
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

  // Sample default diagnostic placement tests
  const defaultPlacementTests: PlacementTest[] = [
    {
      id: "pct-computer-basic",
      titleKh: "តេស្ដវាស់ស្ទង់កម្រិត កុំព្យូទ័របឋមដ្ឋាន & រដ្ឋបាល",
      titleEn: "Basic Computer & Admin Placement Test",
      targetCategory: "កុំព្យូទ័ររដ្ឋបាល (Computer Admin)",
      duration: 15,
      description: "តេស្ដស្ទង់សមត្ថភាពមុនចូលរៀន ដើម្បីវាយតម្លៃកម្រិតចំណេះដឹងផ្នែកកុំព្យូទ័របឋម និងរៀបចំចូលរៀនវគ្គសមស្រប",
      status: "active",
      createdDate: "2026-02-01",
      recommendedLevels: {
        beginnerThreshold: 50,
        intermediateThreshold: 80
      },
      questions: [
        {
          id: "pct-q1",
          text: "តើឧបករណ៍មួយណាជា Primary Input Device សម្រាប់វាយអត្ថបទចូលកុំព្យូទ័រ?",
          options: ["Keyboard (ក្តារចុច)", "Monitor (អេក្រង់)", "Printer (ម៉ាស៊ីនបោះពុម្ព)", "Speaker (បាស)"],
          answer: "Keyboard (ក្តារចុច)",
          points: 20
        },
        {
          id: "pct-q2",
          text: "តើសកាត់ (Shortcut) មួយណាប្រើសម្រាប់ចម្លង (Copy) អត្ថបទ ឬរូបភាព?",
          options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"],
          answer: "Ctrl + C",
          points: 20
        },
        {
          id: "pct-q3",
          text: "តើ MS Word ត្រូវបានគេប្រើប្រាស់សំខាន់សម្រាប់ធ្វើអ្វី?",
          options: [
            "វាយអត្ថបទ ធ្វើរដ្ឋបាល និងរៀបចំឯកសារ (Document Processing)",
            "កាត់តវីដេអូ",
            "គណនាបញ្ជីប្រាក់ខែស្មុគស្មាញ",
            "រចនារូបភាព 3D"
          ],
          answer: "វាយអត្ថបទ ធ្វើរដ្ឋបាល និងរៀបចំឯកសារ (Document Processing)",
          points: 20
        },
        {
          id: "pct-q4",
          text: "តើ Extension ស្តង់ដាររបស់ File រូបភាពជាអ្វី?",
          options: [".png / .jpg", ".mp3", ".xlsx", ".pdf"],
          answer: ".png / .jpg",
          points: 20
        },
        {
          id: "pct-q5",
          text: "តើអ្វីទៅជា Internet Web Browser?",
          options: ["Google Chrome / Microsoft Edge", "MS Excel", "Adobe Photoshop", "VLC Player"],
          answer: "Google Chrome / Microsoft Edge",
          points: 20
        }
      ]
    },
    {
      id: "pct-graphic-design",
      titleKh: "តេស្ដវាស់ស្ទង់កម្រិត រចនាក្រាហ្វិក & គំនូសសិល្បៈ",
      titleEn: "Graphic Design Level Placement Test",
      targetCategory: "រចនាក្រាហ្វិក (Graphic Design)",
      duration: 15,
      description: "វាយតម្លៃយល់ដឹងអំពីពណ៌ (Color Theory), Layout & សូហ្វវែររចនា Photoshop/Illustrator",
      status: "active",
      createdDate: "2026-02-05",
      recommendedLevels: {
        beginnerThreshold: 50,
        intermediateThreshold: 80
      },
      questions: [
        {
          id: "pct-gd-q1",
          text: "តើ Primary Colors (ពណ៌ដើម) មានពណ៌អ្វីខ្លះ?",
          options: ["ក្រហម, លឿង, ខៀវ (Red, Yellow, Blue)", "ខៀវ, បៃតង, ស្វាយ", "ស, ខ្មៅ, ប្រផេះ", "លឿង, ក្រូច, ផ្កាឈូក"],
          answer: "ក្រហម, លឿង, ខៀវ (Red, Yellow, Blue)",
          points: 25
        },
        {
          id: "pct-gd-q2",
          text: "តើកម្មវិធី Adobe Photoshop សមស្របបំផុតសម្រាប់ប្រភេទការងារអ្វី?",
          options: [
            "កែច្នៃ និងកាត់តរូបភាព (Raster Photo Editing)",
            "រចនារូបសញ្ញា Logo Vector ធំៗ",
            "វាយអត្ថបទសៀវភៅ",
            "បំប្លែង Sound Audio"
          ],
          answer: "កែច្នៃ និងកាត់តរូបភាព (Raster Photo Editing)",
          points: 25
        },
        {
          id: "pct-gd-q3",
          text: "តើអ្វីជាលក្ខណៈខុសគ្នារវាង RGB និង CMYK?",
          options: [
            "RGB សម្រាប់បង្ហាញលើអេក្រង់ ഡിជីថល, CMYK សម្រាប់បោះពុម្ពលើក្រដាស",
            "RGB សម្រាប់បោះពុម្ព, CMYK សម្រាប់អេក្រង់",
            "ដូចគ្នាមិនខុសគ្នាទេ",
            "ប្រើតែលើទូរស័ព្ទដៃ"
          ],
          answer: "RGB សម្រាប់បង្ហាញលើអេក្រង់ ഡിជីថល, CMYK សម្រាប់បោះពុម្ពលើក្រដាស",
          points: 25
        },
        {
          id: "pct-gd-q4",
          text: "តើ Typography ក្នុងវិស័យ Graphic Design សំដៅលើអ្វី?",
          options: ["សិល្បៈនៃការរៀបចំ និងប្រើប្រាស់ពុម្ពអក្សរ (Font/Text Design)", "ការថតរូបភាព", "ការគូរប្លង់ផ្ទះ", "ការថតវីដេអូ"],
          answer: "សិល្បៈនៃការរៀបចំ និងប្រើប្រាស់ពុម្ពអក្សរ (Font/Text Design)",
          points: 25
        }
      ]
    },
    {
      id: "pct-web-dev",
      titleKh: "តេស្ដវាស់ស្ទង់កម្រិត ការបង្កើតគេហទំព័រ (Web Dev Diagnostic)",
      titleEn: "Web Development Placement Test",
      targetCategory: "អភិវឌ្ឍន៍គេហទំព័រ (Web Development)",
      duration: 20,
      description: "តេស្ដវាស់ស្ទង់សមត្ថភាពមុនចូលរៀនវគ្គ HTML, CSS, JavaScript & Framework",
      status: "active",
      createdDate: "2026-02-10",
      recommendedLevels: {
        beginnerThreshold: 50,
        intermediateThreshold: 80
      },
      questions: [
        {
          id: "pct-web-q1",
          text: "តើភាសាណាខ្លះជាគ្រឹះចម្បង ៣ សម្រាប់បង្កើត Frontend Web Page?",
          options: ["HTML, CSS, JavaScript", "Python, Java, C++", "SQL, PHP, Ruby", "Swift, Kotlin, Flutter"],
          answer: "HTML, CSS, JavaScript",
          points: 25
        },
        {
          id: "pct-web-q2",
          text: "តើ Tag HTML មួយណាប្រើសម្រាប់បង្កើត Link?",
          options: ["<a>", "<link>", "<href>", "<button>"],
          answer: "<a>",
          points: 25
        },
        {
          id: "pct-web-q3",
          text: "តើ CSS មានតួនាទីអ្វីក្នុងការបង្កើត Web?",
          options: ["លម្អពណ៌ ម៉ូដ និងទម្រង់ Layout រូបរាងគេហទំព័រ", "រក្សាទុកទិន្នន័យក្នុង Database", "គ្រប់គ្រង Domain Server", "សរសេរ Logic អ៊ីមែល"],
          answer: "លម្អពណ៌ ម៉ូដ និងទម្រង់ Layout រូបរាងគេហទំព័រ",
          points: 25
        },
        {
          id: "pct-web-q4",
          text: "តើ console.log('Hello') នៅក្នុង JavaScript ធ្វើអ្វី?",
          options: ["បង្ហាញសារដំណឹងក្នុង Developer Console Panel", "បង្ហាញ alert box លើអេក្រង់", "បោះពុម្ពលើក្រដាស", "រក្សាទុក file"],
          answer: "បង្ហាញសារដំណឹងក្នុង Developer Console Panel",
          points: 25
        }
      ]
    }
  ];

  // Sample candidate placement test results
  const defaultCandidateResults: CandidateResult[] = [
    {
      id: "res-001",
      candidateNameKh: "សុខ ចាន់ថន",
      candidateNameEn: "Sok Chanthan",
      phone: "012 345 678",
      testTitle: "តេស្ដវាស់ស្ទង់កម្រិត កុំព្យូទ័របឋមដ្ឋាន & រដ្ឋបាល",
      score: 80,
      totalPoints: 100,
      percentage: 80,
      recommendedLevel: "កម្រិតមធ្យម (Intermediate Level)",
      recommendedLevelEn: "Intermediate Level",
      date: "2026-02-12"
    },
    {
      id: "res-002",
      candidateNameKh: "មាស សុជាតា",
      candidateNameEn: "Meas Socheata",
      phone: "098 765 432",
      testTitle: "តេស្ដវាស់ស្ទង់កម្រិត រចនាក្រាហ្វិក & គំនូសសិល្បៈ",
      score: 100,
      totalPoints: 100,
      percentage: 100,
      recommendedLevel: "កម្រិតខ្ពស់ (Advanced / Master Level)",
      recommendedLevelEn: "Advanced Level",
      date: "2026-02-14"
    },
    {
      id: "res-003",
      candidateNameKh: "ឡុង វិសាល",
      candidateNameEn: "Long Visal",
      phone: "088 112 233",
      testTitle: "តេស្ដវាស់ស្ទង់កម្រិត ការបង្កើតគេហទំព័រ (Web Dev Diagnostic)",
      score: 40,
      totalPoints: 100,
      percentage: 40,
      recommendedLevel: "កម្រិតដំបូងបង្អស់ (Foundation / Beginner Level)",
      recommendedLevelEn: "Beginner Level",
      date: "2026-02-15"
    }
  ];

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedTests = localStorage.getItem("sms_pre_course_tests");
      if (savedTests) {
        setTests(JSON.parse(savedTests));
      } else {
        setTests(defaultPlacementTests);
        localStorage.setItem("sms_pre_course_tests", JSON.stringify(defaultPlacementTests));
      }
    } catch (e) {
      console.error(e);
      setTests(defaultPlacementTests);
    }

    try {
      const savedResults = localStorage.getItem("sms_pre_course_test_results");
      if (savedResults) {
        setCandidateResults(JSON.parse(savedResults));
      } else {
        setCandidateResults(defaultCandidateResults);
        localStorage.setItem("sms_pre_course_test_results", JSON.stringify(defaultCandidateResults));
      }
    } catch (e) {
      console.error(e);
      setCandidateResults(defaultCandidateResults);
    }
  }, []);

  // Save tests
  const saveTestsToStorage = (updated: PlacementTest[]) => {
    setTests(updated);
    localStorage.setItem("sms_pre_course_tests", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("sms_pre_course_tests_updated"));
  };

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return tests.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        t.titleKh.toLowerCase().includes(q) ||
        t.titleEn.toLowerCase().includes(q) ||
        t.targetCategory.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);

      const matchesStatus = filterStatus === "all" || t.status === filterStatus;
      const matchesCategory = filterCategory === "all" || t.targetCategory === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tests, searchQuery, filterStatus, filterCategory]);

  // Download Paper Worksheet as PDF
  const handleDownloadPaperPdf = async () => {
    const el = document.getElementById("printable-diagnostic-test-worksheet");
    if (!el || !printPaperTargetTest) return;
    setIsGeneratingPdf(true);
    try {
      const { generatePDF } = await import("../../lib/pdf-generator");
      const filename = `Placement_Test_${printPaperTargetTest.titleEn || 'Diagnostic'}.pdf`;
      await generatePDF(el, filename, "portrait");
      if (showToast) showToast(uiLang === "kh" ? "បានទាញយកវិញ្ញាសាតេស្ដជា PDF ដោយជោគជ័យ" : "Placement test downloaded as PDF successfully");
    } catch (err) {
      console.error("PDF generation error:", err);
      if (showToast) showToast(uiLang === "kh" ? "មានបញ្ហាក្នុងការបង្កើត PDF" : "Error generating PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Confirm Delete Test
  const handleConfirmDeleteTest = () => {
    if (!deleteTargetTest) return;
    const updated = tests.filter(t => t && t.id !== deleteTargetTest.id);
    saveTestsToStorage(updated);
    if (showToast) showToast(uiLang === "kh" ? "បានលុបវិញ្ញាសាតេស្ដ" : "Placement test deleted");
    setDeleteTargetTest(null);
  };

  // Save Candidate Diagnostic Result
  const handleSaveCandidateResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.candidateNameKh.trim() || !candidateForm.testId) {
      alert(uiLang === "kh" ? "សូមបញ្ចូលឈ្មោះបេក្ខជន និងជ្រើសរើសវិញ្ញាសាតេស្ដ" : "Please enter candidate name and select test");
      return;
    }

    const selTest = tests.find(t => t && t.id === candidateForm.testId);
    const scoreVal = Number(candidateForm.score);
    const maxVal = 100;
    const pct = Math.round((scoreVal / maxVal) * 100);

    let recKh = "ថ្នាក់ដំបូង (Beginner)";
    let recEn = "Beginner Level";

    if (pct >= (selTest?.recommendedLevels?.intermediateThreshold || 80)) {
      recKh = "ថ្នាក់ជាន់ខ្ពស់ (Advanced)";
      recEn = "Advanced Level";
    } else if (pct >= (selTest?.recommendedLevels?.beginnerThreshold || 50)) {
      recKh = "ថ្នាក់មធ្យម (Intermediate)";
      recEn = "Intermediate Level";
    }

    const newRecord: CandidateResult = {
      id: `cand-res-${Date.now()}`,
      candidateNameKh: candidateForm.candidateNameKh,
      candidateNameEn: candidateForm.candidateNameEn || candidateForm.candidateNameKh,
      phone: candidateForm.phone || "---",
      testTitle: selTest?.titleKh || "តេស្ដវាស់ស្ទង់សមត្ថភាព",
      score: scoreVal,
      totalPoints: maxVal,
      percentage: pct,
      recommendedLevel: recKh,
      recommendedLevelEn: recEn,
      date: candidateForm.date
    };

    const updated = [newRecord, ...candidateResults];
    setCandidateResults(updated);
    try {
      localStorage.setItem("plc_candidate_placement_results", JSON.stringify(updated));
    } catch (err) {}

    if (showToast) showToast(uiLang === "kh" ? "បានរក្សាទុកលទ្ធផលតេស្ដបេក្ខជនជោគជ័យ" : "Candidate test result recorded successfully");
    setIsAddCandidateResultModalOpen(false);
  };

  // Filtered Candidate Results
  const filteredCandidateResults = useMemo(() => {
    return candidateResults.filter(c => {
      const q = resultsSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        c.candidateNameKh.toLowerCase().includes(q) ||
        c.candidateNameEn.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.testTitle.toLowerCase().includes(q) ||
        c.recommendedLevel.toLowerCase().includes(q)
      );
    });
  }, [candidateResults, resultsSearchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalTests = tests.length;
    const activeTests = tests.filter(t => t && t.status === "active").length;
    const totalTestedCandidates = candidateResults.length;
    const avgScore = candidateResults.length > 0
      ? Math.round(candidateResults.reduce((acc, c) => acc + c.percentage, 0) / candidateResults.length)
      : 0;

    return { totalTests, activeTests, totalTestedCandidates, avgScore };
  }, [tests, candidateResults]);

  // Handle Create Test
  const handleOpenCreateModal = () => {
    setFormData({
      titleKh: "",
      titleEn: "",
      targetCategory: "កុំព្យូទ័ររដ្ឋបាល (Computer Admin)",
      duration: 15,
      description: "",
      status: "active",
      beginnerThreshold: 50,
      intermediateThreshold: 80
    });
    setEditingTestId(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleKh.trim()) {
      alert(uiLang === "kh" ? "សូមបញ្ចូលចំណងជើងវិញ្ញាសាតេស្ដ" : "Please enter test title");
      return;
    }

    if (editingTestId) {
      const updated = tests.map(t => {
        if (t.id === editingTestId) {
          return {
            ...t,
            titleKh: formData.titleKh,
            titleEn: formData.titleEn || formData.titleKh,
            targetCategory: formData.targetCategory,
            duration: Number(formData.duration),
            description: formData.description,
            status: formData.status,
            recommendedLevels: {
              beginnerThreshold: Number(formData.beginnerThreshold),
              intermediateThreshold: Number(formData.intermediateThreshold)
            }
          };
        }
        return t;
      });
      saveTestsToStorage(updated);
      if (showToast) showToast(uiLang === "kh" ? "បានកែប្រែវិញ្ញាសាតេស្ដជោគជ័យ" : "Placement test updated");
    } else {
      const newTest: PlacementTest = {
        id: `pct-${Date.now()}`,
        titleKh: formData.titleKh,
        titleEn: formData.titleEn || formData.titleKh,
        targetCategory: formData.targetCategory,
        duration: Number(formData.duration),
        description: formData.description,
        status: formData.status,
        createdDate: new Date().toISOString().split("T")[0],
        recommendedLevels: {
          beginnerThreshold: Number(formData.beginnerThreshold),
          intermediateThreshold: Number(formData.intermediateThreshold)
        },
        questions: []
      };
      saveTestsToStorage([newTest, ...tests]);
      if (showToast) showToast(uiLang === "kh" ? "បានបង្កើតវិញ្ញាសាតេស្ដថ្មីជោគជ័យ" : "New placement test created");
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleOpenEditModal = (test: PlacementTest) => {
    setEditingTestId(test.id);
    setFormData({
      titleKh: test.titleKh,
      titleEn: test.titleEn,
      targetCategory: test.targetCategory,
      duration: test.duration,
      description: test.description,
      status: test.status,
      beginnerThreshold: test.recommendedLevels?.beginnerThreshold || 50,
      intermediateThreshold: test.recommendedLevels?.intermediateThreshold || 80
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteTest = (id: string) => {
    const updated = tests.filter(t => t && t.id !== id);
    saveTestsToStorage(updated);
    if (showToast) showToast(uiLang === "kh" ? "បានលុបវិញ្ញាសាតេស្ដ" : "Placement test deleted");
  };

  // Questions Management inside Modal
  const handleOpenQuestionsModal = (test: PlacementTest) => {
    setSelectedTestForQuestions(test);
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

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestForQuestions) return;
    if (!questionText.trim() || !optionA.trim() || !optionB.trim()) {
      alert(uiLang === "kh" ? "សូមបញ្ចូលសំណួរ និងជម្រើសចម្លើយយ៉ាងតិច ២" : "Please fill in question text and at least 2 options");
      return;
    }

    const options = [optionA, optionB];
    if (optionC.trim()) options.push(optionC.trim());
    if (optionD.trim()) options.push(optionD.trim());

    const chosenAnswer = options[correctOptionIndex] || options[0];

    let updatedQuestions = [...selectedTestForQuestions.questions];

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

    const updatedTest: PlacementTest = {
      ...selectedTestForQuestions,
      questions: updatedQuestions
    };

    const updatedList = tests.map(t => t.id === updatedTest.id ? updatedTest : t);
    saveTestsToStorage(updatedList);
    setSelectedTestForQuestions(updatedTest);

    // Reset
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

  const handleEditQuestionInModal = (q: Question) => {
    setEditingQuestionId(q.id);
    setQuestionText(q.text);
    setOptionA(q.options[0] || "");
    setOptionB(q.options[1] || "");
    setOptionC(q.options[2] || "");
    setOptionD(q.options[3] || "");
    const idx = q.options.findIndex(opt => opt === q.answer);
    setCorrectOptionIndex(idx >= 0 ? idx : 0);
    setPoints(q.points || 20);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedTestForQuestions) return;
    const updatedQuestions = selectedTestForQuestions.questions.filter(q => q.id !== questionId);
    const updatedTest: PlacementTest = {
      ...selectedTestForQuestions,
      questions: updatedQuestions
    };
    const updatedList = tests.map(t => t.id === updatedTest.id ? updatedTest : t);
    saveTestsToStorage(updatedList);
    setSelectedTestForQuestions(updatedTest);
  };

  const handleToggleStatus = (test: PlacementTest) => {
    const updated = tests.map(t => {
      if (t.id === test.id) {
        return { ...t, status: t.status === "active" ? "inactive" : "active" as "active" | "inactive" };
      }
      return t;
    });
    saveTestsToStorage(updated);
  };

  return (
    <div className="w-full space-y-6 pb-12 font-khmer">
      {/* HEADER BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl text-white shadow-md shadow-teal-200">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {uiLang === "kh" ? "ប្រឡងតេស្ដ មុនវគ្គសិក្សា" : "Pre-Course Diagnostic & Placement Test"}
              </h1>
              <p className="text-sm text-slate-500">
                {uiLang === "kh" 
                  ? "បង្កើត រៀបចំ និងគ្រប់គ្រងវិញ្ញាសាតេស្ដវាស់ស្ទង់សមត្ថភាពសិស្សមុនចូលរៀនដើម្បីណែនាំកម្រិតថ្នាក់ដែលសមស្រប" 
                  : "Create and manage diagnostic placement tests to assess student skill levels prior to course enrollment"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-md shadow-teal-200 transition-all text-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{uiLang === "kh" ? "បង្កើតវិញ្ញាសាតេស្ដថ្មី" : "Create Placement Test"}</span>
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white to-teal-50/40 p-5 rounded-2xl border border-teal-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3 bg-teal-600 text-white rounded-xl shadow-md shadow-teal-200">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {uiLang === "kh" ? "វិញ្ញាសាតេស្ដសរុប" : "Total Placement Tests"}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.totalTests}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50/40 p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {uiLang === "kh" ? "វិញ្ញាសាកំពុងប្រើប្រាស់" : "Active Placement Tests"}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.activeTests}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50/40 p-5 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {uiLang === "kh" ? "សិស្ស/បេក្ខជនបានធ្វើតេស្ដ" : "Tested Candidates"}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.totalTestedCandidates}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50/40 p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md shadow-amber-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {uiLang === "kh" ? "ពិន្ទុតេស្ដមធ្យម" : "Average Diagnostic Score"}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.avgScore}%</h3>
          </div>
        </div>
      </div>

      {/* SUB TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 bg-white px-4 pt-2 rounded-t-2xl">
        <button
          onClick={() => setActiveSubTab("tests")}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === "tests"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{uiLang === "kh" ? "បញ្ជីវិញ្ញាសាតេស្ដ" : "Placement Tests List"} ({tests.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("results")}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === "results"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{uiLang === "kh" ? "លទ្ធផល និងការណែនាំកម្រិតថ្នាក់" : "Candidate Level Results"} ({candidateResults.length})</span>
        </button>
      </div>

      {/* PLACEMENT TESTS TAB CONTENT */}
      {activeSubTab === "tests" && (
        <div className="space-y-4">
          {/* SEARCH & FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={uiLang === "kh" ? "ស្វែងរកវិញ្ញាសាតេស្ដ..." : "Search tests..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="all">{uiLang === "kh" ? "គ្រប់ផ្នែកសិក្សា" : "All Categories"}</option>
                {Array.from(new Set(tests.map(t => t.targetCategory))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="all">{uiLang === "kh" ? "ស្ថានភាពទាំងអស់" : "All Status"}</option>
                <option value="active">{uiLang === "kh" ? "សកម្ម (កំពុងប្រើ)" : "Active"}</option>
                <option value="inactive">{uiLang === "kh" ? "ផ្អាកបណ្ដោះអាសន្ន" : "Inactive"}</option>
              </select>
            </div>
          </div>

          {/* TESTS GRID */}
          {filteredTests.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
              <Compass className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-medium text-slate-600">
                {uiLang === "kh" ? "មិនមានវិញ្ញាសាតេស្ដត្រូវបានរកឃើញទេ" : "No placement tests found"}
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl font-medium text-sm hover:bg-teal-100 transition-colors cursor-pointer"
              >
                {uiLang === "kh" ? "បង្កើតវិញ្ញាសាតេស្ដដំបូង" : "Create First Test"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTests.map((test, idx) => {
                const theme = getCategoryCardTheme(test.targetCategory, idx);

                return (
                  <div 
                    key={test.id}
                    className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg ${theme.hoverBorder} ${theme.glowColor} transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
                  >
                    <div>
                      {/* CARD HEADER WITH DYNAMIC CATEGORY GRADIENT */}
                      <div className={`p-4 ${theme.headerGradient} text-white flex items-center justify-between shadow-inner`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-sm">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-[11px] font-medium bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                              {test.duration} {uiLang === "kh" ? "នាទី" : "mins"}
                            </span>
                            <h3 className="font-bold text-white text-base leading-snug mt-1 line-clamp-1">
                              {uiLang === "kh" ? test.titleKh : (test.titleEn || test.titleKh)}
                            </h3>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleStatus(test)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border cursor-pointer transition-all ${
                            test.status === "active"
                              ? "bg-emerald-500/25 text-emerald-100 border-emerald-300/50 hover:bg-emerald-500/40"
                              : "bg-slate-500/30 text-slate-200 border-slate-300/40 hover:bg-slate-500/50"
                          }`}
                        >
                          {test.status === "active" 
                            ? (uiLang === "kh" ? "សកម្ម" : "Active") 
                            : (uiLang === "kh" ? "ផ្អាក" : "Inactive")}
                        </button>
                      </div>

                      {/* CARD BODY */}
                      <div className="p-5 space-y-4">
                        <div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-block mb-1.5 border ${theme.badgeStyle}`}>
                            {test.targetCategory}
                          </span>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {test.description || (uiLang === "kh" ? "វិញ្ញាសាតេស្ដស្ទង់សមត្ថភាពមុនចូលរៀន" : "Diagnostic placement assessment test")}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[10px]">
                              {uiLang === "kh" ? "ចំនួនសំណួរ" : "Questions"}
                            </span>
                            <span className="font-bold text-slate-800 text-sm">
                              {test.questions?.length || 0} {uiLang === "kh" ? "សំណួរ" : "Qns"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">
                              {uiLang === "kh" ? "កម្រិតមធ្យម" : "Intermediate Threshold"}
                            </span>
                            <span className={`font-bold text-sm ${theme.thresholdColor}`}>
                              ≥ {test.recommendedLevels?.beginnerThreshold || 50}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="p-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleOpenQuestionsModal(test)}
                        className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${theme.qBtnStyle}`}
                      >
                        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{uiLang === "kh" ? "គ្រប់គ្រងសំណួរ" : "Questions"} ({test.questions?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => {
                          setPrintPaperTargetTest(test);
                          setIsPaperPrintModalOpen(true);
                        }}
                        title={uiLang === "kh" ? "បោះពុម្ពក្រដាសតេស្ដ" : "Print Test Worksheet"}
                        className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setPreviewTest(test);
                          setTestAnswers({});
                          setTestSubmitted(false);
                          setTestScoreResult(null);
                          setIsPreviewModalOpen(true);
                        }}
                        title={uiLang === "kh" ? "មើលគំរូ / សាកល្បងធ្វើតេស្ដ" : "Preview / Practice Test"}
                        className="p-2 text-slate-600 hover:text-teal-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(test)}
                        title={uiLang === "kh" ? "កែប្រែ" : "Edit"}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTargetTest(test)}
                        title={uiLang === "kh" ? "លុប" : "Delete"}
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CANDIDATE RESULTS TAB CONTENT */}
      {activeSubTab === "results" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {uiLang === "kh" ? "កំណត់ត្រាលទ្ធផលតេស្ដវាស់ស្ទង់ និងការណែនាំកម្រិតថ្នាក់" : "Candidate Placement Test Results & Recommended Levels"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {uiLang === "kh" ? "បញ្ជីបេក្ខជនដែលបានធ្វើតេស្ដវាស់ស្ទង់សមត្ថភាពមុនចូលរៀន" : "List of candidates who took the pre-course diagnostic placement test"}
              </p>
            </div>

            <button
              onClick={() => {
                setCandidateForm({
                  candidateNameKh: "",
                  candidateNameEn: "",
                  phone: "",
                  testId: tests[0]?.id || "",
                  score: 80,
                  date: new Date().toISOString().split("T")[0]
                });
                setIsAddCandidateResultModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-teal-100 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{uiLang === "kh" ? "បញ្ចូលលទ្ធផលតេស្ដផ្ទាល់" : "Record Candidate Result"}</span>
            </button>
          </div>

          {/* SEARCH IN RESULTS */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={uiLang === "kh" ? "ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ..." : "Search name, phone..."}
                value={resultsSearchQuery}
                onChange={(e) => setResultsSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {filteredCandidateResults.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Compass className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                {uiLang === "kh" ? "មិនទាន់មានកំណត់ត្រាលទ្ធផលតេស្ដនៅឡើយទេ" : "No candidate test results logged"}
              </p>
              <button
                onClick={() => setIsAddCandidateResultModalOpen(true)}
                className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl font-medium text-xs hover:bg-teal-100 transition-colors cursor-pointer"
              >
                {uiLang === "kh" ? "+ បញ្ចូលលទ្ធផលតេស្ដដំបូង" : "+ Record First Result"}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4 pb-2">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">{uiLang === "kh" ? "ឈ្មោះបេក្ខជន" : "Candidate Name"}</th>
                    <th className="py-3.5 px-4">{uiLang === "kh" ? "លេខទូរស័ព្ទ" : "Phone"}</th>
                    <th className="py-3.5 px-4">{uiLang === "kh" ? "មុខវិជ្ជា/វិញ្ញាសា" : "Test Title"}</th>
                    <th className="py-3.5 px-4">{uiLang === "kh" ? "ពិន្ទុ/ភាគរយ" : "Score / %"}</th>
                    <th className="py-3.5 px-4">{uiLang === "kh" ? "កម្រិតណែនាំ" : "Recommended Level"}</th>
                    <th className="py-3.5 px-4">{uiLang === "kh" ? "កាលបរិច្ឆេទ" : "Date"}</th>
                    <th className="py-3.5 px-4 text-right pr-6">{uiLang === "kh" ? "សកម្មភាព" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidateResults.map((res, idx) => (
                    <tr key={res.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {res.candidateNameKh} <span className="text-slate-400 text-xs font-normal">({res.candidateNameEn})</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">{res.phone}</td>
                      <td className="py-3.5 px-4 text-slate-700 min-w-[220px]">{res.testTitle}</td>
                      <td className="py-3.5 px-4 font-semibold text-teal-600 whitespace-nowrap">
                        {res.score}/{res.totalPoints} ({res.percentage}%)
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                          res.percentage >= 80 
                            ? "bg-purple-100 text-purple-800 border border-purple-200" 
                            : res.percentage >= 50 
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                          {res.recommendedLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">{res.date}</td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                        <button
                          onClick={() => {
                            setSelectedResultForPrint(res);
                            setIsResultPrintModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs border border-teal-200/60"
                        >
                          <Printer className="w-3.5 h-3.5 shrink-0" />
                          <span>{uiLang === "kh" ? "បោះពុម្ពលិខិតណែនាំ" : "Print Slip"}</span>
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

      {/* CREATE / EDIT PLACEMENT TEST MODAL */}
      <AnimatePresence>
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-5 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Compass className="w-5 h-5" />
                  <span>
                    {editingTestId 
                      ? (uiLang === "kh" ? "កែប្រែវិញ្ញាសាតេស្ដ មុនវគ្គសិក្សា" : "Edit Placement Test")
                      : (uiLang === "kh" ? "បង្កើតវិញ្ញាសាតេស្ដ មុនវគ្គសិក្សាថ្មី" : "Create New Placement Test")}
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

              <form onSubmit={handleSaveTest} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ចំណងជើងវិញ្ញាសាតេស្ដ (ភាសាខ្មែរ) *" : "Test Title (Khmer) *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. តេស្ដវាស់ស្ទង់កម្រិត កុំព្យូទ័របឋមដ្ឋាន & រដ្ឋបាល"
                    value={formData.titleKh || ""}
                    onChange={(e) => setFormData({ ...formData, titleKh: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ចំណងជើង (English)" : "Test Title (English)"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Basic Computer Administration Diagnostic Test"
                    value={formData.titleEn || ""}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ប្រភេទទិសដៅ/ជំនាញ *" : "Target Skill/Category *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. កុំព្យូទ័ររដ្ឋបាល, រចនាក្រាហ្វិក, Web Dev..."
                    value={formData.targetCategory || ""}
                    onChange={(e) => setFormData({ ...formData, targetCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "រយះពេល (នាទី)" : "Duration (mins)"}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={formData.duration || ""}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "កម្រិតដំបូង (< %)" : "Beginner Threshold"}
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={formData.beginnerThreshold || ""}
                      onChange={(e) => setFormData({ ...formData, beginnerThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "កម្រិតខ្ពស់ (≥ %)" : "Advanced Threshold"}
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={formData.intermediateThreshold || ""}
                      onChange={(e) => setFormData({ ...formData, intermediateThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ការពណ៌នា" : "Description"}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ពណ៌នាអំពីគោលបំណងនៃតេស្ដនេះ..."
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ស្ថានភាព" : "Status"}
                  </label>
                  <select
                    value={formData.status || ""}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="active">{uiLang === "kh" ? "សកម្ម (អនុញ្ញាតឲ្យធ្វើតេស្ដ)" : "Active"}</option>
                    <option value="inactive">{uiLang === "kh" ? "ផ្អាក (មិនទាន់ឲ្យធ្វើតេស្ដ)" : "Inactive"}</option>
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
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-teal-100 transition-all cursor-pointer"
                  >
                    {uiLang === "kh" ? "រក្សាទុក" : "Save Test"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANAGE QUESTIONS MODAL */}
      <AnimatePresence>
        {isQuestionsModalOpen && selectedTestForQuestions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
            >
              <div className="p-5 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-md">
                    {selectedTestForQuestions.targetCategory}
                  </span>
                  <h3 className="font-bold text-lg text-white mt-1">
                    {uiLang === "kh" ? "គ្រប់គ្រងសំណួរតេស្ដវាស់ស្ទង់" : "Manage Placement Test Questions"}
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
                {/* ADD / EDIT QUESTION FORM */}
                <form onSubmit={handleSaveQuestion} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4 text-teal-600" />
                    <span>
                      {editingQuestionId 
                        ? (uiLang === "kh" ? "កែប្រែសំណួរ" : "Edit Question") 
                        : (uiLang === "kh" ? "បន្ថែមសំណួរថ្មី" : "Add New Question")}
                    </span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "ខ្លឹមសារសំណួរ *" : "Question Text *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. តើឧបករណ៍មួយណាជា Primary Input Device?"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {uiLang === "kh" ? "ជម្រើស ក (Option A) *" : "Option A *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {uiLang === "kh" ? "ជម្រើស ខ (Option B) *" : "Option B *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {uiLang === "kh" ? "ជម្រើស គ (Option C)" : "Option C"}
                      </label>
                      <input
                        type="text"
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {uiLang === "kh" ? "ជម្រើស ឃ (Option D)" : "Option D"}
                      </label>
                      <input
                        type="text"
                        value={optionD}
                        onChange={(e) => setOptionD(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {uiLang === "kh" ? "ចម្លើយត្រឹមត្រូវ *" : "Correct Answer Option *"}
                      </label>
                      <select
                        value={correctOptionIndex}
                        onChange={(e) => setCorrectOptionIndex(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      >
                        <option value={0}>ជម្រើស ក (Option A)</option>
                        <option value={1}>ជម្រើស ខ (Option B)</option>
                        {optionC && <option value={2}>ជម្រើស គ (Option C)</option>}
                        {optionD && <option value={3}>ជម្រើស ឃ (Option D)</option>}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {uiLang === "kh" ? "ពិន្ទុសម្រាប់សំណួរនេះ" : "Points"}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
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
                        className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-xl text-xs font-medium cursor-pointer"
                      >
                        {uiLang === "kh" ? "បោះបង់" : "Cancel Edit"}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                    >
                      {editingQuestionId 
                        ? (uiLang === "kh" ? "កែប្រែសំណួរ" : "Update Question") 
                        : (uiLang === "kh" ? "បន្ថែមសំណួរ" : "Add Question")}
                    </button>
                  </div>
                </form>

                {/* EXISTING QUESTIONS LIST */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {uiLang === "kh" ? "បញ្ជីសំណួរដែលមានក្នុងវិញ្ញាសា" : "Existing Questions List"} ({selectedTestForQuestions.questions.length})
                  </h4>

                  {selectedTestForQuestions.questions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                      {uiLang === "kh" ? "មិនទាន់មានសំណួរត្រូវបានបន្ថែមនៅឡើយទេ" : "No questions added yet"}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedTestForQuestions.questions.map((q, qIdx) => (
                        <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-800 text-sm">
                              {qIdx + 1}. {q.text} <span className="text-xs font-semibold text-teal-600">({q.points || 20} ពិន្ទុ)</span>
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleEditQuestionInModal(q)}
                                className="p-1 text-slate-500 hover:text-amber-600 rounded cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-1 text-slate-500 hover:text-rose-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, oIdx) => (
                              <div 
                                key={oIdx}
                                className={`p-2 rounded-lg border ${
                                  opt === q.answer 
                                    ? "bg-emerald-50 border-emerald-300 font-semibold text-emerald-800" 
                                    : "bg-slate-50 border-slate-200 text-slate-600"
                                }`}
                              >
                                {opt === q.answer && <Check className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />}
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRINT SLIP MODAL */}
      <AnimatePresence>
        {isResultPrintModalOpen && selectedResultForPrint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:static print:bg-transparent print:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 printable-area print:shadow-none print:border-none print:p-0 print:max-w-full"
            >
              {/* Header: Clean & Minimal Top */}
              <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0 border border-teal-100">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-teal-700 tracking-wider uppercase">សាលាកុំព្យូទ័រ ភីអិលស៊ី • PLC COMPUTER TRAINING CENTER</p>
                      <h3 className="font-bold text-slate-800 text-base md:text-lg leading-snug">លិខិតបញ្ជាក់កម្រិតសមត្ថភាពមុនចូលរៀន</h3>
                      <p className="text-[11px] text-slate-400">Placement Assessment & Level Recommendation Slip</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 font-mono text-[11px] rounded-md font-medium">
                      #{selectedResultForPrint.id?.slice(-6).toUpperCase() || '202601'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body: Clean Key-Value Details */}
              <div className="p-6 space-y-5">
                {/* Information Table/Grid */}
                <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden text-xs sm:text-sm">
                  <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/60">
                    <span className="text-slate-500 font-medium">{uiLang === "kh" ? "ឈ្មោះបេក្ខជន/សិស្ស" : "Candidate Name"}</span>
                    <span className="font-bold text-slate-800 text-right">
                      {selectedResultForPrint.candidateNameKh} <span className="text-slate-500 font-normal">({selectedResultForPrint.candidateNameEn})</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{uiLang === "kh" ? "លេខទូរស័ព្ទ" : "Phone Number"}</span>
                    <span className="font-mono font-semibold text-slate-700">{selectedResultForPrint.phone}</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/60">
                    <span className="text-slate-500 font-medium">{uiLang === "kh" ? "វិញ្ញាសាតេស្ដ" : "Placement Test"}</span>
                    <span className="font-semibold text-slate-700 text-right">{selectedResultForPrint.testTitle}</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{uiLang === "kh" ? "ពិន្ទុទទួលបាន" : "Score Achieved"}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-700">{selectedResultForPrint.score} / {selectedResultForPrint.totalPoints}</span>
                      <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold text-xs rounded-md border border-teal-200">
                        {selectedResultForPrint.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-teal-50/40">
                    <span className="text-teal-900 font-bold">{uiLang === "kh" ? "កម្រិតថ្នាក់ដែលណែនាំ" : "Recommended Level"}</span>
                    <span className="px-3 py-1 bg-teal-600 text-white font-bold text-xs sm:text-sm rounded-lg shadow-2xs">
                      {uiLang === "kh" ? selectedResultForPrint.recommendedLevel : (selectedResultForPrint.recommendedLevelEn || selectedResultForPrint.recommendedLevel)}
                    </span>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="space-y-1.5 px-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{uiLang === "kh" ? "កម្រិតលទ្ធផលសមត្ថភាព" : "Performance Level"}</span>
                    <span className="font-bold text-slate-700">{selectedResultForPrint.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, Math.max(0, selectedResultForPrint.percentage))}%` }}
                    />
                  </div>
                </div>

                {/* Note */}
                <p className="text-[11px] text-slate-400 text-center italic">
                  * {uiLang === "kh" ? "លិខិតនេះមានសុពលភាពសម្រាប់ចុះឈ្មោះចូលរៀនតាមកម្រិតថ្នាក់ដែលបានណែនាំនៅសាលាកុំព្យូទ័រ ភីអិលស៊ី។" : "Valid for registration at PLC Computer Training Center according to recommended level."}
                </p>

                {/* Footer & Signature Block */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-start text-xs">
                  <div className="space-y-0.5 text-slate-500">
                    <p className="font-bold text-slate-800">{uiLang === "kh" ? "សាលាកុំព្យូទ័រ ភីអិលស៊ី" : "PLC Computer Training Center"}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{uiLang === "kh" ? "PLC Computer Training Center" : "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}</p>
                    <p className="text-slate-600 pt-1.5">{uiLang === "kh" ? "ថ្ងៃខែឆ្នាំចេញ៖" : "Issue Date:"} <span className="font-mono font-semibold text-slate-800">{selectedResultForPrint.date}</span></p>
                    <p className="text-[11px] text-slate-400 font-mono">www.plccomputer.com</p>
                  </div>
                  <div className="text-center pr-2 pb-10">
                    <p className="font-semibold text-slate-700">{uiLang === "kh" ? "ហត្ថលេខា និងត្រាអ្នកទទួលខុសត្រូវ" : "Authorized Signature"}</p>
                  </div>
                </div>
              </div>

              {/* Modal Control Footer Buttons */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5 print:hidden">
                <button
                  onClick={() => setIsResultPrintModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs"
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
                        await generatePDF(el, `Placement_Slip_${selectedResultForPrint.candidateNameEn || 'Candidate'}.pdf`);
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
                  className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>{isGeneratingPdf ? (uiLang === "kh" ? "កំពុងបង្កើត PDF..." : "Saving...") : (uiLang === "kh" ? "រក្សាទុកជា PDF" : "Save as PDF")}</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>{uiLang === "kh" ? "បោះពុម្ព (Print)" : "Print"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREVIEW & PRACTICE EXAM MODAL */}
      <AnimatePresence>
        {isPreviewModalOpen && previewTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col"
            >
              <div className="p-5 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
                <div>
                  <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-0.5 rounded-md">
                    {previewTest.targetCategory}
                  </span>
                  <h3 className="font-bold text-lg text-white mt-1">
                    {previewTest.titleKh}
                  </h3>
                </div>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                <p className="text-xs text-slate-500 italic bg-teal-50 p-3 rounded-xl border border-teal-100">
                  {previewTest.description}
                </p>

                {testSubmitted && testScoreResult && (
                  <div className="p-4 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md space-y-2 text-center">
                    <Award className="w-10 h-10 mx-auto text-amber-300" />
                    <h4 className="font-bold text-lg">
                      {uiLang === "kh" ? "លទ្ធផលតេស្ដវាស់ស្ទង់សមត្ថភាព" : "Diagnostic Assessment Result"}
                    </h4>
                    <p className="text-2xl font-black text-amber-200 font-mono">
                      {testScoreResult.score} / {testScoreResult.total} ({testScoreResult.percentage}%)
                    </p>
                    <div className="pt-1">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-full border border-white/30">
                        {uiLang === "kh" ? `កម្រិតណែនាំ៖ ${testScoreResult.recommendedLevel}` : `Recommended: ${testScoreResult.recommendedLevel}`}
                      </span>
                    </div>
                  </div>
                )}

                {previewTest.questions.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">មិនទាន់មានសំណួរត្រូវបានបន្ថែមនៅឡើយទេ</p>
                ) : (
                  previewTest.questions.map((q, idx) => {
                    const selectedOpt = testAnswers[q.id];
                    const isCorrect = selectedOpt === q.answer;

                    return (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-800 text-sm">
                            {idx + 1}. {q.text}
                          </p>
                          <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 shrink-0">
                            {q.points || 20} {uiLang === "kh" ? "ពិន្ទុ" : "pts"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, oIdx) => {
                            let itemStyle = "bg-white border-slate-200 text-slate-700 hover:border-teal-300";
                            if (testSubmitted) {
                              if (opt === q.answer) {
                                itemStyle = "bg-emerald-100 border-emerald-400 font-bold text-emerald-800";
                              } else if (selectedOpt === opt && !isCorrect) {
                                itemStyle = "bg-rose-100 border-rose-300 text-rose-800 font-medium";
                              } else {
                                itemStyle = "bg-white border-slate-200 text-slate-400 opacity-60";
                              }
                            } else if (selectedOpt === opt) {
                              itemStyle = "bg-teal-50 border-teal-500 font-semibold text-teal-800 ring-1 ring-teal-500";
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={testSubmitted}
                                onClick={() => {
                                  setTestAnswers(prev => ({ ...prev, [q.id]: opt }));
                                }}
                                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${itemStyle}`}
                              >
                                {testSubmitted && opt === q.answer && <Check className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />}
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                {!testSubmitted && previewTest.questions.length > 0 ? (
                  <button
                    onClick={() => {
                      let obtained = 0;
                      let totalPossible = 0;
                      previewTest.questions.forEach(q => {
                        const pts = q.points || 20;
                        totalPossible += pts;
                        if (testAnswers[q.id] === q.answer) {
                          obtained += pts;
                        }
                      });
                      const pct = totalPossible > 0 ? Math.round((obtained / totalPossible) * 100) : 0;
                      let rec = "ថ្នាក់ដំបូង (Beginner)";
                      if (pct >= (previewTest.recommendedLevels?.intermediateThreshold || 80)) {
                        rec = "ថ្នាក់ជាន់ខ្ពស់ (Advanced)";
                      } else if (pct >= (previewTest.recommendedLevels?.beginnerThreshold || 50)) {
                        rec = "ថ្នាក់មធ្យម (Intermediate)";
                      }
                      setTestScoreResult({ score: obtained, total: totalPossible, percentage: pct, recommendedLevel: rec });
                      setTestSubmitted(true);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    {uiLang === "kh" ? "បញ្ជូនចម្លើយ & គណនាពិន្ទុ" : "Submit & Calculate Score"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTestAnswers({});
                      setTestSubmitted(false);
                      setTestScoreResult(null);
                    }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {uiLang === "kh" ? "ធ្វើតេស្ដឡើងវិញ" : "Retake Test"}
                  </button>
                )}

                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {uiLang === "kh" ? "បិទ" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRINTABLE PAPER ASSESSMENT WORKSHEET MODAL */}
      <AnimatePresence>
        {isPaperPrintModalOpen && printPaperTargetTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:static print:bg-transparent print:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col print:max-w-full print:max-h-none print:shadow-none print:border-none"
            >
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-teal-400" />
                  <span className="font-bold text-sm">
                    {uiLang === "kh" ? "មើលគំរូក្រដាសវិញ្ញាសាតេស្ដសម្រាប់បោះពុម្ព" : "Printable Diagnostic Test Worksheet"}
                  </span>
                </div>
                <button
                  onClick={() => setIsPaperPrintModalOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SCROLLABLE WORKSHEET BODY */}
              <div id="printable-diagnostic-test-worksheet" className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:overflow-visible print:p-2">
                {/* PRINTABLE HEADER */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="font-extrabold text-xl text-slate-900 tracking-tight">
                      សាលាកុំព្យូទ័រ ភីអិលស៊ី • PLC COMPUTER TRAINING CENTER
                    </h2>
                    <h3 className="font-bold text-base text-teal-800">
                      ក្រដាសប្រឡងតេស្ដវាស់ស្ទង់សមត្ថភាពមុនចូលរៀន ({printPaperTargetTest.targetCategory})
                    </h3>
                    <p className="text-xs font-semibold text-slate-700">
                      វិញ្ញាសា៖ {printPaperTargetTest.titleKh}
                    </p>
                  </div>
                  <div className="text-right text-xs space-y-1">
                    <p className="font-bold text-slate-800">{uiLang === "kh" ? "រយៈពេល៖" : "Duration:"} {printPaperTargetTest.duration} {uiLang === "kh" ? "នាទី" : "Mins"}</p>
                    <p className="text-slate-600">{uiLang === "kh" ? "កាលបរិច្ឆេទ៖" : "Date:"} ____/____/2026</p>
                  </div>
                </div>

                {/* STUDENT NAME FILL BLOCK */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold p-3 bg-slate-50 border border-slate-300 rounded-lg">
                  <div>
                    <span>{uiLang === "kh" ? "ឈ្មោះបេក្ខជន៖" : "Candidate Name:"} _______________________</span>
                  </div>
                  <div>
                    <span>{uiLang === "kh" ? "លេខទូរស័ព្ទ៖" : "Phone:"} _______________________</span>
                  </div>
                </div>

                {/* INSTRUCTIONS */}
                <p className="text-xs italic text-slate-600">
                  * {uiLang === "kh" ? "សូមគូសវង់ (O) លើចម្លើយដែលត្រឹមត្រូវបំផុតក្នុងចំណោមជម្រើសខាងក្រោម៖" : "Please circle (O) the correct option for each question below:"}
                </p>

                {/* QUESTIONS LIST */}
                <div className="space-y-5">
                  {printPaperTargetTest.questions.map((q, idx) => (
                    <div key={q.id} className="space-y-2 text-xs">
                      <p className="font-bold text-slate-900 text-sm">
                        {idx + 1}. {q.text} <span className="font-normal text-slate-500">({q.points || 20} ពិន្ទុ)</span>
                      </p>
                      <div className="grid grid-cols-2 gap-2 pl-4">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-slate-400 inline-block text-center text-[10px] leading-3 font-mono">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-slate-800">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* SCORE EVALUATION BOX FOR TEACHER */}
                <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs">
                  <div className="border border-slate-400 p-3 rounded-lg w-64 space-y-1">
                    <p className="font-bold text-slate-800">{uiLang === "kh" ? "សម្រាប់គ្រូវាយតម្លៃ (Teacher Evaluation):" : "Teacher Evaluation:"}</p>
                    <p>{uiLang === "kh" ? "ពិន្ទុទទួលបាន៖ ________ / 100" : "Score: ________ / 100"}</p>
                    <p>{uiLang === "kh" ? "កម្រិតថ្នាក់ណែនាំ៖ [  ] Beginner  [  ] Intermediate  [  ] Advanced" : "Recommended: [ ] Beginner [ ] Intermediate [ ] Advanced"}</p>
                  </div>
                  <div className="text-center space-y-8 pr-4">
                    <p className="font-bold text-slate-800">{uiLang === "kh" ? "ហត្ថលេខាគ្រូវាយតម្លៃ" : "Evaluator Signature"}</p>
                    <p className="text-slate-400 text-[10px]">_______________________</p>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center print:hidden">
                <span className="text-xs text-slate-500 font-medium">
                  {uiLang === "kh" ? `សរុប ${printPaperTargetTest.questions.length} សំណួរ` : `Total ${printPaperTargetTest.questions.length} Questions`}
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
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{uiLang === "kh" ? "បោះពុម្ព (Print)" : "Print Worksheet"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECORD CANDIDATE RESULT MODAL */}
      <AnimatePresence>
        {isAddCandidateResultModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="p-5 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex items-center justify-between">
                <h3 className="font-bold text-base text-white">
                  {uiLang === "kh" ? "បញ្ចូលកំណត់ត្រាលទ្ធផលតេស្ដបេក្ខជន" : "Record Candidate Placement Result"}
                </h3>
                <button
                  onClick={() => setIsAddCandidateResultModalOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCandidateResult} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ឈ្មោះបេក្ខជន (ខ្មែរ) *" : "Candidate Name (Khmer) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateForm.candidateNameKh}
                    onChange={(e) => setCandidateForm({ ...candidateForm, candidateNameKh: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    placeholder="ឧ. សុខ ចាន់ថន"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ឈ្មោះបេក្ខជន (អង់គ្លេស)" : "Candidate Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={candidateForm.candidateNameEn}
                    onChange={(e) => setCandidateForm({ ...candidateForm, candidateNameEn: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    placeholder="e.g. Sok Chanthorn"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "លេខទូរស័ព្ទ" : "Phone Number"}
                  </label>
                  <input
                    type="text"
                    value={candidateForm.phone}
                    onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
                    placeholder="012 345 678"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {uiLang === "kh" ? "ជ្រើសរើសវិញ្ញាសាតេស្ដ *" : "Select Placement Test *"}
                  </label>
                  <select
                    required
                    value={candidateForm.testId}
                    onChange={(e) => setCandidateForm({ ...candidateForm, testId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    {tests.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.titleKh} ({t.targetCategory})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "ពិន្ទុទទួលបាន (0 - 100)" : "Score Achieved (0 - 100)"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={candidateForm.score}
                      onChange={(e) => setCandidateForm({ ...candidateForm, score: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {uiLang === "kh" ? "កាលបរិច្ឆេទ" : "Date"}
                    </label>
                    <input
                      type="date"
                      value={candidateForm.date}
                      onChange={(e) => setCandidateForm({ ...candidateForm, date: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCandidateResultModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300 cursor-pointer"
                  >
                    {uiLang === "kh" ? "បោះបង់" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
                  >
                    {uiLang === "kh" ? "រក្សាទុក" : "Save Result"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE TEST CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteTargetTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-100 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {uiLang === "kh" ? "បញ្ជាក់ការលុបវិញ្ញាសាតេស្ដ" : "Confirm Delete Test"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {uiLang === "kh" ? "តើអ្នកពិតជាចង់លុបវិញ្ញាសានេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។" : "Are you sure you want to delete this test? This action cannot be undone."}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <p className="font-bold text-slate-800">{deleteTargetTest.titleKh}</p>
                <p className="text-slate-500">{deleteTargetTest.targetCategory}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteTargetTest(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {uiLang === "kh" ? "បោះបង់" : "Cancel"}
                </button>
                <button
                  onClick={handleConfirmDeleteTest}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-md"
                >
                  {uiLang === "kh" ? "លុបវិញ្ញាសា" : "Delete Test"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
