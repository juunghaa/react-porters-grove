import React, { useState, useEffect } from "react";
import "./ProfileCard.css";
import ProfileEditer from "./ProfileEditer";
import ToastMessage from "./ToastMessage";
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

    // ⭐ stats 상태 추가
    const [statsCounts, setStatsCounts] = useState({
      activities: 0,
      specs: 0,
      portfolios: 0
    });

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

    // ⭐ stats API 호출
    useEffect(() => {
      const fetchStats = async () => {
        const access = localStorage.getItem('access');
        const headers = {
          'Authorization': `Bearer ${access}`,
          'Content-Type': 'application/json',
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
            fetch('/api/activities/', { headers }),
            fetch('/api/careers/', { headers }),
            fetch('/api/awards/', { headers }),
            fetch('/api/certifications/', { headers }),
            fetch('/api/foreignlangs/', { headers }),
            fetch('/api/globalexps/', { headers }),
            fetch('/api/portfolios/', { headers }),
          ]);

          const getCount = async (result) => {
            if (result.status === 'fulfilled' && result.value.ok) {
              const data = await result.value.json();
              if (Array.isArray(data)) return data.length;
              if (data.results) return data.results.length;
              if (data.count !== undefined) return data.count;
              return 0;
            }
            return 0;
          };

          const [
            activitiesCount,
            careersCount,
            awardsCount,
            certificationsCount,
            foreignlangsCount,
            globalexpsCount,
            portfoliosCount,
          ] = await Promise.all([
            getCount(activitiesRes),
            getCount(careersRes),
            getCount(awardsRes),
            getCount(certificationsRes),
            getCount(foreignlangsRes),
            getCount(globalexpsRes),
            getCount(portfoliosRes),
          ]);

          const totalSpecCount = careersCount + awardsCount + certificationsCount + foreignlangsCount + globalexpsCount;

          setStatsCounts({
            activities: activitiesCount,
            specs: totalSpecCount,
            portfolios: portfoliosCount
          });

        } catch (error) {
          console.error('stats 로딩 실패:', error);
        }
      };

      fetchStats();
    }, []);

    useEffect(() => {
      (async () => {
        try {
          const me = await fetchMyProfile();
          
          // ✅ 화면 표시용 프로필 - 최신 명세 기준
          setProfile({
            name: me.full_name || name,
            title: me.job_role_name || title,
            tagline: me.bio || tagline,
          });
          
          // ✅ 에디터용 전체 프로필 데이터 (날짜 형식 변환: YYYY-MM-DD → YYYY.MM.DD)
          const formatDate = (dateStr) => {
            if (!dateStr) return "";
            return dateStr.replace(/-/g, ".");
          };
          
          setFullProfile({
            avatar: me.avatar || null,
            name: me.full_name || "",
            tagline: me.bio || "",
            birthday: formatDate(me.birth_date) || "",
            phone: me.phone_number || "",
            email: me.contact_email || "",
            links: me.links?.map(item => item.url) || [""],
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

        {/* ⭐ API 연동된 stats */}
        <div className="stats">
          <div className="stat">
            <div className="num">{statsCounts.activities}</div>
            <div className="label">경험</div>
          </div>
          <div className="stat">
            <div className="num">{statsCounts.specs}</div>
            <div className="label">스펙</div>
          </div>
          <div className="stat">
            <div className="num">{statsCounts.portfolios}</div>
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
            initial={fullProfile}
            onClose={() => {
              setEditing(false);
              onSettingsOpenChange?.(false);
            }}
            onSave={async (data) => {
              try {
                // ✅ 최신 명세에 맞춘 payload 구조
                const payload = {
                  full_name: data.name,
                  bio: data.tagline,
                  birth_date: data.birthday,  
                  phone_number: data.phone,
                  contact_email: data.email,
                  school_name: data.schoolName,
                  admission_date: data.admissionDate || "",
                  graduation_date: data.graduationDate || "",
                  graduation_status: data.graduationStatus,
                  gpa: data.gpa ? data.gpa : "",
                  gpa_total: data.gpaTotal ? data.gpaTotal : "",
                  job_role_name: data.jobRole,  // ✅ 텍스트 그대로 저장
                };
                
                // ✅ 전공 정보 추가
                if (data.majors && data.majors.length > 0) {
                  payload.major_items = data.majors
                    .filter(m => m.majorType && m.majorName)
                    .map((m, index) => ({
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
            
                // ✅ JSON으로 전송
                const updated = await updateMyProfileJson(payload);
                
                // ✅ 최신 명세 기준으로 프로필 업데이트
                setProfile({
                  name: updated.full_name || data.name,
                  title: updated.job_role_name || data.jobRole,
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