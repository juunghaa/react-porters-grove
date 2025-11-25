import React, { useState, useEffect } from 'react';
import './PortfolioPage.css';
import { fetchMyProfile } from '../../api';

// ⭐ TODO: api.js에 추가 필요
// export async function fetchActivityDetail(activityId) {
//   const res = await tryFetch(() =>
//     fetch(`/api/activities/${activityId}/`, {
//       method: "GET",
//       headers: { ...authHeaders() },
//     })
//   );
//   if (!res.ok) throw new Error(`경험 상세 조회 실패 (${res.status})`);
//   return res.json();
// }

const PortfolioPage = ({ portfolioData, currentPage = 1 }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [experienceDetails, setExperienceDetails] = useState({}); // ⭐ 경험 상세 정보

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchMyProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('프로필 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ⭐ 경험 상세 정보 로딩
  useEffect(() => {
    const loadExperienceDetail = async (experienceId) => {
      try {
        // TODO: fetchActivityDetail import 필요
        // import { fetchActivityDetail } from '../../api';
        
        // const detail = await fetchActivityDetail(experienceId);
        // setExperienceDetails(prev => ({
        //   ...prev,
        //   [experienceId]: detail
        // }));
        
        // 임시: 이미 있는 데이터 사용
        console.log('경험 ID:', experienceId, '상세 정보 로딩 필요');
      } catch (error) {
        console.error('경험 상세 로딩 실패:', error);
      }
    };

    const selectedItems = portfolioData?.selectedItems || [];
    selectedItems.forEach(item => {
      if (item.id && !experienceDetails[item.id]) {
        loadExperienceDetail(item.id);
      }
    });
  }, [portfolioData?.selectedItems, experienceDetails]);

  if (loading) {
    return (
      <div className="portfolio-page">
        <div className="loading-message">로딩 중...</div>
      </div>
    );
  }

  // portfolioData에서 필요한 데이터 추출
  const selectedTags = portfolioData?.selectedTags || [];
  const workStyle = portfolioData?.workStyle || '';
  const strengths = portfolioData?.strengths || '';
  const selectedItems = portfolioData?.selectedItems || [];

  // 프로필에서 필요한 데이터 추출
  const displayName = profile?.display_name || '이름';
  const phone = profile?.phone || '010-0000-0000';
  const email = profile?.email || 'example@naver.com';

  // ===== 페이지 1: 자기소개 + Contents 목록 =====
  if (currentPage === 1) {
    return (
      <div className="portfolio-page">
        {/* 태그 영역 */}
        <div className="tags-section">
          {selectedTags.map((tag, index) => (
            <span key={index} className="portfolio-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* 구분선 */}
        <div className="portfolio-divider" />

        {/* 자기소개 영역 */}
        <div className="intro-section">
          <p className="work-style-text">{workStyle}</p>
          <h2 className="portfolio-name">{displayName}</h2>
          <p className="strengths-text">{strengths}</p>
          <p className="contact-info">Tel. {phone}</p>
          <p className="contact-info">E-Mail. {email}</p>
        </div>

        {/* Contents 섹션 */}
        <div className="contents-section">
          <h3 className="contents-title">Contents</h3>
          <div className="contents-line" />

          {/* 경험 목록 */}
          <div className="experience-list">
            {selectedItems.map((item, index) => (
              <div key={item.id || index} className="experience-item">
                <span className="experience-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="experience-title">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== 페이지 2 이상: 경험 상세 페이지 =====
  const experienceIndex = currentPage - 2;
  const experience = selectedItems[experienceIndex];

  if (!experience) {
    return (
      <div className="portfolio-page">
        <div className="loading-message">경험 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  // 경험 상세 정보 (API에서 받아온 데이터 or 기본 데이터)
  const detail = experienceDetails[experience.id] || experience;

  return (
    <div className="portfolio-page">
      {/* 상단 가로줄 */}
      <div className="experience-detail-line" />

      {/* 경험 인덱스 번호 */}
      <div className="experience-detail-index">
        {String(experienceIndex + 1).padStart(2, '0')}
      </div>

      {/* 경험 제목 */}
      <h1 className="experience-detail-title">{detail.title}</h1>

      {/* 주제 */}
      <p className="experience-detail-subject">{detail.subject}</p>

      {/* ⭐ Mini Details */}
      <div className="experience-mini-details">
        {/* 주최 기관 */}
        {detail.organization && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">주최 기관</span>
            <span className="mini-detail-value">{detail.organization}</span>
          </div>
        )}

        {/* 출품작명 */}
        {detail.work_title && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">출품작명</span>
            <span className="mini-detail-value">{detail.work_title}</span>
          </div>
        )}

        {/* 수상 여부 */}
        {detail.is_awarded !== undefined && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">수상 여부</span>
            <span className="mini-detail-value">
              {detail.is_awarded ? (detail.award_detail || '수상') : '미수상'}
            </span>
          </div>
        )}

        {/* 참여 형태 */}
        {detail.participation_type && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">참여 형태</span>
            <span className="mini-detail-value">
              {detail.participation_type === 'team' ? '팀' : '개인'}
            </span>
          </div>
        )}

        {/* 역할 */}
        {detail.role && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">역할</span>
            <span className="mini-detail-value">{detail.role}</span>
          </div>
        )}

        {/* 진행 기간 */}
        {(detail.period_start || detail.period_end) && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">진행 기간</span>
            <span className="mini-detail-value">
              {detail.period_start} ~ {detail.period_end}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;