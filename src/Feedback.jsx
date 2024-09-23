import React, { useState, useEffect } from 'react';
import './Feedback.scss'; // スタイルシートをインポート
import Footer from './Footer'; // フッターをインポート
import axios from 'axios'; // axiosをインポート

function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [matchedUser, setMatchedUser] = useState(null); // マッチング相手の情報
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ロード状態の管理

  // ローカルストレージからマッチングしたユーザーの情報を取得
  useEffect(() => {
    const storedMatchedUser = localStorage.getItem('matchedUser');
    if (storedMatchedUser) {
      setMatchedUser(JSON.parse(storedMatchedUser));
    }
  }, []);

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSaveFeedback = async () => {
    if (!feedback) {
      alert('フィードバックを入力してください。');
      return;
    }

    setLoading(true); // ロード中に切り替える
    setError(''); // エラーをクリア

    try {
      const user_id = matchedUser ? matchedUser.user_id : null; // マッチング相手のIDを取得
      const token = localStorage.getItem('token'); // 認証トークンを取得
      console.log(token)

      if (!user_id) {
        throw new Error('マッチング相手の情報が見つかりません。');
      }

      // フィードバックをバックエンドに送信
      const response = await axios.post(
        `https://aichihack-back-153bffff1dd9.herokuapp.com/app/update_profile_with_feedback/${user_id}/`,
        { feedback },
        {
          headers: {
            "Authorization": `Token ${token}`, // トークンをヘッダーに追加
          },
        }
      );

      console.log('プロフィール更新成功:', response.data);
      setFeedback(''); // フィードバックをクリア
    } catch (error) {
      console.error('プロフィール更新に失敗しました:', error);
      setError('プロフィール更新に失敗しました。');
    } finally {
      setLoading(false); // ロード完了
    }
  };

  return (
    <div className="feedback-page">
      <h1 className="feedback-page__title">
        {matchedUser ? `${matchedUser.username}さんの印象・性格等をまとめておきましょう` : 'フィードバック'}
      </h1>
      <p className="feedback-page__subtitle">
        {matchedUser 
          ? `あなたが${matchedUser.username}さんをより深く理解する手助けとなり、同時に${matchedUser.username}さん自身の自己理解にも役立ちます`
          : '感想を書いてください'}
      </p>

      <div className="feedback-page__box">
      <label className="feedback-page__label">{matchedUser ? `${matchedUser.username}さんはどんな人ですか？` : 'フィードバックを入力してください'}</label>
        <textarea 
          className="feedback-page__input" 
          placeholder="ここに記入してください..." 
          value={feedback}
          onChange={handleFeedbackChange}
        />
      </div>

      {/* エラーメッセージ表示 */}
      {error && <p className="error-message">{error}</p>}

      {/* ロード中のボタン表示 */}
      <button className="feedback-page__button" onClick={handleSaveFeedback} disabled={loading}>
        {loading ? '記録中...' : '記録する'}
      </button>

      <Footer /> {/* フッターを追加 */}
    </div>
  );
}

export default Feedback;
