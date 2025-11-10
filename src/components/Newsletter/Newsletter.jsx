import React, { useState, useEffect } from "react";
import "./Newsletter.css";
// import starsIcon from "./images/stars.png";
import cutLogo from "./images/cutlogo.png";
import topArticle1 from "./images/TopArticle1.png";
import topArticle2 from "./images/TopArticle2.png";
import topArticle3 from "./images/TopArticle3.png";

export default function Newsletter () {

  // 추천 글 데이터
  const articles = [
    {
      id: 1,
      title: "회고는 왜 필요할까?",
      thumbnail: topArticle1,
      time: "2025.09.12",
      link: "https://www.instagram.com/p/DOfLYCRkkwJ/?img_index=1" // 링크 추가
    },
    {
      id: 2,
      title: "이력서 쓸 때마다 '자료 찾기 전쟁'",
      thumbnail: topArticle3,
      time: "2025.09.19",
      link: "https://www.instagram.com/p/DOxOcswEudx/?utm_source=ig_web_copy_link" // 링크 추가
    },
    {
      id: 3,
      title: "기록은 보관이 아니라, 이야기가 되어야 한다",
      thumbnail: topArticle2,
      time: "2025.09.26",
      link: "https://www.instagram.com/p/DPEKIZMElRn/?img_index=1" // 링크 추가
    }
  ];

  return (
    <div className="layout">
      {/* 추천 글 섹션 */}
      <div className="recommended-section">
        <div className="section-header">
          <img src={cutLogo} alt="✨" className="stars-icon" />
          <h3>지금 읽기 좋은 글</h3>
        </div>

        <div className="articles-list">
          {articles.map((article) => (
            <a 
              key={article.id} 
              href={article.link}
              className="article-item"
              target="_blank" // 새 탭에서 열기 (선택사항)
              rel="noopener noreferrer" // 보안을 위한 속성
            >
              <div className="article-thumbnail">
                <img src={article.thumbnail} alt={article.title} />
              </div>
              <div className="article-content">
                <h4 className="article-title">{article.title}</h4>
                {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
                <span className="article-time">{article.time}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}