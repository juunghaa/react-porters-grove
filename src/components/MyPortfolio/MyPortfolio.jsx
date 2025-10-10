import React from 'react';
import PortfolioCard from './PortfolioCard';
import './MyPortfolio.css';

// 이미지 import (실제 경로로 변경해주세요)
import folderImage from '../../assets/icons/MyPortfolioGroup.png'; // 여기에 실제 이미지 경로

const MyPortfolio = () => {
  // 샘플 데이터
  const portfolioFolders = [
    {
      id: 1,
      title: '카카오엔터프라이즈 PO 인턴 지원',
      projectCount: 3,
      folderImage: folderImage // 실제 이미지
    },
    {
      id: 2,
      title: '카카오엔터프라이즈 PO 인턴 지원',
      projectCount: 3,
      folderImage: folderImage // 실제 이미지
    },
    {
      id: 3,
      title: '카카오엔터프라이즈 PO 인턴 지원',
      projectCount: 3,
      folderImage: folderImage // 실제 이미지
    },
    {
      id: 4,
      title: '카카오엔터프라이즈 PO 인턴 지원',
      projectCount: 3,
      folderImage: folderImage // 실제 이미지
    }
  ];

  return (
    <div className="my-portfolio">
      {/* 섹션 헤더 */}
      <div className="portfolio-header">
        <div className="portfolio-title-wrapper">
          <h2 className="portfolio-title">내 포트폴리오</h2>
          <span className="portfolio-count">{portfolioFolders.length}</span>
        </div>
        <button className="portfolio-more-button">더보기</button>
      </div>

      {/* 포트폴리오 폴더 그리드 */}
      <div className="portfolio-folder-grid">
        {portfolioFolders.map((folder) => (
          <PortfolioCard key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  );
};

export default MyPortfolio;