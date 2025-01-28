import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import axios from 'axios';
import './ProfileSetup.scss';
import { UserContext } from './UserContext'; // UserContext をインポート

function ProfileSetup() {
  const navigate = useNavigate(); // useNavigateフックを使用して遷移機能を取得
  const { user, saveUser } = useContext(UserContext); // Context からユーザ情報と保存関数を取得

  const [username, setUsername] = useState(user?.username || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [snsid, setSnsid] = useState(user?.discord || "");
  const [selectedHobbies, setSelectedHobbies] = useState(user?.hobbies || []);
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [selfIntroduction, setSelfIntroduction] = useState(user?.selfIntroduction || "");

  const hobbies = ['スポーツ', '音楽', '映画鑑賞', '読書', '筋トレ', '登山', '料理', '釣り', '写真撮影', 'ゲーム', 'ダンス', 'プログラミング', 'カラオケ', '美容', 'サウナ', '温泉', 'スキー', 'キャンプ', 'ランチ', 'バーベキュー', 'ガーデニング', '編み物', '手芸', '陶芸', '旅行', 'ボランティア活動', 'ヨガ', 'マラソン', 'サイクリング', 'スケートボード', 'ボルダリング', 'バードウォッチング', 'ペット飼育', '天体観測', '囲碁', '将棋', 'チェス', 'ボードゲーム', '音楽制作', '模型制作', 'クラシック音楽', '美術館巡り', '劇団四季', '1人でお出かけ', '洋楽', '漫画', '少年ジャンプ', '韓ドラ', 'kpop', '観葉植物', 'Netflix', 'お笑い', 'Youtube'];
  const skills = ['プログラミング', 'コミュニケーション', 'データ解析', 'リーダーシップ', 'マーケティング', 'ビデオ編集', 'クリエイティブ思考', '問題解決力', 'プロジェクト管理', 'プレゼンテーション能力',   '機械学習', '人工知能', 'データビジュアライゼーション', 'ウェブデザイン', 'UXデザイン', 'UIデザイン', 'ネットワーク構築', 'データベース管理', 'クラウドコンピューティング', 'システム設計', 'ソフトウェアテスト', 'サイバーセキュリティ', '検索エンジン最適化（SEO）', 'ソーシャルメディア運用', 'コンテンツライティング', '動画制作', '写真編集', '語学翻訳', 'コピーライティング', '財務管理', '戦略的思考', '交渉スキル', '時間管理', 'チームビルディング', '教育スキル', 'カスタマーサービス', '営業スキル', 'イベント企画', 'リサーチスキル', 'テクニカルサポート', 'プレゼン資料作成'];

  const toggleSelection = (item, setSelected, selectedItems) => {
    setSelected(
      selectedItems.includes(item)
        ? selectedItems.filter(i => i !== item)
        : [...selectedItems, item]
    );
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    // 必須フィールドのチェック
    if (!username || !department || !snsid || selectedHobbies.length === 0 || selectedSkills.length === 0 | selfIntroduction.length === 0) {
      alert("すべての必須項目を入力してください。");
      return;
    }
    
    try {
      const token = localStorage.getItem('token'); // 登録時に取得したトークンを取得
      console.log("token:", token);
      const response = await axios.patch('https://aichihack-back-153bffff1dd9.herokuapp.com/app/update/',
      {
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
      // Context にも更新後のデータを保存
      saveUser({
        username,
        department,
        discord: snsid,
        hobbies: selectedHobbies,
        skills: selectedSkills,
        selfIntroduction,
      });
      alert('プロフィールが保存されました');
      console.log(user)
      navigate('/deep-questions')
    } catch(error) {
      console.error('プロフィール更新エラー:', error.response.data);
      alert('プロフィールの保存に失敗しました')
    }
  };

  return (
    <div className="profile-setup-page">
      <h1 className="profile-setup-page__title">プロフィール設定</h1>
      <div className="profile-setup-page__input-group">
        <label>ユーザー名</label>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="profile-setup-page__input-group">
        <label>所属部署</label>
        <input
          type="text"
          placeholder="部署名"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <div className="profile-setup-page__input-group">
        <label>discord</label>
        <input
          type="text"
          placeholder="アカウントID"
          value={snsid}
          onChange={(e) => setSnsid(e.target.value)}
        />
      </div>

      <div className="profile-setup-page__input-group">
        <label>自己紹介</label>
        <textarea
          placeholder="自己紹介を入力"
          value={selfIntroduction}
          onChange={(e) => setSelfIntroduction(e.target.value)}
        />
      </div>

      <div className="profile-setup-page__section">
        <h2>趣味</h2>
        <div className="profile-setup-page__tags">
          {hobbies.map(hobby => (
            <div
              key={hobby}
              className={`profile-setup-page__tag ${selectedHobbies.includes(hobby) ? 'selected' : ''}`}
              onClick={() => toggleSelection(hobby, setSelectedHobbies, selectedHobbies)}
            >
              {hobby}
            </div>
          ))}
        </div>
      </div>

      <div className="profile-setup-page__section">
        <h2>スキル</h2>
        <div className="profile-setup-page__tags">
          {skills.map(skill => (
            <div
              key={skill}
              className={`profile-setup-page__tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
              onClick={() => toggleSelection(skill, setSelectedSkills, selectedSkills)}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div className="profile-setup-page__button-container">
        <button className="profile-setup-page__button" onClick={handleProfileSave}>
          保存する
        </button>
      </div>
    </div>
  );
}

export default ProfileSetup;
