import React, { useState, useEffect } from 'react';
import './ActivityNote.css';
import leafIcon from '../../assets/image/leaf.png';
import checkIcon from '../../assets/image/check.png';
import folderIcon from "../../assets/image/flag.png";

// ⭐ 활동 목록 조회 API
const fetchActivities = async () => {
  const access = localStorage.getItem('access');
  
  const response = await fetch('/api/activities/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('활동 목록 조회 실패');
  }

  return response.json();
};

// ⭐ 날짜별 경험 노트 조회 API
const fetchNoteByDate = async (date) => {
  const access = localStorage.getItem('access');
  
  const response = await fetch(`/api/dashboard/notes/?date=${date}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // 해당 날짜에 노트 없음
    }
    throw new Error('경험 노트 조회 실패');
  }

  return response.json();
};

// ⭐ 경험 노트 저장(Upsert) API
const saveNote = async (noteData) => {
  const access = localStorage.getItem('access');
  
  const response = await fetch('/api/dashboard/notes/', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    throw new Error('경험 노트 저장 실패');
  }

  return response.json();
};

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ActivityNote = ({ isPanelCollapsed }) => {
  const [selectedActivity, setSelectedActivity] = useState(null); // { id, title }
  const [activityNote, setActivityNote] = useState('');
  const [savedActivityNote, setSavedActivityNote] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [todayNote, setTodayNote] = useState(null);

  // ⭐ 활동 목록 및 오늘 날짜 노트 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 활동 목록 로드
        const activitiesData = await fetchActivities();
        setActivities(activitiesData || []);

        // 오늘 날짜 노트 로드
        const today = getTodayDate();
        const noteData = await fetchNoteByDate(today);
        
        if (noteData && noteData.note) {
          setTodayNote(noteData.note);
          setActivityNote(noteData.note.content || '');
          
          // 해당 활동 선택
          if (noteData.note.activity_id) {
            const matchedActivity = activitiesData.find(
              act => act.id === noteData.note.activity_id
            );
            if (matchedActivity) {
              setSelectedActivity({
                id: matchedActivity.id,
                title: matchedActivity.title
              });
            }
          }
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ⭐ 경험 노트 저장
  const handleSaveActivityNote = async () => {
    if (!activityNote.trim() || !selectedActivity) return;

    setSaving(true);
    try {
      const noteData = {
        date: getTodayDate(),
        content: activityNote.trim(),
        activity_id: selectedActivity.id,
        project_id: null
      };

      const savedNote = await saveNote(noteData);
      setTodayNote(savedNote);
      setSavedActivityNote(activityNote);
      
      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setSavedActivityNote('');
      }, 3000);
    } catch (error) {
      console.error('경험 노트 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !saving) {
      handleSaveActivityNote();
    }
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity({
      id: activity.id,
      title: activity.title
    });
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
            disabled={loading}
          >
            <span className={selectedActivity ? 'selected' : 'placeholder'}>
              {loading 
                ? '로딩 중...' 
                : selectedActivity 
                  ? selectedActivity.title 
                  : '경험을 선택하세요'
              }
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.9863 9.61287C15.9577 9.4249 15.8852 9.2361 15.7538 9.12137L12.3261 6.12576C12.1347 5.95808 11.8753 5.95808 11.684 6.12576L8.25626 9.12137C7.99347 9.35083 7.92036 9.83043 8.09517 10.1746C8.27055 10.5187 8.63618 10.6146 8.8984 10.3852L12.005 7.67045L15.1117 10.3852C15.3739 10.6146 15.7395 10.5187 15.9149 10.1746C16.0023 10.0025 16.0149 9.80085 15.9863 9.61287ZM15.9863 14.3871C16.0149 14.1992 16.0023 13.9975 15.9149 13.8254C15.7395 13.4813 15.3739 13.3854 15.1117 13.6148L12.005 16.3296L8.8984 13.6148C8.63618 13.3854 8.27055 13.4813 8.09517 13.8254C7.92036 14.1696 7.99347 14.6492 8.25626 14.8786L11.684 17.8742C11.8753 18.0419 12.1347 18.0419 12.3261 17.8742L15.7538 14.8786C15.8852 14.7639 15.9577 14.575 15.9863 14.3871Z" fill="#777777"/>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {activities.length === 0 ? (
                <div className="dropdown-item disabled">
                  등록된 경험이 없습니다
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`dropdown-item ${selectedActivity?.id === activity.id ? 'active' : ''}`}
                    onClick={() => handleActivitySelect(activity)}
                  >
                    {activity.title}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="activityNote-content">
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
          />
          <input
            type="text"
            className="activityNote-input"
            placeholder="이번 작업은 어떤 고민에서 시작됐나요?"
            value={activityNote}
            onChange={(e) => setActivityNote(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!selectedActivity || saving}
          />

          <button 
            className="check-button2"
            onClick={handleSaveActivityNote}
            disabled={!activityNote.trim() || !selectedActivity || saving}
          >
            {saving ? (
              <span className="saving-spinner">...</span>
            ) : (
              <img 
                src={checkIcon}
                alt="저장" 
                className="check-icon"
              />
            )}
          </button>
        </div>

        {savedActivityNote && (
          <div className="saved-activityNote-message">
            경험 노트가 저장되었습니다! 🎯
          </div>
        )}

        {/* 오늘 저장된 노트 정보 표시 */}
        {todayNote && !savedActivityNote && (
          <div className="today-note-info">
            마지막 수정: {new Date(todayNote.updated_at).toLocaleString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityNote;