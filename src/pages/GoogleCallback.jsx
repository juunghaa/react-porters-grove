import { useEffect, useRef, useState } from "react";

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

        const backendUrl = "https://grove.beer/api/v1/auth/google/";
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          }),
        });

        const responseText = await response.text();

        setDebugInfo({
          url: backendUrl,
          status: response.status,
          responseText: responseText.substring(0, 500),
        });

        if (!response.ok)
          throw new Error(`HTTP ${response.status} ${responseText}`);

        const data = JSON.parse(responseText);

        // jwt 저장
        if (data.access) localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);
        if (data.user)
          localStorage.setItem("user", JSON.stringify(data.user));

        if (onLoginSuccess) onLoginSuccess(data);

        setStatus("로그인 성공! 이동 중...");
        setTimeout(() => window.location.replace("/"), 800);
      } catch (err) {
        console.error("구글 로그인 실패:", err);
        setStatus(`로그인 실패: ${err.message}`);
      }
    })();
  }, []);

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
