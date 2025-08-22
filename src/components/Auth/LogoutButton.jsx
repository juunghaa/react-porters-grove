// 파이어베이스 시절 jsx 코드긴 한데 혹시 몰라서 안지움!!!!!!

// import React from 'react';
// import { signOut } from "firebase/auth";
// import { auth } from "../../firebase";

// export default function LogoutButton({onLogout}) {
//     const handleClick =()=> {
//         signOut(auth).then(()=>{
//             console.log("로그아웃 성공");
//             onLogout();
//         }).catch((error)=>{
//             alert("로그아웃 실패: "+error.message);
//         })
//         if (typeof onLogout === 'function') {
//             onLogout();
//         }
//     };

//     return (
//         <button onClick={handleClick} className="logout-button">
//             로그아웃
//         </button>
//     );
// }


import React, { useState } from 'react';
import { apiLogout, refreshAccess } from '../../api';
import logoutIcon from "../../assets/icons/Logout.png";

export default function LogoutButton({ onLogout }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1차 시도
      let { ok, status } = await apiLogout();

      // access 만료 등으로 401이면 한 번만 갱신 후 재시도
      if (!ok && status === 401) {
        try {
          await refreshAccess();
          ({ ok } = await apiLogout());
        } catch (_) {
          // 갱신 실패 시엔 그냥 로컬 로그아웃 진행
        }
      }
    } catch (e) {
      // 네트워크/파싱 오류 등은 무시하고 로컬 정리
      console.warn('logout error:', e);
    } finally {
      // 로컬 세션 정리
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      onLogout?.();
      setLoading(false);
    }
  };

  return (
    <div className="nav-item">
                <div className="nav-icon">
                  <img src={logoutIcon} alt="로그아웃" className="icon-img" />
                </div>
                <span className="nav-text">로그아웃</span>
                <LogoutButton onLogout={onLogout} />
              </div>

    // <button onClick={handleClick} className="logout-button" disabled={loading}>
    //   {loading ? '로그아웃 중…' : '로그아웃'}
    // </button>
  );
}
