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
  // 임시 경험 데이터 (나중에 실제 데이터로 교체)
  // const [experiences, setExperiences] = useState({
  //   ongoing: [], // 진행 중인 경험 배열
  //   spec: [],    // 주요 스펙 배열
  //   completed: [] // 완료된 경험 배열
  // });
  // experiences state에 임시 데이터 추가
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
  
  // 각 박스 타입별 설정
  const boxConfigs = {
    ongoing: {
      titleIcon: greenFlag,
      title: '진행 중인 경험',
      count: experiences.ongoing.length,
      emptyIcon: grayFlag,
      emptyText: '아직 정리된 경험이 없어요',
      subText: '지금 바로 경험을 등록해보세요',
      buttonText: '경험 추가하기'
    },
    spec: {
      titleIcon: greenLight,
      title: '주요 스펙',
      count: experiences.spec.length,
      emptyIcon: grayLight,
      emptyText: '아직 정리된 스펙이 없어요',
      subText: '지금 바로 내 역량을 기록해보세요',
      buttonText: '스펙 추가하기'
    },
    completed: {
      titleIcon: greenCheck,
      title: '완료된 경험',
      count: experiences.completed.length,
      emptyIcon: grayCheck,
      emptyText: '아직 완료된 경험이 없어요',
      subText: '끝난 프로젝트를 기록해보세요',
      buttonText: '완료된 경험 추가하기'
    }
  };

  const handleMenuClick = (type) => {
    console.log(`${type} 메뉴 클릭`);
  };

  // 박스 렌더링 함수 (경험 있으면 FullBox, 없으면 EmptyBox)
  const renderBox = (type) => {
    const hasExperiences = experiences[type].length > 0;
    
    if (hasExperiences) {
      return (
        <FullBox
          key={type}
          isPanelCollapsed={isPanelCollapsed}
          config={boxConfigs[type]}
          experienceData={experiences[type][0]} // 첫 번째 경험 표시 (나중에 리스트로 변경 가능)
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

  return (
    <div className="home-tracker">
      <div className="tracker-tabs">
        <button className="tab active">
          모든 경험 <span>{experiences.ongoing.length + experiences.spec.length + experiences.completed.length}</span>
        </button>
        <button className="tab">
          진행 중인 경험 <span>{experiences.ongoing.length}</span>
        </button>
        <button className="tab">
          주요 스펙 <span>{experiences.spec.length}</span>
        </button>
        <button className="tab">
          완료된 경험 <span>{experiences.completed.length}</span>
        </button>
      </div>

      <div className="tracker-boxes">
        {renderBox('ongoing')}
        {renderBox('spec')}
        {renderBox('completed')}
      </div>
    </div>
  );
};

export default HomeTracker;