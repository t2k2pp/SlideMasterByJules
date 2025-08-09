import { useState } from 'react';
import { AppState, Presentation, Screen, ShapeLayer, TextLayer, Layer } from './types'; // Automatically resolves to types/index.ts
import { WelcomeScreen } from './components/WelcomeScreen';
import { EditorScreen } from './components/EditorScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AIAssistant } from './components/AIAssistant';
import { VideoAnalysisScreen } from './components/VideoAnalysisScreen';
import { ExportManager } from './components/ExportManager';

const samplePresentation: Presentation = {
  id: 'pres-1',
  title: 'Sample Presentation',
  description: '',
  theme: 'modern-light',
  purpose: 'business-report',
  slides: [
    {
      id: 'slide-1',
      title: 'First Slide',
      background: '#ffffff',
      layers: [
        {
          id: 'layer-1',
          type: 'text',
          x: 10, y: 10, width: 80, height: 15, rotation: 0, opacity: 1, zIndex: 1,
          content: 'Hello, SlideMaster!',
          fontSize: 60,
          textAlign: 'center',
          color: '#000000',
          fontFamily: 'Arial'
        } as TextLayer,
        {
          id: 'layer-2',
          type: 'shape',
          x: 20, y: 30, width: 60, height: 40, rotation: 10, opacity: 0.8, zIndex: 0,
          shapeType: 'rectangle',
          fillColor: '#4F46E5',
          strokeColor: '#3730A3',
          strokeWidth: 4
        } as ShapeLayer,
      ],
      notes: "This is a sample slide for testing."
    }
  ],
  globalSettings: {
    aspectRatio: '16:9',
    defaultFont: 'Arial',
  },
  versionInfo: { version: '1.0' },
  createdAt: new Date(),
  updatedAt: new Date(),
  aiInteractionHistory: [],
  exportHistory: [],
};

const initialState: AppState = {
  currentPresentation: samplePresentation,
  currentSlideIndex: 0,
  currentScreen: 'editor',
  isAiAssistantOpen: false,
  isExportManagerOpen: false,
  canvasState: {
    zoom: 1,
    offset: { x: 0, y: 0 },
    gridSize: 20,
    isGridVisible: true,
  },
  selectedLayerIds: [],
  clipboardLayers: [],
  undoStack: [],
  redoStack: [],
  isAIProcessing: false,
  aiProcessingProvider: null,
  aiProcessingProgress: 0,
  error: null,
  notifications: [],
  suppressedErrors: [],
  recentPresentations: [],
  isAutoSaving: false,
  lastSavedAt: null,
  isDirty: false,
  appSettings: {
    theme: 'system',
    autoSaveInterval: 120, // 2 minutes
    defaultProvider: 'gemini',
  },
  apiKeyStatus: {
    gemini: 'missing',
    azure: 'missing',
    openai: 'missing',
    claude: 'missing',
    lmstudio: 'missing',
    fooocus: 'missing',
  },
  featureFlags: {},
  performanceMetrics: {},
};

function App() {
  const [appState, setAppState] = useState<AppState>(initialState);

  const setCurrentScreen = (screen: Screen) => {
    setAppState(prevState => ({ ...prevState, currentScreen: screen }));
  };

  const setSelectedLayerIds = (ids: string[]) => {
    setAppState(prevState => ({ ...prevState, selectedLayerIds: ids }));
  };

  const updateLayerProperties = (layerId: string, newProperties: Partial<Layer>) => {
    setAppState(prevState => {
      if (!prevState.currentPresentation) return prevState;

      const newSlides = prevState.currentPresentation.slides.map((slide, index) => {
        if (index !== prevState.currentSlideIndex) return slide;

        const newLayers = slide.layers.map(layer => {
          if (layer.id === layerId) {
            return { ...layer, ...newProperties };
          }
          return layer;
        });

        return { ...slide, layers: newLayers };
      });

      return {
        ...prevState,
        currentPresentation: {
          ...prevState.currentPresentation,
          slides: newSlides,
        },
        isDirty: true,
      };
    });
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleCloseSettings = () => {
    setCurrentScreen('editor');
  };

  const handleCreatePresentationFromSlides = (slides: Slide[]) => {
    const newPresentation: Presentation = {
      id: `pres-${Date.now()}`,
      title: 'New Video Manual',
      description: 'Generated from video analysis',
      theme: 'modern-light',
      purpose: 'tech-documentation',
      slides: slides,
      globalSettings: {
        aspectRatio: '16:9',
        defaultFont: 'Arial',
      },
      versionInfo: { version: '1.0' },
      createdAt: new Date(),
      updatedAt: new Date(),
      aiInteractionHistory: [],
      exportHistory: [],
    };

    setAppState(prev => ({
      ...prev,
      currentPresentation: newPresentation,
      currentSlideIndex: 0,
      currentScreen: 'editor',
    }));
  };

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={setCurrentScreen} />;
      case 'editor':
        if (appState.currentPresentation) {
          return <EditorScreen
            presentation={appState.currentPresentation}
            currentSlideIndex={appState.currentSlideIndex}
            selectedLayerIds={appState.selectedLayerIds}
            onSelectLayer={setSelectedLayerIds}
            onUpdateLayer={updateLayerProperties}
            onOpenSettings={handleOpenSettings}
            onOpenAiAssistant={() => setAppState(prev => ({ ...prev, isAiAssistantOpen: true }))}
            onOpenExportManager={() => setAppState(prev => ({ ...prev, isExportManagerOpen: true }))}
          />;
        }
        return <div>Loading...</div>; // Or some other placeholder
      case 'settings':
        return <SettingsScreen onClose={handleCloseSettings} />;
      case 'video_analysis':
        return <VideoAnalysisScreen
          onClose={() => setCurrentScreen('welcome')}
          onCreatePresentation={handleCreatePresentationFromSlides}
        />;
      // case 'slideshow':
      //   return <SlideShow />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="slidemaster-app">
      {renderCurrentScreen()}
      {appState.isAiAssistantOpen && <AIAssistant onClose={() => setAppState(prev => ({ ...prev, isAiAssistantOpen: false }))} />}
      {appState.isExportManagerOpen && <ExportManager presentation={appState.currentPresentation} onClose={() => setAppState(prev => ({...prev, isExportManagerOpen: false}))} />}
    </div>
  );
}

export default App;
