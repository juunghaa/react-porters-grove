import React, { useState, useEffect } from 'react';
import './PortfolioPage.css';
import { fetchMyProfile } from '../../api';

const PortfolioPage = ({ portfolioData }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const selectedItems = portfolioData?.selectedItems || []; // ⭐ 1단계에서 선택한 경험들

  // 프로필에서 필요한 데이터 추출
  const displayName = profile?.display_name || '이름';
  const phone = profile?.phone || '010-0000-0000';
  const email = profile?.email || 'example@naver.com';

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
        {/* 질문 1 답변 (workStyle) */}
        <p className="work-style-text">{workStyle}</p>

        {/* 이름 */}
        <h2 className="portfolio-name">{displayName}</h2>

        {/* 질문 2 답변 (strengths) */}
        <p className="strengths-text">{strengths}</p>

        {/* 연락처 */}
        <p className="contact-info">Tel. {phone}</p>
        <p className="contact-info">E-Mail. {email}</p>
      </div>

      {/* Contents 섹션 */}
      <div className="contents-section">
        <h3 className="contents-title">Contents</h3>
        <div className="contents-line" />

        {/* ⭐ 경험 목록 */}
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
};

export default PortfolioPage;