import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';
import { UserContext } from './UserContext';

function Home() {
  const { user, saveUser } = useContext(UserContext);
  const navigate = useNavigate();

  // ユーザー情報がContextにない場合、localStorageから再取得
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        saveUser(JSON.parse(storedUser)); // Contextに保存
      } else {
        // ユーザー情報がない場合はログイン画面にリダイレクト
        navigate('/login');
      }
    }
  }, [user, saveUser, navigate]);

  return (
    <div className="home-page">
      <div className="home-page__header">
      <h2 className="home-page__info-title">プロフィール</h2>
        <h1 className="home-page__nickname">{user.username}</h1>
        <p className="home-page__userid">{user.userId}</p>
      </div>

      <div className="home-page__info-card">
        <div className="home-page__details">
          <p><strong>ユーザー名:</strong> {user.username}</p>
          <p><strong>所属部署:</strong> {user.department}</p>
          <p><strong>Discord:</strong> {user.discord}</p>
          <p><strong>趣味:</strong> {Array.isArray(user.hobbies) ? user.hobbies.join(', ') : '未設定'}</p>
          <p><strong>スキル:</strong> {Array.isArray(user.skils) ? user.skils.join(', ') : '未設定'}</p>
          <p><strong>自己紹介:</strong> {user.self_introduction || '未設定'}</p>
        </div>
      </div>

      <div className="home-page__actions">
        <button onClick={() => {navigate('/profile-setup');}} className="home-page__edit-button">プロフィールを編集</button>
      </div>
    </div>
  );
}

export default Home;
