import React, { useRef } from 'react';
import { Header } from './Header';
import { SlideNavigator } from './SlideNavigator';
import { SlideCanvas } from './SlideCanvas';
import { LayerEditor } from './LayerEditor';
import { Presentation, Layer } from '../types';
import { exportNodeToPng } from '../services/export/imageExporter';
import { ExportManager } from './ExportManager';

interface EditorScreenProps {
  presentation: Presentation;
  currentSlideIndex: number;
  selectedLayerIds: string[];
  isExportManagerOpen: boolean;
  onSelectLayer: (ids:string[]) => void;
  onUpdateLayer: (layerId: string, newProperties: Partial<Layer>) => void;
  onOpenSettings: () => void;
  onOpenAiAssistant: () => void;
  onOpenExportManager: () => void;
  onCloseExportManager: () => void;
}

export const EditorScreen = ({
  presentation,
  currentSlideIndex,
  selectedLayerIds,
  isExportManagerOpen,
  onSelectLayer,
  onUpdateLayer,
  onOpenSettings,
  onOpenAiAssistant,
  onOpenExportManager,
  onCloseExportManager,
}: EditorScreenProps) => {
  const slideRef = useRef<HTMLDivElement>(null);

  const handleExportPng = () => {
    if (slideRef.current) {
      exportNodeToPng(slideRef.current, `slide-${currentSlideIndex + 1}`);
      onCloseExportManager(); // Close the modal after triggering export
    } else {
      console.error("Slide element not found for export.");
      alert("Could not export slide. Please try again.");
    }
  };

  const editorScreenStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f0f0f0',
  };

  const mainContentStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  };

  const currentSlide = presentation.slides[currentSlideIndex];

  return (
    <div style={editorScreenStyle}>
      <Header
        onOpenSettings={onOpenSettings}
        onOpenAiAssistant={onOpenAiAssistant}
        onOpenExportManager={onOpenExportManager}
      />
      <div style={mainContentStyle}>
        <SlideNavigator slides={presentation.slides} currentSlideIndex={currentSlideIndex} />
        <SlideCanvas
          ref={slideRef}
          slide={currentSlide}
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onUpdateLayer={onUpdateLayer}
        />
        <LayerEditor />
      </div>
      {isExportManagerOpen && (
        <ExportManager
          presentation={presentation}
          onClose={onCloseExportManager}
          onExportAsPng={handleExportPng}
        />
      )}
    </div>
  );
};
