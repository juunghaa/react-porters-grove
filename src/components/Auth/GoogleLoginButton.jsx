import React from 'react';

export default function GoogleLoginButton() {
  const handleGoogle = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/?provider=google`; // ✅ 라우터 없이 루트 사용
    const scope = encodeURIComponent('openid email profile');
    const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    sessionStorage.setItem('oauth_state_google', state);
  
    const url =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?response_type=code&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
  
    window.location.href = url;
  };
  
  return (
    <button type="button" onClick={handleGoogle} className="google-login-button">
      <img src="/google-icon.svg" alt="" width="20" height="20" />
      Google로 로그인
    </button>
  );
}
