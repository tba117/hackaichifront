import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss'; // スタイルの読み込み

function Footer() {
  return (
    <div className="footer">
      {/* マッチング画面 */}
      <Link to="/matched-profile" className="footer-item">
        <i className="fas fa-handshake"></i> {/* ハートアイコンを握手アイコンに変更 */}
      </Link>

      {/* 感想入力画面 */}
      <Link to="/feedback" className="footer-item">
        <i className="fas fa-edit"></i> {/* 感想入力：ペンアイコン */}
      </Link>

      {/* 友達一覧画面 */}
      <Link to="/matched-list" className="footer-item">
        <i className="fas fa-users"></i> {/* 友達一覧：ユーザーアイコン */}
      </Link>

      {/* 自身のプロフィール画面 */}
      <Link to="/home" className="footer-item">
        <i className="fas fa-user"></i> {/* 自身のプロフィール：ユーザーアイコン */}
      </Link>
    </div>
  );
}

export default Footer;
