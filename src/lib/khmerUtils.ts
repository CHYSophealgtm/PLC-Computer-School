// Utility functions for Khmer numeral conversion and date/time formatting

export const toKhmerNumeral = (num: number | string): string => {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num).split("").map(char => {
    const digit = parseInt(char, 10);
    return isNaN(digit) ? char : khmerDigits[digit];
  }).join("");
};

export const getKhmerDateString = (date: Date, targetLang?: string): string => {
  const currentL = targetLang || localStorage.getItem("plc_lang") || "kh";
  if (currentL === "en") {
    return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } else if (currentL === "zh") {
    return date.toLocaleDateString("zh-CN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  const khmerDays = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"];
  const khmerMonths = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
  ];
  const dayOfWeek = khmerDays[date.getDay()];
  const dayOfMonth = toKhmerNumeral(date.getDate());
  const month = khmerMonths[date.getMonth()];
  const year = toKhmerNumeral(date.getFullYear());
  return `ថ្ងៃ${dayOfWeek} ទី${dayOfMonth} ខែ${month} ឆ្នាំ${year}`;
};

export const getKhmerTimeString = (date: Date, targetLang?: string): string => {
  const currentL = targetLang || localStorage.getItem("plc_lang") || "kh";
  if (currentL !== "kh") {
    return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, '0');
  return `${toKhmerNumeral(hoursStr)}:${toKhmerNumeral(minutes)}:${toKhmerNumeral(seconds)} ${ampm}`;
};

export const getShiftAndHours = (shiftStr: string | undefined, isTeacher: boolean, person?: any) => {
  if (person && person.hours && person.hours.trim() !== "" && person.hours.trim() !== "---") {
    return {
      shift: shiftStr || (isTeacher ? "ច័ន្ទ-សុក្រ (Mon-Fri)" : "---"),
      hours: person.hours
    };
  }
  if (shiftStr && shiftStr.trim() !== "" && shiftStr.trim() !== "---") {
    if (shiftStr.includes("ព្រឹក") || shiftStr.toLowerCase().includes("morning")) {
      return { shift: "ព្រឹក (Morning)", hours: isTeacher ? "07:30 AM - 11:30 AM" : "07:00 AM - 11:00 AM" };
    }
    if (shiftStr.includes("រសៀល") || shiftStr.toLowerCase().includes("afternoon")) {
      return { shift: "រសៀល (Afternoon)", hours: isTeacher ? "01:30 PM - 05:30 PM" : "01:00 PM - 05:00 PM" };
    }
    if (shiftStr.includes("យប់") || shiftStr.toLowerCase().includes("evening") || shiftStr.toLowerCase().includes("night")) {
      return { shift: "យប់ (Evening)", hours: isTeacher ? "05:30 PM - 08:30 PM" : "05:30 PM - 08:30 PM" };
    }
    return { shift: shiftStr, hours: "07:00 AM - 11:00 AM" };
  }
  return {
    shift: isTeacher ? "ច័ន្ទ-សុក្រ (Mon-Fri)" : "ព្រឹក (Morning)",
    hours: isTeacher ? "07:30 AM - 05:30 PM" : "07:00 AM - 11:00 AM"
  };
};
