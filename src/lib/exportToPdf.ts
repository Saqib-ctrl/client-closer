import jsPDF from "jspdf";

export const exportToPdf = (content: string, filename: string = "document.pdf") => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 7;
  let y = margin;

  doc.setFont("helvetica");
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(content, maxWidth);

  for (const line of lines) {
    if (y + lineHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  doc.save(filename);
};
