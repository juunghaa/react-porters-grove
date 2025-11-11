import React, { useState } from 'react';
import './ActivityNote.css';
import leafIcon from '../../assets/image/leaf.png';
import checkIcon from '../../assets/image/check.png';
import folderIcon from "../../assets/image/flag.png";

const ActivityNote = ({ isPanelCollapsed }) => {
  const [selectedExperience, setSelectedExperience] = useState('');
  const [activityNote, setActivityNote] = useState('');
  const [savedActivityNote, setSavedActivityNote] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 경험 목록 (실제로는 API에서 가져올 수 있음)
  const experiences = [
    '프로젝트 A',
    '프로젝트 B',
    '스터디 그룹',
    '개인 학습',
    '팀 협업'
  ];

  const handleSaveActivityNote = () => {
    if (activityNote.trim() && selectedExperience) {
      setSavedActivityNote(activityNote);
      // 여기에 실제 저장 로직을 추가할 수 있습니다 (예: API 호출)
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveActivityNote();
    }
  };

  const handleExperienceSelect = (experience) => {
    setSelectedExperience(experience);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`activityNote-status ${isPanelCollapsed ? 'expanded' : ''}`}>
      <div className="activityNote-header">
        <h2 className="activityNote-title">진행 중인 경험 노트</h2>
        <p className="activityNote-subtext">오늘의 진행 상황이나 간단한 메모를 남겨보세요</p>
      </div>

      {/* 경험 선택 드롭다운 */}
      <div className="experience-selector">
          <img 
            src={folderIcon} 
            alt="폴더" 
            className="folder-icon"
          />
          <div className="dropdown-wrapper">
            <button 
              className="dropdown-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className={selectedExperience ? 'selected' : 'placeholder'}>
                {selectedExperience || '경험을 선택하세요'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15.9863 9.61287C15.9577 9.4249 15.8852 9.2361 15.7538 9.12137L12.3261 6.12576C12.1347 5.95808 11.8753 5.95808 11.684 6.12576L8.25626 9.12137C7.99347 9.35083 7.92036 9.83043 8.09517 10.1746C8.27055 10.5187 8.63618 10.6146 8.8984 10.3852L12.005 7.67045L15.1117 10.3852C15.3739 10.6146 15.7395 10.5187 15.9149 10.1746C16.0023 10.0025 16.0149 9.80085 15.9863 9.61287ZM15.9863 14.3871C16.0149 14.1992 16.0023 13.9975 15.9149 13.8254C15.7395 13.4813 15.3739 13.3854 15.1117 13.6148L12.005 16.3296L8.8984 13.6148C8.63618 13.3854 8.27055 13.4813 8.09517 13.8254C7.92036 14.1696 7.99347 14.6492 8.25626 14.8786L11.684 17.8742C11.8753 18.0419 12.1347 18.0419 12.3261 17.8742L15.7538 14.8786C15.8852 14.7639 15.9577 14.575 15.9863 14.3871Z" fill="#777777"/>
                </svg>

            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {experiences.map((experience, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleExperienceSelect(experience)}
                  >
                    {experience}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      <div className="activityNote-content">
        
        {/* 내용 입력 */}
        {/* <div className="activityNote-question">
          <img 
            src={leafIcon} 
            alt="나뭇잎" 
            className="leaf-icon"
          />
          <span className="question-text">내용을 입력하세요</span>
        </div> */}
        <div className="timestamp">
            {new Date().toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
        </div>

        <div className="activityNote-input-wrapper">
        <img 
            src={leafIcon} 
            alt="나뭇잎" 
            className="leaf-icon"
          /><input
            type="text"
            className="activityNote-input"
            placeholder="내용을 입력하세요"
            value={activityNote}
            onChange={(e) => setActivityNote(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!selectedExperience}
          />

          <button 
            className="check-button"
            onClick={handleSaveActivityNote}
            disabled={!activityNote.trim() || !selectedExperience}
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
            경험 노트가 저장되었습니다! 🎯
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityNote;