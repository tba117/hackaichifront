import React, { useState } from 'react';
import './Feedback.scss'; // スタイルシートをインポート
import Footer from './Footer'; // フッターをインポート

function Feedback() {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSaveFeedback = () => {
    alert('フィードバックが記録されました');
    // フィードバックを保存する処理（仮）
  };

  return (
    <div className="feedback-container">
      <h1 className="feedback-title">hoghogeさんの印象・性格等をまとめておきましょう</h1>
      <p className="feedback-subtitle">
        あなたがhogehogeさんをより深く理解する手助けとなり、同時にhogehogeさん自身の自己理解にも役立ちます
      </p>
      <div className="feedback-box">
        <label className="feedback-label">hogehogeさんはどんな人ですか？</label>
        <textarea 
          className="feedback-input" 
          placeholder="ここに記入してください..." 
          value={feedback}
          onChange={handleFeedbackChange}
        />
      </div>
      <button className="feedback-button" onClick={handleSaveFeedback}>
        記録する
      </button>
      <Footer /> {/* フッターを追加 */}
    </div>
  );
}

export default Feedback;
