// import React from "react";

// export default function GoogleLoginButton({ disabled }) {
//   const handleGoogle = () => {
//     if (disabled) return;

//     const clientId =
//       "279122774110-vhr4qq7m6gm8a6squkk5fde3l4n2d8mu.apps.googleusercontent.com";
//     const redirectUri =
//       "https://react-porters-grove.vercel.app/google/callback/";
//     const scope = "email profile";
//     const responseType = "code";
//     const accessType = "online";
//     const prompt = "select_account";

//     // ✅ 문자열 백틱(``) 누락된 부분 수정
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
//       <button
//         type="button"
//         onClick={handleGoogle}
//         disabled={disabled}
//         className="google-login-button"
//       >
//         <img src="/google-icon.svg" alt="" width="20" height="20" />
//         Google로 로그인
//       </button>
//     </div>
//   );
// }


import React from "react";

export default function GoogleLoginButton({ disabled }) {
  const handleGoogle = () => {
    if (disabled) return;

    // ✅ 백엔드의 Google OAuth 시작 엔드포인트로 리다이렉트
    // 백엔드가 Google OAuth URL을 생성하고 리다이렉트해줌
    window.location.href = "https://grove.beer/api/v1/auth/google/";
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