import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.scss';
import Footer from './Footer'; // フッターをインポート

function Home() {
  const [nickname, setNickname] = useState("山田太郎");
  const [userId, setUserId] = useState("yamada123");
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('ログアウトしました。');
    navigate('/');
  };

  return (
    <div className="home-container">
      <div className="user-header">
        <p className="user-id">{userId}</p>
        <h1 className="user-name">{nickname}</h1>
      </div>
      <div className="user-info-card">
        <h2>プロフィール</h2>
        <p><strong>ユーザー名:</strong> {nickname}</p>
        <p><strong>所属部署:</strong> 技術部</p>
      </div>
      <Footer /> {/* フッターを追加 */}
    </div>
  );
}

export default Home;
