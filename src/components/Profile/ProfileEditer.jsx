import React, { useState, useEffect } from "react";
import "./ProfileEditer.css";
import defaultAvatar from "../../assets/icons/avatar.png";

export default function ProfileEditer({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    avatar: initial?.avatar || null,
    name: initial?.name || "",
    tagline: initial?.tagline || "",
    birthday: initial?.birthday || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    links: initial?.links || [""],
    schoolEmail: initial?.schoolEmail || "",
    admissionDate: initial?.admissionDate || "",
    graduationDate: initial?.graduationDate || "",
  });

  useEffect(() => {
    setForm({
      avatar: initial?.avatar || null,
      name: initial?.name || "",
      tagline: initial?.tagline || "",
      birthday: initial?.birthday || "",
      phone: initial?.phone || "",
      email: initial?.email || "",
      links: initial?.links || [""],
      schoolEmail: initial?.schoolEmail || "",
      admissionDate: initial?.admissionDate || "",
      graduationDate: initial?.graduationDate || "",
    });
  }, [initial]);

  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (onSave) {
        await onSave(form);
      }
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setForm(f => ({ ...f, links: [...f.links, ""] }));
  };

  const removeLink = (index) => {
    setForm(f => ({ ...f, links: f.links.filter((_, i) => i !== index) }));
  };

  const updateLink = (index, value) => {
    const newLinks = [...form.links];
    newLinks[index] = value;
    setForm(f => ({ ...f, links: newLinks }));
  };

  return (
    <div className="profile-editor-backdrop" onClick={onClose}>
      <div className="profile-editor" onClick={(e) => e.stopPropagation()}>
        {/* 상단 헤더 - 취소/저장 */}
        <div className="profile-editor-header">
          <img src="/cancelButton.png" className="cancel-button" onClick={onClose}/>

          <img src="/saveButton.png" className="save-button" onClick={submit} disabled={saving}/>
        </div>

        {/* 본문 */}
        <div className="profile-editor-content">
          <h2>프로필 정보</h2>

          <form onSubmit={submit}>
            {/* 프로필 사진 + 이름 */}
            <div className="avatar-section">
              <label className="avatar-upload">
                {form.avatar ? (
                  <img
                    src={typeof form.avatar === "string" ? form.avatar : URL.createObjectURL(form.avatar)}
                    alt="프로필 사진"
                    className="avatar-preview"
                  />
                ) : (
                  // <div className="avatar-placeholder"></div>
                  <img src={defaultAvatar} className="avatar-placeholder" alt="기본 아바타" />
                )}
                <span className="change-avatar-text">사진 변경하기</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm(f => ({ ...f, avatar: file }));
                  }}
                />
              </label>

              <div className="name-field form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="김윤주"
                />
              </div>
            </div>

            {/* 소개 */}
            <div className="form-group">
              <label>소개</label>
              <textarea
                value={form.tagline}
                onChange={(e) => setForm(f => ({ ...f, tagline: e.target.value }))}
                placeholder="안녕하세요 ✿ ✿"
                rows={3}
              />
            </div>

            {/* 생년월일 + 전화번호 */}
            <div className="form-row">
              <div className="form-group">
                <label>생년월일</label>
                <input
                  type="text"
                  value={form.birthday}
                  onChange={(e) => setForm(f => ({ ...f, birthday: e.target.value }))}
                  placeholder="yyyy.mm.dd"
                />
              </div>
              <div className="form-group">
                <label>전화번호</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="grove@gmail.com"
              />
            </div>

            {/* 대표 링크 */}
            <div className="form-group">
              <label>대표 링크</label>
              <div className="links-container">
                {form.links.map((link, i) => (
                  <div key={i} className="link-item">
                    <span className="link-icon">🔗</span>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => updateLink(i, e.target.value)}
                      placeholder={i === 0 ? "Notion" : "https://..."}
                    />
                    <button
                      type="button"
                      className="remove-link"
                      onClick={() => removeLink(i)}
                      aria-label="링크 삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" className="add-link" onClick={addLink}>
                  링크 추가
                </button>
              </div>
            </div>

            {/* 학력 정보 */}
            <div className="education-section">
              <h2>학력 정보</h2>

              <div className="form-group">
                <label>학교명</label>
                <input
                  type="email"
                  value={form.schoolEmail}
                  onChange={(e) => setForm(f => ({ ...f, schoolEmail: e.target.value }))}
                  placeholder="grove@gmail.com"
                />
              </div>

              {/* 입학년도 + 졸업년도 */}
              <div className="date-row">
                <div className="form-group">
                  <label>입학년도</label>
                  <input
                    type="text"
                    value={form.admissionDate}
                    onChange={(e) => setForm(f => ({ ...f, admissionDate: e.target.value }))}
                    placeholder="2022.03"
                  />
                </div>
                <div className="form-group">
                  <label>졸업년도</label>
                  <input
                    type="text"
                    value={form.graduationDate}
                    onChange={(e) => setForm(f => ({ ...f, graduationDate: e.target.value }))}
                    placeholder="2026.02"
                  />
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}


// import React, { useState, useEffect } from "react";
// import "./ProfileEditer.css"; // 스타일 따로

// export default function ProfileEditer({ initial, onSave, onClose }) {
//   const [form, setForm] = useState({
//     avatar: initial?.avatar || null,
//     name: initial?.name || "",
//     tagline: initial?.tagline || "",
//     birthday: initial?.birthday || "",
//     phone: initial?.phone || "",
//     email: initial?.email || "",
//     links: initial?.links || [""],
//     school: initial?.school || "",
//   });

//   useEffect(() => {
//     setForm({
//       avatar: initial?.avatar || null,
//       name: initial?.name || "",
//       tagline: initial?.tagline || "",
//       birthday: initial?.birthday || "",
//       phone: initial?.phone || "",
//       email: initial?.email || "",
//       links: initial?.links || [""],
//       school: initial?.school || "",
//     });
//   }, [initial]);

//   const [saving, setSaving] = useState(false);

//   const submit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       if (onSave) {
//         await onSave(form);
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="profile-editor-backdrop" onClick={onClose}>
//     <div className="profile-editor">
//       <h2>프로필 정보</h2>
//       <form onSubmit={submit}>
//         {/* 프로필 사진 */}
//         <label className="avatar-upload">
//           {form.avatar ? (
//             <img
//               src={typeof form.avatar === "string" ? form.avatar : URL.createObjectURL(form.avatar)}
//               alt="avatar preview"
//               className="avatar-preview"
//             />
//           ) : (
//             <span className="avatar-placeholder">+</span>
//           )}
//           <input
//             type="file"
//             accept="image/*"
//             style={{ display: "none" }}
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) setForm((f) => ({ ...f, avatar: file }));
//             }}
//           />
//         </label>

//         {/* 이름 */}
//         <label>
//           이름
//           <input
//             type="text"
//             value={form.name}
//             onChange={(e) => setForm(f => ({...f, name: e.target.value}))}
//             placeholder="이름"
//           />
//         </label>

//         {/* 소개 */}
//         <label>
//           소개
//           <textarea
//             value={form.tagline}
//             onChange={(e) => setForm(f => ({...f, tagline: e.target.value}))}
//             placeholder="안녕하세요 ✿ ✿"
//             rows={3}
//           />
//         </label>

//         {/* 생년월일 + 전화번호 */}
//         <div style={{ display: "flex", gap: "1rem" }}>
//           <label style={{ flex: 1 }}>
//             생년월일
//             <input
//               type="date"
//               value={form.birthday}
//               onChange={(e) => setForm(f => ({...f, birthday: e.target.value}))}
//             />
//           </label>
//           <label style={{ flex: 1 }}>
//             전화번호
//             <input
//               type="tel"
//               value={form.phone}
//               onChange={(e) => setForm(f => ({...f, phone: e.target.value}))}
//               placeholder="010-0000-0000"
//             />
//           </label>
//         </div>

//         {/* 이메일 */}
//         <label>
//           이메일
//           <input
//             type="email"
//             value={form.email}
//             onChange={(e) => setForm(f => ({...f, email: e.target.value}))}
//             placeholder="example@email.com"
//           />
//         </label>

//         {/* 대표 링크 */}
//         <div>
//           <label>대표 링크</label>
//           {form.links.map((link, i) => (
//             <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
//               <input
//                 type="url"
//                 value={link}
//                 onChange={(e) => {
//                   const newLinks = [...form.links];
//                   newLinks[i] = e.target.value;
//                   setForm(f => ({...f, links: newLinks}));
//                 }}
//                 placeholder="https://..."
//                 style={{ flex: 1 }}
//               />
//               <button type="button" onClick={() => {
//                 setForm(f => ({...f, links: f.links.filter((_, idx) => idx !== i)}));
//               }}>X</button>
//             </div>
//           ))}
//           <button type="button" onClick={() => setForm(f => ({...f, links: [...f.links, ""]}))}>
//             + 링크 추가
//           </button>
//         </div>

//         {/* 학력 */}
//         <label>
//           학력 정보
//           <input
//             type="text"
//             value={form.school}
//             onChange={(e) => setForm(f => ({...f, school: e.target.value}))}
//             placeholder="학교명을 입력하세요"
//           />
//         </label>

//         {/* 버튼 */}
//         <div className="actions" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
//           <button type="button" className="close-button" onClick={onClose}>
//             취소
//           </button>
//           <button type="submit" disabled={saving}>
//             {saving ? "저장 중…" : "저장"}
//           </button>
//         </div>
//       </form>
//     </div>
//     </div>
//   );
// }