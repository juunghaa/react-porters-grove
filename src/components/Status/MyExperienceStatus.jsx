import React, { useState, useEffect } from "react";
import "./MyExperienceStatus.css";
// 이미지 import
import projectIcon from "../../assets/image/flag.png";
import portfolioIcon from "../../assets/image/star.png";
import careerIcon from "../../assets/image/career.png";
import awardIcon from "../../assets/image/award.png";
import certificateIcon from "../../assets/image/certificate.png";
import languageIcon from "../../assets/image/language.png";
import globalIcon from "../../assets/image/overseas.png";

const MyExperienceStatus = ({ isPanelCollapsed, onGoToChooseOption }) => {
  const [counts, setCounts] = useState({
    project: 0,
    portfolio: 0,
    career: 0,
    award: 0,
    certificate: 0,
    language: 0,
    global: 0,
  });

  // ⭐ API에서 데이터 가져오기
  useEffect(() => {
    const fetchCounts = async () => {
      const access = localStorage.getItem("access");
      const headers = {
        "Authorization": `Bearer ${access}`,
        "Content-Type": "application/json",
      };

      try {
        const [
          activitiesRes,
          careersRes,
          awardsRes,
          certificationsRes,
          foreignlangsRes,
          globalexpsRes,
          portfoliosRes,
        ] = await Promise.allSettled([
          fetch("/api/activities/", { headers }),
          fetch("/api/careers/", { headers }),
          fetch("/api/awards/", { headers }),
          fetch("/api/certifications/", { headers }),
          fetch("/api/foreignlangs/", { headers }),
          fetch("/api/globalexps/", { headers }),
          fetch("/api/portfolios/", { headers }),
        ]);

        const getCount = async (result) => {
          if (result.status === "fulfilled" && result.value.ok) {
            const data = await result.value.json();
            if (Array.isArray(data)) return data.length;
            if (data.results) return data.results.length;
            if (data.count !== undefined) return data.count;
            return 0;
          }
          return 0;
        };

        const [
          projectCount,
          careerCount,
          awardCount,
          certificateCount,
          languageCount,
          globalCount,
          portfolioCount,
        ] = await Promise.all([
          getCount(activitiesRes),
          getCount(careersRes),
          getCount(awardsRes),
          getCount(certificationsRes),
          getCount(foreignlangsRes),
          getCount(globalexpsRes),
          getCount(portfoliosRes),
        ]);

        setCounts({
          project: projectCount,
          portfolio: portfolioCount,
          career: careerCount,
          award: awardCount,
          certificate: certificateCount,
          language: languageCount,
          global: globalCount,
        });

      } catch (error) {
        console.error("경험 현황 로딩 실패:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className={`experience-status ${isPanelCollapsed ? 'expanded' : ''}`}>
      <div className="experience-header">
        <h2 className="experience-title">나의 경험 현황</h2>
        <p className="experience-subtext">
          아직 등록된 경험이 없어요. 지금 바로 남겨볼까요?{" "}
          <span className="highlight" onClick={onGoToChooseOption} style={{ cursor: 'pointer' }}>
            + 경험 정리하기
          </span>
        </p>
      </div>

      <div className="experience-grid">
        {[
          { icon: projectIcon, label: "프로젝트", count: counts.project },
          { icon: portfolioIcon, label: "포트폴리오", count: counts.portfolio },
          { icon: careerIcon, label: "경력", count: counts.career },
          { icon: awardIcon, label: "수상", count: counts.award },
          { icon: certificateIcon, label: "자격증", count: counts.certificate },
          { icon: languageIcon, label: "외국어", count: counts.language },
          { icon: globalIcon, label: "해외경험", count: counts.global },
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