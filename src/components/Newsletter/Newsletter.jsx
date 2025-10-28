import React, { useState, useEffect } from "react";
import "./Newsletter.css";
import starsIcon from "./images/stars.png";
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
      time: "6시간 전",
    },
    {
      id: 2,
      title: "기록은 보관이 아니라, 이야기가 되어야 한다",
      thumbnail: topArticle2,
      time: "3일 전",
    },
    {
      id: 3,
      title: "유료 전환에 성공한 MVP 기획 프로세스 공개",
      thumbnail: topArticle3,
      time: "2025.09.29",
    }
  ];

  return (
    <div className="layout">
      {/* 추천 글 섹션 */}
      <div className="recommended-section">
        <div className="section-header">
          <img src={starsIcon} alt="✨" className="stars-icon" />
          <h3>지금 읽기 좋은 글</h3>
        </div>

        <div className="articles-list">
          {articles.map((article) => (
            <div key={article.id} className="article-item">
              <div className="article-thumbnail">
                <img src={article.thumbnail} alt={article.title} />
              </div>
              <div className="article-content">
                <h4 className="article-title">{article.title}</h4>
                {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
                <span className="article-time">{article.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}