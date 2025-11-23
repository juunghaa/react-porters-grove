import React, { useState } from 'react';
import './MakingPortfolio.css'; // 통합 CSS 사용
import ExperienceCard from './ExperienceCard';
import guideImage2 from '../../assets/image/guide2.png';


const MakingPortfolioNext = ({ selectedItems = [], onBack, onComplete }) => {
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [hoveredTag, setHoveredTag] = useState(null);

  // 태그 목록 - 5열 구조
  const tagRows = [
    // 1열 (6개)
    ['야심찬', '공손한', '철저한', '용감한', '협력적인', '책임있는'],
    // 2열 (6개)
    ['직설적인', '도전적인', '경험이 많은', '자기주도적인', '겸손한', '논리적인'],
    // 3열 (7개)
    ['열정적인', '자발적인', '부지런한', '배움을 즐기는', '집중력이 뛰어난', '차분한', '타고난 리더'],
    // 4열 (7개)
    ['문제 해결력', '적극적인', '능력있는', '에너제틱', '공정한', '약속개념', '명확한'],
    // 5열 (5개)
    ['사려가 깊은', '깔끔한', '현실적인', '다방면', '객관적인']
  ];

  // 전체 태그 리스트 (전체 선택용)
  const allTags = tagRows.flat();

  // 태그 클릭 핸들러
  const handleTagClick = (tag) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  // X 버튼 클릭 핸들러 (이벤트 전파 중지)
  const handleRemoveTag = (e, tag) => {
    e.stopPropagation();
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      newSet.delete(tag);
      return newSet;
    });
  };

  const handleComplete = () => {
    console.log('선택된 태그:', Array.from(selectedTags));
    
    if (onComplete) {
      onComplete({
        tags: Array.from(selectedTags),
        selectedItems: selectedItems
      });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="making-portfolio-next-container">
      <div className="guide-image-wrapper">
        <img 
          src={guideImage2} 
          alt="포트폴리오에 담을 경험을 선택해주세요" 
          className="guide-image"
        />
      </div>

      {/* 태그 선택 영역 */}
      <div className="portfolio-grid">
        {/* 상단 바: 선택 개수 + 전체 선택 */}
        <div className="portfolio-grid-header">
          <div className="selected-count">
            <span className="selected-count-number">{selectedTags.size}</span>
            <span className="selected-count-text">개 선택됨</span>
          </div>

          <button 
            className="select-all-btn" 
            onClick={() => {
              if (selectedTags.size === allTags.length) {
                setSelectedTags(new Set());
              } else {
                setSelectedTags(new Set(allTags));
              }
            }}
          >
            {selectedTags.size === allTags.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>

        {/* 태그 그리드 - 5열 구조 */}
        <div className="tags-container">
          {tagRows.map((row, rowIndex) => (
            <div key={rowIndex} className="tag-row">
              {row.map((tag) => {
                const isSelected = selectedTags.has(tag);
                const isHovered = hoveredTag === tag;

                return (
                  <button
                    key={tag}
                    className={`tag-chip ${isSelected ? 'selected' : ''} ${isHovered && !isSelected ? 'hovered' : ''}`}
                    onClick={() => handleTagClick(tag)}
                    onMouseEnter={() => setHoveredTag(tag)}
                    onMouseLeave={() => setHoveredTag(null)}
                  >
                    <span className="tag-label">{tag}</span>
                    
                    {/* 호버 시 + 아이콘 (선택되지 않은 경우만) */}
                    {isHovered && !isSelected && (
                      <svg 
                        className="tag-icon tag-icon-plus"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="27" 
                        height="27" 
                        viewBox="0 0 27 27" 
                        fill="none"
                      >
                        <path d="M13.3333 0C5.9696 0 0 5.96933 0 13.3333C0 20.6973 5.9696 26.6666 13.3333 26.6666C20.6971 26.6666 26.6667 20.6973 26.6667 13.3333C26.6667 5.96933 20.6971 0 13.3333 0ZM13.3333 6.66666C14.0697 6.66666 14.6667 7.264 14.6667 7.99999V12H18.6667C19.4031 12 20 12.5973 20 13.3333C20 14.0693 19.4031 14.6667 18.6667 14.6667H14.6667V18.6667C14.6667 19.4027 14.0697 20 13.3333 20C12.5969 20 12 19.4027 12 18.6667V14.6667H8C7.2636 14.6667 6.66667 14.0693 6.66667 13.3333C6.66667 12.5973 7.2636 12 8 12H12V7.99999C12 7.264 12.5969 6.66666 13.3333 6.66666Z" fill="#126431"/>
                      </svg>
                    )}

                    {/* 선택됨 시 X 아이콘 */}
                    {isSelected && (
                      <svg 
                        className="tag-icon tag-icon-remove"
                        onClick={(e) => handleRemoveTag(e, tag)}
                        xmlns="http://www.w3.org/2000/svg" 
                        width="27" 
                        height="27" 
                        viewBox="0 0 27 27" 
                        fill="none"
                      >
                        <path d="M13.3333 0C5.9696 0 0 5.96933 0 13.3333C0 20.6973 5.9696 26.6666 13.3333 26.6666C20.6971 26.6666 26.6667 20.6973 26.6667 13.3333C26.6667 5.96933 20.6971 0 13.3333 0ZM13.3333 6.66666C14.0697 6.66666 14.6667 7.264 14.6667 7.99999V12H18.6667C19.4031 12 20 12.5973 20 13.3333C20 14.0693 19.4031 14.6667 18.6667 14.6667H14.6667V18.6667C14.6667 19.4027 14.0697 20 13.3333 20C12.5969 20 12 19.4027 12 18.6667V14.6667H8C7.2636 14.6667 6.66667 14.0693 6.66667 13.3333C6.66667 12.5973 7.2636 12 8 12H12V7.99999C12 7.264 12.5969 6.66666 13.3333 6.66666Z" 
                        fill="#8ED8AA"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 영역 */}
        <button className="next-button" onClick={handleComplete}>
          다음 단계로
        </button>
        <button className="cancel-button-text" onClick={handleBack}>
          이전으로
        </button>
      </div>
  );
};

export default MakingPortfolioNext;