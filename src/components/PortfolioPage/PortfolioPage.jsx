import React, { useState, useEffect } from 'react';
import './PortfolioPage.css';
import { fetchMyProfile, fetchActivityDetail } from '../../api';  // ← fetchActivityDetail 추가

const PortfolioPage = ({ portfolioData, currentPage = 1 }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [experienceDetails, setExperienceDetails] = useState({});

  // 파일명 추출 함수
  const getFileName = (fileUrl) => {
    if (!fileUrl) return '파일';
    // URL에서 파일명만 추출
    const parts = fileUrl.split('/');
    const filename = parts[parts.length - 1];
    // URL 인코딩 디코딩
    try {
      return decodeURIComponent(filename);
    } catch {
      return filename;
    }
  };

  // 파일 확장자 확인 함수
  const getFileExtension = (fileUrl) => {
    if (!fileUrl) return '';
    const filename = getFileName(fileUrl);
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // 썸네일 렌더링 함수
  const renderThumbnail = (fileUrl) => {
    const ext = getFileExtension(fileUrl);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm'];
    const pdfExtension = 'pdf';

    // 이미지 파일
    if (imageExtensions.includes(ext)) {
      return <img src={fileUrl} alt="첨부파일" className="thumbnail-image" />;
    }

    // 비디오 파일
    if (videoExtensions.includes(ext)) {
      return (
        <div className="thumbnail-video">
          <video src={fileUrl} className="thumbnail-image" />
          <div className="video-play-icon">▶</div>
        </div>
      );
    }

    // PDF 파일
    if (ext === pdfExtension) {
      return (
        <div className="thumbnail-pdf">
          <span className="pdf-icon">PDF</span>
        </div>
      );
    }

    // 기타 파일
    return (
      <div className="thumbnail-default">
        <span className="file-icon">📄</span>
      </div>
    );
  };

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
    const loadExperienceDetails = async () => {
      const selectedItems = portfolioData?.selectedItems || [];
      
      for (const item of selectedItems) {
        if (item.id && !experienceDetails[item.id]) {
          try {
            const detail = await fetchActivityDetail(item.id);
            setExperienceDetails(prev => ({
              ...prev,
              [item.id]: detail
            }));
          } catch (error) {
            console.error('경험 상세 로딩 실패:', error);
          }
        }
      }
    };

    loadExperienceDetails();
  }, [portfolioData?.selectedItems]);

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

  // ⭐ 프로젝트 상세 섹션 데이터
  const projectDetailSections = [
    { title: '프로젝트 배경', content: detail.situation },
    { title: '목표 정의', content: detail.task_detail },
    { title: '해결과정', content: detail.action_detail },
    { title: '성과', content: detail.result_detail },
    { title: '배운점', content: detail.takeaway },
  ];

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

      {/* Mini Details */}
      <div className="experience-mini-details">
        {detail.organization && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">주최 기관</span>
            <span className="mini-detail-value">{detail.organization}</span>
          </div>
        )}

        {detail.work_title && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">출품작명</span>
            <span className="mini-detail-value">{detail.work_title}</span>
          </div>
        )}

        {detail.is_awarded !== undefined && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">수상 여부</span>
            <span className="mini-detail-value">
              {detail.is_awarded ? (detail.award_detail || '수상') : '미수상'}
            </span>
          </div>
        )}

        {detail.participation_type && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">참여 형태</span>
            <span className="mini-detail-value">
              {detail.participation_type === 'team' ? '팀' : '개인'}
            </span>
          </div>
        )}

        {detail.role && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">역할</span>
            <span className="mini-detail-value">{detail.role}</span>
          </div>
        )}

        {(detail.period_start || detail.period_end) && (
          <div className="mini-detail-item">
            <span className="mini-detail-label">진행 기간</span>
            <span className="mini-detail-value">
              {detail.period_start} ~ {detail.period_end}
            </span>
          </div>
        )}
      </div>

      {/* ⭐ 프로젝트 상세 섹션 */}
      <div className="project-detail-section">
        <h3 className="project-detail-title">프로젝트 상세</h3>
        <div className="project-detail-divider" />

        {projectDetailSections.map((section, index) => (
          <div key={index} className="project-detail-item">
            <h4 className="project-detail-item-title">{section.title}</h4>
            <p className="project-detail-item-content">
              {section.content || '내용이 없습니다.'}
            </p>
          </div>
        ))}
      </div>

      {/* ⭐ 첨부파일 섹션 */}
      {detail.attachments && detail.attachments.length > 0 && (
        <div className="attachments-section">
          <div className="attachments-grid">
            {detail.attachments.map((file, index) => (
              <div key={index} className="attachment-item">
                <div className="attachment-thumbnail">
                  {renderThumbnail(file)}
                </div>
                <p className="attachment-filename">{getFileName(file)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 단일 attachment인 경우 */}
      {detail.attachment && !detail.attachments && (
        <div className="attachments-section">
          <div className="attachments-grid">
            <div className="attachment-item">
              <div className="attachment-thumbnail">
                {renderThumbnail(detail.attachment)}
              </div>
              <p className="attachment-filename">{getFileName(detail.attachment)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;