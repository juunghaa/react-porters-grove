import React, { useState } from "react";
import "./LeftPanel.css";

import homeIcon from "../../assets/icons/Home.png";
import plusIcon from "../../assets/icons/Plus.png";
import archiveIcon from "../../assets/icons/Archive.png";
import browseIcon from "../../assets/icons/Browse.png";
import githubIcon from "../../assets/icons/Github.png";
import settingsIcon from "../../assets/icons/Settings.png";
import logoutIcon from "../../assets/icons/Logout.png";
import logoIcon from "../../assets/icons/logo.png";
import LogoutButton from "../Auth/LogoutButton";

const LeftPanel = ({ isCollapsed, onToggle, onCreateNew, onHomeClick, onLogout}) => {
  return (
    <div className={`left-panel ${isCollapsed ? "collapsed" : ""}`}>
      <div className="panel-header">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">
              <img src={logoIcon} alt="아카이브" className="logo-img" />
            </div>
          </div>
          <button className="toggle-btn" onClick={onToggle}>
            <span className={`toggle-icon ${isCollapsed ? "collapsed" : ""}`}>
              {isCollapsed ? "→" : "←"}
            </span>
          </button>
        </div>
      </div>

      <div className="panel-content">
        <nav className="navigation">
          <div className="nav-item" onClick={onHomeClick}>
            <div className="nav-icon">
              <img src={homeIcon} alt="홈" className="icon-img" />
            </div>

            {!isCollapsed && <span className="nav-text">홈</span>}
          </div>

          <div className="nav-item" onClick={onCreateNew}>
            {" "}
            {/*새 페이지 만들기 이동 */}
            <div className="nav-icon">
              <img src={plusIcon} alt="추가하기" className="icon-img" />
            </div>
            {!isCollapsed && <span className="nav-text">새로 만들기</span>}
          </div>

          <div className="nav-item">
            <div className="nav-icon">
              <img src={archiveIcon} alt="아카이브" className="icon-img" />
            </div>
            {!isCollapsed && <span className="nav-text">아카이브</span>}
          </div>

          <div className="nav-item">
            <div className="nav-icon">
              <img src={browseIcon} alt="아카이브" className="icon-img" />
            </div>
            {!isCollapsed && <span className="nav-text">둘러보기</span>}
          </div>
        </nav>

        {!isCollapsed && (
          <div className="bottom-section">
            <div className="github-status">
              <div className="github-item">
                <div className="github-icon">
                  <img src={githubIcon} alt="깃허브" className="icon-img" />
                </div>
                <span className="github-text">Github 연동 중</span>
                <div className="status-indicator active"></div>
              </div>
            </div>

            <div className="settings-section">
              <div className="nav-item">
                <div className="nav-icon">
                  <img src={settingsIcon} alt="설정" className="icon-img" />
                </div>
                <span className="nav-text">설정</span>
              </div>

              {/* <div className="nav-item">
                <div className="nav-icon">
                  <img src={logoutIcon} alt="로그아웃" className="icon-img" />
                </div>
                <span className="nav-text">로그아웃</span>
              </div> */}
                <LogoutButton onLogout={onLogout} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
