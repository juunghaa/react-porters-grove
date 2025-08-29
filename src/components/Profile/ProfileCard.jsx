import React, { useState } from "react";
import "./ProfileCard.css";
import githubIcon from "../../assets/icons/Github.png"; // 아이콘 경로 맞춰주세요

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
    const [links, setLinks] = useState(socials);
    const handleAddGithub = () => {
        const raw = window.prompt("깃허브 주소를 입력하세요 (예: https://github.com/octocat)");
        if (!raw) return;
    
        let url = raw.trim();
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    
        // 간단 유효성 검사
        try {
          new URL(url);
        } catch {
          alert("유효한 URL이 아닙니다.");
          return;
        }
        if (!url.includes("github.com")) {
          alert("깃허브 주소만 입력해 주세요.");
          return;
        }
        if (links.some(l => l.href === url)) {
          alert("이미 추가된 링크예요.");
          return;
        }
    
        const link = { name: "GitHub", href: url, icon: githubIcon };
        setLinks(prev => [...prev, link]);
        onEdit?.("socials:add", link); // 부모에게 알림(선택)
      };
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
        {links.map((s, i) => (
          <a key={i} className="social" href={s.href} target="_blank" rel="noreferrer">
            {s.icon ? <img src={s.icon} alt={s.name} /> : <span className="pill">{s.name}</span>}
          </a>
        ))}
        {/* 플러스 버튼: 깃허브 추가 */}
        <button className="social add" onClick={handleAddGithub} title="깃허브 주소 추가">+</button>
      </div>

      {/* 프로필 수정 */}
      <button className="edit-btn" onClick={() => onEdit?.("profile")}>프로필 수정</button>
    </div>
  );
}