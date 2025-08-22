
// const BASE_URL = process.env.REACT_APP_API_URL;

// 로그인
export const login = async (email, password) => {
  const res = await fetch(`/api/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });

  const data = await res.json();
  console.log('로그인 백엔드 응답:', data);
  if (!res.ok) {
    throw new Error(data.detail || '로그인 실패');
  }

  // 토큰 및 사용자 정보 반환
  return data; // { access, refresh, user }
};


// 회원가입 
export const register = async (email, password1, password2) => {
    const res = await fetch(`/api/auth/registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: email,
            email,
            password1,
            password2,
        }),
    });
    const data = await res.json();
    console.log('회원가입 백엔드 응답:', data);
    
    if (!res.ok) {
        // 백엔드에서 에러 메시지들이 객체로 올 수 있어서 예쁘게 정리
        const errorMessages = Object.values(data)
        .flat()
        .join(' ');
        throw new Error(errorMessages || '회원가입 실패');
    }
    return data; // { access, refresh, user }
};


export const exchangeGoogleCode = async (code, redirectUri) => {
    const res = await fetch('/api/auth/google/code/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || data.message || 'Google 코드 교환 실패');
    return data;
  };
  
  export const exchangeGithubCode = async (code, redirectUri) => {
    const res = await fetch('/api/auth/github/code/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || data.message || 'GitHub 코드 교환 실패');
    return data;
  };
  


// 구글 로그인 - 소셜 로그인 ****만약 백엔드 올인 -> api 구글 로그인은 필요 없음!!
// 백엔드 올인 아닐 경우 api.js 필요하니까 수정해야 함.... 
// export const googleLogin = async (code) => {
//     const res = await fetch(`/api/auth/google/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ code }),
//     });
    
//     if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || 'Google 로그인 실패');
//     }
    
//     return await res.json();  // access, refresh 토큰이 포함된 응답 객체
// };


// 토큰 갱신 (옵션: 401일 때 한 번만 시도)
export const refreshAccess = async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) throw new Error('no refresh token');
    const res = await fetch('/api/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access) throw new Error(data.detail || data.message || '토큰 갱신 실패');
    localStorage.setItem('access', data.access);
    return data.access;
};

// 로그아웃
export const apiLogout = async () => {
    const access = localStorage.getItem('access');
    const res = await fetch('/api/auth/logout/', {
        method: 'POST',
        headers: access ? { Authorization: `Bearer ${access}` } : {},
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
};

// 내 프로필 조회
export const getMyProfile = async (token) => {
  const res = await fetch(`/api/profiles/me/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await res.json();
};