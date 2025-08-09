import React from 'react';
import { FilePlus2, Bot, Film, Upload } from 'lucide-react';
import { Screen } from '../types';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
  // In the future, this will also take presentation templates or AI configs
}

export const WelcomeScreen = ({ onNavigate }: WelcomeScreenProps) => {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', color: '#333' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 600 }}>Welcome to SlideMaster</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '-10px', marginBottom: '50px' }}>
        Your AI-powered presentation assistant
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* Card for creating a new presentation */}
        <div
          style={cardStyle}
          onClick={() => onNavigate('editor')}
          onMouseOver={e => (e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow, e.currentTarget.style.transform = cardHoverStyle.transform)}
          onMouseOut={e => (e.currentTarget.style.boxShadow = cardStyle.boxShadow, e.currentTarget.style.transform = 'none')}
        >
          <FilePlus2 size={48} color="#4F46E5" />
          <h2 style={cardTitleStyle}>New Presentation</h2>
          <p style={cardTextStyle}>Start with a blank canvas.</p>
        </div>

        {/* Card for AI generation */}
        <div
          style={cardStyle}
          onMouseOver={e => (e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow, e.currentTarget.style.transform = cardHoverStyle.transform)}
          onMouseOut={e => (e.currentTarget.style.boxShadow = cardStyle.boxShadow, e.currentTarget.style.transform = 'none')}
        >
          <Bot size={48} color="#4F46E5" />
          <h2 style={cardTitleStyle}>Generate with AI</h2>
          <p style={cardTextStyle}>Let AI create a presentation from a topic.</p>
        </div>

        {/* Card for video analysis */}
        <div
          style={cardStyle}
          onClick={() => onNavigate('video_analysis')}
          onMouseOver={e => (e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow, e.currentTarget.style.transform = cardHoverStyle.transform)}
          onMouseOut={e => (e.currentTarget.style.boxShadow = cardStyle.boxShadow, e.currentTarget.style.transform = 'none')}
        >
          <Film size={48} color="#4F46E5" />
          <h2 style={cardTitleStyle}>Create from Video</h2>
          <p style={cardTextStyle}>Generate a manual from a video file.</p>
        </div>
      </div>

      <div style={{ marginTop: '60px', maxWidth: '800px', margin: '60px auto 0 auto' }}>
        <h2 style={{ textAlign: 'left', borderBottom: '1px solid #eee', paddingBottom: '10px', fontWeight: 500 }}>Recent Projects</h2>
        <div style={{ color: '#888', marginTop: '20px', padding: '40px', background: '#fafafa', borderRadius: '8px' }}>
          <p>No recent projects found.</p>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <button style={importButtonStyle}>
          <Upload size={16} style={{ marginRight: '8px' }} />
          Import Project (.zip)
        </button>
      </div>
    </div>
  );
};

// Some basic styles to make it look decent
const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  width: '220px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
};

const cardHoverStyle: React.CSSProperties = {
  transform: 'translateY(-5px)',
  boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  marginTop: '15px',
  fontWeight: 500,
};

const cardTextStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#555',
  lineHeight: 1.5,
};

const importButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '10px 20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer',
  background: '#f9f9f9',
  fontSize: '1rem',
  color: '#333',
  fontWeight: 500,
};
