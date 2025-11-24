import React from 'react';
import './MakingPortfolio.css';
import guideImage4 from '../../assets/image/guide4.png';

const MakingPortfolioComplete = ({ onGoHome }) => {
  
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    }
  };

  return (
    <div className="making-portfolio-container">
      {/* 완료 안내 이미지 */}
      <div className="guide-image-wrapper" style={{ marginTop:'200px' }}>
        <img 
          src={guideImage4} 
          alt="포트폴리오 생성 완료" 
          className="guide-image"
          style={{ maxWidth: '25%' }}
        />
      </div>
    </div>
  );
};

export default MakingPortfolioComplete;