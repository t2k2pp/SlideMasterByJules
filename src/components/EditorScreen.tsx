import React from 'react';
import { Header } from './Header';
import { SlideNavigator } from './SlideNavigator';
import { SlideCanvas } from './SlideCanvas';
import { LayerEditor } from './LayerEditor';
import { Presentation, Layer } from '../types';

interface EditorScreenProps {
  presentation: Presentation;
  currentSlideIndex: number;
  selectedLayerIds: string[];
  onSelectLayer: (ids:string[]) => void;
  onUpdateLayer: (layerId: string, newProperties: Partial<Layer>) => void;
  onOpenSettings: () => void;
  onOpenAiAssistant: () => void;
  onOpenExportManager: () => void;
}

export const EditorScreen = ({
  presentation,
  currentSlideIndex,
  selectedLayerIds,
  onSelectLayer,
  onUpdateLayer,
  onOpenSettings,
  onOpenAiAssistant,
  onOpenExportManager,
}: EditorScreenProps) => {
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
    overflow: 'hidden', // Prevents scrolling at the top level
  };

  const currentSlide = presentation.slides[currentSlideIndex];

  return (
    <div style={editorScreenStyle}>
      <Header onOpenSettings={onOpenSettings} onOpenAiAssistant={onOpenAiAssistant} onOpenExportManager={onOpenExportManager} />
      <div style={mainContentStyle}>
        <SlideNavigator slides={presentation.slides} currentSlideIndex={currentSlideIndex} />
        <SlideCanvas
          slide={currentSlide}
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onUpdateLayer={onUpdateLayer}
        />
        <LayerEditor />
      </div>
    </div>
  );
};
