import React, { useState } from 'react';
import './PortfolioViewer.css';
import portfolioTag from '../../assets/icons/portfolio-tag.png';
import viewerIcon from '../../assets/icons/viewerComplete.png';

const PortfolioViewer = ({ portfolioData, onClose }) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullView, setIsFullView] = useState(false); // ⭐ 전체보기 모드
  const totalPages = 3;

  const handleShare = () => {
    console.log('공유 버튼 클릭');
  };

  const handleMoreOptions = () => {
    console.log('더보기 버튼 클릭');
  };

  const handleClose = () => {
    console.log('닫기 버튼 클릭');
    if (onClose) {
      onClose();
    }
  };

  const handleFullView = () => {
    setIsFullView(!isFullView);
    console.log('전체보기 모드:', !isFullView);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="portfolio-viewer-container">
      {/* 흰색 상자 */}
      <div className="portfolio-viewer-box">
        {/* 상단 헤더 */}
        <div className="portfolio-viewer-header">
          {/* 왼쪽: 포트폴리오 태그 */}
          <img 
            src={portfolioTag} 
            alt="포트폴리오" 
            className="portfolio-tag-icon"
          />

          {/* 오른쪽: 버튼들 */}
          <div className="portfolio-viewer-actions">
            {/* 전체보기 버튼 ⭐ 새로 추가! */}
            <button 
              className="portfolio-action-btn"
              onClick={handleFullView}
              aria-label="전체보기"
              title={isFullView ? "기본 보기" : "전체보기"}
            >
              {isFullView ? (
                // 전체보기 모드일 때 (축소 아이콘)
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 6H14V8H8V14H6V6ZM26 6V14H24V8H18V6H26ZM6 26V18H8V24H14V26H6ZM24 24V18H26V26H18V24H24Z" fill="black" fillOpacity="0.4"/>
                </svg>
              ) : (
                // 기본 모드일 때 (전체화면 아이콘)
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 6V14H8V8H14V6H6ZM26 6H18V8H24V14H26V6ZM8 24V18H6V26H14V24H8ZM24 24H18V26H26V18H24V24Z" fill="black" fillOpacity="0.4"/>
                </svg>
              )}
            </button>

            {/* 공유 버튼 */}
            <button 
              className="portfolio-action-btn"
              onClick={handleShare}
              aria-label="공유"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M21.625 5C19.7609 5 18.25 6.4773 18.25 8.3C18.25 8.5827 18.2961 8.9347 18.3647 9.1965L12.3426 13.3061C11.8037 12.9497 11.0736 12.7 10.375 12.7C8.51088 12.7 7 14.1773 7 16C7 17.8227 8.51088 19.3 10.375 19.3C11.086 19.3 11.788 19.0415 12.3325 18.6752L18.367 22.8178C18.2928 23.0895 18.25 23.4052 18.25 23.7C18.25 25.5227 19.7609 27 21.625 27C23.4891 27 25 25.5227 25 23.7C25 21.8773 23.4891 20.4 21.625 20.4C20.914 20.4 20.221 20.6508 19.6776 21.0182L13.6274 16.8789C13.7005 16.6072 13.75 16.2948 13.75 16C13.75 15.7052 13.7072 15.3873 13.633 15.1156L19.6686 10.9884C20.2075 11.3437 20.9264 11.6 21.625 11.6C23.4891 11.6 25 10.1227 25 8.3C25 6.4773 23.4891 5 21.625 5ZM21.625 7.2C22.246 7.2 22.75 7.6928 22.75 8.3C22.75 8.9072 22.246 9.4 21.625 9.4C21.004 9.4 20.5 8.9072 20.5 8.3C20.5 7.6928 21.004 7.2 21.625 7.2ZM10.375 14.9C10.996 14.9 11.5 15.3928 11.5 16C11.5 16.6072 10.996 17.1 10.375 17.1C9.754 17.1 9.25 16.6072 9.25 16C9.25 15.3928 9.754 14.9 10.375 14.9ZM21.625 22.6C22.246 22.6 22.75 23.0928 22.75 23.7C22.75 24.3072 22.246 24.8 21.625 24.8C21.004 24.8 20.5 24.3072 20.5 23.7C20.5 23.0928 21.004 22.6 21.625 22.6Z" fill="black" fillOpacity="0.4"/>
              </svg>
            </button>

            {/* 더보기 버튼 */}
            <button 
              className="portfolio-action-btn"
              onClick={handleMoreOptions}
              aria-label="더보기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_3094_11744" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_3094_11744)">
                  <path d="M4.50391 15C3.81641 15 3.22786 14.7552 2.73828 14.2656C2.2487 13.776 2.00391 13.1875 2.00391 12.5C2.00391 11.8125 2.2487 11.224 2.73828 10.7344C3.22786 10.2448 3.81641 10 4.50391 10C5.19141 10 5.77995 10.2448 6.26953 10.7344C6.75911 11.224 7.00391 11.8125 7.00391 12.5C7.00391 13.1875 6.75911 13.776 6.26953 14.2656C5.77995 14.7552 5.19141 15 4.50391 15ZM12.0039 15C11.3164 15 10.7279 14.7552 10.2383 14.2656C9.7487 13.776 9.50391 13.1875 9.50391 12.5C9.50391 11.8125 9.7487 11.224 10.2383 10.7344C10.7279 10.2448 11.3164 10 12.0039 10C12.6914 10 13.2799 10.2448 13.7695 10.7344C14.2591 11.224 14.5039 11.8125 14.5039 12.5C14.5039 13.1875 14.2591 13.776 13.7695 14.2656C13.2799 14.7552 12.6914 15 12.0039 15ZM19.5039 15C18.8164 15 18.2279 14.7552 17.7383 14.2656C17.2487 13.776 17.0039 13.1875 17.0039 12.5C17.0039 11.8125 17.2487 11.224 17.7383 10.7344C18.2279 10.2448 18.8164 10 19.5039 10C20.1914 10 20.7799 10.2448 21.2695 10.7344C21.7591 11.224 22.0039 11.8125 22.0039 12.5C22.0039 13.1875 21.7591 13.776 21.2695 14.2656C20.7799 14.7552 20.1914 15 19.5039 15Z" fill="black" fillOpacity="0.4"/>
                </g>
              </svg>
            </button>

            {/* 닫기 버튼 */}
            <button 
              className="portfolio-action-btn"
              onClick={handleClose}
              aria-label="닫기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 3C8.82036 3 3 8.8201 3 16C3 23.1799 8.82036 29 16 29C23.1799 29 29 23.1799 29 16C29 8.8201 23.1799 3 16 3ZM12.1 10.8C12.4325 10.8 12.7806 10.9118 13.0344 11.1653L16 14.1306L18.9653 11.1653C19.2201 10.9118 19.5672 10.8 19.9 10.8C20.2328 10.8 20.5799 10.9118 20.8347 11.1653C21.3417 11.6736 21.3417 12.5264 20.8347 13.0347L17.8694 16L20.8347 18.9653C21.3417 19.4736 21.3417 20.3264 20.8347 20.8347C20.3264 21.3417 19.4736 21.3417 18.9653 20.8347L16 17.8694L13.0344 20.8347C12.5268 21.3417 11.6733 21.3417 11.1656 20.8347C10.6579 20.3264 10.6579 19.4736 11.1656 18.9653L14.1306 16L11.1656 13.0347C10.6579 12.5264 10.6579 11.6736 11.1656 11.1653C11.4196 10.9118 11.7673 10.8 12.1 10.8Z" fill="black" fillOpacity="0.1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className={`portfolio-viewer-content ${isFullView ? 'full-view-mode' : ''}`}>
          {/* 기본 정보 영역 - 전체보기 모드에서 숨김 ⭐ */}
          {!isFullView && (
            <>
              {/* 완성 아이콘 */}
              <div className="viewer-icon-wrapper">
                <img 
                  src={viewerIcon} 
                  alt="포트폴리오 완성 아이콘" 
                  className="viewer-icon"
                />
              </div>

              {/* 제목 */}
              <h1 className="portfolio-viewer-title">포트폴리오가 완성되었어요!</h1>

              {/* 포트폴리오 이름 입력 */}
              <input
                type="text"
                className="portfolio-name-input"
                placeholder="포트폴리오 이름을 입력하세요"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
              />

              {/* 구분선 */}
              <div 
                style={{
                  width: "calc(100% - 32px)",
                  height: "1px",
                  backgroundColor: "#E4E4E4",
                  margin: "1px 16px 24px 16px"
                }}
              />
            </>
          )}

          {/* ===== 포트폴리오 렌더링 영역 ===== */}
          <div className="portfolio-render-wrapper">
            {/* 이전 페이지 버튼 */}
            <button 
              className="page-nav-btn prev-page-btn"
              onClick={handlePrevPage}
              disabled={!hasPrevPage}
              aria-label="이전 페이지"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                <path 
                  d="M25.97 4.23242C37.9361 4.23242 47.6367 13.9326 47.6367 25.8991C47.6367 37.8656 37.9361 47.5658 25.97 47.5658C14.004 47.5658 4.30338 37.8656 4.30338 25.8991C4.30338 13.9326 14.004 4.23242 25.97 4.23242ZM29.2352 17.5098C28.6006 17.1393 27.7599 17.1067 26.9973 17.6181L19.0627 22.9719C16.7515 24.6663 16.6826 27.0691 19.0627 28.8133L26.9973 34.1671C28.5226 35.1897 30.3034 34.1433 30.3034 32.2193V19.5638C30.3034 18.6039 29.87 17.8803 29.2352 17.5098Z" 
                  fill={hasPrevPage ? "#000000" : "#E5E5E5"}
                />
              </svg>
            </button>

            {/* 포트폴리오 렌더링 영역 */}
            <div className="portfolio-render-area">
              <h2>포트폴리오가 렌더링 될 영역입니다</h2>
            </div>

            {/* 다음 페이지 버튼 */}
            <button 
              className="page-nav-btn next-page-btn"
              onClick={handleNextPage}
              disabled={!hasNextPage}
              aria-label="다음 페이지"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                <path 
                  d="M26.03 4.23242C14.0639 4.23242 4.36328 13.9326 4.36328 25.8991C4.36328 37.8656 14.0639 47.5658 26.03 47.5658C37.996 47.5658 47.6966 37.8656 47.6966 25.8991C47.6966 13.9326 37.996 4.23242 26.03 4.23242ZM22.7648 17.5098C23.3994 17.1393 24.2401 17.1067 25.0027 17.6181L32.9373 22.9719C35.2485 24.6663 35.3174 27.0691 32.9373 28.8133L25.0027 34.1671C23.4774 35.1897 21.6966 34.1433 21.6966 32.2193V19.5638C21.6966 18.6039 22.13 17.8803 22.7648 17.5098Z" 
                  fill={hasNextPage ? "#000000" : "#E5E5E5"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioViewer;