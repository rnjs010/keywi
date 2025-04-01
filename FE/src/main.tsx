import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // ✅ App 불러오고 있는지 확인
import './index.css'; // 없어도 되지만 보통 여기서 기본 스타일링

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App /> {/* ✅ App이 여기에 있어야 화면이 나와 */}
  </React.StrictMode>
);
