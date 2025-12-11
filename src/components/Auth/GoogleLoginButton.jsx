import React from "react";

// PKCE: 랜덤 문자열 생성
function generateCodeVerifier() {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// PKCE: SHA-256 → Base64URL
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64Digest;
}

export default function GoogleLoginButton({ disabled }) {
  const handleGoogle = async () => {
    if (disabled) return;

    const clientId =
      "279122774110-vhr4qq7m6gm8a6squkk5fde3l4n2d8mu.apps.googleusercontent.com";

    const redirectUri = "https://grove.ajousw.kr/auth/google/callback";
    const scope = "email profile";
    const responseType = "code";
    const accessType = "offline"; // refresh_token 요청 가능
    const prompt = "select_account";

    // 🔐 1) PKCE Code Verifier 생성
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem("google_code_verifier", codeVerifier);

    // 🔐 2) Code Challenge 생성
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // 🔐 3) Google OAuth URL 구성
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=${responseType}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=${accessType}` +
      `&prompt=${prompt}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    window.location.href = googleAuthUrl;
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
