import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Signup.jsx';
import ProfileSetup from './ProfileSetup.jsx';
import DeepQuestions from './DeepQuestions.jsx';
import Home from './Home.jsx'; // ホーム画面をインポート
import MatchedProfile from './MatchedProfile'; // マッチング画面のインポート
import Hint from './Hint'; // ヒント画面のインポート
import Login from './Login.jsx'; // ログイン画面をインポート
import Feedback from './Feedback.jsx'; // フィードバック画面のインポート
import Footer from './Footer'; // フッターをインポート

const root = ReactDOM.createRoot(document.getElementById('root'));

const hintsData = [
  "最近観ている映画や音楽の話をしてみましょう。",
  "本やスポーツに関するトピックも面白いです。",
  "ランニングやサイクリングの話も盛り上がります。",
  "技術的な話題に関して質問してみると良いでしょう。",
  "データ解析やクラウドコンピューティングについても興味がありそうです。"
];

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/deep-questions" element={<DeepQuestions />} />
        <Route path="/home" element={<Home />} />
        <Route path="/matched-profile" element={<MatchedProfile name="山田太郎" department="技術部" discord="yamada#1234" hobbies={["音楽", "映画鑑賞"]} skills={["プログラミング", "データ解析"]} />} />
        <Route path="/hint" element={<Hint hints={hintsData} name="山田太郎" department="技術部" discord="yamada#1234" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feedback" element={<Feedback />} /> {/* フィードバック画面のルートを追加 */}
        <Route path="*" element={<Signup />} />
      </Routes>
      <Footer /> {/* フッターを全ページに表示 */}
    </Router>
  </React.StrictMode>
);
