import React, { useState, useEffect } from "react";
import "./ProfileCard.css";
import ProfileEditer from "./ProfileEditer";
import linkGithubIcon from "../../assets/icons/linkGithub.png";
import linkLinkedinIcon from "../../assets/icons/linkLinkedin.png";
import linkDribbbleIcon from "../../assets/icons/linkDribbble.png";
import { fetchMyProfile, updateMyProfileJson } from "../../api.js";

export default function ProfileCard({
  bannerUrl,
  avatarUrl,
  name = "이름",
  title = "직무/역할",
  tagline = "한 줄 소개",
  stats = { activities: 0, followers: 0, scraps: 0 },
  socials = [], // [{ name:'GitHub', href:'#', icon: githubIcon }]
  onEdit,
  onOpen,
}) {
    const SOCIALS = {
        github:   { name: "GitHub",   domain: "github.com",    icon: linkGithubIcon },
        linkedin: { name: "LinkedIn", domain: "linkedin.com",  icon: linkLinkedinIcon },
        dribbble: { name: "Dribbble", domain: "dribbble.com",  icon: linkDribbbleIcon },
    };
    const [showPicker, setShowPicker] = useState(false);

    // 헬퍼: 프로토콜 보정 + 마지막 슬래시 제거
    function normalizeUrl(raw) {
        let url = raw.trim();
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        const u = new URL(url);
        // 트레일링 슬래시 제거 (https://a.com/ -> https://a.com)
        if (u.pathname === "/") u.pathname = "";
        return u.toString();
    }
    
    // 공통 추가 함수
    // function handleAdd(type) {
    async function handleAdd(type) {
        const meta = SOCIALS[type];
        if (!meta) return;
    
        const raw = window.prompt(`${meta.name} 주소를 입력하세요 (예: https://${meta.domain}/username)`);
        if (!raw) return;
    
        let url;
        try { url = normalizeUrl(raw); } 
        catch { alert("유효한 URL이 아닙니다."); return; }
    
        // 도메인 체크 (하위 도메인 허용)
        const host = new URL(url).host; // e.g. www.github.com
        if (!host.endsWith(meta.domain)) {
        alert(`${meta.name} 주소만 입력해 주세요.`);
        return;
        }
    
        // 중복 방지 (정규화된 URL로 비교)
        if (links.some(l => normalizeUrl(l.href) === url)) {
        alert("이미 추가된 링크예요.");
        return;
        }
    
        const link = { name: meta.name, href: url, icon: meta.icon };
        // const next = [...links, link];
        // setLinks(next);
        setLinks(prev => [...prev, link]);
        onEdit?.("socials:add", link); // (선택) 부모 알림
        
        // 2-2) GitHub 추가 시 서버 상태도 true로 (선택)
        // if (type === "github") {
        //   updateMyProfileJson({ github_linked: true }).catch(e => console.warn("github_linked 업데이트 실패:", e));
        // }

        if (type === "github") {
            updateMyProfileJson({ github_linked: true })
            .catch(e => console.warn("github_linked 업데이트 실패:", e));
        }
        if (type === "linkedin" || type === "dribbble") {
            updateMyProfileJson({ website: url })
            .catch(e => console.warn("website 업데이트 실패:", e));
        }        

        
        setShowPicker(false);
    }
    
    const [links, setLinks] = useState(socials);
    useEffect(()=>setLinks(socials), [socials]);
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState({
        name,
        title,
        tagline,
        // avatarUrl,
        // bannerUrl,
      });
    useEffect(() => {
      (async () => {
        try {
          const me = await fetchMyProfile();
          setProfile({
            // API ↔ UI 매핑
            name: me.display_name || me.full_name || name,
            title: me.job_role_name || me.job_role?.name || title,
            tagline: me.bio || tagline,
          });
          // 백엔드 필드로부터 기본 링크 구성(선택)
          const initial = [];
          if (me.website) {
            initial.push({ name: "Website", href: me.website, icon: null });
          }
          if (me.github_linked) {
         // 실제 깃허브 URL을 별도로 저장하진 않으니, 임시로 프로필 루트 제안
            initial.push({ name: "GitHub", href: "https://github.com/", icon: linkGithubIcon });
          }
          if (initial.length) setLinks(prev => [...initial, ...prev.filter      (p => p.name !== "GitHub" && p.name !== "Website")]);
          } catch (e) {
            console.warn(e);
          }
          })();
          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);
       
          // (선택) Website로 저장하고 싶다면 LinkedIn/Dribbble일 때 confirm 후 website 갱신
          // if ((type === "linkedin" || type === "dribbble") && window.confirm("이 링크를 내 웹사이트로 저장할까요?")) {
          //   updateMyProfileJson({ website: url }).catch(e => console.warn("website 업데이트 실패:", e));
          // }
            
          

        
    // const handleAddGithub = () => {
    //     const raw = window.prompt("깃허브 주소를 입력하세요 (예: https://github.com/octocat)");
    //     if (!raw) return;
    
    //     let url = raw.trim();
    //     if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    
    //     // 간단 유효성 검사
    //     try {
    //       new URL(url);
    //     } catch {
    //       alert("유효한 URL이 아닙니다.");
    //       return;
    //     }
    //     if (!url.includes("github.com")) {
    //       alert("깃허브 주소만 입력해 주세요.");
    //       return;
    //     }
    //     if (links.some(l => l.href === url)) {
    //       alert("이미 추가된 링크예요.");
    //       return;
    //     }
    
    //     const link = { name: "GitHub", href: url, icon: linkgithubIcon };
    //     // setLinks(prev => [...prev, link]);
    //     const next = [...links, link];
    //     setLinks(next);
    //     onEdit?.("socials:add", link); // 부모에게 알림(선택)
    //   };
  return (
    <div className="profile-card">
      <div className="profile-banner" 
        style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}>
        
        {/* <button className="open-btn" aria-label="프로필 열기" onClick={onOpen}>→</button> */}
        <img className="avatar" src={avatarUrl} alt={`${profile.name} 아바타`} />
      </div>

      {/* 아바타 + 이름/타이틀/태그라인 */}
      <div className="profile-main">
        <div className="identity">
          {/* <div className="name">{name}</div>
          <div className="title">{title}</div>
          <div className="tagline">{tagline}</div> */}
          <div className="name">{profile.name}</div>
          <div className="title">{profile.title}</div>
          <div className="tagline">{profile.tagline}</div>
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
        {links.map((s) => <a key={s.href} className="social" href={s.href} target="_blank" rel="noreferrer">
        {/* {links.map((s, i) => (
          <a key={i} className="social" href={s.href} target="_blank" rel="noreferrer"> */}
            {s.icon ? <img src={s.icon} alt={s.name} /> : <span className="pill">{s.name}</span>}
          </a>
        )}
        {/* 플러스 버튼: 깃허브 추가 */}
        {/* <button className="social add" onClick={handleAddGithub} title="깃허브 주소 추가">+</button> */}

      <div className="add-wrapper">
          <button className="social add" onClick={() => setShowPicker(v => !v)} title="소셜 링크 추가">+</button>
          {showPicker && (
              <div className="add-menu" role="menu">
                  <button className="add-item" onClick={()=>{handleAdd('github'); setShowPicker(false);}}>GitHub</button>
                  <button className="add-item" onClick={()=>{handleAdd('linkedin'); setShowPicker(false);}}>LinkedIn</button>
                  <button className="add-item" onClick={()=>{handleAdd('dribbble'); setShowPicker(false);}}>Dribbble</button>
              </div>
          )}
      </div>
      </div>

      {/* 프로필 수정 */}
      <button className="edit-btn" onClick={() => setEditing(true)}>프로필 수정</button>
      {/* <button className="edit-btn" onClick={() => onEdit?.("profile")}>프로필 수정</button> */}
    
      {editing && (
        <ProfileEditer
          initial={profile}
          onClose={() => setEditing(false)}
        //   onSave={(data) => {
        //     setProfile(data);           
        //     setEditing(false);
        //     onEdit?.("profile:update", data); 
          onSave={async (data) => {
            try {
                // 2-3) 저장 시 PATCH (display_name, bio만 보냄)
                const payload = {
                    display_name: data.name,
                    bio: data.tagline,
                    // job_role는 API가 id만 받으므로 지금은 텍스트(title)는 서버에 반영하지 않음
                };
                const updated = await updateMyProfileJson(payload);
                    setProfile({
                    name: updated.display_name || data.name,
                    title: updated.job_role_name || profile.title,
                    tagline: updated.bio || data.tagline,
                    });
                    onEdit?.("profile:update", payload);
                } catch (e) {
                  alert(e.message || "프로필 저장 실패");
                } finally {
                  setEditing(false);
                }
        }}
        />
      )}
    </div>
  );
}