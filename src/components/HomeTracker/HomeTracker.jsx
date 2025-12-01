import React, { useState } from 'react';
import EmptyBox from './EmptyBox';
import FullBox from './FullBox';
import greenFlag from './images/greenflag.png';
import greenLight from './images/greenlight.png';
import greenCheck from './images/greencheck.png';
import grayFlag from './images/grayflag.png';
import grayLight from './images/graylight.png';
import grayCheck from './images/graycheck.png';
import './HomeTracker.css';

const HomeTracker = ({isPanelCollapsed, onGoToChooseOption}) => {
  // ✅ 현재 선택된 탭 state 추가
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ongoing', 'spec', 'completed'
  
  const [experiences, setExperiences] = useState({
    ongoing: [{
      tag: '해커톤',
      role: '구름톤14기',
      title: '제주 프라이빗 스팟 앱 개발',
      teamType: '팀',
      subject: '구름톤14기',
      roleDetail: '팀장',
      startDate: '2025.06'
    }],
    spec: [],
    completed: []
  });
  
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

  // ✅ 탭 데이터 정의
  const tabs = [
    { id: 'all', label: '전체', count: experiences.ongoing.length + experiences.spec.length + experiences.completed.length },
    { id: 'ongoing', label: '나의 경험', count: experiences.ongoing.length },
    { id: 'spec', label: '나의 스펙', count: experiences.spec.length },
    { id: 'completed', label: '나의 포트폴리오', count: experiences.completed.length },
  ];

  const handleMenuClick = (type) => {
    console.log(`${type} 메뉴 클릭`);
  };

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

  // ✅ 선택된 탭에 따라 보여줄 박스 결정
  const getVisibleBoxTypes = () => {
    if (activeTab === 'all') {
      return ['ongoing', 'spec', 'completed'];
    }
    return [activeTab]; // 선택된 탭만 보여줌
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

      <div className="tracker-boxes">
        {getVisibleBoxTypes().map((type) => renderBox(type))}
      </div>
    </div>
  );
};

export default HomeTracker;