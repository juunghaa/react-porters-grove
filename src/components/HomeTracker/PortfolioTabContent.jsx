import React, { useState, useEffect } from 'react';
import PortfolioCard from './PortfolioCard';
import './PortfolioTabContent.css';

// 포트폴리오 목록 조회 API
const fetchPortfolios = async () => {
  const access = localStorage.getItem('access');
  
  const response = await fetch('/api/portfolios/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('포트폴리오 목록 조회 실패');
  }

  const data = await response.json();
  return data.results || data || [];
};

const PortfolioTabContent = ({ onGoToChooseOption, onPortfolioClick }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const data = await fetchPortfolios();
        setPortfolios(data);
      } catch (error) {
        console.error('포트폴리오 로딩 실패:', error);
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolios();
  }, []);

  const handlePortfolioClick = (portfolio) => {
    if (onPortfolioClick) {
      onPortfolioClick(portfolio);
    } else {
      console.log('포트폴리오 클릭:', portfolio);
      // 기본 동작: 상세 페이지로 이동 등
    }
  };

  if (loading) {
    return (
      <div className="portfolio-tab-container">
        <div className="portfolio-loading">로딩 중...</div>
      </div>
    );
  }

  const hasPortfolios = portfolios.length > 0;

  return (
    <div className="portfolio-tab-container">
      {hasPortfolios ? (
        <div className="portfolio-cards-list">
          {portfolios.map((portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              onClick={handlePortfolioClick}
            />
          ))}
        </div>
      ) : (
        <div className="portfolio-empty">
          <div className="portfolio-empty-content">
            <p className="portfolio-empty-text">아직 완성된 포트폴리오가 없어요</p>
            <p className="portfolio-empty-subtext">경험을 모아 나만의 포트폴리오를 만들어보세요</p>
            <button className="portfolio-add-btn" onClick={onGoToChooseOption}>
              + 포트폴리오 만들기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTabContent;