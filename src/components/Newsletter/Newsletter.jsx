// import React, { useState, useEffect } from "react";
// import "./Newsletter.css";
// import ProfileEditer from "./ProfileEditer";
// import linkGithubIcon from "../../assets/icons/linkGithub.png";
// import linkLinkedinIcon from "../../assets/icons/linkLinkedin.png";
// import linkDribbbleIcon from "../../assets/icons/linkDribbble.png";

// export default function Newsletter {

// }
  

//   return (
//     <div className="profile-card">
//       <div className="profile-banner" 
//         style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}>
//         <img className="avatar" src={avatarUrl} alt={`${profile.name} 아바타`} />
//       </div>

//       <div className="profile-main">
//         <div className="identity">
//           <div className="name">{profile.name}</div>
//           <div className="title">{profile.title}</div>
//           <div className="tagline">{profile.tagline}</div>
//         </div>
//       </div>

//       <div className="stats">
//         <div className="stat">
//           <div className="num">{stats.activities ?? 0}</div>
//           <div className="label">활동</div>
//         </div>
//         <div className="stat">
//           <div className="num">{stats.followers ?? 0}</div>
//           <div className="label">회고</div>
//         </div>
//         <div className="stat">
//           <div className="num">{stats.scraps ?? 0}</div>
//           <div className="label">스크랩</div>
//         </div>
//       </div>

//       <div className="socials">
//         {links.map((s) => <a key={s.href} className="social" href={s.href} target="_blank" rel="noreferrer">
//             {s.icon ? <img src={s.icon} alt={s.name} /> : <span className="pill">{s.name}</span>}
//           </a>
//         )}

//       <div className="add-wrapper">
//           <button className="social add" onClick={() => setShowPicker(v => !v)} title="소셜 링크 추가">+</button>
//           {showPicker && (
//               <div className="add-menu" role="menu">
//                   <button className="add-item" onClick={()=>{handleAdd('github'); setShowPicker(false);}}>GitHub</button>
//                   <button className="add-item" onClick={()=>{handleAdd('linkedin'); setShowPicker(false);}}>LinkedIn</button>
//                   <button className="add-item" onClick={()=>{handleAdd('dribbble'); setShowPicker(false);}}>Dribbble</button>
//               </div>
//           )}
//       </div>
//       </div>

//       {/* 프로필 수정 버튼 - 클릭 시 MainPage에 알림 */}
//       <button className="edit-btn" onClick={() => {
//         setEditing(true);
//         onSettingsOpenChange?.(true); // 설정창 열림 알림!
//       }}>프로필 수정</button>
    
//       {editing && (
//         <ProfileEditer
//           initial={profile}
//           onClose={() => {
//             setEditing(false);
//             onSettingsOpenChange?.(false); // 설정창 닫힘 알림!
//           }}
//           onSave={async (data) => {
//             try {
//                 const payload = {
//                     display_name: data.name,
//                     bio: data.tagline,
//                 };
//                 const matchedRoleId = roleIdFromTitle(data.title);
//                     if (matchedRoleId) {
//                         payload.job_role_id = matchedRoleId;
//                     } else if (data.title && data.title !== profile.title) {
//                         alert("알 수 없는 직무명이에요. 직무 목록 중 하나를 입력하면 서버에 반영돼요.");
//                     }   

//                 const updated = await updateMyProfileJson(payload);
//                     setProfile({
//                     name: updated.display_name || data.name,
//                     title: updated.job_role_name || data.title || profile.title,
//                     tagline: updated.bio || data.tagline,
//                     });
//                     onEdit?.("profile:update", payload);
//                 } catch (e) {
//                   alert(e.message || "프로필 저장 실패");
//                 } finally {
//                   setEditing(false);
//                   onSettingsOpenChange?.(false); // 저장 후에도 닫힘 알림!
//                 }
//         }}
//         />
//       )}
//     </div>
//   );
// }