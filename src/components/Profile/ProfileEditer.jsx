import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./ProfileEditer.css";
import defaultAvatar from "../../assets/icons/avatar.png";
import ConfirmExitPopup from "./ConfirmExitPopup";
import ConfirmSavePopup from "./ConfirmSavePopup";
import ToastMessage from "./ToastMessage";

export default function ProfileEditer({ initial, onSave, onClose, isPanelCollapsed = false }) {
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
    graduationStatus: initial?.graduationStatus || "",
    majors: initial?.majors || [{ majorType: "", majorName: "" }],
    gpa: initial?.gpa || "",
    gpaTotal: initial?.gpaTotal || "",
  });

  // 날짜 input에 대한 ref
  const birthdayInputRef = useRef(null);
  const admissionInputRef = useRef(null);
  const graduationInputRef = useRef(null);

  // 팝업 표시 상태
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
      graduationStatus: initial?.graduationStatus || "",
      majors: initial?.majors || [{ majorType: "", majorName: "" }],
      gpa: initial?.gpa || "",
      gpaTotal: initial?.gpaTotal || "",
    });
  }, [initial]);

  const [saving, setSaving] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && onClose && !showConfirmPopup && !showSavePopup) {
        handleCancelClick();
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, showConfirmPopup, showSavePopup]);

  // 취소 버튼 클릭 핸들러
  const handleCancelClick = () => {
    setShowConfirmPopup(true);
  };

  // 팝업에서 "계속 작성하기" 클릭
  const handleContinue = () => {
    setShowConfirmPopup(false);
  };

  // 팝업에서 "저장하고 나가기" 클릭
  const handleSaveAndExit = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(form);
      }
      setShowConfirmPopup(false);
      if (onClose) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  // 팝업 닫기 (엑스 버튼)
  const handlePopupClose = () => {
    setShowConfirmPopup(false);
  };

  // 저장 버튼 클릭 핸들러
  const handleSaveClick = () => {
    setShowSavePopup(true);
  };

  // 저장 팝업에서 "취소" 클릭
  const handleSaveCancel = () => {
    setShowSavePopup(false);
  };

  // 저장 팝업에서 "저장" 클릭
  const handleConfirmSave = async () => {
    setSaving(true);
    setShowSavePopup(false); // 저장 팝업 먼저 닫기
    
    try {
      if (onSave) {
        await onSave(form);
      }
      
      // 저장 성공 후 토스트 표시
      setShowToast(true);
      
      // 토스트가 표시된 후 2.5초 뒤에 에디터 닫기
      setTimeout(() => {
        setShowToast(false);
        if (onClose) {
          onClose();
        }
      }, 2500);
    } catch (error) {
      console.error("저장 실패:", error);
      // 저장 실패 시 토스트 숨기고 에디터는 유지
      setShowToast(false);
    } finally {
      setSaving(false);
    }
  };

  // 저장 팝업 닫기 (엑스 버튼)
  const handleSavePopupClose = () => {
    setShowSavePopup(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    handleSaveClick(); // 폼 제출 시 저장 팝업 표시
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

  // 전공 추가
  const addMajor = () => {
    setForm(f => ({ ...f, majors: [...f.majors, { majorType: "", majorName: "" }] }));
  };

  // 전공 삭제
  const removeMajor = (index) => {
    if (form.majors.length > 1) {
      setForm(f => ({ ...f, majors: f.majors.filter((_, i) => i !== index) }));
    }
  };

  // 전공 업데이트
  const updateMajor = (index, field, value) => {
    const newMajors = [...form.majors];
    newMajors[index][field] = value;
    setForm(f => ({ ...f, majors: newMajors }));
  };

  // 날짜 포맷 변환 함수 (YYYY-MM-DD -> YYYY.MM.DD)
  const formatDateToDisplay = (dateString) => {
    if (!dateString) return "";
    return dateString.replace(/-/g, ".");
  };

  // 날짜 포맷 변환 함수 (YYYY.MM.DD -> YYYY-MM-DD)
  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    return dateString.replace(/\./g, "-");
  };

  // 캘린더 아이콘 클릭 핸들러
  const handleCalendarClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.showPicker(); // 날짜 선택기 열기
    }
  };

  return createPortal(
    <>
      <div 
        className={`profile-editor-backdrop ${isPanelCollapsed ? 'panel-collapsed' : ''}`}
        onClick={handleCancelClick}
      >
        <div className="profile-editor" onClick={(e) => e.stopPropagation()}>
          {/* 취소 버튼 - 왼쪽 상단 고정 */}
          <img 
            src="/cancelButton.png" 
            className="cancel-button" 
            onClick={handleCancelClick}
            alt="취소"
          />
          
          {/* 저장 버튼 - 오른쪽 상단 고정 */}
          <img 
            src="/saveButton.png" 
            className="save-button" 
            onClick={handleSaveClick} 
            disabled={saving}
            alt="저장"
          />

          {/* 스크롤 가능한 영역 */}
          <div className="profile-editor-scroll">
            <div className="profile-editor-scroll-inner">
              {/* 회색 박스 - 폼 컨텐츠 */}
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
                    <div className="form-group-inner">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="이름을 입력하세요"
                    />
                    </div>
                  </div>
                </div>

                {/* 소개 */}
                <div className="form-group">
                  <label>소개</label>
                  <div className="form-group-inner">
                  <textarea
                    value={form.tagline}
                    onChange={(e) => setForm(f => ({ ...f, tagline: e.target.value }))}
                    placeholder="나를 표현하는 소개글을 적어보세요"
                    rows={3}
                  />
                  </div>
                </div>

                <div className="form-group">
                  <label>직무</label>
                  <div className="form-group-inner">
                  <input
                    value={form.tagline}
                    onChange={(e) => setForm(f => ({ ...f, tagline: e.target.value }))}
                    placeholder="지금 하고 있거나 희망하는 직무를 입력하세요"
                    rows={3}
                  />
                  </div>
                </div>

                {/* 생년월일 + 전화번호 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>생년월일</label>
                    <div className="form-group-inner" style={{ position: 'relative' }}>
                      <input
                        ref={birthdayInputRef}
                        type="text"
                        value={form.birthday}
                        onChange={(e) => setForm(f => ({ ...f, birthday: e.target.value }))}
                        placeholder="YYYY.MM.DD"
                        onFocus={(e) => {
                          e.target.type = 'date';
                          e.target.value = formatDateToInput(form.birthday);
                        }}
                        onBlur={(e) => {
                          if (e.target.value) {
                            setForm(f => ({ ...f, birthday: formatDateToDisplay(e.target.value) }));
                          }
                          e.target.type = 'text';
                        }}
                        style={{ 
                          paddingRight: '40px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          birthdayInputRef.current.type = 'date';
                          birthdayInputRef.current.value = formatDateToInput(form.birthday);
                          birthdayInputRef.current.focus();
                          setTimeout(() => birthdayInputRef.current.showPicker(), 0);
                        }}
                        style={{
                          position: 'absolute',
                          right: '20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                          <path d="M6.70227 2.17969C6.24227 2.17969 5.86894 2.55302 5.86894 3.01302C4.02644 3.01302 2.50977 4.50719 2.50977 6.34635V8.01302L2.5356 14.6797C2.5356 16.518 4.0281 18.013 5.86894 18.013H14.2023C16.0431 18.013 17.5356 16.5205 17.5356 14.6797L17.5098 8.01302V6.34635C17.5098 4.50385 16.0414 3.01302 14.2023 3.01302C14.2023 2.55302 13.8298 2.17969 13.3689 2.17969C12.9089 2.17969 12.5356 2.55302 12.5356 3.01302H7.5356C7.5356 2.55302 7.1631 2.17969 6.70227 2.17969ZM5.86894 4.67969C5.86894 5.13969 6.24227 5.51302 6.70227 5.51302C7.1631 5.51302 7.5356 5.13969 7.5356 4.67969H12.5356C12.5356 5.13969 12.9089 5.51302 13.3689 5.51302C13.8298 5.51302 14.2023 5.13969 14.2023 4.67969C15.1164 4.67969 15.8431 5.41969 15.8431 6.34635V7.17969C14.2398 7.17969 5.77977 7.17969 4.17643 7.17969V6.34635C4.17643 5.43219 4.94227 4.67969 5.86894 4.67969ZM4.17643 8.84635C5.77977 8.84635 14.2398 8.84635 15.8431 8.84635L15.8689 14.6797C15.8689 15.5972 15.1231 16.3464 14.2023 16.3464H5.86894C4.94894 16.3464 4.20227 15.6005 4.20227 14.6797L4.17643 8.84635Z" fill="#9F9F9F"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>전화번호</label>
                    <div className="form-group-inner">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="010-0000-0000"
                    />
                    </div>
                  </div>
                </div>

                {/* 이메일 */}
                <div className="form-group">
                  <label>이메일</label>
                  <div className="form-group-inner">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="grove@gmail.com"
                  />
                  </div>
                </div>

                {/* 대표 링크 */}
                <div className="form-group">
                  <label>대표 링크</label>
                  <div className="links-container">
                    {form.links.map((link, i) => (
                      <div key={i} className="link-item">
                        <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path d="M9 9C6.084 9 4 10.737 4 14C4 17.263 6.084 19 9 19H12C14.916 19 17 17.263 17 14C17 13.904 17 13.124 17 13C17 11.667 15 11.667 15 13C15 13.132 15 14.063 15 14.063C14.975 16.083 13.863 17 12 17H9C7.116 17 6 16.07 6 14C6 11.93 7.116 11 9 11H10C10.552 11 11 10.552 11 10C11 9.448 10.552 9 10 9H9ZM16 9C14.579 9 13.422 9.40201 12.562 10.156C11.508 11.081 11 12.451 11 14C11 14.129 11 14.296 11 15C11 15.552 11.448 16 12 16C12.552 16 13 15.552 13 15C13 14.296 13 14.129 13 14C13 12.983 13.301 12.16 13.875 11.656C14.35 11.239 15.043 11 16 11H19C21.07 11 22 12.116 22 14C22 15.884 21.07 17 19 17H18C17.448 17 17 17.448 17 18C17 18.552 17.448 19 18 19H19C22.263 19 24 16.916 24 14C24 11.084 22.263 9 19 9H16Z" fill="#9F9F9F"/>
                        </svg>
                        </span>
                        <span style={{color: "#D9D9D9", paddingTop: "3px"}}>|</span>
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => updateLink(i, e.target.value)}
                          placeholder={i === 0 ? "https://..." : "https://..."}
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
                      링크 추가하기
                    </button>
                  </div>
                </div>

                </form>
                </div>


                <div className="profile-editor-content">
                {/* 학력 정보 */}
                  <h2>학력 정보</h2>
                <div className="education-section">
                  <div className="form-group">
                    <label>학교명</label>
                    <div className="form-group-inner">
                    <input
                      type="text"
                      value={form.schoolEmail}
                      onChange={(e) => setForm(f => ({ ...f, schoolEmail: e.target.value }))}
                      placeholder="학교 이름을 입력하세요"
                    />
                    </div>
                  </div>

                  {/* 입학년도 + 졸업년도 + 졸업여부 */}
                  <div className="date-row">
                    <div className="form-group">
                      <label>입학년도</label>
                      <div className="form-group-inner" style={{ position: 'relative' }}>
                        <input
                          ref={admissionInputRef}
                          type="text"
                          value={form.admissionDate}
                          onChange={(e) => setForm(f => ({ ...f, admissionDate: e.target.value }))}
                          placeholder="YYYY.MM"
                          onFocus={(e) => {
                            e.target.type = 'month';
                            e.target.value = formatDateToInput(form.admissionDate);
                          }}
                          onBlur={(e) => {
                            if (e.target.value) {
                              setForm(f => ({ ...f, admissionDate: formatDateToDisplay(e.target.value) }));
                            }
                            e.target.type = 'text';
                          }}
                          style={{ 
                            paddingRight: '40px'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            admissionInputRef.current.type = 'month';
                            admissionInputRef.current.value = formatDateToInput(form.admissionDate);
                            admissionInputRef.current.focus();
                            setTimeout(() => admissionInputRef.current.showPicker(), 0);
                          }}
                          style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M6.70227 2.17969C6.24227 2.17969 5.86894 2.55302 5.86894 3.01302C4.02644 3.01302 2.50977 4.50719 2.50977 6.34635V8.01302L2.5356 14.6797C2.5356 16.518 4.0281 18.013 5.86894 18.013H14.2023C16.0431 18.013 17.5356 16.5205 17.5356 14.6797L17.5098 8.01302V6.34635C17.5098 4.50385 16.0414 3.01302 14.2023 3.01302C14.2023 2.55302 13.8298 2.17969 13.3689 2.17969C12.9089 2.17969 12.5356 2.55302 12.5356 3.01302H7.5356C7.5356 2.55302 7.1631 2.17969 6.70227 2.17969ZM5.86894 4.67969C5.86894 5.13969 6.24227 5.51302 6.70227 5.51302C7.1631 5.51302 7.5356 5.13969 7.5356 4.67969H12.5356C12.5356 5.13969 12.9089 5.51302 13.3689 5.51302C13.8298 5.51302 14.2023 5.13969 14.2023 4.67969C15.1164 4.67969 15.8431 5.41969 15.8431 6.34635V7.17969C14.2398 7.17969 5.77977 7.17969 4.17643 7.17969V6.34635C4.17643 5.43219 4.94227 4.67969 5.86894 4.67969ZM4.17643 8.84635C5.77977 8.84635 14.2398 8.84635 15.8431 8.84635L15.8689 14.6797C15.8689 15.5972 15.1231 16.3464 14.2023 16.3464H5.86894C4.94894 16.3464 4.20227 15.6005 4.20227 14.6797L4.17643 8.84635Z" fill="#9F9F9F"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>졸업년도</label>
                      <div className="form-group-inner" style={{ position: 'relative' }}>
                        <input
                          ref={graduationInputRef}
                          type="text"
                          value={form.graduationDate}
                          onChange={(e) => setForm(f => ({ ...f, graduationDate: e.target.value }))}
                          placeholder="YYYY.MM"
                          onFocus={(e) => {
                            e.target.type = 'month';
                            e.target.value = formatDateToInput(form.graduationDate);
                          }}
                          onBlur={(e) => {
                            if (e.target.value) {
                              setForm(f => ({ ...f, graduationDate: formatDateToDisplay(e.target.value) }));
                            }
                            e.target.type = 'text';
                          }}
                          style={{ 
                            paddingRight: '40px'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            graduationInputRef.current.type = 'month';
                            graduationInputRef.current.value = formatDateToInput(form.graduationDate);
                            graduationInputRef.current.focus();
                            setTimeout(() => graduationInputRef.current.showPicker(), 0);
                          }}
                          style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M6.70227 2.17969C6.24227 2.17969 5.86894 2.55302 5.86894 3.01302C4.02644 3.01302 2.50977 4.50719 2.50977 6.34635V8.01302L2.5356 14.6797C2.5356 16.518 4.0281 18.013 5.86894 18.013H14.2023C16.0431 18.013 17.5356 16.5205 17.5356 14.6797L17.5098 8.01302V6.34635C17.5098 4.50385 16.0414 3.01302 14.2023 3.01302C14.2023 2.55302 13.8298 2.17969 13.3689 2.17969C12.9089 2.17969 12.5356 2.55302 12.5356 3.01302H7.5356C7.5356 2.55302 7.1631 2.17969 6.70227 2.17969ZM5.86894 4.67969C5.86894 5.13969 6.24227 5.51302 6.70227 5.51302C7.1631 5.51302 7.5356 5.13969 7.5356 4.67969H12.5356C12.5356 5.13969 12.9089 5.51302 13.3689 5.51302C13.8298 5.51302 14.2023 5.13969 14.2023 4.67969C15.1164 4.67969 15.8431 5.41969 15.8431 6.34635V7.17969C14.2398 7.17969 5.77977 7.17969 4.17643 7.17969V6.34635C4.17643 5.43219 4.94227 4.67969 5.86894 4.67969ZM4.17643 8.84635C5.77977 8.84635 14.2398 8.84635 15.8431 8.84635L15.8689 14.6797C15.8689 15.5972 15.1231 16.3464 14.2023 16.3464H5.86894C4.94894 16.3464 4.20227 15.6005 4.20227 14.6797L4.17643 8.84635Z" fill="#9F9F9F"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>졸업 여부</label>
                      <div className="form-group-inner">
                      <select 
                        value={form.graduationStatus}
                        onChange={(e) => setForm(f => ({ ...f, graduationStatus: e.target.value }))}
                      >
                        <option value="" disabled>
                          졸업 여부를 선택하세요
                        </option>
                        <option value="재학중">재학중</option>
                        <option value="졸업">졸업</option>
                        <option value="수료">수료</option>
                        <option value="졸업예정">졸업예정</option>
                        <option value="중퇴">중퇴</option>
                        <option value="휴학">휴학</option>
                        <option value="자퇴">자퇴</option>
                      </select>
                      </div>
                    </div>
                  </div>

                  {/* 전공 목록 */}
                  {form.majors.map((major, index) => (
                    <div key={index}>
                      <div className="major-row">
                        <div className="form-group">
                          <label>전공 구분</label>
                          <div className="form-group-inner">
                          <select
                            value={major.majorType}
                            onChange={(e) => updateMajor(index, 'majorType', e.target.value)}
                          >
                            <option value="" disabled>
                              전공 구분을 선택하세요
                            </option>
                            <option value="주전공">주전공</option>
                            <option value="부전공">부전공</option>
                            <option value="이중전공">이중전공</option>
                            <option value="복수전공">복수전공</option>
                          </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>전공</label>
                          <div className="form-group-inner" style={{ position: 'relative' }}>
                            <input
                              type="text"
                              value={major.majorName}
                              onChange={(e) => updateMajor(index, 'majorName', e.target.value)}
                              placeholder="전공명 입력"
                            />
                            {form.majors.length > 1 && (
                              <button
                                type="button"
                                className="remove-link"
                                onClick={() => removeMajor(index)}
                                aria-label="전공 삭제"
                                style={{ 
                                  position: 'absolute', 
                                  right: '10px', 
                                  top: '50%', 
                                  transform: 'translateY(-50%)'
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 전공 추가 버튼 */}
                  <button type="button" className="add-major-button" onClick={addMajor}>
                    전공 추가하기
                  </button>

                  {/* 학점 + 총점 */}
                  <div className="score-row">
                    <div className="form-group">
                      <label>학점</label>
                      <div className="form-group-inner">
                      <input
                        type="text"
                        value={form.gpa}
                        onChange={(e) => setForm(f => ({ ...f, gpa: e.target.value }))}
                        placeholder="학점을 입력하세요"
                      />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>총점</label>
                      <div className="form-group-inner">
                      <select
                        value={form.gpaTotal}
                        onChange={(e) => setForm(f => ({ ...f, gpaTotal: e.target.value }))}
                      >
                        <option value="" disabled>
                          총점을 선택하세요
                        </option>
                        <option value="4.5">4.5</option>
                        <option value="4.3">4.3</option>
                        <option value="4.0">4.0</option>
                        <option value="100">100</option>
                      </select>
                      </div>
                    </div>
                  </div>

                </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* 확인 팝업 */}
      {showConfirmPopup && (
        <ConfirmExitPopup
          onContinue={handleContinue}
          onSaveAndExit={handleSaveAndExit}
          onClose={handlePopupClose}
        />
      )}

      {/* 저장 확인 팝업 */}
      {showSavePopup && (
        <ConfirmSavePopup
          onCancel={handleSaveCancel}
          onConfirmSave={handleConfirmSave}
          onClose={handleSavePopupClose}
        />
      )}

      {/* 토스트 메시지 */}
      {showToast && (
        <ToastMessage
          message="변경사항이 저장되었어요"
          onClose={() => setShowToast(false)}
        />
      )}
    </>,
    document.body
  );
}