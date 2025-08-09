import React, { useState } from 'react';
import { Presentation } from '../types';
import exportToPdf from '../services/export/pdfExporter';
import exportToPptx from '../services/export/pptxExporter';

interface ExportManagerProps {
  presentation: Presentation | null;
  onClose: () => void;
  onExportAsPng: () => void;
}

export const ExportManager = ({ presentation, onClose, onExportAsPng }: ExportManagerProps) => {
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [isPptxExporting, setIsPptxExporting] = useState(false);

  const handlePdfExport = async () => {
    if (!presentation) return;
    setIsPdfExporting(true);
    try {
      await exportToPdf(presentation);
    } catch (e) {
      console.error("PDF Export failed", e);
      alert("PDF Export failed. See console for details.");
    } finally {
      setIsPdfExporting(false);
      onClose();
    }
  };

  const handlePptxExport = async () => {
    if (!presentation) return;
    setIsPptxExporting(true);
    try {
      await exportToPptx(presentation);
    } catch (e) {
      console.error("PPTX Export failed", e);
      alert("PPTX Export failed. See console for details.");
    } finally {
      setIsPptxExporting(false);
      onClose();
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
          <h3>Export Presentation</h3>
          <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
        </div>
        <p style={{marginTop: 0, color: '#666'}}>Choose your desired format.</p>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px'}}>
          <button onClick={handlePdfExport} disabled={isPdfExporting} style={buttonStyle}>
            {isPdfExporting ? 'Exporting PDF...' : 'Export as PDF'}
          </button>
          <button onClick={handlePptxExport} disabled={isPptxExporting} style={buttonStyle}>
            {isPptxExporting ? 'Exporting PPTX...' : 'Export as PowerPoint (.pptx)'}
          </button>
          <button onClick={onExportAsPng} style={buttonStyle}>Export Current Slide as PNG</button>
        </div>
      </div>
    </div>
  );
};

// Basic styles for modal
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000,
};
const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  fontFamily: 'sans-serif',
};
const buttonStyle: React.CSSProperties = {
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer',
  textAlign: 'left',
  backgroundColor: '#f9f9f9',
};
