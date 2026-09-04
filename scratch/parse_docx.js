const fs = require('fs');

const xml = fs.readFileSync('scratch/docx_extracted/word/document.xml', 'utf8');

// Simple regex to extract <w:p> paragraphs and <w:t> text elements
const paragraphs = xml.match(/<w:p[\s>].*?<\/w:p>/gs) || [];

paragraphs.forEach((p, idx) => {
  const texts = p.match(/<w:t[\s>].*?<\/w:t>/gs) || [];
  const textContent = texts.map(t => t.replace(/<[^>]+>/g, '')).join('');
  if (textContent.trim()) {
    console.log(`[P${idx}]: ${textContent}`);
  }
});
