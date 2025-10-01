import React, { useState } from "react";
import { requestPasswordReset } from "../../api.js";
import "./ResetPWModal.css";

export default function ResetPWModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await requestPasswordReset(email);
      setMessage("비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해주세요.");
    } catch (err) {
      setMessage("요청 실패: " + (err.message || "다시 시도해주세요."));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="resetPWmodal">
        <h2>비밀번호 재설정</h2>
        {/* <form onSubmit={handleSubmit}> */}
          <input
            type="email"
            placeholder="가입한 이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "전송 중..." : "재설정 메일 보내기"}
          </button>
        {/* </form> */}
        {message && <p>{message}</p>}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
