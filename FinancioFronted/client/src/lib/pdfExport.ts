import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisSummary {
  total_income: number;
  total_expense: number;
  net_balance: number;
  transaction_count: number;
  expense_by_category: Record<string, number>;
}

/**
 * Export AI analysis to PDF
 */
export async function exportAnalysisToPDF(
  summary: AnalysisSummary,
  advice: string,
  userName?: string
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header
  pdf.setFillColor(101, 163, 13); // Primary green
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Financio', margin, 20);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Financial Analysis Report', margin, 30);

  yPosition = 50;

  // User info and date
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  pdf.text(`Generated on: ${currentDate}`, margin, yPosition);
  yPosition += 5;
  if (userName) {
    pdf.text(`For: ${userName}`, margin, yPosition);
    yPosition += 10;
  } else {
    yPosition += 5;
  }

  // Financial Summary Section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Financial Summary (Last 30 Days)', margin, yPosition);
  yPosition += 10;

  // Summary boxes
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const boxHeight = 20;
  const boxWidth = (contentWidth - 10) / 3;

  // Income box
  pdf.setFillColor(240, 253, 244); // Light green
  pdf.roundedRect(margin, yPosition, boxWidth, boxHeight, 3, 3, 'F');
  pdf.setTextColor(22, 101, 52); // Dark green
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Income', margin + 5, yPosition + 7);
  pdf.setFontSize(14);
  pdf.text(`$${summary.total_income.toLocaleString('en-US')}`, margin + 5, yPosition + 15);

  // Expense box
  pdf.setFillColor(254, 242, 242); // Light red
  pdf.roundedRect(margin + boxWidth + 5, yPosition, boxWidth, boxHeight, 3, 3, 'F');
  pdf.setTextColor(153, 27, 27); // Dark red
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Expense', margin + boxWidth + 10, yPosition + 7);
  pdf.setFontSize(14);
  pdf.text(`$${summary.total_expense.toLocaleString('en-US')}`, margin + boxWidth + 10, yPosition + 15);

  // Balance box
  const balanceColor = summary.net_balance >= 0 ? [22, 101, 52] : [153, 27, 27];
  pdf.setFillColor(summary.net_balance >= 0 ? 240 : 254, summary.net_balance >= 0 ? 253 : 242, summary.net_balance >= 0 ? 244 : 242);
  pdf.roundedRect(margin + 2 * boxWidth + 10, yPosition, boxWidth, boxHeight, 3, 3, 'F');
  pdf.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2]);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Net Balance', margin + 2 * boxWidth + 15, yPosition + 7);
  pdf.setFontSize(14);
  pdf.text(`$${summary.net_balance.toLocaleString('en-US')}`, margin + 2 * boxWidth + 15, yPosition + 15);

  yPosition += boxHeight + 15;

  // Transaction count
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total transactions: ${summary.transaction_count}`, margin, yPosition);
  yPosition += 10;

  // Expense Breakdown
  if (summary.expense_by_category && Object.keys(summary.expense_by_category).length > 0) {
    checkPageBreak(15);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Expense by Category', margin, yPosition);
    yPosition += 8;

    const sortedCategories = Object.entries(summary.expense_by_category)
      .sort(([, a], [, b]) => b - a);

    for (const [category, amount] of sortedCategories) {
      checkPageBreak(12);
      
      const percentage = ((amount / summary.total_expense) * 100).toFixed(1);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(category, margin, yPosition);
      
      pdf.setTextColor(100, 100, 100);
      pdf.text(`$${amount.toLocaleString('en-US')} (${percentage}%)`, pageWidth - margin - 50, yPosition);
      
      // Progress bar
      yPosition += 2;
      const barWidth = contentWidth;
      const barHeight = 4;
      pdf.setFillColor(230, 230, 230);
      pdf.roundedRect(margin, yPosition, barWidth, barHeight, 1, 1, 'F');
      
      const fillWidth = (parseFloat(percentage) / 100) * barWidth;
      pdf.setFillColor(101, 163, 13);
      pdf.roundedRect(margin, yPosition, fillWidth, barHeight, 1, 1, 'F');
      
      yPosition += 8;
    }
    
    yPosition += 5;
  }

  // AI Analysis Section
  checkPageBreak(20);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AI Analysis & Recommendations', margin, yPosition);
  yPosition += 10;

  // Convert markdown to plain text and format
  const plainAdvice = advice
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1'); // Remove links

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);

  const lines = pdf.splitTextToSize(plainAdvice, contentWidth);
  
  for (const line of lines) {
    checkPageBreak(7);
    pdf.text(line, margin, yPosition);
    yPosition += 5;
  }

  // Footer
  const pageCount = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    pdf.text(
      'Generated by Financio - financio.app',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Save PDF
  const filename = `financio-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}
