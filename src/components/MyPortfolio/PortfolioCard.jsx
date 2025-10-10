import React from 'react';
import './PortfolioCard.css';

const PortfolioCard = ({ folder }) => {
  return (
    <div className="portfolio-folder-card">
      {/* 폴더 이미지 영역 */}
      <div className="folder-image-container">
        <img 
          src={folder.folderImage} 
          alt={folder.title}
          className="folder-image"
        />
      </div>

      {/* 폴더 정보 */}
      <div className="folder-info">
        <h3 className="folder-title">{folder.title}</h3>
        <div className="folder-count">
          {folder.projectCount} Projects
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;