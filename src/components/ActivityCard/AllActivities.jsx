import React from 'react';
import ProjectCard from './ProjectCard';
import './AllActivities.css';

const AllActivities = () => {
  // 샘플 데이터
  const activities = [
    {
      id: 1,
      tags: [
        { name: '사이드 프로젝트', color: '#fef3c7', textColor: '#92400e' },
        { name: 'Figma', color: '#f3f4f6', textColor: '#374151' },
        { name: '사용자 리서치', color: '#f3f4f6', textColor: '#374151' }
      ],
      title: "'ShopEase' 맞춤형 쇼핑 알림 기능 기획 및 프로토타입 제작",
      dateRange: '2024.03 - 2024.05',
      description: '모바일 쇼핑 앱에서 사용자 행동 데이터를 직접 분석하여 맞춤 알림 UX 설계 및...'
    },
    {
      id: 2,
      tags: [
        { name: '공모전', color: '#e0e7ff', textColor: '#3730a3' },
        { name: 'FigJam', color: '#f3f4f6', textColor: '#374151' },
        { name: 'KPI 설정', color: '#f3f4f6', textColor: '#374151' }
      ],
      title: '산업통상자원부 주최 AI 서비스 기획 공모전 우수상',
      dateRange: '2023.11 - 2023.12',
      description: '산업 내 고도화된 데이터 활용 환경을 반영한 AI 플랫폼 기획 리딩'
    },
    {
      id: 3,
      tags: [
        { name: '인턴', color: '#d1fae5', textColor: '#065f46' },
        { name: 'Jira', color: '#f3f4f6', textColor: '#374151' },
        { name: '요구사항 관리', color: '#f3f4f6', textColor: '#374151' }
      ],
      title: '배달의민족 PO 인턴십: 협업 커뮤니케이션 및 UI 개선 지원',
      dateRange: '2024.03 - 2025.03',
      description: '투시 알림 비소식 유저 대상 맞춤 추천 기능 기획'
    }
  ];

  return (
    <div className="all-activities">
      {/* 섹션 헤더 */}
      <div className="activities-header">
        <div className="activities-title-wrapper">
          <h2 className="activities-title">모든 활동</h2>
          <span className="activities-count">{activities.length}</span>
        </div>
        <button className="activities-more-button">더보기</button>
      </div>

      {/* 프로젝트 그리드 */}
      <div className="activities-grid">
        {activities.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default AllActivities;