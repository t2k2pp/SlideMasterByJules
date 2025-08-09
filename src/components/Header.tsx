import React from 'react';
import { Settings, Sparkles, Download } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAiAssistant: () => void;
  onOpenExportManager: () => void;
}

export const Header = ({ onOpenSettings, onOpenAiAssistant, onOpenExportManager }: HeaderProps) => {
  const headerStyle: React.CSSProperties = {
    height: '50px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    flexShrink: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 600,
    fontSize: '1.2rem',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const iconButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <header style={headerStyle}>
      <div style={titleStyle}>SlideMaster</div>
      <div style={actionsStyle}>
        <button
          onClick={onOpenExportManager}
          style={iconButtonStyle}
          title="Export"
        >
          <Download size={20} />
        </button>
        <button
          onClick={onOpenAiAssistant}
          style={iconButtonStyle}
          title="AI Assistant"
        >
          <Sparkles size={20} color="#4F46E5" />
        </button>
        <button
          onClick={onOpenSettings}
          style={iconButtonStyle}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
