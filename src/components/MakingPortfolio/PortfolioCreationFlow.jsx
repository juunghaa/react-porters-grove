import React, { useState } from 'react';
import MakingPortfolio from './MakingPortfolio';
import MakingPortfolioNext from './MakingPortfolioNext';
import MakingPortfolioFinal from './MakingPortfolioFinal';
import PortfolioViewer from '../PortfolioViewer/PortfolioViewer';

/**
 * 포트폴리오 생성 플로우를 관리하는 컨테이너 컴포넌트
 * 
 * Step 1: MakingPortfolio - 경험 선택
 * Step 2: MakingPortfolioNext - 태그 선택
 * Step 3: MakingPortfolioFinal - 자기소개 작성
 * Step 4: PortfolioViewer - 미리보기 및 저장
 */
const PortfolioCreationFlow = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [portfolioData, setPortfolioData] = useState(null);

  // ===== Step 1 핸들러 =====
  const handleStep1Cancel = () => {
    console.log('Step 1 - 포트폴리오 생성 취소');
    if (onClose) {
      onClose();
    }
  };

  const handleStep1Next = (items) => {
    console.log('Step 1 완료 - 선택된 경험:', items);
    setSelectedItems(items);
    setCurrentStep(2);
  };

  // ===== Step 2 핸들러 =====
  const handleStep2Back = () => {
    console.log('Step 2 -> Step 1 이동');
    setCurrentStep(1);
  };

  const handleStep2Complete = (data) => {
    console.log('Step 2 완료 - 선택된 태그:', data.tags);
    setSelectedTags(data.tags);
    setCurrentStep(3);
  };

  // ===== Step 3 핸들러 =====
  const handleStep3Back = () => {
    console.log('Step 3 -> Step 2 이동');
    setCurrentStep(2);
  };

  // ⭐ Step 3 완료 -> Step 4 (PortfolioViewer)로 이동
  const handleStep3Complete = (data) => {
    console.log('=== Step 3 완료 - PortfolioViewer로 이동 ===');
    
    // PortfolioViewer에 전달할 데이터 구조
    const viewerData = {
      selectedItems: data.selectedItems,
      selectedTags: data.selectedTags,
      workStyle: data.workStyle,
      strengths: data.strengths
    };
    
    console.log('PortfolioViewer 데이터:', viewerData);
    setPortfolioData(viewerData);
    setCurrentStep(4);
  };

  // ===== Step 4 핸들러 =====
  const handleViewerClose = () => {
    console.log('PortfolioViewer 닫기');
    // 처음으로 돌아가거나 닫기
    if (onClose) {
      onClose();
    } else {
      setCurrentStep(1);
      setSelectedItems([]);
      setSelectedTags([]);
      setPortfolioData(null);
    }
  };

  const handleSaveSuccess = (savedPortfolio) => {
    console.log('포트폴리오 저장 성공:', savedPortfolio);
    // 저장 성공 후 처리 (예: 홈으로 이동)
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

      {currentStep === 4 && portfolioData && (
        <PortfolioViewer
          portfolioData={portfolioData}
          onClose={handleViewerClose}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default PortfolioCreationFlow;