import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss'; // スタイルの読み込み

function Footer() {
  return (
    <div className="footer">
      <Link to="/profile-setup" className="footer-item">
        <i className="fas fa-user"></i>
        <p>プロフィール設定</p>
      </Link>
      <Link to="/deep-questions" className="footer-item">
        <i className="fas fa-question-circle"></i>
        <p>質問に答える</p>
      </Link>
      <Link to="/matched-profile" className="footer-item">
        <i className="fas fa-heart"></i>
        <p>マッチング</p>
      </Link>
      <Link to="/logout" className="footer-item">
        <i className="fas fa-sign-out-alt"></i>
        <p>ログアウト</p>
      </Link>
    </div>
  );
}

export default Footer;
