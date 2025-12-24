import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Plus, Minus } from "lucide-react";
import "./Activity.css";

const Activity = () => {
  const { activityId, subActivityId } = useParams(); // ⭐ subActivityId 추가
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // ⭐ 수정 모드 여부
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // 1단계: 기본 정보
    activityName: "",
    startDate: "",
    endDate: "",
    organization: "",
    roles: {
      planning: 0,
      design: 0,
      development: 0,
    },
    customRoles: {},

    // 2단계: 태그 설정
    primaryTags: "",
    secondaryTags: "",

    // 3단계: 활동 상세
    activityGoal: "",
    mainRole: "",

    // 4단계: 성과 & 결과
    achievement: "",
    lesson: "",

    // 5단계: 자료첨부
    files: [],
    linkUrl: "",
  });

  const steps = [
    { id: 1, label: "기본 정보" },
    { id: 2, label: "태그 설정" },
    { id: 3, label: "활동 상세" },
    { id: 4, label: "성과 & 결과" },
    { id: 5, label: "자료첨부" },
  ];

  // ⭐ 기존 세부활동 데이터 불러오기
  useEffect(() => {
    const fetchSubActivityData = async () => {
      if (!subActivityId) return;

      setLoading(true);
      setIsEditMode(true);

      try {
        const access = localStorage.getItem("access");
        
        // 세부활동 상세 조회 API
        const response = await fetch(
          `/api/activities/${activityId}/sub-activities/${subActivityId}/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("세부활동 조회 실패");
        }

        const data = await response.json();
        console.log("📥 불러온 세부활동 데이터:", data);

        // ⭐ API 데이터를 formData 형식으로 변환
        const convertedData = convertApiToFormData(data);
        setFormData(convertedData);
        
      } catch (error) {
        console.error("❌ 세부활동 불러오기 실패:", error);
        // 실패해도 새로 작성할 수 있도록
      } finally {
        setLoading(false);
      }
    };

    fetchSubActivityData();
  }, [activityId, subActivityId]);

  // ⭐ 임시저장 불러오기 (새 활동일 때만)
  useEffect(() => {
    if (subActivityId) return; // 수정 모드면 임시저장 불러오지 않음

    const draftKey = activityId
      ? `activity_draft_${activityId}`
      : "activity_draft_new";
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        console.log("📂 임시저장 불러옴:", parsed);
      } catch (e) {
        console.error("임시저장 파싱 실패:", e);
      }
    }
  }, [activityId, subActivityId]);

  // ⭐ API 응답 데이터를 formData 형식으로 변환
  const convertApiToFormData = (apiData) => {
    // role_items를 roles와 customRoles로 변환
    const roles = { planning: 0, design: 0, development: 0 };
    const customRoles = {};
    
    const roleNameToKey = {
      "기획": "planning",
      "디자인": "design",
      "개발": "development",
    };

    if (apiData.role_items && Array.isArray(apiData.role_items)) {
      apiData.role_items.forEach((item) => {
        const key = roleNameToKey[item.name];
        if (key) {
          roles[key] = item.count || 0;
        } else {
          customRoles[item.name] = item.count || 0;
        }
      });
    }

    return {
      activityName: apiData.title || "",
      startDate: apiData.period_start || "",
      endDate: apiData.period_end || "",
      organization: apiData.organization || "",
      roles,
      customRoles,
      primaryTags: apiData.primary_tags?.map(t => t.name).join(", ") || "",
      secondaryTags: apiData.secondary_tags?.map(t => t.name).join(", ") || "",
      activityGoal: apiData.situation || "",
      mainRole: apiData.task_detail || "",
      achievement: apiData.result_detail || "",
      lesson: apiData.takeaway || "",
      files: [],
      linkUrl: apiData.link_url || "",
    };
  };

  const totalMembers =
    Object.values(formData.roles).reduce((a, b) => a + b, 0) +
    Object.values(formData.customRoles).reduce((a, b) => a + b, 0);

  const handleRoleChange = (role, delta, isCustom = false) => {
    if (isCustom) {
      setFormData((prev) => ({
        ...prev,
        customRoles: {
          ...prev.customRoles,
          [role]: Math.max(0, (prev.customRoles[role] || 0) + delta),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        roles: {
          ...prev.roles,
          [role]: Math.max(0, prev.roles[role] + delta),
        },
      }));
    }
  };

  const [newRole, setNewRole] = useState("");
  const addCustomRole = () => {
    if (newRole.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      customRoles: { ...prev.customRoles, [newRole]: 0 },
    }));
    setNewRole("");
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // ⭐ role_items 형식으로 변환
  const buildRoleItems = () => {
    const roleItems = [];
    const roleNameMap = {
      planning: "기획",
      design: "디자인",
      development: "개발",
    };

    // 기본 역할
    Object.entries(formData.roles).forEach(([key, count]) => {
      if (count > 0) {
        roleItems.push({
          name: roleNameMap[key] || key,
          count: count,
        });
      }
    });

    // 커스텀 역할
    Object.entries(formData.customRoles).forEach(([name, count]) => {
      if (count > 0) {
        roleItems.push({ name, count });
      }
    });

    return roleItems;
  };

  // ⭐ 백엔드 API 형식으로 데이터 변환
  const buildApiPayload = () => {
    const payload = {
      title: formData.activityName,
      activity_type: "OTHER",
      organization: formData.organization,
      period_start: formData.startDate || null,
      period_end: formData.endDate || null,
      role_items: buildRoleItems(),
      situation: formData.activityGoal,
      task_detail: formData.mainRole,
      result_detail: formData.achievement,
      takeaway: formData.lesson,
      link_url: formData.linkUrl || null,
    };

    // 빈 값 제거
    const cleanedPayload = {};
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value) && value.length === 0) return;
        cleanedPayload[key] = value;
      }
    });

    return cleanedPayload;
  };

  // ⭐ 세부활동 저장/수정 API 호출
  const handleSubmit = async () => {
    if (!formData.activityName.trim()) {
      alert("활동명을 입력해주세요.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const access = localStorage.getItem("access");
      const payload = buildApiPayload();

      console.log("📤 전송할 데이터:", payload);
      console.log("📍 상위 활동 ID:", activityId);
      console.log("📍 세부활동 ID:", subActivityId);
      console.log("📍 수정 모드:", isEditMode);

      let response;
      let endpoint;
      let method;

      if (isEditMode && subActivityId) {
        // ⭐ 수정 모드 - PUT/PATCH
        endpoint = `/api/activities/${activityId}/sub-activities/${subActivityId}/`;
        method = "PUT";
      } else if (activityId) {
        // 새 세부활동 생성
        endpoint = `/api/activities/${activityId}/sub-activities/`;
        method = "POST";
      } else {
        // 상위 활동이 없으면 새 활동으로 생성
        endpoint = `/api/activities/`;
        method = "POST";
      }

      response = await fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API 에러:", errorText);
        throw new Error(errorText || "저장에 실패했습니다.");
      }

      const result = await response.json();
      console.log("✅ 저장 성공:", result);

      // 임시저장 삭제
      const draftKey = activityId
        ? `activity_draft_${activityId}`
        : "activity_draft_new";
      localStorage.removeItem(draftKey);

      alert(isEditMode ? "수정되었습니다!" : "저장되었습니다!");

      // 저장 후 이동
      if (activityId) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("❌ 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⭐ 임시저장 (로컬스토리지)
  const handleDraftSave = () => {
    const draftKey = activityId
      ? `activity_draft_${activityId}`
      : "activity_draft_new";
    localStorage.setItem(draftKey, JSON.stringify(formData));
    alert("임시저장되었습니다.");
  };

  // ⭐ 미리보기 데이터
  const getPreviewData = () => {
    return {
      title: formData.activityName || "새 활동",
      date:
        formData.startDate && formData.endDate
          ? `${formData.startDate} ~ ${formData.endDate}`
          : "날짜 미정",
      organization: formData.organization || "소속 미정",
      teamSize: totalMembers > 0 ? `${totalMembers}명` : "팀 구성 미정",
    };
  };

  const preview = getPreviewData();

  // ⭐ 로딩 중 표시
  if (loading) {
    return (
      <div className="activity-page">
        <div className="loading-container">
          <p>활동 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="layout-container">
        {/* 좌측 단계 네비게이션 */}
        {isSidebarVisible && (
          <div className="activity-sidebar">
            <div
              className="sidebar-logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <span className="logo-icon">●</span> Grove
            </div>
            <div className="step-list">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`step-item ${
                    currentStep === step.id ? "active" : "inactive"
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <span>
                    {step.id}. {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 중앙 컨텐츠 & 우측 미리보기 컨테이너 */}
        <div
          className={`main-content-wrapper ${
            !isSidebarVisible ? "full-width" : ""
          }`}
        >
          <div className="main-header">
            <h1 className="main-title">
              {isEditMode ? "활동 수정" : "활동정리"}
            </h1>
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
              {isSidebarVisible ? "단계 숨기기" : "단계 띄우기"}
            </button>
          </div>
          <div className="content-container">
            {/* 중앙 컨텐츠 */}
            <div className="main-content">
              {currentStep === 1 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">기본 정보</h2>
                    <p className="section-subtitle">
                      활동의 기본적인 정보를 입력해주세요.
                    </p>
                  </div>

                  {/* 활동명 */}
                  <div className="form-group">
                    <label>활동명 *</label>
                    <input
                      type="text"
                      value={formData.activityName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          activityName: e.target.value,
                        })
                      }
                      placeholder="활동명을 입력하세요"
                    />
                  </div>

                  {/* 활동기간 */}
                  <div className="form-group">
                    <label>활동 기간 *</label>
                    <div className="date-row">
                      <div className="date-input-container">
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                        />
                        <Calendar size={18} className="calendar-icon" />
                      </div>
                      <span className="date-separator">~</span>
                      <div className="date-input-container">
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                        />
                        <Calendar size={18} className="calendar-icon" />
                      </div>
                    </div>
                  </div>

                  {/* 소속 */}
                  <div className="form-group">
                    <label>소속 팀/회사 *</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      placeholder="예 : 한국대학교, abc 스타트업"
                    />
                  </div>

                  {/* 팀 구성 섹션 */}
                  <div className="form-group team-composition-group">
                    <label>팀 구성 *</label>
                    <div className="team-composition-content">
                      <div className="team-roles-input">
                        <div className="role-tags">
                          {[
                            { key: "planning", label: "기획" },
                            { key: "design", label: "디자인" },
                            { key: "development", label: "개발" },
                          ].map(({ key, label }) => (
                            <div key={key} className="role-tag">
                              <span>{label}</span>
                              <button onClick={() => handleRoleChange(key, -1)}>
                                <Minus size={12} />
                              </button>
                              <span>{formData.roles[key]}</span>
                              <button onClick={() => handleRoleChange(key, 1)}>
                                <Plus size={12} />
                              </button>
                            </div>
                          ))}
                          {Object.keys(formData.customRoles).map((role) => (
                            <div key={role} className="role-tag custom">
                              <span>{role}</span>
                              <button
                                onClick={() => handleRoleChange(role, -1, true)}
                              >
                                <Minus size={12} />
                              </button>
                              <span>{formData.customRoles[role]}</span>
                              <button
                                onClick={() => handleRoleChange(role, 1, true)}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="add-role-row">
                          <input
                            type="text"
                            placeholder="직접 입력하여 역할 추가하기"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && addCustomRole()
                            }
                          />
                          <button onClick={addCustomRole}>+</button>
                          <span>추가</span>
                        </div>
                      </div>

                      {/* 팀 구성 요약 */}
                      <div className="team-summary">
                        <p className="summary-title">팀 구성 요약</p>
                        <p>
                          총 <span className="highlight">{totalMembers}명</span>
                          으로 구성된 팀
                        </p>
                        <p className="role-breakdown">
                          {Object.entries({
                            planning: formData.roles.planning,
                            design: formData.roles.design,
                            development: formData.roles.development,
                            ...formData.customRoles,
                          })
                            .filter(([_, count]) => count > 0)
                            .map(([role, count]) => {
                              const nameMap = {
                                planning: "기획",
                                design: "디자인",
                                development: "개발",
                              };
                              return `${nameMap[role] || role} ${count}명`;
                            })
                            .join(", ") || "역할을 추가해주세요"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">태그 설정</h2>
                    <p className="section-subtitle">
                      활동과 관련된 태그를 설정해주세요.
                    </p>
                  </div>
                  <div className="form-group">
                    <label>주요 태그</label>
                    <input
                      type="text"
                      placeholder="예: 프로젝트, 웹 개발"
                      value={formData.primaryTags}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryTags: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>보조 태그</label>
                    <input
                      type="text"
                      placeholder="예: 프론트엔드, 백엔드"
                      value={formData.secondaryTags}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          secondaryTags: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">활동 상세</h2>
                    <p className="section-subtitle">
                      활동의 상세 내용을 입력해주세요.
                    </p>
                  </div>
                  <div className="form-group">
                    <label>활동 목표</label>
                    <textarea
                      placeholder="활동의 목표를 자세히 작성해주세요."
                      rows="4"
                      value={formData.activityGoal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          activityGoal: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>주요 역할</label>
                    <textarea
                      placeholder="활동에서의 주요 역할을 작성해주세요."
                      rows="4"
                      value={formData.mainRole}
                      onChange={(e) =>
                        setFormData({ ...formData, mainRole: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">성과 & 결과</h2>
                    <p className="section-subtitle">
                      활동을 통해 얻은 성과와 결과를 입력해주세요.
                    </p>
                  </div>
                  <div className="form-group">
                    <label>주요 성과</label>
                    <textarea
                      placeholder="정량적/정성적 성과를 작성해주세요."
                      rows="4"
                      value={formData.achievement}
                      onChange={(e) =>
                        setFormData({ ...formData, achievement: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>배운 점</label>
                    <textarea
                      placeholder="활동을 통해 배우고 성장한 점을 작성해주세요."
                      rows="4"
                      value={formData.lesson}
                      onChange={(e) =>
                        setFormData({ ...formData, lesson: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">자료첨부</h2>
                    <p className="section-subtitle">
                      활동 관련 자료를 첨부해주세요.
                    </p>
                  </div>
                  <div className="form-group">
                    <label>파일 첨부</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          files: Array.from(e.target.files),
                        })
                      }
                    />
                    {formData.files.length > 0 && (
                      <div style={{ marginTop: "10px", color: "#666" }}>
                        {formData.files.map((file, idx) => (
                          <div key={idx}>📄 {file.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>링크 첨부</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.linkUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, linkUrl: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 우측 미리보기 및 버튼 */}
            <div className="preview-panel">
              <div className="preview-card">
                <p className="preview-title-small">작성 미리보기</p>
                <h3 className="preview-title-large">{preview.title}</h3>
                <div className="preview-content">
                  <p>
                    <strong>기간:</strong> {preview.date}
                  </p>
                  <p>
                    <strong>소속:</strong> {preview.organization}
                  </p>
                  <p>
                    <strong>팀 규모:</strong> {preview.teamSize}
                  </p>
                </div>
              </div>
              <div className="button-group">
                {currentStep > 1 && (
                  <button className="btn-prev" onClick={handlePrevStep}>
                    이전
                  </button>
                )}
                <button className="btn-draft" onClick={handleDraftSave}>
                  임시저장
                </button>
                {currentStep < steps.length ? (
                  <button className="btn-next" onClick={handleNextStep}>
                    다음
                  </button>
                ) : (
                  <button
                    className="btn-next"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "저장 중..."
                      : isEditMode
                      ? "수정 완료"
                      : "작성 완료"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;