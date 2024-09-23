import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import axios from 'axios';
import './ProfileSetup.scss';

function ProfileSetup() {
  const [username, setUsername] = useState('');  // ユーザー名など
  const [department, setDepartment] = useState('');  // 所属部署
  const [snsid, setSnsid] = useState('');  // discord IDなど
  const [selectedHobbies, setSelectedHobbies] = useState([]);  // 選択した趣味
  const [selectedSkills, setSelectedSkills] = useState([]);  // 選択したスキル
  const [selfIntroduction, setSelfIntroduction] = useState('');  // 自己紹介
  const navigate = useNavigate(); // useNavigateフックを使用して遷移機能を取得

  const hobbies = ['スポーツ', '音楽', '映画鑑賞', '読書', '筋トレ', '登山', '料理', '釣り', '写真撮影', 'ゲーム', 'ダンス', 'プログラミング', 'カラオケ', '美容', 'サウナ', '温泉', 'スキー', 'キャンプ', 'ランチ', 'バーベキュー'];
  const skills = ['プログラミング', 'コミュニケーション', 'データ解析', 'リーダーシップ', 'マーケティング', 'ビデオ編集', 'クリエイティブ思考', '問題解決力', 'プロジェクト管理', 'プレゼンテーション能力'];

  const toggleSelection = (item, setSelected, selectedItems) => {
    setSelected(
      selectedItems.includes(item)
        ? selectedItems.filter(i => i !== item)
        : [...selectedItems, item]
    );
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    
    try {
      const token = localStorage.getItem('token'); // 登録時に取得したトークンを取得
      console.log("token:", token);
      const response = await axios.patch('https://aichihack-back-153bffff1dd9.herokuapp.com/app/update/',{
        username,
        self_introduction: selfIntroduction,  // 自己紹介
        department,  // 部署
        skils: selectedSkills,  // 選択されたスキル
        hobbys: selectedHobbies,  // 選択された趣味
        snsid, // SNS ID
      },
    {
      headers: {
        'Authorization': `Token ${token}`,  // 認証トークン
        'Content-Type': 'application/json',
      },
    }
  );
      console.log('プロフィールの更新成功:', response.data);
      alert('プロフィールが保存されました');
      navigate('/deep-question')
    } catch(error) {
      console.error('プロフィール更新エラー:', error.response.data);
      console.log(username);
      console.log(department);
      console.log(snsid);
      console.log("趣味", selectedHobbies)
      console.log("スキル", selectedSkills)
      alert('プロフィールの保存に失敗しました')
    }
  };

  return (
    <div className="profile-setup-container">
      <h1 className="title">プロフィール設定</h1> {/* タイトルを「プロフィール設定」に変更 */}
      <div className="input-group">
        <label>ユーザー名</label>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>所属部署</label>
        <input
          type="text"
          placeholder="部署名"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>discord</label>
        <input
          type="text"
          placeholder="アカウントID"
          value={snsid}
          onChange={(e) => setSnsid(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>自己紹介</label>
        <textarea
          placeholder="自己紹介を入力"
          value={selfIntroduction}
          onChange={(e) => setSelfIntroduction(e.target.value)}
        />
      </div>

      <div className="section">
        <h2>趣味</h2>
        <div className="tags">
          {hobbies.map(hobby => (
            <div
              key={hobby}
              className={`tag ${selectedHobbies.includes(hobby) ? 'selected' : ''}`}
              onClick={() => toggleSelection(hobby, setSelectedHobbies, selectedHobbies)}
            >
              {hobby}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>スキル</h2>
        <div className="tags">
          {skills.map(skill => (
            <div
              key={skill}
              className={`tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
              onClick={() => toggleSelection(skill, setSelectedSkills, selectedSkills)}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* プロフィール保存ボタン */}
      <div className="create-profile-button-container">
        <button className="create-profile-button" onClick={handleProfileSave}>
          保存する
        </button>
      </div>
    </div>
  );
}

export default ProfileSetup;
