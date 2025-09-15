import React from 'react';

// export default function GitHubLoginButton({disabled}) {
//     const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
//     const redirectUri =
//       process.env.REACT_APP_GITHUB_REDIRECT ||
//       `${window.location.origin}/auth/callback?provider=github`;
  
//     const handleGitHub = () => {
//       if (!clientId) {
//         alert('GitHub Client ID가 설정되지 않았습니다. .env.local을 확인하세요.');
//         return;
//       }
//       const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
//       sessionStorage.setItem('oauth_state_github', state);
  
//       const url =
//         'https://github.com/login/oauth/authorize' +
//         `?client_id=${encodeURIComponent(clientId)}` +
//         `&redirect_uri=${encodeURIComponent(redirectUri)}` +
//         `&scope=read:user%20user:email&state=${state}`;
  
//       window.location.href = url;
//     };
  

//   return (
//     <button type="button" onClick={handleGitHub} disabled={disabled} className="github-login-button">
//       <img src="/github-icon.svg" alt="" width="20" height="20" />
//       GitHub로 로그인
//     </button>
//   );
// }


// GitHub
export const exchangeGithubCode = async (code, redirectUri) => {
    const res = await fetch('/api/auth/github/callback/', {   // ✅ 수정
      method: 'GET',                                          // ✅ GitHubAuthCallback도 GET
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || data.message || 'GitHub 코드 교환 실패');
    return data;
  };
  