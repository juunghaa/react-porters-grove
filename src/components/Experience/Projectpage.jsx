import React, { useState, useRef, useEffect } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./ProjectPage.css";
import chipIcon from "../../assets/icons/ProjectChip.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

const ProjectPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditMode = !!id;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    participation_type: "",
    role: "",
    period_start: "",
    period_end: "",
    situation: "",
    task_detail: "",
    action_detail: "",
    result_detail: "",
    takeaway: "",
    link_url: "",
    organization: "",
    host: "",
    work_title: "",
    is_awarded: false,
    award_detail: "",
  });

  useEffect(() => {
    const loadActivityData = async () => {
      if (!isEditMode) return;

      try {
        if (location.state?.activityData) {
          const data = location.state.activityData;
          setFormData({
            title: data.title || "",
            subject: data.subject || "",
            participation_type: data.participation_type || "",
            role: data.role || "",
            period_start: data.period_start || "",
            period_end: data.period_end || "",
            situation: data.situation || "",
            task_detail: data.task_detail || "",
            action_detail: data.action_detail || "",
            result_detail: data.result_detail || "",
            takeaway: data.takeaway || "",
            link_url: data.link_url || "",
            organization: data.organization || "",
            host: data.host || "",
            work_title: data.work_title || "",
            is_awarded: data.is_awarded || false,
            award_detail: data.award_detail || "",
          });
          setLoading(false);
          return;
        }

        const access = localStorage.getItem("access");
        const response = await fetch(`/api/activities/${id}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (!response.ok) throw new Error("데이터 로딩 실패");

        const data = await response.json();
        setFormData({
          title: data.title || "",
          subject: data.subject || "",
          participation_type: data.participation_type || "",
          role: data.role || "",
          period_start: data.period_start || "",
          period_end: data.period_end || "",
          situation: data.situation || "",
          task_detail: data.task_detail || "",
          action_detail: data.action_detail || "",
          result_detail: data.result_detail || "",
          takeaway: data.takeaway || "",
          link_url: data.link_url || "",
          organization: data.organization || "",
          host: data.host || "",
          work_title: data.work_title || "",
          is_awarded: data.is_awarded || false,
          award_detail: data.award_detail || "",
        });
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("데이터를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadActivityData();
  }, [id, isEditMode, location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, participation_type: e.target.value }));
  };

  const cleanFormData = (data) => {
    const cleaned = {};
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value === null || value === undefined || value === "") return;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) cleaned[key] = trimmed;
      } else {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  const createActivity = async (data) => {
    const access = localStorage.getItem("access");
    const dataWithType = { ...data, activity_type: "PROJECT" };
    const cleanedData = cleanFormData(dataWithType);

    const response = await fetch("/api/activities/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "활동 저장에 실패했습니다.");
    }
    return response.json();
  };

  const updateActivity = async (data) => {
    const access = localStorage.getItem("access");
    const dataWithType = { ...data, activity_type: "PROJECT" };
    const cleanedData = cleanFormData(dataWithType);

    const response = await fetch(`/api/activities/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "활동 수정에 실패했습니다.");
    }
    return response.json();
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("프로젝트명을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (isEditMode) {
        result = await updateActivity(formData);
        alert("수정되었습니다!");
      } else {
        result = await createActivity(formData);
        alert("저장되었습니다!");
      }
      navigate(`/project/${result.id}`);
    } catch (error) {
      console.error("저장/수정 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성을 취소하시겠습니까? 입력한 내용이 사라집니다.")) {
      navigate(-1);
    }
  };

  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const handleHomeClick = () => navigate("/");
  const handleCreateNew = () => navigate("/choose");
  const handleArchiveClick = () => navigate("/archive");
  const handleOpenProfileSettings = () => setIsProfileSettingsOpen(true);
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="project-page-container">
      <LeftPanel
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        onHomeClick={handleHomeClick}
        onCreateNew={handleCreateNew}
        onArchiveClick={handleArchiveClick}
        onLogout={handleLogout}
        isProfileSettingsOpen={isProfileSettingsOpen}
        onOpenProfileSettings={handleOpenProfileSettings}
      />
      <div className={`project-content ${isCollapsed ? "expanded" : ""}`}>
        <div className="project-main-box">
          <div className="project-top-bar">
            <button className="cancel-button" onClick={handleCancel}>
              취소
            </button>
            <div className="top-bar-center">
              <img src={chipIcon} alt="chip" className="ProjectChip.png" />
              <span className="top-bar-title">
                {isEditMode ? "경험 수정하기" : "경험 정리하기"}
              </span>
            </div>
            <button
              className="complete-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : isEditMode ? "수정 완료" : "작성 완료"}
            </button>
          </div>

          <div className="project-main-content">
            <div className="project-form-container">
              <div className="form-section-header">
                <h2 className="form-section-title">기본정보</h2>
              </div>
              <div className="divider-line"></div>

              <div className="form-field-frame">
                <label className="form-field-label">프로젝트명</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="진행한 프로젝트의 이름을 입력하세요"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-field-frame field-topic">
                  <label className="form-field-label">내용 설명</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-input"
                    placeholder="프로젝트의 주제나 목적을 적어주세요"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field-frame field-participation-type">
                  <label className="form-field-label">참여 형태</label>
                  <div className="award-input-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="participation"
                        value="team"
                        checked={formData.participation_type === "team"}
                        onChange={handleRadioChange}
                      />
                      팀
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="participation"
                        value="individual"
                        checked={formData.participation_type === "individual"}
                        onChange={handleRadioChange}
                      />
                      개인
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field-frame field-team-role">
                  <label className="form-field-label">역할</label>
                  <input
                    type="text"
                    name="role"
                    className="form-input"
                    placeholder="이 프로젝트에서 어떤 역할을 맡았는지 적어주세요"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field-frame field-duration">
                  <label className="form-field-label">진행 기간</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="date"
                      name="period_start"
                      className="form-input"
                      style={{ flex: 1 }}
                      value={formData.period_start}
                      onChange={handleInputChange}
                    />
                    <span style={{ color: "#999" }}>~</span>
                    <input
                      type="date"
                      name="period_end"
                      className="form-input"
                      style={{ flex: 1 }}
                      value={formData.period_end}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="related-materials-container">
              <div className="form-section-header">
                <h2 className="form-section-title">관련자료</h2>
              </div>
              <div className="file-divider-line"></div>
              <div className="materials-content">
                <label className="form-field-label">파일 업로드</label>
                <div className="file-upload-box">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                  <div
                    className="upload-frame"
                    onClick={handleUploadClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="upload-icon">
                      <img src={uploadIcon} alt="upload" />
                    </div>
                    <div className="upload-text">
                      파일을 선택하거나 여기로 끌어다 놓으세요
                    </div>
                  </div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files-list">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="uploaded-file-item">
                        📄 {file.name}
                      </div>
                    ))}
                  </div>
                )}
                <label className="form-field-label" style={{ marginTop: "8px" }}>
                  링크 URL
                </label>
                <input
                  type="url"
                  name="link_url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.link_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="detail-content-container">
            <div className="form-section-header">
              <h2 className="form-section-title">세부 내용</h2>
            </div>
            <div className="divider-line"></div>
            <div className="detail-fields">
              <div className="text-frame">
                <div className="first-text-line">Situation (상황)</div>
                <div className="second-text-line">
                  이 경험은 어떤 계기로 시작했나요?
                </div>
              </div>
              <textarea
                name="situation"
                className="detail-textarea"
                placeholder="어떤 배경이나 문제의식에서 출발했는지 들려주세요."
                value={formData.situation}
                onChange={handleInputChange}
              />

              <div className="text-frame">
                <div className="first-text-line">Task (과제)</div>
                <div className="second-text-line">
                  그 상황에서 맡은 역할이나 해결해야 했던 문제는 무엇이었나요?
                </div>
              </div>
              <textarea
                name="task_detail"
                className="detail-textarea"
                placeholder="스스로 중요하다고 느꼈던 목표나 미션이 있었다면 함께 적어주세요."
                value={formData.task_detail}
                onChange={handleInputChange}
              />

              <div className="text-frame">
                <div className="first-text-line">Action (행동)</div>
                <div className="second-text-line">
                  그 목표를 이루기 위해 어떤 시도를 했나요?
                </div>
              </div>
              <textarea
                name="action_detail"
                className="detail-textarea"
                placeholder="그 방식을 선택한 이유나 과정에서 고민했던 점이 있다면 함께 적어주세요."
                value={formData.action_detail}
                onChange={handleInputChange}
              />

              <div className="text-frame">
                <div className="first-text-line">Result (결과)</div>
                <div className="second-text-line">
                  그 결과 어떤 변화나 성과가 있었나요?
                </div>
              </div>
              <textarea
                name="result_detail"
                className="detail-textarea"
                placeholder="수치나 결과물, 배운 점 등을 구체적으로 적어주세요."
                value={formData.result_detail}
                onChange={handleInputChange}
              />

              <div className="text-frame">
                <div className="first-text-line">Taken (교훈)</div>
                <div className="second-text-line">
                  이 경험을 통해 새롭게 깨달은 점이나 다음에 바꾸고 싶은 점이
                  있나요?
                </div>
              </div>
              <textarea
                name="takeaway"
                className="detail-textarea"
                placeholder="앞으로 같은 상황이 온다면, 어떻게 접근하고 싶은지 적어주세요"
                value={formData.takeaway}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;