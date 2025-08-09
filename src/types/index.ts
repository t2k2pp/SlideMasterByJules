// =================================================================
// Enums and Literal Types from Design Docs
// =================================================================

export type Screen = 'welcome' | 'editor' | 'settings' | 'slideshow' | 'video_analysis';

export type PresentationTheme =
  | 'modern-dark' | 'modern-light' | 'modern-blue'
  | 'elegant-white' | 'elegant-cream' | 'elegant-gray'
  | 'creative-vibrant' | 'creative-pastel' | 'creative-neon'
  | 'business-formal' | 'business-clean' | 'business-corporate'
  | 'academic-simple' | 'academic-classic' | 'academic-scientific'
  | 'storytelling-warm' | 'storytelling-adventure' | 'storytelling-fairytale'
  | 'tech-minimal' | 'tech-cyber' | 'tech-retro';

export type PresentationPurpose =
  | 'business-proposal' | 'business-report' | 'business-strategy'
  | 'education-lecture' | 'education-training' | 'education-workshop'
  | 'storytelling-narrative' | 'storytelling-case-study'
  | 'tech-documentation' | 'tech-api-guide' | 'tech-architecture'
  | 'marketing-pitch' | 'marketing-campaign'
  | 'research-findings' | 'research-methodology'
  | 'personal-portfolio';

export type AIProviderType =
  | 'gemini'
  | 'azure'
  | 'openai'
  | 'claude'
  | 'lmstudio'
  | 'fooocus';

export type ExportFormat = 'pdf' | 'pptx' | 'png' | 'jpeg' | 'svg' | 'html' | 'marp' | 'zip';

export type LayerType = 'text' | 'image' | 'shape';

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'polygon' | 'arrow' | 'line' | 'star' | 'heart';

export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16' | '3:4';

// =================================================================
// Layer and Slide Structures
// =================================================================

interface BaseLayer {
  id: string;
  type: LayerType;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  rotation: number; // degrees
  opacity: number; // 0-1
  zIndex: number;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  content: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  fontFamily: string;
  // ... other text properties
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string; // base64 or url
  prompt?: string;
  objectFit: ObjectFit;
  // ... other image properties
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  // ... other shape properties
}

export type Layer = TextLayer | ImageLayer | ShapeLayer;

export interface Slide {
  id: string;
  title: string;
  layers: Layer[];
  background: string; // color or image url
  notes?: string;
}

// =================================================================
// Presentation and History Structures
// =================================================================

export interface VersionInfo {
  version: string;
  migratedAt?: Date;
}

export interface PresentationSettings {
  aspectRatio: AspectRatio;
  defaultFont: string;
  // ... other global settings
}

export interface Presentation {
  id: string;
  title:string;
  description: string;
  theme: PresentationTheme;
  purpose: PresentationPurpose;
  slides: Slide[];
  globalSettings: PresentationSettings;
  versionInfo: VersionInfo;
  createdAt: Date;
  updatedAt: Date;
  aiInteractionHistory: AIInteractionHistoryItem[];
  exportHistory: ExportHistoryItem[];
}

export interface AIInteractionHistoryItem {
  id: string;
  provider: AIProviderType;
  requestType: 'text' | 'image' | 'video_analysis';
  prompt: string;
  response: any;
  cost?: number;
  timestamp: Date;
}

export interface ExportHistoryItem {
  id: string;
  format: ExportFormat;
  timestamp: Date;
  success: boolean;
  fileSize?: number;
}

// =================================================================
// Application State and Settings
// =================================================================

export interface CanvasState {
  zoom: number;
  offset: { x: number; y: number };
  gridSize: number;
  isGridVisible: boolean;
}

export interface UndoAction {
  // Define structure for undo/redo actions
}

export interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoSaveInterval: number; // in seconds
  defaultProvider: AIProviderType;
}

export type ApiKeyStatus = 'valid' | 'invalid' | 'missing';
export type MultiProviderApiKeyStatus = Record<AIProviderType, ApiKeyStatus>;

export interface FeatureFlags {
  // for A/B testing or feature toggling
}

export interface PerformanceMetrics {
  // for tracking performance
}

export interface AppState {
  currentPresentation: Presentation | null;
  currentSlideIndex: number;
  currentScreen: Screen;
  isAiAssistantOpen: boolean;
  isExportManagerOpen: boolean;
  canvasState: CanvasState;
  selectedLayerIds: string[];
  clipboardLayers: Layer[];
  undoStack: UndoAction[];
  redoStack: UndoAction[];
  isAIProcessing: boolean;
  aiProcessingProvider: AIProviderType | null;
  aiProcessingProgress: number;
  error: string | null;
  notifications: NotificationItem[];
  suppressedErrors: string[];
  recentPresentations: Pick<Presentation, 'id' | 'title' | 'updatedAt'>[];
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  isDirty: boolean;
  appSettings: AppSettings;
  apiKeyStatus: MultiProviderApiKeyStatus;
  featureFlags: FeatureFlags;
  performanceMetrics: PerformanceMetrics;
}
