import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportElementToPDF(element: HTMLElement, filename = "survica-report.pdf") {
  const canvas = await html2canvas(element, { backgroundColor: "#FFFFFF", scale: 2 });
  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageHeight = (canvas.height * pageWidth) / canvas.width;
  let heightLeft = imageHeight;
  let position = 0;

  pdf.addImage(imageData, "PNG", 0, position, pageWidth, imageHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imageHeight;
    pdf.addPage();
    pdf.addImage(imageData, "PNG", 0, position, pageWidth, imageHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
