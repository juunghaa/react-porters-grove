import React, { useState } from 'react';
import SignupForm from '../components/Auth/SignupForm';

export default function SignupPage({ onLoginSuccess, onChangeView }) {
  // ✅ SignupForm이 직접 API를 호출하므로, 
  // SignupPage는 성공/실패 처리만 담당
  
  const handleSignupSuccess = (data) => {
    // ✅ SignupForm에서 이미 API 호출 및 토큰 저장 완료
    // 부모(App.js)에게 성공 알림
    console.log('회원가입 성공:', data);
    
    // ✅ App.js의 handleAuthSuccess로 전달
    onLoginSuccess?.(data);
  };

  return (
    <SignupForm 
      onSignupSuccess={handleSignupSuccess}
      onChangeView={onChangeView}
    />
  );
}

// import React, { useState } from 'react';
// import SignupForm from '../components/Auth/SignupForm';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// // import { auth } from '../firebase';
// import { register } from '../api';

// export default function SignupPage({ onRegisterSuccess, onChangeView }) {
//   const [signupError, setSignupError] = useState('');
//   const [email, setEmail] = useState('');
//   const [password1, setPassword1] = useState('');
//   const [password2, setPassword2] = useState('');
  
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setSignupError('');
  
//     if (password1 !== password2) {
//         setSignupError('비밀번호가 일치하지 않아요.');
//         return;
//     }
  
//     try {
//         const res = await register(email, password1, password2);
//         localStorage.setItem('access', res.access);
//         localStorage.setItem('refresh', res.refresh);
//         onRegisterSuccess(); // 회원가입 성공 후 이동
//     } catch (err) {
//         setSignupError(err.message);
//     }
// };
  
//     return (
//       <SignupForm onSubmit={handleRegister} signupError={signupError} 
//       onChangeView={onChangeView}/>
//     //<SignupForm onSuccess={() => navigate('/welcome')} /> 나중에 페이지 이동
//     );
//   }
