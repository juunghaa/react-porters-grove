import React from "react";
import "./MyExperienceStatus.css";

// 이미지 import
import projectIcon from "../../assets/image/flag.png";
import portfolioIcon from "../../assets/image/star.png";
import careerIcon from "../../assets/image/career.png";
import awardIcon from "../../assets/image/award.png";
import certificateIcon from "../../assets/image/certificate.png";
import languageIcon from "../../assets/image/language.png";
import globalIcon from "../../assets/image/overseas.png";

const MyExperienceStatus = ({ isPanelCollapsed }) => {
  return (
    <div className={`experience-status ${isPanelCollapsed ? 'expanded' : ''}`}>
      <div className="experience-header">
        <h2 className="experience-title">나의 경험 현황</h2>
        <p className="experience-subtext">
          아직 등록된 경험이 없어요. 지금 바로 남겨볼까요?{" "}
          <span className="highlight">+ 경험 정리하기</span>
        </p>
      </div>

      <div className="experience-grid">
        {[
          { icon: projectIcon, label: "프로젝트", count: 0 },
          { icon: portfolioIcon, label: "포트폴리오", count: 0 },
          { icon: careerIcon, label: "경력", count: 0 },
          { icon: awardIcon, label: "수상", count: 0 },
          { icon: certificateIcon, label: "자격증", count: 0 },
          { icon: languageIcon, label: "외국어", count: 0 },
          { icon: globalIcon, label: "해외경험", count: 0 },
        ].map((item) => (
          <div className="exp-item" key={item.label}>
            <div className="exp-icon">
              <img src={item.icon} alt={item.label} />
            </div>
            <div className="exp-label">{item.label}</div>
            <div className="exp-count">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyExperienceStatus;