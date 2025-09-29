import React from 'react';

export default function GoogleLoginButton({ disabled }) {
  const handleGoogle = () => {
    if (disabled) return;

    // const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    // const redirectUri = "http://52.79.131.1/api/v1/auth/google/callback/"; 
    // const scope = "email profile"; 
    // const responseType = "code"; 

    // // 구글 OAuth URL 직접 생성
    // const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    // window.location.href = googleAuthUrl;

    // 프론트에서는 백엔드 엔드포인트 호출만
    // window.location.href = "/api/auth/google/login/";
    window.location.href = "http://52.79.131.1/api/v1/auth/google/callback/";
  };

  return (
    <div className="googleLogin-area">
    <button
      type="button"
      onClick={handleGoogle}
      disabled={disabled}
      className="google-login-button"
    >
      <img src="/google-icon.svg" alt="" width="20" height="20" />
      Google로 로그인
    </button>
    </div>
  );
}
