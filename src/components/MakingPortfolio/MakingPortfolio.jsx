import React, { useEffect } from 'react';
import './MakingPortfolio.css';
import guideImage from '../../assets/image/guide.png';

const MakingPortfolio = ({ selectedTags = [], onCancel }) => {
  useEffect(() => {
    console.log('🎉 MakingPortfolio 컴포넌트가 마운트되었습니다!');
    console.log('선택된 태그:', selectedTags);
  }, [selectedTags]);

  const handleNext = () => {
    console.log('다음 단계로 이동');
    // 다음 단계 로직 추가
  };

  const handleCancel = () => {
    console.log('취소 버튼 클릭');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="making-portfolio-container">
      {/* 안내문구 이미지 */}
      <div className="guide-image-wrapper">
        <img 
          src={guideImage} 
          alt="포트폴리오에 담을 경험을 선택해주세요" 
          className="guide-image"
        />
      </div>

      {/* 포트폴리오 그리드 영역 */}
      <div className="portfolio-grid">
        {/* 여기에 포트폴리오 카드들이 들어갈 예정 */}
      </div>

      {/* 다음 단계로 버튼 */}
      <button className="next-button" onClick={handleNext}>
        다음 단계로
      </button>

      {/* 취소 버튼 */}
      <button className="cancel-button" onClick={handleCancel}>
        취소
      </button>
    </div>
  );
};

export default MakingPortfolio;