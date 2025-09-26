import React from 'react';

export default function GoogleLoginButton({ disabled }) {
  const handleGoogle = () => {
    if (disabled) return;
    // 프론트에서는 백엔드 엔드포인트 호출만
    window.location.href = "/api/auth/google/login/";
  };

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={disabled}
      className="google-login-button"
    >
      <img src="/google-icon.svg" alt="" width="20" height="20" />
      Google로 로그인
    </button>
  );
}
