import React, { useState, useEffect } from 'react';
import './MatchedProfile.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート
import Footer from './Footer'; // フッターをインポート

function MatchedProfile() {
  const navigate = useNavigate();
  
  // マッチングユーザーの情報を保持するステート
  const [matchedUser, setMatchedUser] = useState({
    name: '',
    department: '',
    discord: '',
    hobbies: [],
    skills: [],
  });
  
  const [loading, setLoading] = useState(true); // ロード状態の管理
  const [error, setError] = useState(null); // エラー状態の管理

  // コンポーネントがマウントされたときにマッチングユーザーの情報を取得
  useEffect(() => {
    const fetchMatchedUser = async () => {
      try {
        const token = localStorage.getItem('token'); // ログインユーザーのトークンを取得
        console.log(token)
        const response = await axios.get('https://aichihack-back-153bffff1dd9.herokuapp.com/app/matching/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const userData = response.data.matched_user;
        setMatchedUser({
          name: userData.username,
          department: userData.department,
          discord: userData.snsid, // Discord情報が `snsid` に格納されていると仮定
          hobbies: userData.hobbys,
          skills: userData.skils,
        });

        // マッチングした相手の情報をローカルストレージに保存
        localStorage.setItem('matchedUser', JSON.stringify(userData));
        
        setLoading(false);
      } catch (error) {
        console.error('マッチングユーザーの取得に失敗しました:', error);
        setError('マッチングユーザーの取得に失敗しました。');
        setLoading(false);
      }
    };

    fetchMatchedUser(); // APIリクエストを実行
  }, []);

  // 会話のヒントページに遷移
  const handleHintClick = () => {
    navigate('/hint');
  };

  return (
    <div className="matched-profile-container">
      <h1 className="title">your BizMate</h1>

      {loading && <p>ロード中...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <p className="description">
            今日からあなたのBizMateとなる{matchedUser.name}さんです！<br />
            まずは{matchedUser.name}さんについて知ってみましょう
          </p>

          <div className="profile-card">
            <div className="profile-info">
              <div className="icon-placeholder">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="profile-details">
                <h2>{matchedUser.name}</h2>
                <p>所属: {matchedUser.department}</p>
                <p>discord: {matchedUser.discord}</p>
              </div>
            </div>
            <div className="profile-section">
              <h3>趣味:</h3>
              <p>{matchedUser.hobbies.join(' ')}</p>
            </div>
            <div className="profile-section">
              <h3>スキル:</h3>
              <p>{matchedUser.skills.join(' ')}</p>
            </div>
          </div>

          <div className="hint-section">
            <p>次に、会話する際のヒントを知っておきましょう</p>
            <button className="hint-button" onClick={handleHintClick}>会話のヒント</button>
          </div>
        </>
      )}

      <Footer /> {/* フッターを追加 */}
    </div>
  );
}

export default MatchedProfile;
