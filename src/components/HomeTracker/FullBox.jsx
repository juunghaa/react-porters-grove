import React from "react";
import "./FullBox.css";

// 날짜 포맷팅
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, ".");
};

const FullBox = ({
  isPanelCollapsed,
  config,
  experienceData, // 배열로 받기
  onMenuClick,
}) => {
  if (!config) return null;

  // experienceData가 배열인지 확인, 없으면 빈 배열
  const dataList = Array.isArray(experienceData) ? experienceData : [];

  return (
    <div className={`box-status ${isPanelCollapsed ? "expanded" : ""}`}>
      <div className="box-content">
        {/* 헤더 */}
        <div className="full-box-header">
          <div className="full-box-title">
            <img
              src={config.titleIcon}
              alt="icon"
              className="full-box-title-icon"
            />
            <h3>{config.title}</h3>
            <span className="full-box-count">{dataList.length}</span>
          </div>
          <div className="full-box-actions">
            <button className="full-box-menu-btn" onClick={onMenuClick}>
              <span>⋯</span>
            </button>
          </div>
        </div>

        {/* ⭐ 경험 카드 리스트 - map으로 전체 렌더링 */}
        {dataList.length === 0 ? (
          <div className="experience-card-empty">
            <p>아직 등록된 활동이 없습니다.</p>
          </div>
        ) : (
          dataList.map((data, index) => (
            <div key={data.id || index} className="experience-card">
              {/* 태그와 역할 */}
              <div className="card-tag-role">
                <div className="card-tag">
                  {data.activity_type || data.tag || "경험"}
                </div>
                <span className="card-role">
                  {data.organization || data.role || "-"}
                </span>
              </div>

              {/* 타이틀 섹션 */}
              <div className="card-title-section">
                <h4 className="card-title">{data.title || "제목 없음"}</h4>
                <div className="card-subtitle">
                  <span>
                    {data.participation_type === "team"
                      ? "팀"
                      : data.participation_type === "individual"
                      ? "개인"
                      : data.teamType || "-"}
                  </span>
                  <span className="dot">·</span>
                  <span>{data.subject || "-"}</span>
                  <span className="dot">·</span>
                  <span>{data.role || data.roleDetail || "-"}</span>
                </div>
              </div>

              {/* 구분선 */}
              <div className="card-divider"></div>

              {/* ⭐ 날짜 - 실제 필드명 사용 */}
              <div className="card-date">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="18"
                  viewBox="0 0 17 18"
                  fill="none"
                >
                  <path
                    d="M5.69644 1.92773C5.30544 1.92773 4.98811 2.24507 4.98811 2.63607C3.42198 2.63607 2.13281 3.90611 2.13281 5.4694V6.88607L2.15477 12.5527C2.15477 14.1153 3.4234 15.3861 4.98811 15.3861H12.0714C13.6362 15.3861 14.9048 14.1174 14.9048 12.5527L14.8828 6.88607V5.4694C14.8828 3.90328 13.6347 2.63607 12.0714 2.63607C12.0714 2.24507 11.7548 1.92773 11.3631 1.92773C10.9721 1.92773 10.6548 2.24507 10.6548 2.63607H6.40478C6.40478 2.24507 6.08815 1.92773 5.69644 1.92773ZM4.98811 4.05273C4.98811 4.44373 5.30544 4.76107 5.69644 4.76107C6.08815 4.76107 6.40478 4.44373 6.40478 4.05273H10.6548C10.6548 4.44373 10.9721 4.76107 11.3631 4.76107C11.7548 4.76107 12.0714 4.44373 12.0714 4.05273C12.8485 4.05273 13.4661 4.68173 13.4661 5.4694V6.17773C12.1033 6.17773 4.91231 6.17773 3.54948 6.17773V5.4694C3.54948 4.69236 4.20044 4.05273 4.98811 4.05273ZM3.54948 7.5944C4.91231 7.5944 12.1033 7.5944 13.4661 7.5944L13.4881 12.5527C13.4881 13.3326 12.8542 13.9694 12.0714 13.9694H4.98811C4.20611 13.9694 3.57144 13.3354 3.57144 12.5527L3.54948 7.5944Z"
                    fill="#303030"
                    fillOpacity="0.4"
                  />
                </svg>
                <span>
                  {data.period_start && data.period_end
                    ? `${formatDate(data.period_start)} ~ ${formatDate(
                        data.period_end
                      )}`
                    : data.period_start
                    ? formatDate(data.period_start)
                    : "날짜 미정"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FullBox;
