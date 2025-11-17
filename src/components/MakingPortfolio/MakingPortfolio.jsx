import React, { useEffect, useState } from 'react';
import './MakingPortfolio.css';
import ExperienceCard from './ExperienceCard'; // ✅ ExperienceCard로 변경
import guideImage from '../../assets/image/guide.png'; // 안내문구 이미지 경로

const MakingPortfolio = ({ selectedTags = [], onCancel }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 4열 x 2행 = 8개
  const [checkedCount, setCheckedCount] = useState(0);

  // 임시 데이터 (나중에 실제 API에서 가져올 데이터)
  const [portfolioItems, setPortfolioItems] = useState([
    {
      tag: '해커톤',
      role: '구름톤14기',
      title: '제주 프라이빗 스팟 앱 개발',
      teamType: '팀',
      subject: '구름톤14기',
      roleDetail: '팀장',
      startDate: '2025.06'
    },
    {
      tag: '프로젝트',
      role: '캡스톤디자인',
      title: 'AI 기반 학습 플랫폼 개발',
      teamType: '팀',
      subject: '졸업작품',
      roleDetail: '팀원',
      startDate: '2024.03'
    },
    // 필요시 더 추가...
  ]);

  useEffect(() => {
    console.log('🎉 MakingPortfolio 컴포넌트가 마운트되었습니다!');
    console.log('선택된 태그:', selectedTags);
  }, [selectedTags]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(portfolioItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = portfolioItems.slice(startIndex, endIndex);

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePrevPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  // FullBox 설정
  const boxConfig = {
    titleIcon: '', // FullBox에서 필요한 아이콘
    title: '',
    count: 0
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
         {/* 🔥 선택 개수 표시 */}
        <div className="selected-count">
            <span className="selected-count-number">{checkedCount}</span>
            <span className="selected-count-text">개 선택됨</span>
        </div>

        {/* FullBox 그리드 */}
        <div className="portfolio-items-grid">
          {currentItems.map((item, index) => (
            <ExperienceCard
                key={index}
                isPanelCollapsed={false}
                config={boxConfig}
                experienceData={item}
                onMenuClick={() => console.log('메뉴 클릭', index)}
                onCheckChange={(checked) => {
                    setCheckedCount(prev => checked ? prev + 1 : prev - 1);
                }}
            />        
          ))}
        </div>

        {/* 페이지네이션 */}
        {/* {totalPages >= 1 && ( */}
          <div className="pagination">
            {/* 처음으로 (<<) */}
            <button 
              className="pagination-arrow" 
              onClick={handleFirstPage}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M18.948 17.7238C18.6035 18.0821 18.0337 18.0933 17.6754 17.7487L12.2754 12.6488C12.0989 12.4791 11.9992 12.2448 11.9992 12C11.9992 11.7552 12.0989 11.5209 12.2754 11.3513L17.6754 6.25125C18.0337 5.90674 18.6035 5.91791 18.948 6.2762C19.2925 6.6345 19.2813 7.20424 18.923 7.54875L14.1977 12L18.923 16.4512C19.2813 16.7958 19.2925 17.3655 18.948 17.7238ZM11.748 17.7238C11.4035 18.0821 10.8337 18.0933 10.4754 17.7487L5.07542 12.6488C4.89895 12.4791 4.79921 12.2448 4.79921 12C4.79921 11.7552 4.89895 11.5209 5.07542 11.3513L10.4754 6.25125C10.8337 5.90674 11.4035 5.91791 11.748 6.2762C12.0925 6.6345 12.0813 7.20424 11.723 7.54875L6.99771 12L11.723 16.4513C12.0813 16.7958 12.0925 17.3655 11.748 17.7238Z" fill="#626262"/>
              </svg>
            </button>

            {/* 이전 (<) */}
            <button 
              className="pagination-arrow" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M15.3484 6.2762C15.6929 6.6345 15.6817 7.20424 15.3234 7.54875L10.5981 12L15.3234 16.4513C15.6817 16.7958 15.6929 17.3655 15.3484 17.7238C15.0038 18.0821 14.4341 18.0933 14.0758 17.7487L8.67581 12.6487C8.49934 12.4791 8.39961 12.2448 8.39961 12C8.39961 11.7552 8.49934 11.5209 8.67581 11.3513L14.0758 6.25125C14.4341 5.90674 15.0038 5.91791 15.3484 6.2762Z" fill="#626262"/>
              </svg>
            </button>

            {/* 페이지 번호들 */}
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* 다음 (>) */}
            <button 
              className="pagination-arrow" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.65164 17.7238C8.30713 17.3655 8.3183 16.7958 8.67659 16.4512L13.4019 12L8.67659 7.54875C8.3183 7.20424 8.30713 6.6345 8.65164 6.2762C8.99616 5.91791 9.56589 5.90674 9.92419 6.25125L15.3242 11.3512C15.5007 11.5209 15.6004 11.7552 15.6004 12C15.6004 12.2448 15.5007 12.4791 15.3242 12.6487L9.92419 17.7487C9.5659 18.0933 8.99616 18.0821 8.65164 17.7238Z" fill="#626262"/>
              </svg>
            </button>

            {/* 마지막으로 (>>) */}
            <button 
              className="pagination-arrow" 
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5.07699 16.4513C4.71869 16.7958 4.70752 17.3655 5.05203 17.7238C5.39655 18.0821 5.96629 18.0933 6.32458 17.7487L11.7246 12.6487C11.9011 12.4791 12.0008 12.2448 12.0008 12C12.0008 11.7552 11.9011 11.5209 11.7246 11.3513L6.32458 6.25125C5.96629 5.90674 5.39655 5.91791 5.05203 6.2762C4.70752 6.6345 4.71869 7.20424 5.07698 7.54875L9.80229 12L5.07699 16.4513Z" fill="#626262"/>
                <path d="M12.277 16.4513C11.9187 16.7958 11.9075 17.3655 12.252 17.7238C12.5965 18.0821 13.1663 18.0933 13.5246 17.7487L18.9246 12.6487C19.1011 12.4791 19.2008 12.2448 19.2008 12C19.2008 11.7552 19.1011 11.5209 18.9246 11.3513L13.5246 6.25125C13.1663 5.90674 12.5965 5.91791 12.252 6.2762C11.9075 6.6345 11.9187 7.20424 12.277 7.54875L17.0023 12L12.277 16.4513Z" fill="#626262"/>
              </svg>
            </button>
          </div>
        {/* )} */}
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