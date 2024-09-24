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
    <div className="bm-profile">
      <h1 className="bm-profile__title">{username}さんのプロフィール</h1>
      <p className="bm-profile__department">所属: {department}</p>
      <p className="bm-profile__discord">Discord: {discord}</p>
      <p className="bm-profile__department">自己紹介：{self_introduction}</p>
      
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
      {skils.length > 0 && (
        <div className="bm-profile__skills">
          <h2 className="bm-profile__subtitle">スキル</h2>
          <ul className="bm-profile__list">
            {skils.map((skill, index) => (
              <li key={index} className="bm-profile__list-item">{skill}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="bm-profile__advice-title">会話のアドバイス</h2>
      <div className="bm-profile__advice-text">
      1. ハッシヅメさんは多様な趣味を持っています。会話の中でスポーツから映画鑑賞、プログラミングなど、彼/彼女の興味のある分野について問い掛けてみてください。これにより彼/彼女との共通の話題を見つけ、より深い絆を築くことができます。\n\n
      </div>
      <div className="bm-profile__advice-text">
      2. ハッシヅメさんはコミュニケーション能力に優れているとのこと。会話の中で彼/彼女にコミュニケーションについての自身の考えや経験を共有してみてください。これは、彼/彼女の専門性を尊重し理解を深める一方で、自分自身のコミュニケーションスキルを向上させるきっかけにもなると思われます。\n\n
      </div>
      <div className="bm-profile__advice-text">
      3. ハッシヅメさんのハルシネーションに関する特有の考えについて尋ねてみてください。無理に深く掘り下げる必要はなく、彼/彼女が自らその考えを開花させ、シェアしたいと思ったときに話せるような環境を提供しましょう。これによりハッシヅメさんの視点を理解しやすくなり、より深い信頼関係を築くことができます。
      </div>
    </div>
  );
}

export default BMProfile;
