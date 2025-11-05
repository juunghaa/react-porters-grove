import React, { useState } from 'react';
import './ActivityNote.css';
import leafIcon from '../../assets/image/leaf.png';
import checkIcon from '../../assets/image/check.png';

const ActivityNote = ({ isPanelCollapsed }) => {
  const [activityNote, setActivityNote] = useState('');
  const [savedActivityNote, setSavedActivityNote] = useState('');

  const handleSaveActivityNote = () => {
    if (activityNote.trim()) {
      setSavedActivityNote(activityNote);
      // 여기에 실제 저장 로직을 추가할 수 있습니다 (예: API 호출)
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveActivityNote();
    }
  };

  return (
    <div className={`activityNote-status ${isPanelCollapsed ? 'expanded' : ''}`}>
      <div className="activityNote-header">
        <h2 className="activityNote-title">진행 중인 경험 노트</h2>
        <p className="activityNote-subtext">오늘의 진행 상황이나 간단한 메모를 남겨보세요</p>
      </div>

      <div className="activityNote-content">
        <div className="activityNote-question">
          <img 
            src={leafIcon} 
            alt="나뭇잎" 
            className="leaf-icon"
          />
          <span className="question-text">올해 꼭 이루고 싶은 목표는?</span>
        </div>

        <div className="activityNote-input-wrapper">
          <input
            type="text"
            className="activityNote-input"
            placeholder="내용을 입력하세요"
            value={activityNote}
            onChange={(e) => setActivityNote(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="check-button"
            onClick={handleSaveActivityNote}
            disabled={!activityNote.trim()}
          >
            <img 
              src={checkIcon}
              alt="저장" 
              className="check-icon"
            />
          </button>
        </div>

        {savedActivityNote && (
          <div className="saved-activityNote-message">
            목표가 저장되었습니다! 🎯
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityNote;