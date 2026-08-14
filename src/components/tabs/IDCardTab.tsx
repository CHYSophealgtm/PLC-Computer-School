import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import { Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Upload, Loader2, Camera, QrCode, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle, ShieldCheck, Maximize2, SlidersHorizontal, RefreshCw, Palette, Paintbrush } from 'lucide-react';

export default function IDCardTab(props: any) {
  const { activeTab, backCardRef, downloadIdCard, frontCardRef, handleImageUpload, handlePrefillStudent, handlePrefillTeacher, handleSaveIdCardBackgrounds, idCardAddress, idCardBackgroundBack, idCardBackgroundFront, idCardDob, idCardExpireDate, idCardField1, idCardField2, idCardField3, idCardField4, idCardGender, idCardIdNumber, idCardIssueDate, idCardNameEn, idCardNameKh, idCardPhone, idCardPhoto, idCardPrintSide, idCardRole, idCardSchoolName, isOpenStudentIdCardDropdown, isOpenTeacherIdCardDropdown, isSavingBackgrounds, printIdCard, saveAsPdf, schoolKhmerName, schoolLogo, selectedIdCardStudent, selectedIdCardTeacher, setIdCardAddress, setIdCardBackgroundBack, setIdCardBackgroundFront, setIdCardDob, setIdCardExpireDate, setIdCardField1, setIdCardField2, setIdCardField3, setIdCardField4, setIdCardGender, setIdCardIdNumber, setIdCardIssueDate, setIdCardNameEn, setIdCardNameKh, setIdCardPhone, setIdCardPhoto, setIdCardPrintSide, setIdCardRole, setIsOpenStudentIdCardDropdown, setIsOpenTeacherIdCardDropdown, setSelectedIdCardStudent, setSelectedIdCardTeacher, setStudentIdCardSearchQuery, setTeacherIdCardSearchQuery, studentIdCardSearchQuery, students, teacherIdCardSearchQuery, teachers, uiLang: propUiLang, directorSignature } = props;

  const [localLang, setLocalLang] = React.useState(propUiLang || localStorage.getItem("plc_lang") || "kh");

  // Custom Dimensions States in Centimeters (cm)
  const [cardWidthCm, setCardWidthCm] = React.useState<number>(5.7);
  const [cardHeightCm, setCardHeightCm] = React.useState<number>(8.6);
  const [cardRadiusCm, setCardRadiusCm] = React.useState<number>(0.6);
  const [sizePreset, setSizePreset] = React.useState<string>("cr80_vertical");
  const [showCustomSizePanel, setShowCustomSizePanel] = React.useState<boolean>(false);

  // Color Gradient Tools States
  const [cardPrimaryColor, setCardPrimaryColor] = React.useState<string>("#1d5bd8");
  const [cardSecondaryColor, setCardSecondaryColor] = React.useState<string>("#1e40af");
  const [isGradientEnabled, setIsGradientEnabled] = React.useState<boolean>(true);
  const [gradientAngle, setGradientAngle] = React.useState<number>(135);
  const [showColorPickerPanel, setShowColorPickerPanel] = React.useState<boolean>(false);

  // Dynamic Background style for card accent areas
  const cardAccentBg = isGradientEnabled
    ? `linear-gradient(${gradientAngle}deg, ${cardPrimaryColor}, ${cardSecondaryColor})`
    : cardPrimaryColor;

  const GRADIENT_PRESETS = [
    { nameKh: "ខៀវរ៉ូយ៉ាល់", nameEn: "Royal Blue", primary: "#1d5bd8", secondary: "#1e40af" },
    { nameKh: "បៃតងត្បូង", nameEn: "Emerald Mint", primary: "#059669", secondary: "#047857" },
    { nameKh: "ស្វាយរាជវង្ស", nameEn: "Royal Violet", primary: "#7c3aed", secondary: "#4c1d95" },
    { nameKh: "ក្រហមត្បូង", nameEn: "Ruby Rose", primary: "#e11d48", secondary: "#9f1239" },
    { nameKh: "ទឹកក្រូចមាស", nameEn: "Sunset Amber", primary: "#d97706", secondary: "#b45309" },
    { nameKh: "ខៀវស្រងាត់", nameEn: "Ocean Cyan", primary: "#0891b2", secondary: "#0f766e" },
    { nameKh: "ខ្មៅប្រណីត", nameEn: "Obsidian Slate", primary: "#1f2937", secondary: "#111827" },
    { nameKh: "ស៊ីជម្ពូ", nameEn: "Vibrant Magenta", primary: "#c026d3", secondary: "#86198f" },
    { nameKh: "ខៀវអគ្គិសនី", nameEn: "Electric Sky", primary: "#0284c7", secondary: "#0369a1" },
  ];

  // Computed Pixel values for rendering (1 cm = 43.1 px)
  const cardWidth = Math.round(cardWidthCm * 43.1);
  const cardHeight = Math.round(cardHeightCm * 43.1);
  const cardRadius = Math.round(cardRadiusCm * 43.1);

  const applySizePreset = (presetKey: string) => {
    setSizePreset(presetKey);
    if (presetKey === "cr80_vertical") {
      setCardWidthCm(5.7);
      setCardHeightCm(8.6);
      setCardRadiusCm(0.6);
    } else if (presetKey === "cr80_horizontal") {
      setCardWidthCm(8.6);
      setCardHeightCm(5.7);
      setCardRadiusCm(0.6);
    } else if (presetKey === "square") {
      setCardWidthCm(7.0);
      setCardHeightCm(7.0);
      setCardRadiusCm(0.5);
    } else if (presetKey === "compact") {
      setCardWidthCm(5.0);
      setCardHeightCm(7.5);
      setCardRadiusCm(0.4);
    } else if (presetKey === "large") {
      setCardWidthCm(6.5);
      setCardHeightCm(10.0);
      setCardRadiusCm(0.7);
    } else if (presetKey === "custom") {
      setShowCustomSizePanel(true);
    }
  };

  const handleSwapDimensions = () => {
    const tempW = cardWidthCm;
    setCardWidthCm(cardHeightCm);
    setCardHeightCm(tempW);
    setSizePreset("custom");
  };

  React.useEffect(() => {
    if (propUiLang) {
      setLocalLang(propUiLang);
    }
  }, [propUiLang]);

  React.useEffect(() => {
    const handleLangChange = (e: any) => {
      setLocalLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  const uiLang = localLang;

  return (
    <>
{activeTab === "ID Card" && (() => {
              const idt = (kh: string, en?: string, zh?: string) => {
                if (localLang === "en") return en || kh;
                if (localLang === "zh") return zh || en || kh;
                return kh;
              };

              const getCardSubtitle = () => {
                if (idCardRole === "student") {
                  return `STUDENT - ${idCardField2 || selectedIdCardStudent?.level || "LEVEL 1"}`;
                }

                const rawRole = (idCardField3 || selectedIdCardTeacher?.role || selectedIdCardTeacher?.position || selectedIdCardTeacher?.specialty || "TEACHER").trim();
                const lowerRole = rawRole.toLowerCase();

                let title = "TEACHER";
                if (lowerRole.includes("secr") || lowerRole.includes("លេខា")) {
                  title = "SECRETARY";
                } else if (lowerRole.includes("teach") || lowerRole.includes("instruct") || lowerRole.includes("គ្រូ")) {
                  title = "TEACHER";
                } else if (lowerRole.includes("account") || lowerRole.includes("គណនេយ្យ") || lowerRole.includes("បេឡា")) {
                  title = "ACCOUNTANT";
                } else if (lowerRole.includes("admin") || lowerRole.includes("អភិបាល")) {
                  title = "ADMIN";
                } else if (lowerRole.includes("staff") || lowerRole.includes("បុគ្គលិក")) {
                  title = "STAFF";
                } else if (lowerRole.includes("registrar")) {
                  title = "REGISTRAR";
                } else if (rawRole) {
                  title = rawRole.toUpperCase();
                }

                const isPhone = idCardField2 && /^\+?[\d\s-]{6,}$/.test(idCardField2.trim());
                if (idCardField2 && !isPhone) {
                  return `${title} - ${idCardField2}`;
                }

                return title;
              };
              return (
                <motion.div
                  key="id-card-tab"
                  initial={{ opacity: 0.92 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                >
                  {/* Top Header Card */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 md:p-6 no-print mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Load Profile Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 text-primary-600 border-b border-slate-100 pb-2 mb-3">
                          <div className="p-2 bg-primary-50 rounded-xl shrink-0">
                            <List className="w-4 h-4 text-primary-600" />
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-sm truncate">
                            {idt("ទាញយកទិន្នន័យពីប្រព័ន្ធប្រមូលផ្ដុំ", "Load Registered Profile", "导入系统已注册档案 (Load Registered Profile)")}
                          </h4>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="w-full md:w-[450px]">
                            <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">
                              {idCardRole === 'student' 
                                ? idt("ជ្រើសរើសសិស្សសរុប", "Select Registered Student", "选择已注册学生") 
                                : idt("ជ្រើសរើសគ្រូបង្រៀន", "Select Registered Teacher", "选择已注册教师")}
                            </label>
                            {idCardRole === 'student' ? (
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setIsOpenStudentIdCardDropdown(!isOpenStudentIdCardDropdown)}
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white shadow-3xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer flex items-center justify-between text-left hover:bg-slate-50/50"
                                >
                                  <span className="truncate">
                                    {selectedIdCardStudent 
                                      ? `${selectedIdCardStudent.nameKh} (${selectedIdCardStudent.nameEn})` 
                                      : idt("-- បញ្ចូលព័ត៌មានដោយផ្ទាល់ --", "-- Enter Information Manually (Manual Custom Mode) --", "-- 手动输入模式 (Manual Custom Mode) --")}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenStudentIdCardDropdown ? "rotate-180" : ""}`} />
                                </button>

                                {isOpenStudentIdCardDropdown && (
                                  <>
                                    <div className="fixed inset-0 z-[110]" onClick={() => {
                                      setIsOpenStudentIdCardDropdown(false);
                                      setStudentIdCardSearchQuery("");
                                    }} />
                                    <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden p-2 text-xs flex flex-col max-h-[300px]">
                                      {/* Search Input */}
                                      <div className="relative mb-2 shrink-0">
                                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                          type="text"
                                          value={studentIdCardSearchQuery}
                                          onChange={(e) => setStudentIdCardSearchQuery(e.target.value)}
                                          placeholder={idt("ស្វែងរកឈ្មោះសិស្ស...", "Search student...", "搜索学生姓名...")}
                                          className="w-full pl-9 pr-8 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50/50"
                                          onClick={(e) => e.stopPropagation()}
                                          autoFocus
                                        />
                                        {studentIdCardSearchQuery && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setStudentIdCardSearchQuery("");
                                            }}
                                            className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>

                                      {/* Scrollable list */}
                                      <div className="overflow-y-auto flex-1 space-y-0.5 max-h-[220px] pr-1 scrollbar-none">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedIdCardStudent(null);
                                            setIdCardNameKh("សុខ ចាន់ដារ៉ា");
                                            setIdCardNameEn("SOK CHANDARA");
                                            setIdCardIdNumber("STU-26-001");
                                            setIdCardGender("Male");
                                            setIdCardField1("Computer Repair & Maintenance");
                                            setIdCardField2("Level 1");
                                            setIdCardField3("08:00 AM - 09:00 AM");
                                            setIdCardField4("STUDYING");
                                            setIdCardPhone("+855 12 345 678");
                                            setIdCardAddress("រាជធានីភ្នំពេញ");
                                            setIdCardDob("10/05/2005");
                                            setIdCardIssueDate("01.01.2026");
                                            setIdCardExpireDate("01.01.2027");
                                            setIdCardPhone("+855 12 345 678");
                                            setIdCardDob("01/01/2005");
                                            setIsOpenStudentIdCardDropdown(false);
                                            setStudentIdCardSearchQuery("");
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                                            !selectedIdCardStudent 
                                              ? "bg-primary-600 text-white font-black" 
                                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                          }`}
                                        >
                                          {idt("-- បញ្ចូលព័ត៌មានដោយផ្ទាល់ --", "-- Enter Information Manually (Manual Custom Mode) --", "-- 手动输入模式 (Manual Custom Mode) --")}
                                        </button>

                                        {(() => {
                                          const query = studentIdCardSearchQuery.toLowerCase().trim();
                                          const filtered = students.filter(Boolean).filter(s => 
                                            s.status === 'STUDYING' && (
                                              (s?.nameKh || '').toLowerCase().includes(query) || 
                                              (s?.nameEn || '').toLowerCase().includes(query) ||
                                              (s.studentId && s.studentId.toLowerCase().includes(query))
                                            )
                                          );

                                          if (filtered.length === 0) {
                                            return (
                                              <div className="text-center py-4 text-slate-400 font-bold">
                                                {idt("មិនរកឃើញទិន្នន័យសិស្សទេ", "No student data found", "未找到学生数据")}
                                              </div>
                                            );
                                          }

                                          return filtered.map(s => {
                                            const isSelected = selectedIdCardStudent?.id === s.id;
                                            return (
                                              <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => {
                                                  handlePrefillStudent(s);
                                                  setIsOpenStudentIdCardDropdown(false);
                                                  setStudentIdCardSearchQuery("");
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center justify-between gap-2 ${
                                                  isSelected 
                                                    ? "bg-primary-600 text-white font-black" 
                                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                              >
                                                <div className="flex items-center gap-2 truncate min-w-0">
                                                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-[10px]">
                                                    {s.photoUrl || (s as any).photo ? (
                                                      <img src={s.photoUrl || (s as any).photo} alt={s.nameKh} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                    ) : (
                                                      <span>{s.gender === "Female" ? "👧" : "👦"}</span>
                                                    )}
                                                  </div>
                                                  <span className="truncate">{s.nameKh} ({s.nameEn})</span>
                                                </div>
                                                {s.studentId && (
                                                  <span className={`text-[10px] font-mono font-black shrink-0 ${isSelected ? "text-primary-200" : "text-slate-400"}`}>
                                                    {s.studentId}
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          });
                                        })()}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setIsOpenTeacherIdCardDropdown(!isOpenTeacherIdCardDropdown)}
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white shadow-3xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer flex items-center justify-between text-left hover:bg-slate-50/50"
                                >
                                  <span className="truncate">
                                    {selectedIdCardTeacher 
                                      ? `${selectedIdCardTeacher.nameKh} (${selectedIdCardTeacher.nameEn})` 
                                      : idt("-- បញ្ចូលព័ត៌មានដោយផ្ទាល់ --", "-- Enter Information Manually (Manual Custom Mode) --", "-- 手动输入模式 (Manual Custom Mode) --")}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenTeacherIdCardDropdown ? "rotate-180" : ""}`} />
                                </button>

                                {isOpenTeacherIdCardDropdown && (
                                  <>
                                    <div className="fixed inset-0 z-[110]" onClick={() => {
                                      setIsOpenTeacherIdCardDropdown(false);
                                      setTeacherIdCardSearchQuery("");
                                    }} />
                                    <div className="absolute left-0 right-0 z-[120] mt-1 bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden p-2 text-xs flex flex-col max-h-[300px]">
                                      {/* Search Input */}
                                      <div className="relative mb-2 shrink-0">
                                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                          type="text"
                                          value={teacherIdCardSearchQuery}
                                          onChange={(e) => setTeacherIdCardSearchQuery(e.target.value)}
                                          placeholder={idt("ស្វែងរកឈ្មោះគ្រូ...", "Search teacher...", "搜索教师姓名...")}
                                          className="w-full pl-9 pr-8 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50/50"
                                          onClick={(e) => e.stopPropagation()}
                                          autoFocus
                                        />
                                        {teacherIdCardSearchQuery && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setTeacherIdCardSearchQuery("");
                                            }}
                                            className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>

                                      {/* Scrollable list */}
                                      <div className="overflow-y-auto flex-1 space-y-0.5 max-h-[220px] pr-1 scrollbar-none">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedIdCardTeacher(null);
                                            setIdCardNameKh("កែវ សុផល");
                                            setIdCardNameEn("KEO SOPHAL");
                                            setIdCardIdNumber("TCH-26-001");
                                            setIdCardGender("Male");
                                            setIdCardField1("Graphic Design");
                                            setIdCardField2("+855 88 123 4567");
                                            setIdCardField3("គ្រូបង្រៀន");
                                            setIdCardField4("ACTIVE");
                                            setIdCardPhone("+855 88 123 4567");
                                            setIdCardDob("12/04/1994");
                                            setIsOpenTeacherIdCardDropdown(false);
                                            setTeacherIdCardSearchQuery("");
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                                            !selectedIdCardTeacher 
                                              ? "bg-rose-600 text-white font-black" 
                                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                          }`}
                                        >
                                          {idt("-- បញ្ចូលព័ត៌មានដោយផ្ទាល់ --", "-- Enter Information Manually (Manual Custom Mode) --", "-- 手动输入模式 (Manual Custom Mode) --")}
                                        </button>

                                        {(() => {
                                          const query = teacherIdCardSearchQuery.toLowerCase().trim();
                                          const filtered = teachers.filter(Boolean).filter(t => 
                                            (t.status === 'ACTIVE' || t.status === 'LEAVE') && (
                                              (t?.nameKh || '').toLowerCase().includes(query) || 
                                              (t?.nameEn || '').toLowerCase().includes(query) ||
                                              (t.teacherId && t.teacherId.toLowerCase().includes(query))
                                            )
                                          );

                                          if (filtered.length === 0) {
                                            return (
                                              <div className="text-center py-4 text-slate-400 font-bold">
                                                {idt("មិនរកឃើញទិន្នន័យគ្រូបង្រៀនទេ", "No teacher data found", "未找到教师数据")}
                                              </div>
                                            );
                                          }

                                          return filtered.map(t => {
                                            const isSelected = selectedIdCardTeacher?.id === t.id;
                                            return (
                                              <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => {
                                                  handlePrefillTeacher(t);
                                                  setIsOpenTeacherIdCardDropdown(false);
                                                  setTeacherIdCardSearchQuery("");
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-xl font-bold cursor-pointer transition-all flex items-center justify-between gap-2 ${
                                                  isSelected 
                                                    ? "bg-rose-600 text-white font-black" 
                                                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                              >
                                                <div className="flex items-center gap-2 truncate min-w-0">
                                                  <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 overflow-hidden shrink-0 flex items-center justify-center text-[10px]">
                                                    {t.photoUrl || (t as any).photo ? (
                                                      <img src={t.photoUrl || (t as any).photo} alt={t.nameKh} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                    ) : (
                                                      <span>{t.gender === "Female" ? "👧" : "👦"}</span>
                                                    )}
                                                  </div>
                                                  <span className="truncate">{t.nameKh} ({t.nameEn})</span>
                                                </div>
                                                {t.teacherId && (
                                                  <span className={`text-[10px] font-mono font-black shrink-0 ${isSelected ? "text-rose-200" : "text-slate-400"}`}>
                                                    {t.teacherId}
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          });
                                        })()}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                            <p className="text-[10px] text-amber-500 font-bold leading-relaxed mt-2">
                              {idt(
                                "* ប្រព័ន្ធនឹងធ្វើការបញ្ចូលទិន្នន័យដោយស្វ័យប្រវត្តិតាមសមាជិកដែលបានជ្រើសរើស!",
                                "* Auto-populates details based on the selected member!",
                                "* 系统将自动根据所选成员填充学籍信息！"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Segment control */}
                      <div className="flex bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl gap-1.5 border border-slate-200/50 shadow-inner shrink-0 self-start lg:self-center">
                        <button
                          onClick={() => {
                            setIdCardRole('student');
                            if (students.length > 0) {
                              handlePrefillStudent(students[0]);
                            }
                          }}
                          className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.97] border ${
                            idCardRole === 'student'
                              ? "bg-white text-primary-700 shadow-sm border-slate-200/40"
                              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40"
                          }`}
                        >
                          <GraduationCap className={`w-4 h-4 ${idCardRole === 'student' ? 'text-primary-600' : 'text-slate-400'}`} />
                          <span>{idt("ភាគសិស្ស", "Student Card", "学生卡 (Student Card)")}</span>
                        </button>
                        <button
                          onClick={() => {
                            setIdCardRole('teacher');
                            if (teachers.length > 0) {
                              handlePrefillTeacher(teachers[0]);
                            }
                          }}
                          className={`flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.97] border ${
                            idCardRole === 'teacher'
                              ? "bg-white text-rose-700 shadow-sm border-slate-200/40"
                              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/40"
                          }`}
                        >
                          <Users className={`w-4 h-4 ${idCardRole === 'teacher' ? 'text-rose-600' : 'text-slate-400'}`} />
                          <span>{idt("ភាគគ្រូ", "Teacher Card", "教师卡 (Teacher Card)")}</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Main Grid Layout (No-Print) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start no-print">
                    
                    {/* Left Column: Customizer Cards */}
                    <div className="lg:col-span-5 space-y-6">

                    {/* Card Content Customizer Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                      <div className="flex items-center gap-2.5 text-primary-600 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-primary-50 rounded-xl">
                          <Pencil className="w-4 h-4 text-primary-600" />
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-sm">{idt("កែសម្រួលរូបរាងកាត", "Card Content Customizer", "胸牌内容个性化编辑 (Card Content Customizer)")}</h4>
                      </div>

                      <div className="space-y-4">
                        {/* Names section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ឈ្មោះខ្មែរ", "Khmer Name", "高棉姓名 (Khmer Name)")}</label>
                              <input
                                type="text"
                                value={idCardNameKh}
                                onChange={(e) => setIdCardNameKh(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ឈ្មោះឡាតាំង", "English Name", "英文姓名 (English Name)")}</label>
                              <input
                                type="text"
                                value={idCardNameEn}
                                onChange={(e) => setIdCardNameEn(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                          </div>

                          {/* ID and Gender */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("កូដសម្គាល់ ID", "Identification Code (ID)", "唯一识别码 ID")}</label>
                              <input
                                type="text"
                                value={idCardIdNumber}
                                onChange={(e) => setIdCardIdNumber(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ភេទ", "Sex", "性别 (Sex)")}</label>
                              <select
                                value={idCardGender}
                                onChange={(e) => setIdCardGender(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30 cursor-pointer"
                              >
                                <option value="Male">{idt("ប្រុស", "Male (M)", "男 (M)")}</option>
                                <option value="Female">{idt("ស្រី", "Female (F)", "女 (F)")}</option>
                              </select>
                            </div>
                          </div>

                          {/* Registry details */}
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              <Cpu className="w-3.5 h-3.5 text-slate-400" />
                              <span>{idCardRole === 'student' ? idt("ព័ត៌មានសិក្សាដែលភ្ជាប់", "REGISTRY DETAILS", "注册信息详情 (REGISTRY DETAILS)") : idt("ព័ត៌មានបង្រៀនដែលភ្ជាប់", "TEACHER DETAILS", "教学信息详情 (TEACHER DETAILS)")}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idCardRole === 'student' ? idt("វគ្គសិក្សា", "Course", "课程 (Course)") : idt("ជំនាញបង្រៀន", "Specialty", "教学专业 (Specialty)")}
                                </label>
                                <input
                                  type="text"
                                  value={idCardField1}
                                  onChange={(e) => setIdCardField1(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idCardRole === 'student' ? idt("កម្រិត", "Level", "级别 (Level)") : idt("តួនាទីរង / ផ្នែក", "Sub-Role / Dept", "岗位 (Sub-Role)")}
                                </label>
                                <input
                                  type="text"
                                  value={idCardField2}
                                  onChange={(e) => setIdCardField2(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idCardRole === 'student' ? idt("វេនសិក្សា", "Shift", "学制班次 (Shift)") : idt("តួនាទី", "Role", "角色职务 (Role)")}
                                </label>
                                <input
                                  type="text"
                                  value={idCardField3}
                                  onChange={(e) => setIdCardField3(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {idCardRole === 'student' ? idt("ម៉ោងសិក្សា", "Hours", "上课时间 (Hours)") : idt("ស្ថានភាព", "Status", "在职状态 (Status)")}
                                </label>
                                <input
                                  type="text"
                                  value={idCardField4}
                                  onChange={(e) => setIdCardField4(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Extra info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ថ្ងៃខែឆ្នាំកំណើត", "Date of Birth (D.O.B)", "出生日期 (D.O.B)")}</label>
                              <input
                                  type="text"
                                  value={idCardDob}
                                  onChange={(e) => setIdCardDob(e.target.value)}
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("លេខទូរស័ព្ទ", "Phone Number", "电话号码 (Phone Number)")}</label>
                              <input
                                type="text"
                                value={idCardPhone}
                                onChange={(e) => setIdCardPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/30"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("អាសយដ្ឋាន", "Address", "家庭住址 (Address)")}</label>
                              <input
                                type="text"
                                value={idCardAddress}
                                onChange={(e) => setIdCardAddress(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ថ្ងៃចេញកាត", "Issue Date", "发证日期 (Issue)")}</label>
                              <input
                                type="text"
                                value={idCardIssueDate}
                                onChange={(e) => setIdCardIssueDate(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none bg-slate-50/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{idt("ផុតកំណត់", "Expiry Date", "有效期限 (Expire)")}</label>
                              <input
                                type="text"
                                value={idCardExpireDate}
                                onChange={(e) => setIdCardExpireDate(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none bg-slate-50/30"
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Right Column: Live Print Preview Canvas */}
                    <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col items-center justify-start space-y-6">
                      
                      {/* Header Canvas with title, subtitle and Role Pill */}
                      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">{idt("ផ្ទាំងបង្ហាញកាតពិតប្រាកដ", "Live Print Preview Canvas", "实体卡即时打印预览 (Live Print Preview Canvas)")}</h4>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                            {idt("កាន់តែងាយស្រួលបោះពុម្ពទំហំស្ដង់ដារផ្នែកខាងមុខ និងខាងក្រោយ", "Easily print in standard front and back sizes (ID Card scale standard)", "完美贴合标准尺寸正背面比例打印 (ID Card scale standard)")}
                          </span>
                        </div>

                        {/* ID Card Role Pill */}
                        <span className="bg-primary-50 border border-primary-100 text-primary-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {idCardRole === 'student' 
                            ? idt("កាតសម្គាល់ខ្លួនសិស្ស", "Student ID Card", "学生胸牌 (Student ID Card)") 
                            : idt("កាតសម្គាល់ខ្លួនគ្រូ", "Teacher ID Card", "教师胸牌 (Teacher ID Card)")}
                        </span>
                      </div>

                      {/* Tools Color Gradient Customizer Panel */}
                      <div className="w-full bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 space-y-3 shadow-3xs mb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div 
                              className="p-2 rounded-xl text-white border border-white/20 shadow-xs shrink-0 transition-all duration-300"
                              style={{ background: cardAccentBg }}
                            >
                              <Palette className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-slate-800 flex items-center gap-2 flex-wrap">
                                <span>{idt("ឧបករណ៍ប្ដូរពណ៌កាត & Color Gradient", "Card Theme & Color Gradient Tools", "卡片颜色与渐变设置工具")}</span>
                                <span className="text-[9.5px] px-2.5 py-0.5 rounded-full font-mono font-black text-white shadow-2xs" style={{ background: cardAccentBg }}>
                                  {isGradientEnabled ? `${cardPrimaryColor} ➔ ${cardSecondaryColor}` : cardPrimaryColor}
                                </span>
                              </h5>
                              <span className="text-[10px] font-bold text-slate-500">
                                {idt("ជ្រើសរើសពណ៌ ឬ Gradient សម្រាប់ប្ដូរម៉ូតនាមកាតភ្លាមៗ", "Select preset themes or customize color gradients for instant live preview", "选择颜色预设或自定义渐变")}
                              </span>
                            </div>
                          </div>

                          {/* Toggle Custom Color Panel Button */}
                          <button
                            type="button"
                            onClick={() => setShowColorPickerPanel(!showColorPickerPanel)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-[11px] font-extrabold hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs shrink-0"
                          >
                            <Paintbrush className="w-3.5 h-3.5 text-primary-600" />
                            <span>{idt("កំណត់ពណ៌ Gradient ផ្ទាល់ខ្លួន", "Custom Color Controls", "自定义颜色 (Color Tools)")}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showColorPickerPanel ? "rotate-180" : ""}`} />
                          </button>
                        </div>

                        {/* Quick Color Gradient Preset Badges */}
                        <div className="space-y-2">
                          <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider">
                            {idt("ពណ៌ និង Gradient គំរូរហ័ស (Preset Theme Gradients):", "Quick Preset Themes:", "快捷颜色预设:")}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {GRADIENT_PRESETS.map((p) => {
                              const isSelected = cardPrimaryColor === p.primary && cardSecondaryColor === p.secondary;
                              return (
                                <button
                                  key={p.nameEn}
                                  type="button"
                                  onClick={() => {
                                    setCardPrimaryColor(p.primary);
                                    setCardSecondaryColor(p.secondary);
                                    setIsGradientEnabled(true);
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-2 border shadow-2xs active:scale-95 shrink-0 ${
                                    isSelected 
                                      ? "ring-2 ring-primary-500 border-primary-500 text-primary-700 font-black scale-105 bg-primary-50" 
                                      : "border-slate-200 text-slate-700 hover:bg-slate-100 bg-white"
                                  }`}
                                >
                                  <span
                                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs shrink-0"
                                    style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})` }}
                                  />
                                  <span>{idt(p.nameKh, p.nameEn)}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Color Gradient Inputs Panel */}
                        {showColorPickerPanel && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-3 mt-3 border-t border-slate-200/80 bg-slate-100/60 p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Primary Color Picker */}
                              <div className="bg-white p-3 rounded-xl border border-slate-200/90 space-y-2 shadow-2xs min-w-0">
                                <div className="flex justify-between items-center text-[11px] font-black text-slate-700 min-w-0">
                                  <span className="flex items-center gap-1.5 truncate">
                                    <span className="w-3 h-3 rounded-full shrink-0 border border-slate-300 shadow-2xs" style={{ backgroundColor: cardPrimaryColor }} />
                                    {idt("ពណ៌ចម្បង (Primary Color)", "Primary Color", "主颜色")}
                                  </span>
                                  <span className="font-mono font-extrabold text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 ml-1">
                                    {cardPrimaryColor}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="color"
                                    value={cardPrimaryColor}
                                    onChange={(e) => setCardPrimaryColor(e.target.value)}
                                    className="w-10 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
                                  />
                                  <input
                                    type="text"
                                    value={cardPrimaryColor}
                                    onChange={(e) => setCardPrimaryColor(e.target.value)}
                                    className="w-full min-w-0 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                  />
                                </div>
                              </div>

                              {/* Secondary Color Picker */}
                              <div className="bg-white p-3 rounded-xl border border-slate-200/90 space-y-2 shadow-2xs min-w-0">
                                <div className="flex justify-between items-center text-[11px] font-black text-slate-700 min-w-0">
                                  <span className="flex items-center gap-1.5 truncate">
                                    <span className="w-3 h-3 rounded-full shrink-0 border border-slate-300 shadow-2xs" style={{ backgroundColor: cardSecondaryColor }} />
                                    {idt("ពណ៌បន្ទាប់ (Secondary Color)", "Secondary Color", "副颜色")}
                                  </span>
                                  <span className="font-mono font-extrabold text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 ml-1">
                                    {cardSecondaryColor}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="color"
                                    value={cardSecondaryColor}
                                    onChange={(e) => setCardSecondaryColor(e.target.value)}
                                    className="w-10 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shrink-0"
                                  />
                                  <input
                                    type="text"
                                    value={cardSecondaryColor}
                                    onChange={(e) => setCardSecondaryColor(e.target.value)}
                                    className="w-full min-w-0 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                  />
                                </div>
                              </div>

                              {/* Gradient Options & Direction */}
                              <div className="bg-white p-3 rounded-xl border border-slate-200/90 space-y-2 flex flex-col justify-between shadow-2xs min-w-0">
                                <div className="flex justify-between items-center text-[11px] font-black text-slate-700">
                                  <span>{idt("ម៉ូតពណ៌ (Color Mode):", "Color Mode:", "色彩模式:")}</span>
                                  <button
                                    type="button"
                                    onClick={() => setIsGradientEnabled(!isGradientEnabled)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all border cursor-pointer ${
                                      isGradientEnabled
                                        ? "bg-primary-600 text-white border-primary-600 shadow-2xs"
                                        : "bg-white text-slate-600 border-slate-300"
                                    }`}
                                  >
                                    {isGradientEnabled ? idt("✨ បើក Gradient Mode", "Gradient Enabled", "渐变模式") : idt("🎨 ពណ៌រលូន Solid", "Solid Color", "单色模式")}
                                  </button>
                                </div>

                                {/* Gradient Angle Buttons */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                    <span>{idt("ទិសដៅ Gradient (Angle):", "Gradient Angle:", "渐变角度:")}</span>
                                    <span className="font-mono font-bold text-slate-700">{gradientAngle}°</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[45, 90, 135, 180, 225].map((angle) => (
                                      <button
                                        key={angle}
                                        type="button"
                                        onClick={() => {
                                          setGradientAngle(angle);
                                          setIsGradientEnabled(true);
                                        }}
                                        className={`flex-1 py-1 rounded text-[10px] font-mono font-black border transition-all cursor-pointer ${
                                          gradientAngle === angle && isGradientEnabled
                                            ? "bg-primary-600 text-white border-primary-600"
                                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                        }`}
                                      >
                                        {angle}°
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Reset Colors Button */}
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setCardPrimaryColor("#1d5bd8");
                                  setCardSecondaryColor("#1e40af");
                                  setIsGradientEnabled(true);
                                  setGradientAngle(135);
                                }}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>{idt("កំណត់ពណ៌ដើមឡើងវិញ (Reset Default Color)", "Reset Default Color", "重置默认颜色")}</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Card Dimension & Custom Size Control Panel */}
                      <div className="w-full bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 space-y-3 shadow-3xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary-50 rounded-lg text-primary-600 border border-primary-200/60">
                              <SlidersHorizontal className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-slate-800">
                                {idt("ទំហំកាត និងការកំណត់ផ្ទាល់ខ្លួន (cm)", "Card Dimensions & Custom Size (cm)", "卡片尺寸与自定义设置 (cm)")}
                              </h5>
                              <span className="text-[10px] font-bold text-slate-500">
                                {idt(`ទំហំពេលនេះ: ${cardWidthCm.toFixed(1)} × ${cardHeightCm.toFixed(1)} cm (${cardWidth} × ${cardHeight} px)`, `Current Size: ${cardWidthCm.toFixed(1)} × ${cardHeightCm.toFixed(1)} cm (${cardWidth} × ${cardHeight} px)`, `当前尺寸: ${cardWidthCm.toFixed(1)} × ${cardHeightCm.toFixed(1)} cm`)}
                              </span>
                            </div>
                          </div>

                          {/* Toggle Custom Details Panel Button */}
                          <button
                            type="button"
                            onClick={() => setShowCustomSizePanel(!showCustomSizePanel)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-[11px] font-extrabold hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs shrink-0"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-primary-600" />
                            <span>{idt("កំណត់ទំហំ cm ផ្ទាល់ខ្លួន", "Custom Size Controls (cm)", "自定义尺寸 (cm)")}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showCustomSizePanel ? "rotate-180" : ""}`} />
                          </button>
                        </div>



                        {/* Custom Inputs Panel in Centimeters */}
                        {showCustomSizePanel && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-3.5 mt-3 border-t border-slate-200/80 bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3"
                          >
                            {/* Width & Height Controls in balanced 2-column layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {/* Width CM Input */}
                              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                                <div className="flex justify-between items-center text-[11px] font-black text-slate-700">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary-600 shrink-0" />
                                    {idt("ទទឹង (Width cm):", "Width (cm):", "宽度 (Width cm):")}
                                  </span>
                                  <span className="text-primary-600 font-mono font-black bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 text-[11px]">
                                    {cardWidthCm.toFixed(1)} cm ({cardWidth} px)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="number"
                                    min="3.0"
                                    max="15.0"
                                    step="0.1"
                                    value={cardWidthCm}
                                    onChange={(e) => {
                                      const val = Math.max(2.0, Math.min(20.0, Number(e.target.value) || 5.7));
                                      setCardWidthCm(Number(val.toFixed(1)));
                                      setSizePreset("custom");
                                    }}
                                    className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-black font-mono text-center focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white shadow-3xs shrink-0"
                                  />
                                  <input
                                    type="range"
                                    min="3.0"
                                    max="15.0"
                                    step="0.1"
                                    value={cardWidthCm}
                                    onChange={(e) => {
                                      setCardWidthCm(Number(Number(e.target.value).toFixed(1)));
                                      setSizePreset("custom");
                                    }}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                  />
                                </div>
                              </div>

                              {/* Height CM Input */}
                              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                                <div className="flex justify-between items-center text-[11px] font-black text-slate-700">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary-600 shrink-0" />
                                    {idt("កម្ពស់ (Height cm):", "Height (cm):", "高度 (Height cm):")}
                                  </span>
                                  <span className="text-primary-600 font-mono font-black bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 text-[11px]">
                                    {cardHeightCm.toFixed(1)} cm ({cardHeight} px)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="number"
                                    min="3.0"
                                    max="20.0"
                                    step="0.1"
                                    value={cardHeightCm}
                                    onChange={(e) => {
                                      const val = Math.max(2.0, Math.min(25.0, Number(e.target.value) || 8.6));
                                      setCardHeightCm(Number(val.toFixed(1)));
                                      setSizePreset("custom");
                                    }}
                                    className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-black font-mono text-center focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white shadow-3xs shrink-0"
                                  />
                                  <input
                                    type="range"
                                    min="3.0"
                                    max="20.0"
                                    step="0.1"
                                    value={cardHeightCm}
                                    onChange={(e) => {
                                      setCardHeightCm(Number(Number(e.target.value).toFixed(1)));
                                      setSizePreset("custom");
                                    }}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Corner Radius & Action Buttons in row 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                              {/* Corner Radius CM Input (Spans 2 cols on md+) */}
                              <div className="md:col-span-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                                <div className="flex justify-between items-center text-[11px] font-black text-slate-700">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                                    {idt("ជ្រុងកោង (Radius cm):", "Border Radius (cm):", "圆角半径 (Radius cm):")}
                                  </span>
                                  <span className="text-slate-800 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                    {cardRadiusCm.toFixed(2)} cm
                                  </span>
                                </div>
                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                                  <input
                                    type="range"
                                    min="0"
                                    max="1.2"
                                    step="0.05"
                                    value={cardRadiusCm}
                                    onChange={(e) => setCardRadiusCm(Number(Number(e.target.value).toFixed(2)))}
                                    className="flex-1 min-w-[80px] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                  />
                                  <div className="flex gap-1 shrink-0">
                                    {[0, 0.3, 0.6, 0.8].map((r) => (
                                      <button
                                        key={r}
                                        type="button"
                                        onClick={() => setCardRadiusCm(r)}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer border ${
                                          cardRadiusCm === r
                                            ? "bg-primary-600 text-white border-primary-600 shadow-xs"
                                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                                        }`}
                                      >
                                        {r} cm
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Reset Action */}
                              <div className="flex items-center gap-2 h-full">
                                <button
                                  type="button"
                                  onClick={() => applySizePreset("cr80_vertical")}
                                  className="w-full h-full min-h-[46px] px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98]"
                                  title="Reset to Default"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                                  <span>{idt("កំណត់ទំហំដើម", "Reset Size", "重置")}</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      {/* Flex cards side-by-side inside a dashed-border slate layout */}
                      <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full p-6 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                        
                        {/* Front Card rendering - Exact Replica of Reference Design */}
                        <div
                          ref={frontCardRef}
                          style={{ width: `${cardWidth}px`, height: `${cardHeight}px`, borderRadius: `${cardRadius}px` }}
                          className={`shadow-2xl overflow-hidden flex flex-col justify-between relative bg-[#f8fafc] text-slate-900 select-none shrink-0 transition-all duration-350 hover:shadow-2xl ${
                            idCardPrintSide === "back" ? "opacity-35 scale-[0.96] saturate-[0.4] blur-[0.4px]" : "opacity-100 scale-100 shadow-2xl"
                          }`}
                        >
                          {idCardBackgroundFront ? (
                            <img src={idCardBackgroundFront} className="absolute inset-0 w-full h-full object-cover z-0" alt="Background Front" referrerPolicy="no-referrer" />
                          ) : (
                            <>
                              {/* Left & Right Vertical Accent Stripes */}
                              <div className="absolute top-0 bottom-0 left-0 w-[12px] z-10" style={{ background: cardAccentBg }} />
                              <div className="absolute top-0 bottom-0 right-0 w-[12px] z-10" style={{ background: cardAccentBg }} />

                              {/* Polygonal Geometric Low-Poly Mesh Texture */}
                              <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 z-0" viewBox="0 0 245 370" fill="none" preserveAspectRatio="none">
                                <polygon points="0,0 75,0 35,55" fill="#e2e8f0" />
                                <polygon points="75,0 175,0 125,45" fill="#f1f5f9" />
                                <polygon points="175,0 245,0 195,65" fill="#cbd5e1" opacity="0.7" />
                                <polygon points="0,0 35,55 0,115" fill="#f1f5f9" />
                                <polygon points="35,55 125,45 80,105" fill="#ffffff" />
                                <polygon points="125,45 195,65 155,115" fill="#f8fafc" />
                                <polygon points="195,65 245,0 245,95" fill="#e2e8f0" />
                                <polygon points="0,115 35,55 80,105" fill="#cbd5e1" opacity="0.5" />
                                <polygon points="80,105 125,45 155,115" fill="#f1f5f9" />
                                <polygon points="155,115 195,65 245,95" fill="#ffffff" />
                                <polygon points="0,115 45,175 0,235" fill="#f8fafc" />
                                <polygon points="45,175 125,185 85,245" fill="#ffffff" />
                                <polygon points="125,185 245,185 190,255" fill="#f8fafc" />
                                <polygon points="0,235 45,175 85,245" fill="#e2e8f0" />
                                <polygon points="85,245 125,185 190,255" fill="#f1f5f9" />
                              </svg>

                              {/* Top Concentric Circle Logo Section (Centered) */}
                              <div className="pt-3 px-2 z-10 w-full flex items-center justify-center gap-2">
                                {schoolLogo ? (
                                  <img src={schoolLogo} className="w-9 h-9 object-contain filter drop-shadow-xs shrink-0" alt="Logo" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm border border-white/40 shrink-0">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <div className="flex flex-col text-left gap-[6px]">
                                  <span className="text-[13.5px] font-black tracking-tight font-sans leading-none" style={{ color: cardPrimaryColor }}>
                                    {schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                                  </span>
                                  <span className="text-[8.6px] font-extrabold tracking-[0.06em] text-slate-800 uppercase leading-none">
                                    {idCardSchoolName || "PLC COMPUTER SCHOOL"}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Center Section: Photo & Info */}
                          <div className="pt-1.5 px-5 flex flex-col items-center z-10 w-full">
                            {/* Portrait Photo with Blue Curved Wing Wings */}
                            <div className="relative mb-1.5 flex items-center justify-center">
                              {/* Blue Wing Background Badge behind Photo */}
                              <div className="absolute w-[114px] h-[72px] rounded-2xl z-0" style={{ background: cardAccentBg }} />
                              <div className="w-[100px] h-[110px] rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md flex items-center justify-center relative z-10">
                                {idCardPhoto ? (
                                  <img src={idCardPhoto} alt="Portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                    <User className="w-14 h-14 text-slate-300" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Name & Subtitle Title */}
                            <div className="text-center mt-1.5 w-full">
                              <p className="text-[14.5px] font-black text-slate-900 tracking-wide leading-tight mb-0.5">
                                {idCardNameKh || (idCardRole === "student" ? "សុខ ចាន់ដារ៉ា" : "កែវ សុផល")}
                              </p>
                              <h4 className="text-[11px] font-black tracking-wider uppercase leading-tight" style={{ color: cardPrimaryColor }}>
                                {idCardNameEn || (idCardRole === "student" ? "SOK CHANDARA" : "KEO SOPHAL")}
                              </h4>
                              <p className="text-[8.5px] font-black tracking-widest text-slate-900 uppercase mt-0.5">
                                {getCardSubtitle()}
                              </p>
                            </div>

                            {/* Details Grid with Aligned Labels & Colons */}
                            <div className="w-full mt-2 px-3 space-y-1 text-[9.5px] font-sans text-left z-10">
                              <div className="grid grid-cols-[46px_10px_1fr] items-center">
                                <span className="text-slate-900 font-extrabold">{idCardRole === "student" ? "Course" : "Dept"}</span>
                                <span className="text-slate-900 font-extrabold">:</span>
                                <span className="text-slate-800 font-semibold truncate">{idCardField1 || (idCardRole === "student" ? "Computer Repair" : "Graphic Design")}</span>
                              </div>
                              <div className="grid grid-cols-[46px_10px_1fr] items-center">
                                <span className="text-slate-900 font-extrabold">{idCardRole === "student" ? "Shift" : "Email"}</span>
                                <span className="text-slate-900 font-extrabold">:</span>
                                <span className="text-slate-800 font-semibold truncate">{idCardRole === "student" ? (idCardField3 || selectedIdCardStudent?.shift || "ថ្ងៃចន្ទ - ថ្ងៃសុក្រ") : (idCardField3 || "teacher@plcschool.com")}</span>
                              </div>
                              <div className="grid grid-cols-[46px_10px_1fr] items-center">
                                <span className="text-slate-900 font-extrabold">{idCardRole === "student" ? "Time" : "Phone"}</span>
                                <span className="text-slate-900 font-extrabold">:</span>
                                <span className="text-slate-800 font-semibold truncate">{idCardRole === "student" ? (idCardField4 || selectedIdCardStudent?.hours || selectedIdCardStudent?.time || "08:00 - 09:00 AM") : (idCardPhone || "+855 12 345 678")}</span>
                              </div>
                              <div className="grid grid-cols-[46px_10px_1fr] items-center">
                                <span className="text-slate-900 font-extrabold">Code</span>
                                <span className="text-slate-900 font-extrabold">:</span>
                                <span className="text-slate-800 font-semibold font-mono">{idCardRole === "student" ? (idCardIdNumber || selectedIdCardStudent?.studentId || "STU-26-001") : (idCardIdNumber || selectedIdCardTeacher?.code || "TCH-26-001")}</span>
                              </div>
                            </div>
                          </div>

                          {/* Floating Barcode Badge Overlay */}
                          <div className="mt-auto z-20 w-full flex flex-col items-center">
                            <div className="-mb-3 bg-white px-2 py-0.5 rounded-sm border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center z-20">
                              <Barcode
                                value={idCardIdNumber || (idCardRole === "student" ? (selectedIdCardStudent?.studentId || "STU-26-001") : (selectedIdCardTeacher?.teacherId || selectedIdCardTeacher?.code || "TCH-26-001"))}
                                format="CODE128"
                                width={1.2}
                                height={18}
                                displayValue={false}
                                margin={2}
                                background="#ffffff"
                                lineColor="#000000"
                              />
                            </div>

                            {/* Solid Accent Color Bottom Footer */}
                            <div className="w-full text-white pt-5 pb-2.5 px-3 text-center relative overflow-hidden z-10" style={{ background: cardAccentBg }}>
                              <p className="text-white/95 text-[7px] font-normal leading-[1.35] px-1 text-center">
                                “ការអប់រំសាងសង់ចំណេះដឹង ចំណេះដឹងសាងសង់អនាគតដ៏ភ្លឺស្វាង”<br />ការសិក្សាបែបឌីជីថល ជំរុញគំនិតច្នៃប្រឌិត និងបច្ចេកវិទ្យាទំនើប!
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Back Card rendering - Exact Replica of Reference Design */}
                        <div
                          ref={backCardRef}
                          style={{ width: `${cardWidth}px`, height: `${cardHeight}px`, borderRadius: `${cardRadius}px` }}
                          className={`shadow-2xl overflow-hidden flex flex-col justify-between relative bg-[#f8fafc] text-slate-900 select-none shrink-0 transition-all duration-350 hover:shadow-2xl ${
                            idCardPrintSide === "front" ? "opacity-35 scale-[0.96] saturate-[0.4] blur-[0.4px]" : "opacity-100 scale-100 shadow-2xl"
                          }`}
                        >
                          {idCardBackgroundBack ? (
                            <img src={idCardBackgroundBack} className="absolute inset-0 w-full h-full object-cover z-0" alt="Background Back" referrerPolicy="no-referrer" />
                          ) : (
                            <>
                              {/* Left & Right Vertical Accent Stripes */}
                              <div className="absolute top-0 bottom-0 left-0 w-[12px] z-10" style={{ background: cardAccentBg }} />
                              <div className="absolute top-0 bottom-0 right-0 w-[12px] z-10" style={{ background: cardAccentBg }} />

                              {/* Polygonal Geometric Low-Poly Mesh Texture */}
                              <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 z-0" viewBox="0 0 245 370" fill="none" preserveAspectRatio="none">
                                <polygon points="0,0 75,0 35,55" fill="#e2e8f0" />
                                <polygon points="75,0 175,0 125,45" fill="#f1f5f9" />
                                <polygon points="175,0 245,0 195,65" fill="#cbd5e1" opacity="0.7" />
                                <polygon points="0,0 35,55 0,115" fill="#f1f5f9" />
                                <polygon points="35,55 125,45 80,105" fill="#ffffff" />
                                <polygon points="125,45 195,65 155,115" fill="#f8fafc" />
                                <polygon points="195,65 245,0 245,95" fill="#e2e8f0" />
                              </svg>
                            </>
                          )}

                          {/* Upper White Section: Name, Role, Signature & Dates */}
                          <div className="pt-4 px-6 flex flex-col items-center z-10 w-full text-center">
                            <p className="text-[14.5px] font-black text-slate-900 tracking-wide leading-tight mb-0.5">
                              {idCardNameKh || (idCardRole === "student" ? "សុខ ចាន់ដារ៉ា" : "កែវ សុផល")}
                            </p>
                            <h4 className="text-[11px] font-black tracking-wider uppercase leading-tight" style={{ color: cardPrimaryColor }}>
                              {idCardNameEn || (idCardRole === "student" ? "SOK CHANDARA" : "KEO SOPHAL")}
                            </h4>
                            <p className="text-[8.5px] font-black tracking-widest text-slate-900 uppercase mt-0.5">
                              {getCardSubtitle()}
                            </p>

                            {/* Cursive Handwritten Signature */}
                            <div className="my-1.5 z-10 flex justify-center h-8">
                              {directorSignature ? (
                                <img src={directorSignature} alt="Director Signature" className="max-h-full max-w-[110px] object-contain mix-blend-multiply opacity-90" />
                              ) : (
                                <svg width="110" height="32" viewBox="0 0 120 36" fill="none" className="text-slate-900">
                                  <path d="M10 22 C 18 8, 22 28, 30 14 C 36 6, 42 26, 52 18 C 60 10, 68 24, 78 16 C 86 8, 92 26, 102 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                                  <path d="M12 26 C 32 24, 62 27, 98 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                </svg>
                              )}
                            </div>

                            {/* Dates & Code Details */}
                            <div className="w-full px-4 space-y-1 text-[9.5px] font-sans text-left z-10">
                              <div className="grid grid-cols-[64px_10px_1fr] items-center">
                                <span className="text-slate-900 font-extrabold">Join Date</span>
                                <span className="text-slate-900 font-extrabold">:</span>
                                <span className="text-slate-800 font-bold font-mono">{idCardIssueDate || (idCardRole === "student" ? selectedIdCardStudent?.startDate : "") || "01.01.2026"}</span>
                              </div>
                              <div className="grid grid-cols-[64px_10px_1fr] items-center">
                                <span className="text-slate-900 font-extrabold">expire date</span>
                                <span className="text-slate-900 font-extrabold">:</span>
                                <span className="text-slate-800 font-bold font-mono">{idCardExpireDate || (idCardRole === "student" ? selectedIdCardStudent?.endDate : "") || "01.01.2027"}</span>
                              </div>
                              <div className="grid grid-cols-[64px_10px_1fr] items-center">
                                <span className="text-slate-900 font-extrabold">Phone</span>
                                <span className="text-slate-900 font-extrabold">:</span>
                                <span className="text-slate-800 font-semibold font-mono">{idCardRole === "student" ? (idCardPhone || selectedIdCardStudent?.phoneNumber || selectedIdCardStudent?.guardianPhone || "+855 87 850 014") : (idCardPhone || selectedIdCardTeacher?.phone || "+855 87 850 014")}</span>
                              </div>
                            </div>
                          </div>

                          {/* QR Code Overlay Badge */}
                          <div className="mt-2 z-20 -mb-4 flex justify-center w-full">
                            <div className="bg-white p-1 rounded-sm border border-slate-200/90 shadow-2xs shrink-0 flex items-center justify-center">
                              <QRCodeCanvas
                                value={`${window.location.origin.includes("ais-dev-") ? window.location.origin.replace("ais-dev-", "ais-pre-") : window.location.origin}/?portal_student=${idCardIdNumber || (idCardRole === "student" ? (selectedIdCardStudent?.studentId || "STU-26-001") : (selectedIdCardTeacher?.teacherId || selectedIdCardTeacher?.code || "TCH-26-001"))}`}
                                size={180}
                                level="H"
                                fgColor="#000000"
                                bgColor="#ffffff"
                                includeMargin={false}
                                style={{ width: "48px", height: "48px", display: "block" }}
                              />
                            </div>
                          </div>

                          {/* Lower Royal Blue Section: Bullet points, Logo & Contacts */}
                          <div className="mt-auto w-full text-white pt-6 pb-2.5 px-4 z-10 flex flex-col justify-between items-center text-left relative overflow-hidden flex-1" style={{ background: cardAccentBg }}>
                            {/* Three bullet point paragraphs */}
                            <div className="space-y-1 text-[8.5px] text-white/95 w-full -mt-0.5 pt-0.5 px-0.5">
                              <div className="flex gap-1.5 items-start">
                                <span className="w-1 h-1 rounded-full bg-white shrink-0 mt-[4px]" />
                                <p className="leading-[1.45] font-normal text-left">ម្ចាស់ប័ណ្ណត្រូវពាក់ប័ណ្ណនេះជាប្រចាំ ពេលចូលសិក្សា<br />ឬបំពេញការងារក្នុងគ្រឹះស្ថាន។</p>
                              </div>
                              <div className="flex gap-1.5 items-start">
                                <span className="w-1 h-1 rounded-full bg-white shrink-0 mt-[4px]" />
                                <p className="leading-[1.45] font-normal text-left">ប័ណ្ណនេះមិនអាចផ្ទេរឱ្យអ្នកផ្សេងប្រើប្រាស់ជំនួសបានឡើយ។</p>
                              </div>
                              <div className="flex gap-1.5 items-start">
                                <span className="w-1 h-1 rounded-full bg-white shrink-0 mt-[4px]" />
                                <p className="leading-[1.45] font-normal text-left">ករណីបាត់ ឬរើសបានប័ណ្ណនេះ សូមប្រគល់ជូនរដ្ឋបាលសាលាវិញ។</p>
                              </div>
                            </div>

                            {/* School Logo + Name (White) */}
                            <div className="my-1.5 flex flex-col items-center justify-center">
                              <div className="flex items-center gap-1.5">
                                {schoolLogo ? (
                                  <img src={schoolLogo} className="w-8 h-8 object-contain filter drop-shadow-xs shrink-0" alt="Logo" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0">
                                    <GraduationCap className="w-4.5 h-4.5 text-white" />
                                  </div>
                                )}
                                <div className="flex flex-col text-left gap-[6px]">
                                  <span className="text-[12.5px] font-black tracking-tight font-sans text-white leading-none">
                                    {schoolKhmerName || "សាលាកុំព្យូទ័រ ភីអិលស៊ី"}
                                  </span>
                                  <span className="text-[8px] font-extrabold tracking-[0.06em] text-blue-200 uppercase leading-none">
                                    {idCardSchoolName || "PLC COMPUTER SCHOOL"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Footer location & website */}
                            <div className="w-full pt-1 border-t border-white/20 flex items-center justify-between text-[6px] text-white/90 font-medium">
                              <div className="flex items-center gap-1 max-w-[65%] truncate">
                                <MapPin className="w-2.5 h-2.5 text-white shrink-0" />
                                <span className="truncate">{idCardAddress || "ក្បាលស្ពាន២, អូរជ្រៅ, ប៉ោយប៉ែត, បន្ទាយមានជ័យ"}</span>
                              </div>
                              <span className="text-white/40">|</span>
                              <div className="flex items-center gap-1 max-w-[32%] truncate">
                                <Phone className="w-2.5 h-2.5 text-white shrink-0" />
                                <span className="truncate font-mono">{idCardPhone || "+855 87 850 014"}</span>
                              </div>
                            </div>
                          </div>
                        </div></div>

{/* Action buttons (Download & Print) */}
                      <div className="grid grid-cols-2 gap-3.5 w-full">
                        <button
                          onClick={downloadIdCard}
                          className="px-4 py-3 bg-[#00A86B] hover:bg-[#008F5A] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs select-none active:scale-[0.98]"
                        >
                          <Download className="w-4 h-4" />
                          <span>{idt("ទាញយកកាតផ្ទាល់ខ្លួន", "Download Card", "下载胸牌 (Download Card)")}</span>
                        </button>
                        
                        <button
                          onClick={printIdCard}
                          className="px-4 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs select-none active:scale-[0.98]"
                        >
                          <Printer className="w-4 h-4" />
                          <span>{idt("បោះពុម្ពកាត", "Print Card", "打印胸牌 (Print Card)")}</span>
                        </button>
                      </div>

                      {/* Technology Notice banner (SMART NFC/BARCODE INTEGRATION) */}
                      <div className="w-full bg-[#0B1528] text-slate-300 p-4 rounded-2xl border border-slate-800 text-[10px] space-y-2 text-left">
                        <div className="flex items-center gap-2 text-sky-400 font-black uppercase tracking-wider">
                          <Cpu className="w-4 h-4" />
                          <span>{idt("តំណភ្ជាប់ប្រព័ន្ធស្កេន", "SMART NFC/BARCODE INTEGRATION", "智能二维码/条形码集成 (SMART NFC/BARCODE INTEGRATION)")}</span>
                        </div>
                        <p className="text-slate-400 font-semibold leading-relaxed">
                          * {idt("កាតនីមួយៗត្រូវបានបង្កើតឡើងដោយស្វ័យប្រវត្តជាមួយ", "Each card is automatically generated with", "每张卡片均自动生成专属的")} <span className="text-white font-extrabold">{idt("QR Code សម្គាល់កូដសិស្ស", "ID-bound Secure Barcode (QR Code)", "绑定身份证的加密二维码 (ID-bound Secure Barcode)")}</span> {idt("សម្រាប់ស្កេន។", "for scanning.", "用于扫码识别。")}
                        </p>
                        <p className="text-slate-400 font-semibold leading-relaxed">
                          * {idt("លេខកូដ", "The code", "卡号")} <span className="text-white font-extrabold font-mono">{idCardIdNumber || "00.112.22.333"}</span> {idt("ងាយស្រួលស្កេននៅលើម៉ាស៊ីនស្កេនកាត", "is easy to scan on the card scanner under the", "可在扫码功能")} <span className="text-sky-400 font-extrabold">"{idt("ម៉ាស៊ីនស្កេន", "QR Scanner", "“扫码器 (QR Scanner)”")}"</span> {idt("ដើម្បីកត់ត្រាវត្តមានចូលរៀនកាន់តែលឿន!", "tab to record attendance faster!", "面板中进行扫描，实现快速签到记勤！")}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })()}    </>
  );
}
