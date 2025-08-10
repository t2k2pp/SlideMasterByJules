import React, { useState } from 'react';
import { extractFramesFromVideo } from '../utils/videoFrameExtractor';
import { analyzeVideoWithVision } from '../services/ai/geminiProvider';
import { useProviderConfig } from '../hooks/useProviderConfig';
import { generateSlidesFromMarkdown } from '../utils/manualGenerator';
import { Slide } from '../types';

interface VideoAnalysisScreenProps {
  onClose: () => void;
  onCreatePresentation: (slides: Slide[]) => void;
}

export const VideoAnalysisScreen = ({ onClose, onCreatePresentation }: VideoAnalysisScreenProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const { getProviderConfig } = useProviderConfig();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setFrames([]);
      setError('');
      setAnalysisResult('');
    }
  };

  const handleExtractFrames = async () => {
    if (!videoFile) {
      setError('Please select a video file first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult('');
    try {
      const extracted = await extractFramesFromVideo(videoFile, 10);
      setFrames(extracted);
    } catch (e: any) {
      setError(e.message || 'Failed to extract frames.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (frames.length === 0) {
      setError('Please extract frames before analyzing.');
      return;
    }
    const config = getProviderConfig('gemini');
    if (!config.apiKey) {
      setError('Gemini API Key is not set. Please add it in Settings.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult('');

    const prompt = "You are an expert technical writer. Analyze the following sequence of screen captures from a video tutorial. Create a step-by-step instruction manual in Markdown format. For each step, provide a clear heading, a concise description of the action being performed, and any important details. Structure your output as valid Markdown.";

    try {
      const result = await analyzeVideoWithVision(prompt, config.apiKey, frames);
      setAnalysisResult(result.content);
    } catch (e: any) {
      setError(e.message || 'Failed to analyze video with AI.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ padding: '20px 40px', maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Video to Manual Generator</h2>
        <button onClick={onClose} style={{ padding: '8px 16px', cursor: 'pointer' }}>&larr; Back to Welcome</button>
      </div>
      <hr style={{ margin: '20px 0' }} />

      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h4>Step 1: Upload Video</h4>
        <input type="file" accept="video/mp4,video/webm" onChange={handleFileChange} />
        {videoFile && <p>Selected: {videoFile.name}</p>}

        <h4 style={{ marginTop: '30px' }}>Step 2: Extract Preview Frames</h4>
        <button onClick={handleExtractFrames} disabled={!videoFile || isLoading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {isLoading ? 'Extracting...' : 'Extract Frames (1 every 10s)'}
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h4>Step 3: Analyze with AI</h4>
        <button onClick={handleAnalyze} disabled={frames.length === 0 || isAnalyzing} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Frames with Gemini Vision'}
        </button>
        {analysisResult && (
          <div style={{marginTop: '20px'}}>
            <h4>AI Analysis Result (Markdown):</h4>
            <textarea readOnly value={analysisResult} style={{width: '100%', minHeight: '200px', boxSizing: 'border-box', marginTop: '10px'}} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h4>Step 4: Generate Presentation</h4>
        <button onClick={handleGeneratePresentation} disabled={!analysisResult} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#198754', color: 'white', border: 'none' }}>
          Generate Presentation from Analysis
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <h3 style={{ marginTop: '40px' }}>Extracted Frames Preview:</h3>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        minHeight: '100px',
        backgroundColor: '#f9f9f9'
      }}>
        {isLoading && <p>Processing video...</p>}
        {!isLoading && frames.length === 0 && <p>No frames extracted yet.</p>}
        {frames.map((frame, index) => (
          <img key={index} src={frame} alt={`Frame ${index}`} style={{ width: '150px', border: '1px solid #ccc', borderRadius: '4px' }} />
        ))}
      </div>
    </div>
  );
};
