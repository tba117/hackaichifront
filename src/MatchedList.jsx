import React, { useState, useEffect } from 'react';
import './MatchedList.scss'; // スタイルファイルをインポート
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // axiosをインポート

function MatchedList() {
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // バックエンドからマッチングしたユーザー情報を取得
  useEffect(() => {
    const fetchMatchedProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        const response = await axios.get('https://aichihack-back-153bffff1dd9.herokuapp.com/app/get_matched_users/', {
          headers: {
            "Authorization": `Token ${token}`  // トークンをヘッダーに渡す
          }
        });

        setMatchedProfiles(response.data.matched_users);
        setLoading(false);  // ロードが完了したらローディング終了
      } catch (err) {
        console.error('マッチング情報の取得に失敗しました。', err);
        setError('マッチング情報の取得に失敗しました。');
        setLoading(false);  // エラーが発生してもローディング終了
      }
    };

    fetchMatchedProfiles();
  }, []);

  const handleProfileClick = (profile) => {
    // プロフィールをクリックしたら、BMProfileページに遷移
    navigate('/bm-profile', { state: { user_id: profile.user_id } });
  };

  if (loading) {
    return <div>ロード中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="matched-list-page">
      <h1 className="matched-list-page__title">BizMate List</h1>
      <ul className="matched-list-page__list">
        {matchedProfiles.map((profile, index) => (
          <li
            key={index}
            className="matched-list-page__item"
            onClick={() => handleProfileClick(profile)}
          >
            <div className="matched-list-page__icon">👤</div>
            <div className="matched-list-page__details">
              <p className="matched-list-page__name">{profile.username}</p>
              <p>所属: {profile.department}</p>
              <p>discord: {profile.discord}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchedList;
