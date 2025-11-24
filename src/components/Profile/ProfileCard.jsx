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
    const [showToast, setShowToast] = useState(false);

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

    // ✅ 전체 프로필 데이터 저장 (날짜 정보 포함)
    const [fullProfile, setFullProfile] = useState(null);

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
          
          // 화면 표시용 프로필 (기존)
          setProfile({
            name: me.display_name || me.full_name || name,
            title: me.job_role_name || me.job_role?.name || title,
            tagline: me.bio || tagline,
          });
          
          // ✅ 에디터용 전체 프로필 데이터 (날짜 형식 변환: YYYY-MM-DD → YYYY.MM.DD)
          const formatDate = (dateStr) => {
            if (!dateStr) return "";
            return dateStr.replace(/-/g, ".");
          };
          
          setFullProfile({
            avatar: me.avatar || null,
            name: me.display_name || me.full_name || "",
            tagline: me.bio || "",
            birthday: formatDate(me.birth_date) || "",
            phone: me.phone_number || "",
            email: me.contact_email || "",
            links: me.link_items?.map(item => item.url) || [""],
            schoolName: me.school_name || "",
            admissionDate: formatDate(me.admission_date) || "",
            graduationDate: formatDate(me.graduation_date) || "",
            graduationStatus: me.graduation_status || "",
            majors: me.majors?.length > 0 
              ? me.majors.map(m => ({ majorType: m.major_type, majorName: m.major_name }))
              : [{ majorType: "", majorName: "" }],
            gpa: me.gpa?.toString() || "",
            gpaTotal: me.gpa_total?.toString() || "",
            jobRole: me.job_role_name || "",
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
      
        {editing && fullProfile && (  // ✅ fullProfile이 있을 때만 표시
          <ProfileEditer
            isPanelCollapsed={isPanelCollapsed}
            initial={fullProfile}  // ✅ profile → fullProfile
            onClose={() => {
              setEditing(false);
              onSettingsOpenChange?.(false);
            }}
            onSave={async (data) => {
              try {
                const payload = {
                  full_name: data.name,
                  bio: data.tagline,
                  birth_date: data.birthday || "",  // 빈값은 ""로
                  phone_number: data.phone,
                  contact_email: data.email,
                  school_name: data.schoolName,
                  admission_date: data.admissionDate || "",
                  graduation_date: data.graduationDate || "",
                  graduation_status: data.graduationStatus,
                  gpa: data.gpa ? data.gpa : "",  // ✅ 빈값은 ""로
                  gpa_total: data.gpaTotal ? data.gpaTotal : "",  // ✅ 빈값은 ""로
                };
                
                // ✅ 직무 ID 매칭
                const matchedRoleId = roleIdFromTitle(data.jobRole);
                if (matchedRoleId) {
                  payload.job_role_id = matchedRoleId;
                }
                
                // ✅ 전공 정보 추가 (필드명 수정: majors → major_items)
                if (data.majors && data.majors.length > 0) {
                  payload.major_items = data.majors  // ✅ 이름 수정!
                    .filter(m => m.majorType && m.majorName)
                    .map((m, index) => ({  // ✅ order 추가
                      major_type: m.majorType,
                      major_name: m.majorName,
                      order: index
                    }));
                }
                
                // ✅ 링크 형식 변환
                if (data.links && data.links.length > 0) {
                  payload.link_items = data.links
                    .filter(link => link.trim())
                    .map((link, index) => {
                      try {
                        const url = new URL(link);
                        return {
                          label: url.hostname.replace('www.', ''),
                          url: link,
                          order: index
                        };
                      } catch {
                        return {
                          label: 'Link',
                          url: link,
                          order: index
                        };
                      }
                    });
                }
            
                // 일반 JSON으로 전송
                const updated = await updateMyProfileJson(payload);
                
                setProfile({
                  name: updated.full_name || updated.display_name || data.name,
                  title: updated.job_role_name || updated.job_role?.name || data.jobRole,
                  tagline: updated.bio || data.tagline,
                });
                
                // ✅ fullProfile도 업데이트
                setFullProfile({
                  ...fullProfile,
                  ...data,
                });
                
                onEdit?.("profile:update", payload);
                
                // 🍞 저장 성공 시 토스트 표시
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2500);
                
              } catch (e) {
                console.error("프로필 저장 실패:", e);
                alert(e.message || "프로필 저장 실패");
              } finally {
                setEditing(false);
                onSettingsOpenChange?.(false);
              }
            }}
          />
        )}
      </div>

      {/* 🍞 토스트 메시지 */}
      {showToast && (
        <ToastMessage
          message="변경사항이 저장되었어요"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}