import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// ⭐ HomeTracker 폴더 안에 모두 있음
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
import './ArchivePage.css';

// ⭐ 활동 목록 API
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

const ArchivePage = ({ isPanelCollapsed, onGoToChooseOption }) => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('all');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [experiences, setExperiences] = useState({
    ongoing: [],
    spec: [],
    completed: []
  });

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
        const activitiesArray = Array.isArray(data) ? data : (data.results || []);
        setActivities(activitiesArray);
        
        setExperiences(prev => ({
          ...prev,
          ongoing: activitiesArray
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

    const timer = setTimeout(updateScrollState, 100);
    container.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [activities, activeTab]);

  // ⭐ 스크롤바 핸들러
  const handleScrollbarClick = (e) => {
    const scrollbar = e.currentTarget;
    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = scrollbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollbarWidth = rect.width;
    
    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    const thumbWidth = Math.max((clientWidth / scrollWidth) * scrollbarWidth, 50);
    const scrollableTrackWidth = scrollbarWidth - thumbWidth;
    const clickRatio = Math.max(0, Math.min(1, (clickX - thumbWidth / 2) / scrollableTrackWidth));
    
    container.scrollLeft = clickRatio * maxScroll;
  };

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

  const showScrollbar = activities.length > 4 && scrollState.scrollWidth > scrollState.clientWidth;
  
  const getListClassName = () => {
    if (activities.length <= 4) {
      return 'archive-list no-scroll';
    }
    return 'archive-list has-scroll';
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
      emptyText: '아직 완료된 포트폴리오가 없어요',
      subText: '포트폴리오를 만들어보세요',
      buttonText: '포트폴리오 만들기'
    }
  };

  const tabs = [
    { id: 'all', label: '전체', count: experiences.ongoing.length + experiences.spec.length + experiences.completed.length },
    { id: 'ongoing', label: '나의 경험', count: activities.length },
    { id: 'spec', label: '나의 스펙', count: experiences.spec.length },
    { id: 'completed', label: '나의 포트폴리오', count: experiences.completed.length },
  ];

  const handleMenuClick = (type) => {
    console.log(`${type} 메뉴 클릭`);
  };

  const handleGoToExperienceEditor = (activityId) => {
    console.log('경험 에디터로 이동:', activityId);
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

  const getVisibleBoxTypes = () => {
    if (activeTab === 'all') {
      return ['ongoing', 'spec', 'completed'];
    }
    return [activeTab];
  };

  // ⭐ 나의 경험 탭 콘텐츠 렌더링
  const renderExperienceTab = () => {
    if (loading) {
      return <div className="archive-loading">로딩 중...</div>;
    }

    if (activities.length === 0) {
      return (
        <div className="archive-boxes">
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
      <div className="archive-experience-wrapper">
        {showScrollbar && (
          <div 
            className="archive-scrollbar-track"
            onClick={handleScrollbarClick}
          >
            <div 
              className="archive-scrollbar-thumb"
              style={getThumbStyle()}
              onMouseDown={handleThumbMouseDown}
            />
          </div>
        )}
        
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
    <div className="archive-page">
      {/* 페이지 헤더 */}
      <div className="archive-header">
        <h1 className="archive-title">아카이브</h1>
        <p className="archive-subtitle">나의 모든 경험과 스펙, 포트폴리오를 한눈에 확인하세요</p>
      </div>

      {/* 탭 영역 */}
      <div className="archive-tabs">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            className={`archive-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span className="archive-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="archive-content">
        {activeTab === 'ongoing' ? (
          renderExperienceTab()
        ) : activeTab === 'spec' ? (
          <SpecTabContent onGoToChooseOption={onGoToChooseOption} />
        ) : activeTab === 'completed' ? (
          <PortfolioTabContent onGoToChooseOption={onGoToChooseOption} />
        ) : (
          <div className="archive-boxes">
            {getVisibleBoxTypes().map((type) => renderBox(type))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;