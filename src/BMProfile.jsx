import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BMProfile.scss';

function BMProfile() {
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [discord, setDiscord] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [hints, setHints] = useState([]); // アドバイスを保存するステート
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { user_id } = location.state || {};

  // アドバイスを取得する関数
  const fetchAdvice = useCallback(async () => {
    try {
      console.log('アドバイス取得開始');
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log(user_id)
      const response = await axios.get(
        `https://aichihack-back-153bffff1dd9.herokuapp.com/app/get-advice/${user_id}/`,
        {
          headers: {
            "Authorization": `Token ${token}`,
          },
        }
      );
      console.log('アドバイス取得成功');
      setHints(response.data.advice.split('\n\n')); // アドバイスを配列として保存
      setLoading(false);
    } catch (error) {
      console.error('アドバイスの取得に失敗しました:', error);
      setError('アドバイスの取得に失敗しました。再度お試しください。');
      setLoading(false);
    }
  }, [user_id]);



  // ユーザー情報を取得する関数
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (user_id) {
        const response = await axios.get(`https://aichihack-back-153bffff1dd9.herokuapp.com/app/users/${user_id}/`, {
          headers: {
            "Authorization": `Token ${token}`,
          },
        });
        const userData = response.data.user;
        setUsername(userData.username);
        setDepartment(userData.department);
        setDiscord(userData.snsid);
        setHobbies(userData.hobbys);
        setSkills(userData.skils);
        setSelfIntroduction(userData.self_introduction);
      } else {
        setError('ユーザーIDが指定されていません');
      }
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました:', error);
      setError('ユーザー情報の取得に失敗しました。');
    }
  }, [user_id]);

  useEffect(() => {
    fetchUserData();
    fetchAdvice(); // 初回ロード時にアドバイスも取得
  }, [fetchUserData, fetchAdvice]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bm-profile">
      <h1 className="bm-profile__title">{username}さんのプロフィール</h1>
      <p className="bm-profile__department">所属: {department}</p>
      <p className="bm-profile__discord">Discord: {discord}</p>
      <p className="bm-profile__self-introduction">自己紹介: {selfIntroduction}</p>

      {/* 趣味を表示 */}
      {hobbies.length > 0 && (
        <div className="bm-profile__hobbies">
          <h2 className="bm-profile__subtitle">趣味</h2>
          <ul className="bm-profile__list">
            {hobbies.map((hobby, index) => (
              <li key={index} className="bm-profile__list-item">{hobby}</li>
            ))}
          </ul>
        </div>
      )}

      {/* スキルを表示 */}
      {skills.length > 0 && (
        <div className="bm-profile__skills">
          <h2 className="bm-profile__subtitle">スキル</h2>
          <ul className="bm-profile__list">
            {skills.map((skill, index) => (
              <li key={index} className="bm-profile__list-item">{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* アドバイスを表示 */}
      <h2 className="bm-profile__advice-title">会話のアドバイス</h2>
      {loading ? (
        <p>アドバイスを取得中...</p>
      ) : (
        <div className="bm-profile__advice-list">
          {hints.map((hint, index) => (
            <div key={index} className="bm-profile__advice-text">
              {hint}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BMProfile;
