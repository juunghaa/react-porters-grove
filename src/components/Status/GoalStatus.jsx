import React, { useState, useEffect } from 'react';
import './GoalStatus.css';
import leafIcon from '../../assets/image/leaf.png';
import checkIcon from '../../assets/image/check.png';

const GoalStatus = ({ isPanelCollapsed }) => {
  const [goal, setGoal] = useState('');
  const [savedGoal, setSavedGoal] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // 기존 목표 불러오기
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const access = localStorage.getItem('access');
        const response = await fetch('/api/dashboard/goal/', {
          headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            setGoal(data.content);
            setSavedGoal(data.content);
            setIsCompleted(data.is_completed || false);
          }
        }
      } catch (error) {
        console.error('목표 불러오기 실패:', error);
      }
    };

    fetchGoal();
  }, []);

  // 목표 저장 API 호출
  const saveGoal = async (content, completed = false) => {
    const access = localStorage.getItem('access');
    
    const response = await fetch('/api/dashboard/goal/', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        is_completed: completed,
      }),
    });

    if (!response.ok) {
      throw new Error('목표 저장에 실패했습니다.');
    }

    return response.json();
  };

  // 저장 버튼 클릭
  const handleSaveGoal = async () => {
    if (!goal.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const result = await saveGoal(goal.trim(), isCompleted);
      console.log('✅ 목표 저장 성공:', result);
      
      setSavedGoal(goal.trim());
      setShowMessage(true);
      
      // 3초 후 메시지 숨김
      setTimeout(() => setShowMessage(false), 3000);
      
    } catch (error) {
      console.error('❌ 목표 저장 실패:', error);
      alert('목표 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 완료 토글
  const handleToggleComplete = async () => {
    if (!savedGoal || isLoading) return;

    setIsLoading(true);

    try {
      const newCompleted = !isCompleted;
      await saveGoal(savedGoal, newCompleted);
      setIsCompleted(newCompleted);
      console.log('✅ 완료 상태 변경:', newCompleted);
    } catch (error) {
      console.error('❌ 완료 상태 변경 실패:', error);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
          <button 
            className="check-button"
            onClick={handleSaveGoal}
            disabled={!goal.trim() || isLoading}
          >
            <img 
              src={checkIcon}
              alt="저장" 
              className="check-icon"
            />
          </button>
        </div>

        {/* 저장된 목표가 있으면 완료 체크박스 표시 */}
        {savedGoal && (
          <div className="saved-goal-section">
            <label className="complete-label">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleToggleComplete}
                disabled={isLoading}
              />
              <span className={isCompleted ? 'completed' : ''}>
                {isCompleted ? '목표 달성! 🎉' : '목표 달성하기'}
              </span>
            </label>
          </div>
        )}

        {showMessage && (
          <div className="saved-goal-message">
            목표가 저장되었습니다! 🎯
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalStatus;