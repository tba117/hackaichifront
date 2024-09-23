import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート
import './Home.scss';
import Footer from './Footer'; // フッターをインポート

function Home() {
  const [username, setusername] = useState('');
  const [userId, setUserId] = useState('');
  const [department, setDepartment] = useState('');
  const [self_introduction, setSelf_introduction] = useState('');
  const [discord, setDiscord] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [skils, setSkils] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ユーザー情報をAPIから取得
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user_id = localStorage.getItem('user_id'); // ローカルストレージからユーザーID取得
        const token = localStorage.getItem('token'); // 認証用トークンの取得

        const response = await axios.get(`https://aichihack-back-153bffff1dd9.herokuapp.com/app/users/${user_id}/`, {
          headers: {
            "Authorization": `Token ${token}`, // 認証トークンをヘッダーに追加
          },
        });

        const userData = response.data.user;

        setusername(userData.username);
        setUserId(userData.user_id);
        setDepartment(userData.department);
        setDiscord(userData.snsid); // Discord情報をセット（必要に応じて変更）
        setHobbies(userData.hobbys);
        setSkils(userData.skils);
        setSelf_introduction(userData.self_introduction);
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました', error);
        setError('ユーザー情報の取得に失敗しました。');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    alert('ログアウトしました。');
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/profile-setup'); // プロフィール設定画面に正しく遷移
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="home-page__header">
        <h1 className="home-page__nickname">{username}</h1> {/* ニックネームを上に配置 */}
        <p className="home-page__userid">{userId}</p> {/* IDをニックネームの下に配置 */}
      </div>

      <div className="home-page__info-card">
        <h2 className="home-page__info-title">プロフィール</h2>
        <div className="home-page__details">
          <p><strong>ユーザー名:</strong> {username}</p>
          <p><strong>所属部署:</strong> {department}</p>
          <p><strong>Discord:</strong> {discord}</p>
          <p><strong>趣味:</strong> {hobbies.join(', ')}</p>
          <p><strong>スキル:</strong> {skils.join(', ')}</p>
          <p><strong>自己紹介:</strong> {self_introduction}</p>
        </div>
      </div>

      <div className="home-page__actions">
        <button onClick={handleEditProfile} className="home-page__edit-button">プロフィールを編集</button>
      </div>

      <Footer /> {/* フッターを追加 */}
    </div>
  );
}

export default Home;
