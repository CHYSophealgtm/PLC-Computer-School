import React from 'react';

export default function CertificatesTemplate({
  previewCert,
  schoolLogo,
  customBackground,
}: any) {
  const bgImageSrc = 
    customBackground || 
    (typeof window !== "undefined" ? localStorage.getItem("sms_certificate_background") : null) || 
    "/blank_certificate_template.jpg";

  return (
    <div
      id="printable-certificate-container"
      className="bg-white relative flex overflow-hidden font-serif"
      style={{
        width: '1122.5px', // A4 Landscape 300dpi approximation
        height: '793.7px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      <img 
        src={bgImageSrc} 
        alt="Certificate Background" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
        onError={(e) => {
          const img = e.currentTarget;
          img.onerror = null;
          if (!img.src.endsWith("/blank_certificate_template.jpg")) {
            img.src = "/blank_certificate_template.jpg";
          }
        }}
      />
      
      {/* All text absolutely positioned to match the blank template */}
      
      {/* 1. Cert Number (Top Left under logo, after "លេខ :") */}
      <div className="absolute z-10 flex items-center justify-start font-bold text-black text-[13px]" style={{ top: '30.8%', left: '19.5%', width: '12%', height: '3%' }}>
        {previewCert.certificateNumber}
      </div>
      
      {/* 2. Student Name Kh (Line 1 Left) */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[18px] whitespace-nowrap" style={{ top: '42.8%', left: '21.5%', width: '18%', height: '3.8%' }}>
        {previewCert.studentNameKh}
      </div>
      
      {/* Gender Kh */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[16px]" style={{ top: '42.8%', left: '42.0%', width: '6%', height: '3.8%' }}>
        {previewCert.genderKh}
      </div>
      
      {/* Name En (Line 1 Right) */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-black font-serif uppercase tracking-wider text-[17px] whitespace-nowrap" style={{ top: '42.8%', left: '64.5%', width: '18%', height: '3.8%' }}>
        {previewCert.studentNameEn}
      </div>
      
      {/* Gender En */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[16px]" style={{ top: '42.8%', left: '85.0%', width: '5%', height: '3.8%' }}>
        {previewCert.genderEn}
      </div>
      
      {/* 3. DOB Kh (Line 2 Left) */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-black tracking-widest text-[16px]" style={{ top: '48.2%', left: '22.5%', width: '25.5%', height: '3.8%' }}>
        {previewCert.dateOfBirthKh}
      </div>
      
      {/* DOB En (Line 2 Right) */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-black font-serif tracking-widest text-[16px]" style={{ top: '48.2%', left: '62.0%', width: '27.0%', height: '3.8%' }}>
        {previewCert.dateOfBirthEn}
      </div>
      
      {/* 4. Course Kh (Line 3 Left side after "ក្នុងជំនាញវគ្គសិក្សាខ្លី :") */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-[#0a3161] uppercase tracking-wide text-[16px] whitespace-nowrap" style={{ top: '53.6%', left: '36.5%', width: '25%', height: '3.8%' }}>
        {previewCert.courseName}
      </div>
      
      {/* Course En (Line 4 Right side after "of specialization :") */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-[#0a3161] uppercase tracking-wide text-[16px] whitespace-nowrap" style={{ top: '58.2%', left: '64.0%', width: '25%', height: '3.8%' }}>
        {previewCert.courseName}
      </div>
      
      {/* 5. Period of Study Kh (Line 5 Left - split start and end around background "ដល់") */}
      {(() => {
        const period = previewCert.periodOfStudyKh || '';
        const parts = period.includes('ដល់') ? period.split('ដល់') : [period, ''];
        return (
          <>
            <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[14px]" style={{ top: '62.8%', left: '19.5%', width: '11.0%', height: '3.8%' }}>
              {parts[0]?.trim()}
            </div>
            <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[14px]" style={{ top: '62.8%', left: '33.5%', width: '11.5%', height: '3.8%' }}>
              {parts[1]?.trim()}
            </div>
          </>
        );
      })()}
      
      {/* Period of Study En (Line 5 Right - split start and end around background "to") */}
      {(() => {
        const period = previewCert.periodOfStudyEn || '';
        const parts = period.includes('to') ? period.split('to') : [period, ''];
        return (
          <>
            <div className="absolute z-10 flex items-center justify-center font-bold text-black font-serif text-[14px]" style={{ top: '62.8%', left: '62.0%', width: '11.0%', height: '3.8%' }}>
              {parts[0]?.trim()}
            </div>
            <div className="absolute z-10 flex items-center justify-center font-bold text-black font-serif text-[14px]" style={{ top: '62.8%', left: '75.5%', width: '11.5%', height: '3.8%' }}>
              {parts[1]?.trim()}
            </div>
          </>
        );
      })()}
      
      {/* 6. Lunar Date Kh */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[14px]" style={{ top: '68.0%', left: '52.0%', width: '37.0%', height: '3.5%' }}>
        {previewCert.lunarDateKh}
      </div>
      
      {/* 7. Issue Date (Day, Month, Year) */}
      <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[14px]" style={{ top: '72.0%', left: '66.0%', width: '4.0%', height: '3.5%' }}>
        {previewCert.issueDay}
      </div>
      
      <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[14px]" style={{ top: '72.0%', left: '72.5%', width: '6.0%', height: '3.5%' }}>
        {previewCert.issueMonth}
      </div>
      
      <div className="absolute z-10 flex items-center justify-center font-bold text-black text-[14px]" style={{ top: '72.0%', left: '83.5%', width: '4.0%', height: '3.5%' }}>
        {previewCert.issueYear}
      </div>
      
      {/* Student Photo Box - 4x6 */}
      <div 
        className="absolute z-10 overflow-hidden border-2 border-slate-300 bg-slate-100 shadow-sm flex items-center justify-center rounded-sm" 
        style={{ 
          top: previewCert.photoTop || '70.5%', 
          left: previewCert.photoLeft || '16.8%', 
          width: previewCert.photoWidth || '9.5%', 
          height: previewCert.photoHeight || '17%' 
        }}
      >
        {previewCert.studentPhoto ? (
          <img 
            src={previewCert.studentPhoto} 
            className="w-full h-full object-cover" 
            alt="Student 4x6" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
            }}
          />
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-80" 
            alt="Default 4x6" 
          />
        )}
      </div>
    </div>
  );
}
