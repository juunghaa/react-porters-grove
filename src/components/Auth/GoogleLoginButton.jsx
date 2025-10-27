// import React from 'react';

// export default function GoogleLoginButton({ disabled }) {
//   const handleGoogle = () => {
//     if (disabled) return;

//     // const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
//     // const redirectUri = "http://52.79.131.1/api/v1/auth/google/callback/"; 
//     // const scope = "email profile"; 
//     // const responseType = "code"; 

//     // // 구글 OAuth URL 직접 생성
//     // const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

//     // window.location.href = googleAuthUrl;

//     // 프론트에서는 백엔드 엔드포인트 호출만
//     // window.location.href = "/api/auth/google/login/";
//     window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
//   };

//   return (
//     <div className="googleLogin-area">
//     <button
//       type="button"
//       onClick={handleGoogle}
//       disabled={disabled}
//       className="google-login-button"
//     >
//       <img src="/google-icon.svg" alt="" width="20" height="20" />
//       Google로 로그인
//     </button>
//     </div>
//   );
// }


import React from "react";

export default function GoogleLoginButton({ disabled }) {
  const handleGoogle = () => {
    if (disabled) return;

    const clientId =
      "279122774110-vhr4qq7m6gm8a6squkk5fde3l4n2d8mu.apps.googleusercontent.com";
    const redirectUri =
      "https://react-porters-grove.vercel.app/api/v1/auth/google/callback/";
    const scope = "email profile";
    const responseType = "code";
    const accessType = "online";
    const prompt = "select_account";

    // 구글 OAuth URL 생성
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&access_type=${accessType}&prompt=${prompt}`;

    // 구글 로그인 페이지로 이동
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="googleLogin-area">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={disabled}
        className="google-login-button"
        style={{
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "10px 16px",
          cursor: disabled ? "not-allowed" : "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <img src="/google-icon.svg" alt="Google Icon" width="20" height="20" />
        Google로 로그인
      </button>
    </div>
  );
}
