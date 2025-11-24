import React, { useState } from 'react';
import './MakingPortfolio.css'; // 통합 CSS 사용
import guideImage3 from '../../assets/image/guide3.png';

const MakingPortfolioFinal = ({ selectedItems = [], selectedTags = [], onBack, onComplete }) => {
  const [workStyle, setWorkStyle] = useState('');
  const [strengths, setStrengths] = useState('');

  const MAX_LENGTH = 200;

  const handleWorkStyleChange = (e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setWorkStyle(e.target.value);
    }
  };

  const handleStrengthsChange = (e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setStrengths(e.target.value);
    }
  };

  const handleComplete = () => {
    if (!workStyle.trim() || !strengths.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    console.log('포트폴리오 생성 완료:', {
      selectedItems,
      selectedTags,
      workStyle,
      strengths
    });

    if (onComplete) {
      onComplete({
        selectedItems,
        selectedTags,
        workStyle,
        strengths
      });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="making-portfolio-container">
      <div className="guide-image-wrapper">
        <img 
          src={guideImage3} 
          alt="포트폴리오에 담을 자기소개를 작성해주세요" 
          className="guide-image"
        />
      </div>

      {/* 입력 영역 */}
      <div className="portfolio-grid">
        {/* 질문 1: 나는 어떤 사람이고, 어떻게 일하는지 */}
        <div className="input-section">
          <div className="question-header">
            <span className="question-text">나는 어떤 사람이고, 어떻게 일하는지 알려주세요</span>
            <span className="char-limit">{workStyle.length}/{MAX_LENGTH}자 이내</span>
          </div>
          <textarea
            className="portfolio-textarea"
            placeholder="어떤 태도와 가치로 일하는지 적어주세요"
            value={workStyle}
            onChange={handleWorkStyleChange}
            maxLength={MAX_LENGTH}
          />
        </div>

        {/* 질문 2: 내가 가진 가장 큰 강점과 성장 방향 */}
        <div className="input-section">
          <div className="question-header">
            <span className="question-text">내가 가진 가장 큰 강점과 성장 방향을 적어주세요</span>
            <span className="char-limit">{strengths.length}/{MAX_LENGTH}자 이내</span>
          </div>
          <textarea
            className="portfolio-textarea"
            placeholder="팀에서 보통 어떤 방식으로 기여하는지 적어주세요"
            value={strengths}
            onChange={handleStrengthsChange}
            maxLength={MAX_LENGTH}
          />
        </div>
      </div>

      {/* 버튼 영역 */}
      <button className="next-button" onClick={handleComplete}>
        완료
      </button>
      <button className="cancel-button-text" onClick={handleBack}>
        이전으로
      </button>
    </div>
  );
};

export default MakingPortfolioFinal;