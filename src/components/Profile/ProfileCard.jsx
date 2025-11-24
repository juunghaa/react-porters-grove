import React, { useState, useEffect } from "react";
import "./ProfileCard.css";
import ProfileEditer from "./ProfileEditer";
import ToastMessage from "./ToastMessage";
import linkGithubIcon from "../../assets/icons/linkGithub.png";
import linkLinkedinIcon from "../../assets/icons/linkLinkedin.png";
import linkDribbbleIcon from "../../assets/icons/linkDribbble.png";
import { fetchMyProfile, updateMyProfileJson, fetchJobRoles } from "../../api.js";

export default function ProfileCard({
  bannerUrl,
  avatarUrl,
  name = "이름",
  title = "직무/역할",
  tagline = "한 줄 소개",
  stats = { activities: 0, followers: 0, scraps: 0 },
  socials = [],
  onEdit,
  onOpen,
  onSettingsOpenChange,
  triggerEdit,
  onEditTriggered,
  isPanelCollapsed = false,
}) {
    const SOCIALS = {
        github:   { name: "GitHub",   domain: "github.com",    icon: linkGithubIcon },
        linkedin: { name: "LinkedIn", domain: "linkedin.com",  icon: linkLinkedinIcon },
        dribbble: { name: "Dribbble", domain: "dribbble.com",  icon: linkDribbbleIcon },
    };
    const [showPicker, setShowPicker] = useState(false);
    const [showToast, setShowToast] = useState(false); // 🍞 토스트 상태 추가!

    function normalizeUrl(raw) {
        let url = raw.trim();
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        const u = new URL(url);
        if (u.pathname === "/") u.pathname = "";
        return u.toString();
    }
    
    async function handleAdd(type) {
        const meta = SOCIALS[type];
        if (!meta) return;
    
        const raw = window.prompt(`${meta.name} 주소를 입력하세요 (예: https://${meta.domain}/username)`);
        if (!raw) return;
    
        let url;
        try { url = normalizeUrl(raw); } 
        catch { alert("유효한 URL이 아닙니다."); return; }
    
        const host = new URL(url).host;
        if (!host.endsWith(meta.domain)) {
        alert(`${meta.name} 주소만 입력해 주세요.`);
        return;
        }
    
        if (links.some(l => normalizeUrl(l.href) === url)) {
        alert("이미 추가된 링크예요.");
        return;
        }
    
        const link = { name: meta.name, href: url, icon: meta.icon };
        setLinks(prev => [...prev, link]);
        onEdit?.("socials:add", link);

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
    
    // 외부에서 트리거되면 에디터 열기
    useEffect(() => {
      if (triggerEdit) {
        setEditing(true);
        onSettingsOpenChange?.(true);
        onEditTriggered?.();
      }
    }, [triggerEdit, onSettingsOpenChange, onEditTriggered]);

    const [profile, setProfile] = useState({
        name,
        title,
        tagline,
      });

    const [roles, setRoles] = useState([]);

    function roleIdFromTitle(t) {
        if (!t) return null;
        const q = t.trim().toLowerCase();
    
        const exact = roles.find(r => r.name.toLowerCase() === q);
        if (exact) return exact.id;
    
        const contains = roles.filter(r => r.name.toLowerCase().includes(q));
        if (contains.length === 1) return contains[0].id;
    
        return null;
    }
    

    useEffect(() => {
      fetchJobRoles()
        .then(setRoles)
        .catch((e) => console.warn("직무 목록 조회 실패:", e));
    }, []);


    useEffect(() => {
      (async () => {
        try {
          const me = await fetchMyProfile();
          setProfile({
            name: me.display_name || me.full_name || name,
            title: me.job_role_name || me.job_role?.name || title,
            tagline: me.bio || tagline,
          });
          const initial = [];
          if (me.website) {
            let host = "";
            try { host = new URL(me.website).host; } catch {}
                if (host.endsWith("linkedin.com")) {
                initial.push({ name: "LinkedIn", href: me.website, icon: linkLinkedinIcon });
            } else if (host.endsWith("dribbble.com")) {
                initial.push({ name: "Dribbble", href: me.website, icon: linkDribbbleIcon });
            } else {
                initial.push({ name: "Website", href: me.website, icon: null });
            }
        }

          if (me.github_linked) {
            initial.push({ name: "GitHub", href: "https://github.com/", icon: linkGithubIcon });
          }
          if (initial.length) setLinks(prev => [...initial, ...prev.filter(p => p.name !== "GitHub" && p.name !== "Website")]);
          } catch (e) {
            console.warn(e);
          }
          })();
          // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);

  return (
    <>
      <div className="profile-card">
        <div className="profile-banner" 
          style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}>
          <img className="avatar" src={avatarUrl} alt={`${profile.name} 아바타`} />
        </div>

        <div className="profile-main">
          <div className="identity">
            <div className="name">{profile.name}</div>
            <div className="title">{profile.title}</div>
            <div className="tagline">{profile.tagline}</div>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="num">{stats.activities ?? 0}</div>
            <div className="label">경험</div>
          </div>
          <div className="stat">
            <div className="num">{stats.followers ?? 0}</div>
            <div className="label">스펙</div>
          </div>
          <div className="stat">
            <div className="num">{stats.scraps ?? 0}</div>
            <div className="label">포트폴리오</div>
          </div>
        </div>

        <div className="socials">
          {links.map((s) => <a key={s.href} className="social" href={s.href} target="_blank" rel="noreferrer">
              {s.icon ? <img src={s.icon} alt={s.name} /> : <span className="pill">{s.name}</span>}
            </a>
          )}

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

        {/* 프로필 수정 버튼 */}
        <button className="edit-btn" onClick={() => {
          setEditing(true);
          onSettingsOpenChange?.(true);
        }}>프로필 수정</button>
      
        {editing && (
          <ProfileEditer
            isPanelCollapsed={isPanelCollapsed}
            initial={profile}
            onClose={() => {
              setEditing(false);
              onSettingsOpenChange?.(false);
            }}
            onSave={async (data) => {
              try {
                const payload = {
                  full_name: data.name,  // ✅ display_name → full_name
                  bio: data.tagline,
                  birth_date: data.birthday,
                  phone_number: data.phone,
                  contact_email: data.email,
                  school_name: data.schoolName,  // ✅ schoolEmail → schoolName
                  admission_date: data.admissionDate,
                  graduation_date: data.graduationDate,
                };
                
                const matchedRoleId = roleIdFromTitle(data.jobRole);  // ✅ 직무 ID
                if (matchedRoleId) {
                  payload.job_role_id = matchedRoleId;
                }
                
                // ✅ 링크 형식 변환
                if (data.links && data.links.length > 0) {
                  payload.link_items = data.links
                    .filter(link => link.trim())  // 빈 링크 제거
                    .map((link, index) => ({
                      label: new URL(link).hostname.replace('www.', ''),  // 도메인을 label로
                      url: link,
                      order: index
                    }));
                }

                  const updated = await updateMyProfileJson(payload);
                      setProfile({
                      name: updated.display_name || data.name,
                      title: updated.job_role_name || data.title || profile.title,
                      tagline: updated.bio || data.tagline,
                      });
                      onEdit?.("profile:update", payload);
                      
                      // 🍞 저장 성공 시 토스트 표시!
                      setShowToast(true);
                      
                      // 2.5초 후 토스트 숨기기
                      setTimeout(() => {
                        setShowToast(false);
                      }, 2500);
                  } catch (e) {
                    alert(e.message || "프로필 저장 실패");
                  } finally {
                    setEditing(false);
                    onSettingsOpenChange?.(false);
                  }
          }}
          />
        )}
      </div>

      {/* 🍞 토스트 메시지 - ProfileCard에서 관리 */}
      {showToast && (
        <ToastMessage
          message="변경사항이 저장되었어요"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}