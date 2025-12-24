import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeftPanel from '../LeftPanel/LeftPanel';
import PortfolioViewer from './PortfolioViewer';
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
  
  // ⭐ LeftPanel 상태
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

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
        console.log('📥 포트폴리오 원본 데이터:', portfolio);
        console.log('📥 포트폴리오 키 목록:', Object.keys(portfolio));

        // ⭐ activity_ids 필드 확인 (여러 가능한 필드명 체크)
        const activityIds = portfolio.activity_ids 
          || portfolio.activities 
          || portfolio.activity_list 
          || portfolio.selected_activities
          || [];
        
        console.log('📥 activity_ids:', activityIds);

        // 2. activity_ids로 각 활동 상세 정보 가져오기
        const selectedItems = [];

        // activityIds가 숫자 배열인지, 객체 배열인지 확인
        for (const item of activityIds) {
          const activityId = typeof item === 'object' ? item.id : item;
          
          if (activityId) {
            try {
              const activity = await fetchActivityDetail(activityId);
              console.log(`✅ 활동 ${activityId} 조회 성공:`, activity);
              selectedItems.push(activity);
            } catch (err) {
              console.error(`❌ 활동 ${activityId} 조회 실패:`, err);
            }
          }
        }

        console.log('📥 selectedItems 최종:', selectedItems);

        // 3. PortfolioViewer에 전달할 데이터 구조로 변환
        const viewerData = {
          id: portfolio.id,
          title: portfolio.title || portfolio.name || '포트폴리오',
          selectedItems: selectedItems,
          selectedTags: portfolio.selected_tags || portfolio.tags || [],
          workStyle: portfolio.work_style || portfolio.workStyle || '',
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

  // ⭐ LeftPanel 핸들러들
  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const handleHomeClick = () => navigate('/');
  const handleCreateNew = () => navigate('/choose');
  const handleArchiveClick = () => navigate('/archive');
  const handleOpenProfileSettings = () => setIsProfileSettingsOpen(true);
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

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
      <div className="portfolio-view-page-container">
        <LeftPanel
          isCollapsed={isCollapsed}
          onToggle={handleToggle}
          onHomeClick={handleHomeClick}
          onCreateNew={handleCreateNew}
          onArchiveClick={handleArchiveClick}
          onLogout={handleLogout}
          isProfileSettingsOpen={isProfileSettingsOpen}
          onOpenProfileSettings={handleOpenProfileSettings}
        />
        <div className={`portfolio-view-content ${isCollapsed ? 'expanded' : ''}`}>
          <div className="portfolio-view-loading">
            <div className="loading-spinner"></div>
            <p>포트폴리오를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="portfolio-view-page-container">
        <LeftPanel
          isCollapsed={isCollapsed}
          onToggle={handleToggle}
          onHomeClick={handleHomeClick}
          onCreateNew={handleCreateNew}
          onArchiveClick={handleArchiveClick}
          onLogout={handleLogout}
          isProfileSettingsOpen={isProfileSettingsOpen}
          onOpenProfileSettings={handleOpenProfileSettings}
        />
        <div className={`portfolio-view-content ${isCollapsed ? 'expanded' : ''}`}>
          <div className="portfolio-view-error">
            <p>{error}</p>
            <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!portfolioData) {
    return (
      <div className="portfolio-view-page-container">
        <LeftPanel
          isCollapsed={isCollapsed}
          onToggle={handleToggle}
          onHomeClick={handleHomeClick}
          onCreateNew={handleCreateNew}
          onArchiveClick={handleArchiveClick}
          onLogout={handleLogout}
          isProfileSettingsOpen={isProfileSettingsOpen}
          onOpenProfileSettings={handleOpenProfileSettings}
        />
        <div className={`portfolio-view-content ${isCollapsed ? 'expanded' : ''}`}>
          <div className="portfolio-view-error">
            <p>포트폴리오를 찾을 수 없습니다.</p>
            <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  // ⭐ LeftPanel + PortfolioViewer 렌더링
  return (
    <div className="portfolio-view-page-container">
      <LeftPanel
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        onHomeClick={handleHomeClick}
        onCreateNew={handleCreateNew}
        onArchiveClick={handleArchiveClick}
        onLogout={handleLogout}
        isProfileSettingsOpen={isProfileSettingsOpen}
        onOpenProfileSettings={handleOpenProfileSettings}
      />
      <div className={`portfolio-view-content ${isCollapsed ? 'expanded' : ''}`}>
        <PortfolioViewer
          portfolioData={portfolioData}
          onClose={handleClose}
          onSaveSuccess={handleSaveSuccess}
          isViewMode={true}
        />
      </div>
    </div>
  );
};

export default PortfolioViewPage;