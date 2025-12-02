// src/pages/GoogleCallback.jsx
import { useEffect, useRef, useState } from "react";
import { exchangeGoogleCode } from "../api/api"; // 경로는 실제 위치에 맞게 조정

export default function GoogleCallback({ onLoginSuccess }) {
  const [status, setStatus] = useState("처리 중...");
  const [debugInfo, setDebugInfo] = useState(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const redirectUri = "https://grove.ajousw.kr/auth/google/callback";
    const codeVerifier = localStorage.getItem("google_code_verifier");

    if (!code) {
      setStatus("❌ 인증 코드 없음");
      return;
    }
    if (!codeVerifier) {
      setStatus("❌ code_verifier 없음 (로그인 버튼 페이지에서 생성 안됨)");
      return;
    }

    (async () => {
      try {
        setStatus("백엔드로 인증 코드 전송 중...");

        // ✅ 이제는 도메인 직접 호출 X, api.js helper 사용 (상대 경로 /api/... 호출)
        const data = await exchangeGoogleCode(code, redirectUri, codeVerifier);

        // 디버그용 정보
        setDebugInfo({
          url: "/api/v1/auth/google/",
          status: 200,
          responseText: JSON.stringify(data).substring(0, 500),
        });

        // jwt 저장
        if (data.access) localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);
        if (data.user)
          localStorage.setItem("user", JSON.stringify(data.user));

        // PKCE verifier 제거
        localStorage.removeItem("google_code_verifier");

        if (onLoginSuccess) onLoginSuccess(data);

        setStatus("로그인 성공! 이동 중...");
        setTimeout(() => window.location.replace("/"), 800);
      } catch (err) {
        console.error("구글 로그인 실패:", err);
        setStatus(`로그인 실패: ${err.message}`);
      }
    })();
  }, [onLoginSuccess]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "monospace",
      }}
    >
      <h2>Google 로그인 디버그</h2>
      <p>{status}</p>

      {debugInfo && (
        <pre
          style={{
            background: "#eee",
            padding: "20px",
            maxWidth: "600px",
            whiteSpace: "pre-wrap",
            marginTop: "20px",
          }}
        >
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  );
}
