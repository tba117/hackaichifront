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
import Chatlist from './Chatlist.jsx'
import Chatroom from './Chatroom.jsx'
import AuthGuard from './AutoGuard.js';

import { UserProvider } from './UserContext'; // UserProvider をインポート

const root = ReactDOM.createRoot(document.getElementById('root'));

const hintsData = [
  "最近観ている映画や音楽の話をしてみましょう。",
  "本やスポーツに関するトピックも面白いです。",
  "ランニングやサイクリングの話も盛り上がります。",
  "技術的な話題に関して質問してみると良いでしょう。",
  "データ解析やクラウドコンピューティングについても興味がありそうです。"
];


function App() {
  const location = useLocation();
  const noFooterRoutes = ['/signup', '/login', '/']; // signup と login のページでフッターを非表示にする

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 保護されたルート */}
        <Route
          path="/profile-setup"
          element={
            <AuthGuard>
              <ProfileSetup />
            </AuthGuard>
          }
        />
        <Route
          path="/deep-questions"
          element={
            <AuthGuard>
              <DeepQuestions />
            </AuthGuard>
          }
        />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/matched-profile"
          element={
            <AuthGuard>
              <MatchedProfile />
            </AuthGuard>
          }
        />
        <Route
          path="/hint"
          element={
            <AuthGuard>
              <Hint hints={hintsData} />
            </AuthGuard>
          }
        />
        <Route
          path="/chatlist"
          element={
            <AuthGuard>
              <Chatlist />
            </AuthGuard>
          }
        />
        <Route
          path="/chatroom"
          element={
            <AuthGuard>
              <Chatroom />
            </AuthGuard>
          }
        />
        {/* その他のルート */}
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
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  </React.StrictMode>
);
