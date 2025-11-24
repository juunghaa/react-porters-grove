import React, { useState } from 'react';
import MakingPortfolio from './MakingPortfolio';
import MakingPortfolioNext from './MakingPortfolioNext';
import MakingPortfolioFinal from './MakingPortfolioFinal';

/**
 * 포트폴리오 생성 플로우를 관리하는 컨테이너 컴포넌트
 * 
 * Step 1: MakingPortfolio - 경험 선택
 * Step 2: MakingPortfolioNext - 태그 선택
 * Step 3: MakingPortfolioFinal - 자기소개 작성
 */
const PortfolioCreationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // ===== Step 1 핸들러 =====
  
  // Step 1: 취소
  const handleStep1Cancel = () => {
    console.log('Step 1 - 포트폴리오 생성 취소');
    // TODO: 이전 페이지로 이동하거나 모달 닫기
    alert('포트폴리오 생성이 취소되었습니다.');
  };

  // Step 1 -> Step 2: 경험 선택 완료
  const handleStep1Next = (items) => {
    console.log('Step 1 완료 - 선택된 경험:', items);
    setSelectedItems(items);
    setCurrentStep(2);
  };

  // ===== Step 2 핸들러 =====
  
  // Step 2 -> Step 1: 이전으로
  const handleStep2Back = () => {
    console.log('Step 2 -> Step 1 이동');
    setCurrentStep(1);
  };

  // Step 2 -> Step 3: 태그 선택 완료 (⚠️ 여기가 중요!)
  const handleStep2Complete = (data) => {
    console.log('Step 2 완료 - 선택된 태그:', data.tags);
    setSelectedTags(data.tags);
    setCurrentStep(3);  // ⭐ Step 3으로 이동!
  };

  // ===== Step 3 핸들러 =====
  
  // Step 3 -> Step 2: 이전으로
  const handleStep3Back = () => {
    console.log('Step 3 -> Step 2 이동');
    setCurrentStep(2);
  };

  // Step 3: 최종 완료
  const handleStep3Complete = (portfolioData) => {
    console.log('=== 포트폴리오 생성 최종 완료 ===');
    console.log('전체 데이터:', portfolioData);
    
    // TODO: API 호출하여 포트폴리오 저장
    // 예: 
    // const response = await savePortfolio({
    //   experiences: portfolioData.selectedItems,
    //   tags: portfolioData.selectedTags,
    //   workStyle: portfolioData.workStyle,
    //   strengths: portfolioData.strengths
    // });
    
    alert('포트폴리오가 성공적으로 생성되었습니다!');
    
    // 완료 후 처리 (예: 포트폴리오 목록 페이지로 이동)
    // navigate('/portfolio');
  };

  return (
    <div>
      {currentStep === 1 && (
        <MakingPortfolio
          selectedTags={selectedTags}
          onCancel={handleStep1Cancel}
          onNext={handleStep1Next}
        />
      )}
      
      {currentStep === 2 && (
        <MakingPortfolioNext
          selectedItems={selectedItems}
          onBack={handleStep2Back}
          onComplete={handleStep2Complete}  
        />
      )}
      
      {currentStep === 3 && (
        <MakingPortfolioFinal
          selectedItems={selectedItems}
          selectedTags={selectedTags}
          onBack={handleStep3Back}
          onComplete={handleStep3Complete} 
        />
      )}
    </div>
  );
};

export default PortfolioCreationFlow;