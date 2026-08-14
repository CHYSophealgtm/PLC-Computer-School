import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { safeToJpeg } from "../lib/safe-html-to-image";

export function printCertificate(): void {
  document.body.classList.add("printing-certificate");
  window.print();
  setTimeout(() => {
    document.body.classList.remove("printing-certificate");
  }, 1000);
}

export async function exportCertificateAsJpg(
  elementId = "printable-certificate-container",
  filename = "Certificate.jpg"
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Certificate element not found:", elementId);
    return false;
  }

  try {
    let imgData = "";
    try {
      imgData = await safeToJpeg(element, { quality: 0.95, pixelRatio: 2 });
    } catch (e) {
      console.warn("safeToJpeg failed, falling back to html2canvas", e);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      } as any);
      imgData = canvas.toDataURL("image/jpeg", 0.95);
    }

    const link = document.createElement("a");
    link.href = imgData;
    link.download = filename.endsWith(".jpg") ? filename : `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error("Error exporting JPG:", err);
    return false;
  }
}

export async function exportCertificateAsPdf(
  elementId = "printable-certificate-container",
  filename = "Certificate.pdf"
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Certificate element not found:", elementId);
    return false;
  }

  try {
    let imgData = "";
    try {
      imgData = await safeToJpeg(element, { quality: 0.95, pixelRatio: 2 });
    } catch (e) {
      console.warn("safeToJpeg failed, falling back to html2canvas", e);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      } as any);
      imgData = canvas.toDataURL("image/jpeg", 0.95);
    }

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
    return true;
  } catch (err) {
    console.error("Error exporting PDF:", err);
    return false;
  }
}
