import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Signup from './Signup.jsx';
import ProfileSetup from './ProfileSetup.jsx';
import DeepQuestions from './DeepQuestions.jsx';
import Home from './Home.jsx';
import MatchedProfile from './MatchedProfile';
import Hint from './Hint';
import Login from './Login.jsx';
import Feedback from './Feedback.jsx';
import MatchedList from './MatchedList.jsx';
import BMProfile from './BMProfile.jsx';
import Footer from './Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));

const hintsData = [
  "最近観ている映画や音楽の話をしてみましょう。",
  "本やスポーツに関するトピックも面白いです。",
  "ランニングやサイクリングの話も盛り上がります。",
  "技術的な話題に関して質問してみると良いでしょう。",
  "データ解析やクラウドコンピューティングについても興味がありそうです。"
];

// Footerを条件付きで表示
function App() {
  const location = useLocation();
  const noFooterRoutes = ['/signup', '/login', '/']; // signup と login のページでフッターを非表示にする

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/deep-questions" element={<DeepQuestions />} />
        <Route path="/home" element={<Home />} />
        <Route path="/matched-profile" element={<MatchedProfile name="山田太郎" department="技術部" discord="yamada#1234" hobbies={["音楽", "映画鑑賞"]} skills={["プログラミング", "データ解析"]} />} />
        <Route path="/hint" element={<Hint hints={hintsData} name="山田太郎" department="技術部" discord="yamada#1234" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/matched-list" element={<MatchedList />} />
        <Route path="/bm-profile" element={<BMProfile />} />
        <Route path="*" element={<Signup />} />
      </Routes>
      {!noFooterRoutes.includes(location.pathname) && <Footer />} {/* フッターを特定のページで非表示 */}
    </>
  );
}

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
