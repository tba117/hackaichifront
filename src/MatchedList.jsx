import React, { useState, useEffect, useContext } from 'react';
import './MatchedList.scss'; // スタイルファイルをインポート
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // axiosをインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // スピナーアイコン
import { UserContext } from './UserContext'; // UserContext をインポート

function MatchedList() {
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
    const { saveMatchedUser } = useContext(UserContext); // Context の関数を取得

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
        
        const matchedUserData = response.data.matched_users
        
        // Context にユーザー情報を保存
        saveMatchedUser(matchedUserData);
        setMatchedProfiles(matchedUserData);
        setLoading(false);  // ロードが完了したらローディング終了
        console.log(matchedUserData)
      } catch (err) {
        console.error('マッチング情報の取得に失敗しました。', err);
        setError('マッチング情報の取得に失敗しました。');
        setLoading(false);  // エラーが発生してもローディング終了
      }
    };

    fetchMatchedProfiles();
  }, [saveMatchedUser]);

  const handleProfileClick = (profile) => {
    // プロフィールをクリックしたら、BMProfileページに遷移
    console.log(profile)
    navigate('/bm-profile', { state: { user_id: profile.user_id } });
  };

  if (loading) {
    return (
      <div className="matched-list-page">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" /> {/* 回転するスピナー */}
        <p>ロード中...</p>
      </div>
    ); // ローディング画面
  }

  if (error) {
    return (
      <div className="matched-list-page">
        <p className="matched-list-page_error">
          まだマッチをしていないようです
          <br></br>マッチをしてBizMateを作りましょう!
        </p>
      </div>
    );
  };

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
