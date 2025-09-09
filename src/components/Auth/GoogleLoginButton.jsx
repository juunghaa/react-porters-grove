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


// export default function GoogleLoginButton({redirectUri, disabled}) {
//   const handleGoogle = () => {
//     if (disabled) return;
//     // const clientId =
//     //   (typeof import.meta !== "undefined" &&
//     //     import.meta.env &&
//     //     import.meta.env.VITE_GOOGLE_CLIENT_ID) ||
//     //   process.env.REACT_APP_GOOGLE_CLIENT_ID;

//     // if (!clientId) {
//     //   alert("Google Client ID가 설정되지 않았습니다. .env를 확인하세요.");
//     //   throw new Error("Missing Google Client ID");
//     // }
//     const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;

//     const redirectUri = `${window.location.origin}/oauth-callback?provider=google`; 
//     //로그인 후 구글이 사용자를 위 url로 돌려보내줘야 함 
//     const scope = encodeURIComponent('openid email profile');
//     //scope는 구글이 어떤 정보를 사용자에게 줄지 결정해주는 것임 
//     //openid는 식별자, email, profile은 뭔지 알징
//     const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
//     //crypto로 보안 랜덤값을 생성함, Unit32Array(1)은 32비트 정수 1개짜리 배열을 만든 것 
//     //이 배열의 첫번째 값에 문자열로 반환한 랜덤 값을 state로 쓴다는 의미임 
//     sessionStorage.setItem('oauth_state_google', state);
//     //브라우저의 세션 저장소에 state값을 저장함 
//     //이 브라우저세션스토리지는 새로고침하면 남지만 브라우저 닫으면 삭제됨 
  
//     const url =
//       'https://accounts.google.com/o/oauth2/v2/auth' +
//       `?response_type=code&client_id=${encodeURIComponent(clientId)}` +
//       `&redirect_uri=${encodeURIComponent(redirectUri)}` +
//       `&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
  
//     window.location.href = url;
//   };
  
  return (
    <button type="button" onClick={handleGoogle} disabled={disabled} className="google-login-button">
      <img src="/google-icon.svg" alt="" width="20" height="20" />
      Google로 로그인
    </button>
  );
}
