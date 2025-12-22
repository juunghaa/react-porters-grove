import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EmptyBox from "./EmptyBox";
import FullBox from "./FullBox";
import ExperienceArchiveBox from "./ExperienceArchiveBox";
import SpecTabContent from "./SpecTabContent";
import PortfolioTabContent from "./PortfolioTabContent";
import SpecCard from "./SpecCard";
import PortfolioCard from "./PortfolioCard";
import greenFlag from "./images/greenflag.png";
import greenLight from "./images/greenlight.png";
import greenCheck from "./images/greencheck.png";
import grayFlag from "./images/grayflag.png";
import grayLight from "./images/graylight.png";
import grayCheck from "./images/graycheck.png";
import "./ArchivePage.css";

const ArchivePage = ({ isPanelCollapsed, onGoToChooseOption }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ 스펙 데이터
  const [specCount, setSpecCount] = useState(0);
  const [firstSpec, setFirstSpec] = useState(null);
  const [firstSpecType, setFirstSpecType] = useState(null);

  // ⭐ 포트폴리오 데이터
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [firstPortfolio, setFirstPortfolio] = useState(null);

  const [experiences, setExperiences] = useState({
    ongoing: [],
    spec: [],
    completed: [],
  });

  const scrollContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0,
  });

  // ⭐ 모든 데이터 로드
  useEffect(() => {
    const loadAllData = async () => {
      const access = localStorage.getItem("access");
      const headers = {
        Authorization: `Bearer ${access}`,
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

        const getData = async (result) => {
          if (result.status === "fulfilled" && result.value.ok) {
            const data = await result.value.json();
            if (Array.isArray(data)) return data;
            if (data.results) return data.results;
            return [];
          }
          return [];
        };

        // 활동 데이터
        const activitiesData = await getData(activitiesRes);
        setActivities(activitiesData);

        // 스펙 데이터
        const [careers, awards, certifications, foreignlangs, globalexps] =
          await Promise.all([
            getData(careersRes),
            getData(awardsRes),
            getData(certificationsRes),
            getData(foreignlangsRes),
            getData(globalexpsRes),
          ]);

        const totalSpecCount =
          careers.length +
          awards.length +
          certifications.length +
          foreignlangs.length +
          globalexps.length;
        setSpecCount(totalSpecCount);

        // ⭐ 첫 번째 스펙 찾기 (전체 탭 표시용)
        if (careers.length > 0) {
          setFirstSpec(careers[0]);
          setFirstSpecType("career");
        } else if (awards.length > 0) {
          setFirstSpec(awards[0]);
          setFirstSpecType("award");
        } else if (certifications.length > 0) {
          setFirstSpec(certifications[0]);
          setFirstSpecType("certification");
        } else if (foreignlangs.length > 0) {
          setFirstSpec(foreignlangs[0]);
          setFirstSpecType("foreignlang");
        } else if (globalexps.length > 0) {
          setFirstSpec(globalexps[0]);
          setFirstSpecType("globalexp");
        }

        // 포트폴리오 데이터
        const portfoliosData = await getData(portfoliosRes);
        setPortfolioCount(portfoliosData.length);
        if (portfoliosData.length > 0) {
          setFirstPortfolio(portfoliosData[0]);
        }

        setExperiences({
          ongoing: activitiesData,
          spec: Array(totalSpecCount).fill({}),
          completed: Array(portfoliosData.length).fill({}),
        });
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // 스크롤 상태 업데이트
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      setScrollState({
        scrollLeft: container.scrollLeft,
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth,
      });
    };

    const timer = setTimeout(updateScrollState, 100);
    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [activities, activeTab]);

  const handleScrollbarClick = (e) => {
    const scrollbar = e.currentTarget;
    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = scrollbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollbarWidth = rect.width;

    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    const thumbWidth = Math.max(
      (clientWidth / scrollWidth) * scrollbarWidth,
      50
    );
    const scrollableTrackWidth = scrollbarWidth - thumbWidth;
    const clickRatio = Math.max(
      0,
      Math.min(1, (clickX - thumbWidth / 2) / scrollableTrackWidth)
    );

    container.scrollLeft = clickRatio * maxScroll;
  };

  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const container = scrollContainerRef.current;
    const scrollbar = e.currentTarget.parentElement;
    if (!container || !scrollbar) return;

    const startX = e.clientX;
    const startScrollLeft = container.scrollLeft;
    const scrollbarRect = scrollbar.getBoundingClientRect();
    const scrollbarWidth = scrollbarRect.width;

    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    const thumbWidth = Math.max(
      (clientWidth / scrollWidth) * scrollbarWidth,
      50
    );
    const scrollableTrackWidth = scrollbarWidth - thumbWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const scrollDelta = (deltaX / scrollableTrackWidth) * maxScroll;
      container.scrollLeft = Math.max(
        0,
        Math.min(maxScroll, startScrollLeft + scrollDelta)
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getThumbStyle = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollState;

    if (scrollWidth <= clientWidth) {
      return { display: "none" };
    }

    const thumbWidthPercent = Math.max((clientWidth / scrollWidth) * 100, 10);
    const maxScrollLeft = scrollWidth - clientWidth;
    const scrollPercent = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
    const thumbLeftPercent = scrollPercent * (100 - thumbWidthPercent);

    return {
      width: `${thumbWidthPercent}%`,
      left: `${thumbLeftPercent}%`,
    };
  };

  const showScrollbar =
    activities.length > 4 && scrollState.scrollWidth > scrollState.clientWidth;

  const getListClassName = () => {
    if (activities.length <= 4) {
      return "archive-list no-scroll";
    }
    return "archive-list has-scroll";
  };

  const boxConfigs = {
    ongoing: {
      titleIcon: greenFlag,
      title: "나의 경험",
      count: activities.length,
      emptyIcon: grayFlag,
      emptyText: "아직 정리된 경험이 없어요",
      subText: "지금 바로 경험을 등록해보세요",
      buttonText: "경험 추가하기",
    },
    spec: {
      titleIcon: greenLight,
      title: "나의 스펙",
      count: specCount,
      emptyIcon: grayLight,
      emptyText: "아직 정리된 스펙이 없어요",
      subText: "지금 바로 내 역량을 기록해보세요",
      buttonText: "스펙 추가하기",
    },
    completed: {
      titleIcon: greenCheck,
      title: "나의 포트폴리오",
      count: portfolioCount,
      emptyIcon: grayCheck,
      emptyText: "아직 완료된 포트폴리오가 없어요",
      subText: "포트폴리오를 만들어보세요",
      buttonText: "포트폴리오 만들기",
    },
  };

  const tabs = [
    {
      id: "all",
      label: "전체",
      count: activities.length + specCount + portfolioCount,
    },
    { id: "ongoing", label: "나의 경험", count: activities.length },
    { id: "spec", label: "나의 스펙", count: specCount },
    { id: "completed", label: "나의 포트폴리오", count: portfolioCount },
  ];

  const handleMenuClick = (type) => {
    console.log(`${type} 메뉴 클릭`);
  };

  // ⭐ 경험 상세 페이지로 이동 (수정됨)
  const handleGoToExperienceEditor = (activityId) => {
    navigate(`/project/${activityId}`);
  };

  // ⭐ 전체 탭에서 첫 번째 경험 카드 클릭 시 이동
  const handleFirstExperienceClick = () => {
    if (activities.length > 0 && activities[0].id) {
      navigate(`/project/${activities[0].id}`);
    }
  };

  // ⭐ FullBox에 onClick 추가
  <FullBox onClick={handleFirstExperienceClick} />;

  // ⭐ 전체 탭용 박스 렌더링 (수정됨)
  const renderBox = (type) => {
    const config = boxConfigs[type];

    // 나의 경험 박스
    if (type === "ongoing") {
      if (activities.length > 0) {
        return (
          <FullBox
            key={type}
            isPanelCollapsed={isPanelCollapsed}
            config={config}
            experienceData={activities[0]}
            onMenuClick={() => handleMenuClick(type)}
            onClick={handleFirstExperienceClick} // ⭐ 클릭 시 상세 페이지로 이동
          />
        );
      } else {
        return (
          <EmptyBox
            key={type}
            isPanelCollapsed={isPanelCollapsed}
            config={config}
            onGoToChooseOption={onGoToChooseOption}
            onMenuClick={() => handleMenuClick(type)}
          />
        );
      }
    }

    // ⭐ 나의 스펙 박스 - SpecCard 사용
    if (type === "spec") {
      if (specCount > 0 && firstSpec) {
        return (
          <div
            key={type}
            className={`box-status ${isPanelCollapsed ? "expanded" : ""}`}
          >
            <div className="box-content">
              <div className="full-box-header">
                <div className="full-box-title">
                  <img
                    src={config.titleIcon}
                    alt="icon"
                    className="full-box-title-icon"
                  />
                  <h3>{config.title}</h3>
                  <span className="full-box-count">{config.count}</span>
                </div>
                <div className="full-box-actions">
                  <button
                    className="full-box-menu-btn"
                    onClick={() => handleMenuClick(type)}
                  >
                    <span>⋯</span>
                  </button>
                </div>
              </div>
              <SpecCard spec={firstSpec} type={firstSpecType} />
            </div>
          </div>
        );
      } else {
        return (
          <EmptyBox
            key={type}
            isPanelCollapsed={isPanelCollapsed}
            config={config}
            onGoToChooseOption={onGoToChooseOption}
            onMenuClick={() => handleMenuClick(type)}
          />
        );
      }
    }

    // ⭐ 나의 포트폴리오 박스 - PortfolioCard 사용
    if (type === "completed") {
      if (portfolioCount > 0 && firstPortfolio) {
        return (
          <div
            key={type}
            className={`box-status ${isPanelCollapsed ? "expanded" : ""}`}
          >
            <div className="box-content">
              <div className="full-box-header">
                <div className="full-box-title">
                  <img
                    src={config.titleIcon}
                    alt="icon"
                    className="full-box-title-icon"
                  />
                  <h3>{config.title}</h3>
                  <span className="full-box-count">{config.count}</span>
                </div>
                <div className="full-box-actions">
                  <button
                    className="full-box-menu-btn"
                    onClick={() => handleMenuClick(type)}
                  >
                    <span>⋯</span>
                  </button>
                </div>
              </div>
              <PortfolioCard portfolio={firstPortfolio} onClick={() => {}} />
            </div>
          </div>
        );
      } else {
        return (
          <EmptyBox
            key={type}
            isPanelCollapsed={isPanelCollapsed}
            config={config}
            onGoToChooseOption={onGoToChooseOption}
            onMenuClick={() => handleMenuClick(type)}
          />
        );
      }
    }

    return null;
  };

  const getVisibleBoxTypes = () => {
    if (activeTab === "all") {
      return ["ongoing", "spec", "completed"];
    }
    return [activeTab];
  };

  const renderExperienceTab = () => {
    if (loading) {
      return <div className="archive-loading">로딩 중...</div>;
    }

    if (activities.length === 0) {
      return (
        <div className="archive-boxes">
          <EmptyBox
            isPanelCollapsed={isPanelCollapsed}
            config={boxConfigs.ongoing}
            onGoToChooseOption={onGoToChooseOption}
            onMenuClick={() => handleMenuClick("ongoing")}
          />
        </div>
      );
    }

    return (
      <div className="archive-experience-wrapper">
        {showScrollbar && (
          <div
            className="archive-scrollbar-track"
            onClick={handleScrollbarClick}
          >
            <div
              className="archive-scrollbar-thumb"
              style={getThumbStyle()}
              onMouseDown={handleThumbMouseDown}
            />
          </div>
        )}

        <div className={getListClassName()} ref={scrollContainerRef}>
          {activities.map((activity) => (
            <ExperienceArchiveBox
              key={activity.id}
              activity={activity}
              isPanelCollapsed={isPanelCollapsed}
              onGoToEditor={() => handleGoToExperienceEditor(activity.id)} // ⭐ 클릭 시 상세 페이지로 이동
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="archive-page">
      <div className="archive-header">
        <h1 className="archive-title">아카이브</h1>
        <p className="archive-subtitle">
          나의 모든 경험과 스펙, 포트폴리오를 한눈에 확인하세요
        </p>
      </div>

      <div className="archive-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`archive-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span className="archive-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="archive-content">
        {activeTab === "ongoing" ? (
          renderExperienceTab()
        ) : activeTab === "spec" ? (
          <SpecTabContent onGoToChooseOption={onGoToChooseOption} />
        ) : activeTab === "completed" ? (
          <PortfolioTabContent onGoToChooseOption={onGoToChooseOption} />
        ) : (
          <div className="archive-boxes">
            {getVisibleBoxTypes().map((type) => renderBox(type))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
