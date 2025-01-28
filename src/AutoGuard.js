import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得
    const id = localStorage.getItem('id');
    if (!token || !id) {
        // トークンが存在しない場合、ログイン画面にリダイレクト
        console.log('トークン・id無')
        return <Navigate to="/login" />;
    }

    console.log('トークン有')

    // トークンが存在する場合、子コンポーネントを表示
    return children;
};

export default AuthGuard;
