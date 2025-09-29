import React, { useState, useEffect } from "react";

// 모달은 바깥 클릭/ESC로 안 닫히게: 닫기는 버튼으로만!
export default function ProfileEditer({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    title: initial?.title || "",
    tagline: initial?.tagline || "",
  });

  useEffect(() => {
      setForm({
          name: initial?.name || "",
          title: initial?.title || "",
          tagline: initial?.tagline || "",
      });
  }, [initial]);

  const [saving, setSaving] = useState(false);

  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      onSave?.(form);
      if(onSave) {
        await onSave(form); //비동기저장기다림
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
        onClick={(e) => e.stopPropagation()} // 백드롭 클릭 방지
      >
        <div className="modal-header">
          <h3 id="profile-edit-title">프로필 수정</h3>
        </div>

        <form id="__profileEditForm" className="modal-body" onSubmit={submit}>
          <label style={{ display: "block", marginBottom: 10 }}>
            이름
            <input
              value={form.name}
              onChange={change("name")}
              placeholder="이름"
              style={{ width: "100%", marginTop: 6 }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 10 }}>
            직무/역할
            <input
              value={form.title}
              onChange={change("title")}
              placeholder="예: Motion designer"
              style={{ width: "100%", marginTop: 6 }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 10 }}>
            한 줄 소개
            <textarea
              value={form.tagline}
              onChange={change("tagline")}
              rows={3}
              placeholder="소개를 입력하세요"
              style={{ width: "100%", marginTop: 6, resize: "vertical" }}
            />
          </label>

          {/* <label style={{ display: "block", marginBottom: 10 }}>
            아바타 이미지 URL
            <input
              value={form.avatarUrl}
              onChange={change("avatarUrl")}
              placeholder="https://..."
              style={{ width: "100%", marginTop: 6 }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 10 }}>
            배너 이미지 URL
            <input
              value={form.bannerUrl}
              onChange={change("bannerUrl")}
              placeholder="https://..."
              style={{ width: "100%", marginTop: 6 }}
            />
          </label> */}

          <button type="button" className="btn" disabled title="준비 중">
              아바타 선택 (준비중)
          </button>

          {/* 미리보기 살짝 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="avatar preview"
                style={{ width: 40, height: 40, borderRadius: 999, objectFit: "cover", background: "#eee" }}
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />
            ) : null}
            <span style={{ fontSize: 12, color: "#6b7280" }}>미리보기</span>
          </div>
        </form>

        <div className="modal-actions">
          {/* <button type="button" className="btn" onClick={onClose}> */}
          <button type="button" onClick={onClose}>
          <img src="/cancelButton.png"></img>
          </button>
          <button type="submit" form="__profileEditForm" className="btn primary" disabled={saving}>
            <img src="/storeButton.png"></img>
            {saving ? "저장 중…" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
