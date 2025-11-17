import React, { useState } from 'react';
import './ExperienceCard.css';

const ExperienceCard = ({ experienceData, onMenuClick, onCheckChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!experienceData) return null;

  const data = experienceData;

  const handleCheckClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onCheckChange) {
      onCheckChange(newCheckedState);
    }
  };

  return (
    <div className="experience-card-wrapper">
      {/* 경험 카드 콘텐츠 */}
      <div className={`exp-card ${isChecked ? 'checked' : ''}`}>
        {/* 체크박스 (우측 상단) */}
        

        {/* 태그와 역할 */}
        <div className="exp-card-tag-role">
          <div className="exp-card-tag">{data.tag}</div>
          <span className="exp-card-role">{data.role}</span>
          
          <button 
          className="exp-card-checkbox" 
          onClick={handleCheckClick}
          aria-label={isChecked ? "선택 해제" : "선택"}
        >
          {isChecked ? (
            // 체크된 상태
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M8.75 3.75C5.98863 3.75 3.75 5.98875 3.75 8.74999V21.25C3.75 24.0112 5.98863 26.25 8.75 26.25H21.25C24.0114 26.25 26.25 24.0112 26.25 21.25V8.74999C26.25 5.98875 24.0114 3.75 21.25 3.75H8.75ZM20 11.015C20.3199 11.0163 20.6544 11.1225 20.8985 11.3675C21.3866 11.855 21.3866 12.6362 20.8985 13.125L16.211 17.8125C14.7731 19.25 12.5732 19.035 11.4452 17.3437L10.1953 15.4687C9.81238 14.895 9.9725 14.0937 10.5469 13.7112C11.1214 13.3275 11.9217 13.4875 12.3047 14.0625L13.5547 15.9375C13.8075 16.3162 14.1309 16.3375 14.4531 16.015L19.1015 11.3675C19.3456 11.1237 19.6801 11.015 20 11.015Z" fill="#126431"/>
            </svg>
          ) : (
            // 체크 안된 상태
            <svg xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5" viewBox="0 0 30 30" fill="none">
              <rect x="3.75" y="3.75" width="22.5" height="22.5" rx="5" fill="#E1E1E1"/>
            </svg>
          )}
        </button>
        
        </div>

        {/* 타이틀 섹션 */}
        <div className="exp-card-title-section">
          <h4 className="exp-card-title">{data.title}</h4>
          <div className="exp-card-subtitle">
            <span>{data.teamType}</span>
            <span className="dot">·</span>
            <span>{data.subject}</span>
            <span className="dot">·</span>
            <span>{data.roleDetail}</span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="exp-card-divider"></div>

        {/* 날짜 */}
        <div className="exp-card-date">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
            <path d="M5.69644 1.92773C5.30544 1.92773 4.98811 2.24507 4.98811 2.63607C3.42198 2.63607 2.13281 3.90611 2.13281 5.4694V6.88607L2.15477 12.5527C2.15477 14.1153 3.4234 15.3861 4.98811 15.3861H12.0714C13.6362 15.3861 14.9048 14.1174 14.9048 12.5527L14.8828 6.88607V5.4694C14.8828 3.90328 13.6347 2.63607 12.0714 2.63607C12.0714 2.24507 11.7548 1.92773 11.3631 1.92773C10.9721 1.92773 10.6548 2.24507 10.6548 2.63607H6.40478C6.40478 2.24507 6.08815 1.92773 5.69644 1.92773ZM4.98811 4.05273C4.98811 4.44373 5.30544 4.76107 5.69644 4.76107C6.08815 4.76107 6.40478 4.44373 6.40478 4.05273H10.6548C10.6548 4.44373 10.9721 4.76107 11.3631 4.76107C11.7548 4.76107 12.0714 4.44373 12.0714 4.05273C12.8485 4.05273 13.4661 4.68173 13.4661 5.4694V6.17773C12.1033 6.17773 4.91231 6.17773 3.54948 6.17773V5.4694C3.54948 4.69236 4.20044 4.05273 4.98811 4.05273ZM3.54948 7.5944C4.91231 7.5944 12.1033 7.5944 13.4661 7.5944L13.4881 12.5527C13.4881 13.3326 12.8542 13.9694 12.0714 13.9694H4.98811C4.20611 13.9694 3.57144 13.3354 3.57144 12.5527L3.54948 7.5944Z" fill="#303030" fillOpacity="0.4"/>
          </svg>
          <span>{data.startDate} ~</span>
        </div>

        {/* 메뉴 버튼 (우측 상단) - 체크박스가 있으면 제거 */}
        {/* {onMenuClick && (
          <button className="exp-card-menu-btn" onClick={onMenuClick}>
            <span>⋯</span>
          </button>
        )} */}
      </div>
    </div>
  );
};

export default ExperienceCard;