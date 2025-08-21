import React from 'react';

export default function GitHubLoginButton() {
  const handleGitHubLogin = () => {
    // 로그인 끝나고 돌아올 프론트 경로(원하면 현재 경로 유지도 가능)
    const next = encodeURIComponent(window.location.origin + '/oauth/done');
    // 백엔드에서 준비한 GitHub OAuth 시작 엔드포인트로 이동
    // (백엔드가 /api/auth/github/login 에서 state 만들고 GitHub로 리다이렉트)
    window.location.href = `/api/auth/github/login?next=${next}`;
    // 백엔드가 다른 파라미터명을 쓰면 redirect, redirect_uri 등으로 맞춰 주세요.
  };

  return (
    <button onClick={handleGitHubLogin} className="github-login-button" aria-label="Sign in with GitHub">
      <img src="/github-icon.svg" alt="" width="20" height="20" />
      GitHub로 로그인
    </button>
  );
}
