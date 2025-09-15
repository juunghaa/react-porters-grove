import React from 'react';

export default function GoogleLoginButton({disabled}) {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.REACT_APP_GOOGLE_REDIRECT ||
    `${window.location.origin}/auth/callback?provider=google`;

  const handleGoogle = () => {
    if (!clientId) {
      alert('Google Client ID가 설정되지 않았습니다. .env.local을 확인하세요.');
      return;
    }
    const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    sessionStorage.setItem('oauth_state_google', state);

    const scope = encodeURIComponent('openid email profile');
    const url =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?response_type=code&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;

    window.location.href = url;
  };

  
  return (
    <button type="button" onClick={handleGoogle} disabled={disabled} className="google-login-button">
      <img src="/google-icon.svg" alt="" width="20" height="20" />
      Google로 로그인
    </button>
  );
}

// GoogleLoginButton.jsx
// import React from 'react';

// export default function GoogleLoginButton({ disabled }) {
//   const handleGoogle = () => {
//     if (disabled) return;
//     // ✅ 프론트에서 직접 state, URL 만들지 않고
//     // 백엔드 엔드포인트로만 보냄
//     window.location.href = "/api/auth/google/login/";
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleGoogle}
//       disabled={disabled}
//       className="google-login-button"
//     >
//       <img src="/google-icon.svg" alt="" width="20" height="20" />
//       Google로 로그인
//     </button>
//   );
// }

// export default function GoogleLoginButton({ disabled }) {
//   const handleGoogle = () => {
//     if (disabled) return;
//     window.location.href = "/api/auth/google/login/";
//   };

//   return (
//     <button type="button" onClick={handleGoogle} disabled={disabled} className="google-login-button">
//       <img src="/google-icon.svg" alt="" width="20" height="20" />
//       Google로 로그인
//     </button>
//   );
// }