/**
 * SahAI Premium Sidepanel Implementation
 * Adobe XD Style • 80% Results • 20% Footer
 *
 * This is a React component example showing the premium layout structure
 * Ready to be integrated into your existing codebase
 */

import React, { useState } from 'react';
import './premium-sidepanel.css';

interface PromptItem {
  id: string;
  number: number;
  platform: string;
  text: string;
  charCount: number;
  timeAgo: string;
}

interface PremiumSidepanelProps {
  prompts: PromptItem[];
  isLoading?: boolean;
  mode?: 'extract' | 'summarize';
  onExtractAll?: () => void;
}

/**
 * Main Component
 */
export const PremiumSidepanel: React.FC<PremiumSidepanelProps> = ({
  prompts = [],
  isLoading = false,
  mode = 'extract',
  onExtractAll,
}) => {
  const [currentMode, setCurrentMode] = useState<'extract' | 'summarize'>(mode);

  return (
    <div className="sidepanel-frame">
      {/* 80% Results Area */}
      <div className="results-area">
        <div className="results-content">
          {/* Floating Toggle (Sticky) */}
          <div className="floating-toggle">
            <button
              className={`toggle-btn ${currentMode === 'extract' ? 'active' : ''}`}
              onClick={() => setCurrentMode('extract')}
            >
              ✨ Extract
            </button>
            <button
              className={`toggle-btn ${currentMode === 'summarize' ? 'active' : ''}`}
              onClick={() => setCurrentMode('summarize')}
            >
              📊 Summarize
            </button>
          </div>

          {/* Results List or Empty State */}
          {prompts.length === 0 && !isLoading ? (
            <EmptyState />
          ) : isLoading ? (
            <LoadingState />
          ) : (
            <ResultsList prompts={prompts} mode={currentMode} />
          )}
        </div>
      </div>

      {/* 20% Footer Area */}
      <div className="footer-area">
        <button
          className="primary-btn"
          onClick={onExtractAll}
          disabled={prompts.length === 0 || isLoading}
        >
          <span className="footer-icon">⬇️</span>
          {isLoading ? 'Extracting...' : 'Extract All'}
        </button>
      </div>
    </div>
  );
};

/**
 * Results List Component
 */
interface ResultsListProps {
  prompts: PromptItem[];
  mode: 'extract' | 'summarize';
}

const ResultsList: React.FC<ResultsListProps> = ({ prompts, mode }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="results-list">
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className={`result-item ${mode === 'summarize' ? 'summarize-mode' : 'extract-mode'}`}
          onClick={() => setSelectedId(prompt.id)}
        >
          <div className="result-header">
            <span className="result-number">#{prompt.number}</span>
            <span className="result-platform">{prompt.platform}</span>
          </div>

          <div className="result-text">
            {mode === 'summarize'
              ? `Summary: ${prompt.text.substring(0, 80)}...`
              : prompt.text}
          </div>

          <div className="result-meta">
            <span>{prompt.charCount}k chars</span>
            <span className="result-meta-dot"></span>
            <span>{prompt.timeAgo}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Empty State Component
 */
const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon">💬</div>
      <div className="empty-title">No prompts yet</div>
      <div className="empty-text">
        Start a conversation on ChatGPT, Claude, or Gemini to begin
      </div>
    </div>
  );
};

/**
 * Loading State Component
 */
const LoadingState: React.FC = () => {
  return (
    <div className="results-list">
      {[1, 2, 3].map((i) => (
        <div key={i} className="result-item skeleton"></div>
      ))}
    </div>
  );
};

/**
 * Detail Modal Component (For Full Prompt View)
 */
interface DetailModalProps {
  prompt: PromptItem;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  prompt,
  isOpen,
  onClose,
  onCopy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-label">Prompt #{prompt.number}</div>
            <div className="modal-title">{prompt.text.substring(0, 40)}...</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p>{prompt.text}</p>
        </div>

        <div className="modal-meta">
          {prompt.platform} • {prompt.charCount}k chars • {prompt.timeAgo}
        </div>

        <div className="modal-footer">
          <button className="primary-btn" onClick={onCopy}>
            ✓ Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumSidepanel;
