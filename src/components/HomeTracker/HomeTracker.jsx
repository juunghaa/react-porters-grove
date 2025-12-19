import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyBox from './EmptyBox';
import FullBox from './FullBox';
import ExperienceArchiveBox from './ExperienceArchiveBox';
import SpecTabContent from './SpecTabContent';
import PortfolioTabContent from './PortfolioTabContent';
import greenFlag from './images/greenflag.png';
import greenLight from './images/greenlight.png';
import greenCheck from './images/greencheck.png';
import grayFlag from './images/grayflag.png';
import grayLight from './images/graylight.png';
import grayCheck from './images/graycheck.png';
import './HomeTracker.css';

// ⭐ 활동 목록 API (api.js에 추가 필요)
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

const HomeTracker = ({ isPanelCollapsed, onGoToChooseOption }) => {
  const navigate = useNavigate();
  
  // 현재 선택된 탭
  const [activeTab, setActiveTab] = useState('all');
  
  // 활동 데이터 (API에서 로드)
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 기존 experiences 상태 (전체 탭용)
  const [experiences, setExperiences] = useState({
    ongoing: [],
    spec: [],
    completed: []
  });

  // ⭐ 스크롤 관련 ref와 state
  const scrollContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0
  });

  // ⭐ 활동 데이터 로드
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchActivities();
        setActivities(data || []);
        
        // 전체 탭용 experiences도 업데이트
        setExperiences(prev => ({
          ...prev,
          ongoing: data || []
        }));
      } catch (error) {
        console.error('활동 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  // ⭐ 스크롤 상태 업데이트
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      setScrollState({
        scrollLeft: container.scrollLeft,
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth
      });
    };

    // 초기 상태 및 리사이즈 시 업데이트
    const timer = setTimeout(updateScrollState, 100);
    container.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [activities, activeTab]);

  // ⭐ 커스텀 스크롤바 드래그 핸들러
  const handleScrollbarClick = (e) => {
    const scrollbar = e.currentTarget;
    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = scrollbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollbarWidth = rect.width;
    
    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    
    // 썸 너비 계산
    const thumbWidth = Math.max((clientWidth / scrollWidth) * scrollbarWidth, 50);
    
    // 클릭 위치를 스크롤 위치로 변환
    const scrollableTrackWidth = scrollbarWidth - thumbWidth;
    const clickRatio = Math.max(0, Math.min(1, (clickX - thumbWidth / 2) / scrollableTrackWidth));
    
    container.scrollLeft = clickRatio * maxScroll;
  };

  // ⭐ 썸 드래그 핸들러
  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = scrollContainerRef.current;
    const scrollbar = e.currentTarget.parentElement;
    if (!container || !scrollbar) return;

    const startX = e.clientX;
    const startScrollLeft = container.scrollLeft;
    const scrollbarRect = scrollbar.getBoundingClientRect();
    const scrollbarWidth = scrollbarRect.width;
    
    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    const thumbWidth = Math.max((clientWidth / scrollWidth) * scrollbarWidth, 50);
    const scrollableTrackWidth = scrollbarWidth - thumbWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const scrollDelta = (deltaX / scrollableTrackWidth) * maxScroll;
      container.scrollLeft = Math.max(0, Math.min(maxScroll, startScrollLeft + scrollDelta));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // ⭐ 스크롤바 썸 위치 및 너비 계산
  const getThumbStyle = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollState;
    
    if (scrollWidth <= clientWidth) {
      return { display: 'none' };
    }

    const thumbWidthPercent = Math.max((clientWidth / scrollWidth) * 100, 10);
    const maxScrollLeft = scrollWidth - clientWidth;
    const scrollPercent = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
    const thumbLeftPercent = scrollPercent * (100 - thumbWidthPercent);

    return {
      width: `${thumbWidthPercent}%`,
      left: `${thumbLeftPercent}%`
    };
  };

  // ⭐ 스크롤바 표시 여부 (4개 이상일 때만)
  const showScrollbar = activities.length > 3 && scrollState.scrollWidth > scrollState.clientWidth;
  
  // ⭐ 박스 개수에 따른 클래스 결정
  const getListClassName = () => {
    if (activities.length <= 3) {
      return 'experience-archive-list no-scroll'; // 균등 분배
    }
    return 'experience-archive-list has-scroll'; // 고정 너비 + 스크롤
  };

  const boxConfigs = {
    ongoing: {
      titleIcon: greenFlag,
      title: '나의 경험',
      count: experiences.ongoing.length,
      emptyIcon: grayFlag,
      emptyText: '아직 정리된 경험이 없어요',
      subText: '지금 바로 경험을 등록해보세요',
      buttonText: '경험 추가하기'
    },
    spec: {
      titleIcon: greenLight,
      title: '나의 스펙',
      count: experiences.spec.length,
      emptyIcon: grayLight,
      emptyText: '아직 정리된 스펙이 없어요',
      subText: '지금 바로 내 역량을 기록해보세요',
      buttonText: '스펙 추가하기'
    },
    completed: {
      titleIcon: greenCheck,
      title: '나의 포트폴리오',
      count: experiences.completed.length,
      emptyIcon: grayCheck,
      emptyText: '아직 완료된 경험이 없어요',
      subText: '끝난 프로젝트를 기록해보세요',
      buttonText: '완료된 경험 추가하기'
    }
  };

  // 탭 데이터 정의
  const tabs = [
    { id: 'all', label: '전체', count: experiences.ongoing.length + experiences.spec.length + experiences.completed.length },
    { id: 'ongoing', label: '나의 경험', count: activities.length },
    { id: 'spec', label: '나의 스펙', count: experiences.spec.length },
    { id: 'completed', label: '나의 포트폴리오', count: experiences.completed.length },
  ];

  const handleMenuClick = (type) => {
    console.log(`${type} 메뉴 클릭`);
  };

  // ⭐ 경험 에디터로 이동
  const handleGoToExperienceEditor = (activityId) => {
    console.log('경험 에디터로 이동:', activityId);
    // navigate(`/activity/${activityId}/edit`);
  };

  // 전체 탭용 박스 렌더링
  const renderBox = (type) => {
    const hasExperiences = experiences[type].length > 0;
    
    if (hasExperiences) {
      return (
        <FullBox
          key={type}
          isPanelCollapsed={isPanelCollapsed}
          config={boxConfigs[type]}
          experienceData={experiences[type][0]}
          onMenuClick={() => handleMenuClick(type)}
        />
      );
    } else {
      return (
        <EmptyBox
          key={type}
          isPanelCollapsed={isPanelCollapsed}
          config={boxConfigs[type]}
          onGoToChooseOption={onGoToChooseOption}
          onMenuClick={() => handleMenuClick(type)}
        />
      );
    }
  };

  // 선택된 탭에 따라 보여줄 박스 결정
  const getVisibleBoxTypes = () => {
    if (activeTab === 'all') {
      return ['ongoing', 'spec', 'completed'];
    }
    return [activeTab];
  };

  // ⭐ 나의 경험 탭 콘텐츠 렌더링
  const renderExperienceTab = () => {
    if (loading) {
      return <div className="loading-message">로딩 중...</div>;
    }

    if (activities.length === 0) {
      return (
        <div className="tracker-boxes">
          <EmptyBox
            isPanelCollapsed={isPanelCollapsed}
            config={boxConfigs.ongoing}
            onGoToChooseOption={onGoToChooseOption}
            onMenuClick={() => handleMenuClick('ongoing')}
          />
        </div>
      );
    }

    return (
      <div className="experience-archive-wrapper">
        {/* ⭐ 커스텀 스크롤바 - 박스 위에 위치 (4개 이상일 때만) */}
        {showScrollbar && (
          <div 
            className="custom-scrollbar-track"
            onClick={handleScrollbarClick}
          >
            <div 
              className="custom-scrollbar-thumb"
              style={getThumbStyle()}
              onMouseDown={handleThumbMouseDown}
            />
          </div>
        )}
        
        {/* ⭐ 박스 리스트 */}
        <div 
          className={getListClassName()}
          ref={scrollContainerRef}
        >
          {activities.map((activity) => (
            <ExperienceArchiveBox
              key={activity.id}
              activity={activity}
              isPanelCollapsed={isPanelCollapsed}
              onGoToEditor={() => handleGoToExperienceEditor(activity.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="home-tracker">
      <div className="tracker-tabs">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ⭐ 탭별 콘텐츠 렌더링 */}
      {activeTab === 'ongoing' ? (
        renderExperienceTab()
      ) : activeTab === 'spec' ? (
        <SpecTabContent onGoToChooseOption={onGoToChooseOption} />
      ) : activeTab === 'completed' ? (
        <PortfolioTabContent onGoToChooseOption={onGoToChooseOption} />
      ) : (
        <div className="tracker-boxes">
          {getVisibleBoxTypes().map((type) => renderBox(type))}
        </div>
      )}
    </div>
  );
};

export default HomeTracker;