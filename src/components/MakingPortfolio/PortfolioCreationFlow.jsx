import React, { useState } from 'react';
import MakingPortfolio from './MakingPortfolio';
import MakingPortfolioNext from './MakingPortfolioNext';

/**
 * 포트폴리오 생성 플로우를 관리하는 컨테이너 컴포넌트
 * 
 * Step 1: MakingPortfolio - 경험 선택
 * Step 2: MakingPortfolioNext - 포트폴리오 정보 입력 및 최종 확인
 */
const PortfolioCreationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Step 1에서 다음 단계로 이동
  const handleNextStep = (items) => {
    console.log('선택된 항목들:', items);
    setSelectedItems(items);
    setCurrentStep(2);
  };

  // Step 2에서 이전 단계로 이동
  const handleBackStep = () => {
    setCurrentStep(1);
  };

  // 포트폴리오 생성 완료
  const handleComplete = (portfolioData) => {
    console.log('포트폴리오 생성 완료:', portfolioData);
    // TODO: API 호출하여 포트폴리오 저장
    // 예: savePortfolio(portfolioData)
    
    // 완료 후 처리 (예: 포트폴리오 목록 페이지로 이동)
    alert('포트폴리오가 생성되었습니다!');
  };

  // 전체 플로우 취소
  const handleCancel = () => {
    console.log('포트폴리오 생성 취소');
    // TODO: 이전 페이지로 이동하거나 모달 닫기
  };

  return (
    <div>
      {currentStep === 1 && (
        <MakingPortfolio
          selectedTags={selectedTags}
          onCancel={handleCancel}
          onNext={handleNextStep}
        />
      )}
      
      {currentStep === 2 && (
        <MakingPortfolioNext
          selectedItems={selectedItems}
          onBack={handleBackStep}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default PortfolioCreationFlow;