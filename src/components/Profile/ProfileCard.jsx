import React, { useState } from "react";
import "./ProfileCard.css";

export default function ProfileCard({
  bannerUrl,
  avatarUrl,
  name = "이름",
  title = "직무/역할",
  tagline = "한 줄 소개",
  stats = { activities: 0, followers: 0, scraps: 0 },
  socials = [], // [{ name:'GitHub', href:'#', icon: githubIcon }]
  onEdit,
  onOpen
}) {
  return (
    <div className="profile-card">
      <div className="profile-banner" 
        style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}>
        {/* <button className="open-btn" aria-label="프로필 열기" onClick={onOpen}>→</button> */}
        <img className="avatar" src={avatarUrl} alt={`${name} 아바타`} />
      </div>

      {/* 아바타 + 이름/타이틀/태그라인 */}
      <div className="profile-main">
        <div className="identity">
          <div className="name">{name}</div>
          <div className="title">{title}</div>
          <div className="tagline">{tagline}</div>
        </div>
      </div>

      {/* 통계 */}
      <div className="stats">
        <div className="stat">
          <div className="num">{stats.activities ?? 0}</div>
          <div className="label">활동</div>
        </div>
        <div className="stat">
          <div className="num">{stats.followers ?? 0}</div>
          <div className="label">회고</div>
        </div>
        <div className="stat">
          <div className="num">{stats.scraps ?? 0}</div>
          <div className="label">스크랩</div>
        </div>
      </div>

      {/* 소셜 링크 */}
      <div className="socials">
        {/* {socials.map((s, i) => (
          <a key={i} className="social" href={s.href || "#"} target="_blank" rel="noreferrer">
            {s.icon ? <img src={s.icon} alt={s.name} /> : <span className="pill">{s.name}</span>}
          </a>
        ))} */}
        {/* 플러스 버튼 (추가 링크) */}
        <button className="social add" onClick={() => onEdit?.("socials")}>+</button>
      </div>

      {/* 프로필 수정 */}
      <button className="edit-btn" onClick={() => onEdit?.("profile")}>프로필 수정</button>
    </div>
  );
}