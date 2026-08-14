import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Users, UserPlus, BookOpen, Award, Clock, List, LayoutGrid, Trash2, Eye, Search, Filter, Plus, Edit3, GraduationCap, Download, Camera, ChevronLeft, ChevronRight, X, Phone, Save, Pencil, Calendar, DollarSign, CreditCard, MapPin, Smartphone, ChevronDown, Check, User, Activity, ArrowUp, ArrowDown, LineChart, TrendingUp, Printer, Heart, RotateCcw, Landmark, MessageSquare, Folder, File, Terminal, Server, Workflow, Network, Layers, FileCode, BarChart2, FileText, Globe, ImageIcon, Info, AlertTriangle, Coins, Sparkles, Cpu, CheckCircle, Database, Cloud, UploadCloud, RefreshCw, AlertCircle, Trash, Key, FileDown, Lock } from 'lucide-react';
import { googleSignIn, initAuth, logoutGoogle } from '../../firebaseAuth';

export default function DatabaseTab(props: any) {
  const { dbActiveStep, dbTablesMetadata = {}, expandedFolders = {}, fetchFileContent, fetchWorkspaceTree, isLoadingFileContent, isLoadingWorkspace, selectedDbTable, selectedFile, setDbActiveStep, setExpandedFolders, setSelectedDbTable, setShowPrismaCode, showPrismaCode, toKhmerNumeral, workspaceError, workspaceFiles = [], uiLang } = props;
  const activeTab = "Database";

  const [localLang, setLocalLang] = React.useState(uiLang || localStorage.getItem("plc_lang") || "kh");

  React.useEffect(() => {
    if (uiLang) {
      setLocalLang(uiLang);
    }
  }, [uiLang]);

  React.useEffect(() => {
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
  return (<>
    <motion.div
      key="Database"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* 1. TOP HEADER SECTION */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Database className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
                <Database className="w-7 h-7 text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 mb-1 font-sans">
                  {localIdt("កន្លែងគ្រប់គ្រងទិន្នន័យប្រព័ន្ធ (System Database Workspace)", "System Database Workspace")}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider font-extrabold border border-emerald-200/50">
                    Active
                  </span>
                </h2>

                    </div>
                  </div>
                  
                  {/* Step Navigation Tabs inside Header */}
                  <div className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start xl:self-auto">
                    <button
                      onClick={() => {
                        setDbActiveStep("schema");
                        setShowPrismaCode(false);
                      }}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        dbActiveStep === "schema"
                          ? "bg-white text-primary-700 shadow-xs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      <span>Step 1: DB Schema</span>
                    </button>
                    <button
                      onClick={() => {
                        setDbActiveStep("directory");
                      }}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        dbActiveStep === "directory"
                          ? "bg-white text-primary-700 shadow-xs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Workflow className="w-4 h-4" />
                      <span>Step 2: Directory Tree</span>
                    </button>
                </div>

          </div>
        </div>
      </div>

                {/* 2. MAIN WORKSPACE CONTENT */}
                {dbActiveStep === "schema" ? (
                  <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs relative">
                    {/* Inner Header with actions */}
                    <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8.5 h-8.5 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                          <Server className="w-4.5 h-4.5 text-primary-400" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-wide uppercase font-sans">
                            Database Architecture (Prisma PostgreSQL)
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                            ដំណោះស្រាយ: ប្លង់បច្ចេកទេស និងទំនាក់ទំនងរវាងតារាងទិន្នន័យ
                          </p>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowPrismaCode(!showPrismaCode);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-3xs border ${
                            showPrismaCode
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <FileCode className="w-4 h-4" />
                          <span>Prisma Schema Code</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Section based on selected view mode */}
                    {showPrismaCode ? (
                      /* Prisma schema file code view */
                      <div className="p-6 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto flex-1 min-h-0 overflow-y-auto rounded-b-3xl">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-500">
                          <span>prisma/schema.prisma</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-sans font-bold">Read-Only View</span>
                        </div>
                        <pre className="leading-relaxed">
{`generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                  String       @id @default(uuid())
  email               String       @unique
  passwordHash        String
  fullName            String
  role                Role         @default(STAFF)
  telegramId          String?
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt
  recordedAttendances Attendance[] @relation("RecordedBy")
  teacherProfile      Teacher?
}

model Student {
  id                String        @id @default(uuid())
  studentId         String        @unique
  firstNameKh       String?
  lastNameKh        String?
  firstNameEn       String?
  lastNameEn        String?
  nameKh            String?
  nameEn            String?
  gender            String
  course            String?
  level             String?
  status            String?
  startDate         String?
  endDate           String?
  shift             String?
  fee               Float?
  paid              Float?
  due               Float?
  guardianName      String?
  guardianPhone     String?
  telegramConnected Boolean?      @default(false)
  dob               String?
  pob               String?
  fullFee           Float?
  discount          Float?
  hours             String?
  dateOfBirth       DateTime?
  photoUrl          String?
  parentTelegramId  String?
  phoneNumber       String?
  grade             String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  attendances       Attendance[]
  certificates      Certificate[]
  payments          Invoice[]
}

model Teacher {
  id             String              @id @default(uuid())
  teacherId      String              @unique
  firstNameKh    String?
  lastNameKh     String?
  firstNameEn    String?
  lastNameEn     String?
  nameKh         String?
  nameEn         String?
  gender         String
  specialty      String?
  phone          String?
  dob            String?
  pob            String?
  joinDate       String?
  leaveDate      String?
  experienceDays String?
  salary         Float?
  paymentStatus  String?
  status         String?
  notes          String?
  email          String?             @unique
  phoneNumber    String?
  photoUrl       String?
  telegramId     String?
  userId         String?             @unique
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
  salaries       SalaryPayment[]
  user           User?               @relation(fields: [userId], references: [id])
  attendances    TeacherAttendance[]
}

model Attendance {
  id                       String           @id @default(uuid())
  studentId                String
  status                   AttendanceStatus @default(PRESENT)
  date                     DateTime
  reason                   String?
  recordedById             String
  telegramNotificationSent Boolean          @default(false)
  createdAt                DateTime         @default(now())
  recordedBy               User             @relation("RecordedBy", fields: [recordedById], references: [id])
  student                  Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([studentId, date])
}

model TeacherAttendance {
  id                       String           @id @default(uuid())
  teacherId                String
  status                   AttendanceStatus @default(PRESENT)
  date                     DateTime
  reason                   String?
  telegramNotificationSent Boolean          @default(false)
  createdAt                DateTime         @default(now())
  teacher                  Teacher          @relation(fields: [teacherId], references: [id], onDelete: Cascade)

  @@unique([teacherId, date])
}

model Invoice {
  id            String        @id @default(uuid())
  invoiceNumber String        @unique
  studentId     String
  term          String
  amountDue     Decimal
  amountPaid    Decimal       @default(0.00)
  status        PaymentStatus @default(PENDING)
  paymentDate   DateTime?
  paymentMethod String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  student       Student       @relation(fields: [studentId], references: [id])
}

model SalaryPayment {
  id            String        @id @default(uuid())
  teacherId     String
  payPeriod     String
  baseSalary    Decimal
  bonus         Decimal       @default(0.00)
  deduction     Decimal       @default(0.00)
  totalPaid     Decimal
  status        PaymentStatus @default(PENDING)
  paymentDate   DateTime?
  invoiceNumber String        @unique
  createdAt     DateTime      @default(now())
  teacher       Teacher       @relation(fields: [teacherId], references: [id])
}

model CertificateTemplate {
  id           String        @id @default(uuid())
  title        String
  bgImageUrl   String
  contentXml   String?
  createdAt    DateTime      @default(now())
  certificates Certificate[]
}

model Certificate {
  id                String              @id @default(uuid())
  certificateNumber String              @unique
  studentId         String
  templateId        String
  issueDate         DateTime            @default(now())
  gradeTitle        String
  qrCodeUrl         String?
  template          CertificateTemplate @relation(fields: [templateId], references: [id])
  student           Student             @relation(fields: [studentId], references: [id], onDelete: Cascade)
}

enum Role {
  ADMIN
  TEACHER
  STAFF
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  PERMISSION
}

enum PaymentStatus {
  PENDING
  PAID
  OVERDUE
}`}
                        </pre>
                      </div>
                    ) : (
                      /* Main DB Interactive Schema Table Layout (High fidelity to screenshot!) */
                      <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* LEFT COLUMN: Sidebar with tables list */}
                        <div className="lg:col-span-3 border-r border-slate-200/60 p-5 space-y-4 bg-slate-50/20">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="font-extrabold text-slate-400 text-[10px] tracking-wider uppercase font-sans">
                              POSTGRESQL TABLES (9)
                            </span>
                          </div>
                          
                          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                            {Object.entries(dbTablesMetadata).map(([key, tbl]) => {
                              const isActive = selectedDbTable === key;
                              return (
                                <button
                                  key={key}
                                  onClick={() => setSelectedDbTable(key)}
                                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                                    isActive
                                      ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                                      : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Database className={`w-4 h-4 ${isActive ? "text-primary-400" : "text-slate-400"}`} />
                                    <span className="text-xs font-extrabold tracking-tight font-sans">{(tbl as any).name}</span>
                                  </div>
                                  <span className={`text-[9px] font-black tracking-wide px-2 py-0.5 rounded-md ${
                                    isActive 
                                      ? "bg-slate-800 text-slate-300" 
                                      : "bg-slate-100 text-slate-500"
                                  }`}>
                                    {(tbl as any).cols} cols
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Table detailed schema view */}
                        <div className="lg:col-span-9 p-6 space-y-6">
                          {/* Table detail header */}
                          {(() => {
                            const activeTbl = (dbTablesMetadata && dbTablesMetadata[selectedDbTable as keyof typeof dbTablesMetadata]) || (dbTablesMetadata && dbTablesMetadata.User) || { name: "User", khText: "", fields: [] };
                            const activeFields = activeTbl.fields || [];
                            return (
                              <div className="space-y-5 animate-fadeIn">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs bg-primary-50 text-primary-700 font-black px-2.5 py-0.5 rounded border border-primary-200/60 uppercase font-sans">MODEL</span>
                                    <h4 className="font-black text-slate-900 text-lg sm:text-xl font-sans tracking-tight">
                                      {activeTbl.name}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>
                                    <span>{toKhmerNumeral(activeFields.length)} variables</span>
                                  </span>
                                </div>

                                {/* Table Cambodia Explain box */}
                                <div className="bg-amber-50/40 border border-amber-200/70 p-4.5 rounded-2xl flex items-start gap-3">
                                  <span className="text-lg shrink-0 mt-0.5">💡</span>
                                  <div className="text-xs leading-relaxed text-amber-900/95">
                                    <span className="font-black font-sans uppercase tracking-wider text-[10px] text-amber-700 block mb-0.5">ពន្យល់តារាង</span>
                                    <p className="font-bold">{activeTbl.khText}</p>
                                  </div>
                                </div>

                                {/* Detailed Fields table */}
                                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-3xs">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 font-sans">
                                          <th className="px-5 py-3.5">FIELD NAME</th>
                                          <th className="px-5 py-3.5">TYPE</th>
                                          <th className="px-5 py-3.5">CONSTRAINT</th>
                                          <th className="px-5 py-3.5">DESCRIPTION (ការពណ៌នាលម្អិត)</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-200 text-xs font-semibold text-slate-700">
                                        {activeFields.map((f, index) => (
                                          <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-5 py-3.5 font-bold font-sans text-slate-900 flex items-center gap-1.5">
                                              <span>{f.name}</span>
                                              {f.constraint === "PRIMARY KEY" && (
                                                <span className="text-[10px] text-amber-500" title="Primary Key">🔑</span>
                                              )}
                                              {f.constraint === "FOREIGN KEY" && (
                                                <span className="text-[10px] text-primary-500" title="Foreign Key">🔗</span>
                                              )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                              <span className="font-mono text-[11px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                                {f.type}
                                              </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                              {f.constraint !== "-" ? (
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                                                  f.constraint === "PRIMARY KEY"
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : f.constraint === "UNIQUE"
                                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                      : "bg-primary-50 text-primary-700 border-primary-200"
                                                }`}>
                                                  {f.constraint}
                                                </span>
                                              ) : (
                                                <span className="text-slate-300">-</span>
                                              )}
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-slate-600 leading-normal font-sans">
                                              {f.desc}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                ) : dbActiveStep === "directory" ? (
                  /* STEP 2: DIRECTORY WORKSPACE TREE */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Expandable Tree View */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs min-h-[500px] flex flex-col">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                        <span className="font-extrabold text-slate-800 text-xs tracking-wider uppercase font-sans">
                          PROJECT FOLDERS & FILES
                        </span>
                        <button
                          onClick={fetchWorkspaceTree}
                          className="text-[10px] text-primary-600 hover:text-primary-800 font-bold font-sans cursor-pointer flex items-center gap-1 bg-transparent border-none"
                        >
                          🔄 REFRESH
                        </button>
                      </div>

                      {/* Tree Render Structure */}
                      <div className="space-y-1 flex-1 overflow-y-auto max-h-[600px] pr-1">
                        {isLoadingWorkspace ? (
                          <div className="space-y-3 py-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="flex items-center gap-2 animate-pulse">
                                <div className="w-4 h-4 bg-slate-200 rounded" />
                                <div className="h-3 bg-slate-200 rounded w-24" />
                              </div>
                            ))}
                          </div>
                        ) : workspaceError ? (
                          <div className="text-center py-8 text-xs text-rose-500 font-bold font-sans">
                            {workspaceError}
                          </div>
                        ) : (workspaceFiles || []).length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-400 font-bold font-sans">
                            No files found in workspace root
                          </div>
                        ) : (
                          (() => {
                            const toggleLocalFolder = (folderPath: string) => {
                              setExpandedFolders((prev: any) => ({ ...prev, [folderPath]: !prev[folderPath] }));
                            };

                            const renderNode = (node: any, depth = 0) => {
                              const isFolder = node.type === "folder";
                              const isOpen = expandedFolders[node.path];
                              const isSelected = selectedFile?.path === node.path;

                              return (
                                <div key={node.path} className="select-none">
                                  <div
                                    onClick={() => {
                                      if (isFolder) {
                                        toggleLocalFolder(node.path);
                                      } else {
                                        fetchFileContent(node.path);
                                      }
                                    }}
                                    style={{ paddingLeft: `${depth * 14 + 8}px` }}
                                    className={`flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer text-xs font-bold transition-all ${
                                      isSelected 
                                        ? "bg-primary-600 text-white shadow-3xs" 
                                        : isFolder 
                                          ? "text-slate-700 hover:bg-slate-50" 
                                          : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    {isFolder ? (
                                      <>
                                        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                                        <Folder className={`w-4 h-4 shrink-0 ${isOpen ? "text-primary-500 fill-primary-100" : "text-slate-400 fill-slate-50"}`} />
                                        <span className="font-sans text-slate-800">{node.name}</span>
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-3.5 h-3.5 shrink-0" />
                                        <File className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                                        <span className={isSelected ? "text-white font-sans" : "text-slate-600 font-sans"}>{node.name}</span>
                                      </>
                                    )}
                                  </div>

                                  {isFolder && isOpen && node.children && (
                                    <div className="space-y-0.5 mt-0.5">
                                      {node.children.map((child: any) => renderNode(child, depth + 1))}
                                    </div>
                                  )}
                                </div>
                              );
                            };

                            return (workspaceFiles || []).map((f: any) => renderNode(f));
                          })()
                        )}
                      </div>
                    </div>

                    {/* Right Code Display Pane */}
                    <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden shadow-md flex flex-col min-h-[500px] max-h-[650px] relative">
                      <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-950 flex items-center justify-between text-xs text-slate-400 font-bold font-sans">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <span>{selectedFile ? selectedFile.path : "No file selected"}</span>
                        </div>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase">
                          {selectedFile ? selectedFile.lang : "-"}
                        </span>
                      </div>
                      
                      <div className="p-5 flex-1 overflow-auto font-mono text-xs text-slate-300 leading-relaxed">
                        {isLoadingFileContent ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                            <span>Loading file content from system...</span>
                          </div>
                        ) : selectedFile ? (
                          <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                            <FileCode className="w-8 h-8 opacity-40 animate-pulse" />
                            <span>Click any file on the left to inspect codebase</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
      </motion.div></>
  );
}
