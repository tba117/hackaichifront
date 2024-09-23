import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // useLocation を追加
import axios from 'axios'; // axiosをインポート
import './BMProfile.scss'; // スタイルをインポート

function BMProfile() {
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [self_introduction, setSelfIntroduction] = useState('');
  const [discord, setDiscord] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [skils, setSkills] = useState([]);
  const [error, setError] = useState(null);

  // const navigate = useNavigate();
  const location = useLocation(); // ルートから state を取得
  const { user_id } = location.state || {}; // 渡された user_id を取得

  // ユーザー情報をAPIから取得
  useEffect(() => {
    const fetchUserData = async () => {
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
          setDiscord(userData.snsid); // Discord情報をセット
          setHobbies(userData.hobbys);
          setSkills(userData.skils);
          setSelfIntroduction(userData.self_introduction);
        } else {
          setError('ユーザーIDが指定されていません');
        }
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました', error);
        setError('ユーザー情報の取得に失敗しました。');
      }
    };

    fetchUserData();
  }, [user_id]); // user_id の変更時にデータを再取得

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-advice-container">
      <h1>{username}さんのプロフィール</h1>
      <p>所属: {department}</p>
      <p>Discord: {discord}</p>
      <p>趣味：{hobbies}</p>
      <p>スキル：{skils}</p>
      <p>自己紹介：{self_introduction}</p>
      <h2>会話のアドバイス</h2>
      <div className="advice-text">
        この相手との会話を進める際には、興味のあるトピックに焦点を当てましょう。
        <br />
        例えば、技術の話や趣味について質問してみるのがおすすめです。
      </div>
    </div>
  );
}

export default BMProfile;
