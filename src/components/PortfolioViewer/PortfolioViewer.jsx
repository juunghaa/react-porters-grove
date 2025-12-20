import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './PortfolioViewer.css';
import portfolioTag from '../../assets/icons/portfolio-tag.png';
import viewerIcon from '../../assets/icons/viewerComplete.png';
import pdfDownloadButton from '../../assets/icons/pdfDownloadButton.png';
import PortfolioPage from '../../components/PortfolioPage/PortfolioPage';

// ⭐ 세부활동 API 함수
const fetchSubActivities = async (activityId) => {
  const access = localStorage.getItem('access');
  
  const response = await fetch(`/api/activities/${activityId}/sub-activities/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('세부활동 목록 조회 실패');
  }

  return response.json();
};

// ⭐ 포트폴리오 저장 API
const savePortfolio = async (portfolioData) => {
  const access = localStorage.getItem('access');
  
  const response = await fetch('/api/portfolios/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(portfolioData),
  });

  if (!response.ok) {
    throw new Error('포트폴리오 저장 실패');
  }

  return response.json();
};

const PortfolioViewer = ({ portfolioData, onClose, onSaveSuccess }) => {
  const [portfolioName, setPortfolioName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullView, setIsFullView] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false); // ⭐ 저장 드롭다운 상태
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [scale, setScale] = useState(1);
  const [subActivities, setSubActivities] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  
  const portfolioRef = useRef(null);
  const wrapperRef = useRef(null);
  
  const selectedItemsCount = portfolioData?.selectedItems?.length || 0;

  // 고정 크기 (A4 비율 기준)
  const FIXED_WIDTH = 952;
  const FIXED_HEIGHT = 1347;

  // ⭐ 세부활동 로딩
  useEffect(() => {
    const loadSubActivities = async () => {
      const selectedItems = portfolioData?.selectedItems || [];
      const newSubActivities = {};
      
      for (const item of selectedItems) {
        if (item.id) {
          try {
            const subs = await fetchSubActivities(item.id);
            newSubActivities[item.id] = subs || [];
          } catch (error) {
            console.error('세부활동 로딩 실패:', error);
            newSubActivities[item.id] = [];
          }
        }
      }
      
      setSubActivities(newSubActivities);
    };

    if (selectedItemsCount > 0) {
      loadSubActivities();
    }
  }, [portfolioData?.selectedItems, selectedItemsCount]);

  // ⭐ 총 페이지 수 계산
  useEffect(() => {
    let pageCount = 1; // 표지
    
    const selectedItems = portfolioData?.selectedItems || [];
    for (const item of selectedItems) {
      pageCount++; // 경험 상세 페이지
      const subs = subActivities[item.id] || [];
      pageCount += subs.length; // 세부활동 페이지들
    }
    
    setTotalPages(pageCount);
  }, [portfolioData?.selectedItems, subActivities]);

  // 스케일 계산 함수
  const calculateScale = () => {
    if (!wrapperRef.current) return;
    
    const wrapper = wrapperRef.current;
    const wrapperWidth = wrapper.clientWidth;
    
    const targetWidth = isFullView ? wrapperWidth * 0.35 : wrapperWidth * 0.7;
    const newScale = Math.min(targetWidth / FIXED_WIDTH, 1);
    
    setScale(newScale);
  };

  // 리사이즈 및 모드 변경 시 스케일 재계산
  useEffect(() => {
    calculateScale();
    
    const handleResize = () => calculateScale();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullView]);

  // ⭐ 포트폴리오 저장 핸들러
  const handleSavePortfolio = async () => {
    if (!portfolioName.trim()) {
      alert('포트폴리오 이름을 입력해주세요.');
      return;
    }

    if (isSaving) return;

    setIsSaving(true);

    try {
      // activity_ids 추출
      const selectedItems = portfolioData?.selectedItems || [];
      const activityIds = selectedItems.map(item => item.id).filter(id => id != null);

      const saveData = {
        title: portfolioName.trim(),
        selected_tags: portfolioData?.selectedTags || [],
        work_style: portfolioData?.workStyle || '',
        strengths: portfolioData?.strengths || '',
        activity_ids: activityIds
      };

      const savedPortfolio = await savePortfolio(saveData);
      
      setIsSaved(true);
      setShowSaveMenu(false);

      if (onSaveSuccess) {
        onSaveSuccess(savedPortfolio);
      }

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);

    } catch (error) {
      console.error('포트폴리오 저장 실패:', error);
      alert('포트폴리오 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoreOptions = () => {
    setShowMoreMenu(!showMoreMenu);
    setShowSaveMenu(false);
  };

  // ⭐ 저장 드롭다운 토글
  const handleSaveOptions = () => {
    setShowSaveMenu(!showSaveMenu);
    setShowMoreMenu(false);
  };

  const handleCloseMenu = () => {
    setShowMoreMenu(false);
    setShowSaveMenu(false);
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

  // PDF 다운로드 함수
  const handleDownloadPdf = async () => {
    if (!portfolioRef.current || isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    setShowMoreMenu(false);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      for (let page = 1; page <= totalPages; page++) {
        setCurrentPage(page);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(portfolioRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        if (page > 1) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      const fileName = portfolioName || '포트폴리오';
      pdf.save(`${fileName}.pdf`);
      
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="portfolio-viewer-container" onClick={handleCloseMenu}>
      <div className="portfolio-viewer-box" onClick={(e) => e.stopPropagation()}>
        {/* 상단 헤더 */}
        <div className="portfolio-viewer-header">
          <img 
            src={portfolioTag} 
            alt="포트폴리오" 
            className="portfolio-tag-icon"
          />

          <div className="portfolio-viewer-actions">
            {/* 전체보기 버튼 */}
            <button 
              className="portfolio-action-btn"
              onClick={handleFullView}
              aria-label="전체보기"
              title={isFullView ? "기본 보기" : "전체보기"}
            >
              {isFullView ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 6H14V8H8V14H6V6ZM26 6V14H24V8H18V6H26ZM6 26V18H8V24H14V26H6ZM24 24V18H26V26H18V24H24Z" fill="black" fillOpacity="0.4"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 6V14H8V8H14V6H6ZM26 6H18V8H24V14H26V6ZM8 24V18H6V26H14V24H8ZM24 24H18V26H26V18H24V24Z" fill="black" fillOpacity="0.4"/>
                </svg>
              )}
            </button>

            {/* ⭐ 저장 버튼 + 드롭다운 */}
            <div className="save-options-wrapper">
              <button 
                className="portfolio-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveOptions();
                }}
                aria-label="저장"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M25.3333 28H6.66667C5.95942 28 5.28115 27.719 4.78105 27.219C4.28095 26.7189 4 26.0406 4 25.3333V6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H21.3333L28 10.6667V25.3333C28 26.0406 27.719 26.7189 27.219 27.219C26.7189 27.719 26.0406 28 25.3333 28Z" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22.6667 28V17.3333H9.33333V28" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.33333 4V10.6667H20" stroke="black" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* 저장 드롭다운 메뉴 */}
              {showSaveMenu && (
                <div className="save-options-menu" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="save-menu-item"
                    onClick={handleSavePortfolio}
                    disabled={isSaving || !portfolioName.trim()}
                  >
                    {isSaving ? '저장 중...' : isSaved ? '저장 완료!' : '저장하기'}
                  </button>
                </div>
              )}
            </div>

            {/* 더보기 버튼 + 드롭다운 메뉴 */}
            <div className="more-options-wrapper">
              <button 
                className="portfolio-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoreOptions();
                }}
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

              {/* 더보기 드롭다운 메뉴 - 기존 PDF 다운로드 */}
              {showMoreMenu && (
                <div className="more-options-menu" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="pdf-download-btn"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                  >
                    <img src={pdfDownloadButton} alt="PDF 다운로드" />
                    {isGeneratingPdf && <span className="pdf-loading">생성 중...</span>}
                  </button>
                </div>
              )}
            </div>

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
          {!isFullView && (
            <>
              <div className="viewer-icon-wrapper">
                <img 
                  src={viewerIcon} 
                  alt="포트폴리오 완성 아이콘" 
                  className="viewer-icon"
                />
              </div>

              <h1 className="portfolio-viewer-title">포트폴리오가 완성되었어요!</h1>

              <input
                type="text"
                className="portfolio-name-input"
                placeholder="포트폴리오 이름을 입력하세요"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
              />

              {/* 저장 성공 메시지 */}
              {isSaved && (
                <div className="save-success-message">
                  포트폴리오가 저장되었습니다! 🎉
                </div>
              )}

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

          {/* 포트폴리오 렌더링 영역 */}
          <div className="portfolio-render-wrapper" ref={wrapperRef}>
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

            {/* 스케일 컨테이너 */}
            <div 
              className="portfolio-scale-container"
              style={{
                width: FIXED_WIDTH * scale,
                height: FIXED_HEIGHT * scale,
              }}
            >
              <div 
                className="portfolio-render-area" 
                ref={portfolioRef}
                style={{
                  width: FIXED_WIDTH,
                  height: FIXED_HEIGHT,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                <PortfolioPage 
                  portfolioData={portfolioData} 
                  currentPage={currentPage}
                />
              </div>
            </div>

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

          {/* ⭐ 페이지 인디케이터 */}
          <div className="page-indicator">
            <span>{currentPage} / {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioViewer;