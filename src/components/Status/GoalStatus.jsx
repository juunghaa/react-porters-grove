import React, { useState } from 'react';
import './GoalStatus.css';
import leafIcon from '../../assets/image/leaf.png';
import checkIcon from '../../assets/image/check.png';

const GoalStatus = ({ isPanelCollapsed }) => {
  const [goal, setGoal] = useState('');
  const [savedGoal, setSavedGoal] = useState('');

  const handleSaveGoal = () => {
    if (goal.trim()) {
      setSavedGoal(goal);
      // 여기에 실제 저장 로직을 추가할 수 있습니다 (예: API 호출)
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveGoal();
    }
  };

  return (
    <div className={`goal-status ${isPanelCollapsed ? 'expanded' : ''}`}>
      <div className="goal-header">
        <h2 className="goal-title">목표 시각화</h2>
        <p className="goal-subtext">지금의 나를 돌아보고, 앞으로의 미래를 그려보세요</p>
      </div>

      <div className="goal-content">
        <div className="goal-question">
          <img 
            src={leafIcon} 
            alt="나뭇잎" 
            className="leaf-icon"
          />
          <span className="question-text">올해 꼭 이루고 싶은 목표는?</span>
        </div>

        <div className="goal-input-wrapper">
          <input
            type="text"
            className="goal-input"
            placeholder="한줄 목표를 적어보세요"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="check-button"
            onClick={handleSaveGoal}
            disabled={!goal.trim()}
          >
            <img 
              src={checkIcon}
              alt="저장" 
              className="check-icon"
            />
          </button>
        </div>

        {savedGoal && (
          <div className="saved-goal-message">
            목표가 저장되었습니다! 🎯
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalStatus;