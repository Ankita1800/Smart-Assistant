import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from 'jspdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 225; // Average reading speed
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const downloadTXT = (content: string, filename: string = 'ai-generated-content.txt') => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadPDF = (content: string, filename: string = 'ai-generated-content.pdf') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - (margin * 2);
  
  // Split text into lines that fit the page width
  const lines = doc.splitTextToSize(content, maxLineWidth);
  let y = margin;
  
  // Add title
  doc.setFontSize(16);
  doc.text('AI Generated Content', margin, y);
  y += 20;
  
  // Add content
  doc.setFontSize(12);
  
  for (let i = 0; i < lines.length; i++) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines[i], margin, y);
    y += 7;
  }
  
  doc.save(filename);
};

export const generatePromptVariations = (prompt: string): string[] => {
  const variations = [
    `Create a detailed story about ${prompt}`,
    `Write an engaging narrative featuring ${prompt}`,
    `Develop a creative piece centered on ${prompt}`,
    `Craft an imaginative story involving ${prompt}`,
    `Tell a compelling tale about ${prompt}`
  ];
  
  return variations;
};
