// import React from 'react';

// export default function GoogleLoginButton({ disabled }) {
//   const handleGoogle = () => {
//     if (disabled) return;

    
//     const clientId =
//       "279122774110-vhr4qq7m6gm8a6squkk5fde3l4n2d8mu.apps.googleusercontent.com";
//     const redirectUri =
//       "https://react-porters-grove.vercel.app/api/v1/auth/google/callback/";
//     const scope = "email profile";
//     const responseType = "code";
//     const accessType = "online";
//     const prompt = "select_account";

//     // 구글 OAuth URL 생성
//     const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}&response_type=${responseType}&scope=${encodeURIComponent(
//       scope
//     )}&access_type=${accessType}&prompt=${prompt}`;

//     // 구글 로그인 페이지로 이동
//     window.location.href = googleAuthUrl;
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
      "https://react-porters-grove.vercel.app/google/callback/";
    const scope = "email profile";
    const responseType = "code";
    const accessType = "online";
    const prompt = "select_account";

    // ✅ 문자열 백틱(``) 누락된 부분 수정
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
      >
        <img src="/google-icon.svg" alt="" width="20" height="20" />
        Google로 로그인
      </button>
    </div>
  );
}
