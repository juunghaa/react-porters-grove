import React, { useState, useEffect } from 'react';
import './PortfolioPage.css';
import { fetchMyProfile, fetchActivityDetail } from '../../api';

// ⭐ 세부활동 API 함수 (api.js에 추가 필요)
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

const PortfolioPage = ({ portfolioData, currentPage = 1 }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [experienceDetails, setExperienceDetails] = useState({});
  const [subActivities, setSubActivities] = useState({}); // ⭐ 세부활동 데이터

  // 파일명 추출 함수
  const getFileName = (fileUrl) => {
    if (!fileUrl) return '파일';
    const parts = fileUrl.split('/');
    const filename = parts[parts.length - 1];
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

    if (imageExtensions.includes(ext)) {
      return <img src={fileUrl} alt="첨부파일" className="thumbnail-image" />;
    }

    if (videoExtensions.includes(ext)) {
      return (
        <div className="thumbnail-video">
          <video src={fileUrl} className="thumbnail-image" />
          <div className="video-play-icon">▶</div>
        </div>
      );
    }

    if (ext === pdfExtension) {
      return (
        <div className="thumbnail-pdf">
          <span className="pdf-icon">PDF</span>
        </div>
      );
    }

    return (
      <div className="thumbnail-default">
        <span className="file-icon">📄</span>
      </div>
    );
  };

  // 프로필 로딩
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

  // 경험 상세 정보 로딩
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

  // ⭐ 세부활동 로딩
  useEffect(() => {
    const loadSubActivities = async () => {
      const selectedItems = portfolioData?.selectedItems || [];
      
      for (const item of selectedItems) {
        if (item.id && !subActivities[item.id]) {
          try {
            const subs = await fetchSubActivities(item.id);
            setSubActivities(prev => ({
              ...prev,
              [item.id]: subs || []
            }));
          } catch (error) {
            console.error('세부활동 로딩 실패:', error);
            // 실패해도 빈 배열로 설정
            setSubActivities(prev => ({
              ...prev,
              [item.id]: []
            }));
          }
        }
      }
    };

    loadSubActivities();
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

  // ⭐ 페이지 구조 계산
  // 페이지 1: 표지
  // 페이지 2~N: 경험 상세 + 해당 경험의 세부활동들
  const getPageInfo = () => {
    let pageCount = 1; // 표지
    
    for (const item of selectedItems) {
      pageCount++; // 경험 상세 페이지
      const subs = subActivities[item.id] || [];
      pageCount += subs.length; // 세부활동 페이지들
    }
    
    // 현재 페이지가 어떤 콘텐츠인지 계산
    if (currentPage === 1) {
      return { type: 'cover' };
    }
    
    let pageIndex = 1;
    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      pageIndex++;
      
      if (currentPage === pageIndex) {
        return { 
          type: 'experience', 
          experienceIndex: i,
          experience: item 
        };
      }
      
      const subs = subActivities[item.id] || [];
      for (let j = 0; j < subs.length; j++) {
        pageIndex++;
        if (currentPage === pageIndex) {
          return { 
            type: 'subActivity', 
            experienceIndex: i,
            experience: item,
            subActivityIndex: j,
            subActivity: subs[j]
          };
        }
      }
    }
    
    return { type: 'unknown' };
  };

  const pageInfo = getPageInfo();

  // ===== 페이지 1: 자기소개 + Contents 목록 =====
  if (pageInfo.type === 'cover') {
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

  // ===== 경험 상세 페이지 =====
  if (pageInfo.type === 'experience') {
    const experienceIndex = pageInfo.experienceIndex;
    const experience = pageInfo.experience;
    const detail = experienceDetails[experience.id] || experience;

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

        {/* 프로젝트 상세 섹션 */}
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

        {/* 첨부파일 섹션 */}
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
  }

  // ===== ⭐ 세부활동 상세 페이지 (새로 추가) =====
  if (pageInfo.type === 'subActivity') {
    const subActivity = pageInfo.subActivity;

    // 세부활동 상세 섹션 데이터
    const subActivityDetailSections = [
      { title: '문제 배경', content: subActivity.situation },
      { title: '해결 과정', content: subActivity.task_detail },
      { title: '결과', content: subActivity.result_detail },
      { title: '배운점/느낀점', content: subActivity.takeaway },
    ];

    // 날짜 포맷팅 함수
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return dateStr.replace(/-/g, '.');
    };

    return (
      <div className="portfolio-page">
        {/* 상단 가로줄 */}
        <div className="experience-detail-line" />

        {/* 나의 핵심 기여 제목 */}
        <h2 className="sub-activity-header-title">나의 핵심 기여</h2>

        {/* 기간 */}
        <div className="sub-activity-period">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="sub-activity-calendar-icon">
            <path d="M5.10707 1.27734C4.75674 1.27734 4.47241 1.56167 4.47241 1.91201C3.06916 1.91201 1.91406 3.04997 1.91406 4.45068V5.72001L1.93374 10.7973C1.93374 12.1974 3.07043 13.336 4.47241 13.336H10.8191C12.2211 13.336 13.3577 12.1993 13.3577 10.7973L13.3381 5.72001V4.45068C13.3381 3.04743 12.2198 1.91201 10.8191 1.91201C10.8191 1.56167 10.5354 1.27734 10.1844 1.27734C9.83407 1.27734 9.54974 1.56167 9.54974 1.91201H5.74174C5.74174 1.56167 5.45805 1.27734 5.10707 1.27734ZM4.47241 3.18134C4.47241 3.53168 4.75674 3.81601 5.10707 3.81601C5.45805 3.81601 5.74174 3.53168 5.74174 3.18134H9.54974C9.54974 3.53168 9.83407 3.81601 10.1844 3.81601C10.5354 3.81601 10.8191 3.53168 10.8191 3.18134C11.5153 3.18134 12.0687 3.74493 12.0687 4.45068V5.08534C10.8476 5.08534 4.40449 5.08534 3.1834 5.08534V4.45068C3.1834 3.75445 3.76666 3.18134 4.47241 3.18134ZM3.1834 6.35468C4.40449 6.35468 10.8476 6.35468 12.0687 6.35468L12.0884 10.7973C12.0884 11.4961 11.5204 12.0667 10.8191 12.0667H4.47241C3.77174 12.0667 3.20307 11.4987 3.20307 10.7973L3.1834 6.35468Z" fill="#303030" fillOpacity="0.4"/>
          </svg>
          <span className="sub-activity-period-text">
            {formatDate(subActivity.period_start)} ~ {formatDate(subActivity.period_end)}
          </span>
        </div>

        {/* 세부활동 제목 */}
        <h3 className="sub-activity-title">{subActivity.title}</h3>

        {/* 구분선 */}
        <div className="sub-activity-divider" />

        {/* 세부활동 상세 섹션 (프로젝트 상세 재활용) */}
        <div className="project-detail-section sub-activity-detail-section">
          {subActivityDetailSections.map((section, index) => (
            <div key={index} className="project-detail-item">
              <h4 className="project-detail-item-title">{section.title}</h4>
              <p className="project-detail-item-content">
                {section.content || '내용이 없습니다.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 알 수 없는 페이지
  return (
    <div className="portfolio-page">
      <div className="loading-message">페이지를 찾을 수 없습니다.</div>
    </div>
  );
};

export default PortfolioPage;