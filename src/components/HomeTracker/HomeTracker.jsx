import React, { useState } from 'react';
import EmptyBox from './EmptyBox';
import greenFlag from './images/greenflag.png';
import greenLight from './images/greenlight.png';
import greenCheck from './images/greencheck.png';
import grayFlag from './images/grayflag.png';
import grayLight from './images/graylight.png';
import grayCheck from './images/graycheck.png';
import './HomeTracker.css';

const HomeTracker = () => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  
  // 각 박스 타입별 설정
  const boxConfigs = {
    ongoing: {
      titleIcon: greenFlag,  // 이미지로 변경
      title: '진행 중인 경험',
      count: 0,
      emptyIcon: grayFlag,
      emptyText: '아직 정리된 경험이 없어요',
      subText: '지금 바로 경험을 등록해보세요',
      buttonText: '경험 추가하기'
    },
    spec: {
      titleIcon: greenLight,  // 이미지로 변경
      title: '주요 스펙',
      count: 0,
      emptyIcon: grayLight,
      emptyText: '아직 정리된 스펙이 없어요',
      subText: '지금 바로 내 역량을 기록해보세요',
      buttonText: '스펙 추가하기'
    },
    completed: {
      titleIcon: greenCheck,  // 이미지로 변경
      title: '완료된 경험',
      count: 0,
      emptyIcon: grayCheck,
      emptyText: '아직 완료된 경험이 없어요',
      subText: '끝난 프로젝트를 기록해보세요',
      buttonText: '완료된 경험 추가하기'
    }
  };

  const handleAddExperience = (type) => {
    console.log(`${type} 추가하기`);
  };

  const handleMenuClick = (type) => {
    console.log(`${type} 메뉴 클릭`);
  };

  return (
    <div className="home-tracker">
      <div className="tracker-tabs">
        <button className="tab active">모든 경험 <span>0</span></button>
        <button className="tab">진행 중인 경험 <span>0</span></button>
        <button className="tab">주요 스펙 <span>0</span></button>
        <button className="tab">완료된 경험 <span>0</span></button>
      </div>

      <div className="tracker-boxes">
        <EmptyBox 
          isPanelCollapsed={isPanelCollapsed}
          config={boxConfigs.ongoing}
          onAdd={() => handleAddExperience('ongoing')}
          onMenuClick={() => handleMenuClick('ongoing')}
        />
        
        <EmptyBox 
          isPanelCollapsed={isPanelCollapsed}
          config={boxConfigs.spec}
          onAdd={() => handleAddExperience('spec')}
          onMenuClick={() => handleMenuClick('spec')}
        />
        
        <EmptyBox 
          isPanelCollapsed={isPanelCollapsed}
          config={boxConfigs.completed}
          onAdd={() => handleAddExperience('completed')}
          onMenuClick={() => handleMenuClick('completed')}
        />
      </div>
    </div>
  );
};

export default HomeTracker;