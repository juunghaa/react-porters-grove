import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PortfolioViewer from '../PortfolioViewer/PortfolioViewer';
import './PortfolioViewPage.css';

// ⭐ 포트폴리오 상세 조회 API
const fetchPortfolioDetail = async (portfolioId) => {
  const access = localStorage.getItem('access');
  
  const response = await fetch(`/api/portfolios/${portfolioId}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('포트폴리오 조회 실패');
  }

  return response.json();
};

// ⭐ 활동 상세 조회 API (activity_ids로 활동 정보 가져오기)
const fetchActivityDetail = async (activityId) => {
  const access = localStorage.getItem('access');
  
  const response = await fetch(`/api/activities/${activityId}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('활동 조회 실패');
  }

  return response.json();
};

const PortfolioViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!id) {
        setError('포트폴리오 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        // 1. 포트폴리오 상세 조회
        const portfolio = await fetchPortfolioDetail(id);
        console.log('📥 포트폴리오 데이터:', portfolio);

        // 2. activity_ids로 각 활동 상세 정보 가져오기
        const activityIds = portfolio.activity_ids || [];
        const selectedItems = [];

        for (const activityId of activityIds) {
          try {
            const activity = await fetchActivityDetail(activityId);
            selectedItems.push(activity);
          } catch (err) {
            console.error(`활동 ${activityId} 조회 실패:`, err);
          }
        }

        // 3. PortfolioViewer에 전달할 데이터 구조로 변환
        const viewerData = {
          id: portfolio.id,
          title: portfolio.title,
          selectedItems: selectedItems,
          selectedTags: portfolio.selected_tags || [],
          workStyle: portfolio.work_style || '',
          strengths: portfolio.strengths || '',
        };

        console.log('✅ PortfolioViewer 데이터:', viewerData);
        setPortfolioData(viewerData);

      } catch (err) {
        console.error('❌ 포트폴리오 로딩 실패:', err);
        setError('포트폴리오를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [id]);

  // 닫기 핸들러 - 이전 페이지 또는 홈으로 이동
  const handleClose = () => {
    navigate(-1);
  };

  // 저장 성공 핸들러 (수정 시)
  const handleSaveSuccess = (savedPortfolio) => {
    console.log('포트폴리오 수정 성공:', savedPortfolio);
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="portfolio-view-page">
        <div className="portfolio-view-loading">
          <div className="loading-spinner"></div>
          <p>포트폴리오를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="portfolio-view-page">
        <div className="portfolio-view-error">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!portfolioData) {
    return (
      <div className="portfolio-view-page">
        <div className="portfolio-view-error">
          <p>포트폴리오를 찾을 수 없습니다.</p>
          <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  // PortfolioViewer 렌더링
  return (
    <PortfolioViewer
      portfolioData={portfolioData}
      onClose={handleClose}
      onSaveSuccess={handleSaveSuccess}
      isViewMode={true}  // ⭐ 보기 모드 플래그 (필요시 PortfolioViewer에서 활용)
    />
  );
};

export default PortfolioViewPage;