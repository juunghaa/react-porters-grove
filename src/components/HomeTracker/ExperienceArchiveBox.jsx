import React, { useState, useEffect } from 'react';
import SubActivityCard from './SubActivityCard';
import './ExperienceArchiveBox.css';

// ⭐ 세부활동 목록 API
const fetchSubActivities = async (activityId) => {
  const access = localStorage.getItem('access');
  
  const response = await fetch(`/api/activities/${activityId}/sub-activities/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('세부활동 목록 조회 실패');
  }

  return response.json();
};

const ExperienceArchiveBox = ({ activity, isPanelCollapsed, onGoToEditor }) => {
  const [subActivities, setSubActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  // 세부활동 로드
  useEffect(() => {
    const loadSubActivities = async () => {
      if (!activity?.id) return;
      
      try {
        // API에서 sub_activities가 이미 포함되어 있으면 그것 사용
        if (activity.sub_activities && activity.sub_activities.length > 0) {
          setSubActivities(activity.sub_activities);
        } else {
          const data = await fetchSubActivities(activity.id);
          setSubActivities(data || []);
        }
      } catch (error) {
        console.error('세부활동 로딩 실패:', error);
        setSubActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubActivities();
  }, [activity]);

  // 태그 표시 (category나 primary_tag에서)
  const getTagLabel = () => {
    if (activity.category?.name) return activity.category.name;
    if (activity.primary_tags && activity.primary_tags.length > 0) {
      return activity.primary_tags[0].name;
    }
    // 기본 태그
    return '경험';
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    if (onGoToEditor) {
      onGoToEditor();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!activity) return null;

  return (
    <div className={`experience-archive-box ${isPanelCollapsed ? 'expanded' : ''}`}>
      {/* 헤더 */}
      <div className="archive-box-header" onClick={toggleExpand}>
        <div className="archive-box-left">
          {/* 태그 */}
          <span className="archive-box-tag">{getTagLabel()}</span>
          {/* 제목 */}
          <h3 className="archive-box-title">{activity.title}</h3>
        </div>
        
        <div className="archive-box-right">
          {/* 세부활동 개수 */}
          <span className="archive-box-count">{subActivities.length}</span>
          
          {/* 더보기 버튼 */}
          <button className="archive-box-more-btn" onClick={handleMoreClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="#666666"/>
            </svg>
          </button>

          {/* 펼침/접힘 아이콘 */}
          <button className="archive-box-toggle-btn" onClick={toggleExpand}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 세부활동 카드 리스트 */}
      {isExpanded && (
        <div className="archive-box-content">
          {loading ? (
            <div className="archive-loading">로딩 중...</div>
          ) : subActivities.length === 0 ? (
            <div className="archive-empty">
              <p>아직 세부 활동이 없어요</p>
              <button className="add-sub-activity-btn" onClick={handleMoreClick}>
                + 세부 활동 추가하기
              </button>
            </div>
          ) : (
            <div className="sub-activity-list">
              {subActivities.map((subActivity) => (
                <SubActivityCard
                  key={subActivity.id}
                  subActivity={subActivity}
                  activityTitle={activity.title}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceArchiveBox;