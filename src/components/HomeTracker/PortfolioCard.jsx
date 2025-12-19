import React from 'react';
import portfolioGroupIcon from './images/portfolioGroupIcon.png';
import './PortfolioCard.css';

const PortfolioCard = ({ portfolio, onClick }) => {
  if (!portfolio) return null;

  // 활동 개수 계산
  const activityCount = portfolio.activities?.length || portfolio.activity_ids?.length || 0;

  return (
    <div className="portfolio-card" onClick={() => onClick && onClick(portfolio)}>
      {/* 포트폴리오 아이콘 이미지 */}
      <div className="portfolio-card-icon">
        <img src={portfolioGroupIcon} alt="포트폴리오" />
      </div>

      {/* 포트폴리오 제목 */}
      <h4 className="portfolio-card-title">{portfolio.title}</h4>

      {/* 경험 개수 */}
      <span className="portfolio-card-count">
        경험 {activityCount}개
      </span>
    </div>
  );
};

export default PortfolioCard;