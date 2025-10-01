import React, { useState, useEffect } from "react";
import { validateResetToken, confirmPasswordReset } from "../../api";
import "./ResetPWModal.css"; // 기존 스타일 재사용

export default function ResetPWConfirm() {
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // URL에서 token 추출
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  // Step 2: 토큰 검증
  useEffect(() => {
    async function checkToken() {
      try {
        await validateResetToken(token); // 성공하면 에러 없이 통과
        setTokenValid(true);
      } catch (err) {
        setError("토큰이 유효하지 않거나 만료되었습니다.");
      } finally {
        setLoading(false);
      }
    }
    if (token) checkToken();
  }, [token]);

  // Step 3: 새 비밀번호 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const data = await confirmPasswordReset(token, password);
      if (data.status === "OK") {
        setMessage("비밀번호가 성공적으로 변경되었습니다. 로그인해주세요.");
      } else {
        setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setError("요청 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>토큰 검증 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="modal-overlay">
      <div className="resetPWmodal">
        <h2>새 비밀번호 설정</h2>
        {tokenValid ? (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="새 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">비밀번호 변경</button>
          </form>
        ) : (
          <p style={{ color: "red" }}>유효하지 않은 토큰입니다.</p>
        )}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
